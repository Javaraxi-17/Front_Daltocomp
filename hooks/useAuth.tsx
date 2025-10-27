import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isNewUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearNewUserFlag: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@daltocomp_token';
const USER_KEY = '@daltocomp_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  const isAuthenticated = !!user && !!token;

  // Cargar datos de autenticación al iniciar
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Configurar token en el servicio API cuando cambie
  useEffect(() => {
    apiService.setToken(token);
  }, [token]);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuth = async (newToken: string, newUser: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, newToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
      ]);
    } catch (error) {
      console.error('Error storing auth:', error);
    }
  };

  const clearAuth = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('🔐 Iniciando login...');
      
      const response = await apiService.login({ email, password });
      console.log('✅ Login exitoso, configurando token...');
      
      // Configurar token en el servicio API ANTES de hacer otras llamadas
      apiService.setToken(response.idToken);
      
      // Obtener datos del usuario
      console.log('👤 Obteniendo datos del usuario...');
      const userData = await apiService.getCurrentUser();
      console.log('✅ Datos del usuario obtenidos:', userData);
      
      // Configurar estado de autenticación
      setToken(response.idToken);
      setUser(userData);
      setIsNewUser(false); // No es usuario nuevo en login
      await storeAuth(response.idToken, userData);
      
      console.log('🎉 Login completado exitosamente');
      // NO navegar automáticamente aquí - dejar que las pantallas manejen la navegación
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Limpiar estado de autenticación en caso de error
      setToken(null);
      setUser(null);
      setIsNewUser(false);
      
      // Preservar el error con su código para que las pantallas puedan manejarlo
      const authError = new Error(error.message || 'Error de autenticación');
      (authError as any).code = error.code;
      (authError as any).status = error.status;
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('📝 Iniciando registro...');
      
      // Registrar usuario
      const registerResponse = await apiService.register({ name, email, username, password });
      console.log('✅ Usuario registrado:', registerResponse);
      
      // Esperar un momento para que Firebase procese el usuario
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hacer login para obtener el token
      console.log('🔐 Iniciando login...');
      const loginResponse = await apiService.login({ email, password });
      console.log('✅ Login exitoso, configurando token...');
      
      // Configurar token en el servicio API
      apiService.setToken(loginResponse.idToken);
      
      // Obtener datos completos del usuario
      console.log('👤 Obteniendo datos del usuario...');
      const userData = await apiService.getCurrentUser();
      console.log('✅ Datos del usuario obtenidos:', userData);
      
      // Configurar autenticación
      setToken(loginResponse.idToken);
      setUser(userData);
      setIsNewUser(true); // Es usuario nuevo en registro
      await storeAuth(loginResponse.idToken, userData);
      
      console.log('🎉 Registro completado exitosamente');
      // NO navegar automáticamente aquí - dejar que las pantallas manejen la navegación
      
    } catch (error: any) {
      console.error('❌ Register error:', error);
      
      // Limpiar estado de autenticación en caso de error
      setToken(null);
      setUser(null);
      setIsNewUser(false);
      
      // Preservar el error con su código para que las pantallas puedan manejarlo
      const authError = new Error(error.message || 'Error de registro');
      (authError as any).code = error.code;
      (authError as any).status = error.status;
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user?.uid) {
        await apiService.logout(user.uid);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setIsNewUser(false);
      await clearAuth();
    }
  };

  const refreshAuth = async () => {
    try {
      if (!token) {
        console.log('⚠️ No hay token para refrescar');
        return;
      }
      
      console.log('🔄 Refrescando autenticación...');
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      console.log('✅ Autenticación refrescada exitosamente');
    } catch (error: any) {
      console.error('❌ Refresh auth error:', error);
      
      // Si es un error de token expirado o inválido, hacer logout
      if (error.code === 'TOKEN_EXPIRED' || error.code === 'INVALID_TOKEN' || error.status === 401) {
        console.log('🔐 Token expirado, haciendo logout...');
        await logout();
      }
    }
  };

  const clearNewUserFlag = () => {
    setIsNewUser(false);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isNewUser,
    login,
    register,
    logout,
    refreshAuth,
    clearNewUserFlag,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

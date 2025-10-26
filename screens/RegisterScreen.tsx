import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';
import { useAuth } from '../hooks/useAuth';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!/\d/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial';
    }
    
    return null;
  };

  const onRegister = useCallback(async () => {
    if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'El usuario debe tener al menos 3 caracteres');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    // Validar contraseña
    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('Error de contraseña', passwordError);
      return;
    }

    try {
      await register(name.trim(), email.trim(), username.trim(), password);
      // Solo navegar si el registro fue exitoso
      navigation.navigate('D15Test' as never);
    } catch (error: any) {
      // Manejar errores específicos del backend
      let errorMessage = 'No se pudo crear la cuenta';
      
      if (error.code === 'EMAIL_EXISTS') {
        errorMessage = 'El correo electrónico ya está registrado';
      } else if (error.code === 'USERNAME_EXISTS') {
        errorMessage = 'El nombre de usuario ya existe';
      } else if (error.code === 'VALIDATION_ERROR') {
        errorMessage = error.message || 'Datos de registro inválidos';
      } else if (error.code === 'WEAK_PASSWORD') {
        errorMessage = 'La contraseña es muy débil';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet';
      } else if (error.code === 'SERVICE_UNAVAILABLE') {
        errorMessage = 'El servicio no está disponible. Intenta más tarde';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error de registro', errorMessage);
      // NO navegar en caso de error - quedarse en la pantalla de registro
    }
  }, [name, email, username, password, register, navigation]);

  const backToLogin = useCallback(() => {
    navigation.navigate('Login' as never);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.heading, { color: colors.text }]}>Crear cuenta</Text>

      <View style={[styles.form, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.mutedText }]}>Nombre</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Tu nombre"
          placeholderTextColor={colors.mutedText}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={[styles.label, { marginTop: 12, color: colors.mutedText }]}>Correo</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="tu@email.com"
          placeholderTextColor={colors.mutedText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[styles.label, { marginTop: 12, color: colors.mutedText }]}>Usuario</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="usuario"
          placeholderTextColor={colors.mutedText}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { marginTop: 12, color: colors.mutedText }]}>Contraseña</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="••••••••"
          placeholderTextColor={colors.mutedText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {/* Indicadores de requisitos de contraseña */}
        <View style={styles.passwordRequirements}>
          <Text style={[styles.requirementText, { 
            color: password.length >= 8 ? colors.success || '#4CAF50' : colors.mutedText 
          }]}>
            ✓ Al menos 8 caracteres
          </Text>
          <Text style={[styles.requirementText, { 
            color: /\d/.test(password) ? colors.success || '#4CAF50' : colors.mutedText 
          }]}>
            ✓ Al menos un número
          </Text>
          <Text style={[styles.requirementText, { 
            color: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? colors.success || '#4CAF50' : colors.mutedText 
          }]}>
            ✓ Al menos un carácter especial
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: isLoading ? 0.6 : 1 }]} 
          onPress={onRegister}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Creando cuenta...' : 'Registrarme'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footerText, { color: colors.mutedText }]}> 
        ¿Ya tienes cuenta?{' '}
        <Text style={[styles.link, { color: colors.primary }]} onPress={backToLogin}>Inicia sesión</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  form: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 16,
  },
  link: {
    fontWeight: '600',
  },
  passwordRequirements: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  requirementText: {
    fontSize: 12,
    marginTop: 2,
  },
});
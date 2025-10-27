import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';
import { useAuth } from '../hooks/useAuth';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isDark, toggleTheme, colors } = useTheme();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;
  
  // Animaciones para el contenido
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleMenu = useCallback(() => {
    const toValue = menuOpen ? 0 : 1;
    Animated.timing(menuAnim, {
      toValue,
      duration: 180,
      useNativeDriver: true,
    }).start();
    setMenuOpen(!menuOpen);
  }, [menuOpen, menuAnim]);

  // Logo no debe navegar más — solo es decorativo
  const onLogoPress = useCallback(() => {}, []);

  const onProfile = useCallback(() => {
    // Cerrar menú y navegar a la pantalla Profile
    setMenuOpen(false);
    navigation.navigate('Profile' as never);
  }, [navigation]);

  const onToggleTheme = useCallback(() => {
    // Alterna el tema global y cierra el menú
    toggleTheme();
    setMenuOpen(false);
  }, [toggleTheme]);

  const onLearnMore = useCallback(() => {
    navigation.navigate('Education' as never);
  }, [navigation]);

  const onLogout = useCallback(async () => {
    // Preguntar confirmación y luego hacer logout real
    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            setMenuOpen(false);
            await logout();
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' as never }] });
          } catch (error) {
            Alert.alert('Error', 'No se pudo cerrar la sesión');
          }
        },
      },
    ]);
  }, [logout, navigation]);

  const menuTranslate = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });
  const menuOpacity = menuAnim;

  return (
    <TouchableWithoutFeedback onPress={() => menuOpen && setMenuOpen(false)}>
      <View style={styles.container}>
        {/* Fondo moderno con gradiente */}
        <LinearGradient
          colors={isDark 
            ? ['#0f0f23', '#1a1a2e', '#16213e'] 
            : ['#667eea', '#764ba2', '#f093fb']
          }
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Patrón decorativo */}
        <View style={styles.decorativePattern}>
          <View style={[styles.circle, styles.circle1, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)' }]} />
          <View style={[styles.circle, styles.circle2, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)' }]} />
          <View style={[styles.circle, styles.circle3, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)' }]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.brand} onPress={onLogoPress} activeOpacity={0.9}>
            <View style={[styles.logo, { backgroundColor: isDark ? '#1f2937' : '#eef2ff' }]}> 
              <Text style={[styles.logoText, { color: isDark ? '#a5b4fc' : '#4338ca' }]}>DC</Text>
            </View>
            <Text style={[styles.brandText, { color: '#ffffff' }]}>daltocomp</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.menuButtonText, { color: '#ffffff' }]}>⋯</Text>
          </TouchableOpacity>

          {menuOpen && (
            <Animated.View
              style={[
                styles.menu,
                { 
                  opacity: menuOpacity, 
                  transform: [{ translateY: menuTranslate }], 
                  backgroundColor: isDark ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                },
              ]}
            >
              <TouchableOpacity style={styles.menuItemPress} onPress={onProfile} activeOpacity={0.7}>
                <Text style={[styles.menuItemText, { color: isDark ? '#ffffff' : '#000000' }]}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItemPress} onPress={onToggleTheme} activeOpacity={0.7}>
                <View style={styles.menuItemRowInner}>
                  <Text style={[styles.menuItemText, { color: isDark ? '#ffffff' : '#000000' }]}>Modo oscuro</Text>
                  <Switch
                    value={isDark}
                    onValueChange={onToggleTheme}
                    thumbColor={isDark ? '#ffffff' : undefined}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItemPress} onPress={onLogout} activeOpacity={0.7}>
                <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Cerrar sesión</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Content */}
        <Animated.View 
          style={[
            styles.content, 
            { 
              maxWidth: 560, 
              alignSelf: 'center',
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <Text style={[styles.welcome, { color: '#ffffff' }]}>¡Conoce lo que es el daltonismo y si posees algun tipo del mismo!</Text>
          <Text style={[styles.description, { color: 'rgba(255,255,255,0.8)' }]}>Explora recursos y pruebas para identificar diferentes tipos de daltonismo.</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.testButton, { backgroundColor: '#ffffff' }]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('DaltonismTest' as never)}
            >
              <Text style={[styles.testButtonText, { color: colors.primary }]}>Ir a pruebas de daltonismo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.learnButton, { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: '#ffffff' }]}
              activeOpacity={0.9}
              onPress={onLearnMore}
            >
              <Text style={[styles.learnButtonText, { color: '#ffffff' }]}>Aprende más sobre el daltonismo</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Cámara FAB abre introducción de cámara */}
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} activeOpacity={0.8} onPress={() => navigation.navigate('ColorDetectIntro' as never)}>
          <Text style={styles.fabIcon}>📷</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    right: 50,
  },
  header: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    elevation: 3,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'lowercase',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 22,
    fontWeight: '700',
  },
  menu: {
    position: 'absolute',
    top: 64,
    right: 16,
    minWidth: 200,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItemPress: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuItemRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemRowInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  fabIcon: {
    fontSize: 26,
    color: '#ffffff',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  testButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  learnButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  learnButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
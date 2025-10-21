import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isDark, toggleTheme, colors } = useTheme();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

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
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.brand} onPress={onLogoPress} activeOpacity={0.9}>
            <View style={[styles.logo, { backgroundColor: isDark ? '#1f2937' : '#eef2ff' }]}> 
              <Text style={[styles.logoText, { color: isDark ? '#a5b4fc' : '#4338ca' }]}>DC</Text>
            </View>
            <Text style={[styles.brandText, { color: colors.text }]}>daltocomp</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.menuButtonText, { color: colors.text }]}>⋯</Text>
          </TouchableOpacity>

          {menuOpen && (
            <Animated.View
              style={[
                styles.menu,
                { opacity: menuOpacity, transform: [{ translateY: menuTranslate }], backgroundColor: colors.card },
              ]}
            >
              <TouchableOpacity style={styles.menuItemPress} onPress={onProfile} activeOpacity={0.7}>
                <Text style={[styles.menuItemText, { color: colors.text }]}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItemPress} onPress={onToggleTheme} activeOpacity={0.7}>
                <View style={styles.menuItemRowInner}>
                  <Text style={[styles.menuItemText, { color: colors.text }]}>Modo oscuro</Text>
                  <Switch
                    value={isDark}
                    onValueChange={onToggleTheme}
                    thumbColor={isDark ? '#ffffff' : undefined}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItemPress} onPress={onLogout} activeOpacity={0.7}>
                <Text style={[styles.menuItemText, { color: colors.danger }]}>Cerrar sesión</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Content */}
        <View style={[styles.content, { maxWidth: 560, alignSelf: 'center' }]}>
          <Text style={[styles.welcome, { color: colors.text }]}>¡Conoce lo que es el daltonismo y si posees algun tipo del mismo!</Text>
          <Text style={[styles.description, { color: colors.mutedText }]}>Explora recursos y pruebas para identificar diferentes tipos de daltonismo.</Text>
          
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('DaltonismTest' as never)}
          >
            <Text style={styles.testButtonText}>Ir a pruebas de daltonismo</Text>
          </TouchableOpacity>
        </View>

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
    minWidth: 180,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItemPress: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
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
  testButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#007bff',
  },
  testButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
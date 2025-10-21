import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=2070&q=80' }}
      resizeMode="cover"
      style={[styles.bg, { backgroundColor: isDark ? '#0b0b0b' : '#111' }]}
    >
      <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }]} />

      <View style={styles.contentWrapper}>
        <View />
        <View style={styles.centerContent}>
          <Text style={[styles.title, { color: '#fff' }]}>Bienvenido a Daltocomp</Text>
          <Text style={[styles.subtitle, { color: '#f3f4f6' }]}>Conoce, detecta y entiende el daltonismo.</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Register' as never)}
          >
            <Text style={styles.primaryText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: '#ffffff55' }]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.secondaryText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  centerContent: { alignItems: 'center', marginTop: 40 },
  title: { fontSize: 28, fontWeight: '900', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginTop: 8 },
  actions: {},
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  secondaryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
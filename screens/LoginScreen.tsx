import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { login, isLoading } = useAuth();
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = useCallback(async () => {
    if (!emailOrUser.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await login(emailOrUser.trim(), password);
      navigation.navigate('Home' as never);
    } catch (error: any) {
      Alert.alert('Error de inicio de sesión', error.message || 'Credenciales incorrectas');
    }
  }, [emailOrUser, password, login, navigation]);

  const goToRegister = useCallback(() => {
    navigation.navigate('Register' as never);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.heading, { color: colors.text }]}>Iniciar sesión</Text>

      <View style={[styles.form, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.mutedText }]}>Correo o Usuario</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="tu@email.com o usuario"
          placeholderTextColor={colors.mutedText}
          autoCapitalize="none"
          value={emailOrUser}
          onChangeText={setEmailOrUser}
          keyboardType="email-address"
        />

        <Text style={[styles.label, { marginTop: 12, color: colors.mutedText }]}>Contraseña</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="••••••••"
          placeholderTextColor={colors.mutedText}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: isLoading ? 0.6 : 1 }]} 
          onPress={onLogin}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footerText, { color: colors.mutedText }]}> 
        ¿Eres nuevo?{' '}
        <Text style={[styles.link, { color: colors.primary }]} onPress={goToRegister}>
          Regístrate
        </Text>
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
    maxWidth: 420,
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
});
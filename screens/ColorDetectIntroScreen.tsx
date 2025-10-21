import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';

export default function ColorDetectIntroScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.content, { maxWidth: 560, alignSelf: 'center' }]}>
        <Text style={[styles.title, { color: colors.text }]}>Bienvenido a la herramienta de detección de colores</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>Esta herramienta utiliza la cámara de tu dispositivo para ayudarte a identificar y distinguir colores en tiempo real. Te pediremos permiso para usar la cámara.</Text>

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} activeOpacity={0.9} onPress={() => navigation.navigate('CameraTool' as never)}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
          <Text style={[styles.secondaryButtonText, { color: colors.mutedText }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingVertical: 18, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 22 },
  primaryButton: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12 },
  primaryButtonText: { color: '#fff', fontWeight: '800', textAlign: 'center' },
  secondaryButton: { marginTop: 10, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, alignSelf: 'center' },
  secondaryButtonText: { fontWeight: '700' },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';

export default function DaltonismTestScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.index, { color: colors.text }]}>daltocomp</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Bienvenido a la sección de detección de daltonismo</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>En esta sección podrás realizar pruebas rápidas para identificar si presentas algún tipo de daltonismo.</Text>

        <TouchableOpacity style={[styles.startButton, { backgroundColor: colors.primary }]} activeOpacity={0.8} onPress={() => navigation.navigate('D15Test' as never)}>
          <Text style={styles.startButtonText}>Empezar prueba</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 18, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  backButton: { marginRight: 12 },
  backText: { fontSize: 22, fontWeight: '800' },
  index: { fontSize: 18, fontWeight: '800', marginLeft: 6 },
  content: { flex: 1, paddingHorizontal: 24, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 20 },
  startButton: { paddingVertical: 14, paddingHorizontal: 22, borderRadius: 12, marginTop: 8 },
  startButtonText: { color: '#fff', fontWeight: '800' },
});
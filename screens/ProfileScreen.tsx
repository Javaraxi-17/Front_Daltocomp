import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar sesión', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.navigate('Welcome' as never);
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mi Perfil</Text>
        {user && (
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: colors.mutedText }]}>{user.email}</Text>
            <Text style={[styles.userUsername, { color: colors.mutedText }]}>@{user.username}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]} activeOpacity={0.8} onPress={() => {}}>
          <Text style={[styles.optionText, { color: colors.text }]}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]} activeOpacity={0.8} onPress={() => {}}>
          <Text style={[styles.optionText, { color: colors.text }]}>Historial de pruebas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]} activeOpacity={0.8} onPress={() => {}}>
          <Text style={[styles.optionText, { color: colors.text }]}>Cambiar contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card }]} 
          activeOpacity={0.8} 
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: colors.danger }]}>Cerrar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.deleteButton, { backgroundColor: colors.background }]} activeOpacity={0.8} onPress={() => {}}>
          <Text style={[styles.deleteText, { color: colors.danger }]}>Eliminar cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 18, paddingHorizontal: 18 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  userInfo: { marginBottom: 8 },
  userName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  userEmail: { fontSize: 14, marginBottom: 2 },
  userUsername: { fontSize: 14 },
  content: { flex: 1, padding: 18 },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  optionText: { fontSize: 16, fontWeight: '700' },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: '700' },
  deleteButton: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff4d4f',
    alignItems: 'center',
  },
  deleteText: { fontSize: 16, fontWeight: '800' },
});
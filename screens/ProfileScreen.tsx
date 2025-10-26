import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user, logout, updateUser } = useAuth();
  
  // Estados para el modal de editar perfil
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Estados para eliminar cuenta
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estados para el modal de cambiar contraseña
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const handleEditProfile = () => {
    if (user) {
      setEditName(user.name);
      setEditUsername(user.username);
      setIsEditModalVisible(true);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim() || !editUsername.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (editUsername.length < 3) {
      Alert.alert('Error', 'El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    try {
      setIsUpdating(true);
      const updatedUser = await apiService.updateUser({
        name: editName.trim(),
        username: editUsername.trim()
      });
      
      // Actualizar el usuario en el contexto de autenticación
      updateUser(updatedUser);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setIsEditModalVisible(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar cuenta', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await apiService.deleteUser();
              await logout();
              navigation.navigate('Welcome' as never);
              Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente');
            } catch (error: any) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar la cuenta');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordModalVisible(true);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/.test(newPassword)) {
      Alert.alert('Error', 'La nueva contraseña debe contener al menos un número y un carácter especial');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return;
    }

    try {
      setIsChangingPassword(true);
      await apiService.changePassword(currentPassword, newPassword);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      setIsPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      Alert.alert('Error', error.message || 'No se pudo cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
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
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]} activeOpacity={0.8} onPress={handleEditProfile}>
          <Text style={[styles.optionText, { color: colors.text }]}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]} activeOpacity={0.8} onPress={() => {}}>
          <Text style={[styles.optionText, { color: colors.text }]}>Historial de pruebas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]} activeOpacity={0.8} onPress={handleChangePassword}>
          <Text style={[styles.optionText, { color: colors.text }]}>Cambiar contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card }]} 
          activeOpacity={0.8} 
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: colors.danger }]}>Cerrar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: colors.background }]} 
          activeOpacity={0.8} 
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator color={colors.danger} size="small" />
          ) : (
            <Text style={[styles.deleteText, { color: colors.danger }]}>Eliminar cuenta</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal para editar perfil */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Editar Perfil</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Nombre</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.inputBorder || '#ddd'
                }]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Ingresa tu nombre"
                placeholderTextColor={colors.mutedText}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Nombre de usuario</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.inputBorder || '#ddd'
                }]}
                value={editUsername}
                onChangeText={setEditUsername}
                placeholder="Ingresa tu nombre de usuario"
                placeholderTextColor={colors.mutedText}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.card }]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleUpdateProfile}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        visible={isPasswordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Cambiar Contraseña</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Contraseña actual</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.inputBorder || '#ddd'
                }]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Ingresa tu contraseña actual"
                placeholderTextColor={colors.mutedText}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Nueva contraseña</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.inputBorder || '#ddd'
                }]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Ingresa tu nueva contraseña"
                placeholderTextColor={colors.mutedText}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Confirmar nueva contraseña</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.inputBorder || '#ddd'
                }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirma tu nueva contraseña"
                placeholderTextColor={colors.mutedText}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.passwordRequirements}>
              <Text style={[styles.requirementText, { color: colors.mutedText }]}>
                • Mínimo 8 caracteres
              </Text>
              <Text style={[styles.requirementText, { color: colors.mutedText }]}>
                • Al menos un número
              </Text>
              <Text style={[styles.requirementText, { color: colors.mutedText }]}>
                • Al menos un carácter especial
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.card }]}
                onPress={() => setIsPasswordModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleUpdatePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Cambiar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    // backgroundColor se define dinámicamente
  },
  saveButton: {
    // backgroundColor se define dinámicamente
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  // Estilos para requisitos de contraseña
  passwordRequirements: {
    marginTop: 12,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
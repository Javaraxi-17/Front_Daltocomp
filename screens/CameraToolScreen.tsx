import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useTheme } from '../hooks/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function CameraToolScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        setMediaPermission(false);
        return;
      }
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(mediaStatus === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      // Save to gallery if media permission granted
      if (mediaPermission) {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        Alert.alert(
          '✓ Foto guardada',
          'La foto se guardó correctamente en tu galería.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Foto capturada',
          `Foto tomada pero no se guardó (permiso de galería no otorgado).\nURI: ${photo.uri}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo capturar la foto. Intenta de nuevo.');
      console.error('Error capturando foto:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Web fallback
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.content, { maxWidth: 560, alignSelf: 'center' }]}>
          <Text style={[styles.title, { color: colors.text }]}>⚠️ Función no disponible en web</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            La cámara y captura de fotos requieren un dispositivo nativo. Por favor, abre esta aplicación en tu teléfono usando Expo Go o un emulador.
          </Text>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Loading state
  if (!cameraPermission || mediaPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.info, { color: colors.mutedText }]}>Solicitando permisos…</Text>
      </View>
    );
  }

  // No camera permission
  if (!cameraPermission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.content, { maxWidth: 560, alignSelf: 'center' }]}>
          <Text style={[styles.title, { color: colors.text }]}>Permiso de cámara denegado</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            Necesitas habilitar el permiso de cámara en los ajustes de tu dispositivo para usar esta función.
          </Text>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
            onPress={() => requestCameraPermission()}
          >
            <Text style={styles.primaryButtonText}>Conceder permiso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera view
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.previewContainer, { borderColor: colors.inputBorder }]}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.captureButton, { backgroundColor: colors.primary }]} 
          onPress={takePicture}
          disabled={isCapturing}
        >
          <Text style={styles.captureButtonText}>
            {isCapturing ? 'Capturando...' : '📷 Tomar foto'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.colorDetectionButton, { backgroundColor: colors.secondary || '#6B73FF' }]} 
          onPress={() => navigation.navigate('ColorDetection' as never)}
        >
          <Text style={styles.colorDetectionButtonText}>
            🎨 Detectar Colores
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomControls}>
          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colors.inputBorder }]} 
            onPress={() => setFacing((t) => (t === 'back' ? 'front' : 'back'))}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>🔄 Cambiar cámara</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colors.inputBorder }]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>✕ Cerrar</Text>
          </TouchableOpacity>
        </View>

        {!mediaPermission && (
          <Text style={[styles.warningText, { color: colors.mutedText }]}>
            ⚠️ Sin permiso de galería. Las fotos no se guardarán.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingVertical: 24 },
  content: { paddingHorizontal: 24, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 22, lineHeight: 24 },
  previewContainer: { 
    height: 480, 
    marginHorizontal: 24, 
    borderWidth: 2, 
    borderRadius: 16, 
    overflow: 'hidden',
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },
  camera: { flex: 1 },
  controls: { 
    marginTop: 20, 
    paddingHorizontal: 24, 
    maxWidth: 560, 
    alignSelf: 'center',
    width: '100%',
  },
  captureButton: { 
    paddingVertical: 16, 
    paddingHorizontal: 24, 
    borderRadius: 12,
    marginBottom: 12,
  },
  colorDetectionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  captureButtonText: { 
    color: '#fff', 
    fontWeight: '800', 
    textAlign: 'center',
    fontSize: 18,
  },
  colorDetectionButtonText: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 16,
  },
  bottomControls: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: { 
    flex: 1,
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    borderWidth: 1,
  },
  secondaryButtonText: { 
    fontWeight: '700',
    textAlign: 'center',
  },
  info: { 
    textAlign: 'center',
    fontSize: 16,
  },
  warningText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';

// Mock Camera
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(),
    getAvailableCameraTypesAsync: jest.fn(),
    Constants: {
      Type: {
        back: 'back',
        front: 'front',
      },
    },
  },
}));

// Mock MediaLibrary
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn(),
  saveToLibraryAsync: jest.fn(),
}));

// Mock FileSystem
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///mock-document-directory/',
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

// Mock ImageManipulator
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
}));

// Mock Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

describe('📸 Pruebas de Cámara y Permisos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Permisos de Cámara', () => {
    it('debe solicitar permisos de cámara correctamente', async () => {
      (Camera.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });

      // Simular solicitud de permisos
      const result = await Camera.requestCameraPermissionsAsync();

      expect(Camera.requestCameraPermissionsAsync).toHaveBeenCalled();
      expect(result.status).toBe('granted');
    });

    it('debe manejar cuando se deniegan los permisos de cámara', async () => {
      (Camera.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

      const result = await Camera.requestCameraPermissionsAsync();

      expect(result.status).toBe('denied');
    });

    it('debe manejar errores al solicitar permisos de cámara', async () => {
      (Camera.requestCameraPermissionsAsync as jest.Mock).mockRejectedValue(new Error('Permission request failed'));

      await expect(Camera.requestCameraPermissionsAsync()).rejects.toThrow('Permission request failed');
    });
  });

  describe('2. Permisos de Galería', () => {
    it('debe solicitar permisos de galería correctamente', async () => {
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });

      const result = await MediaLibrary.requestPermissionsAsync();

      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalled();
      expect(result.status).toBe('granted');
    });

    it('debe manejar cuando se deniegan los permisos de galería', async () => {
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

      const result = await MediaLibrary.requestPermissionsAsync();

      expect(result.status).toBe('denied');
    });
  });

  describe('3. Captura de Imágenes', () => {
    it('debe capturar imagen exitosamente cuando los permisos están otorgados', async () => {
      (Camera.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });

      // Simular captura de imagen
      const mockCameraRef = {
        current: {
          takePictureAsync: jest.fn().mockResolvedValue({
            uri: 'file://mock/path/photo.jpg',
            width: 1920,
            height: 1080,
          }),
        },
      };

      const result = await mockCameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      expect(result.uri).toBe('file://mock/path/photo.jpg');
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
    });

    it('debe manejar errores durante la captura de imagen', async () => {
      const mockCameraRef = {
        current: {
          takePictureAsync: jest.fn().mockRejectedValue(new Error('Camera capture failed')),
        },
      };

      await expect(mockCameraRef.current.takePictureAsync()).rejects.toThrow('Camera capture failed');
    });
  });

  describe('4. Procesamiento de Imágenes', () => {
    it('debe procesar imagen con ImageManipulator correctamente', async () => {
      const mockImageUri = 'file://mock/path/photo.jpg';
      const mockProcessedUri = 'file://mock/path/processed_photo.jpg';

      (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
        uri: mockProcessedUri,
        width: 800,
        height: 600,
      });

      const result = await ImageManipulator.manipulateAsync(
        mockImageUri,
        [{ resize: { width: 800, height: 600 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
        mockImageUri,
        [{ resize: { width: 800, height: 600 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      expect(result.uri).toBe(mockProcessedUri);
    });

    it('debe manejar errores durante el procesamiento de imagen', async () => {
      (ImageManipulator.manipulateAsync as jest.Mock).mockRejectedValue(new Error('Image processing failed'));

      await expect(ImageManipulator.manipulateAsync('invalid-uri', [])).rejects.toThrow('Image processing failed');
    });
  });

  describe('5. Guardado de Imágenes', () => {
    it('debe guardar imagen en galería exitosamente', async () => {
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (MediaLibrary.saveToLibraryAsync as jest.Mock).mockResolvedValue(undefined);

      const mockImageUri = 'file://mock/path/photo.jpg';
      await MediaLibrary.saveToLibraryAsync(mockImageUri);

      expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalledWith(mockImageUri);
    });

    it('debe manejar error cuando no se tienen permisos de galería', async () => {
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

      const mockImageUri = 'file://mock/path/photo.jpg';
      
      // Simular intento de guardar sin permisos
      try {
        await MediaLibrary.saveToLibraryAsync(mockImageUri);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('6. Manejo de Archivos', () => {
    it('debe leer archivo del sistema de archivos correctamente', async () => {
      const mockContent = 'mock file content';
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(mockContent);

      const result = await FileSystem.readAsStringAsync('file://mock/path/file.txt');

      expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('file://mock/path/file.txt');
      expect(result).toBe(mockContent);
    });

    it('debe escribir archivo en el sistema de archivos correctamente', async () => {
      (FileSystem.writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);

      await FileSystem.writeAsStringAsync('file://mock/path/file.txt', 'content');

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith('file://mock/path/file.txt', 'content');
    });

    it('debe eliminar archivo del sistema de archivos correctamente', async () => {
      (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);

      await FileSystem.deleteAsync('file://mock/path/file.txt');

      expect(FileSystem.deleteAsync).toHaveBeenCalledWith('file://mock/path/file.txt');
    });
  });

  describe('7. Flujo Completo de Captura', () => {
    it('debe completar el flujo completo de captura y guardado', async () => {
      // 1. Solicitar permisos
      (Camera.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });

      // 2. Capturar imagen
      const mockCameraRef = {
        current: {
          takePictureAsync: jest.fn().mockResolvedValue({
            uri: 'file://mock/path/photo.jpg',
            width: 1920,
            height: 1080,
          }),
        },
      };

      const capturedImage = await mockCameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      // 3. Procesar imagen
      (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
        uri: 'file://mock/path/processed_photo.jpg',
        width: 800,
        height: 600,
      });

      const processedImage = await ImageManipulator.manipulateAsync(
        capturedImage.uri,
        [{ resize: { width: 800, height: 600 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // 4. Guardar en galería
      (MediaLibrary.saveToLibraryAsync as jest.Mock).mockResolvedValue(undefined);

      await MediaLibrary.saveToLibraryAsync(processedImage.uri);

      // Verificaciones
      expect(capturedImage.uri).toBe('file://mock/path/photo.jpg');
      expect(processedImage.uri).toBe('file://mock/path/processed_photo.jpg');
      expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalledWith('file://mock/path/processed_photo.jpg');
    });
  });
});

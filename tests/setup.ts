import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';

// Mock React Native modules
jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  return Object.setPrototypeOf(
    {
      ...ReactNative,
      NativeModules: {
        ...ReactNative.NativeModules,
        // Mock any specific native modules if needed
      },
      // Mock Alert for easier testing
      Alert: {
        alert: jest.fn(),
      },
    },
    ReactNative
  );
});

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock expo-camera
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    getAvailableCameraTypesAsync: jest.fn(() => Promise.resolve(['front', 'back'])),
    Constants: {
      Type: {
        back: 'back',
        front: 'front',
      },
    },
  },
}));

// Mock expo-media-library
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  saveToLibraryAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///mock-document-directory/',
  readAsStringAsync: jest.fn(() => Promise.resolve('mock-file-content')),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  deleteAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo-image-manipulator
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(() => Promise.resolve({ uri: 'file:///mock-manipulated-image.jpg' })),
  SaveFormat: {
    JPEG: 'jpeg',
    PNG: 'png',
  },
}));

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  })),
  addEventListener: jest.fn(),
}));

// Mock useTheme hook
jest.mock('../hooks/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff',
      surface: '#f0f0f0',
      text: '#333',
      mutedText: '#666',
      primary: '#007bff',
      danger: '#dc3545',
      card: '#ffffff',
      inputBorder: '#ccc',
    },
    isDarkMode: false,
    toggleTheme: jest.fn(),
  }),
}));

// Mock useAuth hook
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid', name: 'Test User', email: 'test@example.com', username: 'testuser' },
    token: 'test-token',
    isLoading: false,
    isAuthenticated: true,
    isNewUser: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshAuth: jest.fn(),
    clearNewUserFlag: jest.fn(),
    updateUser: jest.fn(),
  }),
}));

// Mock apiService
jest.mock('../services/api', () => ({
  apiService: {
    setToken: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    changePassword: jest.fn(),
    healthCheck: jest.fn(),
    // Mock para análisis de IA
    analyzeColorBlindness: jest.fn(),
    processImageWithAI: jest.fn(),
    getColorAnalysis: jest.fn(),
  },
}));
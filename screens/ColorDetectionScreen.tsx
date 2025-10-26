import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Alert, 
  Image, 
  Dimensions,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../hooks/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { colorDetectionService, ColorDetectionResult } from '../services/colorDetection';
import { advancedColorDetectionService, AdvancedColorResult } from '../services/advancedColorDetection';
import { googleAIService, ColorRecommendation } from '../services/googleAIService';
import { colorDetectionWithBackendService } from '../services/colorDetectionWithBackend';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ColorDetectionScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [colorResult, setColorResult] = useState<ColorDetectionResult | null>(null);
  const [useAdvancedDetection, setUseAdvancedDetection] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<ColorRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [detectionId, setDetectionId] = useState<string | null>(null);
  const [recommendationId, setRecommendationId] = useState<string | null>(null);
  const [isSavingToBackend, setIsSavingToBackend] = useState(false);
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

      if (photo) {
        setCapturedImage(photo.uri);
        
        // Auto-analizar la imagen
        await analyzeImage(photo.uri);

        // Save to gallery if media permission granted
        if (mediaPermission) {
          await MediaLibrary.createAssetAsync(photo.uri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo capturar la foto. Intenta de nuevo.');
      console.error('Error capturando foto:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    try {
      setIsAnalyzing(true);
      setIsSavingToBackend(true);
      console.log('🔍 Iniciando análisis de imagen con guardado en backend:', imageUri);
      
      // Usar el servicio integrado que detecta y guarda en el backend
      const result = await colorDetectionWithBackendService.detectAndSaveColors(imageUri);
      console.log('✅ Resultado del análisis completo:', result);
      
      if (result.detectionResult && result.detectionResult.dominantColor) {
        setColorResult(result.detectionResult);
        setAiRecommendations(result.recommendations);
        setDetectionId(result.detectionId || null);
        setRecommendationId(result.recommendationId || null);
        
        console.log('🎨 Color detectado:', result.detectionResult.dominantColor.name);
        console.log('💾 Guardado en backend - Detección ID:', result.detectionId);
        console.log('💾 Guardado en backend - Recomendaciones ID:', result.recommendationId);
        
        // Mostrar mensaje de éxito si se guardó en el backend
        if (result.detectionId || result.recommendationId) {
          console.log('✅ Datos guardados exitosamente en el historial personal');
        }
      } else {
        throw new Error('Resultado inválido del análisis');
      }
    } catch (error) {
      console.error('❌ Error analizando imagen:', error);
      Alert.alert(
        'Error de Análisis', 
        'No se pudo analizar la imagen. Esto puede deberse a problemas de procesamiento o conexión. Intenta con otra foto.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
      setIsSavingToBackend(false);
    }
  };

  const getAIRecommendations = async (colorName: string, colorCategory: string) => {
    try {
      setIsLoadingRecommendations(true);
      console.log('🤖 Obteniendo recomendaciones de IA para:', colorName);
      
      const response = await googleAIService.getColorRecommendations(colorName, colorCategory);
      
      if (response.success && response.recommendations.length > 0) {
        setAiRecommendations(response.recommendations);
        console.log('✅ Recomendaciones obtenidas:', response.recommendations.length);
      } else {
        console.warn('⚠️ No se pudieron obtener recomendaciones:', response.error);
        setAiRecommendations([]);
      }
    } catch (error) {
      console.error('❌ Error obteniendo recomendaciones:', error);
      setAiRecommendations([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const analyzeRegion = async (region: { x: number; y: number; width: number; height: number }) => {
    if (!capturedImage) return;
    
    try {
      setIsAnalyzing(true);
      const result = await colorDetectionService.detectColorInRegion(capturedImage, region);
      setColorResult(result);
      setSelectedRegion(region);
    } catch (error) {
      Alert.alert('Error', 'No se pudo analizar la región seleccionada.');
      console.error('Error analizando región:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setColorResult(null);
    setSelectedRegion(null);
    setAiRecommendations([]);
    setDetectionId(null);
    setRecommendationId(null);
  };

  const retakePhoto = () => {
    resetCamera();
  };

  // Web fallback
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.content, { maxWidth: 560, alignSelf: 'center' }]}>
          <Text style={[styles.title, { color: colors.text }]}>⚠️ Función no disponible en web</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            La detección de colores con cámara requiere un dispositivo nativo. Por favor, abre esta aplicación en tu teléfono usando Expo Go.
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
        <ActivityIndicator size="large" color={colors.primary} />
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
            Necesitas habilitar el permiso de cámara para usar la detección de colores.
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

  // Si hay una imagen capturada, mostrar análisis
  if (capturedImage) {
    return (
      <ScrollView 
        style={[styles.scrollContainer, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          
          {isAnalyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.analyzingText, { color: colors.text }]}>
                {isSavingToBackend ? 'Analizando y guardando...' : 'Analizando colores...'}
              </Text>
            </View>
          )}
        </View>

        {colorResult && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={[styles.resultsTitle, { color: colors.text }]}>
                🎨 Color Detectado
              </Text>
              {(detectionId || recommendationId) && (
                <Text style={[styles.savedIndicator, { color: colors.primary }]}>
                  💾 Guardado en historial
                </Text>
              )}
            </View>
            
            <View style={[styles.dominantColorCard, { backgroundColor: colors.card }]}>
              <View style={[styles.colorPreview, { backgroundColor: `rgb(${colorResult.rgb ? colorResult.rgb.join(',') : '128,128,128'})` }]} />
              <View style={styles.colorInfo}>
                <Text style={[styles.colorName, { color: colors.text }]}>
                  {colorResult.dominantColor?.name || 'Color Desconocido'}
                </Text>
                <Text style={[styles.colorCategory, { color: colors.mutedText }]}>
                  {colorResult.dominantColor?.category || 'Sin categoría'}
                </Text>
                <Text style={[styles.colorHex, { color: colors.mutedText }]}>
                  {colorResult.hex || '#808080'}
                </Text>
                <Text style={[styles.confidence, { color: colors.primary }]}>
                  Confianza: {colorResult.dominantColor?.confidence || 0}%
                </Text>
              </View>
            </View>

            {colorResult.palette && colorResult.palette.length > 0 && (
              <>
                <Text style={[styles.paletteTitle, { color: colors.text }]}>
                  Otros Colores Detectados
                </Text>
                
                {colorResult.palette.slice(0, 3).map((color, index) => (
                  <View key={index} style={[styles.paletteItem, { backgroundColor: colors.card }]}>
                    <View style={[styles.paletteColorPreview, { backgroundColor: `rgb(${color.rgb.join(',')})` }]} />
                    <View style={styles.paletteColorInfo}>
                      <Text style={[styles.paletteColorName, { color: colors.text }]}>
                        {color.name}
                      </Text>
                      <Text style={[styles.paletteColorPercentage, { color: colors.mutedText }]}>
                        {color.percentage}%
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* Sección de Recomendaciones de IA */}
            <View style={styles.recommendationsContainer}>
              <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                💡 Recomendaciones para Distinguir el Color
              </Text>
              
              {isLoadingRecommendations ? (
                <View style={styles.loadingRecommendations}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.mutedText }]}>
                    Generando recomendaciones personalizadas...
                  </Text>
                </View>
              ) : aiRecommendations.length > 0 ? (
                aiRecommendations.map((recommendation, index) => (
                  <View key={index} style={[styles.recommendationCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.recommendationStrategy, { color: colors.text }]}>
                      {recommendation.strategy}
                    </Text>
                    <Text style={[styles.recommendationDescription, { color: colors.mutedText }]}>
                      {recommendation.description}
                    </Text>
                    {recommendation.tips.length > 0 && (
                      <View style={styles.tipsContainer}>
                        <Text style={[styles.tipsTitle, { color: colors.text }]}>Consejos prácticos:</Text>
                        {recommendation.tips.map((tip, tipIndex) => (
                          <Text key={tipIndex} style={[styles.tipItem, { color: colors.mutedText }]}>
                            • {tip}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <View style={[styles.noRecommendationsCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.noRecommendationsText, { color: colors.mutedText }]}>
                    No se pudieron generar recomendaciones en este momento.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colors.inputBorder }]} 
            onPress={retakePhoto}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              📷 Tomar otra foto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>✓ Finalizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Camera view
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.previewContainer, { borderColor: colors.inputBorder }]}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      </View>

      <View style={styles.controls}>
        <Text style={[styles.instructionText, { color: colors.text }]}>
          📸 Toma una foto para detectar el color dominante
        </Text>
        
        <TouchableOpacity 
          style={[styles.captureButton, { backgroundColor: colors.primary }]} 
          onPress={takePicture}
          disabled={isCapturing}
        >
          <Text style={styles.captureButtonText}>
            {isCapturing ? 'Capturando...' : '📷 Tomar foto'}
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
  scrollContainer: { flex: 1 },
  scrollContentContainer: { paddingVertical: 24 },
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
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  captureButton: { 
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
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 16,
  },
  info: { 
    textAlign: 'center',
    fontSize: 16,
    marginTop: 12,
  },
  warningText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  // Estilos para la vista de análisis
  imageContainer: {
    position: 'relative',
    marginHorizontal: 24,
    marginBottom: 20,
  },
  capturedImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  analyzingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  resultsHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  savedIndicator: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dominantColorCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  colorPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  colorInfo: {
    flex: 1,
  },
  colorName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  colorCategory: {
    fontSize: 14,
    marginBottom: 2,
  },
  colorHex: {
    fontSize: 14,
    marginBottom: 4,
  },
  confidence: {
    fontSize: 12,
    fontWeight: '600',
  },
  paletteTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  paletteItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  paletteColorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  paletteColorInfo: {
    flex: 1,
  },
  paletteColorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  paletteColorPercentage: {
    fontSize: 12,
  },
  actionButtons: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 12,
  },
  // Nuevos estilos para análisis avanzado
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  colorDescription: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
  },
  analysisCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analysisItem: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  analysisLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Estilos para recomendaciones de IA
  recommendationsContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingRecommendations: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    fontStyle: 'italic',
  },
  recommendationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  recommendationStrategy: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#4CAF50',
  },
  recommendationDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  tipItem: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
    paddingLeft: 8,
  },
  noRecommendationsCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  noRecommendationsText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

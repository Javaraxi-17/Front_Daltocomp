import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';
import { apiService } from '../services/api';

const { width, height } = Dimensions.get('window');

interface ColorDetection {
  id: string;
  colorName: string;
  colorCategory: string;
  rgb: [number, number, number];
  hex: string;
  hsl: [number, number, number];
  confidence: number;
  palette?: Array<{
    name: string;
    category: string;
    rgb: [number, number, number];
    percentage: number;
  }>;
  createdAt: string;
}

interface Recommendation {
  id: string;
  colorName: string;
  colorCategory: string;
  recommendations: Array<{
    strategy: string;
    description: string;
    tips: string[];
  }>;
  createdAt: string;
}

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { isDark, colors } = useTheme();
  const [detections, setDetections] = useState<ColorDetection[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState<ColorDetection | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'detections' | 'recommendations'>('detections');

  // Animaciones
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadHistory();
    
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      console.log('📚 Cargando historial...');
      
      // Verificar si hay token antes de hacer las llamadas
      if (!apiService.isTokenValid()) {
        console.log('⚠️ No hay token válido, no se puede cargar el historial');
        Alert.alert('Error', 'No estás autenticado. Por favor, inicia sesión nuevamente.');
        return;
      }

      const [detectionsResponse, recommendationsResponse] = await Promise.all([
        apiService.getColorDetectionHistory(20),
        apiService.getRecommendationHistory(20),
      ]);

      if (detectionsResponse.success) {
        setDetections(detectionsResponse.colorHistory || []);
        console.log('✅ Escaneos cargados:', detectionsResponse.colorHistory?.length || 0);
        console.log('📊 Datos de escaneos:', detectionsResponse.colorHistory);
      }

      if (recommendationsResponse.success) {
        setRecommendations(recommendationsResponse.recommendationHistory || []);
        console.log('✅ Recomendaciones cargadas:', recommendationsResponse.recommendationHistory?.length || 0);
        console.log('📊 Datos de recomendaciones:', recommendationsResponse.recommendationHistory);
      }
    } catch (error: any) {
      console.error('❌ Error loading history:', error);
      
      if (error.code === 'TOKEN_EXPIRED' || error.code === 'INVALID_TOKEN' || error.status === 401) {
        Alert.alert('Sesión expirada', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigation.navigate('Welcome' as never);
      } else {
        Alert.alert('Error', 'No se pudo cargar el historial');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, []);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openDetectionDetail = (detection: ColorDetection) => {
    console.log('🔍 Abriendo detalle de detección:', detection);
    setSelectedDetection(detection);
    setSelectedRecommendation(null); // Limpiar recomendación seleccionada
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDetection(null);
    setSelectedRecommendation(null);
  };

  const deleteDetection = async (id: string) => {
    Alert.alert(
      'Eliminar escaneo',
      '¿Estás seguro de que quieres eliminar este escaneo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteColorDetection(id);
              setDetections(prev => prev.filter(d => d.id !== id));
              Alert.alert('Éxito', 'Escaneo eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el escaneo');
            }
          },
        },
      ]
    );
  };

  const deleteRecommendation = async (id: string) => {
    Alert.alert(
      'Eliminar recomendación',
      '¿Estás seguro de que quieres eliminar esta recomendación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteRecommendation(id);
              setRecommendations(prev => prev.filter(r => r.id !== id));
              Alert.alert('Éxito', 'Recomendación eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la recomendación');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#10b981';
    if (confidence >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const renderDetectionItem = (detection: ColorDetection) => (
    <TouchableOpacity
      key={detection.id}
      style={[styles.historyItem, { backgroundColor: colors.card }]}
      onPress={() => openDetectionDetail(detection)}
      activeOpacity={0.7}
    >
      <View style={styles.itemHeader}>
        <View style={styles.colorPreview}>
          <View
            style={[
              styles.colorCircle,
              { backgroundColor: detection.hex }
            ]}
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>
            {detection.colorName}
          </Text>
          <Text style={[styles.itemCategory, { color: colors.mutedText }]}>
            {detection.colorCategory}
          </Text>
          <Text style={[styles.itemDate, { color: colors.mutedText }]}>
            {formatDate(detection.createdAt)}
          </Text>
        </View>
        <View style={styles.itemActions}>
          <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(detection.confidence) + '20' }]}>
            <Text style={[styles.confidenceText, { color: getConfidenceColor(detection.confidence) }]}>
              {detection.confidence}%
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => deleteDetection(detection.id)}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.deleteText, { color: colors.danger }]}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendationItem = (recommendation: Recommendation) => (
    <TouchableOpacity
      key={recommendation.id}
      style={[styles.historyItem, { backgroundColor: colors.card }]}
      onPress={() => {
        console.log('💡 Abriendo detalle de recomendación:', recommendation);
        setSelectedRecommendation(recommendation);
        setSelectedDetection(null); // Limpiar detección seleccionada
        setModalVisible(true);
      }}
    >
      <View style={styles.itemHeader}>
        <View style={styles.recommendationIcon}>
          <Text style={styles.iconText}>💡</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>
            {recommendation.colorName}
          </Text>
          <Text style={[styles.itemCategory, { color: colors.mutedText }]}>
            {recommendation.colorCategory}
          </Text>
          <Text style={[styles.itemDate, { color: colors.mutedText }]}>
            {formatDate(recommendation.createdAt)}
          </Text>
          <Text style={[styles.recommendationCount, { color: colors.primary }]}>
            {recommendation.recommendations.length} recomendaciones
          </Text>
          
          {/* Mostrar un resumen de las recomendaciones */}
          <View style={styles.recommendationPreview}>
            {recommendation.recommendations.slice(0, 2).map((rec, index) => (
              <Text 
                key={index} 
                style={[styles.recommendationPreviewText, { color: colors.mutedText }]}
                numberOfLines={1}
              >
                • {rec.strategy}
              </Text>
            ))}
            {recommendation.recommendations.length > 2 && (
              <Text style={[styles.moreRecommendations, { color: colors.primary }]}>
                +{recommendation.recommendations.length - 2} más...
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteRecommendation(recommendation.id)}
        >
          <Text style={[styles.deleteText, { color: colors.danger }]}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyIcon, { color: colors.mutedText }]}>📷</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {activeTab === 'detections' ? 'No hay escaneos' : 'No hay recomendaciones'}
      </Text>
      <Text style={[styles.emptyDescription, { color: colors.mutedText }]}>
        {activeTab === 'detections' 
          ? 'Realiza tu primer escaneo de color para verlo aquí'
          : 'Las recomendaciones aparecerán después de tus escaneos'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={isDark 
          ? ['#1a1a2e', '#16213e', '#0f0f23'] 
          : ['#f093fb', '#f5576c', '#4facfe']
        }
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={[styles.backButtonText, { color: '#ffffff' }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#ffffff' }]}>Mi Historial</Text>
        
        {/* Botón de prueba temporal */}
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => {
            console.log('🧪 Probando modal con datos de prueba');
            const testDetection: ColorDetection = {
              id: 'test-1',
              colorName: 'Rojo',
              colorCategory: 'Primario',
              rgb: [255, 0, 0],
              hex: '#FF0000',
              hsl: [0, 100, 50],
              confidence: 95,
              createdAt: new Date().toISOString()
            };
            setSelectedDetection(testDetection);
            setSelectedRecommendation(null);
            setModalVisible(true);
          }}
        >
          <Text style={[styles.testButtonText, { color: '#ffffff' }]}>🧪 Test</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'detections' && styles.activeTab,
            { backgroundColor: activeTab === 'detections' ? 'rgba(255,255,255,0.2)' : 'transparent' }
          ]}
          onPress={() => setActiveTab('detections')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'detections' ? '#ffffff' : 'rgba(255,255,255,0.7)' }]}>
            Escaneos ({detections.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'recommendations' && styles.activeTab,
            { backgroundColor: activeTab === 'recommendations' ? 'rgba(255,255,255,0.2)' : 'transparent' }
          ]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'recommendations' ? '#ffffff' : 'rgba(255,255,255,0.7)' }]}>
            Recomendaciones ({recommendations.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={[styles.loadingText, { color: '#ffffff' }]}>Cargando historial...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#ffffff"
                colors={['#ffffff']}
              />
            }
          >
            {activeTab === 'detections' ? (
              detections.length > 0 ? (
                detections.map(renderDetectionItem)
              ) : (
                renderEmptyState()
              )
            ) : (
              recommendations.length > 0 ? (
                recommendations.map(renderRecommendationItem)
              ) : (
                renderEmptyState()
              )
            )}
          </ScrollView>
        )}
      </Animated.View>

      {/* Modal de detalle */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedDetection ? 'Detalles del Escaneo' : 'Detalles de la Recomendación'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {(() => {
                console.log('🔍 Modal - selectedDetection:', selectedDetection);
                console.log('💡 Modal - selectedRecommendation:', selectedRecommendation);
                
                if (selectedDetection) {
                  return (
                    <View style={styles.detailContainer}>
                      <View style={styles.colorDetail}>
                        <View
                          style={[
                            styles.colorCircleLarge,
                            { backgroundColor: selectedDetection.hex }
                          ]}
                        />
                        <View style={styles.colorInfo}>
                          <Text style={[styles.colorName, { color: colors.text }]}>
                            {selectedDetection.colorName}
                          </Text>
                          <Text style={[styles.colorCategory, { color: colors.mutedText }]}>
                            {selectedDetection.colorCategory}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.colorValues}>
                        <View style={styles.valueItem}>
                          <Text style={[styles.valueLabel, { color: colors.text }]}>HEX</Text>
                          <Text style={[styles.valueText, { color: colors.mutedText }]}>
                            {selectedDetection.hex}
                          </Text>
                        </View>
                        <View style={styles.valueItem}>
                          <Text style={[styles.valueLabel, { color: colors.text }]}>RGB</Text>
                          <Text style={[styles.valueText, { color: colors.mutedText }]}>
                            {selectedDetection.rgb.join(', ')}
                          </Text>
                        </View>
                        <View style={styles.valueItem}>
                          <Text style={[styles.valueLabel, { color: colors.text }]}>HSL</Text>
                          <Text style={[styles.valueText, { color: colors.mutedText }]}>
                            {selectedDetection.hsl.join(', ')}
                          </Text>
                        </View>
                        <View style={styles.valueItem}>
                          <Text style={[styles.valueLabel, { color: colors.text }]}>Confianza</Text>
                          <Text style={[styles.valueText, { color: getConfidenceColor(selectedDetection.confidence) }]}>
                            {selectedDetection.confidence}%
                          </Text>
                        </View>
                      </View>

                      <Text style={[styles.scanDate, { color: colors.mutedText }]}>
                        Escaneado el {formatDate(selectedDetection.createdAt)}
                      </Text>
                    </View>
                  );
                }
                
                if (selectedRecommendation) {
                  return (
                    <View style={styles.detailContainer}>
                      <View style={styles.recommendationHeader}>
                        <View style={styles.recommendationIconLarge}>
                          <Text style={styles.iconTextLarge}>💡</Text>
                        </View>
                        <View style={styles.recommendationInfo}>
                          <Text style={[styles.recommendationTitle, { color: colors.text }]}>
                            {selectedRecommendation.colorName}
                          </Text>
                          <Text style={[styles.recommendationCategory, { color: colors.mutedText }]}>
                            {selectedRecommendation.colorCategory}
                          </Text>
                          <Text style={[styles.recommendationDate, { color: colors.mutedText }]}>
                            Generado el {formatDate(selectedRecommendation.createdAt)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.recommendationsList}>
                        <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                          Recomendaciones ({selectedRecommendation.recommendations.length})
                        </Text>
                        {selectedRecommendation.recommendations.map((rec, index) => (
                          <View key={index} style={[styles.recommendationItem, { backgroundColor: colors.card }]}>
                            <Text style={[styles.recommendationStrategy, { color: colors.text }]}>
                              {rec.strategy}
                            </Text>
                            <Text style={[styles.recommendationDescription, { color: colors.mutedText }]}>
                              {rec.description}
                            </Text>
                            {rec.tips && rec.tips.length > 0 && (
                              <View style={styles.tipsContainer}>
                                <Text style={[styles.tipsTitle, { color: colors.primary }]}>
                                  Consejos:
                                </Text>
                                {rec.tips.map((tip, tipIndex) => (
                                  <Text key={tipIndex} style={[styles.tipText, { color: colors.mutedText }]}>
                                    • {tip}
                                  </Text>
                                ))}
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                }
                
                return (
                  <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                      No hay datos para mostrar
                    </Text>
                  </View>
                );
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  testButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  testButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    // backgroundColor se define dinámicamente
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    marginRight: 12,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorCircleLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
  },
  recommendationCount: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
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
    maxHeight: '80%',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailContainer: {
    gap: 20,
  },
  colorDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  colorName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  colorCategory: {
    fontSize: 16,
  },
  colorValues: {
    gap: 12,
  },
  valueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 60,
  },
  valueText: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  scanDate: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Estilos para recomendaciones mejoradas
  recommendationPreview: {
    marginTop: 8,
  },
  recommendationPreviewText: {
    fontSize: 12,
    marginBottom: 2,
  },
  moreRecommendations: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  // Estilos para el modal de recomendaciones
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  recommendationIconLarge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconTextLarge: {
    fontSize: 24,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationCategory: {
    fontSize: 14,
    marginBottom: 4,
  },
  recommendationDate: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  recommendationsList: {
    marginTop: 10,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recommendationItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendationStrategy: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
  },
});

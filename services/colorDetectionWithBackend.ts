import { colorDetectionService, type ColorDetectionResult } from './colorDetection';
import { googleAIService, type ColorRecommendation } from './googleAIService';
import { apiService, type ColorDetectionData, type RecommendationData } from './api';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { extensiveColorMatcher } from './extensiveColorDatabase';

/**
 * Servicio que integra la detección local de colores con el guardado en el backend
 */
export class ColorDetectionWithBackendService {
  /**
   * Detecta colores en una imagen y guarda el resultado en el backend
   */
  async detectAndSaveColors(imageUri: string): Promise<{
    detectionResult: ColorDetectionResult;
    detectionId?: string;
    recommendations: ColorRecommendation[];
    recommendationId?: string;
  }> {
    try {
      console.log('🎨 Iniciando detección y guardado de colores...');
      
      // 1. Intentar detección precisa en backend (con redimensionamiento previo)
      let detectionResult: ColorDetectionResult | null = null;
      try {
        const resized = await manipulateAsync(
          imageUri,
          [{ resize: { width: 224 } }], // baja resolución para estabilizar colores
          { compress: 0.75, format: SaveFormat.JPEG, base64: true }
        );
        if (!resized.base64) throw new Error('No se pudo generar base64 de la imagen');
        const analyze = await apiService.analyzeImageBase64(resized.base64, { maxColors: 5, resize: { maxWidth: 224, maxHeight: 224 } });

        const rgb = analyze.analysis.dominantColor.rgb;
        const closest = extensiveColorMatcher.findClosestColor(rgb);

        const palette = analyze.analysis.palette.slice(0, 4).map(p => {
          const closestPal = extensiveColorMatcher.findClosestColor(p.rgb);
          return {
            name: closestPal.color.name,
            category: closestPal.color.category,
            rgb: p.rgb as [number, number, number],
            percentage: p.percentage,
          };
        });

        detectionResult = {
          dominantColor: {
            name: closest.color.name,
            category: closest.color.category,
            rgb: rgb as [number, number, number],
            confidence: analyze.analysis.dominantColor.confidence,
          },
          palette,
          hex: analyze.analysis.dominantColor.hex,
          rgb: rgb as [number, number, number],
          hsl: analyze.analysis.dominantColor.hsl,
        };

        console.log('✅ Color detectado por backend:', detectionResult.dominantColor.name);
      } catch (e) {
        console.warn('⚠️ Fallback a detección local por error de backend:', e);
      }

      // 1b. Fallback a local si backend falló
      if (!detectionResult) {
        detectionResult = await colorDetectionService.detectColor(imageUri);
        console.log('✅ Color detectado localmente:', detectionResult.dominantColor.name);
      }
      
      // 2. Guardar detección en el backend
      let detectionId: string | undefined;
      try {
        const detectionData: ColorDetectionData = {
          colorName: detectionResult.dominantColor.name,
          colorCategory: detectionResult.dominantColor.category,
          rgb: detectionResult.rgb,
          hex: detectionResult.hex,
          hsl: detectionResult.hsl,
          confidence: detectionResult.dominantColor.confidence,
          palette: detectionResult.palette
        };

        const saveResponse = await apiService.saveColorDetection(detectionData);
        if (saveResponse.success) {
          detectionId = saveResponse.detectionId;
          console.log('✅ Detección guardada en backend con ID:', detectionId);
        } else {
          console.warn('⚠️ No se pudo guardar la detección en el backend');
        }
      } catch (error) {
        console.error('❌ Error guardando detección en backend:', error);
        // Continuar sin fallar, la detección local ya funcionó
      }

      // 3. Obtener recomendaciones de IA
      let recommendations: ColorRecommendation[] = [];
      let recommendationId: string | undefined;
      
      try {
        const aiResponse = await googleAIService.getColorRecommendations(
          detectionResult.dominantColor.name,
          detectionResult.dominantColor.category
        );
        
        if (aiResponse.success && aiResponse.recommendations.length > 0) {
          recommendations = aiResponse.recommendations;
          console.log('✅ Recomendaciones obtenidas:', recommendations.length);
          
          // 4. Guardar recomendaciones en el backend
          try {
            const recommendationData: RecommendationData = {
              colorName: detectionResult.dominantColor.name,
              colorCategory: detectionResult.dominantColor.category,
              recommendations: recommendations
            };

            const saveRecResponse = await apiService.saveRecommendations(recommendationData);
            if (saveRecResponse.success) {
              recommendationId = saveRecResponse.recommendationId;
              console.log('✅ Recomendaciones guardadas en backend con ID:', recommendationId);
            } else {
              console.warn('⚠️ No se pudieron guardar las recomendaciones en el backend');
            }
          } catch (error) {
            console.error('❌ Error guardando recomendaciones en backend:', error);
            // Continuar sin fallar, las recomendaciones ya se obtuvieron
          }
        } else {
          console.warn('⚠️ No se pudieron obtener recomendaciones de IA:', aiResponse.error);
        }
      } catch (error) {
        console.error('❌ Error obteniendo recomendaciones:', error);
        // Continuar sin fallar, la detección ya funcionó
      }

      return {
        detectionResult,
        detectionId,
        recommendations,
        recommendationId
      };

    } catch (error) {
      console.error('❌ Error en detección y guardado:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de detecciones del usuario
   */
  async getColorDetectionHistory(limit: number = 20, offset: number = 0) {
    try {
      console.log('📚 Obteniendo historial de detecciones...');
      
      const response = await apiService.getColorDetectionHistory(limit, offset);
      
      if (response.success) {
        console.log('✅ Historial obtenido:', response.colorHistory.length, 'elementos');
        return response.colorHistory;
      } else {
        throw new Error('Error obteniendo historial');
      }
      
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de recomendaciones del usuario
   */
  async getRecommendationHistory(limit: number = 20, offset: number = 0) {
    try {
      console.log('📚 Obteniendo historial de recomendaciones...');
      
      const response = await apiService.getRecommendationHistory(limit, offset);
      
      if (response.success) {
        console.log('✅ Historial de recomendaciones obtenido:', response.recommendationHistory.length, 'elementos');
        return response.recommendationHistory;
      } else {
        throw new Error('Error obteniendo historial de recomendaciones');
      }
      
    } catch (error) {
      console.error('❌ Error obteniendo historial de recomendaciones:', error);
      throw error;
    }
  }

  /**
   * Obtiene una detección específica por ID
   */
  async getColorDetectionById(id: string) {
    try {
      console.log('🔍 Obteniendo detección específica:', id);
      
      const response = await apiService.getColorDetectionById(id);
      
      if (response.success) {
        console.log('✅ Detección obtenida:', response.detection);
        return response.detection;
      } else {
        throw new Error('Error obteniendo detección');
      }
      
    } catch (error) {
      console.error('❌ Error obteniendo detección:', error);
      throw error;
    }
  }

  /**
   * Elimina una detección específica
   */
  async deleteColorDetection(id: string) {
    try {
      console.log('🗑️ Eliminando detección:', id);
      
      const response = await apiService.deleteColorDetection(id);
      
      if (response.success) {
        console.log('✅ Detección eliminada exitosamente');
        return response;
      } else {
        throw new Error('Error eliminando detección');
      }
      
    } catch (error) {
      console.error('❌ Error eliminando detección:', error);
      throw error;
    }
  }

  /**
   * Solo detecta colores sin guardar (para uso offline o testing)
   */
  async detectColorsOnly(imageUri: string): Promise<ColorDetectionResult> {
    try {
      console.log('🎨 Detectando colores (sin guardar)...');
      
      const detectionResult = await colorDetectionService.detectColor(imageUri);
      console.log('✅ Color detectado:', detectionResult.dominantColor.name);
      
      return detectionResult;
      
    } catch (error) {
      console.error('❌ Error detectando colores:', error);
      throw error;
    }
  }

  /**
   * Solo obtiene recomendaciones sin guardar (para uso offline o testing)
   */
  async getRecommendationsOnly(colorName: string, colorCategory: string): Promise<ColorRecommendation[]> {
    try {
      console.log('🤖 Obteniendo recomendaciones (sin guardar)...');
      
      const aiResponse = await googleAIService.getColorRecommendations(colorName, colorCategory);
      
      if (aiResponse.success && aiResponse.recommendations.length > 0) {
        console.log('✅ Recomendaciones obtenidas:', aiResponse.recommendations.length);
        return aiResponse.recommendations;
      } else {
        console.warn('⚠️ No se pudieron obtener recomendaciones:', aiResponse.error);
        return [];
      }
      
    } catch (error) {
      console.error('❌ Error obteniendo recomendaciones:', error);
      throw error;
    }
  }
}

export const colorDetectionWithBackendService = new ColorDetectionWithBackendService();

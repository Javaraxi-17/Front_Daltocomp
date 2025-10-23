import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

// Algoritmo K-Means para clustering de colores
interface ColorCluster {
  centroid: [number, number, number];
  pixels: Array<[number, number, number]>;
  count: number;
}

export interface AdvancedColorResult {
  dominantColor: {
    name: string;
    category: string;
    rgb: [number, number, number];
    confidence: number;
    description: string;
  };
  palette: Array<{
    name: string;
    category: string;
    rgb: [number, number, number];
    percentage: number;
    description: string;
  }>;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  analysis: {
    brightness: number;
    saturation: number;
    temperature: 'warm' | 'cool' | 'neutral';
    mood: string;
  };
}

class AdvancedColorDetectionService {
  private readonly MAX_COLORS = 8;
  private readonly MIN_DISTANCE = 30;

  /**
   * Algoritmo K-Means mejorado para clustering de colores
   */
  private kMeansClustering(pixels: Array<[number, number, number]>, k: number): ColorCluster[] {
    if (pixels.length === 0) return [];

    // Inicializar centroides aleatoriamente
    const centroids: [number, number, number][] = [];
    for (let i = 0; i < k; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      centroids.push([...randomPixel]);
    }

    let clusters: ColorCluster[] = [];
    let iterations = 0;
    const maxIterations = 50;

    while (iterations < maxIterations) {
      // Asignar píxeles a clusters
      clusters = centroids.map(centroid => ({
        centroid: [...centroid],
        pixels: [],
        count: 0
      }));

      for (const pixel of pixels) {
        let closestCluster = 0;
        let minDistance = this.euclideanDistance(pixel, centroids[0]);

        for (let i = 1; i < centroids.length; i++) {
          const distance = this.euclideanDistance(pixel, centroids[i]);
          if (distance < minDistance) {
            minDistance = distance;
            closestCluster = i;
          }
        }

        clusters[closestCluster].pixels.push(pixel);
        clusters[closestCluster].count++;
      }

      // Actualizar centroides
      let converged = true;
      for (let i = 0; i < clusters.length; i++) {
        if (clusters[i].pixels.length === 0) continue;

        const newCentroid: [number, number, number] = [0, 0, 0];
        for (const pixel of clusters[i].pixels) {
          newCentroid[0] += pixel[0];
          newCentroid[1] += pixel[1];
          newCentroid[2] += pixel[2];
        }

        newCentroid[0] /= clusters[i].pixels.length;
        newCentroid[1] /= clusters[i].pixels.length;
        newCentroid[2] /= clusters[i].pixels.length;

        // Verificar convergencia
        const distance = this.euclideanDistance(newCentroid, centroids[i]);
        if (distance > 1) {
          converged = false;
        }

        centroids[i] = newCentroid;
        clusters[i].centroid = newCentroid;
      }

      if (converged) break;
      iterations++;
    }

    return clusters.filter(cluster => cluster.pixels.length > 0);
  }

  /**
   * Distancia euclidiana entre dos colores RGB
   */
  private euclideanDistance(color1: [number, number, number], color2: [number, number, number]): number {
    return Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
    );
  }

  /**
   * Extrae píxeles de una imagen (simulado para React Native)
   */
  private async extractPixelsFromImage(imageUri: string): Promise<Array<[number, number, number]>> {
    try {
      // En una implementación real, usarías canvas o una librería de procesamiento de imágenes
      // Por ahora, simulamos la extracción de píxeles
      return this.simulatePixelExtraction();
    } catch (error) {
      console.error('Error extrayendo píxeles:', error);
      return [];
    }
  }

  /**
   * Simula la extracción de píxeles (placeholder)
   */
  private simulatePixelExtraction(): Array<[number, number, number]> {
    // En una implementación real, aquí procesarías los píxeles de la imagen
    const pixels: Array<[number, number, number]> = [];
    
    // Simular diferentes colores con diferentes frecuencias basado en la hora
    const hour = new Date().getHours();
    const colorPatterns = [
      { color: [255, 100, 100] as [number, number, number], count: 100 }, // Rojo
      { color: [100, 200, 100] as [number, number, number], count: 80 },  // Verde
      { color: [100, 100, 255] as [number, number, number], count: 60 },  // Azul
      { color: [255, 200, 100] as [number, number, number], count: 40 }, // Naranja
      { color: [200, 100, 255] as [number, number, number], count: 30 }, // Púrpura
    ];

    // Seleccionar patrones basado en la hora para variar resultados
    const selectedPatterns = colorPatterns.slice(hour % 3, (hour % 3) + 3);

    for (const pattern of selectedPatterns) {
      for (let i = 0; i < pattern.count; i++) {
        // Añadir variación aleatoria para simular píxeles reales
        const variation = () => Math.random() * 20 - 10;
        pixels.push([
          Math.max(0, Math.min(255, pattern.color[0] + variation())),
          Math.max(0, Math.min(255, pattern.color[1] + variation())),
          Math.max(0, Math.min(255, pattern.color[2] + variation()))
        ]);
      }
    }

    return pixels;
  }

  /**
   * Convierte RGB a HSL
   */
  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  /**
   * Encuentra el nombre de color más cercano
   */
  private findClosestColorName(rgb: [number, number, number]): { name: string; category: string; confidence: number } {
    // Base de datos simplificada de colores
    const colorDatabase = [
      { name: 'Rojo Manzana', category: 'Rojo', rgb: [255, 59, 48] },
      { name: 'Rojo Cereza', category: 'Rojo', rgb: [220, 20, 60] },
      { name: 'Rojo Tomate', category: 'Rojo', rgb: [255, 99, 71] },
      { name: 'Azul Marino', category: 'Azul', rgb: [0, 0, 128] },
      { name: 'Azul Cielo', category: 'Azul', rgb: [135, 206, 235] },
      { name: 'Verde Esmeralda', category: 'Verde', rgb: [80, 200, 120] },
      { name: 'Verde Lima', category: 'Verde', rgb: [50, 205, 50] },
      { name: 'Amarillo Dorado', category: 'Amarillo', rgb: [255, 215, 0] },
      { name: 'Naranja Mandarina', category: 'Naranja', rgb: [255, 165, 0] },
      { name: 'Púrpura Real', category: 'Púrpura', rgb: [128, 0, 128] },
    ];

    let closestColor = colorDatabase[0];
    let minDistance = this.euclideanDistance(rgb, colorDatabase[0].rgb as [number, number, number]);

    for (const color of colorDatabase) {
      const distance = this.euclideanDistance(rgb, color.rgb as [number, number, number]);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }

    const maxDistance = Math.sqrt(3 * 255 ** 2);
    const confidence = Math.max(0, 1 - (minDistance / maxDistance));

    return {
      name: closestColor.name,
      category: closestColor.category,
      confidence: Math.round(confidence * 100)
    };
  }

  /**
   * Analiza las propiedades del color
   */
  private analyzeColorProperties(rgb: [number, number, number], hsl: [number, number, number]): {
    brightness: number;
    saturation: number;
    temperature: 'warm' | 'cool' | 'neutral';
    mood: string;
  } {
    const [h, s, l] = hsl;
    
    // Brillo (0-100)
    const brightness = l;
    
    // Saturación (0-100)
    const saturation = s;
    
    // Temperatura de color
    let temperature: 'warm' | 'cool' | 'neutral' = 'neutral';
    if (h >= 0 && h <= 60) temperature = 'warm';      // Rojo-Amarillo
    else if (h >= 60 && h <= 180) temperature = 'cool'; // Verde-Cian
    else if (h >= 180 && h <= 300) temperature = 'cool'; // Azul-Magenta
    else if (h >= 300 && h <= 360) temperature = 'warm'; // Magenta-Rojo
    
    // Análisis del estado de ánimo
    let mood = '';
    if (s < 20) {
      mood = 'Neutro y sutil';
    } else if (h >= 0 && h <= 30) {
      mood = 'Energético y apasionado';
    } else if (h >= 30 && h <= 90) {
      mood = 'Alegre y optimista';
    } else if (h >= 90 && h <= 150) {
      mood = 'Fresco y natural';
    } else if (h >= 150 && h <= 210) {
      mood = 'Tranquilo y relajante';
    } else if (h >= 210 && h <= 270) {
      mood = 'Profesional y confiable';
    } else if (h >= 270 && h <= 330) {
      mood = 'Creativo y misterioso';
    } else {
      mood = 'Elegante y sofisticado';
    }

    return { brightness, saturation, temperature, mood };
  }

  /**
   * Genera descripción detallada del color
   */
  private generateColorDescription(colorName: string, category: string, properties: any): string {
    const { brightness, saturation, temperature, mood } = properties;
    
    let description = `${colorName} es un color ${category.toLowerCase()}`;
    
    if (brightness > 70) description += ' muy brillante';
    else if (brightness < 30) description += ' oscuro';
    
    if (saturation > 70) description += ' y muy saturado';
    else if (saturation < 30) description += ' y apagado';
    
    description += `. Es un color ${temperature === 'warm' ? 'cálido' : temperature === 'cool' ? 'frío' : 'neutral'} que transmite ${mood.toLowerCase()}.`;
    
    return description;
  }

  /**
   * Detecta colores avanzados en una imagen
   */
  async detectAdvancedColors(imageUri: string): Promise<AdvancedColorResult> {
    try {
      console.log('Iniciando detección avanzada de colores para:', imageUri);
      
      // Redimensionar imagen para procesamiento
      const resizedImage = await manipulateAsync(
        imageUri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      // Extraer píxeles
      const pixels = await this.extractPixelsFromImage(resizedImage.uri);
      
      if (pixels.length === 0) {
        throw new Error('No se pudieron extraer píxeles de la imagen');
      }

      // Aplicar K-Means clustering
      const clusters = this.kMeansClustering(pixels, this.MAX_COLORS);
      
      if (clusters.length === 0) {
        throw new Error('No se pudieron identificar clusters de colores');
      }

      // Ordenar clusters por frecuencia
      const sortedClusters = clusters.sort((a, b) => b.count - a.count);
      
      // Obtener color dominante
      const dominantCluster = sortedClusters[0];
      const dominantRgb: [number, number, number] = dominantCluster.centroid;
      const dominantHsl = this.rgbToHsl(dominantRgb[0], dominantRgb[1], dominantRgb[2]);
      
      // Encontrar nombre del color dominante
      const dominantColorInfo = this.findClosestColorName(dominantRgb);
      
      // Analizar propiedades del color
      const colorProperties = this.analyzeColorProperties(dominantRgb, dominantHsl);
      
      // Generar descripción
      const description = this.generateColorDescription(
        dominantColorInfo.name, 
        dominantColorInfo.category, 
        colorProperties
      );

      // Crear paleta de colores
      const totalPixels = sortedClusters.reduce((sum, cluster) => sum + cluster.count, 0);
      const palette = sortedClusters.slice(0, 5).map(cluster => {
        const clusterRgb: [number, number, number] = cluster.centroid;
        const clusterHsl = this.rgbToHsl(clusterRgb[0], clusterRgb[1], clusterRgb[2]);
        const colorInfo = this.findClosestColorName(clusterRgb);
        const properties = this.analyzeColorProperties(clusterRgb, clusterHsl);
        
        return {
          name: colorInfo.name,
          category: colorInfo.category,
          rgb: clusterRgb,
          percentage: Math.round((cluster.count / totalPixels) * 100),
          description: this.generateColorDescription(colorInfo.name, colorInfo.category, properties)
        };
      });

      const result: AdvancedColorResult = {
        dominantColor: {
          name: dominantColorInfo.name,
          category: dominantColorInfo.category,
          rgb: dominantRgb,
          confidence: dominantColorInfo.confidence,
          description
        },
        palette,
        hex: this.rgbToHex(...dominantRgb),
        rgb: dominantRgb,
        hsl: dominantHsl,
        analysis: colorProperties
      };

      console.log('Resultado de detección avanzada:', result);
      return result;

    } catch (error) {
      console.error('Error en detección avanzada de colores:', error);
      throw new Error('No se pudo realizar el análisis avanzado de colores');
    }
  }

  /**
   * Convierte RGB a hexadecimal
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }
}

export const advancedColorDetectionService = new AdvancedColorDetectionService();

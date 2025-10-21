import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import Color from 'color';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

// Farnsworth D-15 Test Colors - Colores únicos sin repeticiones
const D15_COLORS = [
  '#3C7FC5', // 1. Azul (60, 127, 197)
  '#3979BA', // 2. Azul (57, 121, 186)
  '#447C9F', // 3. Azul-gris (68, 124, 159)
  '#49839D', // 4. Azul-gris (73, 131, 157)
  '#7264A8', // 5. Púrpura (114, 100, 168)
  '#856BA2', // 6. Púrpura (133, 107, 162)
  '#977190', // 7. Púrpura-rosa (151, 113, 144)
  '#9F788A', // 8. Púrpura-rosa (159, 120, 138)
  '#5B8B9D', // 9. Verde-azul (91, 139, 157)
  '#568E8A', // 10. Verde (86, 142, 138)
  '#608B7D', // 11. Verde (96, 139, 125)
  '#6A846C', // 12. Verde (106, 132, 108)
  '#827857', // 13. Marrón (130, 120, 87)
  '#9A8055', // 14. Marrón (154, 128, 85)
  '#9B7E61', // 15. Marrón (155, 126, 97)
];

// Valores únicos de referencia para el análisis de daltonismo (0-14)
// Cada color tiene un valor único para evitar repeticiones
const D15_REFERENCE_VALUES = [
  { color: '#3C7FC5', value: 0, type: 'blue', name: 'Azul 1' },           // 0 - Color de referencia (azul)
  { color: '#3979BA', value: 1, type: 'blue', name: 'Azul 2' },           // 1
  { color: '#447C9F', value: 2, type: 'blue', name: 'Azul-gris 1' },      // 2
  { color: '#49839D', value: 3, type: 'blue', name: 'Azul-gris 2' },     // 3
  { color: '#7264A8', value: 4, type: 'purple', name: 'Púrpura 1' },      // 4
  { color: '#856BA2', value: 5, type: 'purple', name: 'Púrpura 2' },      // 5
  { color: '#977190', value: 6, type: 'purple', name: 'Púrpura-rosa 1' }, // 6
  { color: '#9F788A', value: 7, type: 'purple', name: 'Púrpura-rosa 2' }, // 7
  { color: '#5B8B9D', value: 8, type: 'green', name: 'Verde-azul 1' },    // 8
  { color: '#568E8A', value: 9, type: 'green', name: 'Verde 1' },         // 9
  { color: '#608B7D', value: 10, type: 'green', name: 'Verde 2' },        // 10
  { color: '#6A846C', value: 11, type: 'green', name: 'Verde 3' },       // 11
  { color: '#827857', value: 12, type: 'brown', name: 'Marrón 1' },       // 12
  { color: '#9A8055', value: 13, type: 'brown', name: 'Marrón 2' },       // 13
  { color: '#9B7E61', value: 14, type: 'brown', name: 'Marrón 3' },       // 14
];

interface ColorblindnessResult {
  type: 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  confidence: number;
  description: string;
  redError: number;
  greenError: number;
  blueError: number;
  totalError: number;
}

interface GraphPoint {
  x: number;
  y: number;
  value: number;
  color: string;
}

export default function D15TestScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { clearNewUserFlag } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [result, setResult] = useState<ColorblindnessResult | null>(null);

  // Limpiar la bandera de usuario nuevo cuando se monte la pantalla
  useEffect(() => {
    clearNewUserFlag();
  }, [clearNewUserFlag]);

  // Toggle selection: add if not present; remove if already selected
  const onToggleColor = (hex: string) => {
    setSelectedOrder((prev) => (prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]));
  };

  const onResetOrder = () => {
    setSelectedOrder([]);
    setTestCompleted(false);
    setResult(null);
  };

  const analyzeColorblindness = (selectedColors: string[]): ColorblindnessResult => {
    console.log('🔍 Analizando selección de colores:', selectedColors);
    
    // Crear un mapa de colores únicos con sus valores de referencia
    const colorMap = new Map<string, { value: number; type: string; name: string }>();
    D15_REFERENCE_VALUES.forEach(ref => {
      colorMap.set(ref.color, { value: ref.value, type: ref.type, name: ref.name });
    });

    // Mapear colores seleccionados a sus valores únicos
    const selectedValues = selectedColors.map((color, index) => {
      const ref = colorMap.get(color);
      if (ref) {
        return {
          color,
          expectedValue: ref.value,
          actualPosition: index,
          type: ref.type,
          name: ref.name
        };
      }
      return null;
    }).filter(Boolean);

    console.log('📊 Valores mapeados:', selectedValues);

    // Algoritmo Farnsworth D-15 estándar
    // 1. Calcular errores de confusión por ejes
    const confusionErrors = {
      protan: 0,    // Eje rojo-verde (protanopia)
      deuteran: 0,  // Eje rojo-verde (deuteranopia) 
      tritan: 0     // Eje azul-amarillo (tritanopia)
    };

    // 2. Analizar patrones de confusión según estándares D-15
    selectedValues.forEach((item, index) => {
      if (item) {
        const positionError = Math.abs(item.expectedValue - index);
        
        // Clasificar por ejes de confusión estándar
        if (item.type === 'blue' || item.type === 'green') {
          // Azules y verdes confundidos indican deuteranopia
          confusionErrors.deuteran += positionError;
        } else if (item.type === 'purple' || item.type === 'brown') {
          // Púrpuras y marrones confundidos indican protanopia
          confusionErrors.protan += positionError;
        } else if (item.type === 'green' && positionError > 2) {
          // Verdes con gran error indican tritanopia
          confusionErrors.tritan += positionError * 0.5;
        }
      }
    });

    // 3. Calcular puntuaciones de confusión (estándar D-15)
    const totalPossibleConfusion = 15 * 3; // Máximo error de confusión
    const protanScore = (confusionErrors.protan / totalPossibleConfusion) * 100;
    const deuteranScore = (confusionErrors.deuteran / totalPossibleConfusion) * 100;
    const tritanScore = (confusionErrors.tritan / totalPossibleConfusion) * 100;

    // 4. Calcular error total para confianza
    const totalError = selectedValues.reduce((sum, item, index) => {
      return sum + (item ? Math.abs(item.expectedValue - index) : 0);
    }, 0);
    const totalErrorPercentage = (totalError / (15 * 7)) * 100;

    console.log('📈 Puntuaciones de confusión D-15:', {
      protan: `${protanScore.toFixed(1)}%`,
      deuteran: `${deuteranScore.toFixed(1)}%`,
      tritan: `${tritanScore.toFixed(1)}%`,
      total: `${totalErrorPercentage.toFixed(1)}%`
    });

    // 5. Determinar daltonismo según estándares D-15
    // Umbrales estándar: >15% indica problema, >25% indica problema severo
    if (deuteranScore > 15) {
      const severity = deuteranScore > 25 ? 'severa' : 'leve';
      return {
        type: 'deuteranopia',
        confidence: Math.min(deuteranScore, 100),
        description: `Deuteranopia ${severity}: Dificultad para distinguir tonos verdes (${deuteranScore.toFixed(1)}% de confusión)`,
        redError: protanScore,
        greenError: deuteranScore,
        blueError: tritanScore,
        totalError: totalErrorPercentage
      };
    } else if (protanScore > 15) {
      const severity = protanScore > 25 ? 'severa' : 'leve';
      return {
        type: 'protanopia',
        confidence: Math.min(protanScore, 100),
        description: `Protanopia ${severity}: Dificultad para distinguir tonos rojos (${protanScore.toFixed(1)}% de confusión)`,
        redError: protanScore,
        greenError: deuteranScore,
        blueError: tritanScore,
        totalError: totalErrorPercentage
      };
    } else if (tritanScore > 15) {
      const severity = tritanScore > 25 ? 'severa' : 'leve';
      return {
        type: 'tritanopia',
        confidence: Math.min(tritanScore, 100),
        description: `Tritanopia ${severity}: Dificultad para distinguir tonos azules (${tritanScore.toFixed(1)}% de confusión)`,
        redError: protanScore,
        greenError: deuteranScore,
        blueError: tritanScore,
        totalError: totalErrorPercentage
      };
    } else {
      // Visión normal con umbral más realista
      const confidence = Math.max(100 - totalErrorPercentage, 0);
      return {
        type: 'normal',
        confidence: confidence,
        description: `Visión normal: No se detectaron problemas significativos de daltonismo (${totalErrorPercentage.toFixed(1)}% de error total)`,
        redError: protanScore,
        greenError: deuteranScore,
        blueError: tritanScore,
        totalError: totalErrorPercentage
      };
    }
  };

  const onCompleteTest = () => {
    if (selectedOrder.length === D15_COLORS.length) {
      console.log('🎯 Iniciando análisis de daltonismo...');
      console.log('📋 Orden seleccionado:', selectedOrder);
      
      // Mostrar valores únicos asignados
      console.log('🔢 Valores únicos asignados:');
      selectedOrder.forEach((color, index) => {
        const ref = D15_REFERENCE_VALUES.find(r => r.color === color);
        if (ref) {
          console.log(`  ${index}: ${ref.name} (${color}) = Valor ${ref.value}`);
        }
      });
      
      const analysisResult = analyzeColorblindness(selectedOrder);
      setResult(analysisResult);
      setTestCompleted(true);
    }
  };

  // Generar puntos para la gráfica circular
  const generateGraphPoints = (selectedColors: string[]): GraphPoint[] => {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const points: GraphPoint[] = [];
    
    selectedColors.forEach((color, index) => {
      const angle = (index / selectedColors.length) * 2 * Math.PI - Math.PI / 2; // Empezar desde arriba
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      points.push({
        x,
        y,
        value: index,
        color
      });
    });
    
    return points;
  };

  // Componente de gráfica circular simplificado (sin SVG)
  const ColorGraph = ({ points }: { points: GraphPoint[] }) => {
    // Verificar que tenemos puntos válidos
    if (!points || points.length === 0) {
      return (
        <View style={styles.graphContainer}>
          <Text style={{ color: '#000' }}>No hay datos para mostrar</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.graphContainer}>
        <View style={styles.simpleGraph}>
          <Text style={styles.graphTitle}>Gráfica de Resultados</Text>
          
          {/* Orden seleccionado visual */}
          <View style={styles.orderContainer}>
            <Text style={styles.orderTitle}>Orden seleccionado:</Text>
            <View style={styles.orderVisual}>
              {selectedOrder.map((color, index) => (
                <View key={index} style={styles.orderItem}>
                  <View style={[styles.orderCircle, { backgroundColor: color }]} />
                  <Text style={styles.orderNumber}>{index}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.orderSequence}>
              Secuencia: {selectedOrder.map((_, index) => index).join(' → ')}
            </Text>
          </View>
          
          {/* Información detallada */}
          <View style={styles.graphInfo}>
            <Text style={styles.graphInfoText}>
              • Puntos conectados: {points.length}
            </Text>
            <Text style={styles.graphInfoText}>
              • Orden de selección: {selectedOrder.map((_, i) => i).join(', ')}
            </Text>
            {result && (
              <>
                <Text style={styles.graphInfoText}>
                  • Errores detectados: ROJO {result.redError.toFixed(1)}%, VERDE {result.greenError.toFixed(1)}%, AZUL {result.blueError.toFixed(1)}%
                </Text>
                <Text style={styles.graphInfoText}>
                  • Error total: {result.totalError.toFixed(1)}%
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Componente de barras de error
  const ErrorBars = ({ result }: { result: ColorblindnessResult }) => {
    return (
      <View style={styles.errorBarsContainer}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Errores en los receptores</Text>
        
        {/* Barra roja */}
        <View style={styles.errorBarRow}>
          <Text style={[styles.errorLabel, { color: colors.text }]}>ROJO {result.redError.toFixed(0)}%</Text>
          <View style={[styles.errorBar, { backgroundColor: colors.inputBorder }]}>
            <View 
              style={[
                styles.errorBarFill, 
                { 
                  backgroundColor: '#FF0000', 
                  width: `${Math.min(result.redError, 100)}%` 
                }
              ]} 
            />
          </View>
        </View>
        
        {/* Barra verde */}
        <View style={styles.errorBarRow}>
          <Text style={[styles.errorLabel, { color: colors.text }]}>VERDE {result.greenError.toFixed(0)}%</Text>
          <View style={[styles.errorBar, { backgroundColor: colors.inputBorder }]}>
            <View 
              style={[
                styles.errorBarFill, 
                { 
                  backgroundColor: '#00FF00', 
                  width: `${Math.min(result.greenError, 100)}%` 
                }
              ]} 
            />
          </View>
        </View>
        
        {/* Barra azul */}
        <View style={styles.errorBarRow}>
          <Text style={[styles.errorLabel, { color: colors.text }]}>AZUL {result.blueError.toFixed(0)}%</Text>
          <View style={[styles.errorBar, { backgroundColor: colors.inputBorder }]}>
            <View 
              style={[
                styles.errorBarFill, 
                { 
                  backgroundColor: '#0000FF', 
                  width: `${Math.min(result.blueError, 100)}%` 
                }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };

  const allSelected = selectedOrder.length === D15_COLORS.length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Detección de daltonismo — Método D-15</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>Ordena los círculos según su tonalidad. Toca para añadir y vuelve a tocar para quitar.</Text>
        
        {/* Color de referencia */}
        <View style={[styles.referenceContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.referenceTitle, { color: colors.text }]}>Color de referencia (Valor 0):</Text>
          <View style={styles.referenceColor}>
            <View style={[styles.referenceCircle, { backgroundColor: '#3C7FC5' }]} />
            <Text style={[styles.referenceText, { color: colors.mutedText }]}>Azul 1</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {D15_COLORS.map((hex) => {
            const isSelected = selectedOrder.includes(hex);
            return (
              <TouchableOpacity
                key={hex}
                style={[
                  styles.circle,
                  { backgroundColor: hex },
                  isSelected && { borderWidth: 3, borderColor: colors.primary },
                ]}
                onPress={() => onToggleColor(hex)}
                activeOpacity={0.8}
              />
            );
          })}
        </View>

        <Text style={[styles.subtitle, { color: colors.mutedText, marginTop: 8 }]}>Orden seleccionado (toca para quitar):</Text>
        <View style={styles.selectedWrap}>
          {selectedOrder.map((item) => (
            <TouchableOpacity key={item} onPress={() => setSelectedOrder((prev) => prev.filter((c) => c !== item))}>
              <View style={[styles.circleSmall, { backgroundColor: item }]} />
            </TouchableOpacity>
          ))}
        </View>

        {testCompleted && result && (
          <View style={[styles.resultContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Resultado del Test</Text>
            <Text style={[styles.resultType, { 
              color: result.type === 'normal' ? '#27AE60' : '#E74C3C' 
            }]}>
              {result.type === 'normal' ? 'Visión Normal' : 
               result.type === 'deuteranopia' ? 'Deuteranopia' :
               result.type === 'protanopia' ? 'Protanopia' : 'Tritanopia'}
            </Text>
            <Text style={[styles.resultDescription, { color: colors.mutedText }]}>
              {result.description}
            </Text>
            <Text style={[styles.resultConfidence, { color: colors.mutedText }]}>
              Confianza: {result.confidence.toFixed(1)}%
            </Text>
            
            {/* Gráfica circular */}
            <View style={styles.graphSection}>
              <Text style={[styles.graphTitle, { color: colors.text }]}>Gráfica de Resultados</Text>
              <ColorGraph points={generateGraphPoints(selectedOrder)} />
            </View>
            
            {/* Barras de error */}
            <ErrorBars result={result} />
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.resetButton, { borderColor: colors.inputBorder }]} onPress={onResetOrder}>
            <Text style={[styles.resetText, { color: colors.text }]}>Reiniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!allSelected}
            onPress={testCompleted ? () => navigation.navigate('Home' as never) : onCompleteTest}
            style={[
              styles.nextButton,
              { backgroundColor: allSelected ? colors.primary : colors.inputBorder },
            ]}
            activeOpacity={allSelected ? 0.8 : 1}
          >
            <Text style={[styles.nextText, { color: allSelected ? '#ffffff' : colors.mutedText }]}>
              {testCompleted ? 'Ir a Inicio' : 'Analizar Resultado'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingVertical: 18, width: '100%', maxWidth: 560, alignSelf: 'center' },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  circle: { width: 56, height: 56, borderRadius: 28, margin: 8 },
  selectedWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  circleSmall: { width: 32, height: 32, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  resetButton: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  resetText: { fontSize: 16, fontWeight: '700' },
  nextButton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  nextText: { fontSize: 16, fontWeight: '800' },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultConfidence: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  referenceContainer: {
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  referenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  referenceColor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referenceCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  referenceText: {
    fontSize: 14,
    fontWeight: '500',
  },
  graphSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  graphContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  simpleGraph: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '100%',
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  graphSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  graphInfo: {
    marginTop: 8,
  },
  graphInfoText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  orderContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  orderVisual: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  orderItem: {
    alignItems: 'center',
    margin: 4,
  },
  orderCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  orderSequence: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  errorBarsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 100,
    textAlign: 'right',
    marginRight: 12,
  },
  errorBar: {
    flex: 1,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  errorBarFill: {
    height: '100%',
    borderRadius: 10,
  },
});
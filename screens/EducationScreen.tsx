import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/ThemeProvider';

const { width, height } = Dimensions.get('window');

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  colors: any;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
  colors,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <Animated.Text
          style={[
            styles.arrow,
            { color: colors.primary, transform: [{ rotate }] },
          ]}
        >
          ▶
        </Animated.Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

export default function EducationScreen() {
  const navigation = useNavigation();
  const { isDark, colors } = useTheme();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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

  const toggleSection = useCallback((section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const sections = [
    {
      id: 'what-is',
      title: '¿Qué es el daltonismo?',
      content: (
        <View>
          <Text style={[styles.contentText, { color: colors.mutedText }]}>
            El daltonismo, también conocido como deficiencia de visión del color, es una condición 
            que afecta la capacidad de una persona para distinguir ciertos colores. Esta condición 
            es más común de lo que se piensa y afecta aproximadamente al 8% de los hombres y al 0.5% 
            de las mujeres en todo el mundo.
          </Text>
          <Text style={[styles.contentText, { color: colors.mutedText, marginTop: 12 }]}>
            El daltonismo no significa que las personas vean todo en blanco y negro, como comúnmente 
            se cree. En realidad, la mayoría de las personas con daltonismo pueden ver algunos colores, 
            pero tienen dificultades para distinguir entre ciertos tonos.
          </Text>
        </View>
      ),
    },
    {
      id: 'causes',
      title: '¿Por qué se produce?',
      content: (
        <View>
          <Text style={[styles.contentText, { color: colors.mutedText }]}>
            El daltonismo se produce principalmente por problemas en los fotorreceptores de la retina, 
            específicamente en los conos. Los conos son células especializadas que nos permiten ver 
            los colores y están divididos en tres tipos:
          </Text>
          <View style={styles.listContainer}>
            <Text style={[styles.listItem, { color: colors.mutedText }]}>
              • <Text style={[styles.bold, { color: colors.text }]}>Conos L (rojos):</Text> Sensibles a longitudes de onda largas
            </Text>
            <Text style={[styles.listItem, { color: colors.mutedText }]}>
              • <Text style={[styles.bold, { color: colors.text }]}>Conos M (verdes):</Text> Sensibles a longitudes de onda medias
            </Text>
            <Text style={[styles.listItem, { color: colors.mutedText }]}>
              • <Text style={[styles.bold, { color: colors.text }]}>Conos S (azules):</Text> Sensibles a longitudes de onda cortas
            </Text>
          </View>
          <Text style={[styles.contentText, { color: colors.mutedText, marginTop: 12 }]}>
            Cuando uno o más tipos de conos no funcionan correctamente, se produce el daltonismo. 
            Esta condición es principalmente hereditaria y está ligada al cromosoma X.
          </Text>
        </View>
      ),
    },
    {
      id: 'who-affected',
      title: '¿Quién es más propenso?',
      content: (
        <View>
          <Text style={[styles.contentText, { color: colors.mutedText }]}>
            El daltonismo afecta principalmente a los hombres debido a su herencia genética:
          </Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>8%</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Hombres</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>0.5%</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Mujeres</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>1 en 12</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Probabilidad masculina</Text>
            </View>
          </View>
          <Text style={[styles.contentText, { color: colors.mutedText, marginTop: 12 }]}>
            Las mujeres pueden ser portadoras del gen del daltonismo sin manifestar la condición, 
            pero pueden transmitirlo a sus hijos varones.
          </Text>
        </View>
      ),
    },
    {
      id: 'types',
      title: 'Tipos de daltonismo',
      content: (
        <View>
          <View style={styles.typeContainer}>
            <View style={[styles.typeItem, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.typeTitle, { color: colors.primary }]}>Protanopia</Text>
              <Text style={[styles.typeDescription, { color: colors.mutedText }]}>
                Ausencia de conos L (rojos). Dificultad para distinguir rojos y verdes.
              </Text>
            </View>
            <View style={[styles.typeItem, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.typeTitle, { color: colors.primary }]}>Deuteranopia</Text>
              <Text style={[styles.typeDescription, { color: colors.mutedText }]}>
                Ausencia de conos M (verdes). Confusión entre rojos y verdes.
              </Text>
            </View>
            <View style={[styles.typeItem, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.typeTitle, { color: colors.primary }]}>Tritanopia</Text>
              <Text style={[styles.typeDescription, { color: colors.mutedText }]}>
                Ausencia de conos S (azules). Dificultad con azules y amarillos.
              </Text>
            </View>
            <View style={[styles.typeItem, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.typeTitle, { color: colors.primary }]}>Monocromatismo</Text>
              <Text style={[styles.typeDescription, { color: colors.mutedText }]}>
                Solo un tipo de cono funcional. Visión en escala de grises.
              </Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'glossary',
      title: 'Glosario de términos',
      content: (
        <View>
          <View style={styles.glossaryContainer}>
            <View style={styles.glossaryItem}>
              <Text style={[styles.glossaryTerm, { color: colors.primary }]}>Cromosoma X</Text>
              <Text style={[styles.glossaryDefinition, { color: colors.mutedText }]}>
                Cromosoma sexual que contiene genes relacionados con la visión del color.
              </Text>
            </View>
            <View style={styles.glossaryItem}>
              <Text style={[styles.glossaryTerm, { color: colors.primary }]}>Conos</Text>
              <Text style={[styles.glossaryDefinition, { color: colors.mutedText }]}>
                Células fotorreceptoras en la retina responsables de la visión del color.
              </Text>
            </View>
            <View style={styles.glossaryItem}>
              <Text style={[styles.glossaryTerm, { color: colors.primary }]}>Retina</Text>
              <Text style={[styles.glossaryDefinition, { color: colors.mutedText }]}>
                Capa de tejido en la parte posterior del ojo que contiene las células sensibles a la luz.
              </Text>
            </View>
            <View style={styles.glossaryItem}>
              <Text style={[styles.glossaryTerm, { color: colors.primary }]}>Longitud de onda</Text>
              <Text style={[styles.glossaryDefinition, { color: colors.mutedText }]}>
                Distancia entre picos de ondas de luz, que determina el color que percibimos.
              </Text>
            </View>
            <View style={styles.glossaryItem}>
              <Text style={[styles.glossaryTerm, { color: colors.primary }]}>Fotorreceptores</Text>
              <Text style={[styles.glossaryDefinition, { color: colors.mutedText }]}>
                Células especializadas que convierten la luz en señales nerviosas.
              </Text>
            </View>
            <View style={styles.glossaryItem}>
              <Text style={[styles.glossaryTerm, { color: colors.primary }]}>Deficiencia de visión del color</Text>
              <Text style={[styles.glossaryDefinition, { color: colors.mutedText }]}>
                Término médico más preciso para describir el daltonismo.
              </Text>
            </View>
          </View>
        </View>
      ),
    },
  ];

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
        <Text style={[styles.headerTitle, { color: '#ffffff' }]}>Aprende sobre el daltonismo</Text>
      </View>

      {/* Contenido */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {sections.map((section) => (
            <ExpandableSection
              key={section.id}
              title={section.title}
              isExpanded={expandedSections[section.id] || false}
              onToggle={() => toggleSection(section.id)}
              colors={colors}
            >
              {section.content}
            </ExpandableSection>
          ))}
        </ScrollView>
      </Animated.View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  arrow: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 12,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  typeContainer: {
    gap: 12,
  },
  typeItem: {
    padding: 16,
    borderRadius: 8,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  glossaryContainer: {
    gap: 16,
  },
  glossaryItem: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  glossaryTerm: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  glossaryDefinition: {
    fontSize: 14,
    lineHeight: 20,
  },
});

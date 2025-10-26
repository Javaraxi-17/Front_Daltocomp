import { GOOGLE_AI_CONFIG } from '../config/api';

// Servicio para integración con Google AI Studio API
export interface ColorRecommendation {
  strategy: string;
  description: string;
  tips: string[];
}

export interface AIRecommendationResponse {
  recommendations: ColorRecommendation[];
  success: boolean;
  error?: string;
}

class GoogleAIService {
  private readonly API_KEY: string;
  private readonly API_URL: string;

  constructor() {
    this.API_KEY = GOOGLE_AI_CONFIG.API_KEY;
    this.API_URL = GOOGLE_AI_CONFIG.BASE_URL;
    
    if (!this.API_KEY || this.API_KEY === 'TU_API_KEY_AQUI') {
      console.warn('⚠️ Google AI API Key no configurada. Las recomendaciones no funcionarán.');
    }
  }

  /**
   * Genera recomendaciones para distinguir un color específico
   */
  async getColorRecommendations(colorName: string, colorCategory: string): Promise<AIRecommendationResponse> {
    try {
      if (!this.API_KEY) {
        return {
          recommendations: [],
          success: false,
          error: 'API Key no configurada'
        };
      }

      const prompt = this.buildRecommendationPrompt(colorName, colorCategory);
      
      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096, // Aumentado para evitar el corte de respuestas
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('🔍 Respuesta de API:', JSON.stringify(data, null, 2));
      
      // Verificar si hay errores en la respuesta
      if (data.error) {
        throw new Error(`Error de API: ${data.error.message || 'Error desconocido'}`);
      }
      
      if (!data.candidates || !data.candidates[0]) {
        throw new Error('No se encontraron candidatos en la respuesta de la API');
      }
      
      const candidate = data.candidates[0];
      
      // Verificar si el candidato fue bloqueado por seguridad
      if (candidate.finishReason === 'SAFETY') {
        throw new Error('Respuesta bloqueada por filtros de seguridad');
      }
      
      // Verificar si la respuesta se cortó por límite de tokens
      if (candidate.finishReason === 'MAX_TOKENS') {
        console.warn('⚠️ Respuesta cortada por límite de tokens, usando fallback');
        return {
          recommendations: this.generateFallbackRecommendations(),
          success: false,
          error: 'Respuesta cortada por límite de tokens'
        };
      }
      
      if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
        throw new Error('Contenido inválido en la respuesta de la API');
      }

      const aiResponse = candidate.content.parts[0].text;
      console.log('🤖 Respuesta de IA:', aiResponse);
      
      const recommendations = this.parseAIResponse(aiResponse);

      return {
        recommendations,
        success: true
      };

    } catch (error) {
      console.error('Error obteniendo recomendaciones de IA:', error);
      return {
        recommendations: [],
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Construye el prompt para la IA
   */
  private buildRecommendationPrompt(colorName: string, colorCategory: string): string {
    return `Eres un experto en daltonismo. Proporciona 3 estrategias para distinguir el color "${colorName}" (${colorCategory}).

Responde SOLO con este JSON:

{
  "recommendations": [
    {
      "strategy": "Estrategia 1",
      "description": "Descripción breve y práctica",
      "tips": ["Consejo 1", "Consejo 2", "Consejo 3"]
    },
    {
      "strategy": "Estrategia 2", 
      "description": "Descripción breve y práctica",
      "tips": ["Consejo 1", "Consejo 2", "Consejo 3"]
    },
    {
      "strategy": "Estrategia 3",
      "description": "Descripción breve y práctica", 
      "tips": ["Consejo 1", "Consejo 2", "Consejo 3"]
    }
  ]
}

Enfócate en: contraste, saturación, brillo, contexto. Sé conciso y práctico.`;
  }

  /**
   * Parsea la respuesta de la IA
   */
  private parseAIResponse(response: string): ColorRecommendation[] {
    try {
      console.log('🔍 Parseando respuesta de IA:', response);
      
      // Limpiar la respuesta para extraer solo el JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('⚠️ No se encontró JSON válido en la respuesta');
        return this.generateFallbackRecommendations();
      }

      const jsonStr = jsonMatch[0];
      console.log('📝 JSON extraído:', jsonStr);
      
      const parsed = JSON.parse(jsonStr);
      console.log('✅ JSON parseado:', parsed);
      
      if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        console.warn('⚠️ Formato de respuesta inválido - no hay recomendaciones');
        return this.generateFallbackRecommendations();
      }

      const recommendations = parsed.recommendations.map((rec: any) => ({
        strategy: rec.strategy || 'Estrategia no especificada',
        description: rec.description || 'Descripción no disponible',
        tips: Array.isArray(rec.tips) ? rec.tips : []
      }));
      
      console.log('✅ Recomendaciones procesadas:', recommendations);
      return recommendations;

    } catch (error) {
      console.error('❌ Error parseando respuesta de IA:', error);
      console.log('🔄 Usando recomendaciones de fallback');
      
      // Fallback: generar recomendaciones básicas
      return this.generateFallbackRecommendations();
    }
  }

  /**
   * Genera recomendaciones básicas como fallback
   */
  private generateFallbackRecommendations(): ColorRecommendation[] {
    return [
      {
        strategy: "Uso de contexto y patrones",
        description: "Identifica el color basándote en su contexto y patrones visuales conocidos.",
        tips: [
          "Observa el entorno donde aparece el color",
          "Busca patrones o formas que te ayuden a identificarlo",
          "Relaciona el color con objetos familiares"
        ]
      },
      {
        strategy: "Comparación con colores conocidos",
        description: "Compara el color con otros colores que sí puedes distinguir claramente.",
        tips: [
          "Mantén una paleta de colores de referencia",
          "Usa aplicaciones de identificación de colores",
          "Pide ayuda a otras personas para confirmar"
        ]
      },
      {
        strategy: "Uso de tecnología asistiva",
        description: "Aprovecha herramientas tecnológicas diseñadas para personas con daltonismo.",
        tips: [
          "Usa aplicaciones de identificación de colores",
          "Activa filtros de color en tu dispositivo",
          "Considera usar lentes especializados"
        ]
      }
    ];
  }

  /**
   * Verifica si el servicio está disponible
   */
  isAvailable(): boolean {
    return !!this.API_KEY;
  }

  /**
   * Verifica la conectividad con la API de Google AI
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.API_KEY) {
        console.warn('⚠️ API Key no configurada');
        return false;
      }

      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hola, responde solo "OK"'
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10,
          }
        })
      });

      if (!response.ok) {
        console.error('❌ Error de conectividad:', response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      console.log('✅ Conexión con Google AI exitosa');
      return true;

    } catch (error) {
      console.error('❌ Error probando conexión:', error);
      return false;
    }
  }
}

export const googleAIService = new GoogleAIService();

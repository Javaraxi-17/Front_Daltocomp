# Configuración de Google AI Studio para Recomendaciones de Colores

## 📋 Pasos para Configurar la API Key

### 1. Obtener API Key de Google AI Studio

1. Ve a [Google AI Studio](https://aistudio.google.com/app/api-keys)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Crear clave de API" (Create API key)
4. Copia la API key generada
5. **IMPORTANTE**: Configura la facturación para activar la API

### 2. Configurar la API Key en el Proyecto

1. Abre el archivo `config/api.ts`
2. Reemplaza `'TU_API_KEY_AQUI'` con tu API key real:

```typescript
export const GOOGLE_AI_CONFIG = {
  // Reemplaza con tu API key de Google AI Studio
  API_KEY: 'tu-api-key-real-aqui', // ← Cambia esto
  
  // URL base de la API de Google AI - Usando Gemini 2.5 Flash (más rápido e inteligente)
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
};
```

### 3. Verificar la Configuración

Una vez configurada la API key, la aplicación:

- ✅ Generará recomendaciones personalizadas para cada color detectado
- ✅ Mostrará 3 estrategias específicas para distinguir el color
- ✅ Incluirá consejos prácticos y aplicables
- ✅ Funcionará automáticamente después de detectar un color

## 🔧 Funcionalidades Implementadas

### Servicio de IA (`services/googleAIService.ts`)
- **Integración con Gemini 2.5 Flash** - Modelo más rápido e inteligente
- **Generación de recomendaciones científicamente fundamentadas**
- **Configuración de seguridad avanzada** para contenido apropiado
- **Manejo de errores y fallbacks** robusto
- **Parsing inteligente de respuestas de IA** con validación JSON
- **Prompts optimizados** para daltonismo y accesibilidad visual

### Interfaz de Usuario
- Sección "Recomendaciones para Distinguir el Color"
- Indicador de carga durante la generación
- Tarjetas con estrategias y consejos
- Diseño responsive y accesible

### Características de las Recomendaciones
- **3 estrategias específicas** para cada color
- **Consejos prácticos** aplicables en la vida diaria
- **Enfoque en daltonismo** y accesibilidad visual
- **Respuestas personalizadas** basadas en el color detectado

## 🚀 Ventajas de Gemini 2.5 Flash

Según la [documentación oficial de Google AI](https://ai.google.dev/gemini-api/docs/models?hl=es-419#experimental):

- **⚡ Más rápido**: Mejor relación precio-rendimiento
- **🧠 Más inteligente**: Capacidades integrales mejoradas
- **📊 Procesamiento a gran escala**: Ideal para tareas de gran volumen
- **🔧 Baja latencia**: Respuestas más rápidas
- **🎯 Casos de uso de agentes**: Perfecto para recomendaciones personalizadas
- **📝 Contexto extendido**: Hasta 1,048,576 tokens de entrada
- **🛡️ Configuración de seguridad**: Filtros de contenido apropiados

## 🚨 Notas Importantes

1. **Costo**: Google AI Studio tiene un plan gratuito con límites de uso
2. **Privacidad**: Las imágenes no se envían a Google, solo el nombre del color
3. **Fallback**: Si la API no está disponible, se muestran recomendaciones básicas
4. **Rendimiento**: Las recomendaciones se generan automáticamente después de detectar un color
5. **Facturación**: Necesaria para activar la API (plan gratuito incluye $15 USD mensuales)

## 🐛 Solución de Problemas

### Error: "API Key no configurada"
- Verifica que hayas reemplazado `'TU_API_KEY_AQUI'` con tu API key real
- Asegúrate de que la API key sea válida y activa

### Error: "No se pudieron obtener recomendaciones"
- Verifica tu conexión a internet
- Confirma que tu API key tiene permisos para usar Gemini
- Revisa los límites de uso en Google AI Studio

### Recomendaciones genéricas
- Si ves recomendaciones básicas, significa que la API no está funcionando
- Verifica la configuración de la API key
- Revisa la consola para errores específicos

## 📱 Uso en la Aplicación

1. **Detecta un color** usando la cámara
2. **Espera el análisis** del color dominante
3. **Ve las recomendaciones** que aparecen automáticamente
4. **Lee las estrategias** y consejos prácticos
5. **Aplica las recomendaciones** en tu vida diaria

¡Las recomendaciones están diseñadas para ser útiles y aplicables para personas con daltonismo!

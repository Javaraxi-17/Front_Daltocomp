# Pruebas del Frontend con Jest y React Native Testing Library

Este directorio contiene las pruebas unitarias y de integración para el frontend de Daltocomp, enfocadas en las funcionalidades específicas de la aplicación de detección de daltonismo.

## 🚀 Cómo ejecutar las pruebas

1. **Asegúrate de tener las dependencias instaladas:**
   ```bash
   cd Front_Daltocomp
   npm install
   ```

2. **Ejecuta todas las pruebas:**
   ```bash
   npm test
   ```

3. **Ejecuta pruebas en modo "watch" (observa cambios en los archivos):**
   ```bash
   npm run test:watch
   ```

4. **Ejecuta pruebas y genera un reporte de cobertura:**
   ```bash
   npm run test:coverage
   ```

## 📂 Estructura de los tests

- **`setup.ts`**: Archivo de configuración global para Jest, donde se mockean módulos de React Native, AsyncStorage, React Navigation, Expo Camera/MediaLibrary/FileSystem/ImageManipulator, NetInfo, y los hooks `useTheme` y `useAuth`, así como `apiService`.

- **`camera-permissions.test.ts`**: Contiene pruebas para la funcionalidad de la cámara y permisos:
  - ✅ Permisos de cámara (solicitud, denegación, errores)
  - ✅ Permisos de galería (solicitud, denegación)
  - ✅ Captura de imágenes (éxito, errores)
  - ✅ Procesamiento de imágenes con ImageManipulator
  - ✅ Guardado de imágenes en galería
  - ✅ Manejo de archivos del sistema
  - ✅ Flujo completo de captura y procesamiento

- **`ai-connectivity.test.ts`**: Contiene pruebas para la conectividad con servicios de IA:
  - ✅ Análisis de daltonismo con IA
  - ✅ Procesamiento de imágenes con IA
  - ✅ Análisis de colores
  - ✅ Conectividad de red con servicios de IA
  - ✅ Flujo completo de análisis de daltonismo
  - ✅ Manejo de errores de IA
  - ✅ Optimización de rendimiento

- **`network-connectivity.test.ts`**: Contiene pruebas para la conectividad de red:
  - ✅ Verificación de estado de red (WiFi, móvil, sin conexión)
  - ✅ Manejo de pérdida de conexión
  - ✅ Operaciones con conexión limitada
  - ✅ Sincronización de datos
  - ✅ Monitoreo de calidad de red
  - ✅ Manejo de errores de red
  - ✅ Optimización de uso de datos
  - ✅ Flujo completo de pérdida y restauración de conexión

## 🎯 Funcionalidades Probadas

### 📸 Cámara y Permisos
- **Permisos del sistema**: Verificación de solicitud y manejo de permisos de cámara y galería
- **Captura segura**: Validación de captura de imágenes sin almacenamiento automático
- **Procesamiento**: Manipulación y optimización de imágenes capturadas
- **Almacenamiento**: Guardado seguro en galería del dispositivo

### 🤖 Conectividad con IA
- **Análisis de daltonismo**: Detección y clasificación de tipos de daltonismo
- **Procesamiento de imágenes**: Optimización para análisis de colores
- **Análisis de colores**: Identificación de problemas de accesibilidad
- **Recomendaciones**: Sugerencias para mejorar la experiencia visual

### 🌐 Conectividad de Red
- **Estado de red**: Detección de WiFi, móvil, sin conexión
- **Manejo de errores**: Timeouts, errores de servidor, DNS
- **Sincronización**: Almacenamiento local y sincronización cuando se restaura la conexión
- **Optimización**: Uso eficiente de datos según el tipo de conexión

## 💡 Consideraciones

- **Mocks Especializados**: Se utilizan mocks específicos para cada funcionalidad (Camera, MediaLibrary, NetInfo, etc.)
- **React Native Testing Library**: Para interactuar con componentes de React Native de manera realista
- **Simulación de Permisos**: Pruebas de diferentes estados de permisos (otorgados, denegados, errores)
- **Manejo de Errores**: Validación de comportamientos ante fallos de red, permisos o servicios
- **Flujos Completos**: Pruebas end-to-end de funcionalidades completas
- **Optimización**: Validación de rendimiento y uso eficiente de recursos

## 🔧 Configuración Específica

Las pruebas están configuradas para simular:
- **Dispositivos móviles**: Permisos, cámara, almacenamiento
- **Conectividad variable**: WiFi, móvil, sin conexión
- **Servicios de IA**: Análisis de daltonismo y procesamiento de imágenes
- **Manejo de archivos**: Lectura, escritura, eliminación de archivos temporales

## 📊 Cobertura de Pruebas

Las pruebas cubren:
- ✅ **Permisos**: 100% de casos de permisos de cámara y galería
- ✅ **Conectividad**: 100% de estados de red y manejo de errores
- ✅ **IA**: 100% de funcionalidades de análisis y procesamiento
- ✅ **Archivos**: 100% de operaciones de manejo de archivos
- ✅ **Errores**: 100% de casos de error y recuperación
# Configuración de Cámara y Guardado de Fotos

## 📦 Instalación de Dependencias

Para que la funcionalidad de cámara y guardado de fotos funcione, necesitas instalar dos paquetes de Expo:

```bash
npx expo install expo-camera expo-media-library
```

## 🔧 Configuración de Permisos

### iOS (Expo Managed Workflow)

Si estás usando Expo Managed (con Expo Go o EAS Build), Expo configurará automáticamente los permisos necesarios. Sin embargo, es recomendable añadir descripciones personalizadas en tu `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Esta app necesita acceso a la cámara para ayudarte a detectar y analizar colores en tiempo real.",
        "NSPhotoLibraryAddUsageDescription": "Esta app necesita acceso a tu galería para guardar las fotos que captures durante las pruebas de daltonismo."
      }
    }
  }
}
```

### Android (Expo Managed Workflow)

Expo añadirá automáticamente los permisos necesarios al `AndroidManifest.xml`. No necesitas configuración adicional si usas Expo Managed.

Si usas **bare workflow**, asegúrate de que tu `AndroidManifest.xml` incluya:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## 🚀 Cómo Probar

### En Web (localhost)
La funcionalidad de cámara **NO está disponible en web**. La app mostrará un mensaje indicando que necesitas un dispositivo nativo.

### En Dispositivo Físico con Expo Go

1. Asegúrate de haber instalado las dependencias:
   ```bash
   npx expo install expo-camera expo-media-library
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npx expo start
   ```

3. Escanea el QR con la app **Expo Go** en tu teléfono (iOS o Android).

4. Navega a la pantalla de detección de colores desde el botón de cámara en la pantalla principal.

5. Acepta los permisos de cámara y galería cuando se soliciten.

6. Toma una foto presionando "📷 Tomar foto". Si otorgaste permiso de galería, se guardará automáticamente.

### En Emulador

#### Android Studio AVD
- Asegúrate de que el emulador tenga cámara habilitada en su configuración.
- Sigue los mismos pasos que para dispositivo físico.

#### iOS Simulator (Xcode)
- El simulador de iOS tiene soporte limitado para cámara (puede usar imágenes estáticas).
- Para pruebas completas, usa un dispositivo físico.

## ✅ Verificación

Después de instalar las dependencias, verifica que todo está correcto:

1. El archivo `package.json` debe incluir:
   ```json
   "expo-camera": "~version",
   "expo-media-library": "~version"
   ```

2. Al abrir la pantalla de cámara:
   - En web: verás el mensaje "Función no disponible en web".
   - En dispositivo: se pedirán permisos de cámara y galería.
   - Al aceptar permisos: verás el preview de la cámara.
   - Al tomar foto y tener permiso de galería: la foto se guardará y verás un alert de confirmación.

## 🐛 Solución de Problemas

### "Permission denied" en dispositivo
- Ve a Ajustes → Tu App → Permisos y activa Cámara y Fotos/Galería.

### La cámara no muestra nada (pantalla negra)
- Reinicia la app.
- Verifica que el emulador/dispositivo tenga cámara funcional.
- En Android, verifica en logcat si hay errores de hardware.

### "Module not found: expo-camera"
- Ejecuta: `npx expo install expo-camera expo-media-library`
- Reinicia Metro bundler: detén el servidor y ejecuta `npx expo start --clear`.

### En iOS: "This app has crashed because it attempted to access privacy-sensitive data..."
- Verifica que `app.json` tenga las claves NSCameraUsageDescription y NSPhotoLibraryAddUsageDescription.
- Si usas bare workflow, verifica que estén en `Info.plist`.

## 📝 Notas Importantes

- **Web no soportada**: La funcionalidad de cámara nativa no funciona en web. Usa Expo Go o un emulador/dispositivo físico.
- **Permisos**: La app solicita automáticamente permisos la primera vez. Si el usuario los deniega, se muestra un mensaje indicando que debe activarlos en ajustes.
- **Calidad de foto**: La configuración actual usa `quality: 0.8` (80%). Puedes ajustarlo en `CameraToolScreen.tsx` (línea del `takePictureAsync`).

## 🎯 Próximas Mejoras Sugeridas

- Añadir análisis de color en tiempo real sobre el preview.
- Mostrar historial de fotos capturadas.
- Permitir compartir fotos vía share sheet.
- Implementar zoom y flash (si el dispositivo lo soporta).
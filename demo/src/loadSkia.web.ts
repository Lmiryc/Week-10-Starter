import '@expo/metro-runtime';
import { LoadSkiaWeb as initializeCanvasKit } from '@shopify/react-native-skia/lib/module/web';

export function LoadSkiaWeb() {
  return initializeCanvasKit({ locateFile: (file) => new URL(file, document.baseURI).href });
}

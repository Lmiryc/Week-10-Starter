import '@expo/metro-runtime';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { registerRootComponent } from 'expo';

async function start() {
  await LoadSkiaWeb({ locateFile: (file) => new URL(file, document.baseURI).href });
  const { default: App } = await import('./src/App');
  registerRootComponent(App);
}

void start().catch((error) => {
  console.error('PantryShare could not start:', error);
  throw error;
});

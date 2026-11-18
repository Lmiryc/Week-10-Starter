import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import { LoadSkiaWeb } from './src/loadSkia';

async function start() {
  if (Platform.OS === 'web') await LoadSkiaWeb();
  const { default: App } = await import('./src/App');
  registerRootComponent(App);
}

void start().catch((error) => {
  console.error('PantryShare could not start:', error);
  throw error;
});

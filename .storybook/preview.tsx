/// <reference types="vite/client" />
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { Preview } from '@storybook/react-vite';
import wasmUrl from 'canvaskit-wasm/bin/full/canvaskit.wasm?url';
import { StyleSheet, View } from 'react-native';
import { tokens } from '../src/tokens';

// Story modules import Skia, so initialize CanvasKit before Storybook loads them.
await LoadSkiaWeb({ locateFile: () => wasmUrl });

const styles = StyleSheet.create({
  surface: { alignSelf: 'center', width: '100%', maxWidth: 920, padding: 22 },
});

const preview: Preview = {
  decorators: [(Story) => <View style={styles.surface}><Story /></View>],
  initialGlobals: { backgrounds: { value: 'paper' } },
  parameters: {
    layout: 'fullscreen',
    options: { storySort: { order: ['PantryShare', 'Components'] } },
    backgrounds: {
      options: {
        paper: { name: 'PantryShare paper', value: tokens.color.paper },
        white: { name: 'White', value: tokens.color.white },
      },
    },
    controls: { expanded: true },
  },
};

export default preview;

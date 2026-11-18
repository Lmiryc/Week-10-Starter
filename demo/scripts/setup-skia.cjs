const { copyFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const destination = join(__dirname, '..', 'public');
mkdirSync(destination, { recursive: true });
const skiaEntry = require.resolve('@shopify/react-native-skia');
const wasm = require.resolve('canvaskit-wasm/bin/full/canvaskit.wasm', { paths: [skiaEntry] });
copyFileSync(wasm, join(destination, 'canvaskit.wasm'));

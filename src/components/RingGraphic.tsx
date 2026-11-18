import { Canvas, Circle, Path } from '@shopify/react-native-skia';

export function fraction(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

interface RingGraphicProps {
  size: number;
  progress: number;
  color: string;
  track: string;
}

/** Labels live in React Native so they remain available to assistive technology. */
export function RingGraphic({ size, progress, color, track }: RingGraphicProps) {
  const center = size / 2;
  const stroke = Math.max(4, size * 0.085);
  const radius = center - stroke;
  const angle = progress * 2 * Math.PI;
  const endX = center + radius * Math.sin(angle);
  const endY = center - radius * Math.cos(angle);
  const arc = `M ${center} ${center - radius} A ${radius} ${radius} 0 ${progress > 0.5 ? 1 : 0} 1 ${endX} ${endY}`;

  return (
    <Canvas style={{ width: size, height: size }} __destroyWebGLContextAfterRender>
      <Circle cx={center} cy={center} r={radius} color={track} style="stroke" strokeWidth={stroke} />
      {progress === 1 && (
        <Circle cx={center} cy={center} r={radius} color={color} style="stroke" strokeWidth={stroke} />
      )}
      {progress > 0 && progress < 1 && (
        <Path path={arc} color={color} style="stroke" strokeWidth={stroke} strokeCap="round" />
      )}
    </Canvas>
  );
}

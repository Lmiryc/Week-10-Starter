import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../tokens';

export interface AvailabilityMeterProps {
  remaining: number;
  /** Total portions in the listing before reservations. */
  capacity: number;
}

const segments = 6;
const segmentWidth = 12;
const gap = 4;

function count(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function AvailabilityMeter({ remaining, capacity }: AvailabilityMeterProps) {
  const total = count(capacity);
  const left = Math.min(count(remaining), total);
  const share = total > 0 ? left / total : 0;
  const filled = Math.ceil(share * segments);
  const label = left === 0 ? 'All claimed' : left === 1 ? '1 portion left' : `${left} portions left`;
  const accent = share > 0 && share <= 0.25 ? tokens.color.amber : tokens.color.green;

  return (
    <View accessible accessibilityLabel={left > 0 ? `${label}, ${total} originally available` : label} style={styles.row}>
      <Canvas style={{ width: segments * (segmentWidth + gap) - gap, height: 12 }} __destroyWebGLContextAfterRender>
        {Array.from({ length: segments }, (_, index) => (
          <RoundedRect
            key={index}
            x={index * (segmentWidth + gap)}
            y={1}
            width={segmentWidth}
            height={10}
            r={3}
            color={index < filled ? accent : tokens.color.line}
          />
        ))}
      </Canvas>
      <Text style={[styles.label, { color: left > 0 ? accent : tokens.color.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 9 },
  label: { fontSize: 13, fontWeight: '600' },
});

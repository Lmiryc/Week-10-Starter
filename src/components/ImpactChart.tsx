import { Canvas, Line, RoundedRect, vec } from '@shopify/react-native-skia';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../tokens';

export interface ImpactChartProps {
  /** Ordered periods with concise labels, such as Mon or Week 1. */
  data: ReadonlyArray<{ label: string; value: number }>;
  title?: string;
  unit?: string;
}

const plotHeight = 108;
const baseline = plotHeight - 4;

export function ImpactChart({ data, title = 'Food shared', unit = 'portions' }: ImpactChartProps) {
  const [width, setWidth] = useState(0);
  const values = data.map(({ value }) => Number.isFinite(value) && value > 0 ? value : 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  const max = values.reduce((largest, value) => Math.max(largest, value), 1);
  const slot = data.length ? width / data.length : 0;
  const bar = Math.min(28, slot * 0.6);

  return (
    <View
      accessible
      accessibilityLabel={data.length
        ? `${title}, ${total} ${unit} total. ${data.map(({ label }, i) => `${label}: ${values[i]}`).join(', ')}`
        : `${title}, no activity yet`}
      style={styles.chart}
    >
      <Text style={styles.title}>{title}</Text>
      {data.length === 0 ? <Text style={styles.detail}>No activity yet</Text> : (
        <>
          <Text style={styles.detail}>{total.toLocaleString()} {unit} total</Text>
          <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
            {width > 0 && (
              <Canvas style={{ width, height: plotHeight }} __destroyWebGLContextAfterRender>
                {[0, 1, 2].map((i) => {
                  const y = 8 + i * (baseline - 8) / 2;
                  return <Line key={i} p1={vec(0, y)} p2={vec(width, y)} color={tokens.color.line} strokeWidth={1} />;
                })}
                {values.map((value, i) => {
                  const height = value / max * (baseline - 8);
                  return height > 0 && (
                    <RoundedRect
                      key={i}
                      x={slot * (i + 0.5) - bar / 2}
                      y={baseline - height}
                      width={bar}
                      height={height}
                      r={Math.min(6, bar / 2, height / 2)}
                      color={value === max ? tokens.color.green : '#83BA8B'}
                    />
                  );
                })}
              </Canvas>
            )}
          </View>
          <View style={styles.labels}>
            {data.map(({ label }, i) => (
              <View key={i} style={styles.period}>
                <Text style={styles.value}>{values[i].toLocaleString()}</Text>
                <Text style={styles.detail}>{label}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { gap: 6 },
  title: { color: tokens.color.ink, fontSize: 17, fontWeight: '700' },
  detail: { color: tokens.color.muted, fontSize: 12 },
  labels: { flexDirection: 'row' },
  period: { flex: 1, alignItems: 'center', gap: 2 },
  value: { color: tokens.color.ink, fontSize: 13, fontWeight: '700' },
});

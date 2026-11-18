import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../tokens';
import { fraction, RingGraphic } from './RingGraphic';

export interface ProgressRingProps {
  variant: 'recipe' | 'points';
  value: number;
  /** The target for points or the total number of ingredients for a recipe. */
  target: number;
  label?: string;
}

export function ProgressRing({ variant, value, target, label }: ProgressRingProps) {
  const validTarget = Number.isFinite(target) && target > 0;
  const recipe = variant === 'recipe';
  const progress = validTarget ? fraction(value / target) : 0;
  const title = label ?? (recipe ? 'Recipe match' : 'PantryPoints');
  const points = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const display = !validTarget ? '—' : recipe ? `${Math.round(progress * 100)}%` : points.toLocaleString();
  const detail = !validTarget ? 'No target yet' : recipe ? 'Ingredients on hand' : `of ${target.toLocaleString()} points`;
  const color = recipe ? tokens.color.green : tokens.color.plum;
  const track = recipe ? tokens.color.sage : tokens.color.lavender;

  return (
    <View accessible accessibilityLabel={`${title}, ${validTarget ? `${display} ${detail}` : detail}`} style={styles.row}>
      <View style={styles.dial}>
        <RingGraphic size={90} progress={progress} color={color} track={track} />
        <View style={styles.center}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.number, { color }]}>{display}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  dial: { width: 90, height: 90 },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  number: { fontSize: 21, fontWeight: '800', fontVariant: ['tabular-nums'] },
  info: { flex: 1, gap: 4 },
  title: { color: tokens.color.ink, fontSize: 16, fontWeight: '700' },
  detail: { color: tokens.color.muted, fontSize: 13 },
});

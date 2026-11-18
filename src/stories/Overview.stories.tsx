import type { Meta, StoryObj } from '@storybook/react-vite';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import {
  AvailabilityMeter, FeatureBanner, ImpactChart, PickupAreaIllustration,
  PickupCountdown, ProgressRing, tokens,
} from '../index';

const periods = [
  { label: 'Mon', value: 5 }, { label: 'Tue', value: 8 }, { label: 'Wed', value: 6 },
  { label: 'Thu', value: 12 }, { label: 'Fri', value: 10 }, { label: 'Sat', value: 17 },
  { label: 'Sun', value: 14 },
];
const demoNow = Date.now();

function Overview() {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.gallery}>
      <FeatureBanner
        title="PantryShare Skia components"
        description="Reusable graphics for discovering food, planning pickups, and seeing what our neighbors have shared."
      />
      <View style={[styles.columns, width >= 670 && styles.wide]}>
        <View style={styles.column}>
          <View style={styles.card}>
            <Text style={styles.section}>Discover</Text>
            <Text style={styles.heading}>Sourdough from the bakery</Text>
            <AvailabilityMeter remaining={2} capacity={10} />
            <View style={styles.divider} />
            <PickupCountdown startsAt={demoNow - 24 * 60_000} endsAt={demoNow + 12 * 60_000} />
          </View>
          <View style={styles.card}>
            <Text style={styles.section}>Nearby</Text>
            <PickupAreaIllustration neighborhood="Kerrytown" />
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.card}>
            <Text style={styles.section}>AI Recipes</Text>
            <ProgressRing variant="recipe" value={6} target={8} label="Roasted vegetable soup" />
          </View>
          <View style={styles.card}>
            <Text style={styles.section}>Profile</Text>
            <ProgressRing variant="points" value={320} target={500} />
            <View style={styles.divider} />
            <ImpactChart data={periods} title="Shared this week" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gallery: { gap: 16 },
  columns: { gap: 16 },
  wide: { flexDirection: 'row', alignItems: 'flex-start' },
  column: { flex: 1, minWidth: 0, gap: 16 },
  card: {
    borderRadius: tokens.radius.card, borderWidth: 1, borderColor: tokens.color.line,
    backgroundColor: tokens.color.white, padding: 18, gap: 12,
  },
  section: { color: tokens.color.green, fontWeight: '700', fontSize: 13 },
  heading: { color: tokens.color.ink, fontWeight: '800', fontSize: 19 },
  divider: { height: 1, backgroundColor: tokens.color.line },
});

export default { title: 'PantryShare/Overview', component: Overview } satisfies Meta<typeof Overview>;
export const Gallery: StoryObj<typeof Overview> = {};

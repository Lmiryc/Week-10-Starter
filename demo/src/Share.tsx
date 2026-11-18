import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { FeatureBanner } from 'pantryshare-skia';
import { ScreenScroll } from './CommunityScreens';
import { categories, neighborhoods, type Account, type Category, type Listing, type Neighborhood } from './data';
import { Button, Chip, color, PageTitle, Panel, styles as ui } from './ui';

const steps = ['Food details', 'Pickup area', 'Review'];

export function Share({ account, onPublish }: { account: Account; onPublish: (listing: Listing) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Bakery');
  const [portions, setPortions] = useState('2');
  const [area, setArea] = useState<Neighborhood>('Kerrytown');
  const [duration, setDuration] = useState(2);
  const count = Number(portions);
  const valid = name.trim().length >= 2 && Number.isInteger(count) && count > 0 && count <= 99;

  function publish() {
    if (!valid) return;
    const now = Date.now();
    onPublish({
      id: `shared-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      category, neighborhood: area, donor: account === 'Business' ? 'Your business' : 'You',
      name: name.trim(), description: description.trim(), capacity: count, remaining: count,
      startsAt: now, endsAt: now + duration * 60 * 60_000, ingredients: [name.trim()], mine: true,
    });
  }

  return (
    <ScreenScroll>
      <PageTitle title="Share food" description="Create a pickup listing for your neighborhood." />
      {step === 0 && <FeatureBanner title="Make room at the table" description="Help fresh food find its next home." animated />}
      <View style={styles.steps} accessibilityLabel={`Step ${step + 1} of ${steps.length}: ${steps[step]}`}>
        {steps.map((label, index) => (
          <View key={label} style={styles.step}>
            <View style={[styles.track, index <= step && styles.trackFilled]} />
            <Text style={[ui.small, index === step && styles.activeStep]}>{label}</Text>
          </View>
        ))}
      </View>

      <Panel>
        {step === 0 && <>
          <Text style={ui.title}>What are you sharing?</Text>
          <Text nativeID="food-name-label" style={styles.fieldLabel}>Food name</Text>
          <TextInput accessibilityLabel="Food name" value={name} onChangeText={setName} placeholder="e.g. Blueberry muffins"
            placeholderTextColor={color.muted} maxLength={60} style={styles.input} />
          <Text style={styles.fieldLabel}>Category</Text>
          <View style={ui.row}>{categories.map((value) => (
            <Chip key={value} label={value} active={category === value} onPress={() => setCategory(value)} />
          ))}</View>
          <Text style={styles.fieldLabel}>Portions (1–99)</Text>
          <TextInput accessibilityLabel="Portions" value={portions} onChangeText={(value) => setPortions(value.replace(/\D/g, ''))}
            keyboardType="number-pad" maxLength={2} style={styles.input} />
          <Text style={styles.fieldLabel}>Notes or allergens</Text>
          <TextInput accessibilityLabel="Notes or allergens" value={description} onChangeText={setDescription} placeholder="Optional"
            placeholderTextColor={color.muted} multiline maxLength={260} style={[styles.input, styles.multiline]} />
        </>}
        {step === 1 && <>
          <Text style={ui.title}>Where can people pick up?</Text>
          <Text style={ui.body}>Choose a public neighborhood for your listing.</Text>
          <View style={ui.row}>{neighborhoods.map((value) => (
            <Chip key={value} label={value} active={area === value} onPress={() => setArea(value)} />
          ))}</View>
          <Text style={styles.fieldLabel}>Pickup window starting now</Text>
          <View style={ui.row}>{[1, 2, 4].map((hours) => (
            <Chip key={hours} label={`${hours} ${hours === 1 ? 'hour' : 'hours'}`} active={duration === hours} onPress={() => setDuration(hours)} />
          ))}</View>
        </>}
        {step === 2 && <>
          <Text accessibilityRole="header" style={ui.title}>{name.trim()}</Text>
          <Text style={ui.body}>{category} · {count} {count === 1 ? 'portion' : 'portions'}</Text>
          <Text style={ui.body}>{area} · Pickup available for {duration} {duration === 1 ? 'hour' : 'hours'}</Text>
          {!!description.trim() && <Text style={ui.body}>{description.trim()}</Text>}
        </>}
      </Panel>

      {step < 2
        ? <Button disabled={!valid} icon="arrow-forward" onPress={() => setStep(step + 1)}>Continue</Button>
        : <Button icon="checkmark" onPress={publish}>Publish listing</Button>}
      {step > 0 && <Button secondary onPress={() => setStep(step - 1)}>Back</Button>}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  steps: { flexDirection: 'row', gap: 8 },
  step: { flex: 1, gap: 5 },
  track: { height: 4, borderRadius: 8, backgroundColor: color.border },
  trackFilled: { backgroundColor: color.green },
  activeStep: { color: color.ink, fontWeight: '700' },
  fieldLabel: { color: color.ink, fontSize: 13, fontWeight: '700' },
  input: { color: color.ink, backgroundColor: color.white, borderRadius: 11, borderWidth: 1, borderColor: color.border, minHeight: 46, paddingHorizontal: 11, paddingVertical: 9 },
  multiline: { minHeight: 74, textAlignVertical: 'top' },
});

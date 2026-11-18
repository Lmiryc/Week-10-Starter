import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export const color = {
  bg: '#F8F6EE',
  surface: '#FFFDF8',
  white: '#FFFFFF',
  ink: '#173629',
  muted: '#55685B',
  green: '#216044',
  greenWash: '#E7EEDF',
  border: '#DCE3D4',
  brown: '#8B451D',
  peach: '#F5E0CA',
};

export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });
export type IconName = ComponentProps<typeof Ionicons>['name'];
export const Icon = Ionicons;

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}>
      <Text style={[styles.chipText, active && styles.chipActiveText]}>{label}</Text>
    </Pressable>
  );
}

export function Button({ children, onPress, icon, secondary = false, disabled = false }: {
  children: string; onPress: () => void; icon?: IconName; secondary?: boolean; disabled?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={children} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondary, disabled && styles.disabled, pressed && styles.pressed]}>
      {icon && <Icon name={icon} size={19} color={secondary ? color.ink : color.white} />}
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{children}</Text>
    </Pressable>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return <View style={styles.panel}>{children}</View>;
}

export function PageTitle({ title, description }: { title: string; description?: string }) {
  return (
    <View style={styles.titleBlock}>
      <Text accessibilityRole="header" style={styles.pageTitle}>{title}</Text>
      {description && <Text style={styles.body}>{description}</Text>}
    </View>
  );
}

export const styles = StyleSheet.create({
  chip: { borderWidth: 1, borderColor: color.border, backgroundColor: color.surface, paddingVertical: 9, paddingHorizontal: 14, minHeight: 40, justifyContent: 'center', borderRadius: 100 },
  chipActive: { backgroundColor: color.green, borderColor: color.green },
  chipText: { color: color.ink, fontSize: 13, fontWeight: '600' },
  chipActiveText: { color: color.white },
  pressed: { opacity: 0.73 },
  button: { backgroundColor: color.green, borderColor: color.green, borderWidth: 1, borderRadius: 14, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 10 },
  secondary: { backgroundColor: color.surface, borderColor: color.border },
  disabled: { opacity: 0.5 },
  buttonText: { color: color.white, fontWeight: '700', textAlign: 'center' },
  secondaryText: { color: color.ink },
  panel: { backgroundColor: color.surface, borderColor: color.border, borderWidth: 1, borderRadius: 21, padding: 16, gap: 12 },
  titleBlock: { gap: 5 },
  pageTitle: { color: color.ink, fontFamily: serif, fontSize: 34, letterSpacing: -0.8, fontWeight: '700' },
  title: { color: color.ink, fontSize: 17, fontWeight: '700' },
  body: { color: color.muted, fontSize: 14, lineHeight: 21 },
  small: { color: color.muted, fontSize: 12, lineHeight: 17 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
});

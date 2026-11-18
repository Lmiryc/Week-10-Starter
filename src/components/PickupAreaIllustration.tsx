import { Canvas, Circle, Fill, Group, Path, RoundedRect } from '@shopify/react-native-skia';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../tokens';

export interface PickupAreaIllustrationProps {
  /** Public neighborhood name. Never pass an exact pickup address. */
  neighborhood: string;
}

const streets = [
  'M-30 30 C60 82 114 44 212 80 S294 123 365 85',
  'M-20 138 C92 78 135 137 224 125 S299 96 365 146',
  'M70 -15 C60 30 114 74 97 124 S57 167 68 200',
  'M219 -15 C214 35 245 56 230 111 S185 158 201 208',
  'M302 -12 C282 54 311 93 297 135 S275 175 284 201',
];

export function PickupAreaIllustration({ neighborhood }: PickupAreaIllustrationProps) {
  const [width, setWidth] = useState(0);
  const scale = width / 340;

  return (
    <View
      accessible
      accessibilityLabel={`${neighborhood}, approximate pickup area illustration`}
      style={styles.root}
    >
      <View style={styles.map} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 && (
          <Canvas style={{ width, height: 156 * scale }} __destroyWebGLContextAfterRender>
            <Fill color="#EEF1E7" />
            <Group transform={[{ scale }]}>
              <RoundedRect x={248} y={8} width={75} height={42} r={18} color="#DDE9D4" />
              <RoundedRect x={22} y={93} width={66} height={44} r={14} color="#DDE9D4" />
              {streets.map((path) => <Path key={path} path={path} color="#FFFFFF" style="stroke" strokeWidth={8} />)}
              <Circle cx={166} cy={78} r={49} color="rgba(34,119,85,0.12)" />
              <Circle cx={166} cy={78} r={49} style="stroke" strokeWidth={1.5} color="#609470" />
              <Circle cx={166} cy={78} r={36} style="stroke" strokeWidth={1} color="#9CBD9C" />
            </Group>
          </Canvas>
        )}
      </View>
      <View style={styles.caption}>
        <Text style={styles.title}>{neighborhood}</Text>
        <Text style={styles.detail}>Approximate area · illustration</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 9 },
  map: { borderRadius: tokens.radius.small, overflow: 'hidden', backgroundColor: tokens.color.sage },
  caption: { gap: 3 },
  title: { color: tokens.color.ink, fontSize: 15, fontWeight: '700' },
  detail: { color: tokens.color.muted, fontSize: 12 },
});

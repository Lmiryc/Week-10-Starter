import { Canvas, Circle, Fill, LinearGradient, vec } from '@shopify/react-native-skia';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../tokens';

export interface FeatureBannerProps {
  title: string;
  description?: string;
  variant?: 'share' | 'impact';
  /** Enables subtle decorative motion when the device permits it. */
  animated?: boolean;
}

const palettes = {
  share: ['#102F25', '#215D41', '#397C51'],
  impact: ['#26213D', '#43345E', '#645075'],
};

export function FeatureBanner({ title, description, variant = 'share', animated = false }: FeatureBannerProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [reduceMotion, setReduceMotion] = useState(true);
  const glow = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated || Platform.OS === 'web') return;
    let mounted = true;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    }).catch(() => {});
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [animated]);

  useEffect(() => {
    if (!animated || reduceMotion) {
      glow.setValue(1);
      return;
    }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 0.57, duration: 2000, useNativeDriver: true, isInteraction: false }),
      Animated.timing(glow, { toValue: 1, duration: 2000, useNativeDriver: true, isInteraction: false }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [animated, glow, reduceMotion]);

  return (
    <View
      style={[styles.banner, { backgroundColor: palettes[variant][0] }]}
      onLayout={({ nativeEvent: { layout } }) => setSize({ width: layout.width, height: layout.height })}
    >
      {size.width > 0 && size.height > 0 && (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: glow }]}>
          <Canvas style={size} __destroyWebGLContextAfterRender>
            <Fill>
              <LinearGradient start={vec(0, size.height)} end={vec(size.width, 0)} colors={palettes[variant]} />
            </Fill>
            <Circle cx={size.width - 13} cy={18} r={68} color="rgba(255,255,255,0.09)" />
            <Circle cx={size.width - 29} cy={24} r={49} color="rgba(255,255,255,0.13)" style="stroke" strokeWidth={1} />
            <Circle cx={size.width - 29} cy={24} r={36} color="rgba(255,255,255,0.13)" style="stroke" strokeWidth={1} />
          </Canvas>
        </Animated.View>
      )}
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: tokens.radius.card, overflow: 'hidden', gap: 8, padding: 23, minHeight: 120, justifyContent: 'center' },
  title: { color: tokens.color.white, fontSize: 26, fontWeight: '800', maxWidth: 360 },
  description: { color: '#F0F6EE', fontSize: 14, lineHeight: 20, maxWidth: 360 },
});

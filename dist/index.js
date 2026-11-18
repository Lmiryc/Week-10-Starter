// src/components/AvailabilityMeter.tsx
import { Canvas, RoundedRect } from "@shopify/react-native-skia";
import { StyleSheet, Text, View } from "react-native";

// src/tokens.ts
var tokens = {
  color: {
    paper: "#F7F5EE",
    white: "#FFFFFF",
    ink: "#193329",
    muted: "#52655C",
    line: "#DDE6D9",
    green: "#227755",
    mint: "#BCE7A8",
    amber: "#945517",
    amberWash: "#FAE9C6",
    sage: "#E8F1E2",
    plum: "#5E4A80",
    lavender: "#EFE7F8"
  },
  radius: { small: 10, card: 20 }
};

// src/components/AvailabilityMeter.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var segments = 6;
var segmentWidth = 12;
var gap = 4;
function count(value) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}
function AvailabilityMeter({ remaining, capacity }) {
  const total = count(capacity);
  const left = Math.min(count(remaining), total);
  const share = total > 0 ? left / total : 0;
  const filled = Math.ceil(share * segments);
  const label = left === 0 ? "All claimed" : left === 1 ? "1 portion left" : `${left} portions left`;
  const accent = share > 0 && share <= 0.25 ? tokens.color.amber : tokens.color.green;
  return /* @__PURE__ */ jsxs(View, { accessible: true, accessibilityLabel: left > 0 ? `${label}, ${total} originally available` : label, style: styles.row, children: [
    /* @__PURE__ */ jsx(Canvas, { style: { width: segments * (segmentWidth + gap) - gap, height: 12 }, __destroyWebGLContextAfterRender: true, children: Array.from({ length: segments }, (_, index) => /* @__PURE__ */ jsx(
      RoundedRect,
      {
        x: index * (segmentWidth + gap),
        y: 1,
        width: segmentWidth,
        height: 10,
        r: 3,
        color: index < filled ? accent : tokens.color.line
      },
      index
    )) }),
    /* @__PURE__ */ jsx(Text, { style: [styles.label, { color: left > 0 ? accent : tokens.color.muted }], children: label })
  ] });
}
var styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 9 },
  label: { fontSize: 13, fontWeight: "600" }
});

// src/components/FeatureBanner.tsx
import { Canvas as Canvas2, Circle, Fill, LinearGradient, vec } from "@shopify/react-native-skia";
import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Platform, StyleSheet as StyleSheet2, Text as Text2, View as View2 } from "react-native";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var palettes = {
  share: ["#102F25", "#215D41", "#397C51"],
  impact: ["#26213D", "#43345E", "#645075"]
};
function FeatureBanner({ title, description, variant = "share", animated = false }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [reduceMotion, setReduceMotion] = useState(true);
  const glow = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!animated || Platform.OS === "web") return;
    let mounted = true;
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    }).catch(() => {
    });
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
      Animated.timing(glow, { toValue: 0.57, duration: 2e3, useNativeDriver: true, isInteraction: false }),
      Animated.timing(glow, { toValue: 1, duration: 2e3, useNativeDriver: true, isInteraction: false })
    ]));
    animation.start();
    return () => animation.stop();
  }, [animated, glow, reduceMotion]);
  return /* @__PURE__ */ jsxs2(
    View2,
    {
      style: [styles2.banner, { backgroundColor: palettes[variant][0] }],
      onLayout: ({ nativeEvent: { layout } }) => setSize({ width: layout.width, height: layout.height }),
      children: [
        size.width > 0 && size.height > 0 && /* @__PURE__ */ jsx2(Animated.View, { pointerEvents: "none", style: [StyleSheet2.absoluteFill, { opacity: glow }], children: /* @__PURE__ */ jsxs2(Canvas2, { style: size, __destroyWebGLContextAfterRender: true, children: [
          /* @__PURE__ */ jsx2(Fill, { children: /* @__PURE__ */ jsx2(LinearGradient, { start: vec(0, size.height), end: vec(size.width, 0), colors: palettes[variant] }) }),
          /* @__PURE__ */ jsx2(Circle, { cx: size.width - 13, cy: 18, r: 68, color: "rgba(255,255,255,0.09)" }),
          /* @__PURE__ */ jsx2(Circle, { cx: size.width - 29, cy: 24, r: 49, color: "rgba(255,255,255,0.13)", style: "stroke", strokeWidth: 1 }),
          /* @__PURE__ */ jsx2(Circle, { cx: size.width - 29, cy: 24, r: 36, color: "rgba(255,255,255,0.13)", style: "stroke", strokeWidth: 1 })
        ] }) }),
        /* @__PURE__ */ jsx2(Text2, { accessibilityRole: "header", style: styles2.title, children: title }),
        !!description && /* @__PURE__ */ jsx2(Text2, { style: styles2.description, children: description })
      ]
    }
  );
}
var styles2 = StyleSheet2.create({
  banner: { borderRadius: tokens.radius.card, overflow: "hidden", gap: 8, padding: 23, minHeight: 120, justifyContent: "center" },
  title: { color: tokens.color.white, fontSize: 26, fontWeight: "800", maxWidth: 360 },
  description: { color: "#F0F6EE", fontSize: 14, lineHeight: 20, maxWidth: 360 }
});

// src/components/ImpactChart.tsx
import { Canvas as Canvas3, Line, RoundedRect as RoundedRect2, vec as vec2 } from "@shopify/react-native-skia";
import { useState as useState2 } from "react";
import { StyleSheet as StyleSheet3, Text as Text3, View as View3 } from "react-native";
import { Fragment, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var plotHeight = 108;
var baseline = plotHeight - 4;
function ImpactChart({ data, title = "Food shared", unit = "portions" }) {
  const [width, setWidth] = useState2(0);
  const values = data.map(({ value }) => Number.isFinite(value) && value > 0 ? value : 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  const max = values.reduce((largest, value) => Math.max(largest, value), 1);
  const slot = data.length ? width / data.length : 0;
  const bar = Math.min(28, slot * 0.6);
  return /* @__PURE__ */ jsxs3(
    View3,
    {
      accessible: true,
      accessibilityLabel: data.length ? `${title}, ${total} ${unit} total. ${data.map(({ label }, i) => `${label}: ${values[i]}`).join(", ")}` : `${title}, no activity yet`,
      style: styles3.chart,
      children: [
        /* @__PURE__ */ jsx3(Text3, { style: styles3.title, children: title }),
        data.length === 0 ? /* @__PURE__ */ jsx3(Text3, { style: styles3.detail, children: "No activity yet" }) : /* @__PURE__ */ jsxs3(Fragment, { children: [
          /* @__PURE__ */ jsxs3(Text3, { style: styles3.detail, children: [
            total.toLocaleString(),
            " ",
            unit,
            " total"
          ] }),
          /* @__PURE__ */ jsx3(View3, { onLayout: (event) => setWidth(event.nativeEvent.layout.width), children: width > 0 && /* @__PURE__ */ jsxs3(Canvas3, { style: { width, height: plotHeight }, __destroyWebGLContextAfterRender: true, children: [
            [0, 1, 2].map((i) => {
              const y = 8 + i * (baseline - 8) / 2;
              return /* @__PURE__ */ jsx3(Line, { p1: vec2(0, y), p2: vec2(width, y), color: tokens.color.line, strokeWidth: 1 }, i);
            }),
            values.map((value, i) => {
              const height = value / max * (baseline - 8);
              return height > 0 && /* @__PURE__ */ jsx3(
                RoundedRect2,
                {
                  x: slot * (i + 0.5) - bar / 2,
                  y: baseline - height,
                  width: bar,
                  height,
                  r: Math.min(6, bar / 2, height / 2),
                  color: value === max ? tokens.color.green : "#83BA8B"
                },
                i
              );
            })
          ] }) }),
          /* @__PURE__ */ jsx3(View3, { style: styles3.labels, children: data.map(({ label }, i) => /* @__PURE__ */ jsxs3(View3, { style: styles3.period, children: [
            /* @__PURE__ */ jsx3(Text3, { style: styles3.value, children: values[i].toLocaleString() }),
            /* @__PURE__ */ jsx3(Text3, { style: styles3.detail, children: label })
          ] }, i)) })
        ] })
      ]
    }
  );
}
var styles3 = StyleSheet3.create({
  chart: { gap: 6 },
  title: { color: tokens.color.ink, fontSize: 17, fontWeight: "700" },
  detail: { color: tokens.color.muted, fontSize: 12 },
  labels: { flexDirection: "row" },
  period: { flex: 1, alignItems: "center", gap: 2 },
  value: { color: tokens.color.ink, fontSize: 13, fontWeight: "700" }
});

// src/components/PickupAreaIllustration.tsx
import { Canvas as Canvas4, Circle as Circle2, Fill as Fill2, Group, Path, RoundedRect as RoundedRect3 } from "@shopify/react-native-skia";
import { useState as useState3 } from "react";
import { StyleSheet as StyleSheet4, Text as Text4, View as View4 } from "react-native";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var streets = [
  "M-30 30 C60 82 114 44 212 80 S294 123 365 85",
  "M-20 138 C92 78 135 137 224 125 S299 96 365 146",
  "M70 -15 C60 30 114 74 97 124 S57 167 68 200",
  "M219 -15 C214 35 245 56 230 111 S185 158 201 208",
  "M302 -12 C282 54 311 93 297 135 S275 175 284 201"
];
function PickupAreaIllustration({ neighborhood }) {
  const [width, setWidth] = useState3(0);
  const scale = width / 340;
  return /* @__PURE__ */ jsxs4(
    View4,
    {
      accessible: true,
      accessibilityLabel: `${neighborhood}, approximate pickup area illustration`,
      style: styles4.root,
      children: [
        /* @__PURE__ */ jsx4(View4, { style: styles4.map, onLayout: (event) => setWidth(event.nativeEvent.layout.width), children: width > 0 && /* @__PURE__ */ jsxs4(Canvas4, { style: { width, height: 156 * scale }, __destroyWebGLContextAfterRender: true, children: [
          /* @__PURE__ */ jsx4(Fill2, { color: "#EEF1E7" }),
          /* @__PURE__ */ jsxs4(Group, { transform: [{ scale }], children: [
            /* @__PURE__ */ jsx4(RoundedRect3, { x: 248, y: 8, width: 75, height: 42, r: 18, color: "#DDE9D4" }),
            /* @__PURE__ */ jsx4(RoundedRect3, { x: 22, y: 93, width: 66, height: 44, r: 14, color: "#DDE9D4" }),
            streets.map((path) => /* @__PURE__ */ jsx4(Path, { path, color: "#FFFFFF", style: "stroke", strokeWidth: 8 }, path)),
            /* @__PURE__ */ jsx4(Circle2, { cx: 166, cy: 78, r: 49, color: "rgba(34,119,85,0.12)" }),
            /* @__PURE__ */ jsx4(Circle2, { cx: 166, cy: 78, r: 49, style: "stroke", strokeWidth: 1.5, color: "#609470" }),
            /* @__PURE__ */ jsx4(Circle2, { cx: 166, cy: 78, r: 36, style: "stroke", strokeWidth: 1, color: "#9CBD9C" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs4(View4, { style: styles4.caption, children: [
          /* @__PURE__ */ jsx4(Text4, { style: styles4.title, children: neighborhood }),
          /* @__PURE__ */ jsx4(Text4, { style: styles4.detail, children: "Approximate area \xB7 illustration" })
        ] })
      ]
    }
  );
}
var styles4 = StyleSheet4.create({
  root: { gap: 9 },
  map: { borderRadius: tokens.radius.small, overflow: "hidden", backgroundColor: tokens.color.sage },
  caption: { gap: 3 },
  title: { color: tokens.color.ink, fontSize: 15, fontWeight: "700" },
  detail: { color: tokens.color.muted, fontSize: 12 }
});

// src/components/PickupCountdown.tsx
import { useEffect as useEffect2, useState as useState4 } from "react";
import { StyleSheet as StyleSheet5, Text as Text5, View as View5 } from "react-native";

// src/components/RingGraphic.tsx
import { Canvas as Canvas5, Circle as Circle3, Path as Path2 } from "@shopify/react-native-skia";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function fraction(value) {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}
function RingGraphic({ size, progress, color, track }) {
  const center = size / 2;
  const stroke = Math.max(4, size * 0.085);
  const radius = center - stroke;
  const angle = progress * 2 * Math.PI;
  const endX = center + radius * Math.sin(angle);
  const endY = center - radius * Math.cos(angle);
  const arc = `M ${center} ${center - radius} A ${radius} ${radius} 0 ${progress > 0.5 ? 1 : 0} 1 ${endX} ${endY}`;
  return /* @__PURE__ */ jsxs5(Canvas5, { style: { width: size, height: size }, __destroyWebGLContextAfterRender: true, children: [
    /* @__PURE__ */ jsx5(Circle3, { cx: center, cy: center, r: radius, color: track, style: "stroke", strokeWidth: stroke }),
    progress === 1 && /* @__PURE__ */ jsx5(Circle3, { cx: center, cy: center, r: radius, color, style: "stroke", strokeWidth: stroke }),
    progress > 0 && progress < 1 && /* @__PURE__ */ jsx5(Path2, { path: arc, color, style: "stroke", strokeWidth: stroke, strokeCap: "round" })
  ] });
}

// src/components/PickupCountdown.tsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function formatDuration(milliseconds) {
  const minutes = Math.ceil(milliseconds / 6e4);
  if (minutes < 60) return `${minutes} min`;
  const remainder = minutes % 60;
  return `${Math.floor(minutes / 60)} h${remainder ? ` ${remainder} min` : ""}`;
}
function PickupCountdown({ startsAt, endsAt, warningMinutes = 15 }) {
  const [now, setNow] = useState4(Date.now);
  const valid = Number.isFinite(startsAt) && Number.isFinite(endsAt) && endsAt > startsAt;
  useEffect2(() => {
    if (!valid) return;
    let timeout;
    function update() {
      const time = Date.now();
      setNow(time);
      if (time >= endsAt) return;
      const boundary = time < startsAt ? startsAt : endsAt;
      const nextMinuteChange = (boundary - time) % 6e4 || 6e4;
      timeout = setTimeout(update, nextMinuteChange);
    }
    update();
    return () => clearTimeout(timeout);
  }, [startsAt, endsAt, valid]);
  const pending = valid && now < startsAt;
  const closed = valid && now >= endsAt;
  const remaining = Math.max(0, endsAt - now);
  const urgent = valid && !pending && !closed && remaining <= warningMinutes * 6e4;
  const progress = valid ? fraction(remaining / (endsAt - startsAt)) : 0;
  let title = "Pickup window";
  let detail = `${formatDuration(remaining)} left`;
  if (!valid) detail = "Time to be confirmed";
  else if (pending) detail = `Opens in ${formatDuration(startsAt - now)}`;
  else if (closed) detail = "Pickup window ended";
  else if (urgent) title = "Pickup closes soon";
  return /* @__PURE__ */ jsxs6(View5, { accessible: true, accessibilityLabel: `${title}, ${detail}`, style: styles5.row, children: [
    /* @__PURE__ */ jsx6(RingGraphic, { size: 48, progress, color: urgent ? tokens.color.amber : tokens.color.green, track: urgent ? tokens.color.amberWash : tokens.color.line }),
    /* @__PURE__ */ jsxs6(View5, { style: styles5.info, children: [
      /* @__PURE__ */ jsx6(Text5, { style: styles5.title, children: title }),
      /* @__PURE__ */ jsx6(Text5, { style: [styles5.detail, urgent && styles5.urgent], children: detail })
    ] })
  ] });
}
var styles5 = StyleSheet5.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  info: { flex: 1, gap: 2 },
  title: { color: tokens.color.ink, fontSize: 15, fontWeight: "700" },
  detail: { color: tokens.color.muted, fontSize: 13 },
  urgent: { color: tokens.color.amber }
});

// src/components/ProgressRing.tsx
import { StyleSheet as StyleSheet6, Text as Text6, View as View6 } from "react-native";
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function ProgressRing({ variant, value, target, label }) {
  const validTarget = Number.isFinite(target) && target > 0;
  const recipe = variant === "recipe";
  const progress = validTarget ? fraction(value / target) : 0;
  const title = label ?? (recipe ? "Recipe match" : "PantryPoints");
  const points = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const display = !validTarget ? "\u2014" : recipe ? `${Math.round(progress * 100)}%` : points.toLocaleString();
  const detail = !validTarget ? "No target yet" : recipe ? "Ingredients on hand" : `of ${target.toLocaleString()} points`;
  const color = recipe ? tokens.color.green : tokens.color.plum;
  const track = recipe ? tokens.color.sage : tokens.color.lavender;
  return /* @__PURE__ */ jsxs7(View6, { accessible: true, accessibilityLabel: `${title}, ${validTarget ? `${display} ${detail}` : detail}`, style: styles6.row, children: [
    /* @__PURE__ */ jsxs7(View6, { style: styles6.dial, children: [
      /* @__PURE__ */ jsx7(RingGraphic, { size: 90, progress, color, track }),
      /* @__PURE__ */ jsx7(View6, { style: styles6.center, children: /* @__PURE__ */ jsx7(Text6, { adjustsFontSizeToFit: true, numberOfLines: 1, style: [styles6.number, { color }], children: display }) })
    ] }),
    /* @__PURE__ */ jsxs7(View6, { style: styles6.info, children: [
      /* @__PURE__ */ jsx7(Text6, { style: styles6.title, children: title }),
      /* @__PURE__ */ jsx7(Text6, { style: styles6.detail, children: detail })
    ] })
  ] });
}
var styles6 = StyleSheet6.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  dial: { width: 90, height: 90 },
  center: { ...StyleSheet6.absoluteFill, alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  number: { fontSize: 21, fontWeight: "800", fontVariant: ["tabular-nums"] },
  info: { flex: 1, gap: 4 },
  title: { color: tokens.color.ink, fontSize: 16, fontWeight: "700" },
  detail: { color: tokens.color.muted, fontSize: 13 }
});
export {
  AvailabilityMeter,
  FeatureBanner,
  ImpactChart,
  PickupAreaIllustration,
  PickupCountdown,
  ProgressRing,
  tokens
};

import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../tokens';
import { fraction, RingGraphic } from './RingGraphic';

export interface PickupCountdownProps {
  /** Start and end of the confirmed pickup window as Unix timestamps in milliseconds. */
  startsAt: number;
  endsAt: number;
  /** Remaining time in minutes that should be highlighted. Defaults to 15. */
  warningMinutes?: number;
}

function formatDuration(milliseconds: number) {
  const minutes = Math.ceil(milliseconds / 60_000);
  if (minutes < 60) return `${minutes} min`;
  const remainder = minutes % 60;
  return `${Math.floor(minutes / 60)} h${remainder ? ` ${remainder} min` : ''}`;
}

export function PickupCountdown({ startsAt, endsAt, warningMinutes = 15 }: PickupCountdownProps) {
  const [now, setNow] = useState(Date.now);
  const valid = Number.isFinite(startsAt) && Number.isFinite(endsAt) && endsAt > startsAt;

  useEffect(() => {
    if (!valid) return;
    let timeout: ReturnType<typeof setTimeout>;
    function update() {
      const time = Date.now();
      setNow(time);
      if (time >= endsAt) return;
      const boundary = time < startsAt ? startsAt : endsAt;
      const nextMinuteChange = (boundary - time) % 60_000 || 60_000;
      timeout = setTimeout(update, nextMinuteChange);
    }
    update();
    return () => clearTimeout(timeout);
  }, [startsAt, endsAt, valid]);

  const pending = valid && now < startsAt;
  const closed = valid && now >= endsAt;
  const remaining = Math.max(0, endsAt - now);
  const urgent = valid && !pending && !closed && remaining <= warningMinutes * 60_000;
  const progress = valid ? fraction(remaining / (endsAt - startsAt)) : 0;
  let title = 'Pickup window';
  let detail = `${formatDuration(remaining)} left`;
  if (!valid) detail = 'Time to be confirmed';
  else if (pending) detail = `Opens in ${formatDuration(startsAt - now)}`;
  else if (closed) detail = 'Pickup window ended';
  else if (urgent) title = 'Pickup closes soon';

  return (
    <View accessible accessibilityLabel={`${title}, ${detail}`} style={styles.row}>
      <RingGraphic size={48} progress={progress} color={urgent ? tokens.color.amber : tokens.color.green} track={urgent ? tokens.color.amberWash : tokens.color.line} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.detail, urgent && styles.urgent]}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  info: { flex: 1, gap: 2 },
  title: { color: tokens.color.ink, fontSize: 15, fontWeight: '700' },
  detail: { color: tokens.color.muted, fontSize: 13 },
  urgent: { color: tokens.color.amber },
});

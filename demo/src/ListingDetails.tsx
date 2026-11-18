import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AvailabilityMeter, PickupAreaIllustration, PickupCountdown } from 'pantryshare-skia';
import type { Account, Listing } from './data';
import { ListingPhoto } from './Discover';
import { Button, color, Icon, PageTitle, styles as ui } from './ui';

export function ListingDetails({ listing, account, reserved, onClose, onReserve, onRelease }: {
  listing: Listing | undefined; account: Account; reserved: boolean;
  onClose: () => void; onReserve: () => void; onRelease: () => void;
}) {
  if (!listing) return null;
  const unavailable = account === 'Business' || !!listing.mine || Date.now() >= listing.endsAt || listing.remaining === 0;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <Pressable accessibilityLabel="Dismiss listing" onPress={onClose} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.sheetBar}>
            <Text style={ui.small}>{listing.category} · {listing.donor}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close listing" onPress={onClose} hitSlop={8} style={styles.close}>
              <Icon name="close" size={22} color={color.ink} />
            </Pressable>
          </View>
          <ScrollView bounces={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <ListingPhoto item={listing} large />
            <PageTitle title={listing.name} description={listing.description} />
            <AvailabilityMeter remaining={listing.remaining} capacity={listing.capacity} />
            <View style={styles.rule} />
            <PickupCountdown startsAt={listing.startsAt} endsAt={listing.endsAt} />
            <PickupAreaIllustration neighborhood={listing.neighborhood} />
            {reserved && <Text accessibilityLiveRegion="polite" style={styles.confirmation}>You reserved 1 portion</Text>}
            {!reserved && account === 'Business' && <Text style={ui.body}>Business accounts can share food. Switch to Personal to reserve.</Text>}
            {listing.mine && <Text style={ui.body}>You shared this listing.</Text>}
          </ScrollView>
          <View style={styles.actions}>
            {reserved
              ? <Button secondary onPress={onRelease}>Cancel reservation</Button>
              : <Button icon="bag-check-outline" disabled={unavailable} onPress={onReserve}>Reserve 1 portion</Button>}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end', alignItems: 'center', backgroundColor: '#10291EC0', paddingTop: 32 },
  sheet: { width: '100%', maxWidth: 560, maxHeight: '93%', backgroundColor: color.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, overflow: 'hidden' },
  sheetBar: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 36, height: 36, borderRadius: 20, backgroundColor: color.greenWash, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 18, paddingBottom: 16, gap: 13 },
  rule: { height: 1, backgroundColor: color.border, marginVertical: 3 },
  actions: { paddingHorizontal: 18, paddingBottom: Platform.OS === 'ios' ? 26 : 14, paddingTop: 8 },
  confirmation: { color: color.green, backgroundColor: color.greenWash, padding: 11, fontWeight: '700', borderRadius: 10 },
});

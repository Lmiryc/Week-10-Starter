import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Nearby, Profile, Recipes } from './CommunityScreens';
import { makeDemoState, type Listing, type PantryState } from './data';
import { Discover } from './Discover';
import { ListingDetails } from './ListingDetails';
import { Share } from './Share';
import { color, Icon, type IconName, serif, styles as ui } from './ui';

const storageKey = 'pantryshare-demo-v1';
const tabs = [
  { name: 'Discover', icon: 'compass-outline', filled: 'compass' },
  { name: 'Nearby', icon: 'map-outline', filled: 'map' },
  { name: 'Recipes', icon: 'restaurant-outline', filled: 'restaurant' },
  { name: 'Share', icon: 'add-circle-outline', filled: 'add-circle' },
  { name: 'Profile', icon: 'person-circle-outline', filled: 'person-circle' },
] as const satisfies ReadonlyArray<{ name: string; icon: IconName; filled: IconName }>;
type Tab = typeof tabs[number]['name'];

function PantryShare() {
  const [state, setState] = useState<PantryState>(makeDemoState);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>('Discover');
  const [selectedId, setSelectedId] = useState<string>();
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (active && stored) {
          const saved = JSON.parse(stored) as PantryState;
          if (saved && Array.isArray(saved.listings) && Array.isArray(saved.favorites) && Array.isArray(saved.reservations)) {
            setState(saved);
          }
        }
      } catch (error) {
        console.warn('PantryShare could not restore saved demo data:', error);
      } finally {
        if (active) setLoaded(true);
      }
    }
    void restore();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (loaded) {
      void AsyncStorage.setItem(storageKey, JSON.stringify(state)).catch((error) => {
        console.warn('PantryShare could not save demo data:', error);
      });
    }
  }, [loaded, state]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const reservedListings = state.listings.filter((item) => state.reservations.includes(item.id));
  const selected = state.listings.find((item) => item.id === selectedId);
  const reserved = !!selectedId && state.reservations.includes(selectedId);
  const open = (item: Listing) => setSelectedId(item.id);

  function favorite(id: string) {
    setState((current) => ({
      ...current,
      favorites: current.favorites.includes(id) ? current.favorites.filter((saved) => saved !== id) : [...current.favorites, id],
    }));
  }

  function reserve(id: string) {
    const now = Date.now();
    setState((current) => {
      const listing = current.listings.find((item) => item.id === id);
      if (!listing || current.account !== 'Personal' || listing.mine || listing.remaining < 1 || now >= listing.endsAt
        || current.reservations.includes(id)) return current;
      return {
        ...current,
        reservations: [...current.reservations, id],
        listings: current.listings.map((item) => item.id === id ? { ...item, remaining: item.remaining - 1 } : item),
      };
    });
  }

  function release(id: string) {
    const now = Date.now();
    setState((current) => current.reservations.includes(id) ? {
      ...current,
      reservations: current.reservations.filter((reservation) => reservation !== id),
      listings: current.listings.map((item) => item.id === id && now < item.endsAt
        ? { ...item, remaining: Math.min(item.capacity, item.remaining + 1) } : item),
    } : current);
  }

  function publish(listing: Listing) {
    setState((current) => ({ ...current, listings: [listing, ...current.listings] }));
    setMessage('Your listing is live in this demo.');
    setTab('Discover');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.mark}><Icon name="leaf" size={18} color={color.white} /></View>
            <Text style={styles.wordmark}>PantryShare</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={`Account: ${state.account}`}
            onPress={() => setTab('Profile')} style={({ pressed }) => [styles.account, pressed && ui.pressed]}>
            <Icon name={state.account === 'Personal' ? 'person-outline' : 'storefront-outline'} size={15} color={color.green} />
            <Text style={styles.accountText}>{state.account}</Text>
          </Pressable>
        </View>
        {message && <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>}
        <View style={styles.screen}>
          {!loaded && <ActivityIndicator accessibilityLabel="Loading pantry" color={color.green} style={styles.loading} />}
          {loaded && tab === 'Discover' && <Discover listings={state.listings} favorites={state.favorites} onOpen={open} onSave={favorite} />}
          {loaded && tab === 'Nearby' && <Nearby listings={state.listings} onOpen={open} />}
          {loaded && tab === 'Recipes' && <Recipes reservedListings={reservedListings} />}
          {loaded && tab === 'Share' && <Share account={state.account} onPublish={publish} />}
          {loaded && tab === 'Profile' && <Profile state={state} reservedListings={reservedListings}
            onAccount={(account) => setState((current) => ({ ...current, account }))} onOpen={open} />}
        </View>
        <View role="tablist" style={styles.navigation}>
          {tabs.map(({ name, icon, filled }) => (
            <Pressable accessibilityRole="tab" accessibilityLabel={name} accessibilityState={{ selected: tab === name }} key={name}
              onPress={() => setTab(name)} style={({ pressed }) => [styles.tab, pressed && ui.pressed]}>
              <View style={[styles.tabIcon, tab === name && styles.tabIconActive]}>
                <Icon name={tab === name ? filled : icon} size={22} color={tab === name ? color.green : color.muted} />
              </View>
              <Text style={[styles.tabLabel, tab === name && styles.tabLabelActive]}>{name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <ListingDetails listing={selected} account={state.account} reserved={reserved} onClose={() => setSelectedId(undefined)}
        onReserve={() => { if (selectedId) reserve(selectedId); }} onRelease={() => { if (selectedId) release(selectedId); }} />
    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><PantryShare /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  shell: { flex: 1, width: '100%', maxWidth: 840, alignSelf: 'center' },
  header: { paddingHorizontal: 18, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: color.border },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { backgroundColor: color.green, width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  wordmark: { color: color.ink, fontFamily: serif, fontWeight: '700', fontSize: 22, letterSpacing: -0.5 },
  account: { backgroundColor: color.greenWash, paddingHorizontal: 11, minHeight: 36, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 5 },
  accountText: { color: color.green, fontSize: 12, fontWeight: '700' },
  screen: { flex: 1, minHeight: 0 },
  loading: { flex: 1 },
  message: { color: color.green, backgroundColor: color.greenWash, marginHorizontal: 18, marginTop: 8, padding: 10, borderRadius: 12, fontWeight: '700' },
  navigation: { flexDirection: 'row', borderTopWidth: 1, borderColor: color.border, backgroundColor: color.surface, paddingHorizontal: 8, paddingVertical: 6 },
  tab: { flex: 1, gap: 3, minHeight: 47, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { minWidth: 48, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tabIconActive: { backgroundColor: color.greenWash },
  tabLabel: { color: color.muted, fontSize: 11, fontWeight: '600' },
  tabLabelActive: { color: color.green, fontWeight: '800' },
});

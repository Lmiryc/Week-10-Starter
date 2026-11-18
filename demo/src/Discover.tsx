import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { AvailabilityMeter, FeatureBanner } from 'pantryshare-skia';
import { categories, type Category, type Listing } from './data';
import { photos } from './photos';
import { Chip, color, Icon, serif, styles as ui } from './ui';

type Filter = 'All' | Category | 'Saved';
const filters: Filter[] = ['All', ...categories, 'Saved'];

export function ListingPhoto({ item, large = false }: { item: Listing; large?: boolean }) {
  const source = item.photo && photos[item.photo];
  const { width } = useWindowDimensions();
  const cardWidth = (Math.min(width, 840) - 48) / 2;
  const frame = large ? styles.photoLarge : [styles.photo, { height: Math.max(86, cardWidth / 1.48) }];
  return source
    ? <Image source={source} resizeMode="cover" accessibilityIgnoresInvertColors style={frame} />
    : <View style={[frame, styles.photoFallback]}><Icon name="basket-outline" size={38} color={color.green} /></View>;
}

function ListingCard({ item, saved, open, toggleSave }: {
  item: Listing; saved: boolean; open: () => void; toggleSave: () => void;
}) {
  return (
    <View style={styles.card}>
      <Pressable accessibilityRole="button" accessibilityLabel={`View ${item.name}`} onPress={open}
        style={({ pressed }) => pressed && ui.pressed}>
        <ListingPhoto item={item} />
        <View style={styles.cardBody}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text numberOfLines={1} style={ui.small}>{item.donor}</Text>
          <View style={styles.location}>
            <Icon name="location-outline" size={13} color={color.muted} />
            <Text numberOfLines={1} style={[ui.small, styles.locationLabel]}>
              {item.neighborhood}{item.distance ? ` · ${item.distance}` : ''}
            </Text>
          </View>
          <View style={styles.availability}>
            <AvailabilityMeter remaining={item.remaining} capacity={item.capacity} />
          </View>
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`${saved ? 'Unsave' : 'Save'} ${item.name}`}
        accessibilityState={{ selected: saved }} onPress={toggleSave} hitSlop={4}
        style={({ pressed }) => [styles.heart, pressed && ui.pressed]}>
        <Icon name={saved ? 'heart' : 'heart-outline'} size={19} color={saved ? '#993D35' : color.ink} />
      </Pressable>
    </View>
  );
}

export function Discover({ listings, favorites, onOpen, onSave }: {
  listings: Listing[]; favorites: string[]; onOpen: (item: Listing) => void; onSave: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();
  const visible = listings.filter((item) =>
    (filter === 'All' || (filter === 'Saved' ? favorites.includes(item.id) : filter === item.category))
    && (!term || [item.name, item.donor, item.category, item.neighborhood].some((value) => value.toLowerCase().includes(term)))
  );

  return (
    <FlatList
      data={visible}
      extraData={favorites}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columns}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <ListingCard item={item} saved={favorites.includes(item.id)} open={() => onOpen(item)} toggleSave={() => onSave(item.id)} />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.intro}>
            <View style={styles.place}>
              <Icon name="location" size={14} color={color.green} />
              <Text style={styles.placeText}>Ann Arbor, MI</Text>
            </View>
            <Text accessibilityRole="header" style={styles.headline}>Good food, close by.</Text>
            <Text style={ui.body}>Pick up extra food from neighbors and local shops.</Text>
          </View>
          <FeatureBanner title="Share more. Waste less." description="Give surplus food another place at the table." />
          <View style={styles.search}>
            <Icon name="search-outline" size={21} color={color.green} />
            <TextInput accessibilityLabel="Search food" placeholder="Search food or neighborhood" placeholderTextColor={color.muted}
              value={query} onChangeText={setQuery} style={styles.searchInput} returnKeyType="search" />
            {!!query && (
              <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={8}>
                <Icon name="close-circle" size={21} color={color.muted} />
              </Pressable>
            )}
          </View>
          <View style={ui.row}>
            {filters.map((option) => (
              <Chip key={option} label={option} active={filter === option} onPress={() => setFilter(option)} />
            ))}
          </View>
          <View style={styles.section}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>{filter === 'Saved' ? 'Saved food' : 'Available near you'}</Text>
            <Text style={ui.small}>{visible.length} {visible.length === 1 ? 'listing' : 'listings'}</Text>
          </View>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>{filter === 'Saved' && !term ? 'Tap a heart to save food here.' : 'No food matches those filters.'}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 26, gap: 12 },
  header: { gap: 15 },
  intro: { gap: 6, paddingBottom: 1 },
  place: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  placeText: { color: color.green, fontSize: 12, fontWeight: '700' },
  headline: { fontFamily: serif, color: color.ink, fontSize: 34, fontWeight: '700', letterSpacing: -1.1 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, borderRadius: 14, paddingHorizontal: 13, minHeight: 49 },
  searchInput: { flex: 1, color: color.ink, fontSize: 14, paddingVertical: 10, minWidth: 0 },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  sectionTitle: { fontFamily: serif, fontWeight: '700', color: color.ink, fontSize: 22 },
  columns: { gap: 12 },
  card: { flex: 1, maxWidth: '49%', borderWidth: 1, borderColor: color.border, backgroundColor: color.surface, borderRadius: 18, overflow: 'hidden' },
  photo: { width: '100%', backgroundColor: color.greenWash },
  photoLarge: { width: '100%', height: 170, borderRadius: 15, backgroundColor: color.greenWash },
  photoFallback: { alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 11, gap: 4 },
  category: { color: color.green, fontSize: 11, fontWeight: '700', letterSpacing: 0.45, textTransform: 'uppercase' },
  cardTitle: { color: color.ink, fontSize: 15, lineHeight: 19, fontWeight: '800' },
  location: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationLabel: { flex: 1 },
  availability: { minHeight: 40, justifyContent: 'flex-end', marginTop: 2 },
  heart: { position: 'absolute', top: 7, right: 7, borderRadius: 100, backgroundColor: color.surface, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  empty: { color: color.muted, padding: 20, textAlign: 'center' },
});

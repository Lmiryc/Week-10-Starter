import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FeatureBanner, ImpactChart, PickupAreaIllustration, PickupCountdown, ProgressRing } from 'pantryshare-skia';
import { impact, neighborhoods, pantryStaples, recipes, type Account, type Listing, type Neighborhood, type PantryState } from './data';
import { Chip, color, Icon, PageTitle, Panel, styles as ui } from './ui';

export function ScreenScroll({ children }: { children: React.ReactNode }) {
  return <ScrollView contentContainerStyle={styles.content} automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}

function ListingLink({ item, onOpen, countdown = false }: { item: Listing; onOpen: () => void; countdown?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`View ${item.name}`} onPress={onOpen}
      style={({ pressed }) => [styles.listingLink, pressed && ui.pressed]}>
      <View style={styles.linkText}>
        <Text style={ui.title}>{item.name}</Text>
        <Text style={ui.small}>{item.donor} · {item.neighborhood}</Text>
        {countdown && <PickupCountdown startsAt={item.startsAt} endsAt={item.endsAt} />}
      </View>
      <Icon name="chevron-forward" size={19} color={color.green} />
    </Pressable>
  );
}

export function Nearby({ listings, onOpen }: { listings: Listing[]; onOpen: (item: Listing) => void }) {
  const [area, setArea] = useState<Neighborhood>('Kerrytown');
  const nearby = listings.filter((item) => item.neighborhood === area);

  return (
    <ScreenScroll>
      <PageTitle title="Explore nearby" description="Browse food by public pickup area around Ann Arbor." />
      <View style={ui.row}>
        {neighborhoods.map((neighborhood) => (
          <Chip key={neighborhood} label={neighborhood} active={area === neighborhood} onPress={() => setArea(neighborhood)} />
        ))}
      </View>
      <Panel>
        <PickupAreaIllustration neighborhood={area} />
        <Text style={ui.small}>Pickup previews use the neighborhood name for privacy.</Text>
      </Panel>
      <Text accessibilityRole="header" style={ui.title}>Food in {area}</Text>
      {nearby.length === 0 && <Text style={ui.body}>No listings in this neighborhood yet.</Text>}
      {nearby.map((item) => <ListingLink key={item.id} item={item} onOpen={() => onOpen(item)} />)}
    </ScreenScroll>
  );
}

export function Recipes({ reservedListings }: { reservedListings: Listing[] }) {
  const [open, setOpen] = useState<string>();
  const ingredients = new Set([...pantryStaples, ...reservedListings.flatMap((item) => item.ingredients)]);
  const ranked = recipes
    .map((recipe) => ({ ...recipe, matched: recipe.ingredients.filter((ingredient) => ingredients.has(ingredient)).length }))
    .sort((a, b) => b.matched / b.ingredients.length - a.matched / a.ingredients.length);

  return (
    <ScreenScroll>
      <PageTitle title="Recipe ideas" description="Ideas matched to your pantry staples and reserved food." />
      <Panel>
        <Text style={ui.title}>In your pantry</Text>
        <View style={ui.row}>
          {[...ingredients].map((ingredient) => <Text key={ingredient} style={styles.ingredient}>{ingredient}</Text>)}
        </View>
      </Panel>
      {ranked.map((recipe) => {
        const expanded = open === recipe.name;
        return (
          <Panel key={recipe.name}>
            <ProgressRing variant="recipe" label={recipe.name} value={recipe.matched} target={recipe.ingredients.length} />
            <Pressable accessibilityRole="button" accessibilityLabel={`Recipe for ${recipe.name}`}
              accessibilityState={{ expanded }} onPress={() => setOpen(expanded ? undefined : recipe.name)} style={styles.recipeToggle}>
              <Text style={styles.recipeAction}>{expanded ? 'Hide recipe' : 'View recipe'} · {recipe.time}</Text>
              <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={color.green} />
            </Pressable>
            {expanded && <View style={styles.linkText}>
              <Text style={ui.body}>{recipe.ingredients.join(' · ')}</Text>
              <Text style={ui.body}>{recipe.instructions}</Text>
            </View>}
          </Panel>
        );
      })}
    </ScreenScroll>
  );
}

export function Profile({ state, reservedListings, onAccount, onOpen }: {
  state: PantryState; reservedListings: Listing[]; onAccount: (account: Account) => void; onOpen: (item: Listing) => void;
}) {
  const shared = state.listings.filter((item) => item.mine);
  const points = 320 + shared.length * 25 + state.reservations.length * 10;
  const target = Math.max(500, Math.ceil(points / 250) * 250);

  return (
    <ScreenScroll>
      <PageTitle title="Your pantry" description="Manage your account, pickups, and community impact." />
      <Panel>
        <Text style={ui.title}>Account type</Text>
        <View style={ui.row}>
          {(['Personal', 'Business'] as const).map((account) => (
            <Chip key={account} label={account} active={state.account === account} onPress={() => onAccount(account)} />
          ))}
        </View>
        <Text style={ui.small}>{state.account === 'Personal' ? 'Share food and reserve pickups.' : 'Share surplus from your business.'}</Text>
      </Panel>
      <Text accessibilityRole="header" style={ui.title}>Your pickups</Text>
      {reservedListings.length === 0 && <Text style={ui.body}>Your reservations will appear here.</Text>}
      {reservedListings.map((item) => <ListingLink key={item.id} item={item} countdown onOpen={() => onOpen(item)} />)}
      {shared.length > 0 && <>
        <Text accessibilityRole="header" style={ui.title}>Food you shared</Text>
        {shared.map((item) => <ListingLink key={item.id} item={item} onOpen={() => onOpen(item)} />)}
      </>}
      <FeatureBanner variant="impact" title="Small shares add up" description="See your rewards and what neighbors have shared this week." animated />
      <Panel>
        <ProgressRing variant="points" value={points} target={target} />
        <View style={ui.row}>
          <Text style={styles.ingredient}>🌱 First Share</Text>
          <Text style={styles.ingredient}>🥖 Good Neighbor</Text>
          {points >= 500 && <Text style={styles.ingredient}>🏅 Pantry Champion</Text>}
        </View>
      </Panel>
      <Panel><ImpactChart data={impact} title="Portions shared this week" /></Panel>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 26, gap: 15 },
  listingLink: {
    backgroundColor: color.surface, borderRadius: 16, borderWidth: 1, borderColor: color.border,
    padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },
  linkText: { flex: 1, gap: 4 },
  ingredient: { color: color.green, backgroundColor: color.greenWash, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 30, fontSize: 12, fontWeight: '600' },
  recipeToggle: { minHeight: 38, paddingTop: 6, borderTopWidth: 1, borderColor: color.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  recipeAction: { color: color.green, fontWeight: '700', fontSize: 13 },
});

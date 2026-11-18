export const categories = ['Bakery', 'Produce', 'Prepared', 'Pantry'] as const;
export type Category = typeof categories[number];
export const neighborhoods = ['Kerrytown', 'Old West Side', 'Burns Park'] as const;
export type Neighborhood = typeof neighborhoods[number];
export type Account = 'Personal' | 'Business';

export interface Listing {
  id: string;
  name: string;
  category: Category;
  donor: string;
  neighborhood: Neighborhood;
  distance?: string;
  description: string;
  capacity: number;
  remaining: number;
  startsAt: number;
  endsAt: number;
  ingredients: string[];
  photo?: 'bread' | 'produce' | 'rolls' | 'fruit' | 'bowl' | 'oats';
  mine?: boolean;
}

export interface PantryState {
  account: Account;
  listings: Listing[];
  favorites: string[];
  reservations: string[];
}

const hour = 60 * 60_000;

export function makeDemoState(now = Date.now()): PantryState {
  const shared = { startsAt: now - 30 * 60_000, endsAt: now + 3 * hour };

  return {
    account: 'Personal',
    favorites: [],
    reservations: [],
    listings: [
      { ...shared, id: 'sourdough', name: 'Country sourdough', category: 'Bakery', donor: 'Juniper Bakehouse', neighborhood: 'Kerrytown', distance: '0.4 mi', description: 'Naturally leavened loaves from this morning’s bake. Crisp crust, soft crumb. Contains wheat.', capacity: 8, remaining: 6, photo: 'bread', ingredients: ['Sourdough'] },
      { ...shared, id: 'garden-box', name: 'Garden harvest box', category: 'Produce', donor: 'Maya R.', neighborhood: 'Old West Side', distance: '0.8 mi', description: 'A mix of ripe tomatoes and zucchini from my garden. Bring a bag for an easy pickup.', capacity: 8, remaining: 2, photo: 'produce', ingredients: ['Tomatoes', 'Zucchini'] },
      { ...shared, id: 'rolls', name: 'Cinnamon rolls', category: 'Bakery', donor: 'Juniper Bakehouse', neighborhood: 'Kerrytown', distance: '0.4 mi', description: 'Soft cinnamon rolls with vanilla glaze. Contains wheat, eggs and milk.', capacity: 6, remaining: 4, photo: 'rolls', ingredients: ['Cinnamon rolls'] },
      { ...shared, id: 'fruit', name: 'Market fruit bundle', category: 'Produce', donor: 'West Side Market', neighborhood: 'Old West Side', distance: '1.1 mi', description: 'A mixed bundle of apples and seasonal fruit. Some pieces are ripe and ready to eat today.', capacity: 5, remaining: 3, photo: 'fruit', ingredients: ['Apples'] },
      { ...shared, id: 'bowl', name: 'Roasted veggie bowl', category: 'Prepared', donor: 'The Green Kitchen', neighborhood: 'Burns Park', distance: '1.4 mi', description: 'Roasted vegetables and chickpeas with a lemon dressing. Keep refrigerated.', capacity: 6, remaining: 1, photo: 'bowl', ingredients: ['Chickpeas', 'Roasted vegetables'] },
      { ...shared, id: 'oats', name: 'Rolled oats', category: 'Pantry', donor: 'Sam T.', neighborhood: 'Burns Park', distance: '1.6 mi', description: 'Unopened bags of plain rolled oats. Great for baking or overnight oats.', capacity: 4, remaining: 4, photo: 'oats', ingredients: ['Oats'] },
    ],
  };
}

export const pantryStaples = ['Olive oil', 'Chickpeas', 'Lemon'];
export const recipes = [
  { name: 'Garden chickpea bowls', time: '20 min', ingredients: ['Chickpeas', 'Tomatoes', 'Zucchini', 'Lemon'], instructions: 'Roast the zucchini. Toss with chickpeas and tomatoes, then finish with lemon and a little olive oil.' },
  { name: 'Tomato toast with lemon', time: '10 min', ingredients: ['Sourdough', 'Tomatoes', 'Lemon', 'Olive oil'], instructions: 'Toast the sourdough. Toss diced tomatoes with lemon and olive oil, then spoon over the toast.' },
  { name: 'Apple overnight oats', time: '5 min prep', ingredients: ['Apples', 'Oats', 'Yogurt', 'Cinnamon'], instructions: 'Stir oats, yogurt and cinnamon in a jar. Refrigerate overnight and add chopped apple before serving.' },
];

export const impact = [
  { label: 'Mon', value: 5 }, { label: 'Tue', value: 8 }, { label: 'Wed', value: 6 },
  { label: 'Thu', value: 12 }, { label: 'Fri', value: 10 }, { label: 'Sat', value: 17 }, { label: 'Sun', value: 14 },
];

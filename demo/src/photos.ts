import type { ImageSourcePropType } from 'react-native';
import type { Listing } from './data';

export const photos: Record<NonNullable<Listing['photo']>, ImageSourcePropType> = {
  bread: require('../assets/bread.jpg'),
  produce: require('../assets/produce.jpg'),
  rolls: require('../assets/rolls.jpg'),
  fruit: require('../assets/fruit.jpg'),
  bowl: require('../assets/bowl.jpg'),
  oats: require('../assets/oats.jpg'),
};

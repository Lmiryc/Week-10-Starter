import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'PantryShare · Skia',
    colorPrimary: '#227755',
    colorSecondary: '#227755',
    appBg: '#F7F5EE',
    textColor: '#193329',
    barSelectedColor: '#227755',
  }),
});

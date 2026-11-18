# PantryShare Skia Component Library

Six React Native graphics components for the PantryShare Expo app. Storybook renders the same library source in the browser through React Native Web and CanvasKit. The package entry point exports the components, TypeScript props, and color tokens.

## Where the components fit

| PantryShare feature | Component | App data |
| --- | --- | --- |
| Discover | `AvailabilityMeter` | Remaining and original portions for a food listing |
| Discover and reservations | `PickupCountdown` | Pickup window start and end timestamps in milliseconds |
| AI Recipes | `ProgressRing` with `variant="recipe"` | Ingredients on hand out of the recipe total |
| Profile and rewards | `ProgressRing` with `variant="points"` | PantryPoints and the next badge target |
| Profile and community impact | `ImpactChart` | Labeled counts by day or week |
| Nearby | `PickupAreaIllustration` | Public neighborhood name for an illustration in the pickup preview |
| Share and Profile | `FeatureBanner` | Heading, optional description, and `share` or `impact` gradient |

Discover keeps its two-column layout and search, filters, favorites, and reservation interactions in React Native. Use a stable listing ID for both list keys and favorites. Pass the latest availability in as props so recycled cells display the current listing. Nearby can show a real map in the app with approximate areas, plus the Skia illustration in the listing preview. Forms, map interactions, account permissions, and recipe generation belong to the app.

## Run the catalog

Use Node 24 or Node 22.13 or later.

```sh
npm ci
npm run storybook
```

Open [localhost:6006](http://localhost:6006). Start with **PantryShare → Overview → Gallery**, then use the component stories to inspect props and states. For a package and static catalog build, run `npm run verify`.

## Use the library in an Expo app

Install the Skia version supported by your Expo SDK. This library has been built against React Native Skia 2.14.0. From the app directory, after pushing the library branch to your fork:

```sh
npx expo install @shopify/react-native-skia
npm install "git+https://github.com/Lmiryc/Week-10-Starter.git#yclmir"
```

For a local install, run `npm pack` in the library checkout and install the resulting archive from the app. The branch includes the package bundle in `dist/`. Rebuild and commit it when changing the public library source.

```tsx
import { AvailabilityMeter, ProgressRing, PickupCountdown } from 'pantryshare-skia';

<AvailabilityMeter remaining={listing.remaining} capacity={listing.capacity} />
<ProgressRing variant="recipe" value={recipe.ingredientsOnHand} target={recipe.ingredientsTotal} />
<PickupCountdown startsAt={Date.parse(reservation.startsAt)} endsAt={Date.parse(reservation.endsAt)} />
```

The countdown is a display derived from timestamps. Your reservation workflow remains responsible for the actual cutoff. Set `animated` on `FeatureBanner` to enable subtle native motion that respects the device's reduced motion setting. If your Expo app also targets web, initialize CanvasKit before importing the library. Follow the [React Native Skia web setup](https://wcandillon.github.io/react-native-skia/v2/docs/getting-started/web/).

## Publish Storybook later

The workflow builds `storybook-static/` on pushes to `yclmir`. It deploys only when you enable the repository variable.

1. Set **Settings → Pages → Source** to **GitHub Actions** on your fork.
2. Under **Settings → Secrets and variables → Actions → Variables**, set `PUBLISH_PANTRYSHARE_STORYBOOK` to `true`. If the `github-pages` environment restricts deployment branches, allow `yclmir`.
3. Push `yclmir`. The workflow renders the Pages URL in the deployment job when it finishes.

The catalog uses relative asset URLs and includes the same version of the CanvasKit WASM used by Skia. The expected project URL for the current fork is [lmiryc.github.io/Week-10-Starter/](https://lmiryc.github.io/Week-10-Starter/).

## Project structure

- `src/components/` contains the React Native components and Skia drawing code.
- `src/index.ts` defines the app-facing package exports.
- `src/stories/` contains mock examples and interactive Storybook controls.
- `dist/` contains the JavaScript bundle and type declarations for Git installs.

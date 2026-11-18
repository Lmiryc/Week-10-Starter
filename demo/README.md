# PantryShare Expo Demo

This Expo SDK 58 prototype uses the published component library's package entry point. The dependency `file:..` installs the bundle tracked in the repository root. The six graphics come from `pantryshare-skia`.

```sh
cd demo
npm ci
npm start
```

Press **i** in the Expo terminal to open an iOS simulator, **a** for Android, or **w** for web. You can also run `npm run web`. Use an Expo Go build that supports SDK 58. The start and export scripts copy the Skia CanvasKit binary for web.

## Try the prototype

1. **Discover** → save a listing, use the Saved filter, and open an item to reserve one portion. Open it again to cancel.
2. **Nearby** → select a public neighborhood and open a listing. The map is illustrative and the data contains no addresses.
3. **Recipes** → reserve the Garden Harvest Box and see how the saved ingredients change recipe matches. Suggestions are local examples.
4. **Share** → enter food details, pick an area and window, then publish. The listing appears in Discover.
5. **Profile** → see pickups, PantryPoints, and impact. Switch to Business and verify that new reservations are disabled.

Listings, favorites, reservations, and account choice persist on the current device. The demo uses fictional listings, local recipe matching, and sample community impact data. To start fresh in a browser, clear the site's local storage.

```sh
npm run check
npm run export:web
```


## Demo photography

The six local JPEGs in `assets/` were sliced from a built-in ImageGen food atlas. Prompt: “Six aligned editorial food photos: sourdough and sliced bread on linen, heirloom tomatoes and zucchini, glazed cinnamon rolls, apples and pears, roasted chickpeas and vegetables, and plain paper bags of rolled oats. Warm daylight, realistic texture, centered compositions, no text or frames.”

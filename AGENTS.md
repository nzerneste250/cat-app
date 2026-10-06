# AGENTS.md — Design and implementation guide

This document defines the product, visual, interaction, accessibility, and coding
conventions for the `swe3409-cat1-template` mobile application. Follow it when
adding or reviewing screens, components, navigation, and data flows.

## 1. Product context

The repository is an Expo/React Native TypeScript application. The current product
direction is **Harvest Predictor**, a lightweight farming assistant for users in
Rwanda. The original CAT scenario also includes a milk-collection workflow:
recording a farmer code, litres, arrival temperature, hours since milking, risk,
and delivery/server status. New work must preserve the existing farming-focused
visual language while keeping the CAT delivery requirements functional.

Primary users may have:

- Small phone screens and intermittent or slow mobile data.
- Limited time and attention while working outdoors.
- A preference for clear, plain language and visible confirmation.
- A need to use either English (`EN`) or Kinyarwanda (`RW`) where translations
  exist.

Design for quick scanning, large touch targets, low cognitive load, and graceful
offline behavior.

## 2. Technology and project structure

- Expo SDK 57, React 19, React Native 0.86, and strict TypeScript are in use.
- Use only dependencies already present in `package.json` unless the team agrees
  that a new dependency is necessary.
- Use `SafeAreaView` from `react-native-safe-area-context` for screen roots.
- Use React Navigation through `src/navigation/AppNavigator.tsx`; do not create a
  second navigation system.
- Use `Ionicons` from `@expo/vector-icons` for interface icons.
- Keep pure business rules in `src/logic.ts` and network helpers in `src/api.ts`
  or `src/health.ts`; do not embed these rules in visual components.
- Keep reusable UI in `src/components`, screen-level composition in `src/screens`,
  and shared data/types in their existing folders.
- Prefer local styles with `StyleSheet.create`. Avoid introducing a styling
  library or large global stylesheet without a clear need.

Important paths:

| Area | Location |
| --- | --- |
| App entry point | `App.tsx`, `index.ts` |
| Navigation | `src/navigation/AppNavigator.tsx` |
| Screens | `src/screens/` |
| Reusable components | `src/components/` |
| Business logic/types | `src/logic.ts` |
| API integration | `src/api.ts`, `src/health.ts`, `src/config.ts` |
| Shared colors | `src/constants/colors.ts` |
| Tests | `tests/` |

## 3. Visual design system

### Brand and color

The visual identity is calm, agricultural, and trustworthy. Use green as the
primary action and accent color, supported by warm neutral surfaces.

Recommended existing palette values:

- Primary green: `#2E7D32`.
- Dark green/text emphasis: `#1B5E20`.
- App background: `#F7F9F5`.
- White surface/card: `#FFFFFF`.
- Muted text: `#667085`.
- Standard body text: a dark neutral such as `#344054`.
- Border/divider: a light neutral such as `#E4E7EC`.
- Warning surface/text: pale yellow with dark yellow text, matching the existing
  information notice treatment.
- Error: a clearly distinguishable red for validation text and invalid borders.

Use color together with text, icons, borders, or status labels. Never communicate
important information by color alone.

### Typography

- Use the platform default sans-serif unless a font is explicitly added and
  loaded through `expo-font`.
- Screen titles are prominent, short, and sentence case.
- Section headings are semibold/bold and smaller than screen titles.
- Body text should be readable at normal phone distance; do not use tiny helper
  text.
- Keep labels above controls and use plain, direct language.
- Use sentence case, not all-caps, except for the compact `RW`/`EN` language
  switch labels.

### Layout and spacing

- Start screens with a safe-area root and a light neutral background.
- Use approximately 20 px horizontal screen padding, consistent with the existing
  `HomeScreen` and `PredictScreen`.
- Use vertical rhythm based on small, medium, and large gaps (roughly 8, 16, and
  24 px) rather than arbitrary one-off values.
- Group related controls inside white cards with rounded corners, internal
  padding, and subtle borders or shadows only when they improve hierarchy.
- Keep primary actions visually prominent and near the content they submit.
- Use `ScrollView` for form/content screens and `FlatList` for potentially long
  delivery lists.
- Avoid horizontal layouts that can clip on narrow devices. Allow text to wrap.
- Keep bottom content padding large enough that the last control is not hidden by
  system UI or the keyboard.

### Icons and imagery

- Use Ionicons with a consistent size and semantic name (`location-outline`,
  `analytics-outline`, `information-circle-outline`, etc.).
- Icons support labels; they must not replace required text.
- Use filled or tinted icon containers sparingly to identify card sections.
- Do not add decorative images that increase bundle size or obscure the primary
  task.

## 4. Screen and component patterns

### Screen shell

Each screen should generally follow this structure:

1. `SafeAreaView` root with `flex: 1` and the app background.
2. `ScrollView` or `FlatList` with horizontal padding and bottom spacing.
3. Short header: title plus one explanatory sentence when useful.
4. Main task content in one or more cards.
5. Clear primary action and visible success/error feedback.

The navigator currently uses a native stack with hidden default headers. Preserve
that behavior and implement screen headers inside each screen.

### Forms

Forms must be forgiving and explicit:

- Keep controlled state for every input.
- Provide a visible label, useful placeholder, and `accessibilityLabel` for every
  input.
- Use `keyboardType="numeric"` for numeric delivery fields.
- Validate before saving; show the first actionable validation message.
- Preserve user input after an error.
- Trim and normalize farmer IDs before creating a delivery.
- Clear fields only after a successful save.
- Disable or guard repeated submission while an asynchronous save is in progress.
- Ensure keyboard handling does not cover the active field or save button.

For the CAT delivery form, retain the exact validation messages specified in
`src/logic.ts` and the README.

### Lists and status

- Use `FlatList` for delivery records and stable IDs in `keyExtractor`.
- Show an intentional empty state: explain that there are no deliveries and what
  the user should do next.
- Display farmer ID, litres, risk word, and delivery status in a scannable row.
- Use the words `Sent` and `Saved on phone`; never rely on a color dot alone.
- Show totals above the list: count, litres, and high-risk count.
- For server health, use the exact status language: `Checking server...`,
  `Server OK`, and `Offline: deliveries stay on this phone`.

### Navigation

- Keep route names and parameter types in `RootStackParamList`.
- Navigation actions should have clear labels and adequate touch targets.
- Do not make users lose entered form data merely by navigating backward unless
  that behavior is intentional and communicated.

## 5. Accessibility and usability requirements

- Interactive controls should have at least a comfortable ~44 px touch area.
- Every icon-only control needs an `accessibilityLabel` and an appropriate role.
- Text must remain readable in both English and Kinyarwanda; allow wrapping.
- Error messages must be visible, specific, and adjacent to the relevant action or
  field.
- Status must be stated in words as well as represented visually.
- Maintain sufficient contrast between text and surfaces.
- Do not use placeholder text as the only field label.
- Test the main flow with the keyboard open and on a narrow Android device.

## 6. State, networking, and offline behavior

- UI components own transient input and presentation state.
- Pure validation, risk labels, and totals belong in `src/logic.ts`.
- API functions must never throw for expected network failure; return the failure
  value documented by their function contract and enforce the timeout.
- `API_URL` is configured for a physical phone, so `localhost` is not a valid
  assumption when the API runs on a laptop.
- To open Expo Go when the phone and computer are on different networks, use
  `npm run start:tunnel` (or `npx expo start --tunnel`). Expo Tunnel transports
  the JavaScript bundle; it does not automatically expose a backend running on
  the laptop.
- For a backend on a different network, configure `EXPO_PUBLIC_API_URL` in a
  local `.env.local` file with a reachable HTTPS URL. For local development,
  the phone and laptop must share Wi-Fi/hotspot and the API must bind to
  `0.0.0.0`.
- A failed risk request should leave the delivery usable with `risk: null` and
  display `Not checked`.
- A failed delivery submission must leave the record available locally and show
  `Saved on phone`.
- Do not log farmer data, network payloads, or credentials in production UI code.

## 7. Localization

- The existing home screen supports `RW` and `EN`; preserve the toggle behavior
  when modifying that screen.
- Keep user-facing strings centralized or grouped so translations can be added
  without changing component logic.
- Avoid concatenating strings where word order may differ between languages.
- Keep technical identifiers, route names, API keys, and test-required strings in
  English unless the feature contract says otherwise.

## 8. Ownership and milestone rules

Respect the ownership table in `README.md` and `MEMBERS.md`:

- M1: `src/logic.ts` — validation, labels, totals.
- M2: `src/components/DeliveryForm.tsx` — delivery form.
- M3: `src/components/DeliveryList.tsx` — list and totals.
- M4: `src/api.ts`, `App.tsx`, `src/config.ts` — API integration and wiring.
- M5: `src/health.ts`, `src/components/StatusBanner.tsx` — server status.

Delete the relevant `TODO Mn` marker when beginning that milestone, because the
tests intentionally skip unfinished milestone tasks while those markers exist.
Do not remove another member's marker or rewrite their owned file without
coordination. Avoid changing public types in `src/logic.ts` because multiple
milestones depend on them.

## 9. Quality gates and commands

Run these commands from the repository root after changes:

```bash
npm run typecheck
npm run test:logic
npm run test:api
npm run test:health
npm run check
npx expo start
```

Use the narrowest relevant test first, then run `npm run check` before merging.
For UI work, verify on an actual phone or Expo Go as well as through TypeScript.
Check empty, valid, invalid, loading, offline, and long-text states.

## 10. Git and review conventions

- Work on a focused branch named for the milestone and task.
- Keep commits small and descriptive, for example:
  `M3: show delivery totals and status`.
- Do not commit secrets, local IP addresses that should remain private, build
  artifacts, or unrelated formatting churn.
- Reviewers should confirm behavior, accessibility labels, offline handling, and
  that the relevant tests/typecheck pass.

When a design decision conflicts with this guide, prefer the existing component
patterns and the explicit requirements in `README.md`, then document the reason
in the pull request.

## 11. Implementation report — October 6, 2026

The current working implementation includes a complete lightweight mock Harvest
Predictor experience and the original CAT delivery milestones.

### Harvest Predictor flow completed

The farmer can move through the complete flow:

```text
Home → Location → Crop → Land & Season → Farming Information → Result
```

The result screen supports:

- Expected harvest in tonnes.
- Expected yield per hectare.
- Low and high estimate range.
- Crop, location, land, and season summary.
- Estimate disclaimer.
- Save prediction.
- Share result with the native React Native Share API.
- Make another prediction.

The Saved Predictions screen supports:

- Loading saved predictions from AsyncStorage.
- Opening a saved prediction result.
- Deleting a saved prediction.
- An intentional empty state for first-time users.

### Added application infrastructure

- `src/context/PredictionContext.tsx` stores the active prediction draft and
  persisted language preference.
- `src/i18n/translations.ts` provides shared `rw` and `en` translations, with
  Kinyarwanda as the default language.
- `src/services/index.ts` contains deterministic mock prediction logic.
- `src/storage/index.ts` contains AsyncStorage helpers for saved predictions.
- `src/types/index.ts` contains shared crop, season, land, input, result, and
  saved-prediction types.
- `src/constants/colors.ts` contains the shared agricultural color palette.

The prediction service intentionally contains mock values for interface testing:

> Mock values for interface testing only. Replace with trained model/API output.

The service must be replaced with the real ML/API integration before production
use. Mock numbers must not be described as official NISR predictions.

### CAT milestones completed

- **M1:** `src/logic.ts` now validates farmer IDs and deliveries, maps risk
  values to labels, and calculates delivery totals.
- **M2:** `src/components/DeliveryForm.tsx` now provides controlled inputs,
  validation, accessible labels, and save behavior.
- **M3:** `src/components/DeliveryList.tsx` now displays empty state, totals,
  farmer IDs, litres, risk labels, and `Sent`/`Saved on phone` status.
- **M4:** `src/api.ts` now implements timeout-safe risk requests and delivery
  submission using the required snake_case API payload.
- **M5:** `src/health.ts` and `src/components/StatusBanner.tsx` now provide
  timeout-safe health checks and the required server status messages.

### Validation report

The following checks passed on October 6, 2026:

```text
npx tsc --noEmit       PASS
npx expo-doctor        PASS — 21/21 checks passed
npm test               PASS — 15 passed, 0 failed, 0 skipped
```

The test suite includes:

- 6 M1 logic tests.
- 6 M4 API tests.
- 3 M5 health tests.

No `TODO M1` through `TODO M5` implementation markers remain in `src/`.

### Configuration and dependency status

- Expo SDK 57 was preserved.
- React Native and TypeScript configuration were preserved.
- `app.json` and `eas.json` were not changed by the feature implementation.
- No new dependency was added.
- Native Safe Area handling continues to use
  `react-native-safe-area-context`.
- No authentication, GPS, maps, payments, external API calls, or cloud database
  were added.

### Remaining work

Before release or demonstration as a production application:

1. Run `npx expo start` and verify the complete flow on a physical narrow Android
   device or Expo Go.
2. Verify keyboard behavior on all form screens.
3. Replace the mock prediction service with the trained model/API.
4. Connect the result flow to the real API when the backend contract is ready.
5. Review the existing unrelated working-tree changes before committing.
6. Create a focused commit only after the interactive phone review is complete.

### Farmer UI and navigation update — October 6, 2026

The farmer-facing UI was improved in commit
`3990f2677cbf680cfd9fb65c6d51bb3e2b5777b0` (`Improve prediction month picker and
bottom navigation`).

#### Planting month and year selector

- Added reusable `src/components/PlantingMonthSelector.tsx`.
- Replaced the inline month list with a lightweight modal containing:
  - Current year plus four dynamically generated future years.
  - A responsive three-column month grid.
  - Clear green selected states.
  - Large touch targets and Cancel/Confirm actions.
- Added English and Kinyarwanda month translations.
- Added `plantingYear` to the shared prediction input and saved-prediction type.
- Preserved the month/year selection in the global prediction draft while moving
  through prediction steps.
- Validation prevents the farmer from continuing without a selected month and year.

#### Bottom navigation architecture

- Replaced the single root stack presentation with one navigation container and a
  typed bottom tab navigator.
- Added tabs for Home, Prediction, and Saved with Ionicons and translated labels.
- Nested the existing prediction flow inside a typed Prediction stack:

  ```text
  Bottom tabs → Prediction tab → Location → Crop → LandSeason → FarmingInfo → Result
  ```

- Home Start Prediction opens the Prediction tab at Location.
- Make Another Prediction resets the draft and returns to Location.
- Saved predictions continue to load from AsyncStorage, can be opened in the
  Prediction result flow, and can be deleted.
- Safe-area handling remains based on `react-native-safe-area-context`; no
  deprecated React Native SafeAreaView was introduced.

#### Validation for this update

```text
npx tsc --noEmit       PASS
npx expo-doctor        PASS — 21/21 checks passed
npm test               PASS — 15 passed, 0 failed
npx expo config        PASS — Expo SDK 57 and Android package preserved
git diff --check       PASS
```

`npx expo start` was not launched a second time because port 8081 was already in
use by the existing development server. Expo requested interactive confirmation to
switch to port 8082, which is unavailable in the non-interactive command context.

The focused feature commit was created successfully. Unrelated pre-existing
working-tree changes remain outside that commit and were not included in it.

### Rwanda season and planting-date update — October 6, 2026

The prediction flow now uses centralized Rwanda agricultural season periods based
on the NISR Seasonal Agricultural Survey definitions. The implementation is in:

- `src/data/seasons.ts` — Season A, B, and C month definitions and year offsets.
- `src/utils/seasonDates.ts` — agricultural-year and calendar-year conversion.
- `src/components/PlantingMonthSelector.tsx` — season-dependent month picker.
- `tests/seasonDates.test.ts` — cross-year and invalid-season-month coverage.

Season A is explicitly represented as September–December of
`agriculturalYear - 1`, followed by January–February of `agriculturalYear`.
Seasons B and C use the agricultural year for all their months. Prediction input
now preserves `agriculturalYear`, `plantingMonth`, `plantingCalendarYear`, and
`plantingDateLabel` so Result and Saved screens show the actual planting date.

The Land & Season screen now offers descriptive selectable cards:

```text
Season A — September – February
Season B — March – June
Season C — July – September
```

Changing season clears an existing month selection. The month modal then shows
only valid months for the selected season and agricultural year, with the actual
calendar year displayed on each option (for example, `Oct 2026` for Season A
2027). Inline validation requires season, agricultural year, and a valid planting
month before prediction.

Validation for this update:

```text
npx tsc --noEmit       PASS
npx expo-doctor        PASS — 21/21 checks passed
npm test               PASS — 19 passed, 0 failed
git diff --check       PASS
```

### Season/month flow and responsive layout update — October 6, 2026

The Land & Season step was simplified so agricultural season and planting month
are one connected flow. The app now uses `orientation: "default"` in `app.json`,
allowing portrait and landscape layouts without changing the prediction
navigation or EAS package configuration.

Changes in this update:

- Land & Season now presents land size, unit, agricultural season, agricultural
  year, and valid planting months on one farmer-focused page.
- Planting month options are shown only after a season is selected.
- Season changes clear the previous planting month and its stored date metadata.
- Month cards display the actual calendar year for Season A cross-year dates.
- Continue is disabled until land size, unit, season, agricultural year, and
  planting month are complete.
- Land size, unit, season, year, and month edits are written to
  `PredictionContext` while the farmer edits, preserving them through rotation
  and navigation recreation.
- The month grid adapts between two, three, and four columns using the available
  window width; the bottom tab bar reduces height and icon size in landscape.
- The duplicate month selector was removed from Farming Information because the
  month now belongs directly to the season selection step.
- Land & Season uses vertical scrolling only for content that exceeds the
  viewport and avoids horizontal overflow.

Validation for this update:

```text
npx tsc --noEmit       PASS
npx expo-doctor        PASS — 21/21 checks passed
npm test               PASS — 19 passed, 0 failed
git diff --check       PASS
```

Manual rotation and narrow-device verification should still be performed in Expo
Go or on a physical Android device before release.

#### Final implementation status

The responsive season/month implementation was committed as:

```text
1a76be0 Improve season month flow and responsive layout
```

The planting-month selector is now an inline, season-dependent grid on the Land &
Season screen rather than a generic modal. It displays only the valid months for
the selected season and shows the actual calendar year for cross-year Season A
months. The Farming Information screen no longer duplicates month selection.

The app remains on Expo SDK 57, keeps the existing Home/Prediction/Saved tab
navigation, preserves AsyncStorage saved predictions and RW/EN localization, and
does not change the Android package name or EAS project configuration.

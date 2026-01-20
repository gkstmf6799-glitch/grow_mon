# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

그로우몬 (Grow-Mon) is a 90-day plant growing diary web application for elementary school students. As students record daily plant observations, their character evolves through 6 stages based on the number of diary entries (0→90 entries).

**Tech Stack**: React 18, Vite, Tailwind CSS, Framer Motion, date-fns, LocalStorage

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview
```

## Core Architecture

### State Management & Data Flow

The app uses **LocalStorage** as its primary data persistence layer with a centralized state management pattern in `App.jsx`:

1. **Single Source of Truth**: `App.jsx` maintains all global state:
   - `entries` (object): All diary entries keyed by date (YYYY-MM-DD)
   - `entryCount` (number): Total number of entries
   - `activeTab` (string): Current active view
   - Evolution celebration state

2. **Data Flow Pattern**:
   ```
   Component Action → Handler in App.jsx → Storage Util → LocalStorage
                                         ↓
                              loadEntries() refreshes state
                                         ↓
                              Props passed to child components
   ```

3. **LocalStorage Keys** (defined in `storage.js`):
   - `growmon_diary_entries`: All diary data (date → entry object)
   - `growmon_user_data`: User settings (start date)
   - `growmon_user_profile`: Profile info (name, plant name, avatar, etc.)

### Evolution System Logic

The evolution system (`utils/evolution.js`) is central to the app's gamification:

- **6 Evolution Stages**: Each defined in `EVOLUTION_STAGES` array with:
  - `level`, `name`, `minEntries`, `maxEntries`
  - `component`: Custom SVG React component (in `components/characters/`)
  - `emoji`, `message`, `color`

- **Evolution Check Flow**:
  1. When saving entry: `handleSaveEntry()` in App.jsx
  2. Compare previous vs new entry count: `checkEvolution(previousCount, newCount)`
  3. If evolved: Show `EvolutionCelebration` modal with confetti animation
  4. Character automatically updates via `getEvolutionStage(entryCount)`

- **Character Components**: Custom SVG illustrations stored in `src/components/characters/`:
  - Each level has its own component (Level1Egg, Level2Sprout, etc.)
  - Exported via `index.js` and imported into `evolution.js`
  - Dynamically rendered in `Character.jsx` using `stage.component`

### Navigation & View Architecture

Single-page app with tab-based navigation (`BottomNav.jsx`):

- **4 Main Views**:
  - `home`: Dashboard with character, stats, progress bar
  - `calendar`: Monthly calendar grid with photo thumbnails
  - `write`: Entry form (create/edit entries)
  - `timeline`: Chronological list of entries (newest first)

- **Profile Access**: Separate from bottom nav, accessed via User icon in Dashboard header

- **View Transitions**: All views wrapped in `<AnimatePresence>` for smooth Framer Motion transitions

### Date Handling Patterns

The app has specific patterns for working with dates:

1. **Storage Key Format**: Always `YYYY-MM-DD` string (e.g., "2026-01-20")
2. **Date Selection Flow**:
   - Calendar click → Sets `selectedDate` → Opens write tab with pre-filled date
   - Write tab direct access → Defaults to `new Date()` (today)
3. **Month Filtering**: `getEntriesByMonth(year, month)` filters by string prefix matching

### Custom Character System

Characters are **custom SVG React components**, not emojis or external images:

- Each component returns inline SVG with animations
- SVG includes cute faces, details, and `<animate>` elements
- Components are stored in `src/components/characters/` folder
- The `evolution.js` imports all characters and assigns them to stages via the `component` property
- `Character.jsx` renders the component dynamically: `{stage.component && <stage.component />}`

**Important**: When modifying characters, edit the SVG component files directly, not the `evolution.js` emoji or image properties.

## Key Design Patterns

### Profile Integration

Profile data (`getProfile()` from `storage.js`) is integrated across multiple components:

- **Dashboard**: Shows personalized subtitle "{name}님의 {plantName}" and elapsed days
- **Character**: Displays "{plantName} ({levelName}) {emoji}" format
- **Profile Component**: Full profile editor with user info, plant info, statistics, settings

Profile updates automatically reflect in real-time via React state updates.

### Animation Patterns

Consistent animation usage with Framer Motion:

1. **Page Transitions**: `<motion.div>` with `initial`, `animate`, `exit` props
2. **Character Display**: Floating animation (y: [0, -10, 0]) + pulsing glow effect
3. **Evolution Celebration**: Confetti particles with staggered animations
4. **Interactive Elements**: `whileHover`, `whileTap` for buttons and cards

### Error Handling

- All storage operations wrapped in try-catch blocks
- Return boolean success indicators from storage functions
- User-facing alerts for save/delete failures in `App.jsx` handlers
- Graceful fallbacks: Return empty objects/arrays on localStorage errors

## Important Conventions

### Component File Organization

```
src/
├── components/
│   ├── [ViewName].jsx         # Main view components
│   ├── characters/            # Character SVG components
│   │   ├── Level1Egg.jsx
│   │   ├── Level2Sprout.jsx
│   │   └── index.js           # Export all characters
│   └── BottomNav.jsx          # Shared navigation
├── utils/
│   ├── evolution.js           # Evolution logic + character imports
│   ├── storage.js             # LocalStorage operations
│   └── statistics.js          # Stats calculation utilities
└── App.jsx                    # Main app with state & routing
```

### Styling Conventions

- **Tailwind Utility Classes**: Primary styling method
- **Custom Colors**: Use `primary`, `background`, `textBrown` from tailwind.config.js
- **Responsive Design**: Mobile-first (works on all screen sizes)
- **Theme**: Modern pixel art aesthetic with smooth animations

### Data Validation

- **Photo Size**: No explicit validation (relies on LocalStorage ~5-10MB limit)
- **Date Format**: Always use `format(date, 'yyyy-MM-dd')` from date-fns
- **Entry Limit**: Evolution capped at 90 entries (max level at 86-90 range)

## Testing & Debugging

Since there are no test files, manual testing patterns:

1. **Evolution Testing**: Manually modify entry count in DevTools localStorage to test different stages
2. **Date Edge Cases**: Test month boundaries, leap years via date picker
3. **Storage Limits**: Monitor console for localStorage quota errors with large photos
4. **Animation Performance**: Check Framer Motion animations on lower-end devices

## Common Modification Patterns

### Adding a New Evolution Stage

1. Add entry to `EVOLUTION_STAGES` array in `evolution.js`
2. Create new SVG component in `components/characters/`
3. Export from `components/characters/index.js`
4. Import in `evolution.js` and assign to stage's `component` property
5. Update README.md evolution table

### Modifying Profile Fields

1. Update default object in `getProfile()` in `storage.js`
2. Add input fields in `Profile.jsx` component
3. Update save handler to include new field
4. If displaying elsewhere, update relevant components (Dashboard, Character, etc.)

### Changing Theme Colors

Edit `tailwind.config.js` `extend.colors` section - changes automatically propagate throughout app via Tailwind class names.

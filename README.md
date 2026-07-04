# WABIWABI Expo

WABIWABI is an Expo SDK 56 app for browsing anime, films, series, schedules, genres, and episode streams from the Winbu API.

## Run

```bash
npm install
npm run start
```

Useful commands:

```bash
npm run lint
npx tsc --noEmit
npm run web
```

## App Structure

- `app/` contains the active Expo Router routes.
- `app/(tabs)/index.tsx` is the home route for `/`.
- `src/api/` contains the Winbu API client and service layer.
- `src/components/ui/` contains reusable production UI components.
- `src/hooks/` contains query hooks and response normalization entry points.

## Notes

This project targets Expo SDK 56. Keep dependency changes aligned with the versioned Expo SDK 56 documentation.

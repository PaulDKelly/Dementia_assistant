# Dementia Assistant MVP Scaffold

This repository contains:

- `backend/supabase/mvp_schema.sql`: initial Supabase schema (roles, calendar, meds, diary, family feed, alerts).
- `app/`: an Expo React Native skeleton with large-touch UI and 5 primary screens.

## App screens (wired)

- Home
- Today
- Medication
- Family
- Talk

## Local setup

1. Install Node.js 18+ and npm.
2. From `app/`, install dependencies:
   - `npm install`
3. Start the app:
   - `npm start`

Optional targets:

- `npm run android`
- `npm run ios`
- `npm run web`

## Notes

- UI is intentionally minimal and accessibility-focused.
- The app skeleton is local-state based (no backend binding yet).
- The SQL schema is designed for Supabase/PostgreSQL and includes row-level-security stubs.
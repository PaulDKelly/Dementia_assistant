# Dementia Assistant MVP

This repository contains:

- `backend/supabase/mvp_schema.sql`: initial Supabase schema (roles, calendar, meds, diary, family feed, alerts).
- `app/`: an Expo React Native app with role-based auth flow and caregiver workflows.

## App screens (wired)

- Home
- Today
- Medication
- Family
- Talk
- QA (caregiver/admin only)
- Admin (admin role only)

## Local setup

1. Install Node.js 18+.
2. From `app/`, install dependencies:
   - `corepack yarn install` (recommended)
   - or `npm install`
3. Start the app:
   - `npm start`

Optional targets:

- `npm run android`
- `npm run ios`
- `npm run web`

## Notes

- UI is intentionally minimal and accessibility-focused.
- Local persistence is enabled via AsyncStorage.
- Supabase integration is supported for auth/profile data, medications, calendar, and family feed.
- If Supabase env vars are not set, the app runs in demo mode with role quick-start.
- The SQL schema is designed for Supabase/PostgreSQL and includes row-level-security stubs.

## Supabase configuration (optional)

Set these environment variables before running Expo:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

PowerShell example:

```powershell
$env:EXPO_PUBLIC_SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"
$env:EXPO_PUBLIC_SUPABASE_ANON_KEY = "YOUR_ANON_KEY"
cd app
npm start
```

You can copy `app/.env.example` to `.env` and fill your values before launching.

## Android-first testing (APK)

This project is configured for Android-first builds with EAS.

### One-time setup

1. Install Expo/EAS tooling:
   - `npm install -g eas-cli`
2. Log in to Expo:
   - `eas login`
3. From `app/`, initialize EAS project metadata (first time only):
   - `eas init`

### Build an installable APK

From `app/`:

- `npm run build:apk`

When the build completes, EAS provides an APK download link. Install that APK on your Android device for the first proper test pass.

Optional local APK build (requires local Android toolchain):

- `npm run build:apk:local`

### Build for Play Store later

From `app/`:

- `npm run build:aab`

### Important before release

- Update Android package id in `app/app.json`:
  - `expo.android.package`
- Increment `expo.android.versionCode` for each new uploaded release build.

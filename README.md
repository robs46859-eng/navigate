# Navigate Mama

`Navigate Mama` is a native Android app for new and pregnant mothers, built in the existing `navigate` repo and structured for Android Studio, with the legacy web prototype still present in `src/`.

## What is in the project

- Native multi-module Android project with:
  - `app` base module
  - `core-model`
  - `core-database`
  - `core-data`
  - `featurehealth` dynamic feature, install-time and removable
  - `featurecommunity` dynamic feature, on-demand download
- Recommended Android architecture:
  - `Room` for local persistence
  - `ViewModel` + `LiveData` for UI state
  - repositories separating data from UI
- Native screens implemented:
  - home map + nearby maternal-friendly places
  - place detail + review logging
  - pregnancy journey tracker
  - profile and settings shell
  - health tools module
  - community module
- Play Core integrations:
  - in-app review
  - in-app update check
  - dynamic feature install guard + `SplitCompat`

## Local build

The repo includes a Gradle wrapper and builds with:

- Android Gradle Plugin `8.13.2`
- Kotlin `2.0.21`
- Compile SDK `36`
- JDK from Android Studio bundled runtime

Build command:

```bash
./gradlew :app:assembleDebug
```

If Gradle cannot find the Android SDK, either set `ANDROID_HOME` or create a local-only `local.properties` file:

```properties
sdk.dir=/Users/<your-user>/Library/Android/sdk
```

## Android Studio notes

- Open `/Users/joeiton/Projects/navigate` in Android Studio.
- `local.properties` is configured for the local SDK path on this Mac.
- Gradle memory is pre-tuned in `gradle.properties` with a 6 GB heap and parallel/cached builds.
- The existing web app files are still present in the repo, but Android Studio should use the native Gradle project.

## Live service configuration still needed

The app currently builds and runs with seeded Denver data even if live services are not configured. To make the beta build production-connected, I still need these secrets/assets from you:

1. Android Firebase config for project `ai-studio-5d7d75b5-2c3b-4f65-9379-8a3b18c3cfdb`
   - ideally `google-services.json` for the Android app package you want to ship
2. Google Maps Android SDK key
   - set as `MAPS_API_KEY`
3. Google Sign-In OAuth client details
   - Android client ID / web client ID
   - SHA-1 and SHA-256 package fingerprints that should be registered
4. Final release package identity if different from current default:
   - `com.navigatemama.app`

## Current product assumptions

- Geography is centered on Denver metro because the source app content was already Denver-based.
- Seeded place data uses real named destinations and addresses for maternal-friendly stops and care locations.
- Until live Firebase credentials are provided, authentication and Firestore sync stay in graceful local-first mode.

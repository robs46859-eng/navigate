# 🚀 Navigate Mama Beta‑Launch Audit & Checklist
Below is a concise, execution‑focused audit of the current Android project (located at /Users/joeiton/androidstudioprojects/navigate). I’ve inspected the most relevant files (AndroidManifest.xml, root build.gradle.kts, module app/build.gradle.kts, google‑services.json, etc.) and identified the high‑leverage blockers that must be resolved before you can ship a beta to Google Play.
How to use this checklist – each row lists a task, an owner (you can re‑assign), a priority, and whether it is a “Must‑have before beta” or “Can wait until after beta”.
For any item marked ❗ Blocker, the app cannot be released until the issue is fixed.

1️⃣ Core Release‑Readiness Items
#
Task
Owner
Priority
Must‑have?
Notes / Next Steps
1
Signing configuration – create a release keystore, add signingConfigs to app/build.gradle.kts, and reference it in release build type.
 Perplexity 
Critical
✅ Yes
No keystore referenced yet. Add storeFile, storePassword, keyAlias, keyPassword. Verify gradle.properties holds the passwords (or use CI secret store).
2
Versioning – ensure versionCode is incremented for every beta upload and versionName follows semantic versioning (X.Y.Z‑beta).
 Perplexity 
High
✅ Yes
Currently versionCode = 1. Increment to 2 (or higher) before first beta.
3
Google Play App Bundle (AAB) generation – confirm ./gradlew bundleRelease succeeds and produces an .aab.
 Perplexity  / CI
High
✅ Yes
Run ./gradlew bundleRelease (see step 9).
4
Google Play Console – Store listing – fill in title, short/long description, screenshots, feature graphic, and privacy‑policy URL.
Perplexity / Claude
Critical
✅ Yes
Required for any beta track.
5
App signing on Play Console – enable “Google Play App Signing” and upload the upload key (or let Play generate it).
Perplexity 
Critical
✅ Yes
Must be done before first upload.
6
Release notes – draft beta release notes (what’s new, known issues).
 Perplexity 
Medium
✅ Yes
Appears in Play Console when you publish to the internal test track.
7
Dynamic‑feature modules – verify featurehealth and featurecommunity build correctly and are included in the AAB.
Perplexity 
High
✅ Yes
Run ./gradlew :featurehealth:assembleRelease etc.
8
ProGuard / R8 – currently isMinifyEnabled = false. Decide if you want code shrinking for beta (recommended for size & security).
 Perplexity 
Medium
❌ Can wait
If you enable, add appropriate keep rules for Firebase, Kotlin, and any reflection‑based code.
9
Gradle wrapper – ensure gradlew is committed and up‑to‑date (./gradlew wrapper --gradle-version 8.7).
 Perplexity 
Low
❌ Can wait
Guarantees reproducible builds on CI.


2️⃣ Crash‑Reporting & Analytics
#
Task
Owner
Priority
Must‑have?
Notes / Next Steps
10
Firebase Crashlytics – add com.google.firebase.crashlytics plugin, implementation(platform(libs.firebase.bom)), and implementation(libs.firebase.crashlytics). Enable firebaseCrashlytics { nativeSymbolUploadEnabled = true }.
 Perplexity 
Critical
✅ Yes
Crash reporting is a launch blocker; without it you cannot monitor beta stability.
11
Firebase Analytics – already pulling firebase.bom; add implementation(libs.firebase.analytics). Verify google-services.json contains analytics config.
 Perplexity 
High
✅ Yes
Needed for user‑behavior insights and Play Console “Analytics” tab.
12
Google Play Console – Pre‑launch report – after first upload, run the pre‑launch report to catch crashes on a matrix of devices.
 Perplexity 
Medium
❌ Can wait (after first beta upload)


13
Logcat filtering – add a custom log tag (e.g., NavigateMama) for easier debugging.
 Perplexity 
Low
❌ Can wait
Helpful but not a blocker.


3️⃣ Authentication & Backend Reliability
#
Task
Owner
Priority
Must‑have?
Notes / Next Steps
14
Firebase Auth – already included (libs.firebase.auth). Verify email/password sign‑in flow works on a real device.
 Perplexity  / QA
High
✅ Yes
Test login on the connected Pixel 9.
15
Firestore security rules – review firestore.rules for proper read/write restrictions.
 Perplexity 
Critical
✅ Yes
Open firestore.rules and ensure rules are not allow read, write: if true;.
16
Network error handling – confirm all Retrofit/OkHttp calls have proper timeout & retry logic.
 Perplexity 
Medium
❌ Can wait
Look for OkHttpClient builder in core-data module.
17
Backend health check – add a simple “ping” endpoint and UI health indicator for beta testers.
 Perplexity 
Low
❌ Can wait
Optional but improves beta experience.


4️⃣ Privacy & Legal
#
Task
Owner
Priority
Must‑have?
Notes / Next Steps
18
Privacy‑Policy URL – add to Play Console store listing.
 Perplexity 
Critical
✅ Yes
Must be a publicly accessible HTTPS URL.
19
Data‑collection disclosure – include a runtime consent dialog for location permissions (coarse/fine) and explain why they are needed.
 Perplexity 
High
✅ Yes
Android 13+ requires explicit permission rationale.
20
Google Play “Data safety” questionnaire – fill out accurately (Firebase Auth, Firestore, Crashlytics, Maps).
 Perplexity 
Critical
✅ Yes
Failure blocks publishing.
21
Third‑party SDK compliance – verify all libs.* dependencies have updated privacy notices (e.g., Play Services Maps).
 Perplexity 
Medium
❌ Can wait




5️⃣ Store / Beta Distribution
#
Task
Owner
Priority
Must‑have?
Notes / Next Steps
22
Internal test track – create an “Internal” track in Play Console, add tester email list, and upload the AAB.
 Perplexity 
Critical
✅ Yes
Fastest way to get the app on the Pixel 9.
23
Device compatibility – verify minSdk = 29 and targetSdk = 36 meet Play Store requirements (target ≥ 33).
Perplexity 
High
✅ Yes
Already target 36 – good.
24
App bundle size – run ./gradlew :app:bundleRelease and check size (< 150 MB). If > 150 MB, enable Play Asset Delivery or split APKs.
 Perplexity 
Medium
❌ Can wait


25
Beta release notes – draft concise notes describing the beta scope and known issues.
Perplexity 
Medium
✅ Yes


26
Tester onboarding – prepare a short “How to install beta” guide (link to Play Store opt‑in).
Perplexity 
Low
❌ Can wait




📋 Concrete Action Plan (ordered by blocker severity)
Create & configure release keystore – generate (keytool -genkeypair), add to gradle.properties, reference in app/build.gradle.kts.
Enable Firebase Crashlytics & Analytics – add plugins & dependencies, sync Gradle, run a test build to verify FirebaseCrashlytics initialization.
Review & harden Firestore security rules – open firestore.rules, replace any permissive rules with proper auth checks.
Fill Play Console store listing – title, description, screenshots, privacy‑policy URL, data‑safety questionnaire.
Enable Google Play App Signing – upload the keystore (or let Play generate) and link it to the project.
Increment versionCode to 2 (or higher) and confirm versionName reflects beta (0.1.1‑beta).
Run a release bundle build: ./gradlew bundleRelease – ensure it succeeds and produces app-release.aab.
Upload AAB to Internal test track – add testers, publish.
Validate on emulator – install internal test, verify launch, login, location permission flow, and that Crashlytics logs appear in Firebase console.
Optional – enable code shrinking (R8) and add ProGuard keep rules for Firebase & Kotlin reflection.

📌 How to Debug Remaining Issues
If any step fails, follow the exact instructions below:
Issue
File to open
UI action
Code line / function
Command to run
Expected output
Keystore missing / signing error
app/build.gradle.kts (line 22‑27)
In Android Studio, open Gradle Scripts → app → build.gradle.kts
signingConfigs { release { … } } block
./gradlew assembleRelease
Should print BUILD SUCCESSFUL. If not, error will mention “keystore file not found”.
Crashlytics not initialized
NavigateMamaApp.kt (application class)
Open NavigateMamaApp.kt under src/main/java/...
FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true)
Run app on Pixel 9 (adb logcat -s Crashlytics)
Log line Firebase Crashlytics initialized.
Firestore rules too permissive
firestore.rules
Open file from project root
Look for allow read, write: if true;
No command – just edit.
After edit, run firebase emulators:exec "npm test" (if you have emulator) to verify rules.
AAB build fails
app/build.gradle.kts (line 23‑30)
Open the file, check release block
isMinifyEnabled = false (or true)
./gradlew bundleRelease
Should end with :app:bundleRelease and produce app-release.aab.
Missing Google‑services plugin
build.gradle.kts (root)
Verify alias(libs.plugins.google.services) apply false is applied in app module
In app/build.gradle.kts ensure apply(plugin = "com.google.gms.google-services") at bottom
./gradlew :app:assembleRelease
No “Plugin with id 'com.google.gms.google-services' not found” error.

Copy‑paste the exact command into your terminal; if you see an error, paste the full output back here and I’ll guide you through the fix.

✅ Ready to Move Forward
Immediate blockers: signing config, Crashlytics, Firestore rules, Play Console store listing.
After those are resolved, you can generate the AAB, upload to the internal test track, and start collecting real‑world crash and usage data.

---

## Repo status (implementation sync — `navigate/`)

| Item | In repo |
|------|---------|
| `firestore.rules` + `firebase.json` | Yes — run `firebase deploy --only firestore:rules` |
| Firebase Crashlytics + Analytics (Gradle + deps) | Yes — `NavigateMamaApp` enables Crashlytics collection |
| `AppLog` tag `NavigateMama` | Yes — `adb logcat -s NavigateMama` |
| Version bump | `versionCode` **2**, `versionName` **0.1.1-beta** |
| Release signing template | `app/build.gradle.kts` + commented keys in `gradle.properties` |
| Location consent copy (runtime) | Yes — `HomeFragment` education + rationale dialogs |
| DESIGNMASTER visual pass | Dark industrial theme, 0dp radii, kinetic gradient CTA drawable — see `themes.xml`, `colors.xml`, `DESIGNMASTER.md` |

**Still manual (Play / Firebase console):** keystore file, store listing, privacy policy URL, Data safety form, internal test track, `bundleRelease` verification.


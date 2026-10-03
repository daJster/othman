Core (platform-agnostic)
- core/types/*: AuthUser/AuthResult, AccountData (includes phoneNumber), Meeting.date: Date, UserRole
- core/domain/account/merge-profile.ts: safe profile merge (no unsafe as cast, preserves auth fields)
- core/domain/meetings/{date-key,cache,repository}.ts: bounded cache + DI for fetch (repository accepts FetchMeetingsFn) — ready for TanStack Query wrappers
- core/config/{urls,quran,shaykh}.ts: split from data/configData.ts, shaykh data stripped of DOM icon imports
- core/http/{client,json-cache}.ts: FetchHttpClient with timeout/abort + normalized HttpError; static-asset LRU+TTL cache; no request-layer caching (left to TanStack Query)
- core/utils/{text,heatmap}.ts: extracted getInitials, tokenizeArabic, getHeatmapColor (RGB lerp)
Platform contracts + impls
- platform/storage/*: async StorageService with typed StorageKey; web uses localStorage, native uses @react-native-async-storage/async-storage; Metro .native/.web extension re-export
- platform/auth/*: AuthService contract (email/password, Google stub for native), Firebase JS SDK bootstrap; web uses signInWithPopup, native uses initializeAuth (persistence removed for v12 compatibility, safe default); services/firebase.ts uses EXPO_PUBLIC_FIREBASE_*; services/profile.repository.ts (Firestore users/{uid})
Guardrails
- tsconfig.core.json compiles only src/core with lib: ["ESNext"] — core has 0 TS errors
- ESLint enforces core boundary (no React/RN/Firebase/DOM from core, no fetch outside core/http)
- .gitignore now ignores .env (keeps .env.example)
- Root scripts added: typecheck, typecheck:core, build:web/ios/android, verify
Verification
- npx tsc -p tsconfig.core.json --noEmit → 0 errors
- npx tsc --noEmit → 0 errors (463 legacy errors remain, all inside othman-web/** as expected)
- npx expo lint → 0 errors, 3 warnings (pre-existing, outside new core/platform/services)
- npx expo export --platform web → builds successfully (dist created)
othman-web/ remains untouched (reference). Meeting.date changed to Date in core types only; downstream consumers in the new structure will be updated when wiring TanStack Query.
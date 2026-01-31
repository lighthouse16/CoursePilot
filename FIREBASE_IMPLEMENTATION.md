# Firebase Implementation Summary

This document summarizes the Firebase integration added to CoursePilot.

## What Was Implemented

### 1. Firebase Configuration (`src/config/firebase.ts`)

- Firebase app initialization
- Exports Firebase Auth and Firestore instances
- Uses placeholder config (user needs to add their own credentials)

### 2. Firebase Authentication Service (`src/services/firebase-auth.ts`)

Provides wrapper functions for Firebase Auth:

- `signUpWithEmail(email, password, displayName)` - Create new user account
- `signInWithEmail(email, password)` - Sign in existing user
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get currently authenticated user
- `onAuthStateChange(callback)` - Listen to auth state changes

### 3. Firebase Sync Service (`src/services/firebase-sync.ts`)

Handles data synchronization with Firestore:

- `saveStateToFirebase(userId, state)` - Upload app state to Firestore
- `loadStateFromFirebase(userId)` - Download app state from Firestore
- `mergeStates(localState, remoteState)` - Merge local and cloud data
  - Uses last-write-wins strategy based on timestamps
  - Handles conflicts intelligently

### 4. Enhanced App Store (`src/store/useAppStore.ts`)

Added Firebase integration to the Zustand store:

**New State Fields:**

- `firebaseUserId: string | null` - Current Firebase user ID
- `syncInProgress: boolean` - Sync operation status

**New Actions:**

- `signInWithFirebase(email, password, displayName)` - Sign in with Firebase
  - Attempts sign in, creates account if user doesn't exist
  - Merges local and remote state
  - Saves merged state to both local storage and Firebase
- `syncWithFirebase()` - Manual sync to Firebase
  - Uploads current state to Firestore
  - Only works if user is authenticated
  - Prevents concurrent sync operations

**Enhanced Actions:**

- `signOut()` - Now also signs out from Firebase
  - Clears Firebase user ID
  - Maintains local data

### 5. Updated Sign-In Screen (`app/auth/sign-in.tsx`)

Enhanced the sign-in experience:

**New Features:**

- Password input field (shown when email is entered)
- "Enable cloud sync" checkbox
- Loading state with spinner
- Error message display

**Sign-In Modes:**

1. **Local Only** (default): Name only or name + email
2. **Firebase Sync**: Name + email + password + checkbox enabled

**UI Improvements:**

- Conditional rendering of password and checkbox
- Dynamic submit button text (Loading... / Get Started)
- Contextual note text based on sync mode
- Visual feedback with checkbox styling

### 6. Updated Data Types (`src/data/storage.ts`)

Extended `AppState` interface:

- Added `firebaseUserId: string | null`
- Added `syncInProgress: boolean`
- Updated `getInitialState()` to include new fields

## How It Works

### First-Time User Flow (with Firebase)

1. User enters name, email, and password
2. Checks "Enable cloud sync"
3. App attempts to sign in with Firebase
4. If user doesn't exist, creates new account
5. Empty remote state is returned
6. Local state is uploaded to Firebase
7. User is signed in with synced data

### Existing User Flow (with Firebase)

1. User enters email and password
2. Checks "Enable cloud sync"
3. App signs in with Firebase
4. Loads remote state from Firestore
5. Loads local state from AsyncStorage
6. Merges states (remote wins if newer)
7. Saves merged state locally and to Firebase
8. User is signed in with synced data

### Local-Only Flow (no Firebase)

1. User enters name (and optionally email)
2. Leaves "Enable cloud sync" unchecked
3. App saves user info to local storage only
4. No Firebase operations occur
5. Data stays completely offline

### Automatic Sync

Currently, sync happens at sign-in. To enable automatic background sync:

- Call `syncWithFirebase()` after data mutations in the store
- Set up periodic sync with a timer
- Implement real-time listeners with Firestore snapshots

## Security

### Firestore Rules (Recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures:

- Only authenticated users can access data
- Users can only read/write their own data
- No cross-user data access

### Data Structure in Firestore

```
users/
  {userId}/
    state/
      app_state: {
        version: 1,
        user: {...},
        terms: [...],
        courses: [...],
        // ... all app data
        lastUpdatedAt: "2024-01-15T10:30:00.000Z"
      }
```

## What's NOT Implemented (Yet)

### 1. Automatic Background Sync

- Manual sync only (at sign-in)
- Could add: Sync after every mutation
- Could add: Periodic background sync
- Could add: Sync on app foreground/background

### 2. Real-Time Sync

- No live listeners for multi-device updates
- Changes on one device won't instantly appear on another
- Could implement with Firestore's `onSnapshot()`

### 3. Conflict Resolution

- Uses simple last-write-wins
- No granular conflict detection
- No user-prompted conflict resolution
- Could improve with operational transforms or CRDTs

### 4. Offline Queue

- Failed syncs are not retried
- No queue for pending uploads
- Could add retry logic with exponential backoff

### 5. Storage Optimization

- Entire state is uploaded every time
- No incremental/delta syncs
- Could optimize with change tracking

### 6. File Uploads

- Material files (PDFs, etc.) are not uploaded
- Only metadata is synced
- Could add Firebase Storage integration

## Testing

### Without Firebase (Local Only)

1. Run app: `npx expo start`
2. Enter name, click "Get Started"
3. Verify data persists after app restart

### With Firebase

1. Complete Firebase setup (see FIREBASE_SETUP.md)
2. Add credentials to `src/config/firebase.ts`
3. Run app: `npx expo start`
4. Enter email, password, name
5. Check "Enable cloud sync"
6. Click "Get Started"
7. Verify data in Firebase Console:
   - Authentication > Users (should see your account)
   - Firestore Database > users > {your-id} (should see data)

### Multi-Device Sync Test

1. Sign in on Device A with Firebase
2. Add some courses and study data
3. Close app on Device A
4. Sign in on Device B with same email/password
5. Verify all data appears on Device B

## Next Steps

### For Users

1. Follow [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to set up Firebase
2. Test local-only mode first (no Firebase setup needed)
3. Add Firebase credentials when ready for cloud sync
4. Create account and start using the app

### For Developers

1. **Add Auto-Sync**: Call `syncWithFirebase()` after mutations

   ```typescript
   addCourse: (params) => {
     // ... add course logic
     await get().syncWithFirebase(); // Add this
   };
   ```

2. **Add Real-Time Listeners**:

   ```typescript
   // In init() or after sign-in
   onSnapshot(doc(db, `users/${userId}/state/app_state`), (snap) => {
     const remoteState = snap.data();
     // Merge and update local state
   });
   ```

3. **Improve Conflict Resolution**:
   - Track last-modified timestamps per entity
   - Implement three-way merge
   - Show user conflicts that can't be auto-resolved

4. **Add Retry Logic**:
   - Queue failed sync operations
   - Retry with exponential backoff
   - Show sync status in UI

5. **Optimize Storage**:
   - Only sync changed data (delta sync)
   - Compress large data before upload
   - Implement pagination for large collections

## Troubleshooting

### "Firebase is not configured"

- Check that you've updated `src/config/firebase.ts` with your credentials
- Verify Firebase project exists in console

### "Permission denied"

- Ensure Firestore security rules are set up correctly
- Verify user is authenticated before syncing
- Check that Firebase Auth is enabled

### "Auth/invalid-email"

- Verify email format is valid
- Check for extra spaces

### "Auth/weak-password"

- Firebase requires passwords to be at least 6 characters
- Use a stronger password

### Data not syncing

- Check internet connection
- Verify Firebase config is correct
- Look for errors in console logs
- Ensure user is authenticated with Firebase

## File Changes Summary

**Modified Files:**

- `src/store/useAppStore.ts` - Added Firebase integration
- `src/data/storage.ts` - Added Firebase fields to AppState
- `app/auth/sign-in.tsx` - Added Firebase sign-in UI
- `README.md` - Updated with Firebase info

**New Files:**

- `src/config/firebase.ts` - Firebase initialization
- `src/services/firebase-auth.ts` - Auth wrapper
- `src/services/firebase-sync.ts` - Sync utilities
- `FIREBASE_SETUP.md` - Setup guide
- `FIREBASE_IMPLEMENTATION.md` - This file

**Dependencies Added:**

- `firebase` - Firebase JavaScript SDK

## Architecture Decisions

### Why Firebase?

- Easy setup for indie developers
- Generous free tier
- Excellent mobile SDK support
- Real-time capabilities
- Handles auth and database together

### Why Not Real-Time by Default?

- Simplifies initial implementation
- Reduces bandwidth usage
- Gives users control over sync timing
- Easier to debug

### Why Zustand?

- Simple API, less boilerplate than Redux
- Built-in TypeScript support
- Easy to integrate with async operations
- Perfect for small to medium apps

### Why AsyncStorage + Firebase?

- Offline-first approach
- App works without internet
- Fast local reads
- Cloud backup as enhancement
- Best of both worlds

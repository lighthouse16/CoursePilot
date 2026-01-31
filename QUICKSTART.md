# Quick Start: Using CoursePilot with Firebase

## Option 1: Use Locally (No Setup Required)

1. Start the app:

   ```bash
   npx expo start
   ```

2. On the sign-in screen:
   - Enter your name
   - Optionally enter an email
   - Click "Get Started"

3. Your data will be saved locally on your device only.

## Option 2: Enable Cloud Sync with Firebase

### Quick Setup (5 minutes)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Name it "CoursePilot" (or anything you like)
   - Click through the setup (disable Analytics if asked)

2. **Add Web App**
   - Click the web icon (</>)
   - Register app with nickname "CoursePilot Web"
   - Copy the config object that looks like:
     ```javascript
     const firebaseConfig = {
       apiKey: "...",
       authDomain: "...",
       projectId: "...",
       // etc.
     };
     ```

3. **Update Config File**
   - Open `src/config/firebase.ts` in your project
   - Replace the placeholder config with your actual config
   - Save the file

4. **Enable Email Authentication**
   - In Firebase Console, go to Build → Authentication
   - Click "Get started"
   - Enable "Email/Password" sign-in method
   - Click "Save"

5. **Create Firestore Database**
   - Go to Build → Firestore Database
   - Click "Create database"
   - Select "Start in test mode"
   - Choose a location (closest to you)
   - Click "Enable"

6. **Update Security Rules** (Important!)
   - Go to Firestore Database → Rules
   - Replace with:
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
   - Click "Publish"

### Using Cloud Sync

1. Start the app:

   ```bash
   npx expo start
   ```

2. On the sign-in screen:
   - Enter your name
   - Enter your email
   - Enter a password (at least 6 characters)
   - **Check the "Enable cloud sync" box**
   - Click "Get Started"

3. Your data will now sync to Firebase!

### Verify It's Working

1. **Check Authentication:**
   - Open Firebase Console
   - Go to Authentication → Users
   - You should see your email listed

2. **Check Data:**
   - Go to Firestore Database
   - Look for `users` → `{your-id}` → `state` → `app_state`
   - You should see your app data

### Multi-Device Sync

1. Sign in on another device with the same email/password
2. Check "Enable cloud sync"
3. All your courses and progress will appear!

## Troubleshooting

**"Failed to sign in"**

- Make sure you've updated `src/config/firebase.ts` with your actual config
- Verify Email/Password auth is enabled in Firebase Console

**"Permission denied"**

- Check that you've updated the Firestore security rules
- Make sure you're checking the "Enable cloud sync" box

**Password requirements**

- Must be at least 6 characters long

## What Gets Synced?

Everything!

- Your courses and units
- All study materials (metadata)
- Your review progress and streaks
- Concepts you're learning
- Flashcards and practice questions

## What Doesn't Get Synced?

- Actual PDF files or documents (only metadata)
- The app only syncs when you sign in (no automatic background sync yet)

## Privacy & Security

- Your data is encrypted in transit (HTTPS)
- Only you can access your data (enforced by Firestore rules)
- Data is stored in Google's Firebase (see [Firebase Privacy](https://firebase.google.com/support/privacy))
- You can delete your data anytime from Firebase Console

## Need More Help?

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

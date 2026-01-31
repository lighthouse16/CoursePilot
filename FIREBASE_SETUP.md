# Firebase Setup Guide

This guide will help you set up Firebase for CoursePilot to enable cloud sync and authentication.

## Prerequisites

- A Google account
- Node.js and npm installed
- CoursePilot project already set up

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter a project name (e.g., "CoursePilot")
4. Disable Google Analytics (optional, not needed for this app)
5. Click **Create project**

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (</>)
2. Enter an app nickname (e.g., "CoursePilot Web")
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click **Register app**
5. Copy the `firebaseConfig` object - you'll need this in the next step

## Step 3: Update Firebase Configuration

1. Open `src/config/firebase.ts` in your project
2. Replace the placeholder config with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## Step 4: Enable Authentication

1. In the Firebase Console, go to **Build > Authentication**
2. Click **Get started**
3. Click on **Email/Password** under Sign-in method
4. Toggle **Enable** to ON
5. Click **Save**

## Step 5: Set Up Firestore Database

1. In the Firebase Console, go to **Build > Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Choose a Firestore location (select the one closest to you)
5. Click **Enable**

### Update Security Rules (Important!)

After creating the database, update the security rules:

1. Go to **Firestore Database > Rules**
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## Step 6: Test Your Setup

1. Run your app: `npx expo start`
2. On the sign-in screen, enter:
   - Your name
   - An email address
   - A password (at least 6 characters)
3. Check the "Enable cloud sync" checkbox
4. Click "Get Started"

If everything is configured correctly, you should be signed in and your data will sync to Firebase.

## Verify Data in Firebase

1. Go to **Authentication** in Firebase Console - you should see your user account
2. Go to **Firestore Database** - you should see a `users` collection with your data

## Troubleshooting

### "Firebase: Error (auth/api-key-not-valid-please-pass-a-valid-api-key)"

- Double-check that you copied the correct `apiKey` from Firebase Console
- Make sure there are no extra spaces or quotes in the config

### "Firebase: Access to this account has been temporarily disabled"

- This usually means Firebase detected suspicious activity
- Wait a few minutes and try again, or reset your password

### "Permission denied" when syncing

- Make sure you've updated the Firestore security rules (Step 5)
- Verify that you're signed in with Firebase authentication

### Data not syncing

- Check your internet connection
- Open the browser console to see detailed error messages
- Verify your Firebase config is correct in `src/config/firebase.ts`

## Features Enabled

Once Firebase is set up, you get:

- **Cloud Backup**: All your courses, units, materials, and progress are backed up to the cloud
- **Multi-device Sync**: Access your data from any device by signing in with the same account
- **Automatic Merge**: Local and cloud data are merged intelligently when you sign in
- **Offline Support**: The app still works offline, and syncs when you're back online

## Security Notes

- Never commit your `firebase.ts` file with real credentials to a public repository
- Add `src/config/firebase.ts` to `.gitignore` if sharing your code
- Use environment variables for production deployments
- Test mode Firestore rules are for development only - tighten them for production

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

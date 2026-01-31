# CoursePilot 🎓

A course-first study companion built with Expo and React Native. CoursePilot helps you organize your courses, materials, and study sessions with intelligent spaced repetition.

## Features

- **Course Management**: Organize courses by terms and units
- **Material Tracking**: Upload and track PDFs, slides, notes, and links
- **Intelligent Study System**: Spaced repetition with SRS algorithm
- **Mistake-Driven Review**: Focus on concepts you're struggling with
- **Progress Tracking**: See your mastery levels and study streaks
- **Cloud Sync** (Optional): Back up your data with Firebase
- **Offline-First**: Works without internet, syncs when online

## Get Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the app**

   ```bash
   npx expo start
   ```

3. **(Optional) Set up Firebase for cloud sync**

   See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

In the output, you'll find options to open the app in:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Project Structure

```
app/                    # Expo Router screens
├── (tabs)/            # Tab navigation
│   ├── index.tsx      # Today's mission
│   ├── courses.tsx    # Course list
│   └── settings.tsx   # Settings
├── auth/              # Authentication
│   └── sign-in.tsx    # Sign in screen
├── course/            # Course details
├── unit/              # Unit details
└── study/             # Study session

src/
├── config/            # Firebase configuration
├── data/              # Data layer (storage, seed)
├── services/          # Firebase services (auth, sync)
├── store/             # Zustand state management
├── types/             # TypeScript types
└── ui/                # Reusable UI components

constants/             # Theme and constants
```

## Tech Stack

- **Framework**: Expo Router (React Native)
- **State Management**: Zustand
- **Local Storage**: AsyncStorage
- **Cloud Sync**: Firebase (optional)
- **Language**: TypeScript

## Firebase Setup (Optional)

Firebase enables cloud backup and multi-device sync. Follow these steps:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Email/Password authentication
3. Create a Firestore database
4. Copy your config to `src/config/firebase.ts`

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for complete instructions.

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Firebase Documentation](https://firebase.google.com/docs)

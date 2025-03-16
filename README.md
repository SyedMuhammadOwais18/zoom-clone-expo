# 🎥 Video Calling App

This project is an Expo React Native application that facilitates video calling capabilities using modern web services and authentication.

## 📦 Features

- User authentication via Clerk.
- Video calling powered by Stream Video SDK.
- Easy and intuitive navigation using Expo Router.
- Optimized UI/UX for seamless user experience.

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd video-calling-app
```

### 2. Install Dependencies

Install the necessary node modules with:

```bash
npm install
```

or

```bash
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your environment variables:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_GET_STREAM_API_KEY=your_stream_api_key
EXPO_PUBLIC_API_URL=your_backend_api_url
```

### 4. Running on a Simulator

- **Install Android Studio**: [Download Android Studio](https://developer.android.com/studio)
- Set up an Android Virtual Device (AVD) via Android Studio.
- Ensure your simulator is running.

Run the app using:

```bash
npx expo start -c --dev-client
```

This command starts the Expo development server and opens your app on the connected emulator.

## 🛠 Building the App

To create a development build for Android simulators, run:

```bash
npx eas build --platform android --profile development-simulator
```

## 📚 Project Structure

- `/app`: Main application screens and layouts.
- `/components`: Reusable React components.
- `/constants`: Constant values and configurations.
- `/hooks`: Custom hooks.
- `/lib`: Utility functions and helper libraries.

## 📖 Tech Stack

- **Expo & Expo Router**
- **React Native**
- **TypeScript**
- **Clerk Authentication**
- **Stream Video SDK**

## ✨ Contribution

Contributions and suggestions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.


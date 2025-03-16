import { Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { RootSiblingParent } from "react-native-root-siblings";

import "react-native-reanimated";
import { tokenCache } from "@/cache";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <RootSiblingParent>
          <GestureHandlerRootView style={{flex:1}}>
            <Slot />
          </GestureHandlerRootView>
        </RootSiblingParent>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

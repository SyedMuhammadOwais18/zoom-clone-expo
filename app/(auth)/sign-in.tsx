import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  Button,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledButton from "@/components/ui/StyledButton";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

// Completes any pending auth sessions.
WebBrowser.maybeCompleteAuthSession();

// A hook to warm up the browser (recommended on Android)
const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
export default function Page() {
  useWarmUpBrowser();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Whoops");
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Whoops");
    }
  }, [isLoaded, emailAddress, password]);

  // Google SSO sign in
  const onGoogleSignInPress = useCallback(async () => {
    try {
      const result : any = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (result.createdSessionId) {
        await result.setActive({ session: result.createdSessionId });
        router.replace("/");
      } else {
        // Handle additional steps if necessary (e.g. MFA)
        console.log("Additional steps required:", result);
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Google sign in failed");
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#5F5DEC",
        paddingHorizontal: 20,
        gap: 10,
      }}
    >
      <MaterialIcons
        name="video-chat"
        size={160}
        color="white"
        style={{ alignSelf: "center", paddingBottom: 20 }}
      />
      <TextInput
        style={{
          borderRadius: 10,
          padding: 20,
          backgroundColor: "white",
          width: "100%",
        }}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={{
          borderRadius: 10,
          padding: 20,
          backgroundColor: "white",
          width: "100%",
        }}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <View
        style={{
          borderBottomColor: "white",
          borderBottomWidth: 1,
          marginVertical: 20,
        }}
      />
      <StyledButton title="Sign in" onPress={onSignInPress} />

      <Text style={{ color: "white", textAlign: "center" }}>OR</Text>
      {/* <SignInWithAuth /> */}
      <StyledButton title="Sign in with Google" onPress={onGoogleSignInPress} />
      <View
        style={{
          borderBottomColor: "white",
          borderBottomWidth: 1,
          marginVertical: 20,
        }}
      />
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text
            style={{
              color: "white",
              textDecorationLine: "underline",
              fontWeight: "bold",
            }}
          >
            Sign up
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

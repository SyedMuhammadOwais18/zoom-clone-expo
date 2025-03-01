import * as React from "react";
import {
  Text,
  TextInput,
  Button,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import StyledButton from "@/components/ui/StyledButton";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err:any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
    //   console.error(JSON.stringify(err, null, 2));
    Alert.alert("Error" , err.errors[0].message);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err:any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert("Looks like you enter the wrong code. \n\nPlease try again");
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Text
            style={{
                color: "white",
                fontSize: 18,
                marginBottom: 20,
                textAlign : "center",
            }}
        >A verification email has been sent to your email. Please enter it below.</Text>
        <TextInput
        style={{
            borderRadius: 10,
            padding: 20,
            backgroundColor: "white",
            width: "100%",
            marginBottom:10
         }}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <StyledButton title="Verify" onPress={onVerifyPress} />
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#5F5DEC",
      }}
    >
      <View style={{
        gap:10
      }}>
        <Text 
            style={{
                color: "white",
                fontSize: 18,
                textAlign : "center",
                marginBottom: 20
  
            }}
        >Enter your details to get started</Text>
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
          onChangeText={(email) => setEmailAddress(email)}
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
        <StyledButton title="Sign Up" onPress={onSignUpPress} />
      </View>
    </KeyboardAvoidingView>
  );
}

import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { Redirect, Tabs } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  LogLevel,
} from "@stream-io/video-react-native-sdk";

const apiKey = process.env.EXPO_PUBLIC_GET_STREAM_API_KEY;
if (!apiKey) {
  throw new Error("Missing GetStream API Key");
}

export default function HomeRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();

  const user: User = {
    id: clerkUser?.id!,
    name: clerkUser?.fullName!,
    image: clerkUser?.imageUrl!,
  };

  if (!isSignedIn || !clerkUser || !apiKey) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  //   const apiKey = "your-api-key";
  // const userId = clerkUser?.id;
  const token = "authentication-token";
  const callId = "my-call-id";

  const tokenProvider  = async() => {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/generateUserToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({ userId : clerkUser?.id!, 
          name: clerkUser?.fullName!,
          image: clerkUser?.imageUrl!,
          email : clerkUser.primaryEmailAddress?.toString()!,
        }),
      });

      const data = await response.json();
      console.log("Data : ",data);
      return data.token;
    }
  
  const client = new StreamVideoClient({ apiKey, user, tokenProvider });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StreamVideo client={client}>
        <Tabs
          screenOptions={({ route }) => ({
            header: () => null,
            tabBarActiveTintColor: "#5F5DEC",
            tabBarStyle: {
              display: route.name === "[id]" ? "none" : "flex",
            },
            tabBarLabelStyle: {
              zIndex: 100,
              paddingBottom: 5,
            },
          })}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "All Calls",
              tabBarIcon: ({ color }) => (
                <Ionicons name="call-outline" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="[id]"
            options={{
              title: "Start a New Call",
              // unmountOnBlur: true,
              header: () => null,
              tabBarIcon: ({ color }) => {
                return (
                  <View
                    style={{
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "center",
                      top: -10,
                      left: 20,
                      right: 20,
                      bottom: 0,
                      margin: "auto",
                      borderRadius: 50,
                      zIndex: 100,
                      backgroundColor: "white",
                      borderColor: "lightgray",
                      borderWidth: 0.2,
                      borderTopWidth: 0.2,
                      borderBottomWidth: 0,
                    }}
                  >
                    <FontAwesome
                      name="plus-circle"
                      size={30}
                      color="black"
                      style={{
                        zIndex: 100,
                      }} // rotate the plus icon 45 degrees
                    />
                  </View>
                );
              },
            }}
          />
          <Tabs.Screen
            name="join"
            options={{
              title: "Join Call",
              headerTitle: "Enter the Room ID",
              tabBarIcon: ({ color }) => (
                <Ionicons name="enter-outline" size={24} color={color} />
              ),
            }}
          />
          {/* Add more screens here */}
        </Tabs>
      </StreamVideo>
    </SafeAreaView>
  );
}

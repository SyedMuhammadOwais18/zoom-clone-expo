import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native'

export default function AuthRoutesLayout() {

  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={"/(home)"} />
  }

  return (
    <SafeAreaView 
        style={{
            flex:1 , 
            backgroundColor:"#5F5DEC",
    }}>
        <Stack>
          <Stack.Screen name="sign-in"  options={{
            title : "Sign In to get Started",
            headerShown : false,
          }}/>
          <Stack.Screen name="sign-up"
          
            options={{
                title : "Create a new account",
                headerBackTitle : "Sign In",
                headerStyle : {backgroundColor : "#5F5DEC"},
                headerTintColor : "white",
            }}
          />
        </Stack>
    </SafeAreaView>
  )
}
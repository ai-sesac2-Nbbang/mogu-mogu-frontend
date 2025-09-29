// src/navigation/AuthStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";

import type { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AuthStack({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 로그인 */}
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

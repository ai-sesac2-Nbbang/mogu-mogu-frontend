// src/navigation/AuthStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignupWizardScreen from "../screens/SignupWizardScreen";
import MainTabs from "./MainTabs";

import type { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  setIsLoggedIn: (value: boolean) => void;
};

export default function AuthStack({ setIsLoggedIn }: Props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 로그인 */}
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>

      {/* 회원가입 마법사 */}
      <Stack.Screen name="SignupWizard">
        {(props) => (
          <SignupWizardScreen {...props} onComplete={() => setIsLoggedIn(true)} />
        )}
      </Stack.Screen>

      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

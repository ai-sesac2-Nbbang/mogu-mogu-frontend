import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignupWizardScreen from "../screens/SignupWizardScreen";

type AuthStackParamList = {
  Login: undefined;
  Onboarding: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthStack({
  setIsLoggedIn,
  needOnboarding,
  setNeedOnboarding,
}: {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
  needOnboarding: boolean;
  setNeedOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {needOnboarding ? (
        // ✅ 온보딩 필요 → 온보딩 화면
        <Stack.Screen name="Onboarding">
          {(props) => (
            <SignupWizardScreen
              {...props}
              onComplete={() => {
                // 온보딩 완료 → 메인 탭으로 이동
                setNeedOnboarding(false);
                setIsLoggedIn(true);
              }}
            />
          )}
        </Stack.Screen>
      ) : (
        // ✅ 온보딩 필요 없음 → 로그인 화면
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              setIsLoggedIn={setIsLoggedIn}
              setNeedOnboarding={setNeedOnboarding}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

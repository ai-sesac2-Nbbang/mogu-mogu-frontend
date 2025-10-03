import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./src/navigation/AuthStack";
import MainTabs from "./src/navigation/MainTabs";
import { getTokens, saveTokens, clearTokens } from "./src/utils/storage";
import api from "./src/utils/api";
import * as Linking from "expo-linking";
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [needOnboarding, setNeedOnboarding] = useState<boolean>(false);

  // ✅ 앱 시작 시 토큰 확인 및 자동 로그인
  useEffect(() => {
    const initAuth = async () => {
      const { access, refresh } = await getTokens();
      if (!access || !refresh) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const res = await api.get("/api/users/me");
        if (res.data.status === "pending_onboarding") {
          setIsLoggedIn(false);
          setNeedOnboarding(true);
        } else {
          setIsLoggedIn(true);
          setNeedOnboarding(false);
        }
      } catch (err) {
        // API 실패 → refresh 로직은 api.ts 인터셉터에서 처리
        setIsLoggedIn(false);
        setNeedOnboarding(false);
      }
    };

    initAuth();

    // ✅ 딥링크 이벤트 리스너
    const handleDeepLink = async ({ url }: { url: string }) => {
      console.log("📩 딥링크 수신(여기서?):", url);

      if (!url.startsWith("mogumogu://auth/kakao")) return;

      const params = new URLSearchParams(url.split("?")[1]);
      const ok = params.get("ok");
      const needOnboardingParam = params.get("need_onboarding") === "true";
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (ok === "true" && accessToken && refreshToken) {
        await saveTokens(accessToken, refreshToken);
        if (needOnboardingParam) {
          setNeedOnboarding(true);
          setIsLoggedIn(false); // AuthStack → SignupWizard
        } else {
          setNeedOnboarding(false);
          setIsLoggedIn(true); // 바로 MainTabs
        }
      } else {
        await clearTokens();
        setIsLoggedIn(false);
        setNeedOnboarding(false);
      }
    };

    const sub = Linking.addEventListener("url", handleDeepLink);
    return () => sub.remove();
  }, []);

  if (isLoggedIn === null) {
    // ✅ 초기 로딩 스피너
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <NavigationContainer
      linking={{
        prefixes: ["mogumogu://"], // ✅ 딥링크 스킴 등록
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="AuthStack">
            {() => (
              <AuthStack
                setIsLoggedIn={setIsLoggedIn}
                needOnboarding={needOnboarding}
                setNeedOnboarding={setNeedOnboarding}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

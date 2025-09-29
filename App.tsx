import "react-native-gesture-handler";

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./src/navigation/AuthStack";
import MainTabs from "./src/navigation/MainTabs";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from 'react-native';


SplashScreen.preventAutoHideAsync(); // 스플래시 자동숨김 방지

// 개발 중 불필요한 경고 무시
LogBox.ignoreLogs(['Warning: ...']);

// 전역 에러 핸들러
if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes('Setting a timer')) return;
    originalConsoleError.apply(console, args);
  };
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // ✅ 앱 초기화 작업 (예: 토큰 검사)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAppReady(true);
      SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  if (!appReady) return null;

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabs />
      ) : (
        <AuthStack setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
}

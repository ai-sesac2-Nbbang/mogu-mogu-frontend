// src/screens/LoginScreen.tsx
import { StackScreenProps } from "@react-navigation/stack";
// import Constants from "expo-constants";
// import * as Linking from "expo-linking";
// import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  // Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../types/navigation";
// import { saveTokens } from "../utils/storage"; // ✅ 추가: 토큰 저장

// const BACKEND_URL = "https://mogu-mogu-backend.onrender.com";

// WebBrowser 초기화
// WebBrowser.maybeCompleteAuthSession();

type Props = StackScreenProps<RootStackParamList, "Login"> & {
  setIsLoggedIn: (value: boolean) => void;
  setNeedOnboarding: (value: boolean) => void;
};

export default function LoginScreen({ navigation, setIsLoggedIn, setNeedOnboarding }: Props) {
  // ✅ 앱 딥링크(URL): 환경에 따라 분기 - 주석처리
  // const RETURN_URL =
  //   Constants.appOwnership === "expo"
  //     ? Linking.createURL("auth/kakao") // Expo Go: exp:// 스킴
  //     : "mogumogu://auth/kakao"; // 네이티브 빌드: mogumogu:// 스킴

  // useEffect(() => {
  //   const handleDeepLink = async (event: { url: string }) => {
  //     console.log("Received deep link :", event.url);
  //     try {
  //       const url = new URL(event.url);
  //       const params = new URLSearchParams(url.search);

  //       // ✅ 백엔드가 실제로 내려주는 키에 맞춤
  //       const ok = params.get("ok") === "true";
  //       const needOnboarding = params.get("need_onboarding") === "true";
  //       const accessToken = params.get("access_token") ?? "";
  //       const refreshToken = params.get("refresh_token") ?? "";

  //       console.log("Auth params:", {
  //         ok,
  //         needOnboarding,
  //         hasAccess: !!accessToken,
  //       });

  //       if (ok && accessToken && refreshToken) {
  //         // ✅ 토큰 저장
  //         await saveTokens(accessToken, refreshToken);

  //         if (needOnboarding) {
  //           // 온보딩 요구 → 온보딩 플로우로 이동
  //           navigation.reset({
  //             index: 0,
  //             routes: [{ name: "SignupWizard" }],
  //           });
  //         } else {
  //           // 바로 메인 진입
  //           setIsLoggedIn(true);
  //         }
  //       } else {
  //         Alert.alert("로그인 실패", "카카오 로그인에 실패했습니다.");
  //       }
  //     } catch (error) {
  //       console.error("딥링크 처리 오류:", error);
  //       Alert.alert("오류", "로그인 처리 중 문제가 발생했습니다.");
  //     }
  //   };

  //   // 딥링크 리스너
  //   const subscription = Linking.addEventListener("url", handleDeepLink);

  //   // 앱이 백그라운드 → 포그라운드로 올라오며 이미 받은 URL 처리
  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       console.log("Initial URL:", url);
  //       handleDeepLink({ url });
  //     }
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [navigation, setIsLoggedIn]);

  // ✅ 카카오 로그인 시작 - 인증 완료 가정하고 바로 온보딩으로 이동
  const handleKakaoLogin = async () => {
    try {
      console.log("카카오 로그인 시작 - 인증 완료 가정");

      // ✅ 카카오 인증 코드 주석처리
      // const loginUrl = `${BACKEND_URL}/auth/kakao/login`;
      // console.log("로그인 URL:", loginUrl);
      // console.log("Return URL (딥링크):", RETURN_URL);

      // ✅ 시스템 브라우저 열기 - 주석처리
      // const result = await WebBrowser.openAuthSessionAsync(
      //   loginUrl,
      //   RETURN_URL,
      //   {
      //     showInRecents: true,
      //     controlsColor: "#000000",
      //     toolbarColor: "#ffffff",
      //   }
      // );

      // console.log("웹브라우저 결과:", result);

      // ✅ 인증 완료됐다는 가정하에 바로 온보딩으로 이동
      setNeedOnboarding(true);
      
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      // Alert.alert(
      //   "로그인 오류",
      //   "카카오 로그인을 실행할 수 없습니다. 다시 시도해주세요."
      // );
    }
  };

  return (
    <View style={styles.container}>
      {/* 중앙 이미지 */}
      <Image
        source={require("../../assets/cart.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* 카카오 로그인 버튼 */}
      <TouchableOpacity
        style={styles.kakaoBtn}
        onPress={handleKakaoLogin}
      >
        <Text style={styles.kakaoText}>카카오로 로그인</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        로그인 시 이용약관과 개인정보처리방침에 동의합니다
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: { width: 250, height: 250, marginBottom: 40 },
  kakaoBtn: {
    backgroundColor: "#FEE500",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  kakaoText: { color: "#000", fontSize: 16, fontWeight: "bold" },
  footer: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
});

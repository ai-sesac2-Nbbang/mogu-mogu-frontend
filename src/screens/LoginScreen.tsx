// src/screens/LoginScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { RootStackParamList } from "../types/navigation";

type Props = StackScreenProps<RootStackParamList, "Login"> & {
  setIsLoggedIn: (value: boolean) => void;
  navigation: any; // SignupWizard 이동을 위해 추가
};

export default function LoginScreen({ setIsLoggedIn, navigation }: Props) {
  const handleKakaoLogin = async () => {
    // ✅ 카카오 인증 로직 (임시 주석 처리)
    /*
    import * as WebBrowser from "expo-web-browser";
    import * as SecureStore from "expo-secure-store";
    import * as Linking from "expo-linking";
    import axios from "axios";

    const KAKAO_REST_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_KEY!;
    const REDIRECT_URI = "myapp://oauth";

    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
    */

    // ✅ 지금은 가입 여부를 임의로 판단 (랜덤)
    const isNewUser = Math.random() > 0.5;

    if (isNewUser) {
      console.log("🆕 신규 회원 → 회원가입 페이지 이동");
      navigation.navigate("SignupWizard"); // 회원가입 마법사로 이동
    } else {
      console.log("✅ 기존 회원 → MainTabs 이동");
      setIsLoggedIn(true); // 메인 탭으로 이동
    }
  };

  return (
    <View style={styles.container}>
      {/* 앱 로고 */}
      <Text style={styles.logo}>모구모구</Text>

      {/* 중앙 이미지 */}
      <Image
        source={require("../../assets/cart.png")} // 실제 경로 확인 필요
        style={styles.image}
        resizeMode="contain"
      />

      {/* 카카오 로그인 버튼 */}
      <TouchableOpacity style={styles.kakaoBtn} onPress={handleKakaoLogin}>
        <Text style={styles.kakaoText}>카카오로 로그인</Text>
      </TouchableOpacity>

      {/* 하단 안내 */}
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
  logo: { fontSize: 36, fontWeight: "bold", marginBottom: 20, color: "#e91e63" },
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

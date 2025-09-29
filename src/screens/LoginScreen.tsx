// src/screens/LoginScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { RootStackParamList } from "../types/navigation";
import { Dimensions } from "react-native";

type Props = StackScreenProps<RootStackParamList, "Login"> & {
  setIsLoggedIn: (value: boolean) => void;
};

export default function LoginScreen({ setIsLoggedIn }: Props) {
  const handleKakaoLogin = async () => {
    // ✅ 여기에 Kakao SDK 로그인 + 백엔드 토큰 요청 로직
    setIsLoggedIn(true); // 로그인 성공 시 MainTabs로 전환
  };

  return (
    <View style={styles.container}>
      {/* 앱 로고 */}
      {/* <Text style={styles.logo}>모구모구</Text> */}

      {/* 중앙 일러스트 */}
      <Image
        source={require("../../assets/cart.png")} // 실제 경로 꼭 확인!
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

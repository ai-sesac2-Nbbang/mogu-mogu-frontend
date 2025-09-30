// src/screens/LoginScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

// 백엔드 서버 URL 및 상수 정의
// const BACKEND_URL = "https://your-backend-url.com";

type Props = StackScreenProps<RootStackParamList, "Login"> & {
  setIsLoggedIn: (value: boolean) => void;
};

export default function LoginScreen({ setIsLoggedIn, navigation }: Props) {
  // React.useEffect(() => {
  //   // 딥링크로 돌아왔을 때의 처리
  //   const handleDeepLink = async (event: { url: string }) => {
  //     // 백엔드에서 전달한 인증 결과 처리
  //     if (event.url.includes('auth-success')) {
  //       const params = new URLSearchParams(event.url.split('?')[1]);
  //       const isNewUser = params.get('isNewUser') === 'true';
  //       const token = params.get('token');

  //       if (token) {
  //         // 토큰 저장 로직 추가 필요
  //         if (isNewUser) {
  //           navigation.navigate('SignupWizard');
  //         } else {
  //           setIsLoggedIn(true);
  //         }
  //       }
  //     }
  //   };

  //   // 딥링크 리스너 등록
  //   Linking.addEventListener('url', handleDeepLink);

  //   // 컴포넌트 언마운트 시 리스너 제거
  //   return () => {
  //     // Linking.removeEventListener('url', handleDeepLink); // React Native 0.65 이상
  //   };
  // }, [navigation, setIsLoggedIn]);

  const handleKakaoLogin = () => {
    // 임시 함수 - 테스트용
    // 실제 구현 시에는 이 부분을 주석 처리하고 위의 주석된 카카오 인증 코드를 사용하세요
    const isNewUser = true; // 테스트를 위해 true/false 전환 가능
    
    if (isNewUser) {
      navigation.navigate('SignupWizard');
    } else {
      setIsLoggedIn(true); // MainTabs로 자동 이동
    }
  };

  return (
    <View style={styles.container}>
      {/* 앱 로고 */}
      <Text style={styles.logo}>모구모구</Text>

      {/* 중앙 이미지 */}
      <Image
        source={require("../../assets/cart.png")}
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

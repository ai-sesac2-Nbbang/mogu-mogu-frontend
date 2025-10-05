import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import WithdrawalConfirmModal from '../components/WithdrawalConfirmModal';
import ConfirmationModal from '../components/ConfirmationModal'; // ConfirmationModal import 추가
import Constants from 'expo-constants'; // Constants import

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [isMoguNewsEnabled, setIsMoguNewsEnabled] = useState(true);
  const [isMarketingEnabled, setIsMarketingEnabled] = useState(true);
  const [isWithdrawalModalVisible, setWithdrawalModalVisible] = useState(false); // 이메일 확인 모달 가시성 상태
  const [isLogoutConfirmModalVisible, setIsLogoutConfirmModalVisible] = useState(false); // 로그아웃 확인 모달 가시성 상태 추가
  const [isWithdrawalConfirmInitialModalVisible, setIsWithdrawalConfirmInitialModalVisible] = useState(false); // 회원 탈퇴 1차 확인 모달 가시성 상태 추가

  // TODO: 실제 카카오 계정 이메일로 변경해야 합니다.
  const kakaoAccountEmail = "user@example.com";

  const handleLogout = () => {
    setIsLogoutConfirmModalVisible(true); // 로그아웃 확인 모달 표시
  };

  const confirmLogout = () => {
    setIsLogoutConfirmModalVisible(false); // 모달 닫기
    // TODO: 세션/토큰 등 로그인 관련 모든 정보 삭제 로직
    console.log("로그아웃 처리");
    // 예시: AsyncStorage.clear();
    navigation.navigate("AuthStack" as never); // 로그인 화면으로 이동
  };

  const handleWithdrawal = () => {
    setIsWithdrawalConfirmInitialModalVisible(true); // 회원 탈퇴 1차 확인 모달 표시
  };

  const confirmInitialWithdrawal = () => {
    setIsWithdrawalConfirmInitialModalVisible(false); // 1차 모달 닫기
    setWithdrawalModalVisible(true); // 이메일 확인 모달 표시
  };

  const handleConfirmWithdrawal = (enteredEmail: string) => {
    setWithdrawalModalVisible(false); // 이메일 확인 모달 닫기
    if (enteredEmail.toLowerCase() === kakaoAccountEmail.toLowerCase()) {
      // TODO: 계정과 관련된 모든 정보 삭제 로직 (DB 연동)
      console.log("회원 탈퇴 처리");
      // 예시: api.deleteUserAccount();
      Alert.alert("탈퇴 완료", "성공적으로 탈퇴되었습니다.");
      navigation.navigate("AuthStack" as never); // 로그인 화면으로 이동
    } else {
      Alert.alert("탈퇴 실패", "이메일이 일치하지 않습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}> {/* ScrollView contentContainerStyle 사용 */}
        {/* 알림 설정 */}
        <Text style={styles.sectionTitle}>알림 설정</Text>
        <View style={styles.settingItemWithToggle}>
          <Text style={styles.settingText}>모구소식</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isMoguNewsEnabled ? "#8A2BE2" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsMoguNewsEnabled}
            value={isMoguNewsEnabled}
          />
        </View>
        <View style={styles.settingItemWithToggle}>
          <Text style={styles.settingText}>마케팅 수신 동의</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isMarketingEnabled ? "#8A2BE2" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsMarketingEnabled}
            value={isMarketingEnabled}
          />
        </View>

        <View style={styles.sectionDivider} />

        {/* 고객지원 */}
        <Text style={styles.sectionTitle}>고객 지원</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>고객 센터</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>모구봇</Text>
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

        {/* 기타 */}
        <Text style={styles.sectionTitle}>기타</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("Notice" as never)}>
          <Text style={styles.settingText}>공지사항</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("Terms" as never)}>
          <Text style={styles.settingText}>약관 및 정책</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <Text style={styles.settingText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleWithdrawal}>
          <Text style={styles.settingText}>탈퇴하기</Text>
        </TouchableOpacity>
      </ScrollView>

      <WithdrawalConfirmModal
        isVisible={isWithdrawalModalVisible}
        onClose={() => setWithdrawalModalVisible(false)}
        onConfirm={handleConfirmWithdrawal}
        expectedEmail={kakaoAccountEmail}
      />

      {/* 로그아웃 확인 모달 */}
      <ConfirmationModal
        isVisible={isLogoutConfirmModalVisible}
        onClose={() => setIsLogoutConfirmModalVisible(false)}
        onConfirm={confirmLogout}
        title="로그아웃"
        message="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
      />

      {/* 회원 탈퇴 1차 확인 모달 */}
      <ConfirmationModal
        isVisible={isWithdrawalConfirmInitialModalVisible}
        onClose={() => setIsWithdrawalConfirmInitialModalVisible(false)}
        onConfirm={confirmInitialWithdrawal}
        title="회원 탈퇴"
        message="정말 탈퇴하시겠습니까? 계정과 관련된 모든 정보가 삭제됩니다."
        confirmText="탈퇴"
        cancelText="취소"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Constants.statusBarHeight + 10, // 상태바 높이 + 패딩
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff', // 배경색 추가
    position: 'absolute', // 헤더 고정
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // 다른 콘텐츠 위에 오도록
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightPlaceholder: {
    width: 24, // Match back button size for alignment
    padding: 5,
  },
  scrollViewContent: {
    paddingTop: Constants.statusBarHeight + 50 + 15, // 헤더 높이(paddingTop 50 + paddingBottom 15)를 고려한 패딩
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  settingItem: {
    paddingVertical: 15,
    // borderBottomWidth: 1, // 이 부분은 제거
    // borderBottomColor: '#eee', // 이 부분은 제거
  },
  settingItemWithToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    // borderBottomWidth: 1, // 이 부분은 제거
    // borderBottomColor: '#eee', // 이 부분은 제거
  },
  settingText: {
    fontSize: 16,
    color: '#555',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
    marginVertical: 10,
  },
});

export default SettingsScreen;


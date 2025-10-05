import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import WithdrawalConfirmModal from '../../../components/mypage/WithdrawalConfirmModal';
import ConfirmationModal from '../../../components/mypage/ConfirmationModal';
import Constants from 'expo-constants';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [isMoguNewsEnabled, setIsMoguNewsEnabled] = useState(true);
  const [isMarketingEnabled, setIsMarketingEnabled] = useState(true);
  const [isWithdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
  const [isLogoutConfirmModalVisible, setIsLogoutConfirmModalVisible] = useState(false);
  const [isWithdrawalConfirmInitialModalVisible, setIsWithdrawalConfirmInitialModalVisible] = useState(false);

  const kakaoAccountEmail = "user@example.com";

  const handleLogout = () => {
    setIsLogoutConfirmModalVisible(true);
  };

  const confirmLogout = () => {
    setIsLogoutConfirmModalVisible(false);
    console.log("로그아웃 처리");
    navigation.navigate("AuthStack" as never);
  };

  const handleWithdrawal = () => {
    setIsWithdrawalConfirmInitialModalVisible(true);
  };

  const confirmInitialWithdrawal = () => {
    setIsWithdrawalConfirmInitialModalVisible(false);
    setWithdrawalModalVisible(true);
  };

  const handleConfirmWithdrawal = (enteredEmail: string) => {
    setWithdrawalModalVisible(false);
    if (enteredEmail.toLowerCase() === kakaoAccountEmail.toLowerCase()) {
      console.log("회원 탈퇴 처리");
      Alert.alert("탈퇴 완료", "성공적으로 탈퇴되었습니다.");
      navigation.navigate("AuthStack" as never);
    } else {
      Alert.alert("탈퇴 실패", "이메일이 일치하지 않습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

        <Text style={styles.sectionTitle}>고객 지원</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>고객 센터</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>모구봇</Text>
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

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

      <ConfirmationModal
        isVisible={isLogoutConfirmModalVisible}
        onClose={() => setIsLogoutConfirmModalVisible(false)}
        onConfirm={confirmLogout}
        title="로그아웃"
        message="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
      />

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
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightPlaceholder: {
    width: 24,
    padding: 5,
  },
  scrollViewContent: {
    paddingTop: Constants.statusBarHeight + 50 + 15,
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
  },
  settingItemWithToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
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
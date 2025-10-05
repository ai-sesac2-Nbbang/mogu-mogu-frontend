import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

// 배지 타입 정의
interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  condition: string;
  currentProgress: number;
  requiredProgress: number;
  isUnlocked: boolean;
}

const BadgesScreen = () => {
  const navigation = useNavigation();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [representativeBadgeId, setRepresentativeBadgeId] = useState<string>("1");
  const [interestBadgeId, setInterestBadgeId] = useState<string>("3");
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isBadgeModalVisible, setBadgeModalVisible] = useState(false);

  // 모든 배지 데이터
  const allBadges: Badge[] = [
    {
      id: "1",
      name: "첫 거래",
      icon: "star",
      color: "#FFD700",
      description: "첫 번째 모구 거래를 완료했어요!",
      condition: "첫 거래 완료",
      currentProgress: 1,
      requiredProgress: 1,
      isUnlocked: true,
    },
    {
      id: "2",
      name: "모구 달인",
      icon: "trophy",
      color: "#FF6B6B",
      description: "10번의 모구 거래를 성공적으로 완료했어요!",
      condition: "10회 거래 완료",
      currentProgress: 10,
      requiredProgress: 10,
      isUnlocked: true,
    },
    {
      id: "3",
      name: "친절왕",
      icon: "heart",
      color: "#FF69B4",
      description: "좋은 후기를 20개 이상 받으면 획득할 수 있어요!",
      condition: "좋은 후기 20개 받기",
      currentProgress: 10,
      requiredProgress: 20,
      isUnlocked: false,
    },
    {
      id: "4",
      name: "모구 초보",
      icon: "leaf",
      color: "#4CAF50",
      description: "모구모구에 가입했어요!",
      condition: "회원가입 완료",
      currentProgress: 1,
      requiredProgress: 1,
      isUnlocked: true,
    },
    {
      id: "5",
      name: "모구 전문가",
      icon: "medal",
      color: "#9C27B0",
      description: "50번의 모구 거래를 완료했어요!",
      condition: "50회 거래 완료",
      currentProgress: 35,
      requiredProgress: 50,
      isUnlocked: false,
    },
    {
      id: "6",
      name: "모구 마스터",
      icon: "ribbon",
      color: "#FF9800",
      description: "100번의 모구 거래를 완료했어요!",
      condition: "100회 거래 완료",
      currentProgress: 35,
      requiredProgress: 100,
      isUnlocked: false,
    },
    {
      id: "7",
      name: "인기왕",
      icon: "flame",
      color: "#F44336",
      description: "관심 목록에 50번 이상 등록되었어요!",
      condition: "관심 목록 50회 등록",
      currentProgress: 28,
      requiredProgress: 50,
      isUnlocked: false,
    },
    {
      id: "8",
      name: "빠른 손",
      icon: "flash",
      color: "#FFEB3B",
      description: "5분 이내에 응답한 횟수 30회 달성!",
      condition: "5분 내 응답 30회",
      currentProgress: 18,
      requiredProgress: 30,
      isUnlocked: false,
    },
    {
      id: "9",
      name: "정산왕",
      icon: "cash",
      color: "#00BCD4",
      description: "정산을 빠르고 정확하게 처리했어요!",
      condition: "정산 완료 20회",
      currentProgress: 15,
      requiredProgress: 20,
      isUnlocked: false,
    },
    {
      id: "10",
      name: "소통왕",
      icon: "chatbubbles",
      color: "#3F51B5",
      description: "채팅으로 활발하게 소통했어요!",
      condition: "채팅 메시지 500개 전송",
      currentProgress: 420,
      requiredProgress: 500,
      isUnlocked: false,
    },
  ];

  // 배지 데이터 불러오기
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        // TODO: 실제 API 호출로 교체
        /*
        const response = await axios.get('/api/user/badges', {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        setBadges(response.data.badges);
        setRepresentativeBadgeId(response.data.representativeBadgeId);
        */

        // 현재는 더미 데이터 사용
        setBadges(allBadges);
      } catch (error) {
        console.error("Failed to fetch badges:", error);
        setBadges([]);
      }
    };
    fetchBadges();
  }, []);

  // 배지 클릭 핸들러
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setBadgeModalVisible(true);
  };

  // 대표 배지 설정 핸들러
  const handleSetRepresentativeBadge = async (badgeId: string) => {
    setRepresentativeBadgeId(badgeId);
    
    // TODO: API 호출하여 서버에 저장
    /*
    try {
      await axios.put('/api/user/representative-badge', {
        badgeId: badgeId
      }, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
    } catch (error) {
      console.error("Failed to set representative badge:", error);
    }
    */
    
    setBadgeModalVisible(false);
  };

  // 관심 배지 설정 핸들러
  const handleSetInterestBadge = async (badgeId: string) => {
    setInterestBadgeId(badgeId);
    
    // TODO: API 호출하여 서버에 저장
    /*
    try {
      await axios.put('/api/user/interest-badge', {
        badgeId: badgeId
      }, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
    } catch (error) {
      console.error("Failed to set interest badge:", error);
    }
    */
    
    setBadgeModalVisible(false);
  };

  // 획득한 배지와 미획득 배지 분리
  const unlockedBadges = badges.filter(badge => badge.isUnlocked);
  const lockedBadges = badges.filter(badge => !badge.isUnlocked);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>보유 배지</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 획득한 배지 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>획득한 배지 ({unlockedBadges.length})</Text>
          <View style={styles.badgesGrid}>
            {unlockedBadges.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={styles.badgeCard}
                onPress={() => handleBadgeClick(badge)}
              >
                <View style={[styles.badgeIconContainer, { backgroundColor: badge.color + '20' }]}>
                  <Ionicons name={badge.icon as any} size={28} color={badge.color} />
                  {badge.id === representativeBadgeId && (
                    <View style={styles.representativeStar}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                    </View>
                  )}
                </View>
                <Text style={styles.badgeName} numberOfLines={2}>{badge.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 미획득 배지 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>미획득 배지 ({lockedBadges.length})</Text>
          <View style={styles.badgesGrid}>
            {lockedBadges.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={styles.badgeCard}
                onPress={() => handleBadgeClick(badge)}
              >
                <View style={[styles.badgeIconContainer, styles.badgeIconLocked]}>
                  <Ionicons name={badge.icon as any} size={28} color="#999" />
                  {badge.id === interestBadgeId && (
                    <View style={styles.interestHeart}>
                      <Ionicons name="heart" size={16} color="#FF69B4" />
                    </View>
                  )}
                </View>
                <Text style={[styles.badgeName, styles.badgeNameLocked]} numberOfLines={2}>{badge.name}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${(badge.currentProgress / badge.requiredProgress) * 100}%`,
                        backgroundColor: badge.color
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {badge.currentProgress}/{badge.requiredProgress}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 배지 상세 정보 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isBadgeModalVisible}
        onRequestClose={() => setBadgeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.badgeModalContent}>
            {selectedBadge && (
              <>
                {/* 배지 아이콘 */}
                <View style={[
                  styles.badgeModalIcon,
                  { backgroundColor: selectedBadge.isUnlocked ? selectedBadge.color + '20' : '#f0f0f0' }
                ]}>
                  <Ionicons 
                    name={selectedBadge.icon as any} 
                    size={60} 
                    color={selectedBadge.isUnlocked ? selectedBadge.color : '#999'} 
                  />
                </View>

                {/* 배지 이름 */}
                <Text style={styles.badgeModalTitle}>{selectedBadge.name}</Text>

                {/* 배지 설명 */}
                <Text style={styles.badgeModalDescription}>{selectedBadge.description}</Text>

                {/* 획득 조건 */}
                <View style={styles.badgeConditionContainer}>
                  <Ionicons name="checkmark-circle" size={20} color={selectedBadge.isUnlocked ? "#4CAF50" : "#999"} />
                  <Text style={[
                    styles.badgeConditionText,
                    { color: selectedBadge.isUnlocked ? "#4CAF50" : "#999" }
                  ]}>
                    {selectedBadge.condition}
                  </Text>
                </View>

                {/* 진행도 바 */}
                {!selectedBadge.isUnlocked && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                      <View 
                        style={[
                          styles.progressBarFillLarge,
                          { 
                            width: `${(selectedBadge.currentProgress / selectedBadge.requiredProgress) * 100}%`,
                            backgroundColor: selectedBadge.color
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressTextLarge}>
                      {selectedBadge.currentProgress} / {selectedBadge.requiredProgress}
                    </Text>
                    <Text style={styles.progressRemainingText}>
                      {selectedBadge.requiredProgress - selectedBadge.currentProgress}개 더 필요해요!
                    </Text>
                  </View>
                )}

                {/* 버튼 영역 */}
                <View style={styles.badgeModalButtonContainer}>
                  {selectedBadge.isUnlocked ? (
                    <TouchableOpacity
                      style={[
                        styles.badgeModalButton,
                        representativeBadgeId === selectedBadge.id && styles.badgeModalButtonActive
                      ]}
                      onPress={() => handleSetRepresentativeBadge(selectedBadge.id)}
                    >
                      <Ionicons 
                        name={representativeBadgeId === selectedBadge.id ? "star" : "star-outline"} 
                        size={20} 
                        color={representativeBadgeId === selectedBadge.id ? "#FFD700" : "#8A2BE2"} 
                      />
                      <Text style={[
                        styles.badgeModalButtonText,
                        representativeBadgeId === selectedBadge.id && styles.badgeModalButtonTextActive
                      ]}>
                        {representativeBadgeId === selectedBadge.id ? "대표 배지" : "대표로 설정"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.badgeModalButton,
                        styles.badgeModalButtonInterest,
                        interestBadgeId === selectedBadge.id && styles.badgeModalButtonInterestActive
                      ]}
                      onPress={() => handleSetInterestBadge(selectedBadge.id)}
                    >
                      <Ionicons 
                        name={interestBadgeId === selectedBadge.id ? "heart" : "heart-outline"} 
                        size={20} 
                        color={interestBadgeId === selectedBadge.id ? "#FF69B4" : "#8A2BE2"} 
                      />
                      <Text style={[
                        styles.badgeModalButtonText,
                        interestBadgeId === selectedBadge.id && styles.badgeModalButtonInterestTextActive
                      ]}>
                        {interestBadgeId === selectedBadge.id ? "관심 배지" : "관심 배지로 설정"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.badgeModalCloseButton}
                    onPress={() => setBadgeModalVisible(false)}
                  >
                    <Text style={styles.badgeModalCloseButtonText}>확인</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    paddingTop: 50,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightPlaceholder: {
    width: 24,
  },
  scrollViewContent: {
    paddingTop: 50 + 15 + 40,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  badgeCard: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  badgeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  badgeIconLocked: {
    backgroundColor: '#f0f0f0',
  },
  representativeStar: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  interestHeart: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FF69B4',
  },
  badgeName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 6,
    paddingHorizontal: 2,
    lineHeight: 16,
    height: 32,
  },
  badgeNameLocked: {
    color: '#999',
  },
  progressBar: {
    width: '100%',
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 9,
    color: '#666',
    marginTop: 4,
  },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
  },
  badgeModalIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badgeModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  badgeModalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  badgeConditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  badgeConditionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFillLarge: {
    height: '100%',
    borderRadius: 6,
  },
  progressTextLarge: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressRemainingText: {
    fontSize: 14,
    color: '#FF9800',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  badgeModalButtonContainer: {
    width: '100%',
    gap: 10,
  },
  badgeModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#8A2BE2',
  },
  badgeModalButtonActive: {
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD700',
  },
  badgeModalButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  badgeModalButtonTextActive: {
    color: '#FF9800',
  },
  badgeModalButtonInterest: {
    borderColor: '#8A2BE2',
  },
  badgeModalButtonInterestActive: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FF69B4',
  },
  badgeModalButtonInterestTextActive: {
    color: '#FF69B4',
  },
  badgeModalCloseButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
  },
  badgeModalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BadgesScreen;
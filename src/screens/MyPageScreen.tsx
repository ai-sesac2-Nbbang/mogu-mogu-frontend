import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ImageSourcePropType, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

export default function MyPageScreen() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = React.useState<"personal" | "mogujang" | "mogurur">("personal");
  const [userProfile, setUserProfile] = useState({
    nickname: "나찬솔씨", // 기본값
    profileImage: require("../../assets/cart.png") as ImageSourcePropType, // 모구모구 캐릭터 이미지
  });

  // 배지 상태 관리
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isBadgeModalVisible, setBadgeModalVisible] = useState(false);
  const [representativeBadgeId, setRepresentativeBadgeId] = useState<string>("1"); // 대표 배지 ID
  const [interestBadgeId, setInterestBadgeId] = useState<string>("3"); // 관심 배지 ID (기본값: 친절왕)

  // 모든 배지 데이터 (DB에서 불러올 데이터)
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

  // --- 사용자 프로필 정보 불러오기 (DB 연동) ---
  /*
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const mockResponse = {
          data: {
            nickname: "불러온 라이언",
            profileImageUri: "https://via.placeholder.com/150", // 임시 이미지 URL
          },
        };

        if (mockResponse.data) {
          setUserProfile({
            nickname: mockResponse.data.nickname,
            profileImage: mockResponse.data.profileImageUri ? { uri: mockResponse.data.profileImageUri } : require("../../assets/cart.png"),
          });
        } else {
           setUserProfile({
             nickname: "기본 라이언",
             profileImage: require("../../assets/cart.png"),
           });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUserProfile({
          nickname: "에러 발생 라이언",
          profileImage: require("../../assets/cart.png"),
        });
      }
    };
    fetchUserProfile();
  }, []);
  */

  // --- 사용자 배지 정보 불러오기 (DB 연동) ---
  useEffect(() => {
    const fetchUserBadges = async () => {
      try {
        // TODO: 실제 API 호출로 교체
        /*
        const response = await axios.get('/api/user/badges', {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        setUserBadges(response.data.badges);
        */

        // 현재는 더미 데이터 사용
        setUserBadges(allBadges);
      } catch (error) {
        console.error("Failed to fetch user badges:", error);
        setUserBadges([]);
      }
    };
    fetchUserBadges();
  }, []);

  // 배지 클릭 핸들러
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setBadgeModalVisible(true);
  };

  // 대표 배지 설정 핸들러
  const handleSetRepresentativeBadge = (badgeId: string) => {
    setRepresentativeBadgeId(badgeId);
    // TODO: API 호출하여 서버에 저장
    /*
    await axios.put('/api/user/representative-badge', {
      badgeId: badgeId
    }, {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    */
    setBadgeModalVisible(false);
  };

  // 관심 배지 설정 핸들러
  const handleSetInterestBadge = (badgeId: string) => {
    setInterestBadgeId(badgeId);
    // TODO: API 호출하여 서버에 저장
    /*
    await axios.put('/api/user/interest-badge', {
      badgeId: badgeId
    }, {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    */
    setBadgeModalVisible(false);
  };

  // 획득한 배지만 필터링
  const unlockedBadges = userBadges.filter(badge => badge.isUnlocked);
  
  // 대표 배지 찾기
  const representativeBadge = userBadges.find(badge => badge.id === representativeBadgeId && badge.isUnlocked);
  
  // 관심 배지 찾기
  const interestBadge = userBadges.find(badge => badge.id === interestBadgeId && !badge.isUnlocked);
  
  // 프로필에 표시할 배지 (대표 배지 1개 + 관심 배지 1개)
  const displayBadges = [
    representativeBadge || unlockedBadges[0], // 대표 배지 또는 첫 번째 획득 배지
    interestBadge || userBadges.filter(badge => !badge.isUnlocked)[0] // 관심 배지 또는 첫 번째 미획득 배지
  ].filter(Boolean); // null/undefined 제거

  const dummySoldProducts = [
    { id: "1", name: "프리미엄 롤화장지 10롤 구매하실 분?", price: "9,170원", participants: "1/3", image: require("../../assets/products/tissue.png") },
    { id: "2", name: "삼다수 생수 2L 6병 묶음 구매하실 분?", price: "4,590원", participants: "1/2", image: require("../../assets/products/shampoo.png") },
    { id: "3", name: "무항생제 신선 계란 10구 구매하실 분?", price: "2,800원", participants: "1/3", image: require("../../assets/products/eggs.png") },
    { id: "4", name: "추가 상품 1", price: "1,000원", participants: "1/1", image: require("../../assets/products/toothbrush.png") },
  ];
  const dummyPurchasedProducts: any[] = [
    // { id: "1", name: "구매 상품 1", price: "5,000원", participants: "1/1", image: require("../../assets/products/tissue.png") },
  ]; // 비어 있으면 안내 문구 표시

  // 좋은 후기와 안 좋은 후기 구분
  const goodReviews = [
    { count: 12, text: "시간 약속을 잘 지켜요", icon: "time-outline" },
    { count: 8, text: "친절하고 매너가 좋아요", icon: "happy-outline" },
    { count: 15, text: "응답이 빨라요", icon: "chatbubble-outline" },
    { count: 10, text: "상품상태가 좋아요", icon: "checkmark-circle-outline" },
  ];

  const badReviews = [
    { count: 1, text: "시간 약속을 안 지켜요", icon: "time-outline" },
    { count: 0, text: "불친절해요", icon: "sad-outline" },
    { count: 2, text: "응답이 느려요", icon: "chatbubble-outline" },
    { count: 0, text: "상품상태가 안 좋아요", icon: "close-circle-outline" },
  ];

  const renderPersonal = () => (
    <View>
      <View style={styles.activitySectionPersonal}>
        <TouchableOpacity style={styles.activityItemPersonal} onPress={() => navigation.navigate("Badges" as never)}>
          <Ionicons name="trophy-outline" size={24} color="#8A2BE2" />
          <Text style={styles.activityTextPersonal}>보유 배지</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activityItemPersonal} onPress={() => navigation.navigate("Wishlist" as never)}>
          <Ionicons name="heart-outline" size={24} color="#8A2BE2" />
          <Text style={styles.activityTextPersonal}>관심목록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activityItemPersonal} onPress={() => navigation.navigate("KeywordRegister" as never)}>
          <Ionicons name="bookmark-outline" size={24} color="#8A2BE2" />
          <Text style={styles.activityTextPersonal}>키워드 등록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activityItemPersonal} onPress={() => navigation.navigate("RecentlyViewed" as never)}>
          <Ionicons name="time-outline" size={24} color="#8A2BE2" />
          <Text style={styles.activityTextPersonal}>최근 본 글</Text>
        </TouchableOpacity>
      </View>

      {/* Reviews Section */}
      <View style={styles.reviewsSection}>
        <View style={styles.reviewsHeader}>
          <View>
          <Text style={styles.reviewsTitle}>받은 후기</Text>
            <Text style={styles.reviewsSubtitle}>총 {goodReviews.reduce((sum, r) => sum + r.count, 0) + badReviews.reduce((sum, r) => sum + r.count, 0)}개</Text>
          </View>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate("Reviews" as never)}
          >
            <Text style={styles.viewAllButtonText}>전체보기</Text>
            <Ionicons name="chevron-forward" size={18} color="#8A2BE2" />
          </TouchableOpacity>
        </View>

        {/* 좋은 후기 */}
        <View style={styles.reviewCategory}>
          <View style={styles.reviewCategoryHeader}>
            <Ionicons name="thumbs-up" size={20} color="#4CAF50" />
            <Text style={styles.reviewCategoryTitle}>좋은 후기</Text>
          </View>
          <View style={styles.reviewGrid}>
            {goodReviews.map((review, index) => (
              <View style={styles.reviewCard} key={index}>
                <View style={styles.reviewCardHeader}>
                  <Ionicons name={review.icon as any} size={20} color="#4CAF50" />
                  <Text style={styles.reviewCardCount}>{review.count}</Text>
                </View>
                <Text style={styles.reviewCardText}>{review.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 안 좋은 후기 */}
        <View style={styles.reviewCategory}>
          <View style={styles.reviewCategoryHeader}>
            <Ionicons name="thumbs-down" size={20} color="#F44336" />
            <Text style={styles.reviewCategoryTitle}>안 좋은 후기</Text>
        </View>
          <View style={styles.reviewGrid}>
            {badReviews.map((review, index) => (
              <View style={styles.reviewCard} key={index}>
                <View style={styles.reviewCardHeader}>
                  <Ionicons name={review.icon as any} size={20} color="#F44336" />
                  <Text style={styles.reviewCardCount}>{review.count}</Text>
        </View>
                <Text style={styles.reviewCardText}>{review.text}</Text>
        </View>
            ))}
        </View>
        </View>
      </View>
    </View>
  );

  const renderSold = () => (
    <View>
      <View style={styles.productsHeader}>
        <Text style={styles.productsSectionTitle}>내가 판매한 상품</Text>
        {dummySoldProducts.length > 3 && (
          <TouchableOpacity onPress={() => navigation.navigate("SoldProducts" as never)}>
            <Ionicons name="chevron-forward" size={24} />
          </TouchableOpacity>
        )}
      </View>
      {dummySoldProducts.slice(0, 3).map((product) => (
        <TouchableOpacity key={product.id} style={styles.productItem}>
          <Image source={product.image} style={styles.thumbnailImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
            <Text style={styles.productMoguin}>모구인 {product.participants}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPurchased = () => (
    <View>
      <View style={styles.productsHeader}>
        <Text style={styles.productsSectionTitle}>내가 구매한 상품</Text>
        {dummyPurchasedProducts.length > 3 && (
          <TouchableOpacity onPress={() => navigation.navigate("PurchasedProducts" as never)}>
            <Ionicons name="chevron-forward" size={24}  />
          </TouchableOpacity>
        )}
      </View>
      {dummyPurchasedProducts.length === 0 ? (
        <View style={styles.noPurchaseContainer}>
          <Text style={styles.noPurchaseText}>구매 내역이 없어요</Text>
          <Text style={styles.noPurchaseSubText}>모두의 구매 활동을 해보세요.</Text>
        </View>
      ) : (
        dummyPurchasedProducts.slice(0, 3).map((product) => (
          <TouchableOpacity key={product.id} style={styles.productItem}>
            <Image source={product.image} style={styles.thumbnailImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <Text style={styles.productMoguin}>모구인 {product.participants}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("Settings" as never)}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileContainer}>
          {/* 보유 배지 (왼쪽) */}
          <View style={styles.badgesContainer}>
            {displayBadges.map((badge) => (
              <TouchableOpacity 
                key={badge.id} 
                style={[
                  styles.badgeItem,
                  !badge.isUnlocked && styles.badgeItemLocked
                ]}
                onPress={() => {
                  // 모든 배지 클릭 시 상세 정보 모달 표시
                  handleBadgeClick(badge);
                }}
              >
                <Ionicons 
                  name={badge.icon as any} 
                  size={20} 
                  color={badge.isUnlocked ? badge.color : '#999'} 
                />
                {badge.id === representativeBadgeId && badge.isUnlocked && (
                  <View style={styles.representativeBadgeStar}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                  </View>
                )}
                {badge.id === interestBadgeId && !badge.isUnlocked && (
                  <View style={styles.interestBadgeHeart}>
                    <Ionicons name="heart" size={12} color="#FF69B4" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* 프로필 이미지 (중앙) */}
          <View style={styles.profileImageContainer}>
        <Image
              source={userProfile.profileImage}
          style={styles.profileImage}
        />
          </View>

          {/* 오른쪽 여백 (대칭을 위해) */}
          <View style={styles.badgesContainer} />
        </View>

        <Text style={styles.nickname}>{userProfile.nickname}</Text>
        <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate("ProfileEdit" as never)}>
          <Text style={styles.editProfileButtonText}>프로필수정</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabButtonsRow}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "personal" && styles.tabButtonActive]}
          onPress={() => setSelectedTab("personal")}
        >
          <Text style={[styles.tabButtonText, selectedTab === "personal" && styles.tabButtonTextActive]}>활동 이력</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "mogujang" && styles.tabButtonActive]}
          onPress={() => setSelectedTab("mogujang")}
        >
          <Text style={[styles.tabButtonText, selectedTab === "mogujang" && styles.tabButtonTextActive]}>모구장</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "mogurur" && styles.tabButtonActive]}
          onPress={() => setSelectedTab("mogurur")}
        >
          <Text style={[styles.tabButtonText, selectedTab === "mogurur" && styles.tabButtonTextActive]}>모구러</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContentWrapper}>
        {selectedTab === "personal" && renderPersonal()}
        {selectedTab === "mogujang" && renderSold()}
        {selectedTab === "mogurur" && renderPurchased()}
      </View>

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
                          styles.progressBarFill,
                          { 
                            width: `${(selectedBadge.currentProgress / selectedBadge.requiredProgress) * 100}%`,
                            backgroundColor: selectedBadge.color
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
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
                    <>
                      {/* 대표 배지 설정/해제 버튼 */}
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
                      
                      {/* 대표 배지 변경 버튼 (대표 배지일 때만 표시) */}
                      {representativeBadgeId === selectedBadge.id && (
                        <TouchableOpacity
                          style={styles.badgeModalChangeButton}
                          onPress={() => {
                            setBadgeModalVisible(false);
                            navigation.navigate("Badges" as never);
                          }}
                        >
                          <Ionicons name="swap-horizontal" size={20} color="#8A2BE2" />
                          <Text style={styles.badgeModalChangeButtonText}>대표 배지 변경하기</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <>
                      {/* 관심 배지 설정/해제 버튼 */}
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
                      
                      {/* 관심 배지 변경 버튼 (관심 배지일 때만 표시) */}
                      {interestBadgeId === selectedBadge.id && (
                        <TouchableOpacity
                          style={styles.badgeModalChangeButton}
                          onPress={() => {
                            setBadgeModalVisible(false);
                            navigation.navigate("Badges" as never);
                          }}
                        >
                          <Ionicons name="swap-horizontal" size={20} color="#8A2BE2" />
                          <Text style={styles.badgeModalChangeButtonText}>관심 배지 변경하기</Text>
                        </TouchableOpacity>
                      )}
                    </>
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
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  settingsButton: { padding: 5 },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  badgesContainer: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  badgeItemLocked: {
    backgroundColor: "#f0f0f0",
    borderColor: "#d0d0d0",
    borderStyle: "dashed",
  },
  representativeBadgeStar: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 1,
  },
  interestBadgeHeart: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 1,
  },
  profileImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  nickname: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  editProfileButton: {
    backgroundColor: "#f0e6fa",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  editProfileButtonText: { fontSize: 16, color: "#8A2BE2", fontWeight: "bold" },

  tabButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabButton: {
    paddingVertical: 15,
    backgroundColor: "#f0e6fa",
    borderRadius: 16,
    flex: 1, // 3등분 배치
    marginHorizontal: 5, // 버튼 간 간격
  },
  tabButtonActive: { backgroundColor: "#8A2BE2" },
  tabButtonText: { color: "#8A2BE2", fontWeight: "bold", textAlign: "center", fontSize: 15 },
  tabButtonTextActive: { color: "#fff", fontWeight: "bold" },

  tabContentWrapper: { paddingHorizontal: 10 },

  activitySectionPersonal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexWrap: "wrap",
  },
  activityItemPersonal: { alignItems: "center", width: "25%", marginBottom: 10 },
  activityTextPersonal: { marginTop: 5, fontSize: 14, color: "#555" },

  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  productsSectionTitle: { fontSize: 18, fontWeight: "bold" },

  tabContent: { flex: 1, backgroundColor: "#fff" },
  productItem: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  thumbnailImage: { width: 80, height: 80, borderRadius: 5, marginRight: 15 },
  productDetails: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { fontSize: 16, color: "#8A2BE2", marginTop: 5 },
  productMoguin: { fontSize: 14, color: "gray", marginTop: 5 },

  noPurchaseContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 50 },
  noPurchaseText: { fontSize: 18, fontWeight: "bold", color: "gray", marginBottom: 10 },
  noPurchaseSubText: { fontSize: 14, color: "gray" },

  reviewsSection: { 
    padding: 15,
    backgroundColor: '#fff',
  },
  reviewsHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 20,
  },
  reviewsTitle: { 
    fontSize: 20, 
    fontWeight: "bold",
    color: '#333',
    marginBottom: 4,
  },
  reviewsSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0e6fa',
    borderRadius: 20,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A2BE2',
    marginRight: 2,
  },
  reviewCategory: {
    marginBottom: 20,
  },
  reviewCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  reviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reviewCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewCardCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  reviewCardText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },

  // 배지 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeModalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "85%",
    maxWidth: 400,
  },
  badgeModalIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  badgeModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  badgeModalDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  badgeConditionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  badgeConditionText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 8,
  },
  progressRemainingText: {
    fontSize: 14,
    color: "#FF9800",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  badgeModalButtonContainer: {
    width: "100%",
    gap: 10,
  },
  badgeModalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#8A2BE2",
  },
  badgeModalButtonActive: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FFD700",
  },
  badgeModalButtonText: {
    color: "#8A2BE2",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  badgeModalButtonTextActive: {
    color: "#FF9800",
  },
  badgeModalButtonInterest: {
    borderColor: "#8A2BE2",
  },
  badgeModalButtonInterestActive: {
    backgroundColor: "#FFF0F5",
    borderColor: "#FF69B4",
  },
  badgeModalButtonInterestTextActive: {
    color: "#FF69B4",
  },
  badgeModalChangeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0e6fa",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#8A2BE2",
  },
  badgeModalChangeButtonText: {
    color: "#8A2BE2",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  badgeModalCloseButton: {
    backgroundColor: "#8A2BE2",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
  },
  badgeModalCloseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

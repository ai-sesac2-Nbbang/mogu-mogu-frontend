// src/screens/ProductDetailScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute, RouteProp } from "@react-navigation/native";
import { HomeStackParamList } from "../types/navigation";
import axios from "axios";

type ProductDetailScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "ProductDetail"
>;
type ProductDetailScreenRouteProp = RouteProp<HomeStackParamList, "ProductDetail">;

interface Props {
  navigation: ProductDetailScreenNavigationProp;
}

interface ProductDetail {
  id: number;
  name: string;
  originalPrice: string;
  groupPrice: string;
  currentParticipants: number;
  maxParticipants: number;
  perPersonPrice: string;
  meetupLocation: string;
  meetupDate: string;
  meetupTime: string;
  image: any;
  description: string;
  deliveryInfo: string;
  endDate: string;
  category: string;
}

export default function ProductDetailScreen({ navigation }: Props) {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { productId } = route.params;

  const [product, setProduct] = useState<ProductDetail>({
    id: 1,
    name: "물티슈 10롤",
    originalPrice: "25,000원",
    groupPrice: "27,500원",
    currentParticipants: 3,
    maxParticipants: 3,
    perPersonPrice: "9,170원",
    meetupDate: "2025년 10월 15일",
    meetupLocation: "공덕역 2번 출구 앞",
    meetupTime: "오후 2:00",
    image: require("../../assets/products/tissue.png"),
    description: "프리미엄 3겹 프리미어 물티슈입니다.\n• 부드러운 3겹 프리미어 물티슈입니다.\n• 총 30롤, 25,000원\n• 10롤(3,170원) 다음 가격 이하에서 거래 완료됩니다.\n• 거래 일정 1차 거래일 24시 7일 이하에서 거래 완료됩니다.\n• 3일 모집합니다.",
    deliveryInfo: "집단배송금고",
    endDate: "2일 뒤",
    category: "모구 마켓",
  });

  const [isLiked, setIsLiked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [showMoguModal, setShowMoguModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // TODO: DB에서 상품 상세 정보 불러오기
  /*
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          const productData = response.data.product;
          setProduct({
            id: productData.id,
            name: productData.name,
            originalPrice: productData.originalPrice,
            groupPrice: productData.groupPrice,
            currentParticipants: productData.currentParticipants,
            maxParticipants: productData.maxParticipants,
            perPersonPrice: productData.perPersonPrice,
            meetupDate: productData.meetupDate,
            meetupLocation: productData.meetupLocation,
            meetupTime: productData.meetupTime,
            image: { uri: productData.imageUrl },
            description: productData.description,
            deliveryInfo: productData.deliveryInfo,
            endDate: productData.endDate,
            category: productData.category,
          });
          setIsLiked(productData.isLiked);
          setIsJoined(productData.isJoined);
        }
      } catch (error) {
        console.error('상품 상세 정보 조회 실패:', error);
        Alert.alert('오류', '상품 정보를 불러올 수 없습니다.');
      }
    };
    
    fetchProductDetail();
  }, [productId]);
  */

  // 하드코딩: productId에 따른 더미 데이터 매핑
  useEffect(() => {
    // 관심 목록에서 온 상품들의 ID (관심 목록에 있는 상품들)
    const wishlistProductIds = ["1", "2", "3", "4"];
    
    const dummyProducts: { [key: string]: ProductDetail } = {
      "1": {
        id: 1,
        name: "프리미엄 롤화장지 10롤 구매하실 분?",
        originalPrice: "25,000원",
        groupPrice: "27,500원",
        currentParticipants: 1,
        maxParticipants: 3,
        perPersonPrice: "9,170원",
        meetupDate: "2025년 10월 15일",
        meetupLocation: "공덕역 2번 출구 앞",
        meetupTime: "오후 2:00",
        image: require("../../assets/products/tissue.png"),
        description: "프리미엄 3겹 롤화장지입니다.\n• 부드러운 3겹 프리미엄 화장지\n• 총 30롤, 25,000원\n• 10롤씩 나눠서 거래합니다.\n• 공덕역에서 직거래 예정입니다.",
        deliveryInfo: "직접 수령",
        endDate: "2일 뒤",
        category: "모구 마켓",
      },
      "2": {
        id: 2,
        name: "삼다수 생수 2L 6병 묶음 구매하실 분?",
        originalPrice: "8,000원",
        groupPrice: "9,180원",
        currentParticipants: 1,
        maxParticipants: 2,
        perPersonPrice: "4,590원",
        meetupDate: "2025년 10월 16일",
        meetupLocation: "신촌역 3번 출구",
        meetupTime: "오후 3:00",
        image: require("../../assets/products/shampoo.png"),
        description: "제주 삼다수 2L 생수입니다.\n• 신선한 제주 생수\n• 총 12병, 8,000원\n• 6병씩 나눠서 거래합니다.",
        deliveryInfo: "직접 수령",
        endDate: "3일 뒤",
        category: "모구 마켓",
      },
      "3": {
        id: 3,
        name: "무항생제 신선 계란 10구 구매하실 분?",
        originalPrice: "7,500원",
        groupPrice: "8,400원",
        currentParticipants: 1,
        maxParticipants: 3,
        perPersonPrice: "2,800원",
        meetupDate: "2025년 10월 17일",
        meetupLocation: "홍대입구역 9번 출구",
        meetupTime: "오전 11:00",
        image: require("../../assets/products/eggs.png"),
        description: "무항생제 신선 계란입니다.\n• 건강한 무항생제 계란\n• 총 30구, 7,500원\n• 10구씩 나눠서 거래합니다.",
        deliveryInfo: "직접 수령",
        endDate: "1일 뒤",
        category: "모구 마켓",
      },
      "4": {
        id: 4,
        name: "칫솔 5개입 세트 구매하실 분?",
        originalPrice: "28,000원",
        groupPrice: "30,000원",
        currentParticipants: 2,
        maxParticipants: 4,
        perPersonPrice: "7,500원",
        meetupDate: "2025년 10월 18일",
        meetupLocation: "강남역 10번 출구",
        meetupTime: "오후 6:00",
        image: require("../../assets/products/toothbrush.png"),
        description: "고급 칫솔 5개입 세트입니다.\n• 부드러운 모질의 칫솔\n• 총 20개, 28,000원\n• 5개씩 나눠서 거래합니다.",
        deliveryInfo: "직접 수령",
        endDate: "4일 뒤",
        category: "모구 마켓",
      },
    };

    const selectedProduct = dummyProducts[productId] || dummyProducts["1"];
    setProduct(selectedProduct);
    
    // 관심 목록에 있는 상품이면 좋아요 표시
    setIsLiked(wishlistProductIds.includes(String(productId)));
    setIsJoined(false);
  }, [productId]);

  // 사용자 선호 시간대 추천 시스템 (주석 처리됨)
  /*
  const fetchRecommendedTime = async () => {
    try {
      const response = await axios.get('/api/user-preferences/recommended-time', {
        params: {
          productId: productId,
          location: product.meetupLocation,
        },
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
      
      if (response.data.success) {
        const recommendedHour = response.data.recommendedTime; // 예: "14:00"
        setRecommendedTime(recommendedHour);
        
        // 추천 시간으로 초기 시간 설정
        const [hour, minute] = recommendedHour.split(':');
        const newDate = new Date(meetupDate);
        newDate.setHours(parseInt(hour), parseInt(minute));
        setMeetupDate(newDate);
      }
    } catch (error) {
      console.error('추천 시간 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchRecommendedTime();
  }, [productId]);
  */

  // 가격 증가율 계산 함수
  const calculatePriceIncrease = () => {
    const original = parseFloat(product.originalPrice.replace(/[^0-9]/g, ''));
    const group = parseFloat(product.groupPrice.replace(/[^0-9]/g, ''));
    
    if (original > 0 && group > 0 && group > original) {
      const increase = ((group - original) / original * 100).toFixed(1);
      return increase;
    }
    return "0";
  };

  // 데이터베이스에서 상품 상세 정보 가져오기 (주석 처리됨)
  /*
  const fetchProductDetail = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
      
      if (response.data.success) {
        const productData = response.data.product;
        setProduct({
          id: productData.id,
          name: productData.name,
          originalPrice: productData.original_price,
          groupPrice: productData.group_price,
          currentParticipants: productData.current_participants,
          maxParticipants: productData.max_participants,
          perPersonPrice: productData.per_person_price,
          meetupLocation: productData.meetup_location,
          meetupDate: productData.meetup_date,
          meetupTime: productData.meetup_time,
          image: productData.image_url ? { uri: productData.image_url } : require("../../assets/products/tissue.png"),
          description: productData.description,
          deliveryInfo: productData.delivery_info,
          endDate: productData.end_date,
          category: productData.category,
        });
      }
    } catch (error) {
      console.error('상품 상세 정보 조회 실패:', error);
    }
  };

  // 좋아요 상태 가져오기
  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}/like-status`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
      
      if (response.data.success) {
        setIsLiked(response.data.isLiked);
      }
    } catch (error) {
      console.error('좋아요 상태 조회 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 상품 상세 정보와 좋아요 상태 로드
  useEffect(() => {
    fetchProductDetail();
    fetchLikeStatus();
  }, [productId]);
  */

  const handleJoinGroup = () => {
    if (isJoined) {
      // 모구 취소 팝업 표시
      setShowCancelModal(true);
    } else {
      // 모구 신청 팝업 표시
      setShowMoguModal(true);
    }
  };

  const confirmMoguJoin = () => {
    // 모구 참여 로직 (주석 처리됨)
    /*
    const joinGroup = async () => {
      try {
        const response = await axios.post(`/api/products/${productId}/join`, {
          meetupDate: meetupDate.toISOString(),
        }, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setIsJoined(true);
          setShowMoguModal(false);
          // 성공 시 상품 정보 다시 로드
          fetchProductDetail();
          alert('모구 참여가 완료되었습니다!');
        } else {
          alert(response.data.message || '모구 참여에 실패했습니다.');
        }
      } catch (error) {
        console.error('모구 참여 실패:', error);
        alert('모구 참여 중 오류가 발생했습니다.');
      }
    };
    
    joinGroup();
    */
    setIsJoined(true);
    setShowMoguModal(false);
    console.log("모구 참여 완료");
  };

  const confirmMoguCancel = () => {
    // 모구 취소 로직 (주석 처리됨)
    /*
    const cancelGroup = async () => {
      try {
        const response = await axios.delete(`/api/products/${productId}/join`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setIsJoined(false);
          setShowCancelModal(false);
          // 성공 시 상품 정보 다시 로드
          fetchProductDetail();
          alert('모구 취소가 완료되었습니다.');
        } else {
          alert(response.data.message || '모구 취소에 실패했습니다.');
        }
      } catch (error) {
        console.error('모구 취소 실패:', error);
        alert('모구 취소 중 오류가 발생했습니다.');
      }
    };
    
    cancelGroup();
    */
    setIsJoined(false);
    setShowCancelModal(false);
    console.log("모구 취소 완료");
  };

  const handleToggleLike = () => {
    // 좋아요 토글 로직 (주석 처리됨)
    /*
    const toggleLike = async () => {
      try {
        const response = await axios.post(`/api/products/${productId}/like`, {
          isLiked: !isLiked,
        }, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setIsLiked(!isLiked);
        } else {
          alert('좋아요 처리에 실패했습니다.');
        }
      } catch (error) {
        console.error('좋아요 처리 실패:', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    };
    
    toggleLike();
    */
    setIsLiked(!isLiked);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상세페이지</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleToggleLike} style={styles.headerButton}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? "#8A2BE2" : "#666"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 상품 이미지 */}
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.productImage} />
        </View>

        {/* 상품 정보 */}
        <View style={styles.productInfo}>
          {/* 기본 정보 카드 */}
          <View style={styles.infoCard}>
            <View style={styles.categoryBadge}>
              <Ionicons name="pricetag" size={14} color="#8A2BE2" />
              <Text style={styles.categoryTag}>{product.category}</Text>
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.endDateBadge}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.endDateText}>{product.endDate} 마감</Text>
            </View>
          </View>

          {/* 가격 정보 카드 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash" size={22} color="#8A2BE2" />
              <Text style={styles.sectionTitle}>가격 정보</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.labelText}>구매 가격</Text>
              <Text style={styles.originalPrice}>{product.originalPrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.labelText}>최종 가격</Text>
              <Text style={styles.groupPrice}>{product.groupPrice}</Text>
            </View>
            {calculatePriceIncrease() !== "0" && (
              <View style={styles.discountRow}>
                <Ionicons name="trending-up" size={14} color="#8A2BE2" />
                <Text style={styles.discountText}>
                  구매 가격 대비 약 {calculatePriceIncrease()}% 증가
                </Text>
              </View>
            )}
            <View style={styles.highlightRow}>
              <View style={styles.highlightItem}>
                <Ionicons name="people" size={20} color="#8A2BE2" />
                <Text style={styles.highlightLabel}>참여 인원</Text>
                <Text style={styles.highlightValue}>
                  {product.currentParticipants}/{product.maxParticipants}명
                </Text>
              </View>
              <View style={styles.dividerVertical} />
              <View style={styles.highlightItem}>
                <Ionicons name="wallet" size={20} color="#8A2BE2" />
                <Text style={styles.highlightLabel}>인당 금액</Text>
                <Text style={styles.highlightValue}>{product.perPersonPrice}</Text>
              </View>
            </View>
          </View>

          {/* 만남 정보 카드 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={22} color="#8A2BE2" />
              <Text style={styles.sectionTitle}>만남 정보</Text>
            </View>
            <View style={styles.meetupRow}>
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <Text style={styles.labelText}>날짜</Text>
              <Text style={styles.meetupDate}>{product.meetupDate}</Text>
            </View>
            <View style={styles.meetupRow}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.labelText}>시간</Text>
              <Text style={styles.meetupTime}>{product.meetupTime}</Text>
            </View>
            <View style={styles.meetupRow}>
              <Ionicons name="location" size={18} color="#666" />
              <Text style={styles.labelText}>장소</Text>
              <Text style={styles.meetupLocation}>{product.meetupLocation}</Text>
            </View>
          </View>

          {/* 상세 내용 카드 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={22} color="#8A2BE2" />
              <Text style={styles.sectionTitle}>상세 내용</Text>
            </View>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* 모구 안내 카드 */}
          <View style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <Ionicons name="information-circle" size={20} color="#8A2BE2" />
              <Text style={styles.noticeTitle}>모구 안내</Text>
            </View>
            <Text style={styles.noticeText}>
              • 모구 참여 후 거래가 성사되면 알림을 보내드립니다.{'\n'}
              • 만남 장소와 시간을 꼭 확인해주세요.{'\n'}
              • 모구장 제외 인원으로 1/n 금액이 책정됩니다.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomSection}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>인당 금액</Text>
          <Text style={styles.priceValue}>{product.perPersonPrice}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.joinButton, isJoined && styles.cancelButton]} 
          onPress={handleJoinGroup}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isJoined ? "close-circle" : "checkmark-circle"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.joinButtonText}>
            {isJoined ? "모구 취소" : "모구 신청"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 모구 신청 팝업 */}
      <Modal
        visible={showMoguModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMoguModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="checkmark-circle" size={60} color="#e91e63" />
            </View>
            <Text style={styles.modalTitle}>신청 완료</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={confirmMoguJoin}
            >
              <Text style={styles.modalButtonText}>신청 완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 모구 취소 팝업 */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="close-circle" size={60} color="#e91e63" />
            </View>
            <Text style={styles.modalTitle}>정말로 모구를 취소하시겠습니까?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelModalButtonText]}>아니오</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmCancelButton]}
                onPress={confirmMoguCancel}
              >
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 25,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },
  backButton: {
    padding: 4,
    zIndex: 1,
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    zIndex: 1,
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 40,
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  productInfo: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryTag: {
    fontSize: 12,
    color: "#8A2BE2",
    fontWeight: "600",
    marginLeft: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    lineHeight: 28,
  },
  endDateBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  endDateText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#f3e5f5",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  labelText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  originalPrice: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  groupPrice: {
    fontSize: 15,
    color: "#8A2BE2",
    fontWeight: "bold",
  },
  discountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F3E5F5",
    borderRadius: 8,
    marginTop: 8,
  },
  discountText: {
    fontSize: 12,
    color: "#8A2BE2",
    marginLeft: 4,
    fontWeight: "600",
  },
  highlightRow: {
    flexDirection: "row",
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  highlightItem: {
    flex: 1,
    alignItems: "center",
  },
  highlightLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  meetupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 12,
  },
  meetupDate: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: "auto",
  },
  meetupTime: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: "auto",
  },
  meetupLocation: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: "auto",
    flex: 1,
    textAlign: "right",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  noticeCard: {
    backgroundColor: "#F3E5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 80,
    borderLeftWidth: 4,
    borderLeftColor: "#8A2BE2",
  },
  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#8A2BE2",
    marginLeft: 6,
  },
  noticeText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceInfo: {
    flex: 1,
    marginRight: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8A2BE2",
  },
  joinButton: {
    flexDirection: "row",
    backgroundColor: "#8A2BE2",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8A2BE2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    minWidth: 280,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  modalButton: {
    backgroundColor: "#8A2BE2",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    minWidth: 120,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  cancelModalButton: {
    backgroundColor: "#f0f0f0",
    flex: 1,
  },
  cancelModalButtonText: {
    color: "#333",
  },
  confirmCancelButton: {
    backgroundColor: "#8A2BE2",
    flex: 1,
  },
});

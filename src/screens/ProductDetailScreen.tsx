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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleToggleLike} style={styles.headerButton}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? "#e91e63" : "#000"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 상품 이미지 */}
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.productImage} />
        </View>

        {/* 상품 정보 */}
        <View style={styles.productInfo}>
          <View style={styles.priceSection}>
            <Text style={styles.categoryTag}>{product.category}</Text>
            <Text style={styles.productName}>{product.name}</Text>
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
                <Text style={styles.discountText}>
                  구매 가격 대비 약 {calculatePriceIncrease()}% 증가했습니다.
                </Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.labelText}>참여 인원</Text>
              <Text style={styles.participants}>
                {product.currentParticipants}/{product.maxParticipants}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.labelText}>인당 금액</Text>
              <Text style={styles.perPersonPrice}>{product.perPersonPrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.labelText}>만남 날짜</Text>
              <Text style={styles.meetupDate}>{product.meetupDate}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.labelText}>만남 시간</Text>
              <Text style={styles.meetupTime}>{product.meetupTime}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.labelText}>만남 장소</Text>
              <Text style={styles.meetupLocation}>{product.meetupLocation}</Text>
            </View>
          </View>

          {/* 상세 내용 */}
          <View style={styles.sectionContainer}>
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>상세 내용</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          </View>

          {/* 모구 신청 */}
          <View style={styles.sectionContainer}>
            <View style={styles.applySection}>
              <Text style={styles.sectionTitle}>모구 신청</Text>
              <Text style={styles.applyText}>
                모구하신 3겹 프리미어 물티슈가 대량 구매 가격으로 10% 할인혜택을 받을 수 있습니다.
              </Text>
              <Text style={styles.applySubText}>
                가격 가격에서의 재고 24시 7일 이하에서 거래 완료됩니다.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.joinButton, isJoined && styles.cancelButton]} 
          onPress={handleJoinGroup}
        >
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 25,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    paddingVertical: 40,
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  productInfo: {
    padding: 20,
  },
  priceSection: {
    marginBottom: 30,
  },
  categoryTag: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  labelText: {
    fontSize: 14,
    color: "#666",
  },
  originalPrice: {
    fontSize: 14,
    color: "#333",
  },
  groupPrice: {
    fontSize: 14,
    color: "#e91e63",
    fontWeight: "bold",
  },
  participants: {
    fontSize: 14,
    color: "#333",
  },
  perPersonPrice: {
    fontSize: 14,
    color: "#e91e63",
    fontWeight: "bold",
  },
  meetupLocation: {
    fontSize: 14,
    color: "#333",
  },
  discountRow: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff5f5",
    borderRadius: 4,
    marginTop: 8,
  },
  discountText: {
    fontSize: 12,
    color: "#e91e63",
    textAlign: "center",
  },
  meetupDate: {
    fontSize: 14,
    color: "#333",
  },
  meetupTime: {
    fontSize: 14,
    color: "#333",
  },
  sectionContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    backgroundColor: "#e91e63",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    minWidth: 100,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
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
    backgroundColor: "#e91e63",
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  applySection: {
    marginBottom: 30,
  },
  applyText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  applySubText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  bottomSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  joinButton: {
    backgroundColor: "#e91e63",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

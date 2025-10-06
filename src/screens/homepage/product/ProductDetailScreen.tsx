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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute, RouteProp } from "@react-navigation/native";
import { HomeStackParamList } from "../../../types/navigation";
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

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userRole: 'host' | 'participant'; // 모구장 or 모구러
  content: string;
  createdAt: string;
  profileImage?: string;
}

interface ParticipantRequest {
  id: number;
  userId: number;
  userName: string;
  status: 'pending' | 'approved' | 'rejected'; // 대기, 승인, 거절
  requestedAt: string;
  profileImage?: string;
  participationHistory: {
    totalParticipations: number;
    completedParticipations: number;
    canceledParticipations: number;
    reliabilityScore: number; // 0-100
  };
}

export default function ProductDetailScreen({ navigation }: Props) {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { productId } = route.params;

  // 데이터베이스에서 제품 상세 정보를 조회하는 함수 (현재 주석처리)
  // const fetchProductDetail = async (id: number) => {
  //   try {
  //     // TODO: 실제 API 호출로 교체
  //     // const response = await fetch(`/api/products/${id}`);
  //     // const productDetail = await response.json();
  //     // return productDetail;
      
  //     // 임시로 하드코딩된 제품 상세 정보 반환 (실제 구현 시 주석 처리)
  //     const hardcodedProductDetail = {
  //       id: id,
  //       name: "물티슈 10롤",
  //       originalPrice: "25,000원",
  //       groupPrice: "27,500원",
  //       currentParticipants: 2,
  //       maxParticipants: 3,
  //       perPersonPrice: "9,170원",
  //       meetupDate: "2024년 12월 25일",
  //       meetupLocation: "서울시청 앞 광장",
  //       meetupTime: "오후 2:00",
  //       image: require("../../../../assets/products/tissue.png"),
  //       description: "부드럽고 튼튼한 물티슈로 일상생활에 필수적인 제품입니다. 10롤 세트로 경제적이고 실용적입니다.\n\n• 100% 천연 펄프 사용\n• 알레르기 테스트 완료\n• 친환경 포장재 사용\n• 방수 처리로 내구성 향상",
  //       deliveryInfo: "집단배송금고",
  //       endDate: "2일 뒤",
  //       category: "생활용품",
  //       brand: "크리넥스",
  //       features: [
  //         "100% 천연 펄프 사용",
  //         "알레르기 테스트 완료", 
  //         "친환경 포장재 사용",
  //         "방수 처리로 내구성 향상"
  //       ],
  //       organizer: {
  //         name: "김모구",
  //         rating: 4.8,
  //         reviewCount: 127
  //       },
  //       reviews: [
  //         {
  //           id: 1,
  //           userName: "이사용자",
  //           rating: 5,
  //           comment: "정말 좋은 제품이에요! 다음에도 참여하고 싶습니다.",
  //           date: "2024-12-20"
  //         },
  //         {
  //           id: 2,
  //           userName: "박고객", 
  //           rating: 4,
  //           comment: "가격 대비 품질이 훌륭합니다. 추천해요!",
  //           date: "2024-12-19"
  //         }
  //       ],
  //       status: "진행중",
  //       location: {
  //         lat: 37.5665,
  //         lng: 126.9780,
  //         address: "서울특별시 중구 세종대로 110"
  //       }
  //     };
      
  //     console.log('제품 상세 정보 조회 완료:', hardcodedProductDetail);
  //     return hardcodedProductDetail;
  //   } catch (error) {
  //     console.error('제품 상세 정보 조회 오류:', error);
  //     throw error;
  //   }
  // };

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
    image: require("../../../../assets/products/tissue.png"),
    description: "프리미엄 3겹 프리미어 물티슈입니다.\n• 부드러운 3겹 프리미어 물티슈입니다.\n• 총 30롤, 25,000원\n• 10롤(3,170원) 다음 가격 이하에서 거래 완료됩니다.\n• 거래 일정 1차 거래일 24시 7일 이하에서 거래 완료됩니다.\n• 3일 모집합니다.",
    deliveryInfo: "집단배송금고",
    endDate: "2일 뒤",
    category: "모구 마켓",
  });

  // 데이터베이스 조회 부분 주석처리 (현재는 기본 제품 정보 사용)
  // const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 제품 상세 정보 조회 (현재 주석처리)
  // useEffect(() => {
  //   const loadProductDetail = async () => {
  //     try {
  //       console.log('ProductDetailScreen - 제품 상세 정보 조회 시작, productId:', productId);
  //       setIsLoading(true);
        
  //       const productDetail = await fetchProductDetail(productId);
        
  //       // 조회된 데이터로 제품 정보 업데이트
  //       setProduct({
  //         id: productDetail.id,
  //         name: productDetail.name,
  //         originalPrice: productDetail.originalPrice,
  //         groupPrice: productDetail.groupPrice,
  //         currentParticipants: productDetail.currentParticipants,
  //         maxParticipants: productDetail.maxParticipants,
  //         perPersonPrice: productDetail.perPersonPrice,
  //         meetupDate: productDetail.meetupDate,
  //         meetupLocation: productDetail.meetupLocation,
  //         meetupTime: productDetail.meetupTime,
  //         image: productDetail.image,
  //         description: productDetail.description,
  //         deliveryInfo: productDetail.deliveryInfo,
  //         endDate: productDetail.endDate,
  //         category: productDetail.category,
  //       });
        
  //       console.log('ProductDetailScreen - 제품 상세 정보 로드 완료');
  //     } catch (error) {
  //       console.error('ProductDetailScreen - 제품 상세 정보 로드 실패:', error);
  //       Alert.alert('오류', '제품 정보를 불러오는데 실패했습니다.');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadProductDetail();
  // }, [productId]);

  const [isLiked, setIsLiked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [showMoguModal, setShowMoguModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isHost, setIsHost] = useState(false); // 현재 사용자가 모구장인지 여부
  const [participantRequests, setParticipantRequests] = useState<ParticipantRequest[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantRequest | null>(null);
  const [currentUserId] = useState(999); // 현재 로그인한 사용자 ID (하드코딩)
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showKickModal, setShowKickModal] = useState(false);
  const [selectedParticipantForAction, setSelectedParticipantForAction] = useState<ParticipantRequest | null>(null);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

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

  // TODO: DB에서 댓글 정보 불러오기
  /*
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}/comments`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error('댓글 조회 실패:', error);
      }
    };
    
    fetchComments();
  }, [productId]);
  */

  // 하드코딩: 댓글 더미 데이터
  useEffect(() => {
    const dummyComments: Comment[] = [
      {
        id: 1,
        userId: 1,
        userName: "김모구",
        userRole: "host",
        content: "안녕하세요! 공덕역에서 만나요. 시간 맞추시기 편하신 분들 참여해주세요~",
        createdAt: "2시간 전",
      },
      {
        id: 2,
        userId: 2,
        userName: "이모구",
        userRole: "participant",
        content: "참여했습니다! 2시에 갈게요 😊",
        createdAt: "1시간 전",
      },
      {
        id: 3,
        userId: 3,
        userName: "박모구",
        userRole: "participant",
        content: "혹시 조금 늦을 수도 있는데 괜찮을까요?",
        createdAt: "30분 전",
      },
      {
        id: 4,
        userId: 1,
        userName: "김모구",
        userRole: "host",
        content: "네 괜찮습니다! 10분 정도는 기다릴게요 ㅎㅎ",
        createdAt: "20분 전",
      },
      {
        id: 5,
        userId: 4,
        userName: "최모구",
        userRole: "participant",
        content: "마감 아쉽네요 ㅠㅠ 다음에 또 올려주세요!",
        createdAt: "10분 전",
      },
    ];
    
    setComments(dummyComments);
  }, [productId]);

  // TODO: DB에서 현재 사용자가 모구장인지 확인
  /*
  useEffect(() => {
    const checkIfHost = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}/check-host`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setIsHost(response.data.isHost);
        }
      } catch (error) {
        console.error('모구장 확인 실패:', error);
      }
    };
    
    checkIfHost();
  }, [productId]);
  */

  // 하드코딩: 현재 사용자가 모구장인지 설정 (테스트용)
  useEffect(() => {
    // productId가 1일 때만 모구장으로 설정 (테스트용)
    setIsHost(String(productId) === "1");
  }, [productId]);

  // TODO: DB에서 모구러 신청 목록 가져오기 (모구장인 경우만)
  /*
  useEffect(() => {
    if (!isHost) return;
    
    const fetchParticipantRequests = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}/participant-requests`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setParticipantRequests(response.data.requests);
        }
      } catch (error) {
        console.error('모구러 신청 목록 조회 실패:', error);
      }
    };
    
    fetchParticipantRequests();
  }, [productId, isHost]);
  */

  // 하드코딩: 모구러 신청 목록 더미 데이터
  useEffect(() => {
    if (!isHost) return;
    
    const dummyRequests: ParticipantRequest[] = [
      {
        id: 1,
        userId: 2,
        userName: "이모구",
        status: "approved",
        requestedAt: "2시간 전",
        participationHistory: {
          totalParticipations: 15,
          completedParticipations: 14,
          canceledParticipations: 1,
          reliabilityScore: 93,
        },
      },
      {
        id: 2,
        userId: 3,
        userName: "박모구",
        status: "approved",
        requestedAt: "1시간 전",
        participationHistory: {
          totalParticipations: 8,
          completedParticipations: 7,
          canceledParticipations: 1,
          reliabilityScore: 88,
        },
      },
      {
        id: 3,
        userId: 5,
        userName: "정모구",
        status: "pending",
        requestedAt: "30분 전",
        participationHistory: {
          totalParticipations: 3,
          completedParticipations: 2,
          canceledParticipations: 1,
          reliabilityScore: 67,
        },
      },
      {
        id: 4,
        userId: 6,
        userName: "최모구러",
        status: "pending",
        requestedAt: "15분 전",
        participationHistory: {
          totalParticipations: 20,
          completedParticipations: 19,
          canceledParticipations: 1,
          reliabilityScore: 95,
        },
      },
    ];
    
    setParticipantRequests(dummyRequests);
  }, [productId, isHost]);

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
        image: require("../../../../assets/products/tissue.png"),
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
        image: require("../../../../assets/products/shampoo.png"),
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
        image: require("../../../../assets/products/eggs.png"),
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
        image: require("../../../../assets/products/toothbrush.png"),
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
          image: productData.image_url ? { uri: productData.image_url } : require("../../../../assets/products/tissue.png"),
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

  // 모구러 히스토리 보기
  const handleShowHistory = (participant: ParticipantRequest) => {
    setSelectedParticipant(participant);
    setShowHistoryModal(true);
  };

  // 모구러 승인 모달 열기
  const handleApproveParticipant = (participant: ParticipantRequest) => {
    setSelectedParticipantForAction(participant);
    setShowApproveModal(true);
  };

  // 모구러 승인 확정
  const confirmApproveParticipant = () => {
    if (!selectedParticipantForAction) return;

    // TODO: DB에 승인 저장
    /*
    const approveParticipant = async () => {
      try {
        const response = await axios.post(
          `/api/products/${productId}/participants/${selectedParticipantForAction.id}/approve`,
          {},
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
            },
          }
        );

        if (response.data.success) {
          // 신청 목록 업데이트
          setParticipantRequests(prevRequests =>
            prevRequests.map(req =>
              req.id === selectedParticipantForAction.id ? { ...req, status: 'approved' } : req
            )
          );
          setShowApproveModal(false);
          setSelectedParticipantForAction(null);
        } else {
          Alert.alert("오류", response.data.message || "승인에 실패했습니다.");
        }
      } catch (error) {
        console.error("승인 실패:", error);
        Alert.alert("오류", "승인 중 오류가 발생했습니다.");
      }
    };

    approveParticipant();
    */

    // 하드코딩: 승인 처리
    setParticipantRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === selectedParticipantForAction.id ? { ...req, status: 'approved' } : req
      )
    );
    setShowApproveModal(false);
    setSelectedParticipantForAction(null);
  };

  // 모구러 거절 모달 열기
  const handleRejectParticipant = (participant: ParticipantRequest) => {
    setSelectedParticipantForAction(participant);
    setShowRejectModal(true);
  };

  // 모구러 거절 확정
  const confirmRejectParticipant = () => {
    if (!selectedParticipantForAction) return;

    // TODO: DB에 거절 저장
    /*
    const rejectParticipant = async () => {
      try {
        const response = await axios.post(
          `/api/products/${productId}/participants/${selectedParticipantForAction.id}/reject`,
          {},
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
            },
          }
        );

        if (response.data.success) {
          // 신청 목록에서 제거
          setParticipantRequests(prevRequests =>
            prevRequests.filter(req => req.id !== selectedParticipantForAction.id)
          );
          setShowRejectModal(false);
          setSelectedParticipantForAction(null);
        } else {
          Alert.alert("오류", response.data.message || "거절에 실패했습니다.");
        }
      } catch (error) {
        console.error("거절 실패:", error);
        Alert.alert("오류", "거절 중 오류가 발생했습니다.");
      }
    };

    rejectParticipant();
    */

    // 하드코딩: 거절 처리
    setParticipantRequests(prevRequests =>
      prevRequests.filter(req => req.id !== selectedParticipantForAction.id)
    );
    setShowRejectModal(false);
    setSelectedParticipantForAction(null);
  };

  // 모구러 추방 모달 열기
  const handleKickParticipant = (participant: ParticipantRequest) => {
    setSelectedParticipantForAction(participant);
    setShowKickModal(true);
  };

  // 모구러 추방 확정
  const confirmKickParticipant = () => {
    if (!selectedParticipantForAction) return;

    // TODO: DB에 추방 저장
    /*
    const kickParticipant = async () => {
      try {
        const response = await axios.delete(
          `/api/products/${productId}/participants/${selectedParticipantForAction.id}`,
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
            },
          }
        );

        if (response.data.success) {
          // 신청 목록에서 제거
          setParticipantRequests(prevRequests =>
            prevRequests.filter(req => req.id !== selectedParticipantForAction.id)
          );
          setShowKickModal(false);
          setSelectedParticipantForAction(null);
        } else {
          Alert.alert("오류", response.data.message || "추방에 실패했습니다.");
        }
      } catch (error) {
        console.error("추방 실패:", error);
        Alert.alert("오류", "추방 중 오류가 발생했습니다.");
      }
    };

    kickParticipant();
    */

    // 하드코딩: 추방 처리
    setParticipantRequests(prevRequests =>
      prevRequests.filter(req => req.id !== selectedParticipantForAction.id)
    );
    setShowKickModal(false);
    setSelectedParticipantForAction(null);
  };

  // 댓글 삭제 모달 열기
  const handleDeleteComment = (commentId: number) => {
    setSelectedCommentId(commentId);
    setShowDeleteCommentModal(true);
  };

  // 댓글 삭제 확정
  const confirmDeleteComment = () => {
    if (!selectedCommentId) return;

    // TODO: DB에서 댓글 삭제
    /*
    const deleteComment = async () => {
      try {
        const response = await axios.delete(
          `/api/products/${productId}/comments/${selectedCommentId}`,
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
            },
          }
        );

        if (response.data.success) {
          setComments(prevComments =>
            prevComments.filter(comment => comment.id !== selectedCommentId)
          );
          setShowDeleteCommentModal(false);
          setSelectedCommentId(null);
        } else {
          Alert.alert("오류", response.data.message || "댓글 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        Alert.alert("오류", "댓글 삭제 중 오류가 발생했습니다.");
      }
    };

    deleteComment();
    */

    // 하드코딩: 댓글 삭제
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== selectedCommentId)
    );
    setShowDeleteCommentModal(false);
    setSelectedCommentId(null);
  };

  // 댓글 전송
  const handleSendComment = () => {
    if (newComment.trim() === "") {
      Alert.alert("알림", "댓글 내용을 입력해주세요.");
      return;
    }

    // TODO: DB에 댓글 저장
    /*
    const postComment = async () => {
      try {
        const response = await axios.post(
          `/api/products/${productId}/comments`,
          {
            content: newComment,
          },
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
            },
          }
        );

        if (response.data.success) {
          // 댓글 목록 다시 로드
          fetchComments();
          setNewComment("");
          Alert.alert("성공", "댓글이 등록되었습니다.");
        } else {
          Alert.alert("오류", response.data.message || "댓글 등록에 실패했습니다.");
        }
      } catch (error) {
        console.error("댓글 등록 실패:", error);
        Alert.alert("오류", "댓글 등록 중 오류가 발생했습니다.");
      }
    };

    postComment();
    */

    // 하드코딩: 더미 댓글 추가
    const newCommentObj: Comment = {
      id: comments.length + 1,
      userId: 999, // 현재 사용자 ID
      userName: "나",
      userRole: "participant", // 현재 사용자 역할
      content: newComment,
      createdAt: "방금 전",
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  // 로딩 상태 표시 (현재 주석처리)
  // if (isLoading) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color="#8A2BE2" />
  //         <Text style={styles.loadingText}>제품 정보를 불러오는 중...</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
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

          {/* 모구장 전용: 모구러 관리 섹션 */}
          {isHost && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people" size={20} color="#8A2BE2" />
                <Text style={styles.sectionTitle}>모구러 관리</Text>
                <View style={styles.managementBadges}>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>
                      대기중 {participantRequests.filter(r => r.status === 'pending').length}
                    </Text>
                  </View>
                  <View style={styles.approvedBadge}>
                    <Text style={styles.approvedBadgeText}>
                      승인 {participantRequests.filter(r => r.status === 'approved').length}
                    </Text>
                  </View>
                </View>
              </View>

              {participantRequests.length > 0 ? (
                participantRequests.map((request) => (
                  <View key={request.id} style={styles.participantItem}>
                    <View style={styles.participantInfo}>
                      <View style={styles.participantAvatar}>
                        <Ionicons name="person" size={20} color="#8A2BE2" />
                      </View>
                      <View style={styles.participantDetails}>
                        <View style={styles.participantNameRow}>
                          <Text style={styles.participantName}>{request.userName}</Text>
                          {request.status === 'pending' && (
                            <View style={styles.pendingStatusBadge}>
                              <Text style={styles.pendingStatusText}>대기중</Text>
                            </View>
                          )}
                          {request.status === 'approved' && (
                            <View style={styles.approvedStatusBadge}>
                              <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                              <Text style={styles.approvedStatusText}>승인됨</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.requestTime}>{request.requestedAt} 신청</Text>
                        
                        {/* 신뢰도 점수 */}
                        <View style={styles.reliabilityRow}>
                          <View style={styles.reliabilityBar}>
                            <View 
                              style={[
                                styles.reliabilityFill, 
                                { 
                                  width: `${request.participationHistory.reliabilityScore}%`,
                                  backgroundColor: 
                                    request.participationHistory.reliabilityScore >= 90 ? '#4CAF50' :
                                    request.participationHistory.reliabilityScore >= 70 ? '#FF9800' :
                                    '#f44336'
                                }
                              ]} 
                            />
                          </View>
                          <Text style={styles.reliabilityScore}>
                            {request.participationHistory.reliabilityScore}점
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* 액션 버튼 */}
                    <View style={styles.participantActions}>
                      <TouchableOpacity 
                        style={styles.historyButton}
                        onPress={() => handleShowHistory(request)}
                      >
                        <Ionicons name="document-text-outline" size={16} color="#666" />
                        <Text style={styles.historyButtonText}>히스토리</Text>
                      </TouchableOpacity>
                      
                      {request.status === 'pending' && (
                        <>
                          <TouchableOpacity 
                            style={styles.approveButton}
                            onPress={() => handleApproveParticipant(request)}
                          >
                            <Ionicons name="checkmark" size={16} color="#fff" />
                            <Text style={styles.approveButtonText}>승인</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.rejectButton}
                            onPress={() => handleRejectParticipant(request)}
                          >
                            <Ionicons name="close" size={16} color="#fff" />
                            <Text style={styles.rejectButtonText}>거절</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      
                      {request.status === 'approved' && (
                        <TouchableOpacity 
                          style={styles.kickButton}
                          onPress={() => handleKickParticipant(request)}
                        >
                          <Ionicons name="exit-outline" size={16} color="#fff" />
                          <Text style={styles.kickButtonText}>추방</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyParticipants}>
                  <Ionicons name="people-outline" size={40} color="#ccc" />
                  <Text style={styles.emptyParticipantsText}>아직 신청한 모구러가 없습니다.</Text>
                </View>
              )}
            </View>
          )}

          {/* 댓글 섹션 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubbles" size={20} color="#8A2BE2" />
              <Text style={styles.sectionTitle}>모구 대화</Text>
              <Text style={styles.commentCount}>({comments.length})</Text>
            </View>

            {/* 댓글 목록 */}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentUserInfo}>
                      <View style={styles.commentAvatar}>
                        <Ionicons name="person" size={16} color="#8A2BE2" />
                      </View>
                      <View>
                        <View style={styles.commentNameRow}>
                          <Text style={styles.commentUserName}>{comment.userName}</Text>
                          {comment.userRole === "host" && (
                            <View style={styles.hostBadge}>
                              <Ionicons name="star" size={10} color="#fff" />
                              <Text style={styles.hostBadgeText}>모구장</Text>
                            </View>
                          )}
                          {comment.userRole === "participant" && (
                            <View style={styles.participantBadge}>
                              <Text style={styles.participantBadgeText}>모구러</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.commentTime}>{comment.createdAt}</Text>
                      </View>
                    </View>
                    {/* 자기가 쓴 댓글일 경우 삭제 버튼 표시 */}
                    {comment.userId === currentUserId && (
                      <TouchableOpacity
                        style={styles.commentDeleteButton}
                        onPress={() => handleDeleteComment(comment.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#999" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyComments}>
                <Ionicons name="chatbubble-outline" size={40} color="#ccc" />
                <Text style={styles.emptyCommentsText}>아직 댓글이 없습니다.</Text>
                <Text style={styles.emptyCommentsSubText}>첫 댓글을 남겨보세요!</Text>
              </View>
            )}

            {/* 댓글 입력 */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="댓글을 입력하세요..."
                placeholderTextColor="#999"
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={200}
              />
              <TouchableOpacity 
                style={styles.commentSendButton} 
                onPress={handleSendComment}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
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
              • 금액은 모구장 포함 1/n으로 책정됩니다.{'\n'}
              • 인원 미충족 시 모구장이 나머지 수량과 금액을 부담합니다.
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

      {/* 댓글 삭제 모달 */}
      <Modal
        visible={showDeleteCommentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteCommentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.compactModalContent}>
            <View style={styles.compactModalHeader}>
              <Ionicons name="trash" size={50} color="#f44336" />
            </View>
            <Text style={styles.compactModalTitle}>댓글을 삭제하시겠습니까?</Text>
            <Text style={styles.compactModalSubText}>삭제된 댓글은 복구할 수 없습니다.</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.compactModalButton, styles.cancelModalButton]}
                onPress={() => setShowDeleteCommentModal(false)}
              >
                <Text style={[styles.compactModalButtonText, styles.cancelModalButtonText]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.compactModalButton, styles.confirmDeleteButton]}
                onPress={confirmDeleteComment}
              >
                <Text style={styles.compactModalButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 모구러 승인 모달 */}
      <Modal
        visible={showApproveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowApproveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.compactModalContent}>
            <View style={styles.compactModalHeader}>
              <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            </View>
            <Text style={styles.compactModalTitle}>
              {selectedParticipantForAction?.userName}님을 승인하시겠습니까?
            </Text>
            {selectedParticipantForAction && (
              <View style={styles.modalInfoBox}>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.modalInfoText}>
                    신뢰도: {selectedParticipantForAction.participationHistory.reliabilityScore}점
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  <Text style={styles.modalInfoText}>
                    완료: {selectedParticipantForAction.participationHistory.completedParticipations}회
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.compactModalButton, styles.cancelModalButton]}
                onPress={() => setShowApproveModal(false)}
              >
                <Text style={[styles.compactModalButtonText, styles.cancelModalButtonText]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.compactModalButton, styles.confirmApproveButton]}
                onPress={confirmApproveParticipant}
              >
                <Text style={styles.compactModalButtonText}>승인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 모구러 거절 모달 */}
      <Modal
        visible={showRejectModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.compactModalContent}>
            <View style={styles.compactModalHeader}>
              <Ionicons name="close-circle" size={50} color="#f44336" />
            </View>
            <Text style={styles.compactModalTitle}>
              {selectedParticipantForAction?.userName}님의 신청을 거절하시겠습니까?
            </Text>
            <Text style={styles.compactModalSubText}>거절된 신청은 복구할 수 없습니다.</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.compactModalButton, styles.cancelModalButton]}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={[styles.compactModalButtonText, styles.cancelModalButtonText]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.compactModalButton, styles.confirmRejectButton]}
                onPress={confirmRejectParticipant}
              >
                <Text style={styles.compactModalButtonText}>거절</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 모구러 추방 모달 */}
      <Modal
        visible={showKickModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowKickModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.compactModalContent}>
            <View style={styles.compactModalHeader}>
              <Ionicons name="warning" size={50} color="#FF9800" />
            </View>
            <Text style={styles.compactModalTitle}>
              {selectedParticipantForAction?.userName}님을 추방하시겠습니까?
            </Text>
            <Text style={styles.compactModalSubText}>추방된 모구러는 다시 참여할 수 없습니다.</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.compactModalButton, styles.cancelModalButton]}
                onPress={() => setShowKickModal(false)}
              >
                <Text style={[styles.compactModalButtonText, styles.cancelModalButtonText]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.compactModalButton, styles.confirmKickButton]}
                onPress={confirmKickParticipant}
              >
                <Text style={styles.compactModalButtonText}>추방</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 모구러 히스토리 모달 */}
      <Modal
        visible={showHistoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.historyModalContent}>
            {/* 헤더 */}
            <View style={styles.historyModalHeader}>
              <Text style={styles.historyModalTitle}>모구러 히스토리</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedParticipant && (
              <ScrollView style={styles.historyModalBody}>
                {/* 사용자 정보 */}
                <View style={styles.historyUserInfo}>
                  <View style={styles.historyAvatar}>
                    <Ionicons name="person" size={32} color="#8A2BE2" />
                  </View>
                  <Text style={styles.historyUserName}>{selectedParticipant.userName}</Text>
                </View>

                {/* 신뢰도 점수 */}
                <View style={styles.historyScoreCard}>
                  <View style={styles.historyScoreHeader}>
                    <Ionicons name="star" size={24} color="#FFD700" />
                    <Text style={styles.historyScoreTitle}>신뢰도 점수</Text>
                  </View>
                  <Text style={styles.historyScoreValue}>
                    {selectedParticipant.participationHistory.reliabilityScore}점
                  </Text>
                  <View style={styles.historyScoreBar}>
                    <View 
                      style={[
                        styles.historyScoreFill,
                        {
                          width: `${selectedParticipant.participationHistory.reliabilityScore}%`,
                          backgroundColor: 
                            selectedParticipant.participationHistory.reliabilityScore >= 90 ? '#4CAF50' :
                            selectedParticipant.participationHistory.reliabilityScore >= 70 ? '#FF9800' :
                            '#f44336'
                        }
                      ]}
                    />
                  </View>
                </View>

                {/* 참여 통계 */}
                <View style={styles.historyStatsCard}>
                  <Text style={styles.historyStatsTitle}>참여 통계</Text>
                  
                  <View style={styles.historyStatRow}>
                    <View style={styles.historyStatItem}>
                      <Ionicons name="list" size={20} color="#8A2BE2" />
                      <Text style={styles.historyStatLabel}>총 참여</Text>
                      <Text style={styles.historyStatValue}>
                        {selectedParticipant.participationHistory.totalParticipations}회
                      </Text>
                    </View>
                    <View style={styles.historyStatDivider} />
                    <View style={styles.historyStatItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      <Text style={styles.historyStatLabel}>완료</Text>
                      <Text style={styles.historyStatValue}>
                        {selectedParticipant.participationHistory.completedParticipations}회
                      </Text>
                    </View>
                    <View style={styles.historyStatDivider} />
                    <View style={styles.historyStatItem}>
                      <Ionicons name="close-circle" size={20} color="#f44336" />
                      <Text style={styles.historyStatLabel}>취소</Text>
                      <Text style={styles.historyStatValue}>
                        {selectedParticipant.participationHistory.canceledParticipations}회
                      </Text>
                    </View>
                  </View>

                  {/* 완료율 */}
                  <View style={styles.historyCompletionRate}>
                    <Text style={styles.historyCompletionLabel}>완료율</Text>
                    <Text style={styles.historyCompletionValue}>
                      {Math.round((selectedParticipant.participationHistory.completedParticipations / 
                        selectedParticipant.participationHistory.totalParticipations) * 100)}%
                    </Text>
                  </View>
                </View>

                {/* 평가 안내 */}
                <View style={styles.historyNotice}>
                  <Ionicons name="information-circle" size={20} color="#8A2BE2" />
                  <Text style={styles.historyNoticeText}>
                    모구 완료 후 상호 평가를 통해 신뢰도가 결정됩니다.
                  </Text>
                </View>
              </ScrollView>
            )}

            {/* 닫기 버튼 */}
            <TouchableOpacity 
              style={styles.historyCloseButton}
              onPress={() => setShowHistoryModal(false)}
            >
              <Text style={styles.historyCloseButtonText}>닫기</Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
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
    padding: 30,
    alignItems: "center",
    minWidth: 280,
    maxWidth: "75%",
    marginHorizontal: 20,
  },
  compactModalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    width: 300,
    maxWidth: "85%",
  },
  modalHeader: {
    marginBottom: 20,
  },
  compactModalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  compactModalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  compactModalSubText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#8A2BE2",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    minWidth: 120,
  },
  compactModalButton: {
    backgroundColor: "#8A2BE2",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  compactModalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
    marginTop: 10,
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
  confirmApproveButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
  },
  confirmRejectButton: {
    backgroundColor: "#f44336",
    flex: 1,
  },
  confirmKickButton: {
    backgroundColor: "#FF9800",
    flex: 1,
  },
  confirmDeleteButton: {
    backgroundColor: "#f44336",
    flex: 1,
  },
  modalSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalInfoBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    width: "100%",
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  modalInfoText: {
    fontSize: 13,
    color: "#333",
  },
  // 댓글 관련 스타일
  commentCount: {
    fontSize: 14,
    color: "#8A2BE2",
    fontWeight: "600",
    marginLeft: "auto",
  },
  commentItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  commentUserInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  commentNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 6,
  },
  hostBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8A2BE2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  hostBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 2,
  },
  participantBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  participantBadgeText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "600",
  },
  commentTime: {
    fontSize: 11,
    color: "#999",
  },
  commentContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginLeft: 46,
  },
  commentDeleteButton: {
    padding: 4,
  },
  emptyComments: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyCommentsText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
  },
  emptyCommentsSubText: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: "#f3e5f5",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    maxHeight: 80,
    marginRight: 8,
  },
  commentSendButton: {
    backgroundColor: "#8A2BE2",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8A2BE2",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  // 모구러 관리 섹션 스타일
  managementBadges: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 8,
  },
  pendingBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadgeText: {
    fontSize: 11,
    color: "#FF9800",
    fontWeight: "600",
  },
  approvedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvedBadgeText: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
  },
  participantItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  participantInfo: {
    flexDirection: "row",
    marginBottom: 12,
  },
  participantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  participantDetails: {
    flex: 1,
  },
  participantNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  participantName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  pendingStatusBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pendingStatusText: {
    fontSize: 10,
    color: "#FF9800",
    fontWeight: "600",
  },
  approvedStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  approvedStatusText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "600",
  },
  requestTime: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  reliabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reliabilityBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  reliabilityFill: {
    height: "100%",
    borderRadius: 4,
  },
  reliabilityScore: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    minWidth: 35,
  },
  participantActions: {
    flexDirection: "row",
    gap: 8,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  historyButtonText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  approveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  approveButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
  },
  rejectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  rejectButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
  },
  kickButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#666",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
    marginLeft: "auto",
  },
  kickButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
  },
  emptyParticipants: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyParticipantsText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
  },
  // 히스토리 모달 스타일
  historyModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 20,
    maxHeight: "90%",
    width: "100%",
    marginTop: "auto",
  },
  historyModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  historyModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  historyModalBody: {
    paddingHorizontal: 24,
  },
  historyUserInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  historyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  historyUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  historyScoreCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  historyScoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  historyScoreTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  historyScoreValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8A2BE2",
    marginBottom: 12,
  },
  historyScoreBar: {
    width: "100%",
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
  },
  historyScoreFill: {
    height: "100%",
    borderRadius: 6,
  },
  historyStatsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  historyStatsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  historyStatRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  historyStatItem: {
    flex: 1,
    alignItems: "center",
  },
  historyStatDivider: {
    width: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
  },
  historyStatLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginBottom: 4,
  },
  historyStatValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  historyCompletionRate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    padding: 12,
    borderRadius: 8,
  },
  historyCompletionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8A2BE2",
  },
  historyCompletionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8A2BE2",
  },
  historyNotice: {
    flexDirection: "row",
    backgroundColor: "#F3E5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 80,
    gap: 12,
  },
  historyNoticeText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  historyCloseButton: {
    backgroundColor: "#8A2BE2",
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#8A2BE2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  historyCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

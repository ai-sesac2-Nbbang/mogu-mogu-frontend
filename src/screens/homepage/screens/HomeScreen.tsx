// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons"; 
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from "../../../types/navigation";
import axios from "axios";
import ConfirmationModal from "../../../components/mypage/ConfirmationModal";

// 네비게이션 타입 정의
type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<HomeStackParamList, 'Home'>;

interface Product {
  id: number;
  name: string;
  price: string;
  participants: string;
  image: any;
  createdAt: Date; // 최신순 정렬용
  distance: number; // 거리순 정렬용 (km)
  aiScore: number; // AI 추천 점수
}

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = useState("AI 추천");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("우리집");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // 'grid' 또는 'list'
  
  // 기본 상품 데이터 (정렬 전)
  const baseProducts: Product[] = [
    { 
      id: 1, 
      name: "물티슈 10롤", 
      price: "9,170원", 
      participants: "1/3", 
      image: require("../../../../assets/products/tissue.png"),
      createdAt: new Date(2025, 9, 5, 14, 30), // 2일 전
      distance: 0.5,
      aiScore: 95
    },
    { 
      id: 2, 
      name: "2080 칫솔 10개", 
      price: "6,420원", 
      participants: "0/2", 
      image: require("../../../../assets/products/toothbrush.png"),
      createdAt: new Date(2025, 9, 6, 9, 15), // 1일 전
      distance: 1.2,
      aiScore: 88
    },
    { 
      id: 3, 
      name: "도브 샴푸 리필", 
      price: "5,250원", 
      participants: "5/6", 
      image: require("../../../../assets/products/shampoo.png"),
      createdAt: new Date(2025, 9, 6, 18, 45), // 오늘
      distance: 0.3,
      aiScore: 92
    },
    { 
      id: 4, 
      name: "무항생제 계란 30구", 
      price: "7,900원", 
      participants: "2/4", 
      image: require("../../../../assets/products/eggs.png"),
      createdAt: new Date(2025, 9, 6, 20, 10), // 오늘
      distance: 2.1,
      aiScore: 78
    },
    { 
      id: 5, 
      name: "삼다수 생수 2L 6병", 
      price: "4,500원", 
      participants: "3/5", 
      image: require("../../../../assets/products/tissue.png"),
      createdAt: new Date(2025, 9, 4, 16, 20), // 3일 전
      distance: 0.8,
      aiScore: 85
    },
    { 
      id: 6, 
      name: "프리미엄 휴지 30롤", 
      price: "12,800원", 
      participants: "1/2", 
      image: require("../../../../assets/products/tissue.png"),
      createdAt: new Date(2025, 9, 6, 21, 30), // 오늘
      distance: 1.5,
      aiScore: 90
    },
    { 
      id: 7, 
      name: "주방세제 3개 세트", 
      price: "8,900원", 
      participants: "4/5", 
      image: require("../../../../assets/products/shampoo.png"),
      createdAt: new Date(2025, 9, 5, 10, 0), // 2일 전
      distance: 0.6,
      aiScore: 82
    },
    { 
      id: 8, 
      name: "고급 칫솔 세트 20개", 
      price: "11,500원", 
      participants: "2/3", 
      image: require("../../../../assets/products/toothbrush.png"),
      createdAt: new Date(2025, 9, 6, 22, 0), // 오늘
      distance: 3.2,
      aiScore: 75
    },
    { 
      id: 9, 
      name: "헤어케어 샴푸 1L", 
      price: "9,900원", 
      participants: "3/4", 
      image: require("../../../../assets/products/shampoo.png"),
      createdAt: new Date(2025, 9, 6, 15, 40), // 오늘
      distance: 1.8,
      aiScore: 87
    },
  ];

  const [products, setProducts] = useState<Product[]>(baseProducts);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();

  // 데이터베이스에서 상품 목록 가져오기 (주석 처리됨)
  /*
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products', {
        params: {
          filter: selectedFilter,
          address: selectedAddress,
        },
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
      
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 또는 필터/주소 변경 시 상품 목록 로드
  useEffect(() => {
    fetchProducts();
  }, [selectedFilter, selectedAddress]);
  */

  // 필터에 따라 상품 정렬
  useEffect(() => {
    const sortProducts = () => {
      const sorted = [...baseProducts];
      
      switch (selectedFilter) {
        case "AI 추천":
          // AI 점수 높은 순으로 정렬
          sorted.sort((a, b) => b.aiScore - a.aiScore);
          break;
        case "최신순":
          // 등록일 최신순으로 정렬
          sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case "거리순":
          // 거리 가까운 순으로 정렬
          sorted.sort((a, b) => a.distance - b.distance);
          break;
        default:
          break;
      }
      
      setProducts(sorted);
    };
    
    sortProducts();
  }, [selectedFilter]);

  useEffect(() => {
    if (route.params?.selectedAddress) {
      // 주소가 선택되면 상태 업데이트
      setSelectedAddress(route.params.addressLabel || route.params.selectedAddress);
    }
  }, [route.params]);

  const toggleLike = (id: number) => {
    // 이미 좋아요가 되어 있는 경우 (해제하려는 경우)
    if (likedItems.includes(id)) {
      setSelectedProductId(id);
      setIsModalVisible(true);
      return;
    }
    
    // 좋아요 추가
    setLikedItems((prev) => [...prev, id]);
  };

  // 좋아요 해제 확인
  const confirmRemoveLike = () => {
    if (selectedProductId !== null) {
      setLikedItems((prev) => prev.filter((item) => item !== selectedProductId));
    }
    setIsModalVisible(false);
    setSelectedProductId(null);
  };

  // 가격을 1/n으로 계산 (모구장 제외)
  const calculatePricePerPerson = (priceString: string, participants: string) => {
    // "9,170원" -> 9170
    const price = parseInt(priceString.replace(/,/g, '').replace('원', ''));
    
    // "1/3" -> 전체 인원 3명
    const totalCount = parseInt(participants.split('/')[1]);
    
    // 모구장 제외한 인원으로 나눔 (n-1)
    const pricePerPerson = Math.round(price / (totalCount - 1));
    
    // 숫자를 천 단위 콤마로 포맷팅
    return pricePerPerson.toLocaleString() + '원';
  };

  // 참여율 계산
  const getParticipationRate = (participants: string) => {
    const [current, total] = participants.split('/').map(Number);
    return (current / total) * 100;
  };

  // 그리드 뷰 렌더링
  const renderGridItem = ({ item, index }: { item: Product; index: number }) => {
    const participationRate = getParticipationRate(item.participants);
    const [current, total] = item.participants.split('/').map(Number);
    
    return (
      <TouchableOpacity 
        style={[
          styles.productCard,
          index % 2 === 0 ? styles.productCardLeft : styles.productCardRight
        ]}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        activeOpacity={0.7}
      >
        {/* 이미지 컨테이너 */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.productImage} />
          
          {/* 하트 버튼 */}
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleLike(item.id);
            }}
          >
            <Ionicons
              name={likedItems.includes(item.id) ? "heart" : "heart-outline"}
              size={18}
              color={likedItems.includes(item.id) ? "#FF69B4" : "#fff"}
            />
          </TouchableOpacity>
        </View>
        
        {/* 상품 정보 */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>{calculatePricePerPerson(item.price, item.participants)}</Text>
            <Text style={styles.originalPrice}>{item.price}</Text>
          </View>
          
          {/* 하단 정보 */}
          <View style={styles.bottomInfo}>
            <View style={styles.participantsTag}>
              <Ionicons name="people" size={11} color="#8A2BE2" />
              <Text style={styles.participantsText}>{item.participants}</Text>
            </View>
            <View style={styles.distanceTag}>
              <Ionicons name="location" size={11} color="#666" />
              <Text style={styles.distanceText}>{item.distance}km</Text>
            </View>
          </View>
          
          {/* 참여율 바 */}
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${participationRate}%` }
              ]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 리스트 뷰 렌더링
  const renderListItem = ({ item }: { item: Product }) => {
    const participationRate = getParticipationRate(item.participants);
    const [current, total] = item.participants.split('/').map(Number);
    
    return (
    <TouchableOpacity 
        style={styles.listCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        activeOpacity={0.7}
      >
        <Image source={item.image} style={styles.listImage} />
        
        <View style={styles.listInfo}>
          <Text style={styles.listName} numberOfLines={2}>{item.name}</Text>
          
          <View style={styles.listPriceRow}>
            <Text style={styles.listPrice}>{calculatePricePerPerson(item.price, item.participants)}</Text>
            <Text style={styles.listOriginalPrice}>{item.price}</Text>
          </View>
          
          <View style={styles.listBottomRow}>
            <View style={styles.listParticipantsTag}>
              <Ionicons name="people" size={12} color="#8A2BE2" />
              <Text style={styles.listParticipantsText}>{item.participants}</Text>
            </View>
            <View style={styles.listDistanceTag}>
              <Ionicons name="location" size={12} color="#666" />
              <Text style={styles.listDistanceText}>{item.distance}km</Text>
            </View>
          </View>
          
          <View style={styles.listProgressBar}>
            <View 
              style={[
                styles.listProgressFill, 
                { width: `${participationRate}%` }
              ]} 
            />
          </View>
      </View>

        <TouchableOpacity 
          style={styles.listHeartButton}
          onPress={(e) => {
        e.stopPropagation();
        toggleLike(item.id);
          }}
        >
        <Ionicons
          name={likedItems.includes(item.id) ? "heart" : "heart-outline"}
          size={22}
            color={likedItems.includes(item.id) ? "#FF69B4" : "#ccc"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  };

  return (
    <View style={styles.container}>
      {/* 🔹 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Address')}
          style={styles.addressButton}
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={19} color="#666" />
          <Text style={styles.location}>{selectedAddress}</Text>
          <Ionicons name="chevron-down" size={17} color="#666" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 필터 버튼 */}
      <View style={styles.filterRow}>
        <View style={styles.filterButtons}>
        {["AI 추천", "최신순", "거리순"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterBtn,
              selectedFilter === filter && styles.filterBtnActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
        </View>
        
        {/* 뷰 모드 전환 버튼 */}
        <TouchableOpacity 
          style={styles.viewModeButton}
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          <Ionicons 
            name={viewMode === 'grid' ? "list" : "grid"} 
            size={22} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      {/* 🔹 상품 리스트 */}
      {viewMode === 'grid' ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGridItem}
          numColumns={2}
          key="grid"
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 12, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      ) : (
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
          renderItem={renderListItem}
          key="list"
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 15, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 🔹 플로팅 버튼 */}
      <TouchableOpacity 
        style={styles.floatingBtn}
        onPress={() => navigation.navigate('ProductAdd')}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.floatingBtnText}>모구하기</Text>
      </TouchableOpacity>

      {/* 관심 목록 해제 확인 모달 */}
      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedProductId(null);
        }}
        onConfirm={confirmRemoveLike}
        title="관심 목록 해제"
        message="이 상품을 관심 목록에서 제거하시겠습니까?"
        confirmText="해제"
        cancelText="취소"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f8f8" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  addressButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  location: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#333",
    marginHorizontal: 6,
  },
  headerIcons: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 25 
  },
  filterRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewModeButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterBtn: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },
  filterBtnActive: { 
    backgroundColor: "#8A2BE2",
    borderColor: "#8A2BE2",
  },
  filterText: { 
    fontSize: 13, 
    color: "#666",
    fontWeight: "600",
  },
  filterTextActive: { 
    color: "#fff", 
    fontWeight: "700" 
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    width: '48%',
    overflow: 'hidden',
  },
  productCardLeft: {
    marginRight: 5,
  },
  productCardRight: {
    marginLeft: 5,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  productImage: { 
    width: "100%",
    height: 120,
    backgroundColor: "#f5f5f5",
  },
  productInfo: { 
    padding: 10,
  },
  productName: { 
    fontSize: 13, 
    fontWeight: "600", 
    marginBottom: 0,
    color: "#333",
    lineHeight: 16,
    height:20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  productPrice: { 
    fontSize: 15, 
    color: "#8A2BE2",
    fontWeight: "bold",
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 11,
    color: "#999",
    textDecorationLine: "line-through",
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  participantsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  participantsText: {
    fontSize: 10,
    color: "#8A2BE2",
    fontWeight: "600",
    marginLeft: 3,
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 10,
    color: "#666",
    marginLeft: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: "#f0f0f0",
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8A2BE2",
    borderRadius: 1.5,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  floatingBtn: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#8A2BE2",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 25,
    elevation: 8,
    shadowColor: "#8A2BE2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  floatingBtnText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  // 리스트 뷰 스타일
  listCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    lineHeight: 18,
    marginBottom: 4,
  },
  listPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  listPrice: {
    fontSize: 17,
    color: "#8A2BE2",
    fontWeight: "bold",
    marginRight: 6,
  },
  listOriginalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  listBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  listParticipantsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  listParticipantsText: {
    fontSize: 11,
    color: "#8A2BE2",
    fontWeight: "600",
    marginLeft: 3,
  },
  listDistanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listDistanceText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 3,
  },
  listProgressBar: {
    height: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    overflow: "hidden",
  },
  listProgressFill: {
    height: "100%",
    backgroundColor: "#8A2BE2",
    borderRadius: 2,
  },
  listHeartButton: {
    padding: 8,
  },
});

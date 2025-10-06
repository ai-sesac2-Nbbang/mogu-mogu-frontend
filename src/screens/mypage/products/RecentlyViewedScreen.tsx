import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// 상품 타입 정의
interface Product {
  id: string;
  name: string;
  price: string;
  participants: string;
  image: any;
  isLiked: boolean;
  viewedAt: string; // 조회 시간
}

const RecentlyViewedScreen = () => {
  const navigation = useNavigation();
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  // TODO: DB에서 최근 본 글 불러오기
  /*
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const response = await axios.get('/api/user/recently-viewed', {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setRecentProducts(response.data.products);
        }
      } catch (error) {
        console.error('최근 본 글 조회 실패:', error);
      }
    };
    
    fetchRecentlyViewed();
  }, []);
  */

  // 더미 데이터 (최근 본 상품들 - 좋아요 표시된 것과 안 된 것 섞여있음)
  useEffect(() => {
    const dummyRecentProducts: Product[] = [
      { 
        id: "1", 
        name: "프리미엄 롤화장지 10롤 구매하실 분?", 
        price: "9,170원", 
        participants: "1/3", 
        image: require("../../../../assets/products/tissue.png"),
        isLiked: true, // 좋아요 표시됨
        viewedAt: "5분 전"
      },
      { 
        id: "5", 
        name: "유기농 바나나 1kg 구매하실 분?", 
        price: "3,500원", 
        participants: "2/3", 
        image: require("../../../../assets/products/eggs.png"),
        isLiked: false, // 좋아요 안 됨
        viewedAt: "1시간 전"
      },
      { 
        id: "2", 
        name: "삼다수 생수 2L 6병 묶음 구매하실 분?", 
        price: "4,590원", 
        participants: "1/2", 
        image: require("../../../../assets/products/shampoo.png"),
        isLiked: true, // 좋아요 표시됨
        viewedAt: "2시간 전"
      },
      { 
        id: "6", 
        name: "주방세제 3개 세트 구매하실 분?", 
        price: "6,200원", 
        participants: "1/4", 
        image: require("../../../../assets/products/toothbrush.png"),
        isLiked: false, // 좋아요 안 됨
        viewedAt: "3시간 전"
      },
      { 
        id: "3", 
        name: "무항생제 신선 계란 10구 구매하실 분?", 
        price: "2,800원", 
        participants: "1/3", 
        image: require("../../../../assets/products/eggs.png"),
        isLiked: true, // 좋아요 표시됨
        viewedAt: "5시간 전"
      },
      { 
        id: "7", 
        name: "고급 수건 세트 구매하실 분?", 
        price: "8,900원", 
        participants: "2/3", 
        image: require("../../../../assets/products/tissue.png"),
        isLiked: false, // 좋아요 안 됨
        viewedAt: "어제"
      },
    ];
    
    setRecentProducts(dummyRecentProducts);
  }, []);

  // 좋아요 토글 핸들러
  const handleToggleLike = async (productId: string) => {
    // TODO: API 호출하여 서버에 좋아요 상태 업데이트
    /*
    try {
      await axios.post(`/api/products/${productId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    }
    */

    // 로컬 상태 업데이트
    setRecentProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, isLiked: !product.isLiked }
          : product
      )
    );
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

  // 상품 렌더링
  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => {
        // 상품 상세 페이지로 이동
        (navigation as any).navigate('ProductDetail', { productId: item.id });
      }}
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>{calculatePricePerPerson(item.price, item.participants)}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.participantsContainer}>
            <Ionicons name="people" size={16} color="#666" />
            <Text style={styles.participantsText}>모구러 {item.participants}</Text>
          </View>
          <Text style={styles.viewedTime}>{item.viewedAt}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.likeButton}
        onPress={(e) => {
          e.stopPropagation(); // 상품 클릭 이벤트 방지
          handleToggleLike(item.id);
        }}
      >
        <Ionicons 
          name={item.isLiked ? "heart" : "heart-outline"}
          size={24} 
          color={item.isLiked ? "#FF69B4" : "#999"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>최근 본 글</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 최근 본 글 목록 */}
      {recentProducts.length > 0 ? (
        <FlatList
          data={recentProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>최근 본 글이 없습니다</Text>
          <Text style={styles.emptySubText}>상품을 둘러보고 관심 있는 상품을 찾아보세요!</Text>
        </View>
      )}
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
  listContent: {
    paddingTop: 50 + 15 + 15,
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  viewedTime: {
    fontSize: 12,
    color: '#999',
  },
  likeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default RecentlyViewedScreen;
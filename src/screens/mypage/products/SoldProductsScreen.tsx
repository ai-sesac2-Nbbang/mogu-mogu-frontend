import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// 판매 상품 타입 정의
interface SoldProduct {
  id: string;
  name: string;
  price: string;
  participants: string;
  image: any;
  status: 'completed' | 'in_progress' | 'cancelled'; // 거래 상태
  soldDate: string;
  totalEarnings: string; // 총 수익
}

const SoldProductsScreen = () => {
  const navigation = useNavigation();
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'completed' | 'in_progress'>('all');

  // TODO: DB에서 판매한 상품 불러오기
  /*
  useEffect(() => {
    const fetchSoldProducts = async () => {
      try {
        const response = await axios.get('/api/user/sold-products', {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setSoldProducts(response.data.products);
        }
      } catch (error) {
        console.error('판매한 상품 조회 실패:', error);
      }
    };
    
    fetchSoldProducts();
  }, []);
  */

  // 더미 데이터 (판매한 상품들)
  useEffect(() => {
    const dummySoldProducts: SoldProduct[] = [
      { 
        id: "1", 
        name: "프리미엄 롤화장지 10롤 구매하실 분?", 
        price: "9,170원", 
        participants: "3/3", 
        image: require("../../../../assets/products/tissue.png"),
        status: 'completed',
        soldDate: "2025.10.03",
        totalEarnings: "27,510원"
      },
      { 
        id: "2", 
        name: "삼다수 생수 2L 6병 묶음 구매하실 분?", 
        price: "4,590원", 
        participants: "2/2", 
        image: require("../../../../assets/products/shampoo.png"),
        status: 'completed',
        soldDate: "2025.10.02",
        totalEarnings: "9,180원"
      },
      { 
        id: "3", 
        name: "무항생제 신선 계란 10구 구매하실 분?", 
        price: "2,800원", 
        participants: "2/3", 
        image: require("../../../../assets/products/eggs.png"),
        status: 'in_progress',
        soldDate: "진행 중",
        totalEarnings: "5,600원"
      },
      { 
        id: "4", 
        name: "칫솔 5개입 세트 구매하실 분?", 
        price: "7,500원", 
        participants: "4/4", 
        image: require("../../../../assets/products/toothbrush.png"),
        status: 'completed',
        soldDate: "2025.10.01",
        totalEarnings: "30,000원"
      },
      { 
        id: "5", 
        name: "고급 샴푸 세트 구매하실 분?", 
        price: "5,200원", 
        participants: "1/3", 
        image: require("../../../../assets/products/shampoo.png"),
        status: 'in_progress',
        soldDate: "진행 중",
        totalEarnings: "5,200원"
      },
      { 
        id: "6", 
        name: "주방세제 3개 세트 구매하실 분?", 
        price: "6,200원", 
        participants: "3/3", 
        image: require("../../../../assets/products/tissue.png"),
        status: 'completed',
        soldDate: "2025.09.30",
        totalEarnings: "18,600원"
      },
    ];
    
    setSoldProducts(dummySoldProducts);
  }, []);

  // 필터링된 상품 목록
  const filteredProducts = soldProducts.filter(product => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'completed') return product.status === 'completed';
    if (selectedTab === 'in_progress') return product.status === 'in_progress';
    return true;
  });

  // 총 수익 계산
  const totalEarnings = soldProducts
    .filter(p => p.status === 'completed')
    .reduce((sum, product) => {
      const earnings = parseInt(product.totalEarnings.replace(/[^0-9]/g, ''));
      return sum + earnings;
    }, 0);

  // 상태 배지 렌더링
  const renderStatusBadge = (status: string) => {
    let badgeStyle = styles.statusBadgeCompleted;
    let badgeText = '거래완료';
    let iconName: any = 'checkmark-circle';
    let iconColor = '#4CAF50';

    if (status === 'in_progress') {
      badgeStyle = styles.statusBadgeInProgress;
      badgeText = '진행중';
      iconName = 'time';
      iconColor = '#FF9800';
    } else if (status === 'cancelled') {
      badgeStyle = styles.statusBadgeCancelled;
      badgeText = '취소됨';
      iconName = 'close-circle';
      iconColor = '#F44336';
    }

    return (
      <View style={[styles.statusBadge, badgeStyle]}>
        <Ionicons name={iconName} size={14} color={iconColor} />
        <Text style={[styles.statusText, { color: iconColor }]}>{badgeText}</Text>
      </View>
    );
  };

  // 상품 렌더링
  const renderProduct = ({ item }: { item: SoldProduct }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => {
        // 상품 상세 페이지로 이동
        navigation.navigate('ProductDetail' as never, { productId: item.id } as never);
      }}
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          {renderStatusBadge(item.status)}
        </View>
        <Text style={styles.productPrice}>{item.price} / 인</Text>
        <View style={styles.bottomRow}>
          <View style={styles.participantsContainer}>
            <Ionicons name="people" size={16} color="#666" />
            <Text style={styles.participantsText}>{item.participants}</Text>
          </View>
          <Text style={styles.soldDate}>{item.soldDate}</Text>
        </View>
        {item.status === 'completed' && (
          <View style={styles.earningsContainer}>
            <Text style={styles.earningsLabel}>총 수익: </Text>
            <Text style={styles.earningsAmount}>{item.totalEarnings}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내가 판매한 상품</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 통계 */}
      <View style={styles.statsContainer}>
        <View style={styles.statsBox}>
          <Text style={styles.statsNumber}>{soldProducts.filter(p => p.status === 'completed').length}</Text>
          <Text style={styles.statsLabel}>거래완료</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsBox}>
          <Text style={styles.statsNumber}>{totalEarnings.toLocaleString()}원</Text>
          <Text style={styles.statsLabel}>총 수익</Text>
        </View>
      </View>

      {/* 탭 버튼 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'all' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabButtonText, selectedTab === 'all' && styles.tabButtonTextActive]}>
            전체 ({soldProducts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'completed' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[styles.tabButtonText, selectedTab === 'completed' && styles.tabButtonTextActive]}>
            거래완료 ({soldProducts.filter(p => p.status === 'completed').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'in_progress' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('in_progress')}
        >
          <Text style={[styles.tabButtonText, selectedTab === 'in_progress' && styles.tabButtonTextActive]}>
            진행중 ({soldProducts.filter(p => p.status === 'in_progress').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 상품 목록 */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>판매한 상품이 없습니다</Text>
          <Text style={styles.emptySubText}>상품을 등록하고 모구 거래를 시작해보세요!</Text>
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
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 50 + 15 + 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginHorizontal: 15,
  },
  statsBox: {
    flex: 1,
    alignItems: 'center',
  },
  statsDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#8A2BE2',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  statusBadgeCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgeInProgress: {
    backgroundColor: '#FFF3E0',
  },
  statusBadgeCancelled: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
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
    marginBottom: 8,
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
  soldDate: {
    fontSize: 12,
    color: '#999',
  },
  earningsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6fa',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  earningsLabel: {
    fontSize: 13,
    color: '#666',
  },
  earningsAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A2BE2',
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

export default SoldProductsScreen;
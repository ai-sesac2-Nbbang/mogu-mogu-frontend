import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

// 상품 타입 정의
interface Product {
  id: string;
  name: string;
  price: string;
  participants: string;
  image: any;
  isLiked: boolean;
}

const WishlistScreen = () => {
  const navigation = useNavigation();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [productToRemove, setProductToRemove] = useState<string | null>(null);

  // TODO: DB에서 관심 목록 불러오기
  /*
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get('/api/user/wishlist', {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setWishlistProducts(response.data.products);
        }
      } catch (error) {
        console.error('관심 목록 조회 실패:', error);
      }
    };
    
    fetchWishlist();
  }, []);
  */

  // 더미 데이터 (좋아요 표시된 상품들)
  useEffect(() => {
    const dummyWishlist: Product[] = [
      { 
        id: "1", 
        name: "프리미엄 롤화장지 10롤 구매하실 분?", 
        price: "9,170원", 
        participants: "1/3", 
        image: require("../../assets/products/tissue.png"),
        isLiked: true
      },
      { 
        id: "2", 
        name: "삼다수 생수 2L 6병 묶음 구매하실 분?", 
        price: "4,590원", 
        participants: "1/2", 
        image: require("../../assets/products/shampoo.png"),
        isLiked: true
      },
      { 
        id: "3", 
        name: "무항생제 신선 계란 10구 구매하실 분?", 
        price: "2,800원", 
        participants: "1/3", 
        image: require("../../assets/products/eggs.png"),
        isLiked: true
      },
      { 
        id: "4", 
        name: "칫솔 5개입 세트 구매하실 분?", 
        price: "7,500원", 
        participants: "2/4", 
        image: require("../../assets/products/toothbrush.png"),
        isLiked: true
      },
    ];
    
    setWishlistProducts(dummyWishlist);
  }, []);

  // 좋아요 해제 확인 모달 열기
  const handleToggleLike = (productId: string) => {
    setProductToRemove(productId);
    setIsRemoveModalVisible(true);
  };

  // 좋아요 해제 확정
  const confirmRemoveFromWishlist = async () => {
    if (!productToRemove) return;

    // TODO: API 호출하여 서버에 좋아요 상태 업데이트
    /*
    try {
      await axios.delete(`/api/user/wishlist/${productToRemove}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
    } catch (error) {
      console.error('좋아요 해제 실패:', error);
    }
    */

    // 좋아요 해제 시 목록에서 제거
    setWishlistProducts(prevProducts => 
      prevProducts.filter(product => product.id !== productToRemove)
    );
    
    setIsRemoveModalVisible(false);
    setProductToRemove(null);
  };

  // 상품 렌더링
  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => {
        // 상품 상세 페이지로 이동
        navigation.navigate('ProductDetail' as never, { productId: item.id } as never);
      }}
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <View style={styles.participantsContainer}>
          <Ionicons name="people" size={16} color="#666" />
          <Text style={styles.participantsText}>{item.participants}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.likeButton}
        onPress={() => handleToggleLike(item.id)}
      >
        <Ionicons 
          name="heart" 
          size={24} 
          color="#FF69B4" 
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
        <Text style={styles.headerTitle}>관심 목록</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 관심 목록 */}
      {wishlistProducts.length > 0 ? (
        <FlatList
          data={wishlistProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>관심 목록이 비어있습니다</Text>
          <Text style={styles.emptySubText}>마음에 드는 상품에 하트를 눌러보세요!</Text>
        </View>
      )}

      {/* 좋아요 해제 확인 모달 */}
      <Modal
        visible={isRemoveModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsRemoveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>관심 목록에서 삭제</Text>
            <Text style={styles.modalText}>
              이 상품을 관심 목록에서{'\n'}삭제하시겠습니까?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsRemoveModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmRemoveFromWishlist}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>확인</Text>
              </TouchableOpacity>
            </View>
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
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#666',
    lineHeight: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonConfirm: {
    backgroundColor: '#8A2BE2',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  modalButtonTextConfirm: {
    color: '#fff',
  },
});

export default WishlistScreen;
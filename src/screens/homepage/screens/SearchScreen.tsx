import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../types/navigation';

type SearchScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Search'>;

interface Product {
  id: number;
  name: string;
  price: string;
  participants: string;
  image: any;
  category: string;
}

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['물티슈', '계란', '생수']);
  const [isSearching, setIsSearching] = useState(false);

  // 더미 상품 데이터
  const allProducts: Product[] = [
    { id: 1, name: '프리미엄 롤화장지 10롤', price: '9,170원', participants: '1/3', image: require('../../../../assets/products/tissue.png'), category: '생활용품' },
    { id: 2, name: '2080 칫솔 10개 세트', price: '6,420원', participants: '0/2', image: require('../../../../assets/products/toothbrush.png'), category: '생활용품' },
    { id: 3, name: '도브 샴푸 리필 500ml', price: '5,250원', participants: '5/6', image: require('../../../../assets/products/shampoo.png'), category: '생활용품' },
    { id: 4, name: '무항생제 계란 30구', price: '7,900원', participants: '2/4', image: require('../../../../assets/products/eggs.png'), category: '식품' },
    { id: 5, name: '삼다수 생수 2L 6병', price: '4,500원', participants: '3/5', image: require('../../../../assets/products/tissue.png'), category: '음료' },
  ];

  // 검색 실행
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // TODO: 실제 API 호출로 교체
    /*
    try {
      const response = await axios.get('/api/products/search', {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
      setSearchResults(response.data.products);
    } catch (error) {
      console.error('검색 실패:', error);
    }
    */

    // 더미 데이터 필터링
    const filtered = allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // 검색 제출
  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== '') {
      // 최근 검색어에 추가 (중복 제거)
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)];
        return updated.slice(0, 10); // 최대 10개까지만 저장
      });
      handleSearch(searchQuery);
      Keyboard.dismiss();
    }
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // 최근 검색어 삭제
  const handleRemoveRecentSearch = (query: string) => {
    setRecentSearches(prev => prev.filter(s => s !== query));
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
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>{calculatePricePerPerson(item.price, item.participants)}</Text>
        <View style={styles.participantsContainer}>
          <Ionicons name="people" size={14} color="#666" />
          <Text style={styles.productParticipants}> 모구러 {item.participants}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="찾으시는 상품을 검색해보세요"
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setSearchResults([]);
              setIsSearching(false);
            }}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 검색 결과 또는 최근 검색어 */}
      {isSearching ? (
        // 검색 결과
        searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.resultHeader}>
                <Text style={styles.resultCount}>검색 결과 {searchResults.length}건</Text>
              </View>
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
            <Text style={styles.emptySubText}>다른 검색어를 입력해보세요</Text>
          </View>
        )
      ) : (
        // 최근 검색어
        <View style={styles.recentSearchContainer}>
          <View style={styles.recentSearchHeader}>
            <Text style={styles.recentSearchTitle}>최근 검색어</Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={() => setRecentSearches([])}>
                <Text style={styles.clearAllText}>전체 삭제</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentSearches.length > 0 ? (
            <View style={styles.recentSearchList}>
              {recentSearches.map((search, index) => (
                <View key={index} style={styles.recentSearchItem}>
                  <TouchableOpacity
                    style={styles.recentSearchButton}
                    onPress={() => handleRecentSearchClick(search)}
                  >
                    <Ionicons name="time-outline" size={18} color="#666" />
                    <Text style={styles.recentSearchText}>{search}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemoveRecentSearch(search)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="close" size={18} color="#999" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyRecentContainer}>
              <Text style={styles.emptyRecentText}>최근 검색 내역이 없습니다</Text>
            </View>
          )}

          {/* 인기 검색어 */}
          <View style={styles.popularSearchContainer}>
            <Text style={styles.popularSearchTitle}>인기 검색어</Text>
            <View style={styles.popularSearchGrid}>
              {['물티슈', '계란', '생수', '샴푸', '칫솔', '세제'].map((keyword, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popularSearchTag}
                  onPress={() => handleRecentSearchClick(keyword)}
                >
                  <Text style={styles.popularSearchRank}>{index + 1}</Text>
                  <Text style={styles.popularSearchText}>{keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  resultHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 4,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productParticipants: {
    fontSize: 13,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
  recentSearchContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  recentSearchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  recentSearchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllText: {
    fontSize: 14,
    color: '#999',
  },
  recentSearchList: {
    marginBottom: 30,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  recentSearchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentSearchText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  deleteButton: {
    padding: 5,
  },
  emptyRecentContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyRecentText: {
    fontSize: 14,
    color: '#999',
  },
  popularSearchContainer: {
    marginTop: 10,
  },
  popularSearchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  popularSearchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularSearchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  popularSearchRank: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginRight: 8,
  },
  popularSearchText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SearchScreen;


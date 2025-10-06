// src/screens/AddressScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../types/navigation";
import { useRoute, RouteProp } from "@react-navigation/native";
import * as Location from 'expo-location';

const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY ?? "";

interface Address {
  id: string;
  label?: string;
  detail: string;
}

interface NormalizedAddress {
  address_name: string;
  road_address_name?: string;
}

type AddressScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Address"
>;
type AddressScreenRouteProp = RouteProp<HomeStackParamList, "Address">;

interface Props {
  navigation: AddressScreenNavigationProp;
}

export default function AddressScreen({ navigation }: Props) {
  const route = useRoute<AddressScreenRouteProp>();
  const currentSelected = route.params?.selectedAddress; // ✅ 홈에서 넘어온 현재 선택된 주소

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([
    { id: "1", label: "우리집", detail: "서울 마포구 백범로 31길 21 9층" },
    { id: "2", label: "회사", detail: "서울 마포구 백범로 31길 21 9층" },
  ]);

  // 데이터베이스에서 주소 목록 가져오기 (주석 처리됨)
  /*
  const fetchSavedAddresses = async () => {
    try {
      // API 호출하여 사용자의 저장된 주소 목록을 가져옴
      const response = await axios.get('/api/addresses', {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
      
      if (response.data.success) {
        setSavedAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error('주소 목록 조회 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 주소 목록 로드
  useEffect(() => {
    fetchSavedAddresses();
  }, []);
  */

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NormalizedAddress[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 주소 삭제 함수
  const deleteAddress = (addressId: string) => {
    setSavedAddresses(prev => prev.filter(address => address.id !== addressId));
  };

  // ✅ 주소 검색
  const searchAddress = async (text: string) => {
    setQuery(text);
    setIsSearching(true);

    if (text.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      const res = await axios.get(
        "https://dapi.kakao.com/v2/local/search/address.json",
        {
          params: { query: text },
          headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
        }
      );

      const docs = Array.isArray(res.data?.documents) ? res.data.documents : [];
      const normalized: NormalizedAddress[] = docs.map((d: any) => ({
        address_name: d.address_name,
        road_address_name: d.road_address?.address_name ?? "",
      }));
      setSearchResults(normalized);
    } catch (e: any) {
      console.error("주소 검색 에러:", e.response?.data || e.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 현재 위치 찾기 함수 추가
  const getCurrentLocation = async () => {
    try {
      // 위치 권한 요청
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        return;
      }

      // 현재 위치 가져오기
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 위도/경도로 주소 검색
      const response = await axios.get(
        'https://dapi.kakao.com/v2/local/geo/coord2address.json',
        {
          params: {
            x: longitude,
            y: latitude,
          },
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          },
        }
      );

      if (response.data?.documents?.[0]) {
        const address = response.data.documents[0].address;
        const roadAddress = response.data.documents[0].road_address;
        
        // 도로명 주소가 있으면 도로명 주소를, 없으면 지번 주소를 사용
        const addressText = roadAddress?.address_name || address?.address_name;
        
        if (addressText) {
          // 주소가 이미 저장된 주소 목록에 있는지 확인
          const isAddressExists = savedAddresses.some(
            addr => addr.detail === addressText
          );

          if (!isAddressExists) {
            // 주소가 없으면 자동으로 추가
            const newAddress: Address = {
              id: Date.now().toString(),
              label: "현재 위치",
              detail: addressText,
            };
            setSavedAddresses(prev => [...prev, newAddress]);
          }

          setQuery(addressText);
          // 주소 검색 실행
          searchAddress(addressText);
        }
      }
    } catch (error) {
      console.error('현재 위치 조회 실패:', error);
      alert('현재 위치를 가져오는데 실패했습니다.');
    }
  };

  // ✅ 리스트 렌더링
  const renderItem = ({
    item,
  }: {
    item: Address | NormalizedAddress;
  }) => {
    if ("address_name" in item) {
      return (
        <TouchableOpacity
          style={styles.searchResultItem}
          onPress={() => {
            navigation.navigate("Home", {
              selectedAddress: item.address_name,
            });
          }}
        >
          <Ionicons name="location" size={22} color="#8A2BE2" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.searchResultText}>{item.address_name}</Text>
            {item.road_address_name ? (
              <Text style={styles.roadAddressText}>
                {item.road_address_name}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    } else {
      const isCurrent = currentSelected === item.label || currentSelected === item.detail;
      return (
        <View style={styles.addressItem}>
          <TouchableOpacity
            style={styles.addressContent}
            onPress={() =>
              navigation.navigate("Home", {
                selectedAddress: item.detail,
                addressLabel: item.label,
              })
            }
          >
            <Ionicons
              name={item.label === "우리집" ? "home" : "business"}
              size={22}
              color="#8A2BE2"
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.addressLabel}>
                {item.label}{" "}
                {isCurrent && (
                  <Text style={styles.currentTag}>현재 설정된 주소</Text>
                )}
              </Text>
              <Text style={styles.addressDetail}>{item.detail}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteAddress(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#e91e63" />
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* 타이틀 섹션 */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Ionicons name="location" size={28} color="#8A2BE2" />
          <Text style={styles.title}>주소 설정</Text>
        </View>
        <Text style={styles.subtitle}>배송받을 주소를 선택하거나 추가해주세요</Text>
      </View>

      {/* 검색창 */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#8A2BE2" />
        <TextInput
          placeholder="지번, 도로명, 건물명으로 검색"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={query}
          onChangeText={searchAddress}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => {
            setQuery("");
            setSearchResults([]);
          }}>
            <Ionicons name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* 현재 위치 찾기 */}
      <TouchableOpacity 
        style={styles.locationBtn}
        onPress={getCurrentLocation}
        activeOpacity={0.7}
      >
        <Ionicons name="navigate" size={20} color="#8A2BE2" />
        <Text style={styles.locationBtnText}>현재 위치로 찾기</Text>
      </TouchableOpacity>

      {/* 구분선 */}
      {!query.trim() && savedAddresses.length > 0 && (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>저장된 주소</Text>
          <View style={styles.dividerLine} />
        </View>
      )}

      {/* 주소 리스트 */}
      <FlatList
        data={query.trim() ? searchResults : savedAddresses}
        keyExtractor={(item, index) =>
          "id" in item
            ? (item as Address).id
            : `search-${(item as NormalizedAddress).address_name}-${index}`
        }
        renderItem={renderItem}
        style={{ marginTop: 15 }}
        ListEmptyComponent={
          query.trim() ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#ddd" />
              <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa", 
    padding: 20 
  },
  titleSection: {
    marginBottom: 24,
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 38,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8A2BE2",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    shadowColor: "#8A2BE2",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { 
    marginLeft: 10, 
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  locationBtn: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3E5F5",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E1BEE7",
  },
  locationBtnText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#8A2BE2",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#999",
    fontWeight: "600",
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addressContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addressLabel: { 
    fontSize: 16, 
    fontWeight: "bold",
    color: "#333",
  },
  addressDetail: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 4,
    lineHeight: 20,
  },
  currentTag: {
    fontSize: 11,
    color: "#fff",
    backgroundColor: "#8A2BE2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    overflow: "hidden",
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchResultText: { 
    fontSize: 15, 
    color: "#333",
    fontWeight: "500",
  },
  roadAddressText: { 
    fontSize: 13, 
    color: "#999", 
    marginTop: 4 
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    marginTop: 16,
  },
});

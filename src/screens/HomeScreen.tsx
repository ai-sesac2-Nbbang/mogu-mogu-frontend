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
import { HomeStackParamList } from "../types/navigation";

// 네비게이션 타입 정의
type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<HomeStackParamList, 'Home'>;

interface Product {
  id: number;
  name: string;
  price: string;
  participants: string;
  image: any;
}

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = useState("거리순");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("우리집");
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();

  useEffect(() => {
    if (route.params?.selectedAddress) {
      // 주소가 선택되면 상태 업데이트
      setSelectedAddress(route.params.addressLabel || route.params.selectedAddress);
    }
  }, [route.params]);

  const products = [
    { id: 1, name: "2080 칫솔 10개", price: "6,420원", participants: "0/2", image: require("../../assets/products/toothbrush.png") },
    { id: 2, name: "도브 샴푸 리필", price: "5,250원", participants: "5/6", image: require("../../assets/products/shampoo.png") },
    { id: 3, name: "물화장지 10롤", price: "9,170원", participants: "1/3", image: require("../../assets/products/tissue.png") },
  ];

  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productParticipants}>모구인원 {item.participants}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleLike(item.id)}>
        <Ionicons
          name={likedItems.includes(item.id) ? "heart" : "heart-outline"}
          size={22}
          color={likedItems.includes(item.id) ? "#e91e63" : "#999"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔹 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Address')}
        >
          <Text style={styles.location}>{selectedAddress} ▼</Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 필터 버튼 */}
      <View style={styles.filterRow}>
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

      {/* 🔹 상품 리스트 */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* 🔹 플로팅 버튼 */}
      <TouchableOpacity style={styles.floatingBtn}>
        <Text style={styles.floatingBtnText}>+ 모구하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  location: { fontSize: 16, fontWeight: "bold", marginTop: 25 },
  headerIcons: { flexDirection: "row", alignItems: "center", marginTop: 25 },
  filterRow: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  filterBtn: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 5,
  },
  filterBtnActive: { backgroundColor: "#e91e63" },
  filterText: { fontSize: 14, color: "#555" },
  filterTextActive: { color: "#fff", fontWeight: "bold" },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  productPrice: { fontSize: 13, color: "#333", marginBottom: 2 },
  productParticipants: { fontSize: 12, color: "#888" },
  floatingBtn: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#e91e63",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 22,
    elevation: 5,
  },
  floatingBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

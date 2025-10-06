import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/homepage/screens/HomeScreen";
import AddressScreen from "../screens/homepage/screens/AddressScreen";
import ProductDetailScreen from "../screens/homepage/product/ProductDetailScreen";
import ProductAddScreen from "../screens/homepage/product/ProductAddScreen";
import SearchScreen from "../screens/homepage/screens/SearchScreen";
import NotificationScreen from "../screens/homepage/screens/NotificationScreen";
import { HomeStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Address" 
        component={AddressScreen}
        options={({ navigation }) => ({
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="location" size={24} color="#8A2BE2" />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8A2BE2' }}>주소 설정</Text>
            </View>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#8A2BE2',
        })}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="document-text" size={24} color="#8A2BE2" />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8A2BE2' }}>상세페이지</Text>
            </View>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#8A2BE2',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="heart-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="share-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen 
        name="ProductAdd" 
        component={ProductAddScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Notification" 
        component={NotificationScreen}
        options={{ 
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
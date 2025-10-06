import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AddressScreen from "../screens/AddressScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import ProductAddScreen from "../screens/ProductAddScreen";
import SearchScreen from "../screens/SearchScreen";
import NotificationScreen from "../screens/NotificationScreen";
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
        options={{ 
          title: "주소 설정",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ 
          headerShown: false,
        }}
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
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Profile screens
import MyPageScreen from '../screens/mypage/profile/MyPageScreen';
import ProfileEditScreen from '../screens/mypage/profile/ProfileEditScreen';
import BadgesScreen from '../screens/mypage/profile/BadgesScreen';
// Settings screens
import SettingsScreen from '../screens/mypage/settings/SettingsScreen';
import NoticeScreen from '../screens/mypage/settings/NoticeScreen';
import TermsScreen from '../screens/mypage/settings/TermsScreen';
// Products screens
import WishlistScreen from '../screens/mypage/products/WishlistScreen';
import KeywordRegisterScreen from '../screens/mypage/products/KeywordRegisterScreen';
import RecentlyViewedScreen from '../screens/mypage/products/RecentlyViewedScreen';
import ReviewsScreen from '../screens/mypage/products/ReviewsScreen';
import SoldProductsScreen from '../screens/mypage/products/SoldProductsScreen';
import PurchasedProductsScreen from '../screens/mypage/products/PurchasedProductsScreen';
// Other screens
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createNativeStackNavigator();

const MyPageStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyPageHome" component={MyPageScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="Badges" component={BadgesScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="KeywordRegister" component={KeywordRegisterScreen} />
      <Stack.Screen name="RecentlyViewed" component={RecentlyViewedScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="SoldProducts" component={SoldProductsScreen} />
      <Stack.Screen name="PurchasedProducts" component={PurchasedProductsScreen} />
      <Stack.Screen name="Notice" component={NoticeScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
};

export default MyPageStack;


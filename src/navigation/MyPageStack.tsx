import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageScreen from '../screens/MyPageScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import BadgesScreen from '../screens/BadgesScreen';
import WishlistScreen from '../screens/WishlistScreen';
import KeywordRegisterScreen from '../screens/KeywordRegisterScreen';
import RecentlyViewedScreen from '../screens/RecentlyViewedScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import SoldProductsScreen from '../screens/SoldProductsScreen';
import PurchasedProductsScreen from '../screens/PurchasedProductsScreen';
import NoticeScreen from '../screens/NoticeScreen';
import TermsScreen from '../screens/TermsScreen';
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


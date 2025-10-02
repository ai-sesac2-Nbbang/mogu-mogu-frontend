// src/types/navigation.ts
import { NavigationProp, NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: {
    selectedAddress?: string;
    addressLabel?: string;
  } | undefined;
  Address: {
    selectedAddress?: string;
  } | undefined;
};

export type RootStackParamList = {
  Login: undefined;
  SignupWizard: undefined;
  MainTabs: undefined;
  Home: {
    selectedAddress?: string;
    addressLabel?: string;
  } | undefined;
  Address: undefined;
};

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

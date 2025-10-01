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
};

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

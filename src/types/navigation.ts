// src/types/navigation.ts
import { NavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  SignupWizard: undefined;
  MainTabs: undefined;
};

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

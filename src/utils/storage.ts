// src/utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const saveTokens = async (access: string, refresh: string) => {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const getTokens = async () => {
  const access = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  return { access, refresh };
};

export const clearTokens = async () => {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
};

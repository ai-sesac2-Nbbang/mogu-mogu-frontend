import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Dimensions,
  Modal,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

const KAKAO_JS_KEY: string = process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? "";

// ✅ 서울시청 좌표
const SEOUL_CITY_HALL = { lat: 37.5662952, lng: 126.9779451 };
const DEFAULT_RADIUS = 3000;
const { height } = Dimensions.get("window");

// 더미 데이터 (컴포넌트 외부로 이동) - 대량 데이터
const dummyMoguItems: MoguItem[] = [
  // 서울 지역 (20개)
  { id: 1, name: "물티슈 10롤", price: "9,170원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 37.5665, lng: 126.9780, category: "생활용품", endDate: "2일 후", distance: 0.5, meetingSpot: "서울시청 앞 광장", meetingTime: "12/25 오후 2:00" },
  { id: 2, name: "2080 칫솔 10개", price: "6,420원", participants: "1/2", image: require("../../assets/products/toothbrush.png"), lat: 37.5555, lng: 126.9700, category: "생활용품", endDate: "1일 후", distance: 1.2, meetingSpot: "명동역 2번 출구", meetingTime: "12/26 오후 3:30" },
  { id: 3, name: "프리미엄 휴지 30롤", price: "12,800원", participants: "1/2", image: require("../../assets/products/tissue.png"), lat: 37.5775, lng: 126.9850, category: "생활용품", endDate: "3일 후", distance: 0.8, meetingSpot: "강남역 11번 출구", meetingTime: "12/27 오후 4:00" },
  { id: 4, name: "주방세제 3개 세트", price: "8,900원", participants: "4/5", image: require("../../assets/products/shampoo.png"), lat: 37.5455, lng: 126.9650, category: "생활용품", endDate: "1일 후", distance: 2.1, meetingSpot: "홍대입구역 9번 출구", meetingTime: "12/25 오후 5:00" },
  { id: 5, name: "도브 샴푸 리필", price: "5,250원", participants: "4/6", image: require("../../assets/products/shampoo.png"), lat: 37.5675, lng: 126.9880, category: "화장품", endDate: "3일 후", distance: 0.3, meetingSpot: "이태원역 1번 출구", meetingTime: "12/28 오후 6:30" },
  { id: 6, name: "헤어케어 샴푸 1L", price: "9,900원", participants: "3/4", image: require("../../assets/products/shampoo.png"), lat: 37.5475, lng: 126.9680, category: "화장품", endDate: "2일 후", distance: 1.8, meetingSpot: "신촌역 2번 출구", meetingTime: "12/26 오후 7:00" },
  { id: 7, name: "무항생제 계란 30구", price: "7,900원", participants: "1/4", image: require("../../assets/products/eggs.png"), lat: 37.5585, lng: 126.9780, category: "식품", endDate: "1일 후", distance: 0.7, meetingSpot: "종로3가역 5번 출구", meetingTime: "12/25 오후 1:30" },
  { id: 8, name: "유기농 바나나 1kg", price: "3,500원", participants: "2/3", image: require("../../assets/products/eggs.png"), lat: 37.5485, lng: 126.9680, category: "식품", endDate: "2일 후", distance: 1.4, meetingSpot: "동대문역 1번 출구", meetingTime: "12/26 오후 2:30" },
  { id: 9, name: "면 티셔츠 3장", price: "15,000원", participants: "2/4", image: require("../../assets/products/tissue.png"), lat: 37.5695, lng: 126.9890, category: "의류", endDate: "4일 후", distance: 0.4, meetingSpot: "압구정역 2번 출구", meetingTime: "12/29 오후 3:00" },
  { id: 10, name: "청바지 2벌", price: "25,000원", participants: "1/3", image: require("../../assets/products/toothbrush.png"), lat: 37.5595, lng: 126.9790, category: "의류", endDate: "3일 후", distance: 1.1, meetingSpot: "신사역 8번 출구", meetingTime: "12/28 오후 4:30" },
  { id: 11, name: "무선 이어폰", price: "45,000원", participants: "3/5", image: require("../../assets/products/tissue.png"), lat: 37.5705, lng: 126.9900, category: "전자제품", endDate: "6일 후", distance: 0.2, meetingSpot: "삼성역 1번 출구", meetingTime: "12/31 오후 2:00" },
  { id: 12, name: "스마트워치", price: "80,000원", participants: "1/3", image: require("../../assets/products/toothbrush.png"), lat: 37.5605, lng: 126.9800, category: "전자제품", endDate: "4일 후", distance: 0.9, meetingSpot: "선릉역 3번 출구", meetingTime: "12/29 오후 5:00" },
  { id: 13, name: "세탁세제 5kg", price: "18,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 37.5715, lng: 126.9910, category: "생활용품", endDate: "3일 후", distance: 0.1, meetingSpot: "역삼역 1번 출구", meetingTime: "12/28 오후 1:30" },
  { id: 14, name: "화장지 20롤", price: "6,500원", participants: "3/4", image: require("../../assets/products/toothbrush.png"), lat: 37.5615, lng: 126.9810, category: "생활용품", endDate: "2일 후", distance: 0.8, meetingSpot: "논현역 2번 출구", meetingTime: "12/26 오후 6:00" },
  { id: 15, name: "신선한 채소 세트", price: "9,000원", participants: "3/5", image: require("../../assets/products/tissue.png"), lat: 37.5725, lng: 126.9920, category: "식품", endDate: "2일 후", distance: 0.3, meetingSpot: "개포동역 1번 출구", meetingTime: "12/26 오후 3:30" },
  { id: 16, name: "냉동만두 2kg", price: "7,500원", participants: "1/2", image: require("../../assets/products/toothbrush.png"), lat: 37.5625, lng: 126.9820, category: "식품", endDate: "5일 후", distance: 1.0, meetingSpot: "대치역 4번 출구", meetingTime: "12/30 오후 4:00" },
  { id: 17, name: "립밤 5개", price: "15,000원", participants: "1/3", image: require("../../assets/products/tissue.png"), lat: 37.5735, lng: 126.9930, category: "화장품", endDate: "4일 후", distance: 0.5, meetingSpot: "도곡역 1번 출구", meetingTime: "12/29 오후 6:30" },
  { id: 18, name: "마스크팩 10장", price: "12,000원", participants: "2/4", image: require("../../assets/products/toothbrush.png"), lat: 37.5635, lng: 126.9830, category: "화장품", endDate: "2일 후", distance: 1.2, meetingSpot: "한티역 2번 출구", meetingTime: "12/26 오후 7:30" },
  { id: 19, name: "운동화 1켤레", price: "35,000원", participants: "2/2", image: require("../../assets/products/shampoo.png"), lat: 37.5495, lng: 126.9690, category: "의류", endDate: "5일 후", distance: 1.8, meetingSpot: "서초역 3번 출구", meetingTime: "12/30 오후 2:30" },
  { id: 20, name: "충전기 세트", price: "12,000원", participants: "2/4", image: require("../../assets/products/shampoo.png"), lat: 37.5505, lng: 126.9700, category: "전자제품", endDate: "3일 후", distance: 1.6, meetingSpot: "교대역 1번 출구", meetingTime: "12/28 오후 5:30" },

  // 경기도 지역 (10개)
  { id: 21, name: "고급 칫솔 세트 20개", price: "11,500원", participants: "2/3", image: require("../../assets/products/toothbrush.png"), lat: 37.2636, lng: 127.0286, category: "생활용품", endDate: "2일 후", distance: 1.5, meetingSpot: "수원역 1번 출구", meetingTime: "12/26 오후 3:00" },
  { id: 22, name: "헤어케어 샴푸 1L", price: "9,900원", participants: "3/4", image: require("../../assets/products/shampoo.png"), lat: 37.3214, lng: 126.8308, category: "화장품", endDate: "2일 후", distance: 1.8, meetingSpot: "안양역 2번 출구", meetingTime: "12/26 오후 4:30" },
  { id: 23, name: "유기농 바나나 1kg", price: "3,500원", participants: "2/3", image: require("../../assets/products/eggs.png"), lat: 37.4138, lng: 127.5183, category: "식품", endDate: "2일 후", distance: 1.4, meetingSpot: "성남역 3번 출구", meetingTime: "12/26 오후 2:00" },
  { id: 24, name: "청바지 2벌", price: "25,000원", participants: "1/3", image: require("../../assets/products/toothbrush.png"), lat: 37.2986, lng: 127.6371, category: "의류", endDate: "3일 후", distance: 1.1, meetingSpot: "용인역 1번 출구", meetingTime: "12/28 오후 5:00" },
  { id: 25, name: "스마트워치", price: "80,000원", participants: "1/3", image: require("../../assets/products/toothbrush.png"), lat: 37.4138, lng: 127.5183, category: "전자제품", endDate: "4일 후", distance: 0.9, meetingSpot: "분당역 2번 출구", meetingTime: "12/29 오후 3:30" },
  { id: 26, name: "세탁세제 5kg", price: "18,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 37.2800, lng: 127.0000, category: "생활용품", endDate: "3일 후", distance: 1.2, meetingSpot: "의정부역 1번 출구", meetingTime: "12/28 오후 1:00" },
  { id: 27, name: "바디워시 500ml", price: "7,200원", participants: "2/3", image: require("../../assets/products/shampoo.png"), lat: 37.3500, lng: 126.9000, category: "화장품", endDate: "1일 후", distance: 1.6, meetingSpot: "부천역 3번 출구", meetingTime: "12/25 오후 6:00" },
  { id: 28, name: "신선한 사과 2kg", price: "8,500원", participants: "3/5", image: require("../../assets/products/eggs.png"), lat: 37.4000, lng: 127.5000, category: "식품", endDate: "3일 후", distance: 1.8, meetingSpot: "하남역 2번 출구", meetingTime: "12/28 오후 4:00" },
  { id: 29, name: "운동화 1켤레", price: "35,000원", participants: "2/2", image: require("../../assets/products/shampoo.png"), lat: 37.3000, lng: 127.6000, category: "의류", endDate: "5일 후", distance: 1.3, meetingSpot: "광주역 1번 출구", meetingTime: "12/30 오후 3:00" },
  { id: 30, name: "충전기 세트", price: "12,000원", participants: "2/4", image: require("../../assets/products/shampoo.png"), lat: 37.4200, lng: 127.5200, category: "전자제품", endDate: "3일 후", distance: 1.7, meetingSpot: "이천역 2번 출구", meetingTime: "12/28 오후 5:30" },

  // 인천 지역 (10개)
  { id: 31, name: "수건 세트 10개", price: "15,000원", participants: "1/4", image: require("../../assets/products/tissue.png"), lat: 37.4563, lng: 126.7052, category: "생활용품", endDate: "4일 후", distance: 2.8, meetingSpot: "인천역 1번 출구", meetingTime: "12/29 오후 2:00" },
  { id: 32, name: "바디워시 500ml", price: "7,200원", participants: "2/3", image: require("../../assets/products/shampoo.png"), lat: 37.4692, lng: 126.6327, category: "화장품", endDate: "1일 후", distance: 2.3, meetingSpot: "부평역 2번 출구", meetingTime: "12/25 오후 4:30" },
  { id: 33, name: "신선한 사과 2kg", price: "8,500원", participants: "3/5", image: require("../../assets/products/eggs.png"), lat: 37.4563, lng: 126.7052, category: "식품", endDate: "3일 후", distance: 2.1, meetingSpot: "계양역 3번 출구", meetingTime: "12/28 오후 3:00" },
  { id: 34, name: "운동화 1켤레", price: "35,000원", participants: "2/2", image: require("../../assets/products/shampoo.png"), lat: 37.4692, lng: 126.6327, category: "의류", endDate: "5일 후", distance: 1.8, meetingSpot: "서구역 1번 출구", meetingTime: "12/30 오후 5:00" },
  { id: 35, name: "충전기 세트", price: "12,000원", participants: "2/4", image: require("../../assets/products/shampoo.png"), lat: 37.4563, lng: 126.7052, category: "전자제품", endDate: "3일 후", distance: 1.6, meetingSpot: "남동구역 2번 출구", meetingTime: "12/28 오후 6:30" },
  { id: 36, name: "화장지 20롤", price: "6,500원", participants: "3/4", image: require("../../assets/products/toothbrush.png"), lat: 37.4400, lng: 126.7000, category: "생활용품", endDate: "2일 후", distance: 2.5, meetingSpot: "연수구역 1번 출구", meetingTime: "12/26 오후 1:30" },
  { id: 37, name: "페이셜 클렌저", price: "12,000원", participants: "1/2", image: require("../../assets/products/shampoo.png"), lat: 37.4800, lng: 126.6500, category: "화장품", endDate: "5일 후", distance: 2.0, meetingSpot: "중구역 3번 출구", meetingTime: "12/30 오후 4:00" },
  { id: 38, name: "제철 딸기 1팩", price: "6,000원", participants: "1/2", image: require("../../assets/products/eggs.png"), lat: 37.4500, lng: 126.7200, category: "식품", endDate: "1일 후", distance: 2.3, meetingSpot: "동구역 2번 출구", meetingTime: "12/25 오후 3:00" },
  { id: 39, name: "가방 1개", price: "20,000원", participants: "1/2", image: require("../../assets/products/eggs.png"), lat: 37.4700, lng: 126.6400, category: "의류", endDate: "2일 후", distance: 1.9, meetingSpot: "미추홀구역 1번 출구", meetingTime: "12/26 오후 5:30" },
  { id: 40, name: "블루투스 스피커", price: "28,000원", participants: "1/2", image: require("../../assets/products/eggs.png"), lat: 37.4600, lng: 126.7100, category: "전자제품", endDate: "5일 후", distance: 2.1, meetingSpot: "강화역 2번 출구", meetingTime: "12/30 오후 7:00" },

  // 부산 지역 (10개)
  { id: 41, name: "세탁세제 5kg", price: "18,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 35.1796, lng: 129.0756, category: "생활용품", endDate: "3일 후", distance: 0.1, meetingSpot: "부산역 1번 출구", meetingTime: "12/28 오후 2:00" },
  { id: 42, name: "페이셜 클렌저", price: "12,000원", participants: "1/2", image: require("../../assets/products/shampoo.png"), lat: 35.1796, lng: 129.0756, category: "화장품", endDate: "5일 후", distance: 3.1, meetingSpot: "서면역 2번 출구", meetingTime: "12/30 오후 3:30" },
  { id: 43, name: "제철 딸기 1팩", price: "6,000원", participants: "1/2", image: require("../../assets/products/eggs.png"), lat: 35.1796, lng: 129.0756, category: "식품", endDate: "1일 후", distance: 2.8, meetingSpot: "해운대역 1번 출구", meetingTime: "12/25 오후 4:00" },
  { id: 44, name: "가방 1개", price: "20,000원", participants: "1/2", image: require("../../assets/products/eggs.png"), lat: 35.1796, lng: 129.0756, category: "의류", endDate: "2일 후", distance: 2.5, meetingSpot: "남포역 3번 출구", meetingTime: "12/26 오후 5:00" },
  { id: 45, name: "블루투스 스피커", price: "28,000원", participants: "1/2", image: require("../../assets/products/eggs.png"), lat: 35.1796, lng: 129.0756, category: "전자제품", endDate: "5일 후", distance: 2.3, meetingSpot: "동래역 2번 출구", meetingTime: "12/30 오후 6:30" },
  { id: 46, name: "비누 10개", price: "8,000원", participants: "1/3", image: require("../../assets/products/shampoo.png"), lat: 35.1600, lng: 129.0800, category: "생활용품", endDate: "4일 후", distance: 0.3, meetingSpot: "부산대역 1번 출구", meetingTime: "12/29 오후 1:30" },
  { id: 47, name: "마스크팩 10장", price: "12,000원", participants: "2/4", image: require("../../assets/products/toothbrush.png"), lat: 35.1900, lng: 129.0700, category: "화장품", endDate: "2일 후", distance: 0.2, meetingSpot: "사상역 2번 출구", meetingTime: "12/26 오후 7:00" },
  { id: 48, name: "신선한 우유 1L", price: "2,800원", participants: "4/6", image: require("../../assets/products/eggs.png"), lat: 35.1700, lng: 129.0900, category: "식품", endDate: "2일 후", distance: 0.4, meetingSpot: "연산역 3번 출구", meetingTime: "12/26 오후 2:30" },
  { id: 49, name: "양말 10켤레", price: "8,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 35.2000, lng: 129.0600, category: "의류", endDate: "2일 후", distance: 0.5, meetingSpot: "금정역 1번 출구", meetingTime: "12/26 오후 3:00" },
  { id: 50, name: "헤드폰", price: "35,000원", participants: "2/4", image: require("../../assets/products/eggs.png"), lat: 35.1500, lng: 129.1000, category: "전자제품", endDate: "6일 후", distance: 0.6, meetingSpot: "장산역 2번 출구", meetingTime: "12/31 오후 4:30" },

  // 대구 지역 (10개)
  { id: 51, name: "화장지 20롤", price: "6,500원", participants: "3/4", image: require("../../assets/products/toothbrush.png"), lat: 35.8714, lng: 128.6014, category: "생활용품", endDate: "2일 후", distance: 0.8, meetingSpot: "대구역 1번 출구", meetingTime: "12/26 오후 2:00" },
  { id: 52, name: "신선한 우유 1L", price: "2,800원", participants: "4/6", image: require("../../assets/products/eggs.png"), lat: 35.8714, lng: 128.6014, category: "식품", endDate: "2일 후", distance: 3.5, meetingSpot: "동대구역 2번 출구", meetingTime: "12/26 오후 3:30" },
  { id: 53, name: "비누 10개", price: "8,000원", participants: "1/3", image: require("../../assets/products/shampoo.png"), lat: 35.8714, lng: 128.6014, category: "생활용품", endDate: "4일 후", distance: 1.5, meetingSpot: "서대구역 1번 출구", meetingTime: "12/29 오후 4:00" },
  { id: 54, name: "신선한 채소 세트", price: "9,000원", participants: "3/5", image: require("../../assets/products/tissue.png"), lat: 35.8714, lng: 128.6014, category: "식품", endDate: "2일 후", distance: 0.3, meetingSpot: "북대구역 3번 출구", meetingTime: "12/26 오후 5:00" },
  { id: 55, name: "양말 10켤레", price: "8,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 35.8714, lng: 128.6014, category: "의류", endDate: "2일 후", distance: 0.6, meetingSpot: "남대구역 2번 출구", meetingTime: "12/26 오후 6:30" },
  { id: 56, name: "샴푸 1L", price: "11,000원", participants: "2/4", image: require("../../assets/products/eggs.png"), lat: 35.8500, lng: 128.6200, category: "생활용품", endDate: "1일 후", distance: 0.9, meetingSpot: "수성구역 1번 출구", meetingTime: "12/25 오후 1:30" },
  { id: 57, name: "립밤 5개", price: "15,000원", participants: "1/3", image: require("../../assets/products/tissue.png"), lat: 35.8900, lng: 128.5800, category: "화장품", endDate: "4일 후", distance: 0.7, meetingSpot: "달서구역 2번 출구", meetingTime: "12/29 오후 7:00" },
  { id: 58, name: "냉동만두 2kg", price: "7,500원", participants: "1/2", image: require("../../assets/products/toothbrush.png"), lat: 35.8600, lng: 128.6100, category: "식품", endDate: "5일 후", distance: 0.4, meetingSpot: "달성군역 1번 출구", meetingTime: "12/30 오후 3:00" },
  { id: 59, name: "모자 2개", price: "12,000원", participants: "1/2", image: require("../../assets/products/toothbrush.png"), lat: 35.8800, lng: 128.5900, category: "의류", endDate: "4일 후", distance: 0.5, meetingSpot: "중구역 3번 출구", meetingTime: "12/29 오후 4:30" },
  { id: 60, name: "케이스 3개", price: "15,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 35.8700, lng: 128.6000, category: "전자제품", endDate: "1일 후", distance: 0.2, meetingSpot: "동구역 2번 출구", meetingTime: "12/25 오후 5:30" },

  // 광주 지역 (10개)
  { id: 61, name: "샴푸 1L", price: "11,000원", participants: "2/4", image: require("../../assets/products/eggs.png"), lat: 35.1595, lng: 126.8526, category: "생활용품", endDate: "1일 후", distance: 2.2 },
  { id: 62, name: "냉동만두 2kg", price: "7,500원", participants: "1/2", image: require("../../assets/products/toothbrush.png"), lat: 35.1595, lng: 126.8526, category: "식품", endDate: "5일 후", distance: 1.0 },
  { id: 63, name: "립밤 5개", price: "15,000원", participants: "1/3", image: require("../../assets/products/tissue.png"), lat: 35.1595, lng: 126.8526, category: "화장품", endDate: "4일 후", distance: 0.5 },
  { id: 64, name: "모자 2개", price: "12,000원", participants: "1/2", image: require("../../assets/products/toothbrush.png"), lat: 35.1595, lng: 126.8526, category: "의류", endDate: "4일 후", distance: 1.3 },
  { id: 65, name: "케이스 3개", price: "15,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 35.1595, lng: 126.8526, category: "전자제품", endDate: "1일 후", distance: 0.7 },
  { id: 66, name: "세탁세제 5kg", price: "18,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 35.1400, lng: 126.8700, category: "생활용품", endDate: "3일 후", distance: 2.0 },
  { id: 67, name: "신선한 고기 1kg", price: "22,000원", participants: "2/3", image: require("../../assets/products/shampoo.png"), lat: 35.1800, lng: 126.8300, category: "식품", endDate: "1일 후", distance: 1.8 },
  { id: 68, name: "마스크팩 10장", price: "12,000원", participants: "2/4", image: require("../../assets/products/toothbrush.png"), lat: 35.1500, lng: 126.8600, category: "화장품", endDate: "2일 후", distance: 1.5 },
  { id: 69, name: "벨트 3개", price: "16,000원", participants: "2/4", image: require("../../assets/products/shampoo.png"), lat: 35.1700, lng: 126.8400, category: "의류", endDate: "3일 후", distance: 1.2 },
  { id: 70, name: "보조배터리", price: "25,000원", participants: "1/2", image: require("../../assets/products/toothbrush.png"), lat: 35.1600, lng: 126.8500, category: "전자제품", endDate: "4일 후", distance: 1.0 },

  // 대전 지역 (10개)
  { id: 71, name: "신선한 고기 1kg", price: "22,000원", participants: "2/3", image: require("../../assets/products/shampoo.png"), lat: 36.3504, lng: 127.3845, category: "식품", endDate: "1일 후", distance: 1.7 },
  { id: 72, name: "마스크팩 10장", price: "12,000원", participants: "2/4", image: require("../../assets/products/toothbrush.png"), lat: 36.3504, lng: 127.3845, category: "화장품", endDate: "2일 후", distance: 1.2 },
  { id: 73, name: "생수 2L 12병", price: "8,000원", participants: "4/6", image: require("../../assets/products/eggs.png"), lat: 36.3504, lng: 127.3845, category: "식품", endDate: "3일 후", distance: 2.4 },
  { id: 74, name: "벨트 3개", price: "16,000원", participants: "2/4", image: require("../../assets/products/shampoo.png"), lat: 36.3504, lng: 127.3845, category: "의류", endDate: "3일 후", distance: 2.0 },
  { id: 75, name: "보조배터리", price: "25,000원", participants: "1/2", image: require("../../assets/products/toothbrush.png"), lat: 36.3504, lng: 127.3845, category: "전자제품", endDate: "4일 후", distance: 1.4 },
  { id: 76, name: "화장지 20롤", price: "6,500원", participants: "3/4", image: require("../../assets/products/toothbrush.png"), lat: 36.3300, lng: 127.4000, category: "생활용품", endDate: "2일 후", distance: 1.5 },
  { id: 77, name: "선크림 2개", price: "18,000원", participants: "1/2", image: require("../../assets/products/shampoo.png"), lat: 36.3700, lng: 127.3700, category: "화장품", endDate: "6일 후", distance: 1.0 },
  { id: 78, name: "신선한 채소 세트", price: "9,000원", participants: "3/5", image: require("../../assets/products/tissue.png"), lat: 36.3600, lng: 127.3800, category: "식품", endDate: "2일 후", distance: 1.3 },
  { id: 79, name: "스카프 5개", price: "20,000원", participants: "1/3", image: require("../../assets/products/eggs.png"), lat: 36.3400, lng: 127.3900, category: "의류", endDate: "5일 후", distance: 1.8 },
  { id: 80, name: "USB 케이블", price: "5,000원", participants: "3/5", image: require("../../assets/products/shampoo.png"), lat: 36.3800, lng: 127.3600, category: "전자제품", endDate: "2일 후", distance: 0.8 },

  // 울산 지역 (10개)
  { id: 81, name: "선크림 2개", price: "18,000원", participants: "1/2", image: require("../../assets/products/shampoo.png"), lat: 35.5384, lng: 129.3114, category: "화장품", endDate: "6일 후", distance: 1.9 },
  { id: 82, name: "핸드크림 3개", price: "9,000원", participants: "3/5", image: require("../../assets/products/eggs.png"), lat: 35.5384, lng: 129.3114, category: "화장품", endDate: "3일 후", distance: 2.6 },
  { id: 83, name: "스카프 5개", price: "20,000원", participants: "1/3", image: require("../../assets/products/eggs.png"), lat: 35.5384, lng: 129.3114, category: "의류", endDate: "5일 후", distance: 2.7 },
  { id: 84, name: "USB 케이블", price: "5,000원", participants: "3/5", image: require("../../assets/products/shampoo.png"), lat: 35.5384, lng: 129.3114, category: "전자제품", endDate: "2일 후", distance: 2.1 },
  { id: 85, name: "헤드폰", price: "35,000원", participants: "2/4", image: require("../../assets/products/eggs.png"), lat: 35.5200, lng: 129.3300, category: "전자제품", endDate: "6일 후", distance: 2.8 },
  { id: 86, name: "세탁세제 5kg", price: "18,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 35.5500, lng: 129.2900, category: "생활용품", endDate: "3일 후", distance: 1.5 },
  { id: 87, name: "신선한 사과 2kg", price: "8,500원", participants: "3/5", image: require("../../assets/products/eggs.png"), lat: 35.5300, lng: 129.3200, category: "식품", endDate: "3일 후", distance: 2.0 },
  { id: 88, name: "마스크팩 10장", price: "12,000원", participants: "2/4", image: require("../../assets/products/toothbrush.png"), lat: 35.5600, lng: 129.3000, category: "화장품", endDate: "2일 후", distance: 1.7 },
  { id: 89, name: "운동화 1켤레", price: "35,000원", participants: "2/2", image: require("../../assets/products/shampoo.png"), lat: 35.5100, lng: 129.3400, category: "의류", endDate: "5일 후", distance: 2.3 },
  { id: 90, name: "충전기 세트", price: "12,000원", participants: "2/4", image: require("../../assets/products/shampoo.png"), lat: 35.5400, lng: 129.3100, category: "전자제품", endDate: "3일 후", distance: 1.8 },

  // 세종 지역 (10개)
  { id: 91, name: "세제 3개", price: "13,000원", participants: "1/3", image: require("../../assets/products/tissue.png"), lat: 36.4800, lng: 127.2890, category: "생활용품", endDate: "3일 후", distance: 0.8 },
  { id: 92, name: "과일 세트", price: "14,000원", participants: "2/4", image: require("../../assets/products/toothbrush.png"), lat: 36.4800, lng: 127.2890, category: "식품", endDate: "1일 후", distance: 1.5 },
  { id: 93, name: "스킨케어 세트", price: "30,000원", participants: "1/2", image: require("../../assets/products/shampoo.png"), lat: 36.5000, lng: 127.3000, category: "화장품", endDate: "5일 후", distance: 2.2 },
  { id: 94, name: "운동복 세트", price: "40,000원", participants: "2/3", image: require("../../assets/products/eggs.png"), lat: 36.4600, lng: 127.2800, category: "의류", endDate: "4일 후", distance: 2.9 },
  { id: 95, name: "태블릿 케이스", price: "18,000원", participants: "1/2", image: require("../../assets/products/tissue.png"), lat: 36.4900, lng: 127.3100, category: "전자제품", endDate: "3일 후", distance: 0.9 },
  { id: 96, name: "화장지 20롤", price: "6,500원", participants: "3/4", image: require("../../assets/products/toothbrush.png"), lat: 36.4700, lng: 127.2700, category: "생활용품", endDate: "2일 후", distance: 1.2 },
  { id: 97, name: "신선한 우유 1L", price: "2,800원", participants: "4/6", image: require("../../assets/products/eggs.png"), lat: 36.5100, lng: 127.3200, category: "식품", endDate: "2일 후", distance: 1.8 },
  { id: 98, name: "립밤 5개", price: "15,000원", participants: "1/3", image: require("../../assets/products/tissue.png"), lat: 36.4500, lng: 127.2600, category: "화장품", endDate: "4일 후", distance: 1.6 },
  { id: 99, name: "청바지 2벌", price: "25,000원", participants: "1/3", image: require("../../assets/products/toothbrush.png"), lat: 36.5200, lng: 127.3300, category: "의류", endDate: "3일 후", distance: 2.1 },
  { id: 100, name: "스마트워치", price: "80,000원", participants: "1/3", image: require("../../assets/products/toothbrush.png"), lat: 36.4400, lng: 127.2500, category: "전자제품", endDate: "4일 후", distance: 1.4 },

  // 강원도 지역 (10개)
  { id: 101, name: "청소용품 세트", price: "16,000원", participants: "3/5", image: require("../../assets/products/toothbrush.png"), lat: 36.5184, lng: 128.7294, category: "생활용품", endDate: "2일 후", distance: 1.6 },
  { id: 102, name: "건강식품", price: "45,000원", participants: "1/3", image: require("../../assets/products/shampoo.png"), lat: 36.5184, lng: 128.7294, category: "식품", endDate: "6일 후", distance: 2.3 },
  { id: 103, name: "천연 세제", price: "13,000원", participants: "2/3", image: require("../../assets/products/shampoo.png"), lat: 37.8000, lng: 128.1000, category: "생활용품", endDate: "3일 후", distance: 9.5 },
  { id: 104, name: "자연스러운 화장품", price: "26,000원", participants: "1/2", image: require("../../assets/products/shampoo.png"), lat: 37.8100, lng: 128.1100, category: "화장품", endDate: "4일 후", distance: 9.7 },
  { id: 105, name: "산채류", price: "19,000원", participants: "2/3", image: require("../../assets/products/eggs.png"), lat: 37.8200, lng: 128.1200, category: "식품", endDate: "3일 후", distance: 9.9 },
  { id: 106, name: "화장지 20롤", price: "6,500원", participants: "3/4", image: require("../../assets/products/toothbrush.png"), lat: 37.5000, lng: 128.7500, category: "생활용품", endDate: "2일 후", distance: 1.8 },
  { id: 107, name: "신선한 사과 2kg", price: "8,500원", participants: "3/5", image: require("../../assets/products/eggs.png"), lat: 37.6000, lng: 128.8000, category: "식품", endDate: "3일 후", distance: 2.0 },
  { id: 108, name: "마스크팩 10장", price: "12,000원", participants: "2/4", image: require("../../assets/products/toothbrush.png"), lat: 37.7000, lng: 128.9000, category: "화장품", endDate: "2일 후", distance: 2.5 },
  { id: 109, name: "운동화 1켤레", price: "35,000원", participants: "2/2", image: require("../../assets/products/shampoo.png"), lat: 37.4000, lng: 128.7000, category: "의류", endDate: "5일 후", distance: 1.2 },
  { id: 110, name: "충전기 세트", price: "12,000원", participants: "2/4", image: require("../../assets/products/shampoo.png"), lat: 37.5500, lng: 128.7800, category: "전자제품", endDate: "3일 후", distance: 1.9 },

  // 제주도 지역 (10개)
  { id: 111, name: "제주 감귤", price: "15,000원", participants: "2/3", image: require("../../assets/products/eggs.png"), lat: 33.4996, lng: 126.5312, category: "식품", endDate: "2일 후", distance: 11.0 },
  { id: 112, name: "제주 한라봉", price: "18,000원", participants: "1/2", image: require("../../assets/products/eggs.png"), lat: 33.5096, lng: 126.5412, category: "식품", endDate: "3일 후", distance: 11.2 },
  { id: 113, name: "제주 흑돼지", price: "45,000원", participants: "2/4", image: require("../../assets/products/eggs.png"), lat: 33.5196, lng: 126.5512, category: "식품", endDate: "1일 후", distance: 11.4 },
  { id: 114, name: "제주 화장품", price: "28,000원", participants: "1/3", image: require("../../assets/products/shampoo.png"), lat: 33.5296, lng: 126.5612, category: "화장품", endDate: "4일 후", distance: 11.6 },
  { id: 115, name: "제주 기념품", price: "12,000원", participants: "3/5", image: require("../../assets/products/tissue.png"), lat: 33.5396, lng: 126.5712, category: "생활용품", endDate: "5일 후", distance: 11.8 },
  { id: 116, name: "제주 녹차", price: "22,000원", participants: "2/3", image: require("../../assets/products/eggs.png"), lat: 33.4800, lng: 126.5000, category: "식품", endDate: "3일 후", distance: 10.5 },
  { id: 117, name: "제주 해산물", price: "35,000원", participants: "1/2", image: require("../../assets/products/eggs.png"), lat: 33.5200, lng: 126.5800, category: "식품", endDate: "2일 후", distance: 12.0 },
  { id: 118, name: "제주 천연비누", price: "8,500원", participants: "3/4", image: require("../../assets/products/shampoo.png"), lat: 33.4900, lng: 126.5200, category: "생활용품", endDate: "4일 후", distance: 10.8 },
  { id: 119, name: "제주 면 소재", price: "18,000원", participants: "2/3", image: require("../../assets/products/tissue.png"), lat: 33.5100, lng: 126.5500, category: "의류", endDate: "3일 후", distance: 11.3 },
  { id: 120, name: "제주 전자제품", price: "42,000원", participants: "1/2", image: require("../../assets/products/toothbrush.png"), lat: 33.5000, lng: 126.5400, category: "전자제품", endDate: "5일 후", distance: 11.1, meetingSpot: "제주공항역 1번 출구", meetingTime: "12/30 오후 6:00" }
];

const categories = ["전체", "생활용품", "화장품", "식품", "의류", "전자제품"];

interface MoguItem {
  id: number;
  name: string;
  price: string;
  participants: string;
  image: any;
  lat: number;
  lng: number;
  category: string;
  endDate: string;
  distance: number;
  meetingSpot?: string;
  meetingTime?: string;
}

export default function MapScreen() {
  const navigation = useNavigation();
  const webRef = useRef<WebViewType>(null);
  const [query, setQuery] = useState<string>("");
  const [coords, setCoords] = useState(SEOUL_CITY_HALL);
  const [webLoaded, setWebLoaded] = useState(false);

  const [moguItems, setMoguItems] = useState<MoguItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MoguItem[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MoguItem | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [ongoingMoguCount, setOngoingMoguCount] = useState<number>(0);

  // 데이터베이스에서 진행 중인 모구 수를 가져오는 함수
  const fetchOngoingMoguCount = async () => {
    try {
      // TODO: 실제 API 호출로 교체
      // const response = await fetch('/api/mogu/ongoing-count');
      // const data = await response.json();
      // setOngoingMoguCount(data.count);
      
      // 임시로 더미 데이터 사용 (실제 구현 시 주석 처리)
      setOngoingMoguCount(47); // 예시: 47개의 진행 중인 모구
      
      console.log('진행 중인 모구 수:', 47);
    } catch (error) {
      console.error('진행 중인 모구 수 조회 오류:', error);
      setOngoingMoguCount(0);
    }
  };

  const getLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("위치 권한 필요", "서울시청을 기본 위치로 사용합니다.");
        setCoords(SEOUL_CITY_HALL);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (e: any) {
      console.warn("위치 오류:", e?.message);
      setCoords(SEOUL_CITY_HALL);
    } finally {
      setIsGettingLocation(false);
    }
  };

  useEffect(() => {

    const initializeData = async () => {
      try {
        await getLocation();
        // 더미 데이터 로드
        setMoguItems(dummyMoguItems);
        setFilteredItems(dummyMoguItems);
        // 진행 중인 모구 수 조회
        await fetchOngoingMoguCount();
      } catch (error) {
        console.error('초기화 오류:', error);
        // 기본 데이터라도 설정
        setMoguItems(dummyMoguItems);
        setFilteredItems(dummyMoguItems);
        await fetchOngoingMoguCount();
      }
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    if (webLoaded && coords) {

      // WebView 렌더링 지연 시간 단축
      setTimeout(() => {
      sendToWeb("renderCurrent", { ...coords, radius: DEFAULT_RADIUS });

      }, 100);
    }
  }, [webLoaded, coords]);


  useEffect(() => {
    if (webLoaded && filteredItems.length > 0) {
      // 약간의 지연을 두어 WebView가 완전히 준비되도록 함
      setTimeout(() => {
        sendToWeb("renderMoguItems", filteredItems);
      }, 1000);
    }
  }, [webLoaded, filteredItems]);

  const sendToWeb = (fn: "renderCurrent" | "renderMoguItems", payload: unknown) => {
    try {
    if (!webRef.current) return;
    const js = `
      if (window.${fn}) {
        window.${fn}(${JSON.stringify(payload)});
      }
      true;
    `;
    webRef.current.injectJavaScript(js);

    } catch (error) {
      console.error('WebView 통신 오류:', error);
    }
  };

  const onSearch = () => {
    if (!query.trim()) {
      setFilteredItems(moguItems);
      return;
    }
    
    const filtered = moguItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const onCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "전체") {
      setFilteredItems(moguItems);
    } else {
      const filtered = moguItems.filter(item => item.category === category);
      setFilteredItems(filtered);
    }
    setShowFilter(false);
  };

  // ✅ 대한민국 영역 제한 추가
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1, maximum-scale=1" />

        <style>
          html, body, #map { 
            margin:0; 
            padding:0; 
            width:100%; 
            height:100%; 
            overflow: hidden;
          }
        </style>
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>

          var map, myMarker, myCircle, moguMarkers = [];
          var isMapReady = false;

          function initMap() {

            try {
              if (typeof kakao === 'undefined' || !kakao.maps) {
                console.error('카카오 맵 SDK 로드 실패');
                return;
              }

            map = new kakao.maps.Map(document.getElementById('map'), {
              center: new kakao.maps.LatLng(37.5665, 126.9780),
              level: 9  // 줌 아웃 상태로 시작하여 클러스터 표시
            });


              isMapReady = true;
              console.log('지도 초기화 완료');
            } catch (error) {
              console.error('지도 초기화 오류:', error);
            }
          }

          window.renderCurrent = function(data) {

            try {
              if (!isMapReady || !map) {
                console.log('지도가 준비되지 않음');
                return;
              }
              
            var pos = new kakao.maps.LatLng(data.lat, data.lng);

            if (!myMarker) {
              // 빨간색 핀 모양 마커 이미지 생성 (적당한 크기)
              var redMarkerImage = new kakao.maps.MarkerImage(
                'data:image/svg+xml;base64,' + btoa('<svg width="36" height="52" viewBox="0 0 24 35" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 23 12 23s12-15.8 12-23c0-6.6-5.4-12-12-12z" fill="#FF0000"/><circle cx="12" cy="12" r="8" fill="#fff"/></svg>'),
                new kakao.maps.Size(36, 52),
                { offset: new kakao.maps.Point(18, 52) }
              );
              
              myMarker = new kakao.maps.Marker({ 
                position: pos, 
                map: map,
                image: redMarkerImage,
                zIndex: 1000  // 다른 마커보다 위에 표시
              });
            } else {
              myMarker.setPosition(pos);
            }

            if (!myCircle) {
              myCircle = new kakao.maps.Circle({
                map: map,
                center: pos,

                  radius: data.radius || 3000,
                strokeWeight: 2,

                  strokeColor: "#8A2BE2",
                strokeOpacity: 0.9,

                  fillColor: "#8A2BE2",
                fillOpacity: 0.1
              });
            } else {
              myCircle.setPosition(pos);

                myCircle.setRadius(data.radius || 3000);
            }

            map.setCenter(pos);
            map.setLevel(7);

            } catch (error) {
              console.error('현재 위치 렌더링 오류:', error);
            }
          };

          window.renderMoguItems = function(items) {
            try {
              if (!isMapReady || !map || !items || !Array.isArray(items)) {
                console.log('모구 아이템 렌더링 조건 불충족');
                return;
              }
              

              // 개별 마커 렌더링 함수
              function renderIndividualMarkers(items) {
                try {
                  console.log('개별 마커 렌더링 시작, 아이템 수:', items.length);
                items.forEach(function(item) {
                  if (!item || typeof item.lat !== 'number' || typeof item.lng !== 'number') {
                    return;
                  }
                  
                  var pos = new kakao.maps.LatLng(item.lat, item.lng);
                  var marker = new kakao.maps.Marker({ 
                    position: pos, 
                    map: map
                  });
                  moguMarkers.push(marker);

                  // 간단한 정보창 대신 마커 클릭 시 Modal을 띄우도록 변경
                  var infoContent = '<div style="padding: 8px; min-width: 120px; font-family: Arial, sans-serif; background: rgba(0,0,0,0.8); color: white; border-radius: 6px; text-align: center; font-size: 12px;">' +
                    '📦 ' + (item.name || '') + '<br/>' +
                    '💰 ' + (item.price || '') +
                    '</div>';

                  var iw = new kakao.maps.InfoWindow({
                    content: infoContent
                  });
                  
                  marker.infoWindow = iw;
                  
                  kakao.maps.event.addListener(marker, 'click', function() {
                    // WebView에서 React Native로 메시지 전송하여 Modal 띄우기
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'showItemModal',
                      item: item
                    }));
                  });
                });
                console.log('개별 마커 렌더링 완료, 마커 수:', moguMarkers.length);
                } catch (error) {
                  console.error('개별 마커 렌더링 오류:', error);
                }
              }

              // 클러스터 마커 렌더링 함수
              function renderClusterMarkers(items) {
                try {
                  console.log('클러스터 마커 렌더링 시작, 아이템 수:', items.length);
                  var clusters = {};
                  var currentLevel = map.getLevel();
                
                // 줌 레벨에 따른 클러스터링 강도 조정 (더 적극적인 클러스터링)
                var clusterPrecision;
                if (currentLevel >= 10) {
                  clusterPrecision = 1; // 매우 강한 클러스터링 (줌 아웃) - 전국 단위
                } else if (currentLevel >= 9) {
                  clusterPrecision = 5; // 강한 클러스터링 - 시/도 단위
                } else if (currentLevel >= 8) {
                  clusterPrecision = 20; // 중간 클러스터링 - 구/군 단위
                } else if (currentLevel >= 7) {
                  clusterPrecision = 50; // 기본 클러스터링 - 동/면 단위
                } else if (currentLevel >= 6) {
                  clusterPrecision = 100; // 세밀한 클러스터링 - 상세 단위
                } else {
                  clusterPrecision = 200; // 매우 세밀한 클러스터링
                }
                
                console.log('현재 줌 레벨:', currentLevel, '클러스터링 정밀도:', clusterPrecision);
                
                // 지역별로 아이템 그룹화
                items.forEach(function(item) {
                  if (!item || typeof item.lat !== 'number' || typeof item.lng !== 'number') {
                    console.log('유효하지 않은 아이템:', item);
                    return;
                  }
                  
                  // 줌 레벨에 따른 클러스터 키 생성 (줌 아웃할수록 더 큰 그룹)
                  var clusterKey = Math.round(item.lat * clusterPrecision) + '_' + Math.round(item.lng * clusterPrecision);
                  
                  if (!clusters[clusterKey]) {
                    clusters[clusterKey] = {
                      lat: 0,
                      lng: 0,
                      count: 0,
                      items: [],
                      totalLat: 0,
                      totalLng: 0
                    };
                  }
                  
                  clusters[clusterKey].count++;
                  clusters[clusterKey].items.push(item);
                  clusters[clusterKey].totalLat += item.lat;
                  clusters[clusterKey].totalLng += item.lng;
                });

                console.log('생성된 클러스터 개수:', Object.keys(clusters).length);
                console.log('클러스터 상세 정보:', clusters);

                // 클러스터 마커 생성
                Object.keys(clusters).forEach(function(key) {
                  var cluster = clusters[key];
                  
                  // 클러스터의 중심점 계산
                  var centerLat = cluster.totalLat / cluster.count;
                  var centerLng = cluster.totalLng / cluster.count;
                  var pos = new kakao.maps.LatLng(centerLat, centerLng);
                  
                  console.log('클러스터 마커 생성:', key, '중심위치:', centerLat, centerLng, '아이템 수:', cluster.count);
                  
                  // 클러스터 마커 이미지 생성
                  var markerImage = new kakao.maps.MarkerImage(
                    'data:image/svg+xml;base64,' + btoa('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="25" fill="#8A2BE2" stroke="#fff" stroke-width="4"/><text x="30" y="37" text-anchor="middle" font-size="16" fill="white" font-weight="bold">' + cluster.count + '</text></svg>'),
                    new kakao.maps.Size(60, 60),
                    { offset: new kakao.maps.Point(30, 30) }
                  );
                  
                  var marker = new kakao.maps.Marker({ 
                    position: pos, 
                    map: map,
                    image: markerImage
                  });
                  moguMarkers.push(marker);
                  
                  console.log('클러스터 마커 추가됨, 총 마커 수:', moguMarkers.length);

                  // 클러스터 클릭 시 해당 지역으로 줌인
                  kakao.maps.event.addListener(marker, 'click', function() {
                    console.log('=== 클러스터 클릭 이벤트 ===');
                    console.log('클러스터 표시 숫자:', cluster.count);
                    console.log('실제 아이템 수:', cluster.items.length);
                    console.log('아이템 목록:', cluster.items.map(function(item) { return item.name + ' (' + item.lat + ', ' + item.lng + ')'; }));
                    
                    // 클러스터 아이템 수 검증
                    if (cluster.count !== cluster.items.length) {
                      console.warn('클러스터 개수 불일치! 표시:', cluster.count, '실제:', cluster.items.length);
                    }
                    
                    // 기존 마커들 제거
                    moguMarkers.forEach(m => m.setMap(null));
                    moguMarkers = [];
                    
                    // 현재 줌 레벨 확인
                    var currentLevel = map.getLevel();
                    console.log('현재 줌 레벨:', currentLevel);
                    
                    // 클러스터 아이템이 1개면 개별 마커로, 여러 개면 세분화된 클러스터로
                    if (cluster.items.length === 1) {
                      console.log('단일 아이템으로 개별 마커 표시');
                      renderIndividualMarkers(cluster.items);
                    } else if (currentLevel <= 5) {
                      console.log('충분히 줌인된 상태로 개별 마커 표시');
                      renderIndividualMarkers(cluster.items);
                    } else {
                      console.log('클러스터를 더 세분화된 클러스터로 전환');
                      
                      // 현재 줌 레벨을 2단계 줌인 (최소 레벨 1까지)
                      var newLevel = Math.max(1, currentLevel - 2);
                      console.log('클러스터 클릭 줌인:', currentLevel, '->', newLevel);
                      map.setLevel(newLevel);
                      
                      // 클러스터 중심으로 지도 이동
                      if (cluster.count > 0 && cluster.totalLat && cluster.totalLng) {
                        var centerLat = cluster.totalLat / cluster.count;
                        var centerLng = cluster.totalLng / cluster.count;
                        console.log('클러스터 중심점:', centerLat, centerLng);
                        var moveLatLon = new kakao.maps.LatLng(centerLat, centerLng);
                        map.setCenter(moveLatLon);
                      }
                      
                      // 클러스터 내 아이템들로 더 세분화된 클러스터 생성
                      setTimeout(function() {
                        console.log('세분화된 클러스터 렌더링 시작, 아이템 수:', cluster.items.length);
                        if (cluster.items && cluster.items.length > 0) {
                          renderClusterMarkers(cluster.items);
                        }
                      }, 500); // 줌인 애니메이션 완료 후 클러스터 렌더링
                    }
                  });
                });
                console.log('클러스터 마커 렌더링 완료, 마커 수:', moguMarkers.length);
                } catch (error) {
                  console.error('클러스터 마커 렌더링 오류:', error);
                }
              }
              
              moguMarkers.forEach(m => m.setMap(null));
              moguMarkers = [];

              var currentLevel = map.getLevel();
              console.log('현재 줌 레벨:', currentLevel);
              console.log('아이템 개수:', items.length);
              
              // 줌 레벨에 따른 계층화 (더 적극적인 클러스터링)
              if (currentLevel >= 6) {
                // 줌 아웃 상태: 지역별 클러스터 표시
                console.log('클러스터 모드로 전환, 줌 레벨:', currentLevel);
                renderClusterMarkers(items);
              } else {
                // 줌 인 상태: 개별 아이템 표시
                console.log('개별 마커 모드로 전환, 줌 레벨:', currentLevel);
                renderIndividualMarkers(items);
              }

              // 지도 줌 변경 이벤트 리스너
              kakao.maps.event.addListener(map, 'zoom_changed', function() {
                try {
                  var newLevel = map.getLevel();
                  console.log('줌 레벨 변경됨:', newLevel);
                  
                  // 기존 마커들 제거
                  moguMarkers.forEach(m => m.setMap(null));
                  moguMarkers = [];
                  
                  if (newLevel >= 6) {
                    console.log('줌 변경으로 클러스터 모드 전환');
                    renderClusterMarkers(items);
                  } else {
                    console.log('줌 변경으로 개별 마커 모드 전환');
                    renderIndividualMarkers(items);
                  }
                } catch (error) {
                  console.error('줌 변경 이벤트 오류:', error);
                }
              });

              // 지도 클릭 시 모든 정보창 닫기
              kakao.maps.event.addListener(map, 'click', function() {
                // 모든 마커의 정보창 닫기
                for (var i = 0; i < moguMarkers.length; i++) {
                  var marker = moguMarkers[i];
                  if (marker.infoWindow) {
                    marker.infoWindow.close();
                  }
                }
              });
            } catch (error) {
              console.error('모구 아이템 렌더링 오류:', error);
            }
          };

          // 카카오 맵 SDK 로드 완료 후 초기화
          if (typeof kakao !== 'undefined' && kakao.maps) {
            initMap();
          } else {
          window.onload = initMap;

          }
        </script>
      </body>
    </html>
  `;

  return (

    <View style={styles.container}>
      {/* 지도 - 전체 화면 */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ html }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode="always"
          startInLoadingState={true}
          onLoadStart={() => {
            console.log('WebView 로딩 시작');
            setWebLoaded(false);
          }}
          onLoadEnd={() => {
            console.log('WebView 로딩 완료');
            setWebLoaded(true);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView 오류:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP 오류:', nativeEvent);
          }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              console.log('WebView에서 받은 메시지:', data);
              
              if (data.type === 'showItemModal') {
                console.log('아이템 Modal 표시:', data.item);
                setSelectedItem(data.item);
                setShowInfoModal(true);
              }
            } catch (error) {
              console.error('WebView 메시지 파싱 오류:', error);
            }
          }}
          style={{ flex: 1 }}
        />

        {/* 지도 확대/축소 버튼 */}
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => {
              // 지도 확대
              const js = `
                if (window.map) {
                  const currentLevel = window.map.getLevel();
                  window.map.setLevel(currentLevel - 1);
                }
              `;
              webRef.current?.injectJavaScript(js);
            }}
          >
            <Ionicons name="add" size={24} color="#8A2BE2" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => {
              // 지도 축소
              const js = `
                if (window.map) {
                  const currentLevel = window.map.getLevel();
                  window.map.setLevel(currentLevel + 1);
                }
              `;
              webRef.current?.injectJavaScript(js);
            }}
          >
            <Ionicons name="remove" size={24} color="#8A2BE2" />
          </TouchableOpacity>
        </View>

        {/* 검색 및 필터 오버레이 */}
        <View style={styles.searchOverlay}>
      <View style={styles.searchBar}>

            <Ionicons name="search" size={20} color="#8A2BE2" />
        <TextInput

              placeholder="모구 상품명으로 검색..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSearch}
          style={styles.searchInput}
          returnKeyType="search"

              placeholderTextColor="#999"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => {
                setQuery("");
                setFilteredItems(moguItems);
              }}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.filterButton, showFilter && styles.filterButtonActive]}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Ionicons 
              name={showFilter ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={showFilter ? "#fff" : "#8A2BE2"} 
            />
            <Text style={[styles.filterText, showFilter && styles.filterTextActive]}>
              {selectedCategory === "전체" ? "필터" : selectedCategory}
            </Text>
            {selectedCategory !== "전체" && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>1</Text>
              </View>
            )}
          </TouchableOpacity>
      </View>


        {/* 카테고리 필터 드롭다운 */}
        {showFilter && (
          <View style={styles.filterDropdown}>
            <View style={styles.filterDropdownHeader}>
              <Text style={styles.filterDropdownTitle}>카테고리 필터</Text>
              <TouchableOpacity 
                onPress={() => setShowFilter(false)}
                style={styles.filterCloseButton}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.filterDropdownContent}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    selectedCategory === category && styles.filterOptionActive
                  ]}
                  onPress={() => onCategoryFilter(category)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedCategory === category && styles.filterOptionTextActive
                  ]}>
                    {category}
                  </Text>
                  {selectedCategory === category && (
                    <Ionicons name="checkmark" size={16} color="#8A2BE2" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 하단 정보 오버레이 */}
        <View style={styles.bottomOverlay}>
          <View style={styles.leftInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color="#FF0000" />
              <Text style={[styles.infoText, { color: "#FF0000" }]}>내 위치</Text>
            </View>
          </View>
          <View style={styles.rightInfo}>
            <View style={styles.infoItem}>
              <View style={styles.moguMarker} />
              <Text style={styles.infoText}>진행 중인 모구 수: {ongoingMoguCount}개</Text>
            </View>
          </View>
        </View>

        {/* 현재 위치 버튼 */}
      <TouchableOpacity
        style={[styles.locationButton, isGettingLocation && styles.locationButtonLoading]}
        onPress={() => void getLocation()}
        activeOpacity={0.8}
        disabled={isGettingLocation}
      >
          <Ionicons 
            name={isGettingLocation ? "refresh" : "locate"} 
            size={24} 
            color="#fff" 
          />
      </TouchableOpacity>

      </View>

      {/* 제품 정보 Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>📦 {selectedItem.name}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowInfoModal(false)}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Modal Body */}
                <ScrollView style={styles.modalBody}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>💰 가격</Text>
                    <Text style={styles.infoValue}>{selectedItem.price}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>👥 참여</Text>
                    <Text style={styles.infoValue}>{selectedItem.participants}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>🏷️ 카테고리</Text>
                    <Text style={styles.infoValue}>{selectedItem.category}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>📍 모구스팟</Text>
                    <Text style={styles.infoValue}>{selectedItem.meetingSpot || '서울시 강남구'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>🕐 만남일시</Text>
                    <Text style={styles.infoValue}>{selectedItem.meetingTime || '12/25 오후 2:00'}</Text>
                  </View>
                </ScrollView>

                {/* Modal Footer */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => {
                      setShowInfoModal(false);
                      // HomeStack의 ProductDetail로 네비게이션
                      (navigation as any).navigate('HomeStack', { 
                        screen: 'ProductDetail',
                        params: { 
                          productId: selectedItem.id,
                          productData: selectedItem 
                        }
                      });
                    }}
                  >
                    <Text style={styles.detailButtonText}>상세보기</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  searchOverlay: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "center",
    gap: 12,
    zIndex: 1000,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    height: 50,
  },
  searchInput: {

    flex: 1,
    fontSize: 15,
    color: "#333",
    marginLeft: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E1BEE7",
    height: 50,
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: "#8A2BE2",
    borderColor: "#8A2BE2",
  },
  filterText: {
    fontSize: 14,
    color: "#8A2BE2",
    fontWeight: "600",
    marginLeft: 4,
  },
  filterTextActive: {
    color: "#fff",
  },
  filterBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  zoomControls: {
    position: "absolute",
    left: 16,
    bottom: 80,
    flexDirection: "column",
    gap: 8,
    zIndex: 1000,
  },
  zoomButton: {
    width: 48,
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterDropdown: {
    position: "absolute",
    top: 90,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  filterDropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterDropdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  filterCloseButton: {
    padding: 4,
  },
  filterDropdownContent: {
    maxHeight: 200,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  filterOptionActive: {
    backgroundColor: "#F3E5F5",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#333",
  },
  filterOptionTextActive: {
    color: "#8A2BE2",
    fontWeight: "600",
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryChipActive: {
    backgroundColor: "#8A2BE2",
    borderColor: "#8A2BE2",
  },
  categoryText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(240, 240, 240, 0.8)",
    zIndex: 1000,
  },
  leftInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerInfo: {
    flex: 1,
    alignItems: "center",
  },
  rightInfo: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  moguMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#8A2BE2",
  },
  countText: {
    fontSize: 13,
    color: "#8A2BE2",
    fontWeight: "600",
  },
  locationButton: {
    position: "absolute",
    right: 20,

    bottom: 100,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8A2BE2",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  locationButtonLoading: {
    backgroundColor: "#6A1B9A",
    opacity: 0.8,
  },
  // Modal 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


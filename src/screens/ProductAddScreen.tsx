// src/screens/ProductAddScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../types/navigation";
import axios from "axios";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProductAddScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "ProductAdd"
>;

interface Props {
  navigation: ProductAddScreenNavigationProp;
}

// 하드코딩된 카테고리 목록
const CATEGORIES = ["생필품류", "식품/건강식품", "화장품류", "뷰티소품류"];

export default function ProductAddScreen({ navigation }: Props) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [groupCount, setGroupCount] = useState<number | null>(null); // Change to number | null
  const [groupLocation, setGroupLocation] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [commissionRate, setCommissionRate] = useState(100); // Default to 100%
  
  // 모구 마감 (월/일/시간)
  const [deadlineMonth, setDeadlineMonth] = useState("");
  const [deadlineDay, setDeadlineDay] = useState("");
  const [deadlineHour, setDeadlineHour] = useState("");
  
  // 만남 날짜 (년/월/일)
  const [meetupYear, setMeetupYear] = useState("");
  const [meetupMonth, setMeetupMonth] = useState("");
  const [meetupDay, setMeetupDay] = useState("");
  
  // 만남 시간 (시/분)
  const [meetupHour, setMeetupHour] = useState("");
  const [meetupMinute, setMeetupMinute] = useState("");

  // 모달 상태들
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDeadlineMonthModal, setShowDeadlineMonthModal] = useState(false);
  const [showDeadlineDayModal, setShowDeadlineDayModal] = useState(false);
  const [showDeadlineHourModal, setShowDeadlineHourModal] = useState(false);
  const [showMeetupYearModal, setShowMeetupYearModal] = useState(false);
  const [showMeetupMonthModal, setShowMeetupMonthModal] = useState(false);
  const [showMeetupDayModal, setShowMeetupDayModal] = useState(false);
  const [showMeetupHourModal, setShowMeetupHourModal] = useState(false);
  const [showMeetupMinuteModal, setShowMeetupMinuteModal] = useState(false);
  const [showGroupCountModal, setShowGroupCountModal] = useState(false);
  const [showDeadlineYearModal, setShowDeadlineYearModal] = useState(false); // Add showDeadlineYearModal state

  
  // 주소 검색 관련
  const [addressQuery, setAddressQuery] = useState("");
  const [addressResults, setAddressResults] = useState<{ id: string; address: string }[]>([]);

  // 🚀 최상단 useState 모음 부분에 추가
const [errors, setErrors] = useState<{
  productName: boolean;
  category: boolean;
  description: boolean;
  groupCount: boolean;
  groupLocation: boolean;
  purchasePrice: boolean;
  commissionRate: boolean;
  deadlineMonth: boolean;
  deadlineDay: boolean;
  deadlineHour: boolean;
  meetupYear: boolean; // Add meetupYear to errors state
  meetupMonth: boolean;
  meetupDay: boolean;
  meetupHour: boolean;
  meetupMinute: boolean;
  deadlineYear: boolean;
}>({
  productName: false,
  category: false,
  description: false,
  groupCount: false,
  groupLocation: false,
  purchasePrice: false,
  commissionRate: false,
  deadlineMonth: false,
  deadlineDay: false,
  deadlineHour: false,
  meetupYear: false, // Initialize meetupYear to false
  meetupMonth: false,
  meetupDay: false,
  meetupHour: false,
  meetupMinute: false,
  deadlineYear: false,
});


  // Kakao REST API Key
  const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY ?? "";

  // DB에서 카테고리 받아오기 (주석 처리됨)
  /*
  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories', {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
      
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  */

  // 주소 검색 (카카오 API 연동)
  const searchAddress = async (query: string) => {
    if (query.trim().length < 2) {
      setAddressResults([]);
      return;
    }
    try {
      const res = await axios.get(
        "https://dapi.kakao.com/v2/local/search/address.json",
        {
          params: { query },
          headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
        }
      );

      const docs = Array.isArray(res.data?.documents) ? res.data.documents : [];
      const normalized = docs.map((d: any, idx: number) => ({
        id: `${d.address_name}-${idx}`,
        address: d.road_address?.address_name || d.address_name,
      }));
      setAddressResults(normalized);
    } catch (e: any) {
      console.error("주소 검색 오류:", e.response?.data || e.message);
      setAddressResults([]);
    }
  };

  // 날짜/시간 옵션 생성 유틸
  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (month1to12: number, year: number) => {
    if (month1to12 === 2) {
      return isLeapYear(year) ? 29 : 28;
    }
    if ([4, 6, 9, 11].includes(month1to12)) return 30;
    return 31;
  };

  // ✅ 월 생성 (현재 월 이상만)
  const generateMonths = (selectedYear: number) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    return Array.from(
      { length: 12 - (currentMonth - 1) },
      (_, i) => `${currentMonth + i}월`
    );
  };

  // ✅ 일 생성 (선택 월이 이번 달이면 오늘 이후만 표시)
  const generateDaysFor = (monthText: string | undefined, year: number) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const m = monthText ? parseInt(monthText.replace("월", ""), 10) : 0;
    const count = m > 0 ? getDaysInMonth(m, year) : 31;

    let startDay = 1;
    if (m === currentMonth) {
      startDay = currentDay; // 오늘부터 시작
    }

    return Array.from(
      { length: count - (startDay - 1) },
      (_, i) => `${startDay + i}일`
    );
  };

  const generateHours = (selectedYear: number, selectedMonth: string, selectedDay: string) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentHour = today.getHours();

  const m = selectedMonth ? parseInt(selectedMonth.replace("월", ""), 10) : 0;
  const d = selectedDay ? parseInt(selectedDay.replace("일", ""), 10) : 0;

  // 오늘 날짜면 현재 시각 이후부터
  if (selectedYear === currentYear && m === currentMonth && d === currentDay) {
    return Array.from({ length: 24 - currentHour }, (_, i) => `${currentHour + i}시`);
  }

  // 미래 날짜면 0~23시 전체
  return Array.from({ length: 24 }, (_, i) => `${i}시`);
};

const generateMinutes = (
  selectedYear: number,
  selectedMonth: string,
  selectedDay: string,
  selectedHour: string
) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  const m = selectedMonth ? parseInt(selectedMonth.replace("월", ""), 10) : 0;
  const d = selectedDay ? parseInt(selectedDay.replace("일", ""), 10) : 0;
  const h = selectedHour ? parseInt(selectedHour.replace("시", ""), 10) : -1;

  // 오늘 & 현재 시간대라면 → 현재 분 이후(5분 단위로 반올림)
  if (selectedYear === currentYear && m === currentMonth && d === currentDay && h === currentHour) {
    const next5 = Math.ceil(currentMinute / 5) * 5; // 현재 분을 5분 단위로 올림
    return Array.from({ length: Math.floor((60 - next5) / 5) + 1 }, (_, i) => `${next5 + i * 5}분`);
  }

  // 다른 경우엔 0~55 (5분 단위 전체)
  return Array.from({ length: 12 }, (_, i) => `${i * 5}분`);
};

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const today = new Date();
    const december15 = new Date(currentYear, 11, 15); // Month is 0-indexed (11 is December)

    if (today >= december15) {
      return [`${currentYear}년`, `${nextYear}년`];
    } else {
      return [`${currentYear}년`];
    }
  };

  const handleSubmit = () => {
    const newErrors = {
      productName: !productName.trim(),
      category: !category.trim(),
      description: !description.trim(),
      groupCount: groupCount === null, // Check for null
      groupLocation: !groupLocation.trim(),
      purchasePrice: !purchasePrice.trim(),
      commissionRate: false, // No direct validation for slider, assuming it always has a value
      deadlineMonth: !deadlineMonth.trim(),
      deadlineDay: !deadlineDay.trim(),
      deadlineHour: !deadlineHour.trim(),
      meetupYear: !meetupYear.trim(),
      meetupMonth: !meetupMonth.trim(),
      meetupDay: !meetupDay.trim(),
      meetupHour: !meetupHour.trim(),
      meetupMinute: !meetupMinute.trim(),
      deadlineYear: false, // No deadlineYear selection in UI
    };

    setErrors(newErrors);

    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) {
      Alert.alert("알림", "모든 항목을 입력해야 등록할 수 있습니다.");
      return;
    }

    // 만남 날짜 - 내년 선택 시 12월 15일 이전이면 경고
    const currentYear = new Date().getFullYear();
    const today = new Date();
    const december15CurrentYear = new Date(currentYear, 11, 15); // December is month 11
    const selectedMeetupYear = meetupYear ? parseInt(meetupYear.replace("년", ""), 10) : 0;
    
    if (selectedMeetupYear === currentYear + 1 && today < december15CurrentYear) {
      Alert.alert(
        "알림",
        `내년 날짜는 ${currentYear}년 12월 15일 이후부터 등록할 수 있습니다.`
      );
      setErrors((prev) => ({ ...prev, meetupYear: true }));
      return;
    }

    // 상품 등록 로직 (주석 처리됨)
    // const submitProduct = async () => {
    //   try {
    //     const response = await axios.post('/api/products', {
    //       name: productName,
    //       category: category,
    //       description: description,
    //       group_count: groupCount || 1, // Use groupCount directly
    //       group_deadline: `${new Date().getFullYear()}-${deadlineMonth.replace("월", "")}-${deadlineDay.replace("일", "")} ${deadlineHour.replace("시", "")}:00`, // Construct deadline
    //       purchase_price: parseFloat(purchasePrice.replace(/[^0-9]/g, '')),
    //       commission_rate: commissionRate, // Use commissionRate
    //       // Calculate final price based on purchase price and commission rate
    //       final_price: parseFloat(purchasePrice.replace(/[^0-9]/g, '')) * (commissionRate / 100),
    //       meetup_date: `${meetupYear.replace("년", "")}-${meetupMonth.replace("월", "")}-${meetupDay.replace("일", "")}`, // Construct meetupDate
    //       meetup_time: `${meetupHour.replace("시", "")}:${meetupMinute.replace("분", "")}`, // Construct meetupTime
    //     }, {
    //       headers: {
    //         Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
    //       },
    //     });
        
    //     if (response.data.success) {
    //       Alert.alert("성공", "상품이 등록되었습니다!", [
    //         { text: "확인", onPress: () => navigation.navigate("ProductDetail", { productId: 123 }) }
    //       ]);
    //     } else {
    //       Alert.alert("오류", response.data.message || "상품 등록에 실패했습니다.");
    //     }
    //   } catch (error) {
    //     console.error('상품 등록 실패:', error);
    //     Alert.alert("오류", "상품 등록 중 오류가 발생했습니다.");
    //   }
    // };
    
    // submitProduct();

    Alert.alert("성공", "상품이 등록되었습니다!", [
      { text: "확인", onPress: () => navigation.navigate("ProductDetail", { productId: 123 }) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="cart" size={24} color="#8A2BE2" />
          <Text style={styles.headerTitle}>모구하기</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 기본 정보 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={22} color="#8A2BE2" />
            <Text style={styles.sectionTitle}>기본 정보</Text>
          </View>

          {/* 제목 */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="create-outline" size={18} color="#666" />
              <Text style={styles.label}>제목</Text>
            </View>
            <TextInput
              style={[styles.input, errors.productName && styles.errorInput]}
              value={productName}
              onChangeText={(text) => {
                setProductName(text);
                setErrors((prev) => ({ ...prev, productName: false }));
              }}
              placeholder="모구러들이 보는 제목을 입력해주세요"
            />
          </View>

          {/* 카테고리 */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="grid-outline" size={18} color="#666" />
              <Text style={styles.label}>카테고리</Text>
            </View>
            <TouchableOpacity 
              style={[styles.selectButton, errors.category && styles.errorInput]}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={[styles.selectButtonText, !category && styles.placeholder]}>
                {category || "카테고리 선택"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#8A2BE2" />
            </TouchableOpacity>
          </View>

          {/* 자세한 설명 */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="document-text-outline" size={18} color="#666" />
              <Text style={styles.label}>자세한 설명</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.errorInput]}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setErrors((prev) => ({ ...prev, description: false }));
              }}
              placeholder="모구할 상품에 대한 자세한 설명을 입력해주세요"
              multiline
            />
          </View>
        </View>

        {/* 모구 설정 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={22} color="#8A2BE2" />
            <Text style={styles.sectionTitle}>모구 설정</Text>
          </View>

          {/* 모구러 */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="person-add-outline" size={18} color="#666" />
              <Text style={styles.label}>모구러</Text>
            </View>
            <View style={styles.groupCountInputContainer}>
              <TextInput
                style={[
                  styles.groupCountInput,
                  errors.groupCount && styles.errorInput
                ]}
                placeholder="인원 수를 입력하세요 (최소 1인)"
                placeholderTextColor="#999"
                value={groupCount !== null ? groupCount.toString() : ''}
                onChangeText={(text) => {
                  const num = parseInt(text);
                  if (text === '') {
                    setGroupCount(null);
                  } else if (!isNaN(num) && num >= 1) {
                    setGroupCount(num);
                    setErrors((prev) => ({ ...prev, groupCount: false }));
                  }
                }}
                keyboardType="number-pad"
              />
              <Text style={styles.groupCountUnit}>명</Text>
            </View>
            <Text style={styles.groupCountHint}>💡 1명 이상 입력 가능</Text>
          </View>

          {/* 모구팟 (주소 검색) */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="location-outline" size={18} color="#666" />
              <Text style={styles.label}>모구팟</Text>
            </View>
            <TouchableOpacity 
              style={[styles.selectButton, errors.groupLocation && styles.errorInput]}
              onPress={() => setShowAddressModal(true)}
            >
              <Text style={[styles.selectButtonText, !groupLocation && styles.placeholder]}>
                {groupLocation || "주소를 검색하세요"}
              </Text>
              <Ionicons name="search" size={20} color="#8A2BE2" />
            </TouchableOpacity>
          </View>

          {/* 모구 마감 */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="alarm-outline" size={18} color="#666" />
              <Text style={styles.label}>모구 마감</Text>
            </View>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity 
                style={[styles.selectButton, styles.dateTimeButton, errors.deadlineMonth && styles.errorInput]}
                onPress={() => setShowDeadlineMonthModal(true)}
              >
                <Text style={[styles.selectButtonText, !deadlineMonth && styles.placeholder]}>
                  {deadlineMonth || "월"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#8A2BE2" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.selectButton, styles.dateTimeButton, errors.deadlineDay && styles.errorInput]}
                onPress={() => setShowDeadlineDayModal(true)}
              >
                <Text style={[styles.selectButtonText, !deadlineDay && styles.placeholder]}>
                  {deadlineDay || "일"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#8A2BE2" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.selectButton, styles.dateTimeButton, errors.deadlineHour && styles.errorInput]}
                onPress={() => setShowDeadlineHourModal(true)}
              >
                <Text style={[styles.selectButtonText, !deadlineHour && styles.placeholder]}>
                  {deadlineHour || "시간"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#8A2BE2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 가격 정보 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cash" size={22} color="#8A2BE2" />
            <Text style={styles.sectionTitle}>가격 정보</Text>
          </View>

          {/* 구매 가격 */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="card-outline" size={18} color="#666" />
              <Text style={styles.label}>구매 가격</Text>
            </View>
            <View style={styles.priceInputWrapper}>
              <TextInput
                style={[styles.input, styles.priceInput, errors.purchasePrice && styles.errorInput]}
                value={purchasePrice}
                onChangeText={(text) => {
                  setPurchasePrice(text);
                  setErrors((prev) => ({ ...prev, purchasePrice: false }));
                }}
                placeholder="상품 원래 구매 금액"
                keyboardType="numeric"
              />
              <Text style={styles.currencyLabel}>원</Text>
            </View>
          </View>

        {/* 수수료율 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>수수료율 (수고비)</Text>

          {/* 슬라이더 바 */}
          <View style={styles.commissionSliderCard}>
            <View style={styles.commissionValueDisplay}>
              <Text style={styles.commissionValueText}>{commissionRate}%</Text>
            </View>
            
            <View style={styles.commissionSliderWrapper}>
              <View style={styles.sliderTrackBackground}>
                <View 
                  style={[
                    styles.sliderTrackFill, 
                    { width: `${(commissionRate / 200) * 100}%` }
                  ]} 
                />
              </View>
              <Slider
                style={styles.commissionSlider}
                minimumValue={0}
                maximumValue={200}
                step={5}
                value={commissionRate}
                onValueChange={(value) => {
                  setCommissionRate(value);
                  setErrors((prev) => ({ ...prev, commissionRate: false }));
                }}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor="#8A2BE2"
              />
            </View>

            <View style={styles.commissionRangeLabels}>
              <Text style={styles.rangeLabel}>0%</Text>
              <Text style={styles.rangeLabel}>50%</Text>
              <Text style={styles.rangeLabel}>100%</Text>
              <Text style={styles.rangeLabel}>150%</Text>
              <Text style={styles.rangeLabel}>200%</Text>
            </View>
          </View>

          {/* 최종 가격 */}
          {purchasePrice && !isNaN(parseFloat(purchasePrice)) && (
            <View style={styles.finalPriceContainer}>
              <View style={styles.finalPriceRow}>
                <Text style={styles.finalPriceLabel}>최종 판매 가격</Text>
                <Text style={styles.finalPriceValue}>
                  {Math.round(parseFloat(purchasePrice) * (commissionRate / 100)).toLocaleString()}원
                </Text>
              </View>
              <View style={styles.finalPriceDetail}>
                <Text style={styles.finalPriceDetailText}>
                  원가 {parseFloat(purchasePrice).toLocaleString()}원 × {commissionRate}%
                </Text>
              </View>
            </View>
          )}
        </View>
        </View>

        {/* 만남 일정 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={22} color="#8A2BE2" />
            <Text style={styles.sectionTitle}>만남 일정</Text>
          </View>

         {/* 만남 날짜 */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <Text style={styles.label}>만남 날짜</Text>
            </View>
            <View style={styles.dateTimeContainer}>

            {/* 년도 선택 */}
            <TouchableOpacity
              style={[styles.selectButton, styles.dateTimeButton, errors.meetupYear && styles.errorInput]}
              onPress={() => setShowMeetupYearModal(true)}
            >
              <Text style={[styles.selectButtonText, !meetupYear && styles.placeholder]}>
                {meetupYear || "년"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#8A2BE2" />
            </TouchableOpacity>

            {/* 월 선택 */}
            <TouchableOpacity
              style={[styles.selectButton, styles.dateTimeButton, errors.meetupMonth && styles.errorInput]}
              onPress={() => setShowMeetupMonthModal(true)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  !meetupMonth && styles.placeholder,
                ]}
              >
                {meetupMonth || "월"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#8A2BE2" />
            </TouchableOpacity>

            {/* 일 선택 */}
            <TouchableOpacity
              style={[styles.selectButton, styles.dateTimeButton, errors.meetupDay && styles.errorInput]}
              onPress={() => setShowMeetupDayModal(true)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  !meetupDay && styles.placeholder,
                ]}
              >
                {meetupDay || "일"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#8A2BE2" />
            </TouchableOpacity>

          </View>
        </View>


         {/* 만남 시간 */}
         <View style={styles.inputGroup}>
           <View style={styles.labelRow}>
             <Ionicons name="time-outline" size={18} color="#666" />
             <Text style={styles.label}>만남 시간</Text>
           </View>
           <View style={styles.dateTimeContainer}>
             <TouchableOpacity 
               style={[styles.selectButton, styles.dateTimeButton, errors.meetupHour && styles.errorInput]}
               onPress={() => setShowMeetupHourModal(true)}
             >
               <Text style={[styles.selectButtonText, !meetupHour && styles.placeholder]}>
                 {meetupHour || "시"}
               </Text>
               <Ionicons name="chevron-down" size={16} color="#8A2BE2" />
             </TouchableOpacity>
             <TouchableOpacity 
               style={[styles.selectButton, styles.dateTimeButton, errors.meetupMinute && styles.errorInput]}
               onPress={() => setShowMeetupMinuteModal(true)}
             >
               <Text style={[styles.selectButtonText, !meetupMinute && styles.placeholder]}>
                 {meetupMinute || "분"}
               </Text>
               <Ionicons name="chevron-down" size={16} color="#8A2BE2" />
             </TouchableOpacity>
           </View>
         </View>
        </View>

        {/* 등록 버튼 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>모구 등록하기</Text>
        </TouchableOpacity>
       </ScrollView>

       {/* 카테고리 선택 모달 */}
       <Modal
         visible={showCategoryModal}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setShowCategoryModal(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>카테고리 선택</Text>
               <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                 <Ionicons name="close" size={24} color="#333" />
               </TouchableOpacity>
             </View>
             <FlatList
               data={CATEGORIES}
               keyExtractor={(item, index) => index.toString()}
               renderItem={({ item }) => (
                 <TouchableOpacity
                   style={styles.modalItem}
                   onPress={() => {
                     setCategory(item);
                     setShowCategoryModal(false);
                     setErrors((prev) => ({ ...prev, category: false }));
                   }}
                 >
                   <Text style={styles.modalItemText}>{item}</Text>
                   {category === item && (
                     <Ionicons name="checkmark" size={20} color="#e91e63" />
                   )}
                 </TouchableOpacity>
               )}
             />
           </View>
         </View>
       </Modal>

       {/* 주소 검색 모달 */}
       <Modal
         visible={showAddressModal}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setShowAddressModal(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>주소 검색</Text>
               <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                 <Ionicons name="close" size={24} color="#333" />
               </TouchableOpacity>
             </View>
             <View style={styles.searchContainer}>
               <TextInput
                 style={styles.searchInput}
                 placeholder="주소를 입력하세요"
                 value={addressQuery}
                 onChangeText={(text) => {
                   setAddressQuery(text);
                   searchAddress(text);
                 }}
               />
               <Ionicons name="search" size={20} color="#666" />
             </View>
            <FlatList
              data={addressResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                 <TouchableOpacity
                   style={styles.modalItem}
                   onPress={() => {
                     setGroupLocation(item.address);
                     setShowAddressModal(false);
                     setAddressQuery("");
                     setAddressResults([]);
                     setErrors((prev) => ({ ...prev, groupLocation: false }));
                   }}
                 >
                   <Text style={styles.modalItemText}>{item.address}</Text>
                 </TouchableOpacity>
               )}
               ListEmptyComponent={
                 addressQuery.length >= 2 ? (
                   <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                 ) : (
                   <Text style={styles.emptyText}>주소를 검색해보세요.</Text>
                 )
               }
             />
           </View>
         </View>
       </Modal>

      {/* 간단한 선택 모달 생성 함수 */}
       {showGroupCountModal && (
         <Modal
           visible={showGroupCountModal}
           transparent={true}
           animationType="slide"
           onRequestClose={() => setShowGroupCountModal(false)}
         >
           <View style={styles.modalOverlay}>
             <View style={styles.modalContent}>
               <View style={styles.modalHeader}>
                 <Text style={styles.modalTitle}>모구러 선택</Text>
                 <TouchableOpacity onPress={() => setShowGroupCountModal(false)}>
                   <Ionicons name="close" size={24} color="#333" />
                 </TouchableOpacity>
               </View>
               <FlatList
                 data={["2명", "3명", "4명", "5명", "6명", "7명", "8명", "9명", "10명"]}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({ item }) => (
                   <TouchableOpacity
                     style={styles.modalItem}
                     onPress={() => {
                       setGroupCount(parseInt(item.replace("명", ""), 10));
                       setShowGroupCountModal(false);
                     }}
                   >
                     <Text style={styles.modalItemText}>{item}</Text>
                   </TouchableOpacity>
                 )}
               />
             </View>
           </View>
         </Modal>
       )}

      {showDeadlineMonthModal && (
        <Modal
          visible={showDeadlineMonthModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDeadlineMonthModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>월 선택</Text>
                <TouchableOpacity onPress={() => setShowDeadlineMonthModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={generateMonths(new Date().getFullYear())}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setDeadlineMonth(item);
                      // 월 변경 시, 일자가 최대값보다 크면 초기화
                      const currentYear = new Date().getFullYear();
                      const maxDay = getDaysInMonth(parseInt(item.replace("월", ""), 10), currentYear);
                      if (deadlineDay) {
                        const d = parseInt(deadlineDay.replace("일", ""), 10);
                        if (d > maxDay) setDeadlineDay("");
                      }
                       setShowDeadlineMonthModal(false);
                       setErrors((prev) => ({ ...prev, deadlineMonth: false }));
                     }}
                   >
                     <Text style={styles.modalItemText}>{item}</Text>
                   </TouchableOpacity>
                 )}
               />
             </View>
           </View>
         </Modal>
       )}

      {showDeadlineDayModal && (
        <Modal
          visible={showDeadlineDayModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDeadlineDayModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>일 선택</Text>
                <TouchableOpacity onPress={() => setShowDeadlineDayModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={generateDaysFor(deadlineMonth, new Date().getFullYear())}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setDeadlineDay(item);
                      setShowDeadlineDayModal(false);
                      setErrors((prev) => ({ ...prev, deadlineDay: false }));
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}

      {showDeadlineHourModal && (
        <Modal
          visible={showDeadlineHourModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDeadlineHourModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>시간 선택</Text>
                <TouchableOpacity onPress={() => setShowDeadlineHourModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={generateHours(new Date().getFullYear(), deadlineMonth, deadlineDay)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setDeadlineHour(item);
                      setShowDeadlineHourModal(false);
                      setErrors((prev) => ({ ...prev, deadlineHour: false }));
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* 만남 월 선택 */}
      {showMeetupMonthModal && (
        <Modal
          visible={showMeetupMonthModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMeetupMonthModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>월 선택</Text>
                <TouchableOpacity onPress={() => setShowMeetupMonthModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={generateMonths(meetupYear ? parseInt(meetupYear.replace("년", ""), 10) : new Date().getFullYear())}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setMeetupMonth(item);
                      // 월 변경 시, 일자가 최대값보다 크면 초기화
                      const selectedMeetupYear = meetupYear ? parseInt(meetupYear.replace("년", ""), 10) : new Date().getFullYear();
                      const maxDay = getDaysInMonth(parseInt(item.replace("월", ""), 10), selectedMeetupYear);
                      if (meetupDay) {
                        const d = parseInt(meetupDay.replace("일", ""), 10);
                        if (d > maxDay) setMeetupDay("");
                      }
                      setShowMeetupMonthModal(false);
                      setErrors((prev) => ({ ...prev, meetupMonth: false }));
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* 만남 일 선택 */}
      {showMeetupDayModal && (
        <Modal
          visible={showMeetupDayModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMeetupDayModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>일 선택</Text>
                <TouchableOpacity onPress={() => setShowMeetupDayModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={generateDaysFor(meetupMonth, meetupYear ? parseInt(meetupYear.replace("년", ""), 10) : new Date().getFullYear())}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setMeetupDay(item);
                      setShowMeetupDayModal(false);
                      setErrors((prev) => ({ ...prev, meetupDay: false }));
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* 만남 시간 선택 */}
      {showMeetupHourModal && (
        <Modal
          visible={showMeetupHourModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMeetupHourModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>시 선택</Text>
                <TouchableOpacity onPress={() => setShowMeetupHourModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={generateHours(
                  meetupYear ? parseInt(meetupYear.replace("년", ""), 10) : new Date().getFullYear(),
                  meetupMonth,
                  meetupDay
                )}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setMeetupHour(item);
                      setShowMeetupHourModal(false);
                      setErrors((prev) => ({ ...prev, meetupHour: false }));
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* 만남 분 선택 */}
      {showMeetupMinuteModal && (
        <Modal
          visible={showMeetupMinuteModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMeetupMinuteModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>분 선택</Text>
                <TouchableOpacity onPress={() => setShowMeetupMinuteModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={generateMinutes(
                  meetupYear ? parseInt(meetupYear.replace("년", ""), 10) : new Date().getFullYear(),
                  meetupMonth,
                  meetupDay,
                  meetupHour
                )}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setMeetupMinute(item);
                      setShowMeetupMinuteModal(false);
                      setErrors((prev) => ({ ...prev, meetupMinute: false }));
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* 만남 년도 선택 */}
      {showMeetupYearModal && (
        <Modal
          visible={showMeetupYearModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMeetupYearModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>년도 선택</Text>
                <TouchableOpacity onPress={() => setShowMeetupYearModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={generateYears()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setMeetupYear(item);
                      setShowMeetupYearModal(false);
                      setErrors((prev) => ({ ...prev, meetupYear: false }));
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}
     </SafeAreaView>
   );
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 25,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8A2BE2",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#f3e5f5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    flex: 1,
    marginRight: 8,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#8A2BE2",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
    shadowColor: "#8A2BE2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
   submitButtonText: {
     color: "#fff",
     fontSize: 18,
     fontWeight: "bold",
     marginLeft: 8,
   },
   selectButton: {
     borderWidth: 1.5,
     borderColor: "#e0e0e0",
     borderRadius: 12,
     paddingHorizontal: 16,
     paddingVertical: 14,
     backgroundColor: "#fff",
     flexDirection: "row",
     justifyContent: "space-between",
     alignItems: "center",
   },
   selectButtonText: {
     fontSize: 15,
     color: "#333",
   },
   placeholder: {
     color: "#aaa",
   },
   dateTimeContainer: {
     flexDirection: "row",
     justifyContent: "space-between",
     gap: 8,
   },
  dateTimeButton: {
    flex: 1,
  },
  commissionSliderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  commissionValueDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  commissionValueText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#8A2BE2',
    letterSpacing: 1,
  },
  commissionSliderWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  sliderTrackBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginTop: -4,
    overflow: 'hidden',
  },
  sliderTrackFill: {
    height: '100%',
    backgroundColor: '#8A2BE2',
    borderRadius: 4,
  },
  commissionSlider: {
    width: '100%',
    height: 40,
  },
  commissionRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  rangeLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
   modalOverlay: {
     flex: 1,
     backgroundColor: "rgba(0, 0, 0, 0.5)",
     justifyContent: "flex-end",
   },
   modalContent: {
     backgroundColor: "#fff",
     borderTopLeftRadius: 20,
     borderTopRightRadius: 20,
     maxHeight: "80%",
     paddingBottom: 20,
   },
   modalHeader: {
     flexDirection: "row",
     justifyContent: "space-between",
     alignItems: "center",
     padding: 20,
     borderBottomWidth: 1,
     borderBottomColor: "#f0f0f0",
   },
   modalTitle: {
     fontSize: 18,
     fontWeight: "bold",
     color: "#333",
   },
   modalItem: {
     flexDirection: "row",
     justifyContent: "space-between",
     alignItems: "center",
     paddingHorizontal: 20,
     paddingVertical: 15,
     borderBottomWidth: 1,
     borderBottomColor: "#f8f8f8",
   },
   modalItemText: {
     fontSize: 16,
     color: "#333",
   },
   searchContainer: {
     flexDirection: "row",
     alignItems: "center",
     margin: 20,
     paddingHorizontal: 16,
     paddingVertical: 12,
     borderWidth: 1,
     borderColor: "#ddd",
     borderRadius: 8,
     backgroundColor: "#fff",
   },
   searchInput: {
     flex: 1,
     fontSize: 14,
     color: "#333",
   },
   emptyText: {
     textAlign: "center",
     color: "#666",
     fontSize: 14,
     marginTop: 40,
   },
   errorInput: {
    borderColor: "red",
  },
  groupCountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupCountInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#333",
  },
  groupCountUnit: {
    fontSize: 16,
    color: "#8A2BE2",
    fontWeight: "700",
    marginLeft: 10,
  },
  groupCountHint: {
    fontSize: 13,
    color: "#999",
    marginTop: 8,
  },
  finalPriceContainer: {
    marginTop: 10,
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#8A2BE2",
    shadowColor: "#8A2BE2",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  finalPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  finalPriceLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  finalPriceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8A2BE2",
  },
  finalPriceDetail: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  finalPriceDetailText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
 });

// src/screens/SignupWizardScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import axios from "axios";
import api from "../utils/api";

interface Props {
  onComplete: () => void;
}

const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY ?? "";

export default function SignupWizardScreen({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    phone: "010-",
    birth: "",
    gender: "",
    familySize: "",
    address: "",
    wishTimes: [] as number[],
    markets: [] as string[],
  });
  const [selectedWishSpots, setSelectedWishSpots] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // refs
  const nameRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

  const searchAddress = async (text: string) => {
    if (text.length < 2) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get(
        "https://dapi.kakao.com/v2/local/search/address.json",
        {
          params: { 
            query: text,
            size: 15
          },
          headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
        }
      );
      setResults(res.data?.documents || []);
    } catch (e) {
      console.error("주소 검색 오류", e);
      setResults([]);
    }
  };

  // ✅ 온보딩 완료 → 서버 저장
  const handleOnboardingComplete = async () => {
    try {
      setLoading(true);
      
       // ✅ DB 저장 코드 주석처리
       // const res = await api.patch("/api/users/me", {
       //   name: formData.name,
       //   phone_number: formData.phone,
       //   gender: formData.gender,
       //   household_size: formData.familySize,
       //   nickname: formData.nickname,
       //   birth_date: formData.birth,
       //   wish_spots: selectedWishSpots,
       //   interested_categories: selectedInterests,
       //   wish_times: formData.wishTimes,
       //   wish_markets: formData.markets,
       // });

      // ✅ 가입 정보 요약 모달 표시
      setShowSummaryModal(true);
      
    } catch (error: any) {
      console.error("온보딩 완료 실패:", error.response?.data || error.message);
      Alert.alert("에러", "온보딩을 완료하는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 서비스 이용하기 버튼 클릭
  const handleStartService = () => {
    setShowSummaryModal(false);
    onComplete();
  };

  // ✅ 다음 단계
  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      await handleOnboardingComplete();
    }
  };

  // ✅ 이전 단계
  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // ✅ 유효성 검사
  const isFormValid = () => {
     if (step === 1) {
       const phoneDigits = formData.phone.replace(/[^0-9]/g, "");
       return formData.name.trim() !== "" && 
              formData.nickname.trim() !== "" &&
              formData.phone.trim() !== "" && 
              formData.phone !== "010-" &&
              phoneDigits.length === 11 &&
              phoneDigits.startsWith('010') &&
              formData.birth.trim() !== "" && 
              formData.gender !== "" && 
              formData.familySize !== "";
    } else if (step === 2) {
      return selectedInterests.length > 0;
     } else if (step === 3) {
       return selectedWishSpots.length > 0;
    } else if (step === 4) {
      return formData.wishTimes.length > 0;
    } else if (step === 5) {
      return formData.markets.length > 0;
    }
    return false;
  };

  // ✅ 유효성 검사와 함께 다음 단계
  const handleNextWithValidation = () => {
    if (!isFormValid()) {
      // 유효성 검사 실패 시 에러 표시
      const errors: string[] = [];
       if (step === 1) {
         if (formData.name.trim() === "") errors.push("name");
         if (formData.nickname.trim() === "") errors.push("nickname");
         if (formData.phone.trim() === "" || formData.phone === "010-") errors.push("phone");
         if (formData.birth.trim() === "") errors.push("birth");
         if (formData.gender === "") errors.push("gender");
         if (formData.familySize === "") errors.push("familySize");
      } else if (step === 2) {
        errors.push("interests");
       } else if (step === 3) {
         errors.push("wishSpots");
      } else if (step === 4) {
        errors.push("wishTimes");
      } else if (step === 5) {
        errors.push("markets");
      }
      setValidationErrors(errors);
      
      // 첫 번째 에러 필드로 포커스
      if (step === 1) {
        if (formData.name.trim() === "") nameRef.current?.focus();
        else if (formData.nickname.trim() === "") nicknameRef.current?.focus();
        else if (formData.phone.trim() === "") phoneRef.current?.focus();
       } else if (step === 3) {
         // 위시스팟 선택 에러는 별도 처리
      }
      return;
    }
    
    setValidationErrors([]);
    handleNext();
  };

  return (
    <View style={styles.container}>
      {/* 프로그레스바 */}
      <View style={styles.progressContainer}>
        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <View key={stepNum} style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                step >= stepNum ? styles.stepCircleActive : styles.stepCircleInactive
              ]}>
                <Text style={[
                  styles.stepText,
                  step >= stepNum ? styles.stepTextActive : styles.stepTextInactive
                ]}>
                  {stepNum}
      </Text>
              </View>
              {stepNum < 5 && (
                <View style={[
                  styles.stepConnector,
                  step > stepNum ? styles.stepConnectorActive : styles.stepConnectorInactive
                ]} />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 제목 */}
      <View style={styles.titleContainer}>
      <Text style={styles.title}>
        {step === 1
          ? "개인정보 입력"
          : step === 2
          ? "관심상품 선택"
          : step === 3
          ? "위시스팟 설정"
            : step === 4
            ? "위시타임 설정"
            : step === 5
            ? "위시마켓 선택"
            : ""}
      </Text>
        {step > 1 && (
          <Text style={styles.subtitle}>
            {step === 2
              ? "관심 있는 상품 카테고리를 선택해주세요"
              : step === 3
              ? "자주 가는 장소를 설정해주세요"
              : step === 4
              ? "모구하고 싶은 시간대를 선택해주세요"
              : step === 5
              ? "선호하는 마켓을 선택해주세요"
              : ""}
      </Text>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContainer}>
          {/* STEP 1: 개인정보 입력 */}
      {step === 1 && (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>이름</Text>
          <TextInput
            ref={nameRef}
                  placeholder="나모구"
                  style={[
                    styles.input,
                    validationErrors.includes("name") && styles.inputError,
                  ]}
            value={formData.name}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, name: text }));
                    if (validationErrors.includes("name")) {
                      setValidationErrors(prev => prev.filter(field => field !== "name"));
                    }
                  }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>닉네임</Text>
          <TextInput
            ref={nicknameRef}
                  placeholder="모구모구 창시자"
                  style={[
                    styles.input,
                    validationErrors.includes("nickname") && styles.inputError,
                  ]}
            value={formData.nickname}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, nickname: text }));
                    if (validationErrors.includes("nickname")) {
                      setValidationErrors(prev => prev.filter(field => field !== "nickname"));
                    }
                  }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>전화번호</Text>
          <TextInput
            ref={phoneRef}
                  placeholder="010-0000-0000"
                  style={[
                    styles.input,
                    validationErrors.includes("phone") && styles.inputError,
                  ]}
            value={formData.phone}
                   onChangeText={(text) => {
                     // 010-이 삭제되면 다시 추가
                     if (!text.startsWith('010-')) {
                       setFormData(prev => ({ ...prev, phone: '010-' }));
                       return;
                     }
                     
                     // 숫자만 추출 (010- 제외)
                     const numbers = text.replace(/[^0-9]/g, '').substring(3); // 010 제외
                     
                     // 8자리 제한 (010-XXXX-XXXX에서 XXXX-XXXX 부분)
                     if (numbers.length > 8) {
                       return;
                     }
                     
                     // 자동 포맷팅: 010-XXXX-XXXX
                     let formatted = '010-';
                     if (numbers.length > 0) {
                       formatted += numbers.substring(0, 4);
                       if (numbers.length > 4) {
                         formatted += '-' + numbers.substring(4);
                       }
                     }
                     
                     setFormData(prev => ({ ...prev, phone: formatted }));
                     if (validationErrors.includes("phone")) {
                       setValidationErrors(prev => prev.filter(field => field !== "phone"));
                     }
                   }}
            keyboardType="numeric"
                  maxLength={13} // 010-0000-0000 = 13자리
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>생년월일</Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    validationErrors.includes("birth") && styles.inputError,
                  ]}
                  onPress={() => setDatePickerVisibility(true)}
                >
                  <Text style={[styles.inputText, formData.birth ? styles.inputTextFilled : styles.inputTextPlaceholder]}>
                    {formData.birth || "생년월일을 입력해주세요."}
                  </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
                  onConfirm={(date) => {
                    setFormData(prev => ({ ...prev, birth: moment(date).format("YYYY.MM.DD") }));
                    setDatePickerVisibility(false);
                    if (validationErrors.includes("birth")) {
                      setValidationErrors(prev => prev.filter(field => field !== "birth"));
                    }
                  }}
            onCancel={() => setDatePickerVisibility(false)}
                  maximumDate={new Date()}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>성별</Text>
                 <View style={styles.genderContainer}>
                   <TouchableOpacity
                     style={[
                       styles.genderButton,
                       formData.gender === "남자" ? styles.genderButtonActive : styles.genderButtonInactive,
                       validationErrors.includes("gender") && formData.gender !== "남자" && styles.genderButtonError,
                     ]}
                     onPress={() => {
                       setFormData(prev => ({ ...prev, gender: "남자" }));
                       if (validationErrors.includes("gender")) {
                         setValidationErrors(prev => prev.filter(field => field !== "gender"));
                       }
                     }}
                   >
                     <Text style={[
                       styles.genderButtonText,
                       formData.gender === "남자" ? styles.genderButtonTextActive : styles.genderButtonTextInactive,
                     ]}>
                       남자
                     </Text>
                   </TouchableOpacity>
                   <TouchableOpacity
                     style={[
                       styles.genderButton,
                       formData.gender === "여자" ? styles.genderButtonActive : styles.genderButtonInactive,
                       validationErrors.includes("gender") && formData.gender !== "여자" && styles.genderButtonError,
                     ]}
                     onPress={() => {
                       setFormData(prev => ({ ...prev, gender: "여자" }));
                       if (validationErrors.includes("gender")) {
                         setValidationErrors(prev => prev.filter(field => field !== "gender"));
                       }
                     }}
                   >
                     <Text style={[
                       styles.genderButtonText,
                       formData.gender === "여자" ? styles.genderButtonTextActive : styles.genderButtonTextInactive,
                     ]}>
                       여자
                     </Text>
                   </TouchableOpacity>
                 </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>가구수</Text>
                <View style={styles.familySizeContainer}>
                  {["1인", "2인", "3인", "4인 이상"].map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.familySizeButton,
                        formData.familySize === size ? styles.familySizeButtonActive : styles.familySizeButtonInactive,
                        validationErrors.includes("familySize") && formData.familySize !== size && styles.familySizeButtonError,
                      ]}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, familySize: size }));
                        if (validationErrors.includes("familySize")) {
                          setValidationErrors(prev => prev.filter(field => field !== "familySize"));
                        }
                      }}
                    >
                      <Text style={[
                        styles.familySizeButtonText,
                        formData.familySize === size ? styles.familySizeButtonTextActive : styles.familySizeButtonTextInactive,
                      ]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
        </View>
      )}

          {/* STEP 2: 관심상품 선택 */}
      {step === 2 && (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                
                <View style={styles.interestsContainer}>
                  {[
                    { id: "food", name: "식품/간식류", emoji: "🥘" },
                    { id: "beauty", name: "뷰티/헬스케어", emoji: "💄" },
                    { id: "home", name: "생활용품", emoji: "🧴" },
                    { id: "health", name: "패션/잡화", emoji: "👟" },
                  ].map((interest) => (
            <TouchableOpacity
                      key={interest.id}
                      style={[
                        styles.interestButton,
                        selectedInterests.includes(interest.name) ? styles.interestButtonActive : styles.interestButtonInactive,
                        validationErrors.includes("interests") && !selectedInterests.includes(interest.name) && styles.interestButtonError,
                      ]}
                      onPress={() => {
                        setSelectedInterests(prev => 
                          prev.includes(interest.name)
                            ? prev.filter(x => x !== interest.name)
                            : [...prev, interest.name]
                        );
                        if (validationErrors.includes("interests")) {
                          setValidationErrors(prev => prev.filter(field => field !== "interests"));
                        }
                      }}
                    >
                      <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                      <Text style={[
                        styles.interestText,
                        selectedInterests.includes(interest.name) ? styles.interestTextActive : styles.interestTextInactive,
                      ]}>
                        {interest.name}
                      </Text>
            </TouchableOpacity>
          ))}
                </View>
              </View>
        </View>
      )}

           {/* STEP 3: 위시스팟 설정 */}
      {step === 3 && (
             <View style={styles.formContainer}>
               <View style={styles.inputGroup}>
                 
          <TextInput
                   ref={addressRef}
                   placeholder="주소를 검색해주세요"
                   style={[
                     styles.input,
                     validationErrors.includes("wishSpots") && styles.inputError,
                   ]}
                   value={formData.address}
                   onChangeText={(text) => {
                     setFormData(prev => ({ ...prev, address: text }));
                     searchAddress(text);
                     if (validationErrors.includes("wishSpots")) {
                       setValidationErrors(prev => prev.filter(field => field !== "wishSpots"));
                     }
                   }}
                 />
                 
                 {results.length > 0 && (
                   <View style={styles.addressResultsContainer}>
                     <ScrollView 
                       style={styles.addressScrollView}
                       showsVerticalScrollIndicator={true}
                       nestedScrollEnabled={true}
                     >
          {results.map((r, idx) => (
            <TouchableOpacity
              key={idx}
                         style={styles.addressResultItem}
              onPress={() => {
                           const addressName = r.address_name;
                           if (!selectedWishSpots.includes(addressName)) {
                             setSelectedWishSpots(prev => [...prev, addressName]);
                           }
                           setFormData(prev => ({ ...prev, address: "" }));
                setResults([]);
                           if (validationErrors.includes("wishSpots")) {
                             setValidationErrors(prev => prev.filter(field => field !== "wishSpots"));
                           }
              }}
            >
                         <Text style={styles.addressResultText}>{r.address_name}</Text>
            </TouchableOpacity>
          ))}
                     </ScrollView>
        </View>
      )}

                 {/* 선택된 위시스팟 목록 */}
                 {selectedWishSpots.length > 0 && (
                   <View style={styles.selectedWishSpotsContainer}>
                     <Text style={styles.selectedWishSpotsTitle}>선택된 위시스팟</Text>
                     {selectedWishSpots.map((spot, index) => (
                       <View key={index} style={styles.selectedWishSpotItem}>
                         <Text style={styles.selectedWishSpotText}>{spot}</Text>
                         <TouchableOpacity
                           style={styles.removeWishSpotButton}
                           onPress={() => {
                             setSelectedWishSpots(prev => prev.filter((_, i) => i !== index));
                           }}
                         >
                           <Text style={styles.removeWishSpotButtonText}>×</Text>
                         </TouchableOpacity>
                       </View>
                     ))}
                   </View>
                 )}
               </View>
        </View>
      )}

          {/* STEP 4: 위시타임 설정 */}
      {step === 4 && (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                
                {/* 시간대별 색상 범례 */}
                <View style={styles.timeLegendContainer}>
                  <View style={styles.timeLegendItem}>
                    <View style={[styles.timeLegendColor, { backgroundColor: "#6366F1" }]} />
                    <Text style={styles.timeLegendText}>새벽 (0-5시)</Text>
                    <Text style={styles.timeLegendSubText}>한산</Text>
                  </View>
                  <View style={styles.timeLegendItem}>
                    <View style={[styles.timeLegendColor, { backgroundColor: "#F59E0B" }]} />
                    <Text style={styles.timeLegendText}>오전 (6-11시)</Text>
                    <Text style={styles.timeLegendSubText}>보통</Text>
                  </View>
                  <View style={styles.timeLegendItem}>
                    <View style={[styles.timeLegendColor, { backgroundColor: "#10B981" }]} />
                    <Text style={styles.timeLegendText}>오후 (12-17시)</Text>
                    <Text style={styles.timeLegendSubText}>보통</Text>
                  </View>
                  <View style={styles.timeLegendItem}>
                    <View style={[styles.timeLegendColor, { backgroundColor: "#EF4444" }]} />
                    <Text style={styles.timeLegendText}>저녁 (18-23시)</Text>
                    <Text style={styles.timeLegendSubText}>붐빔</Text>
                  </View>
                </View>
                
                 {/* 시간 막대바 */}
                 <View style={styles.timeBarContainer}>
                   {/* 0시~5시 */}
                   <View style={styles.timeBarRow}>
                     {Array.from({ length: 6 }, (_, i) => i).map((hour) => (
            <TouchableOpacity
                         key={hour}
                         style={[
                           styles.timeBar,
                           formData.wishTimes.includes(hour) ? styles.timeBarActive : styles.timeBarInactive,
                           validationErrors.includes("wishTimes") && !formData.wishTimes.includes(hour) && styles.timeBarError,
                           styles.timeBarNight,
                         ]}
                         onPress={() => {
                           setFormData(prev => ({
                  ...prev,
                             wishTimes: prev.wishTimes.includes(hour)
                               ? prev.wishTimes.filter(h => h !== hour)
                               : [...prev.wishTimes, hour]
                           }));
                           if (validationErrors.includes("wishTimes")) {
                             setValidationErrors(prev => prev.filter(field => field !== "wishTimes"));
                           }
                         }}
                       >
                         <Text style={[
                           styles.timeBarText,
                           formData.wishTimes.includes(hour) ? styles.timeBarTextActive : styles.timeBarTextInactive,
                         ]}>
                           {hour}시
                         </Text>
            </TouchableOpacity>
          ))}
                   </View>
                   
                   {/* 6시~11시 */}
                   <View style={styles.timeBarRow}>
                     {Array.from({ length: 6 }, (_, i) => i + 6).map((hour) => (
                       <TouchableOpacity
                         key={hour}
                         style={[
                           styles.timeBar,
                           formData.wishTimes.includes(hour) ? styles.timeBarActive : styles.timeBarInactive,
                           validationErrors.includes("wishTimes") && !formData.wishTimes.includes(hour) && styles.timeBarError,
                           styles.timeBarMorning,
                         ]}
                         onPress={() => {
                           setFormData(prev => ({
                             ...prev,
                             wishTimes: prev.wishTimes.includes(hour)
                               ? prev.wishTimes.filter(h => h !== hour)
                               : [...prev.wishTimes, hour]
                           }));
                           if (validationErrors.includes("wishTimes")) {
                             setValidationErrors(prev => prev.filter(field => field !== "wishTimes"));
                           }
                         }}
                       >
                         <Text style={[
                           styles.timeBarText,
                           formData.wishTimes.includes(hour) ? styles.timeBarTextActive : styles.timeBarTextInactive,
                         ]}>
                           {hour}시
                         </Text>
                       </TouchableOpacity>
                     ))}
                   </View>
                   
                   {/* 12시~17시 */}
                   <View style={styles.timeBarRow}>
                     {Array.from({ length: 6 }, (_, i) => i + 12).map((hour) => (
                       <TouchableOpacity
                         key={hour}
                         style={[
                           styles.timeBar,
                           formData.wishTimes.includes(hour) ? styles.timeBarActive : styles.timeBarInactive,
                           validationErrors.includes("wishTimes") && !formData.wishTimes.includes(hour) && styles.timeBarError,
                           styles.timeBarAfternoon,
                         ]}
                         onPress={() => {
                           setFormData(prev => ({
                             ...prev,
                             wishTimes: prev.wishTimes.includes(hour)
                               ? prev.wishTimes.filter(h => h !== hour)
                               : [...prev.wishTimes, hour]
                           }));
                           if (validationErrors.includes("wishTimes")) {
                             setValidationErrors(prev => prev.filter(field => field !== "wishTimes"));
                           }
                         }}
                       >
                         <Text style={[
                           styles.timeBarText,
                           formData.wishTimes.includes(hour) ? styles.timeBarTextActive : styles.timeBarTextInactive,
                         ]}>
                           {hour}시
                         </Text>
                       </TouchableOpacity>
                     ))}
                   </View>
                   
                   {/* 18시~23시 */}
                   <View style={styles.timeBarRow}>
                     {Array.from({ length: 6 }, (_, i) => i + 18).map((hour) => (
                       <TouchableOpacity
                         key={hour}
                         style={[
                           styles.timeBar,
                           formData.wishTimes.includes(hour) ? styles.timeBarActive : styles.timeBarInactive,
                           validationErrors.includes("wishTimes") && !formData.wishTimes.includes(hour) && styles.timeBarError,
                           styles.timeBarEvening,
                         ]}
                         onPress={() => {
                           setFormData(prev => ({
                             ...prev,
                             wishTimes: prev.wishTimes.includes(hour)
                               ? prev.wishTimes.filter(h => h !== hour)
                               : [...prev.wishTimes, hour]
                           }));
                           if (validationErrors.includes("wishTimes")) {
                             setValidationErrors(prev => prev.filter(field => field !== "wishTimes"));
                           }
                         }}
                       >
                         <Text style={[
                           styles.timeBarText,
                           formData.wishTimes.includes(hour) ? styles.timeBarTextActive : styles.timeBarTextInactive,
                         ]}>
                           {hour}시
                         </Text>
                       </TouchableOpacity>
                     ))}
                   </View>
                 </View>
              </View>

        </View>
      )}

          {/* STEP 5: 위시마켓 */}
          {step === 5 && (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                
                {/* 마켓 선택 버튼들 */}
                <View style={styles.marketContainer}>
                  {[
                    { id: "costco", name: "코스트코", emoji: "🛒" },
                    { id: "emart", name: "이마트", emoji: "🏪" },
                    { id: "traders", name: "트레이더스", emoji: "🛍️" },
                    { id: "homeplus", name: "홈플러스", emoji: "🏬" },
                    { id: "lottemart", name: "롯데마트", emoji: "🛒" },
                    { id: "gs25", name: "GS25", emoji: "🏪" },
                    { id: "cu", name: "CU", emoji: "🏪" },
                    { id: "7eleven", name: "세븐일레븐", emoji: "🏪" },
                  ].map((market) => (
            <TouchableOpacity
                      key={market.id}
                      style={[
                        styles.marketButton,
                        formData.markets.includes(market.name) ? styles.marketButtonActive : styles.marketButtonInactive,
                        validationErrors.includes("markets") && !formData.markets.includes(market.name) && styles.marketButtonError,
                      ]}
                      onPress={() => {
                        setFormData(prev => ({
                  ...prev,
                          markets: prev.markets.includes(market.name)
                            ? prev.markets.filter(m => m !== market.name)
                            : [...prev.markets, market.name]
                        }));
                        if (validationErrors.includes("markets")) {
                          setValidationErrors(prev => prev.filter(field => field !== "markets"));
                        }
                      }}
                    >
                      <Text style={styles.marketEmoji}>{market.emoji}</Text>
                      <Text style={[
                        styles.marketText,
                        formData.markets.includes(market.name) ? styles.marketTextActive : styles.marketTextInactive,
                      ]}>
                        {market.name}
                      </Text>
          </TouchableOpacity>
          ))}
                </View>
              </View>

            </View>
        )}
      </View>
    </ScrollView>

      {/* 하단 버튼들 */}
      {step === 1 && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.bottomButton, 
              !isFormValid() && styles.bottomButtonDisabled
            ]} 
            onPress={handleNextWithValidation} 
            disabled={loading}
          >
            <Text style={[
              styles.bottomButtonText,
              !isFormValid() && styles.bottomButtonTextDisabled
            ]}>
              {loading ? "저장 중..." : "다음"}
            </Text>
        </TouchableOpacity>
        </View>
      )}

        {step > 1 && (
        <View style={styles.bottomButtonContainer}>
          <View style={styles.bottomButtonRow}>
            <TouchableOpacity 
              style={styles.bottomPrevButton} 
              onPress={handlePrev}
            >
              <Text style={styles.bottomPrevButtonText}>이전</Text>
          </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.bottomNextButton, 
                !isFormValid() && styles.bottomNextButtonDisabled
              ]} 
              onPress={handleNextWithValidation} 
              disabled={loading}
            >
              <Text style={[
                styles.bottomNextButtonText,
                !isFormValid() && styles.bottomNextButtonTextDisabled
              ]}>
                {loading ? "저장 중..." : step < 5 ? "다음" : "완료"}
              </Text>
        </TouchableOpacity>
      </View>
         </View>
       )}

       {/* 가입 정보 요약 모달 */}
       <Modal
         visible={showSummaryModal}
         transparent={true}
         animationType="fade"
         onRequestClose={() => setShowSummaryModal(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContainer}>
             {/* 성공 아이콘 */}
             <View style={styles.successIconContainer}>
               <View style={styles.successIcon}>
                 <Text style={styles.successIconText}>🎉</Text>
               </View>
             </View>
             
             <Text style={styles.modalTitle}>가입 완료!</Text>
             <Text style={styles.modalSubtitle}>모구와 함께 시작해보세요</Text>
             
             <ScrollView style={styles.modalContent}>
               {/* 개인정보 */}
               <View style={styles.summarySection}>
                 <View style={styles.summarySectionHeader}>
                   <Text style={styles.summarySectionIcon}>👤</Text>
                   <Text style={styles.summarySectionTitle}>개인정보</Text>
                 </View>
                 <View style={styles.summaryCard}>
                   <View style={styles.summaryItem}>
                     <Text style={styles.summaryLabel}>이름</Text>
                     <Text style={styles.summaryValue}>{formData.name}</Text>
                   </View>
                   <View style={styles.summaryItem}>
                     <Text style={styles.summaryLabel}>닉네임</Text>
                     <Text style={styles.summaryValue}>{formData.nickname}</Text>
                   </View>
                   <View style={styles.summaryItem}>
                     <Text style={styles.summaryLabel}>전화번호</Text>
                     <Text style={styles.summaryValue}>{formData.phone}</Text>
                   </View>
                   <View style={styles.summaryItem}>
                     <Text style={styles.summaryLabel}>생년월일</Text>
                     <Text style={styles.summaryValue}>{formData.birth}</Text>
                   </View>
                   <View style={styles.summaryItem}>
                     <Text style={styles.summaryLabel}>성별</Text>
                     <Text style={styles.summaryValue}>{formData.gender}</Text>
                   </View>
                   <View style={styles.summaryItem}>
                     <Text style={styles.summaryLabel}>가구수</Text>
                     <Text style={styles.summaryValue}>{formData.familySize}</Text>
                   </View>
                 </View>
               </View>

               {/* 관심상품 */}
               <View style={styles.summarySection}>
                 <View style={styles.summarySectionHeader}>
                   <Text style={styles.summarySectionIcon}>🛍️</Text>
                   <Text style={styles.summarySectionTitle}>관심상품</Text>
                 </View>
                 <View style={styles.summaryCard}>
                   {selectedInterests.map((interest, index) => (
                     <View key={index} style={styles.summaryItem}>
                       <Text style={styles.summaryValue}>• {interest}</Text>
                     </View>
                   ))}
                 </View>
               </View>

               {/* 위시스팟 */}
               <View style={styles.summarySection}>
                 <View style={styles.summarySectionHeader}>
                   <Text style={styles.summarySectionIcon}>📍</Text>
                   <Text style={styles.summarySectionTitle}>위시스팟</Text>
                 </View>
                 <View style={styles.summaryCard}>
                   {selectedWishSpots.map((spot, index) => (
                     <View key={index} style={styles.summaryItem}>
                       <Text style={styles.summaryValue}>• {spot}</Text>
                     </View>
                   ))}
                 </View>
               </View>

               {/* 위시타임 */}
               <View style={styles.summarySection}>
                 <View style={styles.summarySectionHeader}>
                   <Text style={styles.summarySectionIcon}>⏰</Text>
                   <Text style={styles.summarySectionTitle}>위시타임</Text>
                 </View>
                 <View style={styles.summaryCard}>
                   <View style={styles.summaryItem}>
                     <Text style={styles.summaryValue}>
                       {formData.wishTimes.length > 0 
                         ? formData.wishTimes.sort((a, b) => a - b).map(hour => `${hour}시`).join(', ')
                         : '선택된 시간이 없습니다'
                       }
                     </Text>
                   </View>
                 </View>
               </View>

               {/* 위시마켓 */}
               <View style={styles.summarySection}>
                 <View style={styles.summarySectionHeader}>
                   <Text style={styles.summarySectionIcon}>🏪</Text>
                   <Text style={styles.summarySectionTitle}>위시마켓</Text>
                 </View>
                 <View style={styles.summaryCard}>
                   {formData.markets.map((market, index) => (
                     <View key={index} style={styles.summaryItem}>
                       <Text style={styles.summaryValue}>• {market}</Text>
                     </View>
                   ))}
                 </View>
               </View>
             </ScrollView>

             <TouchableOpacity 
               style={styles.startServiceButton} 
               onPress={handleStartService}
             >
               <Text style={styles.startServiceButtonIcon}>🚀</Text>
               <Text style={styles.startServiceButtonText}>모구 시작하기</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
   progressContainer: {
     paddingTop: 50,
     paddingHorizontal: 20,
     paddingBottom: 30,
   },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  stepCircleActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  stepCircleInactive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
  },
  stepText: {
    fontSize: 12,
    fontWeight: "600",
  },
  stepTextActive: {
    color: "#fff",
  },
  stepTextInactive: {
    color: "#9CA3AF",
  },
  stepConnector: {
    width: 20,
    height: 1,
    marginHorizontal: 6,
    borderStyle: "dashed",
    borderWidth: 1,
  },
  stepConnectorActive: {
    borderColor: "#8B5CF6",
  },
  stepConnectorInactive: {
    borderColor: "#D1D5DB",
  },
   titleContainer: {
     alignItems: "center",
     paddingBottom: 30,
   },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputText: {
    fontSize: 16,
  },
  inputTextFilled: {
    color: "#111827",
  },
  inputTextPlaceholder: {
    color: "#9CA3AF",
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
  },
  genderButtonActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  genderButtonInactive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  genderButtonError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  genderButtonTextActive: {
    color: "#fff",
  },
  genderButtonTextInactive: {
    color: "#8B5CF6",
  },
  familySizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  familySizeButton: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
  },
  familySizeButtonActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  familySizeButtonInactive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  familySizeButtonError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  familySizeButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  familySizeButtonTextActive: {
    color: "#fff",
  },
  familySizeButtonTextInactive: {
    color: "#8B5CF6",
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  bottomButton: {
    backgroundColor: "#6B7280",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bottomButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomButtonTextDisabled: {
    color: "#9CA3AF",
  },
  bottomButtonRow: {
    flexDirection: "row",
    gap: 12,
  },
  bottomPrevButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  bottomPrevButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNextButton: {
    flex: 1,
    backgroundColor: "#6B7280",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bottomNextButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  bottomNextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNextButtonTextDisabled: {
    color: "#9CA3AF",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 16,
    justifyContent: "center",
  },
  interestButton: {
    width: "42%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderWidth: 2,
  },
  interestButtonActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  interestButtonInactive: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
  },
  interestButtonError: {
    borderColor: "#EF4444",
  },
  interestEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  interestTextActive: {
    color: "#fff",
  },
  interestTextInactive: {
    color: "#374151",
  },
   addressResultsContainer: {
     maxHeight: 150,
    borderWidth: 1,
     borderColor: "#D1D5DB",
     borderRadius: 8,
     backgroundColor: "#fff",
     marginTop: 4,
   },
   addressScrollView: {
     maxHeight: 150,
   },
  addressResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
   addressResultText: {
     fontSize: 14,
     color: "#374151",
   },
   selectedWishSpotsContainer: {
     marginTop: 20,
   },
   selectedWishSpotsTitle: {
     fontSize: 16,
     fontWeight: "600",
     color: "#111827",
     marginBottom: 12,
   },
   selectedWishSpotItem: {
     flexDirection: "row",
     alignItems: "center",
     justifyContent: "space-between",
     backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
     marginBottom: 8,
     borderWidth: 1,
     borderColor: "#E5E7EB",
   },
   selectedWishSpotText: {
     fontSize: 14,
     color: "#374151",
     flex: 1,
   },
   removeWishSpotButton: {
     width: 24,
     height: 24,
     borderRadius: 12,
     backgroundColor: "#EF4444",
     alignItems: "center",
     justifyContent: "center",
     marginLeft: 8,
   },
   removeWishSpotButtonText: {
     color: "#fff",
     fontSize: 16,
     fontWeight: "bold",
   },
  timeLegendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  timeLegendItem: {
    alignItems: "center",
    flex: 1,
  },
  timeLegendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  timeLegendText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  timeLegendSubText: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
  },
   timeBarContainer: {
     gap: 20,
   },
   timeBarRow: {
     flexDirection: "row",
     gap: 12,
   },
   timeBar: {
     flex: 1,
     height: 60,
     borderRadius: 12,
     alignItems: "center",
     justifyContent: "center",
     borderWidth: 2,
     shadowColor: "#000",
     shadowOffset: {
       width: 0,
       height: 2,
     },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
   },
  timeBarActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
    transform: [{ scale: 1.05 }],
  },
  timeBarInactive: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
  },
  timeBarError: {
    borderColor: "#EF4444",
  },
  timeBarNight: {
    borderColor: "#6366F1",
  },
  timeBarMorning: {
    borderColor: "#F59E0B",
  },
  timeBarAfternoon: {
    borderColor: "#10B981",
  },
  timeBarEvening: {
    borderColor: "#EF4444",
  },
   timeBarText: {
     fontSize: 16,
     fontWeight: "600",
   },
  timeBarTextActive: {
    color: "#fff",
  },
  timeBarTextInactive: {
    color: "#374151",
  },
  marketContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
    marginBottom: -20,
    justifyContent: "center",
  },
  marketButton: {
    width: "45%",
    aspectRatio: 1.2,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  marketButtonActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
    transform: [{ scale: 1.05 }],
  },
  marketButtonInactive: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
  },
  marketButtonError: {
    borderColor: "#EF4444",
  },
  marketEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  marketText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  marketTextActive: {
    color: "#fff",
  },
   marketTextInactive: {
     color: "#6B7280",
   },
   modalOverlay: {
     flex: 1,
     backgroundColor: "rgba(0, 0, 0, 0.6)",
     justifyContent: "center",
     alignItems: "center",
   },
   modalContainer: {
     backgroundColor: "#fff",
     borderRadius: 24,
     padding: 28,
     margin: 20,
     maxHeight: "85%",
     width: "90%",
     shadowColor: "#000",
     shadowOffset: {
       width: 0,
       height: 10,
     },
     shadowOpacity: 0.25,
     shadowRadius: 20,
     elevation: 10,
   },
   successIconContainer: {
     alignItems: "center",
     marginBottom: 16,
   },
   successIcon: {
     width: 80,
     height: 80,
     borderRadius: 40,
     backgroundColor: "#F0F9FF",
     alignItems: "center",
     justifyContent: "center",
     borderWidth: 3,
     borderColor: "#8B5CF6",
   },
   successIconText: {
     fontSize: 40,
   },
   modalTitle: {
     fontSize: 28,
     fontWeight: "bold",
     color: "#111827",
     textAlign: "center",
     marginBottom: 8,
   },
   modalSubtitle: {
     fontSize: 16,
     color: "#6B7280",
     textAlign: "center",
     marginBottom: 24,
   },
   modalContent: {
     maxHeight: 400,
   },
   summarySection: {
     marginBottom: 24,
   },
   summarySectionHeader: {
     flexDirection: "row",
     alignItems: "center",
     marginBottom: 12,
   },
   summarySectionIcon: {
     fontSize: 20,
     marginRight: 8,
   },
   summarySectionTitle: {
     fontSize: 18,
     fontWeight: "700",
     color: "#111827",
   },
   summaryCard: {
     backgroundColor: "#F8FAFC",
     borderRadius: 12,
     padding: 16,
     borderWidth: 1,
     borderColor: "#E2E8F0",
   },
   summaryItem: {
     flexDirection: "row",
     justifyContent: "space-between",
     alignItems: "center",
     paddingVertical: 8,
     borderBottomWidth: 1,
     borderBottomColor: "#E2E8F0",
   },
   summaryLabel: {
     fontSize: 14,
     color: "#64748B",
     fontWeight: "500",
     flex: 1,
   },
   summaryValue: {
     fontSize: 14,
     color: "#111827",
     fontWeight: "600",
     flex: 2,
     textAlign: "right",
   },
   startServiceButton: {
     backgroundColor: "#8B5CF6",
     paddingVertical: 18,
     borderRadius: 16,
     alignItems: "center",
     marginTop: 24,
     flexDirection: "row",
     justifyContent: "center",
     shadowColor: "#8B5CF6",
     shadowOffset: {
       width: 0,
       height: 4,
     },
     shadowOpacity: 0.3,
     shadowRadius: 8,
     elevation: 6,
   },
   startServiceButtonIcon: {
     fontSize: 20,
     marginRight: 8,
   },
   startServiceButtonText: {
     color: "#fff",
     fontSize: 18,
     fontWeight: "700",
   },
});
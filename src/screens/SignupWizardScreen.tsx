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
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import axios from "axios";
import api from "../utils/api";

const KAKAO_REST_API_KEY: string =
  process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY ?? "";

interface Props {
  onComplete: () => void; // ✅ 온보딩 완료 후 호출
}

export default function SignupWizardScreen({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    phone: "010-",
    birth: "", // YYYY-MM-DD
    gender: "",
    familySize: "",
    address: "",
    markets: [] as string[],
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // refs
  const nameRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const birthRef = useRef<TextInput>(null);

  // ✅ 입력 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      let numericValue = value.replace(/[^0-9]/g, "");
      if (!numericValue.startsWith("010")) {
        numericValue = "010" + numericValue.slice(3);
      }
      if (numericValue.length > 11) {
        numericValue = numericValue.slice(0, 11);
      }
      let formatted = numericValue;
      if (numericValue.length > 3 && numericValue.length <= 7) {
        formatted = numericValue.slice(0, 3) + "-" + numericValue.slice(3);
      } else if (numericValue.length > 7) {
        formatted =
          numericValue.slice(0, 3) +
          "-" +
          numericValue.slice(3, 7) +
          "-" +
          numericValue.slice(7);
      }
      setFormData({ ...formData, phone: formatted });
      return;
    }
    setFormData({ ...formData, [field]: value });
  };

  // ✅ 생일 선택
  const handleConfirmDate = (date: Date) => {
    const formatted = moment(date).format("YYYY-MM-DD");
    setFormData({ ...formData, birth: formatted });
    setDatePickerVisibility(false);
  };

  // ✅ 주소 검색 (카카오 API)
  const searchAddress = async (text: string) => {
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get(
        "https://dapi.kakao.com/v2/local/search/address.json",
        {
          params: { query: text },
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
      const res = await api.patch("/api/users/me", {
        name: formData.name,
        phone_number: formData.phone,
        gender: formData.gender,
        household_size: formData.familySize, // Enum: 1인 / 2인 / 3인 / 4인_이상
        nickname: formData.nickname,
        birth_date: formData.birth, // YYYY-MM-DD
        wish_spots: formData.address,
        interested_categories: selectedInterests,
        wish_markets: formData.markets,
      });

      if (res.data?.status === "active") {
        Alert.alert("가입 완료", "온보딩을 마쳤습니다!", [
          { text: "확인", onPress: () => onComplete() },
        ]);
      } else {
        Alert.alert("알림", "입력값이 부족합니다. 다시 확인해주세요.");
      }
    } catch (error: any) {
      console.error("온보딩 저장 실패:", error.response?.data || error.message);
      Alert.alert("에러", "가입 정보를 저장하는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 다음 단계
  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      await handleOnboardingComplete();
    }
  };

  const handlePrev = () => step > 1 && setStep(step - 1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {step === 1
          ? "개인정보 입력"
          : step === 2
          ? "관심상품 선택"
          : step === 3
          ? "위시스팟 설정"
          : "위시 마켓 선택"}
      </Text>

      {/* STEP 1: 개인정보 */}
      {step === 1 && (
        <View>
          <TextInput
            ref={nameRef}
            placeholder="이름"
            style={styles.input}
            value={formData.name}
            onChangeText={(t) => handleInputChange("name", t)}
          />
          <TextInput
            ref={nicknameRef}
            placeholder="닉네임"
            style={styles.input}
            value={formData.nickname}
            onChangeText={(t) => handleInputChange("nickname", t)}
          />
          <TextInput
            ref={phoneRef}
            placeholder="전화번호"
            keyboardType="numeric"
            style={styles.input}
            value={formData.phone}
            onChangeText={(t) => handleInputChange("phone", t)}
          />
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <TextInput
              ref={birthRef}
              placeholder="생년월일 YYYY-MM-DD"
              style={styles.input}
              value={formData.birth}
              editable={false}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </View>
      )}

      {/* STEP 2: 관심상품 */}
      {step === 2 && (
        <View>
          <Text>관심상품을 선택하세요</Text>
          {["생필품류", "식품/건강식품", "화장품류", "뷰티소품류"].map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.choiceBtn}
              onPress={() =>
                setSelectedInterests((prev) =>
                  prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                )
              }
            >
              <Text>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* STEP 3: 위시스팟 */}
      {step === 3 && (
        <View>
          <TextInput
            placeholder="주소 검색"
            style={styles.input}
            onChangeText={searchAddress}
          />
          {results.map((r, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                setFormData({ ...formData, address: r.address_name });
                setIsAddressSelected(true);
                setResults([]);
              }}
            >
              <Text>{r.address_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* STEP 4: 위시마켓 */}
      {step === 4 && (
        <View>
          <Text>위시마켓 선택</Text>
          {["코스트코", "이마트", "트레이더스"].map((m) => (
            <TouchableOpacity
              key={m}
              style={styles.choiceBtn}
              onPress={() =>
                setFormData((prev) => ({
                  ...prev,
                  markets: prev.markets.includes(m)
                    ? prev.markets.filter((x) => x !== m)
                    : [...prev.markets, m],
                }))
              }
            >
              <Text>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 버튼 */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        {step > 1 && (
          <TouchableOpacity style={styles.btn} onPress={handlePrev}>
            <Text style={styles.btnText}>이전</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btn} onPress={handleNext} disabled={loading}>
          <Text style={styles.btnText}>{loading ? "저장 중..." : step < 4 ? "다음" : "완료"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    backgroundColor: "#e91e63",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  choiceBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
});

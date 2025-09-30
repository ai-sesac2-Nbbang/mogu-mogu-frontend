// src/screens/SignupWizardScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

interface Props {
  onComplete: () => void;
}

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
    markets: [] as string[],
  });

  const [errors, setErrors] = useState({
    name: "",
    nickname: "",
    phone: "",
    birth: "",
    gender: "",
    familySize: "",
    address: "",
    interests: "",
    markets: "",
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // ✅ 입력창 refs
  const nameRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const birthRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

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
      setErrors((prev) => ({ ...prev, phone: "" })); // ✅ 입력 시 에러 해제
      return;
    }

    setFormData({ ...formData, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    const formattedDate = moment(date).format("YYYY.MM.DD");
    setFormData({ ...formData, birth: formattedDate });
    setErrors((prev) => ({ ...prev, birth: "" }));
    hideDatePicker();
  };

  const toggleMarket = (market: string) => {
    setFormData((prev) => ({
      ...prev,
      markets: prev.markets.includes(market)
        ? prev.markets.filter((m) => m !== market)
        : [...prev.markets, market],
    }));
    setErrors((prev) => ({ ...prev, markets: "" }));
  };

  // 🚨 입력값 검증 함수
  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || formData.name.length < 2) {
        setErrors((prev) => ({ ...prev, name: "이름은 2글자 이상 입력해주세요." }));
        nameRef.current?.focus();
        return false;
      }
      if (!formData.nickname || formData.nickname.length < 2) {
        setErrors((prev) => ({ ...prev, nickname: "닉네임은 2글자 이상 입력해주세요." }));
        nicknameRef.current?.focus();
        return false;
      }
      if (!formData.phone || formData.phone.length < 13) {
        setErrors((prev) => ({ ...prev, phone: "전화번호를 올바르게 입력해주세요." }));
        phoneRef.current?.focus();
        return false;
      }
      if (!formData.birth) {
        setErrors((prev) => ({ ...prev, birth: "생년월일을 입력해주세요." }));
        birthRef.current?.focus();
        return false;
      }
      if (!formData.gender) {
        setErrors((prev) => ({ ...prev, gender: "성별을 선택해주세요." }));
        return false;
      }
      if (!formData.familySize) {
        setErrors((prev) => ({ ...prev, familySize: "가구원 수를 선택해주세요." }));
        return false;
      }
    }
    if (step === 2 && selectedInterests.length === 0) {
      setErrors((prev) => ({ ...prev, interests: "관심상품을 선택해주세요." }));
      return false;
    }
    if (step === 3 && !formData.address) {
      setErrors((prev) => ({ ...prev, address: "주소를 입력해주세요." }));
      addressRef.current?.focus();
      return false;
    }
    if (step === 4 && formData.markets.length === 0) {
      setErrors((prev) => ({ ...prev, markets: "위시마켓을 선택해주세요." }));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      setShowCompleteModal(true);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* STEP Indicator */}
      <View style={[styles.header, { marginTop: "5%" }]}>
        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4].map((s) => (
            <View key={s} style={styles.stepWrapper}>
              <Text style={styles.stepNumber}>{s}</Text>
              <Text style={[styles.stepDot, step === s && styles.stepActive]}>●</Text>
            </View>
          ))}
        </View>
        <Text style={styles.headerTitle}>
          {step === 1
            ? "개인정보 입력"
            : step === 2
            ? "관심상품 설정"
            : step === 3
            ? "위시스팟"
            : "위시 마켓"}
        </Text>
      </View>

      {/* STEP 1: 개인정보 */}
      {step === 1 && (
        <View style={styles.form}>
          {/* 이름 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              ref={nameRef}
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="이름을 입력해 주세요"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          {/* 닉네임 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              ref={nicknameRef}
              style={[styles.input, errors.nickname ? styles.inputError : null]}
              placeholder="사용하실 닉네임"
              value={formData.nickname}
              onChangeText={(text) => handleInputChange("nickname", text)}
            />
            {errors.nickname ? <Text style={styles.errorText}>{errors.nickname}</Text> : null}
          </View>

          {/* 전화번호 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>전화번호</Text>
            <TextInput
              ref={phoneRef}
              style={[styles.input, errors.phone ? styles.inputError : null]}
              keyboardType="numeric"
              placeholder="010-0000-0000"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              maxLength={13}
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          {/* 생년월일 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>생년월일</Text>
            <TouchableOpacity onPress={showDatePicker}>
              <TextInput
                ref={birthRef}
                style={[styles.input, errors.birth ? styles.inputError : null]}
                placeholder="ex) 1998.01.01"
                value={formData.birth}
                editable={false}
              />
            </TouchableOpacity>
            {errors.birth ? <Text style={styles.errorText}>{errors.birth}</Text> : null}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={new Date(1998, 0, 1)}
              maximumDate={new Date()}
            />
          </View>

          {/* 성별 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderButtons}>
              {["남자", "여자"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    formData.gender === gender && styles.genderButtonSelected,
                    errors.gender ? styles.buttonError : null,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, gender });
                    setErrors((prev) => ({ ...prev, gender: "" }));
                  }}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === gender && styles.genderButtonTextSelected,
                    ]}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
          </View>

          {/* 가구원 수 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>가구원 수</Text>
            <View style={styles.familyButtons}>
              {["1인", "2인", "3인", "4인 이상"].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.familyButton,
                    formData.familySize === size && styles.familyButtonSelected,
                    errors.familySize ? styles.buttonError : null,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, familySize: size });
                    setErrors((prev) => ({ ...prev, familySize: "" }));
                  }}
                >
                  <Text
                    style={[
                      styles.familyButtonText,
                      formData.familySize === size && { color: "#fff" },
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.familySize ? <Text style={styles.errorText}>{errors.familySize}</Text> : null}
          </View>
        </View>
      )}

      {/* STEP 2: 관심상품 */}
      {step === 2 && (
        <View style={styles.form}>
          <Text style={styles.label}>관심상품을 선택하세요. (중복 가능)</Text>
          <View style={styles.interestGrid}>
            {[
              { id: "1", name: "생필품류", icon: "🧴" },
              { id: "2", name: "식품/건강식품", icon: "🥗" },
              { id: "3", name: "화장품류", icon: "💄" },
              { id: "4", name: "뷰티소품류", icon: "💅" },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.interestButton,
                  selectedInterests.includes(item.id) && styles.interestButtonSelected,
                  errors.interests ? styles.buttonError : null,
                ]}
                onPress={() => {
                  setSelectedInterests((prev) =>
                    prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                  );
                  setErrors((prev) => ({ ...prev, interests: "" }));
                }}
              >
                <Text style={styles.interestIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.interestText,
                    selectedInterests.includes(item.id) && styles.interestTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.interests ? <Text style={styles.errorText}>{errors.interests}</Text> : null}
        </View>
      )}

      {/* STEP 3: 위시스팟 */}
      {step === 3 && (
        <View style={styles.form}>
          <Text style={styles.label}>위시스팟 주소 입력</Text>
          <TextInput
            ref={addressRef}
            style={[styles.input, errors.address ? styles.inputError : null]}
            placeholder="도로명 주소를 입력하세요"
            value={formData.address}
            onChangeText={(text) => handleInputChange("address", text)}
          />
          {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
        </View>
      )}

      {/* STEP 4: 위시마켓 */}
      {step === 4 && (
        <View style={styles.form}>
          <Text style={styles.label}>위시 마켓을 선택하세요</Text>
          <View style={styles.marketGrid}>
            {[
              "코스트코",
              "이마트",
              "트레이더스",
              "편의점",
              "홈플러스",
              "동네마트",
              "노브랜드",
              "전통시장",
              "하이마트",
              "기타",
            ].map((market) => (
              <TouchableOpacity
                key={market}
                style={[
                  styles.marketButton,
                  formData.markets.includes(market) && styles.marketButtonSelected,
                  errors.markets ? styles.buttonError : null,
                ]}
                onPress={() => toggleMarket(market)}
              >
                <Text
                  style={[
                    styles.marketText,
                    formData.markets.includes(market) && styles.marketTextSelected,
                  ]}
                >
                  {market}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.markets ? <Text style={styles.errorText}>{errors.markets}</Text> : null}
        </View>
      )}

      {/* 버튼 */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.nextBtn, { flex: 1, marginRight: 10 }]}
            onPress={handlePrev}
          >
            <Text style={styles.nextText}>이전</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, { flex: 1, marginLeft: step > 1 ? 10 : 0 }]}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>{step < 4 ? "다음" : "완료"}</Text>
        </TouchableOpacity>
      </View>

      {/* 가입 완료 모달 */}
      <Modal visible={showCompleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={styles.modalText}>가입 완료</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowCompleteModal(false);
                setShowInfoModal(true);
              }}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* 가입 정보 확인 모달 */}
      {/* 가입 정보 확인 모달 */}
      <Modal visible={showInfoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>내 가입 정보</Text>
            <View style={{ marginTop: 10 }}>
              <Text>이름: {formData.name}</Text>
              <Text>닉네임: {formData.nickname}</Text>
              <Text>전화번호: {formData.phone}</Text>
              <Text>생년월일: {formData.birth}</Text>
              <Text>성별: {formData.gender}</Text>
              <Text>가구원: {formData.familySize}</Text>
              <Text>주소: {formData.address}</Text>
              <Text>관심상품: {selectedInterests.join(", ")}</Text>
              <Text>위시마켓: {formData.markets.join(", ")}</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowInfoModal(false);
                onComplete();
              }}
            >
              <Text style={styles.modalButtonText}>메인으로</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", padding: 20 },
  header: { marginBottom: 30 },
  stepIndicator: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  stepWrapper: { alignItems: "center", marginHorizontal: 10 },
  stepNumber: { fontSize: 12, color: "#666", marginBottom: 5 },
  stepDot: { fontSize: 20, color: "#ddd" },
  stepActive: { color: "#e91e63" },
  headerTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  form: { paddingHorizontal: 20 },
  inputGroup: { marginBottom: 10 },
  label: { fontSize: 14, color: "#333", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: { borderColor: "#ff0000", borderWidth: 2 },
  errorText: { color: "#ff0000", fontSize: 12, marginTop: 5 },
  genderButtons: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    margin: 5,
  },
  genderButtonSelected: { backgroundColor: "#e91e63", borderColor: "#e91e63" },
  genderButtonText: { color: "#666", fontSize: 16 },
  genderButtonTextSelected: { color: "#fff" },
  familyButtons: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  familyButton: {
    flex: 1,
    minWidth: "45%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  familyButtonSelected: { backgroundColor: "#e91e63", borderColor: "#e91e63" },
  familyButtonText: { color: "#666", fontSize: 16 },
  interestGrid: { flexDirection: "row", flexWrap: "wrap", gap: 15, marginTop: 20 },
  interestButton: {
    width: "47%",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  interestButtonSelected: { borderColor: "#e91e63", backgroundColor: "#fff" },
  interestIcon: { fontSize: 28, marginBottom: 8 },
  interestText: { fontSize: 14, color: "#666", fontWeight: "500" },
  interestTextSelected: { color: "#e91e63", fontWeight: "bold" },
  marketGrid: { flexDirection: "row", flexWrap: "wrap", gap: 15, marginTop: 20 },
  marketButton: {
    width: "47%",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  marketButtonSelected: { borderColor: "#e91e63", backgroundColor: "#fff" },
  marketText: { fontSize: 14, color: "#666", fontWeight: "500" },
  marketTextSelected: { color: "#e91e63", fontWeight: "bold" },
  buttonError: { borderColor: "#ff0000", borderWidth: 2 },
  nextBtn: {
    backgroundColor: "#e91e63",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
    marginHorizontal: 20,
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  modalBox: {
    width: 280,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "center",
    marginTop: "60%",
  },
  modalIcon: { fontSize: 40, alignSelf: "center", marginBottom: 10 },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "center",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#e91e63",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: "center",
    width: "50%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)", // ✅ 반투명 회색 배경
  justifyContent: "flex-start",
  alignItems: "center",
},
});

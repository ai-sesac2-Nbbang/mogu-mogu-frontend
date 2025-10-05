import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY ?? "";

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  
  // 프로필 이미지 및 기본 정보
  const [profileImage, setProfileImage] = useState<string | null>("https://i.pinimg.com/originals/a0/d3/49/a0d349f1920e8c4c1d1fc01d2586be0c.png"); // 기본 라이언 이미지
  const [nickname, setNickname] = useState('살림하는 라이언');
  const [bio, setBio] = useState('모구모구와 함께 현명한 소비해요!');
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  
  // 개인 정보
  const [name, setName] = useState('김모구');
  const [phoneNumber, setPhoneNumber] = useState('010-1234-5678');
  const [birthdate, setBirthdate] = useState('1990-01-01');
  const [gender, setGender] = useState('여성');
  const [email, setEmail] = useState('user@example.com');
  const [address, setAddress] = useState('서울특별시 강남구');
  
  // 관심 키워드 (다중 선택)
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(['생필품류', '식품/건강식품']);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const availableKeywords = ['생필품류', '식품/건강식품', '화장품류', '뷰티소품류'];
  
  // 위시 마켓 (다중 선택)
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['이마트', '코스트코']);
  const [showMarketModal, setShowMarketModal] = useState(false);
  const availableMarkets = ['코스트코', '이마트', '트레이더스', '홈플러스', '롯데마트', '노브랜드'];
  
  // 위시 시간 (다중 선택)
  const [selectedTimes, setSelectedTimes] = useState<number[]>([14, 15, 16]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const availableTimes = Array.from({ length: 24 }, (_, i) => i);
  
  // 주소 검색
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const [addressResults, setAddressResults] = useState<any[]>([]);
  
  // 생일 선택
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
  // 저장 확인 모달
  const [isSaveConfirmModalVisible, setSaveConfirmModalVisible] = useState(false);
  
  // 저장 완료 모달
  const [isSaveSuccessModalVisible, setSaveSuccessModalVisible] = useState(false);

  // TODO: DB에서 사용자 프로필 정보 불러오기
  /*
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          const profile = response.data.profile;
          setProfileImage(profile.profileImage);
          setNickname(profile.nickname);
          setBio(profile.bio);
          setName(profile.name);
          setPhoneNumber(profile.phoneNumber);
          setBirthdate(profile.birthdate);
          setGender(profile.gender);
          setEmail(profile.email);
          setAddress(profile.address);
          setSelectedKeywords(profile.interestKeywords);
          setSelectedMarkets(profile.wishMarkets);
          setSelectedTimes(profile.wishTimes);
        }
      } catch (error) {
        console.error('프로필 정보 조회 실패:', error);
        Alert.alert('오류', '프로필 정보를 불러오는데 실패했습니다.');
      }
    };
    
    fetchUserProfile();
  }, []);
  */

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 선택하려면 미디어 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    setIsNicknameValid(text.length > 0);
  };

  // 휴대폰 번호 자동 포맷팅
  const handlePhoneNumberChange = (text: string) => {
    let numericValue = text.replace(/[^0-9]/g, '');
    
    if (!numericValue.startsWith('010')) {
      numericValue = '010' + numericValue.slice(3);
    }
    
    if (numericValue.length > 11) {
      numericValue = numericValue.slice(0, 11);
    }
    
    let formatted = numericValue;
    if (numericValue.length > 3 && numericValue.length <= 7) {
      formatted = numericValue.slice(0, 3) + '-' + numericValue.slice(3);
    } else if (numericValue.length > 7) {
      formatted = numericValue.slice(0, 3) + '-' + numericValue.slice(3, 7) + '-' + numericValue.slice(7);
    }
    
    setPhoneNumber(formatted);
  };

  // 주소 검색
  const searchAddress = async (text: string) => {
    setAddressQuery(text);
    if (text.trim().length < 2) {
      setAddressResults([]);
      return;
    }

    try {
      const res = await axios.get(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
          params: { query: text },
          headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
        }
      );
      setAddressResults(res.data?.documents || []);
    } catch (e) {
      console.error('주소 검색 오류:', e);
      setAddressResults([]);
    }
  };

  // 관심 키워드 토글
  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  // 위시 마켓 토글
  const toggleMarket = (market: string) => {
    setSelectedMarkets(prev =>
      prev.includes(market)
        ? prev.filter(m => m !== market)
        : [...prev, market]
    );
  };

  // 위시 시간 토글
  const toggleTime = (time: number) => {
    setSelectedTimes(prev =>
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time].sort((a, b) => a - b)
    );
  };

  // 생일 선택
  const handleConfirmDate = (date: Date) => {
    const formatted = moment(date).format('YYYY-MM-DD');
    setBirthdate(formatted);
    setDatePickerVisibility(false);
  };

  const handleSaveProfile = () => {
    if (!isNicknameValid) {
      Alert.alert('유효성 오류', '닉네임을 확인해주세요.');
      return;
    }
    
    // 저장 확인 모달 표시
    setSaveConfirmModalVisible(true);
  };

  const confirmSaveProfile = () => {
    setSaveConfirmModalVisible(false);
    
    // TODO: 프로필 정보를 서버에 저장하는 로직 추가
    /*
    const updateProfile = async () => {
      try {
        const response = await axios.put('/api/user/profile', {
          profileImage,
          nickname,
          bio,
          name,
          phoneNumber,
          birthdate,
          gender,
          address,
          interestKeywords: selectedKeywords,
          wishMarkets: selectedMarkets,
          wishTimes: selectedTimes,
        }, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setSaveSuccessModalVisible(true);
        } else {
          Alert.alert('오류', response.data.message || '프로필 업데이트에 실패했습니다.');
        }
      } catch (error) {
        console.error('프로필 업데이트 실패:', error);
        Alert.alert('오류', '프로필 업데이트 중 오류가 발생했습니다.');
      }
    };
    
    updateProfile();
    */
    
    console.log('저장할 프로필 정보:', {
      profileImage,
      nickname,
      bio,
      name,
      phoneNumber,
      birthdate,
      gender,
      email,
      address,
      selectedKeywords,
      selectedMarkets,
      selectedTimes,
    });
    
    setSaveSuccessModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Image Section */}
        <View style={styles.imagePickerContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../../../assets/adaptive-icon.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity onPress={handleImagePick} style={styles.changeImageButton}>
            <Ionicons name="camera-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 닉네임 */}
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={[styles.input, !isNicknameValid && styles.inputError]}
          value={nickname}
          onChangeText={handleNicknameChange}
          placeholder="닉네임을 입력하세요"
          maxLength={10}
        />
        {!isNicknameValid && <Text style={styles.errorText}>닉네임은 필수 입력 항목입니다.</Text>}

        {/* 소개 */}
        <Text style={styles.label}>소개</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="자신을 소개해보세요"
          multiline
          numberOfLines={4}
          maxLength={100}
          textAlignVertical="top"
        />

        {/* 구분선 */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>개인 정보</Text>

        {/* 이름 */}
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="이름을 입력하세요"
        />

        {/* 이메일 (읽기 전용) */}
        <Text style={styles.label}>이메일</Text>
        <View style={styles.readOnlyInput}>
          <Text style={styles.readOnlyText}>{email}</Text>
        </View>

        {/* 휴대폰 번호 */}
        <Text style={styles.label}>휴대폰 번호</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder="010-0000-0000"
          keyboardType="phone-pad"
        />

        {/* 생일 */}
        <Text style={styles.label}>생일</Text>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={birthdate ? styles.readOnlyText : styles.placeholderText}>
            {birthdate || 'YYYY-MM-DD'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#999" />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
          maximumDate={new Date()}
        />

        {/* 성별 (읽기 전용) */}
        <Text style={styles.label}>성별</Text>
        <View style={styles.readOnlyInput}>
          <Text style={styles.readOnlyText}>{gender}</Text>
        </View>

        {/* 주소 */}
        <Text style={styles.label}>주소</Text>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => setShowAddressModal(true)}
        >
          <Text style={styles.readOnlyText}>{address}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* 구분선 */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>관심 정보</Text>

        {/* 관심 키워드 */}
        <Text style={styles.label}>관심 키워드</Text>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => setShowKeywordModal(true)}
        >
          <Text style={styles.selectButtonText}>
            {selectedKeywords.length > 0 ? `${selectedKeywords.length}개 선택됨` : '선택하세요'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </TouchableOpacity>
        <View style={styles.selectedItemsContainer}>
          {selectedKeywords.map((keyword) => (
            <TouchableOpacity
              key={keyword}
              style={styles.selectedItem}
              onPress={() => toggleKeyword(keyword)}
            >
              <Text style={styles.selectedItemText}>{keyword}</Text>
              <Ionicons name="close-circle" size={18} color="#e91e63" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 위시 마켓 */}
        <Text style={styles.label}>위시 마켓</Text>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => setShowMarketModal(true)}
        >
          <Text style={styles.selectButtonText}>
            {selectedMarkets.length > 0 ? `${selectedMarkets.length}개 선택됨` : '선택하세요'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </TouchableOpacity>
        <View style={styles.selectedItemsContainer}>
          {selectedMarkets.map((market) => (
            <TouchableOpacity
              key={market}
              style={styles.selectedItem}
              onPress={() => toggleMarket(market)}
            >
              <Text style={styles.selectedItemText}>{market}</Text>
              <Ionicons name="close-circle" size={18} color="#e91e63" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 위시 시간 */}
        <Text style={styles.label}>위시 시간</Text>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => setShowTimeModal(true)}
        >
          <Text style={styles.selectButtonText}>
            {selectedTimes.length > 0 ? `${selectedTimes.length}개 시간 선택됨` : '선택하세요'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </TouchableOpacity>
        <View style={styles.selectedItemsContainer}>
          {selectedTimes.map((time) => (
            <TouchableOpacity
              key={time}
              style={styles.selectedItem}
              onPress={() => toggleTime(time)}
            >
              <Text style={styles.selectedItemText}>{`${time}시`}</Text>
              <Ionicons name="close-circle" size={18} color="#e91e63" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 관심 키워드 모달 */}
      <Modal
        visible={showKeywordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowKeywordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>관심 키워드 선택</Text>
              <TouchableOpacity onPress={() => setShowKeywordModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {availableKeywords.map((keyword) => (
                <TouchableOpacity
                  key={keyword}
                  style={[
                    styles.modalItem,
                    selectedKeywords.includes(keyword) && styles.modalItemSelected
                  ]}
                  onPress={() => toggleKeyword(keyword)}
                >
                  <Text style={styles.modalItemText}>{keyword}</Text>
                  {selectedKeywords.includes(keyword) && (
                    <Ionicons name="checkmark" size={20} color="#e91e63" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 위시 마켓 모달 */}
      <Modal
        visible={showMarketModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMarketModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>위시 마켓 선택</Text>
              <TouchableOpacity onPress={() => setShowMarketModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {availableMarkets.map((market) => (
                <TouchableOpacity
                  key={market}
                  style={[
                    styles.modalItem,
                    selectedMarkets.includes(market) && styles.modalItemSelected
                  ]}
                  onPress={() => toggleMarket(market)}
                >
                  <Text style={styles.modalItemText}>{market}</Text>
                  {selectedMarkets.includes(market) && (
                    <Ionicons name="checkmark" size={20} color="#e91e63" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 위시 시간 모달 */}
      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>위시 시간 선택</Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {availableTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.modalItem,
                    selectedTimes.includes(time) && styles.modalItemSelected
                  ]}
                  onPress={() => toggleTime(time)}
                >
                  <Text style={styles.modalItemText}>{`${time}시`}</Text>
                  {selectedTimes.includes(time) && (
                    <Ionicons name="checkmark" size={20} color="#e91e63" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
                onChangeText={searchAddress}
              />
              <Ionicons name="search" size={20} color="#666" />
            </View>
            <FlatList
              data={addressResults}
              keyExtractor={(item, index) => `${item.address_name}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setAddress(item.road_address?.address_name || item.address_name);
                    setShowAddressModal(false);
                    setAddressQuery('');
                    setAddressResults([]);
                  }}
                >
                  <Text style={styles.modalItemText}>
                    {item.road_address?.address_name || item.address_name}
                  </Text>
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

      {/* 저장 확인 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSaveConfirmModalVisible}
        onRequestClose={() => setSaveConfirmModalVisible(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalView}>
            <Text style={styles.successModalTitle}>저장 확인</Text>
            <Text style={styles.successModalText}>
              프로필 정보를 저장하시겠습니까?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setSaveConfirmModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmSaveProfile}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 저장 완료 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSaveSuccessModalVisible}
        onRequestClose={() => {
          setSaveSuccessModalVisible(false);
          navigation.goBack();
        }}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalView}>
            <Text style={styles.successModalTitle}>저장 완료</Text>
            <Text style={styles.successModalText}>
              프로필 정보가 성공적으로 업데이트되었습니다.
            </Text>
            <TouchableOpacity
              style={styles.successModalButton}
              onPress={() => {
                setSaveSuccessModalVisible(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.successModalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#e91e63',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#e91e63',
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#666',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebf0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    fontSize: 14,
    color: '#e91e63',
    marginRight: 6,
  },
  inputError: {
    borderColor: '#e91e63',
  },
  errorText: {
    color: '#e91e63',
    fontSize: 12,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  modalItemSelected: {
    backgroundColor: '#fff5f8',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 40,
  },
  successModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  successModalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  successModalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  successModalButton: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    backgroundColor: '#e91e63',
    width: '100%',
  },
  successModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#ccc',
  },
  modalButtonConfirm: {
    backgroundColor: '#e91e63',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ProfileEditScreen;
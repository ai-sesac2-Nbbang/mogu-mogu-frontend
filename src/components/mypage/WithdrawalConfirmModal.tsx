import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface WithdrawalConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (enteredEmail: string) => void;
  expectedEmail: string;
}

const WithdrawalConfirmModal: React.FC<WithdrawalConfirmModalProps> = ({ isVisible, onClose, onConfirm, expectedEmail }) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false); // 이메일 유효성 검사 실패 상태 추가

  const handleConfirm = () => {
    if (enteredEmail.toLowerCase() !== expectedEmail.toLowerCase()) {
      setIsEmailInvalid(true); // 이메일이 일치하지 않으면 오류 상태 설정
      // Alert.alert("이메일 불일치", "입력하신 이메일이 등록된 카카오 계정 이메일과 일치하지 않습니다."); // Alert 대신 메시지 표시
    } else {
      setIsEmailInvalid(false); // 이메일이 일치하면 오류 상태 초기화
      onConfirm(enteredEmail);
      setEnteredEmail(''); // 입력 필드 초기화
    }
  };

  const handleClose = () => {
    setEnteredEmail(''); // 입력 필드 초기화
    setIsEmailInvalid(false); // 모달 닫을 때 오류 상태 초기화
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>회원 탈퇴 본인 확인</Text>
          <Text style={styles.modalText}>
            탈퇴를 완료하려면 가입된 카카오 계정 이메일을 입력해주세요.
            (<Text style={{ fontWeight: 'bold' }}>{expectedEmail}</Text>)
          </Text>
          <TextInput
            style={[styles.input, isEmailInvalid && styles.inputError]} // 오류 상태에 따라 스타일 적용
            onChangeText={(text) => { // 텍스트 변경 시 오류 상태 초기화
              setEnteredEmail(text);
              setIsEmailInvalid(false);
            }}
            value={enteredEmail}
            placeholder="카카오 계정 이메일 입력"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {isEmailInvalid && <Text style={styles.errorText}>이메일이 일치하지 않습니다. 다시 입력해주세요.</Text>} // 오류 메시지 조건부 렌더링
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={handleClose}
            >
              <Text style={styles.textStyle}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={handleConfirm}
            >
              <Text style={styles.textStyle}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
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
    width: Dimensions.get('window').width * 0.8,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -15, // TextInput의 marginBottom과 겹치지 않도록 조정
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#ccc',
  },
  buttonConfirm: {
    backgroundColor: '#8A2BE2',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default WithdrawalConfirmModal;

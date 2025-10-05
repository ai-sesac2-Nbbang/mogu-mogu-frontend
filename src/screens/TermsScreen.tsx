import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Term {
  id: string;
  title: string;
  icon: string;
  content: string;
}

const TermsScreen = () => {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 약관 및 정책 더미 데이터
  const terms: Term[] = [
    {
      id: '1',
      title: '서비스 이용약관',
      icon: 'document-text-outline',
      content: `제1조 (목적)
본 약관은 모구모구(이하 "회사")가 제공하는 공동구매 중개 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 공동구매 중개 플랫폼을 의미합니다.
2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.

제4조 (서비스의 제공)
1. 회사는 다음과 같은 서비스를 제공합니다:
   • 공동구매 게시글 작성 및 참여
   • 회원 간 메시지 기능
   • 거래 후기 작성 및 조회
   • 배지 시스템

제5조 (이용자의 의무)
1. 이용자는 관계 법령, 본 약관의 규정, 이용안내 및 서비스상에 공지한 주의사항을 준수하여야 합니다.
2. 이용자는 타인의 명의를 도용하여 회원가입을 할 수 없습니다.`,
    },
    {
      id: '2',
      title: '개인정보 처리방침',
      icon: 'shield-checkmark-outline',
      content: `모구모구(이하 "회사")는 이용자의 개인정보를 중요시하며, 개인정보보호법을 준수하고 있습니다.

제1조 (개인정보의 수집 항목 및 방법)
1. 수집하는 개인정보 항목:
   • 필수항목: 이름, 이메일, 휴대전화번호
   • 선택항목: 프로필 사진, 주소
   
2. 수집 방법:
   • 회원가입 시 이용자가 직접 입력
   • 서비스 이용 과정에서 자동 수집

제2조 (개인정보의 수집 및 이용목적)
회사는 수집한 개인정보를 다음의 목적으로 활용합니다:
1. 회원 관리: 회원제 서비스 이용에 따른 본인확인
2. 서비스 제공: 공동구매 중개 서비스 제공
3. 마케팅 및 광고: 이벤트 정보 및 참여기회 제공

제3조 (개인정보의 보유 및 이용기간)
1. 회사는 이용자의 개인정보를 회원 탈퇴 시까지 보유합니다.
2. 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.

제4조 (개인정보의 제3자 제공)
회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
1. 이용자가 사전에 동의한 경우
2. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

제5조 (개인정보의 안전성 확보조치)
회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
1. 개인정보 암호화
2. 해킹 등에 대비한 기술적 대책
3. 개인정보에 대한 접근 제한`,
    },
    {
      id: '3',
      title: '위치기반 서비스 이용약관',
      icon: 'location-outline',
      content: `제1조 (목적)
본 약관은 모구모구(이하 "회사")가 제공하는 위치기반서비스(이하 "서비스")와 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (서비스의 내용)
회사가 제공하는 위치기반서비스는 다음과 같습니다:
1. 현재 위치 기반 공동구매 게시글 검색
2. 거래 장소까지의 거리 표시
3. 근처 거래 장소 추천

제3조 (개인위치정보의 이용 또는 제공)
1. 회사는 개인위치정보를 이용하여 서비스를 제공하고자 하는 경우 본 약관에 고지하고 동의를 받습니다.
2. 회사는 이용자의 개인위치정보를 해당 이용자가 지정하는 제3자에게 제공하는 경우 매회 이용자에게 제공받는 자, 제공일시 및 제공목적을 즉시 통보합니다.

제4조 (개인위치정보의 보유 목적 및 기간)
1. 회사는 위치기반서비스 제공을 위해 필요한 최소한의 기간 동안 개인위치정보를 보유합니다.
2. 서비스 제공을 위해 필요한 경우를 제외하고는 즉시 파기합니다.

제5조 (손해배상)
회사는 위치정보의 보호 및 이용 등에 관한 법률 제15조 내지 제26조의 규정을 위반한 행위로 이용자에게 손해가 발생한 경우 그 손해를 배상할 책임이 있습니다.`,
    },
    {
      id: '4',
      title: '환불 정책',
      icon: 'card-outline',
      content: `제1조 (환불 대상)
다음의 경우 환불이 가능합니다:
1. 공동구매 모집이 취소된 경우
2. 상품에 하자가 있는 경우
3. 모집 인원이 미달된 경우

제2조 (환불 절차)
1. 환불 신청: 앱 내 고객센터를 통해 환불 신청
2. 환불 검토: 신청 후 3영업일 이내 검토
3. 환불 처리: 승인 후 5~7영업일 이내 환불

제3조 (환불 불가 사항)
다음의 경우 환불이 불가능합니다:
1. 이용자의 단순 변심으로 인한 경우
2. 거래가 완료된 후 상품을 수령한 경우
3. 이용자의 귀책사유로 상품이 훼손된 경우

제4조 (환불 방법)
환불은 결제 수단과 동일한 방법으로 진행됩니다:
1. 신용카드: 카드 승인 취소
2. 계좌이체: 입금 계좌로 환불
3. 간편결제: 해당 결제수단으로 환불`,
    },
    {
      id: '5',
      title: '커뮤니티 가이드라인',
      icon: 'people-outline',
      content: `모구모구는 모든 이용자가 안전하고 즐겁게 이용할 수 있는 커뮤니티를 만들기 위해 다음의 가이드라인을 운영합니다.

제1조 (금지 행위)
다음의 행위는 엄격히 금지됩니다:
1. 욕설, 비방, 차별적 발언
2. 허위 정보 게시
3. 타인의 개인정보 무단 공개
4. 상업적 광고 및 스팸
5. 불법 상품 거래

제2조 (게시글 작성 원칙)
1. 정확한 정보 제공: 상품명, 가격, 수량 등을 정확히 기재
2. 명확한 거래 조건: 거래 장소, 시간, 방법을 명확히 표시
3. 예의 바른 소통: 존중하는 태도로 대화

제3조 (신고 및 제재)
1. 가이드라인 위반 시 다른 이용자가 신고할 수 있습니다
2. 위반 정도에 따라 다음의 조치가 취해집니다:
   • 경고
   • 일시적 이용 정지
   • 영구 이용 정지

제4조 (건전한 거래 문화)
1. 약속 시간을 지켜주세요
2. 상품 상태를 정확히 전달해주세요
3. 정산은 투명하게 진행해주세요
4. 거래 후 후기를 남겨주세요`,
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>약관 및 정책</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 약관 목록 */}
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introBox}>
          <Ionicons name="information-circle" size={24} color="#8A2BE2" />
          <Text style={styles.introText}>
            모구모구의 약관 및 정책을 확인하실 수 있습니다.{'\n'}
            각 항목을 클릭하여 자세한 내용을 확인해주세요.
          </Text>
        </View>

        {terms.map((term) => (
          <TouchableOpacity
            key={term.id}
            style={[
              styles.termCard,
              expandedId === term.id && styles.termCardExpanded
            ]}
            onPress={() => toggleExpand(term.id)}
            activeOpacity={0.7}
          >
            <View style={styles.termHeader}>
              <View style={styles.termTitleRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name={term.icon as any} size={24} color="#8A2BE2" />
                </View>
                <Text style={styles.termTitle}>{term.title}</Text>
              </View>
              <Ionicons 
                name={expandedId === term.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            
            {expandedId === term.id && (
              <View style={styles.termContentContainer}>
                <View style={styles.divider} />
                <ScrollView 
                  style={styles.termContentScroll}
                  nestedScrollEnabled={true}
                >
                  <Text style={styles.termContent}>{term.content}</Text>
                </ScrollView>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* 문의 안내 */}
        <View style={styles.contactBox}>
          <Ionicons name="mail-outline" size={20} color="#8A2BE2" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactTitle}>문의사항이 있으신가요?</Text>
            <Text style={styles.contactText}>
              고객센터: support@mogumogu.com{'\n'}
              운영시간: 평일 09:00 - 18:00
            </Text>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    paddingTop: 50 + 15 + 40,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  introBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  introText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  termCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  termCardExpanded: {
    backgroundColor: '#fafafa',
    borderColor: '#8A2BE2',
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  termTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0e6fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  termContentContainer: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
  },
  termContentScroll: {
    maxHeight: 300,
  },
  termContent: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contactTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});

export default TermsScreen;
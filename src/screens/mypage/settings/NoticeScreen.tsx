import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  isImportant: boolean;
}

const NoticeScreen = () => {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 공지사항 더미 데이터
  const notices: Notice[] = [
    {
      id: '1',
      title: '🎉 모구모구 서비스 오픈 안내',
      date: '2025.10.05',
      content: '안녕하세요, 모구모구입니다!\n\n드디어 여러분과 함께할 수 있게 되어 기쁩니다. 모구모구는 이웃과 함께 공동구매를 통해 더 저렴하게 생필품을 구매할 수 있는 서비스입니다.\n\n주요 기능:\n• 공동구매 모집 및 참여\n• 실시간 채팅으로 소통\n• 거래 후기 시스템\n• 배지 획득으로 신뢰도 확인\n\n많은 이용 부탁드립니다. 감사합니다!',
      isImportant: true,
    },
    {
      id: '2',
      title: '안전한 거래를 위한 가이드',
      date: '2025.10.04',
      content: '모구모구를 이용하시는 모든 분들께 안전한 거래 환경을 제공하기 위해 다음 사항을 안내드립니다.\n\n안전 거래 수칙:\n1. 직거래 시 공공장소에서 만나세요\n2. 상품 상태를 꼼꼼히 확인하세요\n3. 정산은 투명하게 진행하세요\n4. 의심스러운 거래는 신고해주세요\n\n여러분의 안전한 거래를 위해 항상 노력하겠습니다.',
      isImportant: true,
    },
    {
      id: '3',
      title: '배지 시스템 업데이트',
      date: '2025.10.03',
      content: '새로운 배지 시스템이 추가되었습니다!\n\n이제 거래 활동에 따라 다양한 배지를 획득할 수 있습니다:\n• 첫 거래: 첫 거래 완료 시\n• 모구 달인: 10회 거래 완료 시\n• 친절왕: 좋은 후기 20개 이상\n• 빠른 손: 응답 속도가 빠른 경우\n\n배지를 모아서 신뢰도를 높여보세요!',
      isImportant: false,
    },
    {
      id: '4',
      title: '앱 사용 팁 - 키워드 알림 설정',
      date: '2025.10.02',
      content: '원하는 상품을 놓치지 마세요!\n\n키워드 알림 기능을 활용하면:\n• 관심 있는 상품 키워드 등록\n• 새 게시글 등록 시 즉시 알림\n• 빠른 참여로 원하는 상품 구매\n\n마이페이지 > 키워드 등록에서 설정하실 수 있습니다.',
      isImportant: false,
    },
    {
      id: '5',
      title: '정기 점검 안내',
      date: '2025.10.01',
      content: '서비스 품질 향상을 위한 정기 점검을 실시합니다.\n\n점검 일시: 매주 수요일 오전 2시 ~ 4시\n점검 내용: 서버 안정화 및 기능 개선\n\n점검 시간에는 일시적으로 서비스 이용이 제한될 수 있습니다. 양해 부탁드립니다.',
      isImportant: false,
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
        <Text style={styles.headerTitle}>공지사항</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 공지사항 목록 */}
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {notices.map((notice) => (
          <TouchableOpacity
            key={notice.id}
            style={[
              styles.noticeCard,
              notice.isImportant && styles.noticeCardImportant,
              expandedId === notice.id && styles.noticeCardExpanded
            ]}
            onPress={() => toggleExpand(notice.id)}
            activeOpacity={0.7}
          >
            <View style={styles.noticeHeader}>
              <View style={styles.noticeTitleRow}>
                {notice.isImportant && (
                  <View style={styles.importantBadge}>
                    <Text style={styles.importantBadgeText}>중요</Text>
                  </View>
                )}
                <Text style={styles.noticeTitle} numberOfLines={expandedId === notice.id ? undefined : 1}>
                  {notice.title}
                </Text>
              </View>
              <Ionicons 
                name={expandedId === notice.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            
            <Text style={styles.noticeDate}>{notice.date}</Text>
            
            {expandedId === notice.id && (
              <View style={styles.noticeContentContainer}>
                <View style={styles.divider} />
                <Text style={styles.noticeContent}>{notice.content}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* 안내 문구 */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#8A2BE2" />
          <Text style={styles.infoText}>
            궁금한 사항이 있으시면 고객센터로 문의해주세요.
          </Text>
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
  noticeCard: {
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
  noticeCardImportant: {
    borderColor: '#8A2BE2',
    borderWidth: 2,
    backgroundColor: '#f9f5ff',
  },
  noticeCardExpanded: {
    backgroundColor: '#fafafa',
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noticeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  importantBadge: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  importantBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  noticeDate: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  noticeContentContainer: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
  },
  noticeContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6fa',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
});

export default NoticeScreen;
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FollowUpQuestion {
  id: string;
  text: string;
  icon: string;
  category: 'top3' | 'general' | 'related';
}

interface FollowUpQuestionsProps {
  onQuestionPress: (question: string) => void;
  currentTopic?: string;
}

const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({ 
  onQuestionPress, 
  currentTopic 
}) => {
  // 추천 키워드
  const suggestionChips = [
    '모구 소식 모아보기, 요즘 인기 상품',
    '모구봇 이렇게 활용해 보세요',
    '모구장',
    '모구러',
    '정산 규칙',
    '위시스팟',
    '고객센터',
  ];
  // 자주 찾는 문의 TOP3
  const top3Questions: FollowUpQuestion[] = [
    {
      id: 'top3-1',
      text: '수수료 산정 방법',
      icon: 'card-outline',
      category: 'top3'
    },
    {
      id: 'top3-2', 
      text: '거래 금지 품목 종류',
      icon: 'ban-outline',
      category: 'top3'
    },
    {
      id: 'top3-3',
      text: '환불/취소 문의',
      icon: 'receipt-outline',
      category: 'top3'
    }
  ];

  // 기타 자주 묻는 질문들
  const generalQuestions: FollowUpQuestion[] = [
    {
      id: 'general-1',
      text: '모구존은 어떻게 이용하나요?',
      icon: 'location-outline',
      category: 'general'
    },
    {
      id: 'general-2',
      text: '신뢰도 시스템이 뭔가요?',
      icon: 'star-outline',
      category: 'general'
    },
    {
      id: 'general-3',
      text: '결제 방법은 어떤 게 있나요?',
      icon: 'card-outline',
      category: 'general'
    },
    {
      id: 'general-4',
      text: '고객센터 연락처가 뭔가요?',
      icon: 'call-outline',
      category: 'general'
    },
    {
      id: 'general-5',
      text: '모구 서비스 소개',
      icon: 'information-circle-outline',
      category: 'general'
    },
    {
      id: 'general-6',
      text: '거래 중 문제가 생겼어요',
      icon: 'help-circle-outline',
      category: 'general'
    }
  ];

  // 현재 주제와 관련된 질문들
  const getRelatedQuestions = (topic?: string): FollowUpQuestion[] => {
    if (!topic) return [];
    
    const relatedMap: { [key: string]: FollowUpQuestion[] } = {
      '수수료': [
        { id: 'related-1', text: '수수료 계산 예시', icon: 'calculator-outline', category: 'related' },
        { id: 'related-2', text: '수수료 할인 혜택', icon: 'pricetag-outline', category: 'related' }
      ],
      '마감': [
        { id: 'related-3', text: '거래 연장 방법', icon: 'refresh-outline', category: 'related' },
        { id: 'related-4', text: '자동 마감 알림', icon: 'notifications-outline', category: 'related' }
      ],
      '금지': [
        { id: 'related-5', text: '판매 가능한 품목', icon: 'checkmark-circle-outline', category: 'related' },
        { id: 'related-6', text: '품목 등록 가이드', icon: 'list-outline', category: 'related' }
      ],
      '모구존': [
        { id: 'related-7', text: '모구존 위치 찾기', icon: 'map-outline', category: 'related' },
        { id: 'related-8', text: '모구존 이용 팁', icon: 'bulb-outline', category: 'related' }
      ]
    };

    // 주제 키워드 매칭
    for (const [keyword, questions] of Object.entries(relatedMap)) {
      if (topic.includes(keyword)) {
        return questions;
      }
    }

    return [];
  };

  const relatedQuestions = getRelatedQuestions(currentTopic);

  const handleQuestionPress = (question: FollowUpQuestion) => {
    onQuestionPress(question.text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chatbubbles-outline" size={20} color="#8A2BE2" />
        <Text style={styles.headerTitle}>더 궁금한 것이 있으신가요?</Text>
      </View>

      {/* 자주 찾는 문의 TOP3 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>자주 찾는 문의 TOP 3</Text>
        <View style={styles.questionGrid}>
          {top3Questions.map((question) => (
            <TouchableOpacity
              key={question.id}
              style={[styles.questionButton, styles.top3Button]}
              onPress={() => handleQuestionPress(question)}
            >
              <Ionicons name={question.icon as any} size={18} color="#fff" />
              <Text style={styles.top3ButtonText}>{question.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 관련 질문들 */}
      {relatedQuestions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>관련 질문</Text>
          <View style={styles.questionGrid}>
            {relatedQuestions.map((question) => (
              <TouchableOpacity
                key={question.id}
                style={[styles.questionButton, styles.relatedButton]}
                onPress={() => handleQuestionPress(question)}
              >
                <Ionicons name={question.icon as any} size={14} color="#666" />
                <Text style={styles.relatedButtonText}>{question.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 기타 질문들 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기타 자주 묻는 질문</Text>
        <View style={styles.questionGrid}>
          {generalQuestions.slice(0, 4).map((question) => (
            <TouchableOpacity
              key={question.id}
              style={[styles.questionButton, styles.generalButton]}
              onPress={() => handleQuestionPress(question)}
            >
              <Ionicons name={question.icon as any} size={14} color="#8A2BE2" />
              <Text style={styles.generalButtonText}>{question.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 더 많은 질문 보기 */}
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => onQuestionPress('모든 FAQ 보기')}
      >
        <Text style={styles.moreButtonText}>더 많은 질문 보기</Text>
        <Ionicons name="chevron-forward" size={16} color="#8A2BE2" />
      </TouchableOpacity>

      {/* Suggestion Chips */}
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionTitle}>추천 키워드</Text>
        <View style={styles.suggestionChips}>
          {suggestionChips.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => onQuestionPress(suggestion)}
            >
              <Text style={styles.suggestionChipText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8A2BE2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A2BE2',
    marginLeft: 6,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  questionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  questionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 4,
  },
  top3Button: {
    backgroundColor: '#8A2BE2',
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  top3ButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  relatedButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  relatedButtonText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  generalButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  generalButtonText: {
    fontSize: 11,
    color: '#8A2BE2',
    marginLeft: 4,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  moreButtonText: {
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: '500',
    marginRight: 4,
  },
  suggestionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8A2BE2',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 4,
  },
  suggestionChipText: {
    fontSize: 11,
    color: '#8A2BE2',
    fontWeight: '500',
  },
});

export default FollowUpQuestions;

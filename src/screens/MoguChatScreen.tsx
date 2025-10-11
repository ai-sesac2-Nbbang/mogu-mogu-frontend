import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
  BackHandler,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { sendMessageToGemini } from '../services/geminiService';
import llmRAGService from '../services/llmRAGService';
import FollowUpQuestions from '../components/FollowUpQuestions';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Array<{
    title: string;
    content: string;
    relevance_score: number;
  }>;
  confidence?: number;
  showFollowUp?: boolean;
  topic?: string;
}

const MoguChatScreen = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '궁금한 내용을 입력해주시면, 답변을 빠르게 챗봇이 도와드릴게요.',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // 타이핑 애니메이션을 위한 애니메이션 값들
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  const faqItems = [
    { 
      id: 1, 
      title: '모구장은 수수료를 어떻게 산정하는건가요?', 
      icon: 'card-outline',
      answer: '모구 서비스의 수수료 정책에 대해 자세히 알려드리겠습니다. 모구 시스템 표준 매뉴얼을 참고하여 정확한 정보를 제공합니다.'
    },
    { 
      id: 2, 
      title: '거래 금지 품목 종류가 궁금해요.', 
      icon: 'time-outline',
      answer: '모구 거래의 마감 기한과 관련 정책에 대해 설명드리겠습니다. 모구 시스템 표준 매뉴얼의 내용을 바탕으로 답변합니다.'
    },
    { 
      id: 3, 
      title: '환불/취소는 어떻게 하나요?', 
      icon: 'close-circle-outline',
      answer: '환불/취소 관련 규정에 대해 안내드리겠습니다. 모구 시스템 표준 매뉴얼을 참고합니다.'
    },
  ];

  const suggestionChips = [
    '모구 소식 모아보기, 요즘 인기 상품',
    '모구봇 이렇게 활용해 보세요',
    '모구장',
    '모구러',
    '정산 규칙',
    '위시스팟',
    '고객센터',
  ];

  // 자동 스크롤 함수
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // 답변 말풍선이 화면에서 가장 위로 보이도록 스크롤 조정
  const scrollToShowAnswer = () => {
    setTimeout(() => {
      // 메시지 개수에 따라 스크롤 위치 계산
      const messageCount = messages.length;
      if (messageCount > 0) {
        // 마지막 답변(봇 메시지)이 화면 상단에 보이도록 스크롤
        // 대략적으로 메시지 1개 정도 위로 스크롤하여 답변이 상단에 보이도록
        const scrollPosition = Math.max(0, messageCount - 1) * 200; // 메시지당 대략 200px
        scrollViewRef.current?.scrollTo({ 
          y: scrollPosition, 
          animated: true 
        });
      }
    }, 100);
  };

  // 대기 중 메시지 생성
  const getWaitingMessage = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('수수료') || lowerQuestion.includes('비용')) {
      return '수수료 정보를 찾고 있어요... 💰';
    } else if (lowerQuestion.includes('마감') || lowerQuestion.includes('기한')) {
      return '마감 기한 정보를 확인하고 있어요... ⏰';
    } else if (lowerQuestion.includes('금지') || lowerQuestion.includes('판매')) {
      return '거래 금지 품목을 확인하고 있어요... 🚫';
    } else if (lowerQuestion.includes('고객센터') || lowerQuestion.includes('문의')) {
      return '고객센터 정보를 찾고 있어요... 📞';
    } else if (lowerQuestion.includes('모구존')) {
      return '모구존 정보를 확인하고 있어요... 🏪';
    } else if (lowerQuestion.includes('결제') || lowerQuestion.includes('페이')) {
      return '결제 시스템 정보를 찾고 있어요... 💳';
    } else {
      const messages = [
        '답변을 준비하고 있어요... 🤔',
        '정보를 찾고 있어요... 🔍',
        '잠시만 기다려주세요... ⏳',
        '답변을 생성하고 있어요... ✨',
        '모구모구 시스템 메뉴얼을 확인하고 있어요... 📋'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  };

  // 메시지 전송 함수 (RAG 기반)
  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = message.trim();
      const newMessage: Message = {
        id: Date.now().toString(),
        text: userMessage,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      scrollToBottom();

      // 즉시 타이핑 애니메이션 시작
      setIsTyping(true);
      startTypingAnimation();
      
      // 대기 중 메시지 설정
      const waitingMsg = getWaitingMessage(userMessage);
      setWaitingMessage(waitingMsg);

      try {
        // RAG 기반 답변 생성 (병렬 처리로 속도 향상)
        const botResponse = await Promise.race([
          generateRAGResponse(userMessage),
          new Promise<Message>((_, reject) => 
            setTimeout(() => reject(new Error('응답 시간 초과')), 35000) // 35초로 증가
          )
        ]);
        
        // 타이핑 애니메이션 중지
        stopTypingAnimation();
        setIsTyping(false);
        setWaitingMessage('');
        
        // 답변 표시
        setMessages(prev => [...prev, botResponse]);
        scrollToShowAnswer();
      } catch (error) {
        console.error('메시지 처리 실패:', error);
        stopTypingAnimation();
        setIsTyping(false);
        setWaitingMessage('');
        
        // 에러 메시지 추가 (더 빠른 응답)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: removeUserNameFromAnswer('서버 응답이 지연되고 있습니다. 복잡한 질문의 경우 처리 시간이 더 오래 걸릴 수 있습니다. 잠시 후 다시 시도해주세요.'),
          isUser: false,
          timestamp: new Date(),
          confidence: 0
        };
        
        setMessages(prev => [...prev, errorMessage]);
        scrollToBottom();
      }
    }
  };

  // 백엔드 서버 기반 봇 응답 생성 함수 (점진적 로딩)
  const generateRAGResponse = async (userMessage: string): Promise<Message> => {
    try {
      // 백엔드 서버로 질문 전달
      const ragResponse = await llmRAGService.askQuestion(userMessage);

      // 주제 추출 (추가 질문 유도용)
      const topic = extractTopic(userMessage);

      // 빠른 응답인지 확인 (처리 시간이 1초 미만)
      const isQuickResponse = ragResponse.processing_time < 1000;

      return {
        id: (Date.now() + 1).toString(),
        text: removeUserNameFromAnswer(ragResponse.answer),
        isUser: false,
        timestamp: new Date(),
        showFollowUp: true, // 봇 답변 후 추가 질문 유도
        topic: topic,
        confidence: ragResponse.confidence
      };
    } catch (error) {
      console.error('RAG 응답 생성 실패:', error);
      // 에러 발생 시 기본 응답
      return {
        id: (Date.now() + 1).toString(),
        text: '일시적인 문제가 있어 정확한 답변을 드리기 어렵습니다. 잠시 후 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date(),
        showFollowUp: false
      };
    }
  };

  // 사용자 질문에서 주제 추출
  const extractTopic = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('수수료') || lowerMessage.includes('비용')) {
      return '수수료';
    } else if (lowerMessage.includes('마감') || lowerMessage.includes('기한')) {
      return '마감';
    } else if (lowerMessage.includes('금지') || lowerMessage.includes('판매')) {
      return '금지';
    } else if (lowerMessage.includes('모구존')) {
      return '모구존';
    } else if (lowerMessage.includes('신뢰도') || lowerMessage.includes('평가')) {
      return '신뢰도';
    } else if (lowerMessage.includes('결제') || lowerMessage.includes('페이')) {
      return '결제';
    } else if (lowerMessage.includes('고객센터') || lowerMessage.includes('문의')) {
      return '고객센터';
    }
    
    return '';
  };

  // 답변에서 사용자 이름 제거 함수
  const removeUserNameFromAnswer = (answer: string): string => {
    // "님"으로 끝나는 호칭 제거 (예: "홍길동님", "김철수님" 등)
    let cleanedAnswer = answer.replace(/\w+님/g, '');
    
    // "님" 단독으로 남은 경우 제거
    cleanedAnswer = cleanedAnswer.replace(/님/g, '');
    
    // 한글 이름 + 님 패턴 제거
    cleanedAnswer = cleanedAnswer.replace(/[가-힣]{2,4}님/g, '');
    
    // "~님" 패턴 제거 (영문 포함)
    cleanedAnswer = cleanedAnswer.replace(/[가-힣a-zA-Z]+님/g, '');
    
    // 불필요한 공백 정리
    cleanedAnswer = cleanedAnswer.replace(/\s+/g, ' ').trim();
    
    // 문장 시작 부분의 불필요한 문장부호 정리
    cleanedAnswer = cleanedAnswer.replace(/^[,.\s!?]+/, '');
    
    return cleanedAnswer;
  };

  // FAQ 항목 클릭 처리 (로컬 RAG 기반)
  const handleFaqPress = async (item: any) => {
    const faqMessage: Message = {
      id: Date.now().toString(),
      text: item.title,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, faqMessage]);
    scrollToBottom();

    // 즉시 타이핑 애니메이션 시작
    setIsTyping(true);
    startTypingAnimation();
    
    // 대기 중 메시지 설정
    const waitingMsg = getWaitingMessage(item.title);
    setWaitingMessage(waitingMsg);

    try {
      // FAQ 질문에 대한 LLM RAG 응답 생성 (빠른 응답)
      const ragResponse = await Promise.race([
        generateRAGResponse(item.title),
        new Promise<Message>((_, reject) => 
          setTimeout(() => reject(new Error('응답 시간 초과')), 30000) // 30초로 증가
        )
      ]);
      
      // 타이핑 애니메이션 중지
      stopTypingAnimation();
      setIsTyping(false);
      setWaitingMessage('');
      
      // 답변 표시
      setMessages(prev => [...prev, ragResponse]);
      scrollToShowAnswer();
    } catch (error) {
      console.error('FAQ 처리 실패:', error);
      stopTypingAnimation();
      setIsTyping(false);
      setWaitingMessage('');
      
      // 기본 FAQ 답변으로 대체
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: removeUserNameFromAnswer(item.answer),
        isUser: false,
        timestamp: new Date(),
        confidence: 0.9,
        showFollowUp: true,
        topic: extractTopic(item.title)
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
      scrollToBottom();
    }
  };

  // 제안 칩 클릭 처리
  const handleSuggestionPress = async (suggestion: string) => {
    // 즉시 질문을 전송 (입력 필드에 표시하지 않음)
    const newMessage: Message = {
      id: Date.now().toString(),
      text: suggestion,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();

    // 즉시 타이핑 애니메이션 시작
    setIsTyping(true);
    startTypingAnimation();
    
    // 대기 중 메시지 설정
    const waitingMsg = getWaitingMessage(suggestion);
    setWaitingMessage(waitingMsg);

    try {
      // RAG 기반 답변 생성 (빠른 응답)
      const botResponse = await Promise.race([
        generateRAGResponse(suggestion),
        new Promise<Message>((_, reject) => 
          setTimeout(() => reject(new Error('응답 시간 초과')), 35000) // 35초로 증가
        )
      ]);
      
      // 타이핑 애니메이션 중지
      stopTypingAnimation();
      setIsTyping(false);
      setWaitingMessage('');
      
      // 답변 표시
      setMessages(prev => [...prev, botResponse]);
      scrollToBottom();
    } catch (error) {
      console.error('메시지 처리 실패:', error);
      stopTypingAnimation();
      setIsTyping(false);
      setWaitingMessage('');
      
      // 에러 메시지 추가
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: removeUserNameFromAnswer('죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.'),
        isUser: false,
        timestamp: new Date(),
        confidence: 0
      };
      
      setMessages(prev => [...prev, errorMessage]);
      scrollToBottom();
    }
  };

  // 추가 질문 버튼 클릭 처리
  const handleFollowUpQuestion = async (question: string) => {
    // 즉시 질문을 전송 (입력 필드에 표시하지 않음)
    const newMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();

    // 즉시 타이핑 애니메이션 시작
    setIsTyping(true);
    startTypingAnimation();

    try {
      // RAG 기반 답변 생성 (빠른 응답)
      const botResponse = await Promise.race([
        generateRAGResponse(question),
        new Promise<Message>((_, reject) => 
          setTimeout(() => reject(new Error('응답 시간 초과')), 35000) // 35초로 증가
        )
      ]);
      
      // 타이핑 애니메이션 중지
      stopTypingAnimation();
      setIsTyping(false);
      
      // 답변 표시
      setMessages(prev => [...prev, botResponse]);
      scrollToBottom();
    } catch (error) {
      console.error('메시지 처리 실패:', error);
      stopTypingAnimation();
      setIsTyping(false);
      setWaitingMessage('');
      
      // 에러 메시지 추가
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: removeUserNameFromAnswer('죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.'),
        isUser: false,
        timestamp: new Date(),
        confidence: 0
      };
      
      setMessages(prev => [...prev, errorMessage]);
      scrollToBottom();
    }
  };

  // 볼드 텍스트 렌더링 함수
  const renderFormattedText = (text: string) => {
    // 중요한 키워드들을 볼드 처리
    const importantKeywords = [
      '수수료', '3%', '500원', '5,000원',
      '7일', '마감', '기한', '연장',
      '금지', '판매', '음식물', '의약품', '화장품',
      '모구존', '거래소', '안전',
      '신뢰도', '평가', '점수', '등급',
      '결제', '모구페이', '에스크로',
      '고객센터', '1588-0000', '24시간'
    ];

    let formattedText = text;
    
    // 키워드를 **로 감싸기
    importantKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      formattedText = formattedText.replace(regex, `**$1**`);
    });

    // **로 감싸진 텍스트를 볼드로 렌더링
    const parts = formattedText.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <Text key={index} style={{ fontWeight: 'bold' }}>
            {boldText}
          </Text>
        );
      }
      return part;
    });
  };

  // 타이핑 애니메이션 함수 (더 빠른 속도)
  const startTypingAnimation = () => {
    const createDotAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 200, // 300ms → 200ms로 단축
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 200, // 300ms → 200ms로 단축
            useNativeDriver: true,
          }),
        ])
      );
    };

    // 각 점이 순차적으로 애니메이션 (더 빠른 속도)
    Animated.parallel([
      createDotAnimation(dot1Anim, 0),
      createDotAnimation(dot2Anim, 100), // 150ms → 100ms로 단축
      createDotAnimation(dot3Anim, 200), // 300ms → 200ms로 단축
    ]).start();
  };

  const stopTypingAnimation = () => {
    dot1Anim.stopAnimation();
    dot2Anim.stopAnimation();
    dot3Anim.stopAnimation();
    
    // 애니메이션 값 초기화
    dot1Anim.setValue(0);
    dot2Anim.setValue(0);
    dot3Anim.setValue(0);
  };


  // PDF 로드 useEffect 제거됨 - 백엔드에서 PDF 처리

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 음성 인식 서비스 정리는 서비스 내부에서 처리
    };
  }, []);

  // 메시지 애니메이션 효과
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [messages]);

  // 타이핑 상태 변경 시 애니메이션 제어
  useEffect(() => {
    if (isTyping) {
      startTypingAnimation();
    } else {
      stopTypingAnimation();
    }
  }, [isTyping]);

  // 헤더 뒤로 가기 버튼 클릭 처리
  const handleBackPress = () => {
    // 메시지가 초기 메시지보다 많을 때만 모달 표시
    if (messages.length > 1) {
      setShowExitModal(true);
    } else {
      // 메시지가 없으면 바로 뒤로 가기
      navigation.goBack();
    }
  };

  // 모달에서 나가기 확인
  const handleConfirmExit = () => {
    setShowExitModal(false);
    navigation.goBack();
  };

  // 모달에서 취소
  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  // 뒤로 가기 이벤트 감지 및 경고창 표시
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 메시지가 초기 메시지보다 많을 때만 모달 표시
        if (messages.length > 1) {
          setShowExitModal(true);
          return true; // 기본 뒤로 가기 동작 방지
        }
        return false; // 기본 뒤로 가기 동작 허용
      };

      // Android 하드웨어 뒤로 가기 버튼 이벤트 리스너
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [messages.length, navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBackPress} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.chatbotIcon}>
            <Image 
              source={require('../../assets/mogumogu.png')} 
              style={styles.chatbotImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>모구봇</Text>
        <View style={styles.onlineStatus}>
          <View style={[styles.onlineDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.onlineText}>
            {/* RAG + LLM Ready */}
            &nbsp;Online
          </Text>
        </View>
          </View>
        </View>
        
        <View style={styles.rightPlaceholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* PDF 로드 관련 UI 제거됨 - 백엔드에서 처리 */}

        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Messages */}
          {messages.map((msg, index) => (
            <Animated.View
              key={msg.id}
              style={[
                styles.messageContainer,
                msg.isUser ? styles.userMessageContainer : styles.botMessageContainer,
                { opacity: fadeAnim }
              ]}
            >
              <View style={[
                styles.messageBubble,
                msg.isUser ? styles.userMessageBubble : styles.botMessageBubble
              ]}>
                {/* 봇 메시지 헤더 */}
                {!msg.isUser && (
                  <View style={styles.botMessageHeader}>
                    <View style={styles.botAvatar}>
                      <Image 
                        source={require('../../assets/mogumogu.png')} 
                        style={styles.botAvatarImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.botName}>모구봇</Text>
                    <View style={styles.onlineIndicator}>
                      <View style={styles.onlineDot} />
                    </View>
                  </View>
                )}
                
                {/* 봇 메시지에만 기준 정보 표시 (맨 위) */}
                {!msg.isUser && (
                  <View style={styles.referenceContainerTop}>
                    <Ionicons name="calendar-outline" size={15} color="#8A2BE2" />
                    <Text style={styles.referenceText}>2025.10 기준</Text>
                  </View>
                )}
                
                <Text style={[
                  styles.messageText,
                  msg.isUser ? styles.userMessageText : styles.botMessageText
                ]}>
                  {renderFormattedText(msg.text)}
                </Text>
                
                <Text style={[
                  styles.messageTime,
                  msg.isUser ? styles.userMessageTime : styles.botMessageTime
                ]}>
                  {msg.timestamp.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
              
              {/* 추가 질문 유도 (봇 메시지에만 표시) */}
              {!msg.isUser && msg.showFollowUp && (
                <FollowUpQuestions 
                  onQuestionPress={handleFollowUpQuestion}
                  currentTopic={msg.topic}
                />
              )}
            </Animated.View>
          ))}

          {/* Typing Indicator with Waiting Message */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                {waitingMessage ? (
                  <View style={styles.waitingMessageContainer}>
                    <Text style={styles.waitingMessageText}>{waitingMessage}</Text>
                    <View style={styles.typingDots}>
                      <Animated.View 
                        style={[
                          styles.typingDot, 
                          {
                            opacity: dot1Anim,
                            transform: [{
                              scale: dot1Anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.8, 1.2],
                              })
                            }]
                          }
                        ]} 
                      />
                      <Animated.View 
                        style={[
                          styles.typingDot, 
                          {
                            opacity: dot2Anim,
                            transform: [{
                              scale: dot2Anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.8, 1.2],
                              })
                            }]
                          }
                        ]} 
                      />
                      <Animated.View 
                        style={[
                          styles.typingDot, 
                          {
                            opacity: dot3Anim,
                            transform: [{
                              scale: dot3Anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.8, 1.2],
                              })
                            }]
                          }
                        ]} 
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.typingDots}>
                    <Animated.View 
                      style={[
                        styles.typingDot, 
                        {
                          opacity: dot1Anim,
                          transform: [{
                            scale: dot1Anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 1.2],
                            })
                          }]
                        }
                      ]} 
                    />
                    <Animated.View 
                      style={[
                        styles.typingDot, 
                        {
                          opacity: dot2Anim,
                          transform: [{
                            scale: dot2Anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 1.2],
                            })
                          }]
                        }
                      ]} 
                    />
                    <Animated.View 
                      style={[
                        styles.typingDot, 
                        {
                          opacity: dot3Anim,
                          transform: [{
                            scale: dot3Anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 1.2],
                            })
                          }]
                        }
                      ]} 
                    />
                  </View>
                )}
              </View>
            </View>
          )}

          {/* FAQ Section - Only show if no messages except initial */}
          {messages.length <= 1 && (
            <>
              <View style={styles.faqSection}>
                <View style={styles.faqHeader}>
                  <Text style={styles.faqTitle}>다른 고객들은 어떤 걸 물어볼까?</Text>
                  <Text style={styles.faqSubtitle}>많이 찾는 질문 TOP 3</Text>
                </View>
                
                <View style={styles.faqCard}>
                  <Text style={styles.faqCardTitle}>자주 찾는 문의 TOP 3</Text>
                  {faqItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.faqItem}
                      onPress={() => handleFaqPress(item)}
                    >
                      <Ionicons name={item.icon as any} size={20} color="#8A2BE2" />
                      <Text style={styles.faqItemText}>{item.title}</Text>
                      <Ionicons name="chevron-forward" size={16} color="#8A2BE2" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Suggestion Chips */}
              <View style={styles.suggestionContainer}>
                {suggestionChips.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => handleSuggestionPress(suggestion)}
                  >
                    <Text style={styles.suggestionChipText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </ScrollView>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="궁금하신 내용을 입력해주세요."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
            />
            <View style={styles.inputButtons}>
              <TouchableOpacity 
                style={[styles.sendButton, message.trim() ? styles.sendButtonActive : null]}
                onPress={handleSendMessage}
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={20} color={message.trim() ? "#fff" : "#8A2BE2"} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 나가기 확인 모달 */}
      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelExit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={24} color="#FF9800" />
              <Text style={styles.modalTitle}>채팅 내용 삭제</Text>
            </View>
            
            <Text style={styles.modalText}>
              뒤로 가기를 하면 지금까지의 채팅 내용이 모두 삭제됩니다. 정말 나가시겠습니까?
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={handleCancelExit}
              >
                <Text style={[styles.textStyle, styles.cancelText]}>취소</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={handleConfirmExit}
              >
                <Text style={styles.textStyle}>나가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCDD2',
  },
  errorText: {
    marginLeft: 8,
    color: '#FF5722',
    fontSize: 14,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  chatbotIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  chatbotImage: {
    width: 32,
    height: 32,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  rightPlaceholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageContainer: {
    marginVertical: 2,
    paddingHorizontal: 8,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userMessageBubble: {
    backgroundColor: '#8A2BE2',
    borderBottomRightRadius: 5,
  },
  botMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  botMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  botAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  botAvatarImage: {
    width: 20,
    height: 20,
  },
  botName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A2BE2',
    flex: 1,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    opacity: 0.6,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'right',
  },
  userMessageTime: {
    color: '#fff',
  },
  botMessageTime: {
    color: '#999',
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
    marginBottom: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  referenceContainerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: 'flex-start',
  },
  referenceText: {
    fontSize: 10,
    color: '#8A2BE2',
    fontWeight: '600',
    marginLeft: 4,
  },
  typingContainer: {
    marginVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
  },
  typingBubble: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8A2BE2',
    marginHorizontal: 3,
  },
  waitingMessageContainer: {
    alignItems: 'center',
  },
  waitingMessageText: {
    fontSize: 14,
    color: '#8A2BE2',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  faqSection: {
    marginTop: 30,
    backgroundColor: '#8A2BE2',
    borderRadius: 16,
    padding: 20,
  },
  faqHeader: {
    marginBottom: 15,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  faqSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  faqCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqItemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 20,
  },
  suggestionChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8A2BE2',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionChipText: {
    fontSize: 12,
    color: '#8A2BE2',
  },
  inputContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    // minHeight: 50,
    height: 50,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 5,
  },
  inputButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#8A2BE2',
  },
  
  // 모달 스타일
  modalOverlay: {
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    marginLeft: 10,
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
  cancelText: {
    color: '#333',
  },
});

export default MoguChatScreen;

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { GiftedChat, IMessage, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// 챗봇의 정보
const chatBot = {
  _id: 2,
  name: '모구챗',
  avatar: 'https://i.imgur.com/7k12EPD.png', // 귀여운 보라색 프로필 아이콘
};

// '자주 찾는 질문' 데이터
const top3Questions = [
  { title: '모구 수수료 제한', value: '모구 수수료 제한' },
  { title: '모구 마감 기한', value: '모구 마감 기한' },
  { title: '모구 판매 금지 품목', value: '모구 판매 금지 품목' },
];

export function ChatbotScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigation = useNavigation();

  // 1. 헤더(Header) 디자인 설정
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>모구챗</Text>
          <View style={styles.onlineIndicator} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation]);

  // 앱 처음 실행 시 초기 메시지 설정
  useEffect(() => {
    setMessages([
      {
        _id: 2,
        text: '다른 고객들은 어떤 걸 물어볼까?',
        createdAt: new Date(),
        user: chatBot,
      },
      {
        _id: 1,
        text: '궁금한 내용을 입력해주시면,\n답변을 빠르게 챗봇이 도와드릴게요.',
        createdAt: new Date(),
        user: chatBot,
        // 2. '자주 찾는 질문 TOP 3'를 Quick Replies로 구현
        quickReplies: {
          type: 'radio', // 또는 'checkbox'
          values: top3Questions,
        },
      },
    ]);
  }, []);

  // 챗봇 답변 생성 로직
  const generateBotResponse = (userMessage: IMessage) => {
    let responseText = '';
    const lowerCaseText = userMessage.text.toLowerCase();

    if (lowerCaseText.includes('수수료')) {
      responseText = '모구장이 구매 총액의 0~20% 한도로 설정할 수 있어요.';
    } else if (lowerCaseText.includes('마감')) {
      responseText = '모구 마감 기한은 모구장이 자유롭게 설정할 수 있습니다.';
    } else if (lowerCaseText.includes('금지')) {
      responseText = '주류, 담배 등 청소년 유해 물품은 판매가 금지되어 있습니다.';
    } else {
      responseText = '죄송해요, 아직은 잘 모르는 말이에요. 😅';
    }

    const botMessage: IMessage = {
      _id: Math.random().toString(36).substring(7),
      text: responseText,
      createdAt: new Date(),
      user: chatBot,
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
  };

  // 메시지 전송 시 처리
  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    const userMessage = newMessages[0];
    setTimeout(() => generateBotResponse(userMessage), 1000);
  }, []);
  
  // 빠른 답변 버튼 클릭 시 처리
  const onQuickReply = useCallback((replies: any[]) => {
      const newMessages: IMessage[] = replies.map(reply => ({
        _id: Math.random().toString(36).substring(7),
        text: reply.value,
        createdAt: new Date(),
        user: { _id: 1 },
      }));
      onSend(newMessages);
  }, [onSend]);

  // 3. 말풍선(Bubble) 렌더링 함수
  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          // 챗봇 말풍선 (왼쪽)
          left: {
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 5,
          },
          // 내 말풍선 (오른쪽)
          right: {
            backgroundColor: '#E6E0FF', // 연보라색
            borderRadius: 16,
            padding: 5,
          },
        }}
        textStyle={{
          // 내 말풍선 텍스트
          right: {
            color: '#333333', // 어두운 색상
          },
        }}
      />
    );
  };

  // 4. 보내기(Send) 버튼 렌더링 함수
  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <View style={styles.sendButton}>
          <Ionicons name="send" size={16} color="white" />
        </View>
      </Send>
    );
  };

  // 5. 메시지 입력창(Input Toolbar) 렌더링 함수
  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.textInput}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        onQuickReply={onQuickReply}
        user={{ _id: 1 }}
        placeholder="궁금하신 내용을 입력해주세요."
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        messagesContainerStyle={styles.messagesContainer}
        alwaysShowSend
        renderAvatarOnTop
      />
    </View>
  );
}

// 6. 전체적인 스타일시트
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5FF', // 아주 연한 보라 배경
  },
  messagesContainer: {
    paddingBottom: 10,
  },
  // 헤더 관련 스타일
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Platform.OS === 'ios' ? -20 : 0, // iOS 좌측 여백 조절
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759', // 초록색
    marginLeft: 8,
  },
  onlineText: {
    fontSize: 14,
    color: '#8A8A8E',
    marginLeft: 4,
  },
  // 입력창 관련 스타일
  inputToolbar: {
    backgroundColor: 'white',
    borderRadius: 30,
    marginHorizontal: 10,
    marginBottom: Platform.OS === 'android' ? 5 : 20,
    paddingHorizontal: 10,
    borderTopWidth: 0,
  },
  textInput: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 보내기 버튼 관련 스타일
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#7A44FF', // 진한 보라색
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
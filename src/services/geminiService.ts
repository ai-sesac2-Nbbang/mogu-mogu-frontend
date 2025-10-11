// services/geminiService.ts

export interface Message {
  role: 'user' | 'assistant';
  text: string;
}

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

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    // ✅ React Native - 서버를 통한 호출
    const response = await fetch('http://192.xxx.xxx.xxx:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 서버 에러 응답:', errorText);
      throw new Error(`서버 에러: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ 응답 데이터:', data);
    
    if (data.reply) {
      return removeUserNameFromAnswer(data.reply);
    } else if (data.error) {
      throw new Error(`백엔드 에러: ${data.error}`);
    } else {
      throw new Error('백엔드에서 유효한 응답을 받지 못했습니다.');
    }
  } catch (error) {
    console.error('❌ 백엔드 API 에러:', error);
    
    // 에러 타입에 따른 다른 메시지 제공
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('API Key not found')) {
        return removeUserNameFromAnswer('안녕하세요! 모구봇입니다. 현재 AI 서비스 설정에 문제가 있어 정확한 답변을 드리기 어렵습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.message.includes('Network request failed')) {
        return removeUserNameFromAnswer('안녕하세요! 모구봇입니다. 현재 네트워크 연결에 문제가 있어 정확한 답변을 드리기 어렵습니다. 인터넷 연결을 확인해주세요.');
      } else if (error.message.includes('서버 에러')) {
        return removeUserNameFromAnswer('안녕하세요! 모구봇입니다. 현재 서버에 일시적인 문제가 있어 정확한 답변을 드리기 어렵습니다. 잠시 후 다시 시도해주세요.');
      }
    }
    
    // 기본 에러 메시지
    return removeUserNameFromAnswer('안녕하세요! 모구봇입니다. 현재 백엔드 서버 연결에 문제가 있어 정확한 답변을 드리기 어렵습니다. 모구 서비스에 대해 궁금한 것이 있으시면 고객센터(1588-0000)로 문의해주세요.');
  }
};

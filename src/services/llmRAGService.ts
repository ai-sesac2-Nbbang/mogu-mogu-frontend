// LLM RAG 서비스 - 백엔드 문서 기반 답변

// LLM RAG 응답 타입 정의
export interface LLMRAGResponse {
  answer: string;
  confidence: number;
  processing_time: number;
}

const USER_IP_KEY: string = process.env.EXPO_PUBLIC_USER_IP_KEY ?? "";

// LLM RAG 서비스 클래스
class LLMRAGService {

  // 답변에서 사용자 이름 제거 함수
  private removeUserNameFromAnswer(answer: string): string {
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
  }

  // 백엔드 서버로 질문 전달
  async askQuestion(question: string): Promise<LLMRAGResponse> {
    const startTime = Date.now();
    
    try {
      // 백엔드 서버로 문서 기반 답변 요청
      const answer = await this.requestBackendAnswer(question);
      
      return {
        answer: this.removeUserNameFromAnswer(answer),
        confidence: 0.9,
        processing_time: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('❌ 백엔드 서버 요청 실패:', error);
      return this.fallbackResponse(startTime);
    }
  }

  // 백엔드 서버로 답변 요청
  private async requestBackendAnswer(question: string): Promise<string> {
    // ✅ React Native - 서버를 통한 호출
    const response = await fetch(`http://192.xxx.xxx.xxx:3000/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: question,
        source: 'pdf_document'
      })
    });

    if (!response.ok) {
      throw new Error(`서버 에러: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.reply) {
      throw new Error('서버에서 답변을 받지 못했습니다.');
    }
    
    return data.reply;
  }

  // API 오류 시 기본 답변으로 폴백
  private fallbackResponse(startTime: number): LLMRAGResponse {
    const answer = '안녕하세요! 모구봇입니다. 현재 백엔드 서버 연결에 문제가 있어 정확한 답변을 드리기 어렵습니다. 모구 서비스에 대해 궁금한 것이 있으시면 고객센터(1588-0000)로 문의해주세요.';
    
    return {
      answer: this.removeUserNameFromAnswer(answer),
      confidence: 0.1,
      processing_time: Date.now() - startTime
    };
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const llmRAGService = new LLMRAGService();
export default llmRAGService;
# 모구봇 서비스 개발 트러블슈팅 가이드

## 📋 목차
1. [필수 라이브러리 설치](#필수-라이브러리-설치)
2. [API 키 설정 및 연동](#api-키-설정-및-연동)
3. [백엔드 서버 연동 문제](#백엔드-서버-연동-문제)
4. [UI/UX 개선 및 최적화](#uiux-개선-및-최적화)
5. [RAG 품질 개선 방법](#rag-품질-개선-방법)
6. [Gemini Context 문제 해결](#gemini-context-문제-해결)
7. [Android Studio 빌드 문제](#android-studio-빌드-문제)

---

## 🔧 필수 라이브러리 설치

### React Native Core
```bash
npm install react-native
npm install @react-navigation/native
npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs
```

### Expo 관련
```bash
npm install expo
npm install expo-constants
npm install @expo/vector-icons
```

### HTTP 통신
```bash
npm install axios
```

### 상태 관리 및 유틸리티
```bash
npm install @react-native-async-storage/async-storage
```

### TypeScript 지원
```bash
npm install --save-dev typescript
npm install --save-dev @types/react
npm install --save-dev @types/react-native
```

---

## 🔑 API 키 설정 및 연동

### 문제: OpenAI API 키 연동 실패
**원인:**
- 환경변수 설정 누락
- API 키 형식 오류
- 네트워크 보안 정책 문제

**해결방법:**
```typescript
// .env 파일 생성
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

// 환경변수 로드
import Constants from 'expo-constants';
const openaiKey = Constants.expoConfig?.extra?.openaiApiKey;
```

### 문제: Google Gemini API 연동 오류
**원인:**
- API 키 권한 설정 문제
- 요청 형식 불일치
- CORS 정책 위반

**해결방법:**
```typescript
// geminiService.ts
export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const response = await fetch('http://192.xxx.xxx.xxx:3000/api/chat', { // 실행하는 환경 본인 IPv4 주소
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error(`서버 에러: ${response.status}`);
    }
    
    const data = await response.json();
    return data.reply || '답변을 생성할 수 없습니다.';
  } catch (error) {
    console.error('Gemini API 호출 실패:', error);
    throw error;
  }
};
```

---

## 🌐 백엔드 서버 연동 문제

### 문제: 백엔드 서버 요청 실패
**원인:**
- API URL 불일치 (하드코딩된 IP vs ngrok URL)
- 백엔드 서버 미실행
- 네트워크 연결 문제
- PDF 문서 로딩 미완료

**해결방법:**
```typescript
// llmRAGService.ts - 통일된 API 호출 방식
private async requestBackendAnswer(question: string): Promise<string> {
  const response = await fetch('http://192.xxx.xxx.xxx:3000/api/chat', { // 실행하는 환경 본인 IPv4 주소
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
```

### 문제: "PDF가 아직 로드 중입니다" 에러
**원인:**
- 백엔드에서 PDF 문서 로딩이 완료되지 않음
- RAG 시스템 초기화 지연

**해결방법:**
- 백엔드 서버 재시작
- PDF 문서 로딩 완료 대기
- Fallback 메시지 제공

---

## 🎨 UI/UX 개선 및 최적화

### 문제: 챗봇 응답 속도 지연
**원인:**
- 백엔드 응답 시간 과다
- UI 피드백 부족
- 캐싱 시스템 미구현

**해결방법:**
```typescript
// Promise.race를 이용한 타임아웃 처리
const generateRAGResponse = async (question: string): Promise<Message> => {
  const timeoutPromise = new Promise<Message>((_, reject) => {
    setTimeout(() => reject(new Error('응답 시간이 초과되었습니다.')), 8000);
  });
  
  const ragPromise = llmRAGService.askQuestion(question);
  
  try {
    const result = await Promise.race([ragPromise, timeoutPromise]);
    return {
      id: Date.now().toString(),
      text: removeUserNameFromAnswer(result.answer),
      isUser: false,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      id: Date.now().toString(),
      text: '죄송합니다. 현재 서버에 문제가 있어 정확한 답변을 드리기 어렵습니다. 잠시 후 다시 시도해주세요.',
      isUser: false,
      timestamp: new Date(),
    };
  }
};
```

### 문제: 사용자 대기 경험 개선 필요
**원인:**
- 로딩 상태 표시 부족
- 맥락별 대기 메시지 없음

**해결방법:**
```typescript
// 맥락별 대기 메시지 생성
const getWaitingMessage = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('요금') || lowerQuestion.includes('비용') || lowerQuestion.includes('가격')) {
    return '요금 정보를 확인하고 있습니다...';
  }
  if (lowerQuestion.includes('마감') || lowerQuestion.includes('기한') || lowerQuestion.includes('데드라인')) {
    return '마감일 정보를 조회하고 있습니다...';
  }
  if (lowerQuestion.includes('고객센터') || lowerQuestion.includes('문의') || lowerQuestion.includes('연락')) {
    return '고객센터 정보를 찾고 있습니다...';
  }
  if (lowerQuestion.includes('모구') || lowerQuestion.includes('서비스')) {
    return '모구 서비스 정보를 검색하고 있습니다...';
  }
  
  return '답변을 준비하고 있습니다...';
};
```

### 문제: 텍스트 포맷팅 문제
**원인:**
- 백엔드에서 전송된 줄바꿈이 프론트엔드에서 제대로 렌더링되지 않음
- 리스트 아이템 자동 포맷팅 부족

**해결방법:**
```typescript
const renderFormattedText = (text: string) => {
  // 줄바꿈 처리
  let processedText = text
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/(•\s)/g, '\n$1')
    .replace(/(\d+\.\s)/g, '\n$1')
    .replace(/(\n\s*\n)/g, '\n')
    .trim();
  
  const lines = processedText.split('\n');
  
  return lines.map((line, lineIndex) => {
    // 중요 키워드 강조 처리
    const importantKeywords = ['요금', '마감', '고객센터', '모구', '정산', '위시스팟'];
    let lineContent = line;
    
    importantKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      lineContent = lineContent.replace(regex, '**$1**');
    });
    
    // 볼드 텍스트 처리
    const parts = lineContent.split(/(\*\*.*?\*\*)/);
    const formattedParts = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={partIndex} style={{ fontWeight: 'bold' }}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return part;
    });
    
    return (
      <Text key={lineIndex}>
        {formattedParts}
        {lineIndex < lines.length - 1 && '\n'}
      </Text>
    );
  });
};
```

### 문제: 스크롤 위치 최적화
**원인:**
- 답변 후 적절한 스크롤 위치 부재
- 질문과 답변의 가시성 문제

**해결방법:**
```typescript
// 답변 말풍선이 화면 상단에 보이도록 스크롤
const scrollToShowAnswer = () => {
  setTimeout(() => {
    const messageCount = messages.length;
    if (messageCount > 0) {
      const scrollPosition = Math.max(0, messageCount - 1) * 200;
      scrollViewRef.current?.scrollTo({ 
        y: scrollPosition, 
        animated: true 
      });
    }
  }, 100);
};
```

---

## 🧠 RAG 품질 개선 방법

### 문제: LLM이 RAG 문맥을 활용하지 못함
**원인:**
- 임베딩 벡터 품질 저하
- 검색된 문서와 질문 간 관련성 부족
- 컨텍스트 윈도우 크기 제한

**해결방법:**

#### 1. 임베딩 모델 개선
```python
# 백엔드에서 사용할 임베딩 모델 업그레이드
from sentence_transformers import SentenceTransformer

# 한국어 특화 모델 사용
model = SentenceTransformer('jhgan/ko-sroberta-multitask')

# 문서 청킹 전략 개선
def chunk_documents(text, chunk_size=512, overlap=50):
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunk = text[i:i + chunk_size]
        chunks.append(chunk)
    return chunks
```

#### 2. 검색 정확도 향상
```python
# 하이브리드 검색 (키워드 + 의미적 검색)
def hybrid_search(query, documents, top_k=5):
    # 키워드 검색
    keyword_results = keyword_search(query, documents)
    
    # 의미적 검색
    semantic_results = semantic_search(query, documents)
    
    # 결과 결합 및 재순위
    combined_results = combine_and_rerank(keyword_results, semantic_results)
    return combined_results[:top_k]
```

#### 3. 프롬프트 엔지니어링 개선
```python
# RAG 프롬프트 템플릿 최적화
RAG_PROMPT_TEMPLATE = """
다음 문서를 참고하여 질문에 답변해주세요:

문서 내용:
{context}

질문: {question}

답변 규칙:
1. 문서 내용을 기반으로 정확한 정보만 제공
2. 문서에 없는 정보는 추측하지 말 것
3. 답변은 한국어로 작성
4. 구체적이고 실용적인 정보 제공
5. 필요시 단계별로 설명

답변:
"""
```

---

## 🤖 Gemini Context 문제 해결

### 문제: Gemini가 Context를 받지 못해 Fallback 규칙 발동
**원인:**
- API 요청 형식 오류
- 컨텍스트 전달 방식 문제
- 토큰 제한 초과

**해결방법:**

#### 1. 컨텍스트 전달 방식 개선
```typescript
// geminiService.ts - 컨텍스트 포함 요청
export const sendMessageToGemini = async (message: string, context?: string): Promise<string> => {
  try {
    const requestBody = {
      message: message,
      context: context || '',
      source: 'pdf_document'
    };
    
    const response = await fetch('http://192.xxx.xxx.xxx:3000/api/chat', { // 실행하는 환경 본인 IPv4 주소
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`서버 에러: ${response.status}`);
    }
    
    const data = await response.json();
    return data.reply || '답변을 생성할 수 없습니다.';
  } catch (error) {
    console.error('Gemini API 호출 실패:', error);
    throw error;
  }
};
```

#### 2. 임베딩 정확도 향상
```python
# 백엔드에서 임베딩 품질 개선
def improve_embedding_accuracy():
    # 1. 한국어 전처리 강화
    def preprocess_korean_text(text):
        # 한글 정규화
        text = normalize_korean_text(text)
        # 불용어 제거
        text = remove_stopwords(text)
        # 어간 추출
        text = stem_korean_words(text)
        return text
    
    # 2. 다중 임베딩 앙상블
    def create_ensemble_embedding(text):
        embeddings = []
        for model in embedding_models:
            embedding = model.encode(text)
            embeddings.append(embedding)
        return np.mean(embeddings, axis=0)
    
    # 3. 도메인 특화 임베딩
    def create_domain_specific_embedding(text, domain='ecommerce'):
        base_embedding = base_model.encode(text)
        domain_embedding = domain_model.encode(text)
        return np.concatenate([base_embedding, domain_embedding])
```

#### 3. Fallback 규칙 최적화
```typescript
// llmRAGService.ts - 개선된 Fallback 시스템
private fallbackResponse(startTime: number): LLMRAGResponse {
  const fallbackAnswers = [
    '안녕하세요! 모구봇입니다. 현재 백엔드 서버 연결에 문제가 있어 정확한 답변을 드리기 어렵습니다. 모구 서비스에 대해 궁금한 것이 있으시면 고객센터(1588-0000)로 문의해주세요.',
    '죄송합니다. 현재 시스템 점검 중입니다. 잠시 후 다시 시도해주시거나 고객센터로 문의해주세요.',
    '모구 서비스 관련 문의사항이 있으시면 고객센터(1588-0000)로 연락주시기 바랍니다.'
  ];
  
  const randomAnswer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
  
  return {
    answer: randomAnswer,
    confidence: 0.1,
    processing_time: Date.now() - startTime
  };
}
```

---

## 📱 Android Studio 빌드 문제

### 문제: Android SDK 설정 오류
**원인:**
- Android SDK 경로 설정 누락
- JDK 버전 불일치
- 환경변수 설정 오류

**해결방법:**
```bash
# 환경변수 설정
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# JDK 11 설치 및 설정
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

### 문제: Gradle 빌드 실패
**원인:**
- Gradle 버전 불일치
- 의존성 충돌
- 메모리 부족

**해결방법:**
```gradle
// android/gradle.properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
```

### 문제: 네트워크 보안 정책 오류
**원인:**
- HTTP 통신 차단
- 보안 정책 미설정

**해결방법:**
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config">
    
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <!-- 실행하는 환경 본인 IPv4 주소 -->
        <domain includeSubdomains="true">192.xxx.xxx.xxx</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

---

## 📊 성능 최적화

### 메모리 관리
```typescript
// 메시지 캐시 크기 제한
const MAX_CACHE_SIZE = 20;

// LRU 캐시 구현
class LRUCache {
  private cache = new Map();
  private maxSize: number;
  
  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }
  
  set(key: string, value: any) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

### 네트워크 최적화
```typescript
// 요청 타임아웃 설정
const REQUEST_TIMEOUT = 8000;

// AbortController를 이용한 요청 취소
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

try {
  const response = await fetch(url, {
    signal: controller.signal,
    // ... 기타 옵션
  });
  clearTimeout(timeoutId);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('요청이 타임아웃되었습니다.');
  }
}
```

---

## 🎯 결론

모구봇 서비스 개발 과정에서 발생한 주요 문제들과 해결방법을 체계적으로 정리했습니다. 특히 RAG 품질 개선과 Gemini Context 문제 해결을 통해 더 정확하고 신뢰할 수 있는 챗봇 서비스를 구축할 수 있었습니다.

### 핵심 개선사항:
1. **API 연동 안정성** 향상
2. **사용자 경험** 최적화
3. **RAG 품질** 개선
4. **Fallback 시스템** 강화
5. **성능 최적화** 구현

이 가이드를 참고하여 유사한 문제가 발생했을 때 빠르게 해결할 수 있습니다.

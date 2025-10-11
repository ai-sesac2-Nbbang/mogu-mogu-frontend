# GEMINI API 설정 가이드

## 🔑 API 키 설정 방법

### 1. GEMINI API 키 발급
1. [GEMINI 웹사이트](https://platform.GEMINI.com/)에 로그인
2. API Keys 섹션으로 이동
3. "Create new secret key" 클릭
4. API 키 복사 및 안전하게 보관

### 2. 프로젝트에 API 키 설정

#### 방법 1: 환경변수 파일 생성 (권장)
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
GEMINI_KEY=your_actual_api_key_here
```

#### 방법 2: 코드에서 직접 설정
`src/services/llmRAGService.ts` 파일의 8번째 줄을 수정:

```typescript
const GEMINI = new GEMINI({
  apiKey: 'your_actual_api_key_here', // 여기에 실제 API 키 입력
  dangerouslyAllowBrowser: true,
});
```

### 3. API 키 보안 주의사항
- ⚠️ **절대 GitHub에 API 키를 커밋하지 마세요**
- ⚠️ `.env` 파일을 `.gitignore`에 추가하세요
- ⚠️ API 키는 비공개로 유지하세요

## 🚀 사용 방법

API 키를 설정한 후 모구봇을 사용하면:

1. **자연스러운 답변**: GPT-3.5-turbo가 문서를 기반으로 자연스러운 답변 생성
2. **정확한 정보**: 지식베이스 문서만을 참고하여 정확한 정보 제공
3. **폴백 시스템**: API 오류 시 로컬 검색으로 자동 전환

## 💰 비용 정보
- GPT-3.5-turbo: $0.0015/1K tokens (입력), $0.002/1K tokens (출력)
- 일반적인 질문당 약 $0.01-0.02 정도의 비용
- GEMINI 계정에 크레딧을 충전하여 사용

## 🔧 문제 해결

### API 키 오류
```
Error: Incorrect API key provided
```
→ API 키가 올바른지 확인하세요

### 네트워크 오류
```
Error: Network request failed
```
→ 인터넷 연결을 확인하세요

### 할당량 초과
```
Error: You exceeded your current quota
```
→ GEMINI 계정의 사용량을 확인하세요

# PDF 통합 가이드

## 📋 **현재 상태**
- ✅ 하드코딩된 8개 문서로 RAG 시스템 동작 중
- ✅ PDF 파싱 코드 준비 완료 (주석 처리됨)
- ✅ LLM RAG 서비스 구현 완료

## 🔄 **PDF로 전환하는 방법**

### **1단계: PDF 파싱 서비스 활성화**

#### 파일: `src/services/pdfParserService.ts`
```typescript
// 현재 상태: 전체 파일이 주석 처리됨
/*
import * as pdfjsLib from 'pdfjs-dist';
// ... 전체 코드가 주석 처리됨
*/

// 해야 할 일: 주석을 제거하여 활성화
// 1. 파일 전체를 복사
// 2. /* 와 */ 제거
// 3. export default {}; 삭제
```

### **2단계: LLM RAG 서비스에서 PDF 파싱 활성화**

#### 파일: `src/services/llmRAGService.ts`

**현재 (주석 처리됨):**
```typescript
// PDF 파싱 서비스 (나중에 활성화)
// import pdfParserService from './pdfParserService';
```

**변경 후:**
```typescript
import pdfParserService from './pdfParserService';
```

**현재 (주석 처리됨):**
```typescript
  /*
  // PDF 파싱을 사용할 때 활성화할 메서드들
  
  /**
   * PDF 파일에서 문서 로드
   */
  /*
  async loadDocumentsFromPDF(pdfFile: File): Promise<void> {
    // ... 전체 메서드가 주석 처리됨
  }
  */
```

**변경 후:**
```typescript
  /**
   * PDF 파일에서 문서 로드
   */
  async loadDocumentsFromPDF(pdfFile: File): Promise<void> {
    try {
      const pdfDoc = await pdfParserService.parsePDF(pdfFile);
      const documents = pdfParserService.convertToKnowledgeDocuments(pdfDoc);
      this.currentDocuments = documents;
      console.log(`PDF에서 ${documents.length}개의 문서를 로드했습니다.`);
    } catch (error) {
      console.error('PDF 로드 실패:', error);
      throw error;
    }
  }
```

### **3단계: PDF 파일 업로드 기능 추가**

#### 파일: `src/screens/MoguChatScreen.tsx` (새로 추가할 부분)

```typescript
// PDF 업로드 기능 (새로 추가)
import * as DocumentPicker from 'expo-document-picker';

const handlePDFUpload = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
    
    if (!result.canceled && result.assets[0]) {
      const pdfFile = result.assets[0];
      await llmRAGService.loadDocumentsFromPDF(pdfFile);
      Alert.alert('성공', 'PDF 문서가 성공적으로 로드되었습니다.');
    }
  } catch (error) {
    Alert.alert('오류', 'PDF 파일을 로드할 수 없습니다.');
  }
};
```

### **4단계: 하드코딩된 문서 제거**

#### 파일: `src/data/knowledgeBase.ts`
```typescript
// 현재: 8개의 하드코딩된 문서
export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: 'mogu-001',
    title: '모구 서비스 소개',
    // ... 8개 문서
  }
];

// 변경 후: 빈 배열로 변경
export const knowledgeDocuments: KnowledgeDocument[] = [];
```

## 🎯 **전환 순서**

### **순서 1: PDF 파싱 활성화**
1. `src/services/pdfParserService.ts` 주석 해제
2. `src/services/llmRAGService.ts`에서 PDF 관련 주석 해제

### **순서 2: PDF 업로드 기능 추가**
1. `expo-document-picker` 설치: `npm install expo-document-picker`
2. MoguChatScreen에 PDF 업로드 버튼 추가

### **순서 3: 하드코딩된 문서 제거**
1. `src/data/knowledgeBase.ts`에서 문서 배열을 빈 배열로 변경
2. 또는 파일 자체를 삭제

## 📁 **PDF 파일 준비**

### **권장 PDF 구조:**
```
모구 서비스 가이드.pdf
├── 1. 모구 서비스 소개
├── 2. 수수료 정책
├── 3. 거래 마감 기한
├── 4. 판매 금지 품목
├── 5. 모구존 이용 방법
├── 6. 신뢰도 시스템
├── 7. 결제 시스템
└── 8. 고객센터
```

### **PDF 작성 팁:**
- 각 섹션마다 명확한 제목 사용
- 번호나 특수문자로 섹션 구분
- 구조화된 정보 제공
- 한글 제목 사용 권장

## ⚠️ **주의사항**

1. **백업**: 전환 전 현재 코드 백업
2. **테스트**: PDF 파싱 결과 확인
3. **성능**: 큰 PDF 파일은 처리 시간 고려
4. **오류 처리**: PDF 파싱 실패 시 폴백 시스템 확인

## 🚀 **완료 후 확인사항**

- [ ] PDF 파일 업로드 가능
- [ ] 파싱된 문서로 질문 답변 가능
- [ ] 기존 하드코딩된 문서 제거됨
- [ ] 오류 발생 시 적절한 메시지 표시
- [ ] 성능 테스트 완료

# 📄 PDF 문서 사용 가이드

## 🎯 **PDF 문서 저장 위치**

### 📁 **권장 폴더 구조:**
```
mogu-mogu-frontend/
├── assets/
│   └── documents/          ← PDF 문서 저장 위치
│       ├── mogu-policy.pdf
│       ├── fee-structure.pdf
│       ├── trading-rules.pdf
│       └── user-guide.pdf
├── src/
└── docs/
```

### 📂 **PDF 문서 저장 방법:**

1. **프로젝트 루트에 `assets/documents/` 폴더 생성**
2. **PDF 파일들을 해당 폴더에 복사**
3. **파일명은 영문으로 작성 (한글 파일명은 문제가 될 수 있음)**

## 🚀 **PDF 문서 로드 방법**

### 1️⃣ **단일 PDF 파일 로드:**
```typescript
import { llmRAGService } from '../services/llmRAGService';

// PDF 파일 로드
const loadPDF = async () => {
  try {
    // React Native에서 파일 선택
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    
    if (result.assets && result.assets[0]) {
      const pdfFile = result.assets[0];
      await llmRAGService.loadDocumentsFromPDF(pdfFile);
      console.log('PDF 로드 완료!');
    }
  } catch (error) {
    console.error('PDF 로드 실패:', error);
  }
};
```

### 2️⃣ **여러 PDF 파일 로드:**
```typescript
const loadMultiplePDFs = async () => {
  try {
    const results = await DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.pdf],
    });
    
    if (results.assets) {
      await llmRAGService.loadDocumentsFromMultiplePDFs(results.assets);
      console.log('모든 PDF 로드 완료!');
    }
  } catch (error) {
    console.error('PDF 로드 실패:', error);
  }
};
```

### 3️⃣ **앱 시작 시 자동 로드:**
```typescript
// App.tsx 또는 MoguChatScreen.tsx에서
useEffect(() => {
  const loadInitialDocuments = async () => {
    try {
      // assets/documents 폴더의 PDF 파일들 자동 로드
      const pdfFiles = await getPDFFilesFromAssets();
      if (pdfFiles.length > 0) {
        await llmRAGService.loadDocumentsFromMultiplePDFs(pdfFiles);
      }
    } catch (error) {
      console.error('초기 문서 로드 실패:', error);
    }
  };
  
  loadInitialDocuments();
}, []);
```

## 📋 **PDF 문서 준비 가이드**

### ✅ **권장 PDF 구조:**
```
1. 제목 (명확한 섹션 제목)
2. 내용 (구체적이고 상세한 정보)
3. 하위 섹션 (번호나 불릿 포인트 사용)
4. 예시나 사례 (가능한 경우)
```

### 📝 **PDF 작성 팁:**

1. **제목 구조화:**
   - `1. 모구 수수료 정책`
   - `2. 거래 마감 기한`
   - `3. 판매 금지 품목`

2. **키워드 포함:**
   - 수수료, 거래비용, 정책, 계산
   - 마감기한, 거래기간, 연장, 자동취소
   - 금지품목, 판매제한, 규정

3. **카테고리 분류:**
   - 수수료 관련: `수수료`
   - 거래 정책: `거래정책`
   - 판매 규정: `판매정책`
   - 모구존: `모구존`
   - 신뢰도: `신뢰도`
   - 결제: `결제`
   - 고객지원: `고객지원`
   - 서비스소개: `서비스소개`

## 🔧 **필요한 패키지 설치**

### 📦 **Document Picker 설치:**
```bash
npm install react-native-document-picker
```

### 📱 **React Native 설정:**
```typescript
// ios/Info.plist (iOS)
<key>NSDocumentPickerUsageDescription</key>
<string>PDF 문서를 선택하여 모구봇에 업로드합니다.</string>

// android/app/src/main/AndroidManifest.xml (Android)
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## 🎯 **사용 예시**

### 💬 **챗봇에서 PDF 기반 답변:**
```typescript
// 사용자가 질문하면 PDF에서 관련 정보를 찾아 답변
const response = await llmRAGService.askQuestion("모구 수수료는 어떻게 계산되나요?");
// → PDF의 수수료 정책 섹션을 기반으로 답변 생성
```

### 📊 **문서 현황 확인:**
```typescript
const documents = llmRAGService.getCurrentDocuments();
console.log(`현재 로드된 문서: ${documents.length}개`);
documents.forEach(doc => {
  console.log(`- ${doc.title} (${doc.category})`);
});
```

## ⚠️ **주의사항**

1. **파일 크기:** PDF 파일은 10MB 이하 권장
2. **텍스트 품질:** 스캔된 이미지 PDF는 OCR이 필요할 수 있음
3. **인코딩:** 한글 텍스트가 포함된 경우 UTF-8 인코딩 확인
4. **보안:** 민감한 정보가 포함된 PDF는 업로드하지 마세요

## 🚀 **다음 단계**

1. **PDF 문서 준비** → `assets/documents/` 폴더에 저장
2. **Document Picker 설치** → `npm install react-native-document-picker`
3. **PDF 로드 기능 구현** → 위의 코드 예시 참고
4. **테스트** → 모구봇에서 PDF 기반 답변 확인

이제 하드코딩된 더미 데이터 대신 실제 PDF 문서를 기반으로 한 지능적인 답변을 받을 수 있습니다! 🎉

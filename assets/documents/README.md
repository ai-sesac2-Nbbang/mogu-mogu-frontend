# 📄 PDF 문서 저장소

이 폴더는 모구봇의 RAG 시스템에서 사용할 PDF 문서들을 저장하는 곳입니다.

## 📁 **폴더 구조**
```
assets/documents/
├── README.md              ← 이 파일
├── mogu-policy.pdf        ← 모구 정책 문서 (예시)
├── fee-structure.pdf      ← 수수료 구조 문서 (예시)
├── trading-rules.pdf      ← 거래 규칙 문서 (예시)
└── user-guide.pdf         ← 사용자 가이드 문서 (예시)
```

## 🎯 **PDF 문서 업로드 방법**

### 1️⃣ **파일 복사:**
- PDF 파일을 이 폴더에 직접 복사하세요
- 파일명은 영문으로 작성하세요 (한글 파일명은 문제가 될 수 있음)

### 2️⃣ **권장 파일명:**
- `mogu-policy.pdf` - 모구 정책
- `fee-structure.pdf` - 수수료 구조
- `trading-rules.pdf` - 거래 규칙
- `user-guide.pdf` - 사용자 가이드
- `prohibited-items.pdf` - 금지 품목
- `mogu-zone.pdf` - 모구존 관련

### 3️⃣ **문서 구조 권장사항:**
```
1. 제목 (명확한 섹션 제목)
2. 내용 (구체적이고 상세한 정보)
3. 하위 섹션 (번호나 불릿 포인트 사용)
4. 예시나 사례 (가능한 경우)
```

## 🔧 **사용법**

PDF 문서를 이 폴더에 저장한 후, 앱에서 Document Picker를 사용하여 로드할 수 있습니다.

자세한 사용법은 `docs/pdf-usage-guide.md` 파일을 참고하세요.

## ⚠️ **주의사항**

- PDF 파일 크기는 10MB 이하 권장
- 텍스트가 포함된 PDF를 사용하세요 (스캔된 이미지만 있는 PDF는 OCR이 필요할 수 있음)
- 민감한 정보가 포함된 PDF는 업로드하지 마세요
- 한글 텍스트가 포함된 경우 UTF-8 인코딩을 확인하세요

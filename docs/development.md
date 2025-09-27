## 🧩 개발 가이드 (새 기능 추가)

### 1) 화면 추가
- src/screens/NewFeatureScreen.tsx 생성
- src/navigation/MainTabs.tsx 혹은 Stack에 라우트 추가
- 필요 API를 src/api에 모듈화

### 2) API 연동
- src/api/posts.ts 등으로 파일 분리
- 타입은 src/types에 정의하여 재사용

### 3) 상태관리
- 간단한 상태: React useState / useReducer
- 서버 상태: React Query 추천 (캐시/리페치/에러 핸들링 용이)

### 4) 이미지 업로드
- 클라 압축 후 업로드 권장 (권장 ≤ 8MB, 최대 15MB)
- Supabase Storage Presigned URL 방식 (백엔드 API 연동)

### 5) 알림 (시뮬레이션)
- 알림센터 화면: 승인/거절/구매확정/후기요청/만료임박 이벤트 카드 표시
- 발표용: 더미 버튼 → 토스트/배지 표시

### 6) 지도 (후순위)
- WebView + Naver Maps JS API
- 현재 위치 권한 요청 → 지도 HTML 주입 → 마커 렌더링
- v1: 내 위치만 표시 (핀 최대 20개는 차기 스프린트)
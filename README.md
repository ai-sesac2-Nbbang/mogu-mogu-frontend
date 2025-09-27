# 모구모구 프론트엔드 프로젝트
모구모구 프론트엔드는 Expo + React Native + TypeScript + React Navigation 기반으로 개발/배포할 수 있도록 구성합니다.

## ✅ 필수 설치
- [**Node.js**](https://nodejs.org/ko/download): LTS (≥ 18.x 권장)
- **EAS CLI** → CMD(명령 프롬프트) 창에서 설치
```bash
npm i -g eas-cli # Expo 빌드/배포 전용 도구 설치
```
- **Expo Go** 앱 다운로드 (실기기 테스트 시 필요, QA 필수 설치)
<img width="224" height="225" alt="image" src="https://github.com/user-attachments/assets/0b6a5927-9269-43ea-aa5b-e061bccce9b8" />

## 🚀 빠른 시작
### 1. 프로젝트 다운로드 (최초 1회)
#### 1) Github → ai-sesac2-Nbbang → mogu-mogu-frontend → git clone (주소 복사, Copy url to clipboard)
```bash
https://github.com/ai-sesac2-Nbbang/mogu-mogu-frontend.git
```
<img width="403" height="252" alt="image" src="https://github.com/user-attachments/assets/eaf8dba6-3e36-47c1-be11-af20cf5ea8ea" />

#### 2) Visual Studio Code 에서 git clone 👉 [링크](https://bba-jin.tistory.com/50#google_vignette)

### 2. 라이브러리 설치
- Visual Studio Code 실행 → 프로젝트 폴더 열기 → 터미널에서 아래의 라이브러리 설치
#### 1) Navigation
```bash
npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native-stack
npx expo install @react-navigation/bottom-tabs
```
#### 2) Gesture & Animation
```bash
npx expo install react-native-gesture-handler react-native-reanimated
npm i -D babel-preset-expo
```
#### 3) HTTP/Storage
```bash
npm i axios
npx expo install @react-native-async-storage/async-storage
```
#### 4) (선택) React Query
```bash
npm i @tanstack/react-query
```
#### 5) 지도/위치
```bash
npx expo install react-native-webview
npx expo install expo-location
```

### 3. 서버 실행
```bash
npx expo start
```
서버가 실행되면 큐알코드 → Expo 앱에서 확인할 수 있습니다.

## 📚 문서 (추후 업데이트 예정)
- [**설치 및 설정 가이드**] - 프로젝트 설정 및 개발 환경 구성
- [**개발 가이드**] - 새로운 기능 추가 및 개발 방법
- [**배포 가이드**] - 프로덕션 배포 방법

## 🛠 기술 스택
- **Runtime**: React Native (Expo, TypeScript)
- **Navigation**: React Navigation (Stack / Bottom Tabs)
- **State/HTTP**: React Query(선택) or Axios (기본)
- **Storage**: AsyncStorage (세션/토큰/로컬설정)
- **Map(추후)**: WebView + Naver Maps JS API
- **Location(추후)**: expo-location
- **Image**: Expo ImagePicker(선택), Supabase Storage 업로드(백엔드 연동)
- **Lint**: ESLint (Flat config)
- **Build/Release**: EAS Build

## 📁 프로젝트 구조 (초기 세팅 기준)
```bash
frontend/
src/
 ├─ navigation/
 │   └─ MainTabs.tsx
 ├─ screens/
 │   ├─ HomeScreen.tsx
 │   ├─ MapScreen.tsx
 │   └─ MyPageScreen.tsx
 ├─ api/            # axios 인스턴스, API 함수
 ├─ components/     # 공통 UI
 ├─ hooks/          # 커스텀 훅 (예: useAuth, usePosts)
 ├─ types/          # 타입 정의 (DTO, Entity)
 └─ utils/          # 유틸 함수
```

## 🆘 문제 해결
자주 발생하는 문제들과 해결 방법은 [설치 및 설정 가이드]를 참조하세요.

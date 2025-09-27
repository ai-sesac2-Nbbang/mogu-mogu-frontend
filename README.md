# mogu-mogu-frontend
모두의 구매, "모구모구" - 이웃과 함께하는 AI 기반 공동구매 매칭 플랫폼

# 📑 Mogumogu 프로젝트 초기 세팅 가이드

## 1. 프로젝트 설치 (로컬)
"Code" 버튼 클릭 → "Download ZIP" 클릭

## 2. 필요한 라이브러리 설치
React Navigation (필수)
```bash
npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native-stack
npx expo install @react-navigation/bottom-tabs
```
제스처 & 애니메이션
```bash
npx expo install react-native-gesture-handler react-native-reanimated
```

## 3. src 폴더 구조
아래와 같이 폴더를 구성합니다.
```bash
src/
 ┣ screens/
 ┃ ┣ HomeScreen.tsx
 ┃ ┣ MapScreen.tsx
 ┃ ┗ MyPageScreen.tsx
 ┗ navigation/
   ┗ MainTabs.tsx
```

## 4. 실행
```bash
npx expo start -c
```

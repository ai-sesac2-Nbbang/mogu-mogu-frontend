# mogu-mogu-frontend
모두의 구매, "모구모구" - 이웃과 함께하는 AI 기반 공동구매 매칭 플랫폼

# 📑 Mogumogu 프로젝트 초기 세팅 가이드

## 1. 프로젝트 생성
Expo + TypeScript 템플릿으로 프로젝트를 생성합니다.

```bash
npx create-expo-app mogumogu --template blank-typescript
cd mogumogu
```


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

## 3. Babel 설정
루트에 babel.config.js 파일이 없으면 새로 만들고, 있다면 수정합니다.
```bash
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

## 4. src 폴더 구조
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

## 5. 실행
```bash
npx expo start -c
```

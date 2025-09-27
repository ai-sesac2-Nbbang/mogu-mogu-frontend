## 🚢 배포 가이드 (EAS Build)

### 0) 로그인
```bash
eas login
```
### 1) EAS 초기화
```bash
eas init
```
### 2) 빌드 (디버그/내부 배포)
```bash
eas build -p android --profile preview  
eas build -p ios --profile preview  
```
### 3) 프로덕션 빌드
```bash
eas build -p android --profile production  
eas build -p ios --profile production  
```
⚠️ iOS는 Apple 개발자 계정 필요  
⚠️ Android는 keystore 자동 생성 가능

### 4) OTA 업데이트 (선택)
```bash
npx expo publish
```
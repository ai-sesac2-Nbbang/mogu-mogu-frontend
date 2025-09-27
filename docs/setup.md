## ⚙️ 설치 및 설정 가이드 (Dev 환경)

### 1) 프로젝트 클론
```bash
git clone <레포지토리 주소>  
cd mogumogu
```
### 2) 라이브러리 설치
```bash
npm install
```
### 3) Expo & EAS CLI
- Expo는 전역 설치 ❌ → npx로 실행  
- EAS CLI는 전역 설치 ✅  
```bash
npm install -g eas-cli
```
### 4) 환경변수/설정
Expo는 .env 대신 **app.json(또는 app.config.ts)의 expo.extra** 사용 권장.

**app.json 예시**
```bash
{
  "expo": {
    "name": "mogumogu",
    "slug": "mogumogu",
    "scheme": "mogumogu",
    "extra": {
      "apiBaseUrl": "http://localhost:8000",
      "naverMapsClientId": "YOUR_NCP_CLIENT_ID"
    }
  }
}
```

**RN에서 읽기 예시**
```bash
import Constants from "expo-constants";
const { apiBaseUrl, naverMapsClientId } = (Constants.expoConfig?.extra || {}) as any;
```
### 5) 실행
```bash
npx expo start  
```
(문제가 지속되면 캐시 클리어 후 재시작)
```bash
npx expo start -c
```
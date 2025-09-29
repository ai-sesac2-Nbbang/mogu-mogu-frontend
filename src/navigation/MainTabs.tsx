import React from "react"; // React 필수 import
import {
  createBottomTabNavigator,
  type BottomTabBarProps, // 커스텀 탭바 prop 타입
} from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

// 화면 컴포넌트 import
import HomeScreen from "../screens/HomeScreen";
import MyPageScreen from "../screens/MyPageScreen";
import MapScreen from "../screens/MapScreen";

// LoginScreen에 전달할 props 타입 정의
interface LoginScreenProps {
  setIsLoggedIn: (value: boolean) => void;
}

// 1) 탭 파라미터 타입: 각 탭의 route 파라미터 형태 정의 (전부 파라미터 없음)
type RootTabParamList = {
  Home: undefined;
  Map: undefined;
  MyPage: undefined;
};

// 2) 제네릭으로 탭 네비게이터에 타입 지정 (중요!)
const Tab = createBottomTabNavigator<RootTabParamList>();

// 3) 커스텀 TabBar: props를 BottomTabBarProps로 정확히 타이핑
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        // 현재 route에 대응하는 옵션(타이틀/라벨 등)
        const { options } = descriptors[route.key];

        // tabBarLabel은 string | (({})=>ReactNode) | undefined 이므로 문자열만 안전 추출
        let label: string;
        if (typeof options.tabBarLabel === "string") {
          label = options.tabBarLabel;
        } else if (typeof options.title === "string") {
          label = options.title;
        } else {
          label = route.name; // 최종 fallback
        }

        // 현재 포커스 여부
        const isFocused = state.index === index;

        // Tab 버튼 클릭
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true, // v6에선 명시 가능
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as never); // 타입 단언으로 안전하게
          }
        };

        // 길게 눌렀을 때(접근성/내비게이션 UX 표준 동작)
        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            // 첫 번째 탭은 왼쪽 경계선 제거해서 깔끔하게
            style={[styles.tabButton, index === 0 && styles.noLeftBorder]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isFocused && styles.tabTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// 4) 탭 네비게이터 본체
export default function MainTabs() {
  return (
    // 커스텀 탭바 주입
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "홈" }} // 커스텀 탭바 라벨로도 쓰임
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "지도",
          headerShown: false, // 지도 화면 상단 헤더 숨김 → 위에서부터 지도로 꽉 채움
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{ title: "마이페이지" }}
      />
    </Tab.Navigator>
  );
}

// 5) 스타일: 하단바/버튼/텍스트/경계선
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row", // 가로로 버튼 나열
    height: 50, // 하단바 높이
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderBottomWidth: 1, // 아래쪽 경계선 보이도록 width + color 둘 다 지정
    borderBottomColor: "#ddd",
    marginBottom: 50, // 기기 하단 제스처 영역/노치 고려 (필요 시 조절)
  },
  tabButton: {
    flex: 1, // 3등분
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1, // 버튼 사이 경계선
    borderLeftColor: "#ddd",
  },
  noLeftBorder: {
    borderLeftWidth: 0, // 첫 번째 버튼은 왼쪽 경계선 제거
  },
  tabText: {
    fontSize: 18, // 글자 크게
    color: "#666",
  },
  tabTextActive: {
    color: "#1976D2", // 활성 탭 색상
    fontWeight: "bold",
  },
});

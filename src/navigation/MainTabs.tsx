import React from "react"; 
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ 아이콘 추가

// 화면 컴포넌트 import
import HomeStack from "./HomeStack";
import MapScreen from "../screens/MapScreen";
import MyPageStack from "./MyPageStack";

// LoginScreen에 전달할 props 타입 정의
interface LoginScreenProps {
  setIsLoggedIn: (value: boolean) => void;
}

// 탭 파라미터 타입 정의
type RootTabParamList = {
  HomeStack: {
    screen?: string;
    params?: any;
  };
  Map: undefined;
  MyPageStack: undefined; // MyPage 대신 MyPageStack 사용
};

// 제네릭으로 탭 네비게이터에 타입 지정
const Tab = createBottomTabNavigator<RootTabParamList>();

// 커스텀 TabBar
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        let label: string;
        if (typeof options.tabBarLabel === "string") {
          label = options.tabBarLabel;
        } else if (typeof options.title === "string") {
          label = options.title;
        } else {
          label = route.name;
        }

        const isFocused = state.index === index;

        // 아이콘 이름 지정
        let iconName: string = "";
        if (route.name === "HomeStack") {
          iconName = isFocused ? "home" : "home-outline";
        } else if (route.name === "Map") {
          iconName = isFocused ? "location" : "location-outline";
        } else if (route.name === "MyPageStack") { // MyPage 대신 MyPageStack 사용
          iconName = isFocused ? "person" : "person-outline";
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

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
            style={[
              styles.tabButton,
              index === 0 && styles.noLeftBorder,
            ]}
            activeOpacity={0.7}
          >
            {/* ✅ 아이콘 + 텍스트 함께 표시 */}
            <Ionicons
              name={iconName as any}
              size={22}
              color={isFocused ? "#1976D2" : "#666"}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={[styles.tabText, isFocused && styles.tabTextActive]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// 메인 탭 네비게이터
export default function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: "홈",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: "모구존",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MyPageStack" // MyPage 대신 MyPageStack 사용
        component={MyPageStack} // MyPageScreen 대신 MyPageStack 사용
        options={{
          tabBarLabel: "마이페이지",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

// 스타일
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: 40,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderLeftWidth: 1,
    borderLeftColor: "#ddd",
  },
  noLeftBorder: {
    borderLeftWidth: 0,
  },
  tabText: {
    fontSize: 12,
    color: "#666",
  },
  tabTextActive: {
    color: "#1976D2",
    fontWeight: "bold",
  },
});

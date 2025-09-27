import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";
import * as Location from "expo-location";
import axios from "axios";
import Svg, { Circle, Line } from "react-native-svg";

const KAKAO_JS_KEY: string = process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? "";

// ✅ 서울시청 좌표
const SEOUL_CITY_HALL = { lat: 37.5662952, lng: 126.9779451 };
const DEFAULT_RADIUS = 3000;
const { height } = Dimensions.get("window");

interface Post {
  id: number | string;
  title: string;
  lat: number;
  lng: number;
}

export default function MapScreen() {
  const webRef = useRef<WebViewType>(null);
  const [query, setQuery] = useState<string>("");
  const [coords, setCoords] = useState(SEOUL_CITY_HALL);
  const [webLoaded, setWebLoaded] = useState(false);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("위치 권한 필요", "서울시청을 기본 위치로 사용합니다.");
        setCoords(SEOUL_CITY_HALL);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (e: any) {
      console.warn("위치 오류:", e?.message);
      setCoords(SEOUL_CITY_HALL);
    }
  };

  useEffect(() => {
    void getLocation();
  }, []);

  useEffect(() => {
    if (webLoaded && coords) {
      sendToWeb("renderCurrent", { ...coords, radius: DEFAULT_RADIUS });
    }
  }, [webLoaded, coords]);

  const sendToWeb = (fn: "renderCurrent" | "renderPosts", payload: unknown) => {
    if (!webRef.current) return;
    const js = `
      if (window.${fn}) {
        window.${fn}(${JSON.stringify(payload)});
      }
      true;
    `;
    webRef.current.injectJavaScript(js);
  };

  const onSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get<Post[]>("http://127.0.0.1:8081/posts", {
        params: { q: query },
      });
      const posts: Post[] = res.data;
      sendToWeb("renderPosts", posts);
    } catch (e: any) {
      console.error("검색 오류:", e?.message);
    }
    setQuery("");
  };

  // ✅ 대한민국 영역 제한 추가
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
        <style>html, body, #map { margin:0; padding:0; width:100%; height:100%; }</style>
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map, myMarker, myCircle, postMarkers = [];

          // ✅ 대한민국 영역 정의
          var KOREA_BOUNDS = new kakao.maps.LatLngBounds(
            new kakao.maps.LatLng(33.0, 124.0),
            new kakao.maps.LatLng(39.5, 132.0)
          );

          function initMap() {
            map = new kakao.maps.Map(document.getElementById('map'), {
              center: new kakao.maps.LatLng(37.5665, 126.9780),
              level: 5
            });

            // 초기 로딩 시 대한민국 전체 영역 맞추기
            map.setBounds(KOREA_BOUNDS);

            // 지도 이동 후 범위 체크
            kakao.maps.event.addListener(map, 'idle', function() {
              var center = map.getCenter();
              if (!KOREA_BOUNDS.contain(center)) {
                map.setBounds(KOREA_BOUNDS);
              }
            });
          }

          window.renderCurrent = function(data) {
            var pos = new kakao.maps.LatLng(data.lat, data.lng);

            if (!myMarker) {
              myMarker = new kakao.maps.Marker({ position: pos, map: map });
            } else {
              myMarker.setPosition(pos);
            }

            if (!myCircle) {
              myCircle = new kakao.maps.Circle({
                map: map,
                center: pos,
                radius: data.radius,
                strokeWeight: 2,
                strokeColor: "#1976D2",
                strokeOpacity: 0.9,
                fillColor: "#1976D2",
                fillOpacity: 0.1
              });
            } else {
              myCircle.setPosition(pos);
              myCircle.setRadius(data.radius);
            }

            map.setCenter(pos);
            map.setLevel(7);
          };

          window.renderPosts = function(posts) {
            postMarkers.forEach(m => m.setMap(null));
            postMarkers = [];

            posts.forEach(p => {
              var pos = new kakao.maps.LatLng(p.lat, p.lng);
              var marker = new kakao.maps.Marker({ position: pos, map: map });
              postMarkers.push(marker);

              var iw = new kakao.maps.InfoWindow({
                content: '<div style="padding:5px;">' + (p.title || '') + '</div>'
              });
              kakao.maps.event.addListener(marker, 'click', function() {
                iw.open(map, marker);
              });
            });
          };

          window.onload = initMap;
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="게시글 검색 (품목명)"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSearch}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        onLoadEnd={() => setWebLoaded(true)}
        style={{ flex: 1 }}
      />

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => void getLocation()}
        activeOpacity={0.8}
      >
        <Svg width={40} height={40} viewBox="0 0 40 40">
          <Circle cx={20} cy={20} r={16} stroke="#fff" strokeWidth={2} fill="#1976D2" />
          <Circle cx={20} cy={20} r={6} stroke="#fff" strokeWidth={2} fill="none" />
          <Line x1={20} y1={4}  x2={20} y2={12} stroke="#fff" strokeWidth={2} />
          <Line x1={20} y1={28} x2={20} y2={36} stroke="#fff" strokeWidth={2} />
          <Line x1={4}  y1={20} x2={12} y2={20} stroke="#fff" strokeWidth={2} />
          <Line x1={28} y1={20} x2={36} y2={20} stroke="#fff" strokeWidth={2} />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    position: "absolute",
    top: height * 0.05,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    fontSize: 16,
  },
  locationButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

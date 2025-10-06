import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';

type NotificationScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Notification'>;

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'participant' | 'complete' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  productId?: number;
  productImage?: any;
}

const NotificationScreen = () => {
  const navigation = useNavigation<NotificationScreenNavigationProp>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');

  // TODO: API에서 알림 데이터 불러오기
  useEffect(() => {
    // 더미 알림 데이터
    const dummyNotifications: Notification[] = [
      {
        id: '1',
        type: 'participant',
        title: '새로운 모구러 참여',
        message: '물티슈 10롤 모구에 새로운 참여자가 있습니다!',
        time: '5분 전',
        isRead: false,
        productId: 1,
        productImage: require('../../assets/products/tissue.png'),
      },
      {
        id: '2',
        type: 'like',
        title: '관심 등록',
        message: '다른 사용자가 내 상품에 관심을 표시했습니다.',
        time: '1시간 전',
        isRead: false,
        productId: 2,
        productImage: require('../../assets/products/toothbrush.png'),
      },
      {
        id: '3',
        type: 'complete',
        title: '모구 완료',
        message: '도브 샴푸 리필 모구가 완료되었습니다. 정산을 진행해주세요.',
        time: '3시간 전',
        isRead: true,
        productId: 3,
        productImage: require('../../assets/products/shampoo.png'),
      },
      {
        id: '4',
        type: 'comment',
        title: '새 댓글',
        message: '내가 올린 글에 댓글이 달렸습니다.',
        time: '5시간 전',
        isRead: true,
        productId: 4,
      },
      {
        id: '5',
        type: 'system',
        title: '시스템 공지',
        message: '모구모구 앱이 업데이트되었습니다. 새로운 기능을 확인해보세요!',
        time: '어제',
        isRead: true,
      },
      {
        id: '6',
        type: 'participant',
        title: '모구 마감 임박',
        message: '계란 30구 모구가 곧 마감됩니다. 서둘러 참여하세요!',
        time: '2일 전',
        isRead: true,
        productId: 4,
        productImage: require('../../assets/products/eggs.png'),
      },
    ];

    setNotifications(dummyNotifications);
  }, []);

  // 알림 아이콘 가져오기
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return { name: 'heart', color: '#FF69B4' };
      case 'comment':
        return { name: 'chatbubble', color: '#4CAF50' };
      case 'participant':
        return { name: 'people', color: '#8A2BE2' };
      case 'complete':
        return { name: 'checkmark-circle', color: '#2196F3' };
      case 'system':
        return { name: 'notifications', color: '#FF9800' };
      default:
        return { name: 'notifications-outline', color: '#999' };
    }
  };

  // 알림 클릭 핸들러
  const handleNotificationPress = (notification: Notification) => {
    // 읽음 처리
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    // TODO: API 호출하여 서버에 읽음 상태 업데이트
    /*
    try {
      await axios.put(`/api/notifications/${notification.id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
    */

    // 상품 관련 알림이면 상품 상세 페이지로 이동
    if (notification.productId) {
      navigation.navigate('ProductDetail', { productId: notification.productId });
    }
  };

  // 모두 읽음 처리
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    // TODO: API 호출
    /*
    try {
      await axios.put('/api/notifications/read-all', {}, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
    }
    */
  };

  // 필터링된 알림
  const filteredNotifications = selectedTab === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  // 알림 렌더링
  const renderNotification = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.notificationItemUnread,
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
          <Ionicons name={icon.name as any} size={24} color={icon.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            {!item.isRead && <View style={styles.unreadBadge} />}
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>

        {item.productImage && (
          <Image source={item.productImage} style={styles.productThumbnail} />
        )}
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllReadText}>모두 읽음</Text>
          </TouchableOpacity>
        )}
        {unreadCount === 0 && <View style={{ width: 60 }} />}
      </View>

      {/* 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            전체 ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'unread' && styles.tabActive]}
          onPress={() => setSelectedTab('unread')}
        >
          <Text style={[styles.tabText, selectedTab === 'unread' && styles.tabTextActive]}>
            읽지 않음 ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 알림 목록 */}
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>
            {selectedTab === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
          </Text>
          <Text style={styles.emptySubText}>
            새로운 알림이 도착하면 여기에 표시됩니다
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllReadText: {
    fontSize: 14,
    color: '#8A2BE2',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#8A2BE2',
  },
  tabText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  notificationItemUnread: {
    backgroundColor: '#f9f5ff',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  productThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default NotificationScreen;


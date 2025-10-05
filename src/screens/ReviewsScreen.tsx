import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// 후기 타입 정의
interface Review {
  id: string;
  reviewerName: string;
  reviewerImage?: string;
  rating: number; // 1-5
  comment: string;
  tags: string[]; // 후기 태그들
  date: string;
}

const ReviewsScreen = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState<Review[]>([]);

  // TODO: DB에서 받은 후기 불러오기
  /*
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/user/reviews', {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        
        if (response.data.success) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.error('받은 후기 조회 실패:', error);
      }
    };
    
    fetchReviews();
  }, []);
  */

  // 더미 데이터 (받은 후기들)
  useEffect(() => {
    const dummyReviews: Review[] = [
      {
        id: "1",
        reviewerName: "김모구",
        rating: 5,
        comment: "시간 약속도 잘 지키시고 친절하셨어요! 다음에도 거래하고 싶습니다.",
        tags: ["시간 및 장소 약속을 잘 지켜요.", "소통이 친절하고 설명이 정확해요."],
        date: "2025.10.03"
      },
      {
        id: "2",
        reviewerName: "이모구",
        rating: 5,
        comment: "정산도 빠르고 상품 상태도 설명과 같았어요. 감사합니다!",
        tags: ["정산이 빠르고 깔끔해요.", "상품 상태가 설명과 같아요."],
        date: "2025.10.02"
      },
      {
        id: "3",
        reviewerName: "박모구",
        rating: 4,
        comment: "응답이 빨라서 좋았어요. 다만 약속 시간에 조금 늦으셨어요.",
        tags: ["응답이 빨라요."],
        date: "2025.10.01"
      },
      {
        id: "4",
        reviewerName: "최모구",
        rating: 5,
        comment: "완벽한 거래였습니다! 상품도 좋고 친절하셨어요.",
        tags: ["소통이 친절하고 설명이 정확해요.", "상품 상태가 설명과 같아요.", "응답이 빨라요."],
        date: "2025.09.30"
      },
      {
        id: "5",
        reviewerName: "정모구",
        rating: 5,
        comment: "시간 약속 잘 지키시고 정산도 빠르셨어요. 추천합니다!",
        tags: ["시간 및 장소 약속을 잘 지켜요.", "정산이 빠르고 깔끔해요."],
        date: "2025.09.29"
      },
      {
        id: "6",
        reviewerName: "강모구",
        rating: 5,
        comment: "모든 면에서 완벽했습니다. 감사합니다!",
        tags: ["시간 및 장소 약속을 잘 지켜요.", "소통이 친절하고 설명이 정확해요.", "정산이 빠르고 깔끔해요."],
        date: "2025.09.28"
      },
      {
        id: "7",
        reviewerName: "윤모구",
        rating: 4,
        comment: "좋은 거래였어요. 다음에 또 거래하고 싶습니다.",
        tags: ["상품 상태가 설명과 같아요."],
        date: "2025.09.27"
      },
    ];
    
    setReviews(dummyReviews);
  }, []);

  // 평균 평점 계산
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  // 별점 렌더링
  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color={star <= rating ? "#FFD700" : "#ddd"}
          />
        ))}
      </View>
    );
  };

  // 후기 렌더링
  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <View style={styles.reviewerAvatar}>
            <Ionicons name="person" size={24} color="#8A2BE2" />
          </View>
          <View>
            <Text style={styles.reviewerName}>{item.reviewerName}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        {renderStars(item.rating)}
      </View>
      
      <Text style={styles.reviewComment}>{item.comment}</Text>
      
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>받은 후기</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 후기 통계 */}
      <View style={styles.statsContainer}>
        <View style={styles.statsBox}>
          <Text style={styles.statsNumber}>{reviews.length}</Text>
          <Text style={styles.statsLabel}>받은 후기</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsBox}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <Text style={styles.statsNumber}>{averageRating}</Text>
          </View>
          <Text style={styles.statsLabel}>평균 평점</Text>
        </View>
      </View>

      {/* 후기 목록 */}
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbox-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>받은 후기가 없습니다</Text>
          <Text style={styles.emptySubText}>거래를 완료하면 후기를 받을 수 있어요!</Text>
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
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 50 + 15 + 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginHorizontal: 15,
  },
  statsBox: {
    flex: 1,
    alignItems: 'center',
  },
  statsDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 20,
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0e6fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0e6fa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  tagText: {
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ReviewsScreen;
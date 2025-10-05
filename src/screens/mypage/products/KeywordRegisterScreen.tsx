import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants'; // Constants import

const KeywordRegisterScreen = () => {
  const navigation = useNavigation();
  const [keyword, setKeyword] = useState('');
  const [registeredKeywords, setRegisteredKeywords] = useState(['문화장지', '물티슈', '칫솔', '샴푸']); // 임시 키워드

  const addKeyword = () => {
    if (keyword.trim() && !registeredKeywords.includes(keyword.trim())) {
      setRegisteredKeywords([...registeredKeywords, keyword.trim()]);
      setKeyword('');
    }
  };

  const removeKeyword = (itemToRemove: string) => {
    setRegisteredKeywords(registeredKeywords.filter(item => item !== itemToRemove));
  };

  const renderKeywordItem = ({ item }: { item: string }) => (
    <View style={styles.keywordItem}>
      <Text style={styles.keywordText}>{item}</Text>
      <TouchableOpacity onPress={() => removeKeyword(item)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <View>
      <View style={styles.searchSection}>
        <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="상품 검색"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={addKeyword} // 엔터 키로 키워드 추가
        />
        {keyword.trim().length > 0 && (
          <TouchableOpacity onPress={addKeyword} style={styles.addButton}>
            <Text style={styles.addButtonText}>등록</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>등록된 키워드</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>키워드 등록</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <FlatList
        data={registeredKeywords}
        renderItem={renderKeywordItem}
        keyExtractor={(item) => item}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.flatListContentContainer}
      />
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
  rightPlaceholder: {
    width: 24, // Match back button size for alignment
  },
  flatListContentContainer: {
    paddingTop: 50 + 15 + 15,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6fa',
    borderRadius: 25,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    marginVertical: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: '#333',
  },
  keywordList: {
    // 기존의 keywordList 스타일은 FlatList의 contentContainerStyle로 대체되므로 필요 없음
  },
  keywordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  keywordText: {
    fontSize: 16,
    color: '#555',
  },
  removeButton: {
    backgroundColor: '#ff6347',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default KeywordRegisterScreen;

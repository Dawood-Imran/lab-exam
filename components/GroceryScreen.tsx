import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { id: '1', name: 'Fruits', icon: 'nutrition' },
  { id: '2', name: 'Vegetables', icon: 'leaf' },
  { id: '3', name: 'Bakery', icon: 'pizza' },
  { id: '4', name: 'Milk', icon: 'water' },
];

const products = [
  { id: '1', name: 'Mango', price: 1.20, image: 'https://example.com/mango.jpg', discount: null },
  { id: '2', name: 'Lemon', price: 0.80, image: 'https://example.com/lemon.jpg', discount: 50 },
  { id: '3', name: 'Pineapple', price: 1.87, image: 'https://example.com/pineapple.jpg', discount: null },
  { id: '4', name: 'Coconut', price: 1.87, image: 'https://example.com/coconut.jpg', discount: null },
  { id: '5', name: 'Strawberry', price: 2.50, image: 'https://example.com/strawberry.jpg', discount: null },
];

const GroceryScreen = () => {
  const navigation = useNavigation();

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={24} color="white" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item, index }) => (
    <View style={[styles.productItem, { marginTop: index % 2 === 0 ? 0 : 20 }]}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>
      )}
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grocery</Text>
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products"
          placeholderTextColor="gray"
        />
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
      />
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 16,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  categoryList: {
    paddingVertical: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 15,
    height: 110,
    justifyContent: 'space-between',
    width: 80,
  },
  categoryIcon: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 15,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  productList: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 5,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 5,
  },
});

export default GroceryScreen;

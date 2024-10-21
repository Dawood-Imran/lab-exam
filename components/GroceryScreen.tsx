import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../hooks/useProducts';

// Add this import at the top of the file
import productImage from '../assets/coffe-1.jpg';

const API_URL = 'https://simple-grocery-store-api.online/products';

interface Category {
  id: string;
  name: string;
  icon: string;
  apiName: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  inStock: boolean;
}

const categories: Category[] = [
  { id: '1', name: 'All', icon: 'grid-outline', apiName: 'all' },
  { id: '2', name: 'Coffee', icon: 'cafe', apiName: 'coffee' },
  { id: '3', name: 'Fresh Produce', icon: 'leaf', apiName: 'fresh-produce' },
  { id: '4', name: 'Meat & Seafood', icon: 'fish', apiName: 'meat-seafood' },
  { id: '5', name: 'Dairy', icon: 'water', apiName: 'dairy' },
];

const GroceryScreen = () => {
  const navigation = useNavigation();
  const { products, loading, error, isOffline } = useProducts(API_URL);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    const category = categories.find(c => c.name === selectedCategory);
    if (!category) return products;
    return products.filter(product => product.category.toLowerCase() === category.apiName.toLowerCase());
  }, [products, selectedCategory]);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, selectedCategory === item.name && styles.selectedCategory]} 
      onPress={() => setSelectedCategory(item.name)}
    >
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon as any} size={24} color="white" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item, index }: { item: Product; index: number }) => {
    return (
      <View style={[styles.productItem, { marginTop: index % 2 === 0 ? 0 : 20 }]}>
        <Image source={productImage} style={styles.productImage} resizeMode="cover" />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productStock}>{item.inStock ? 'In Stock' : 'Out of Stock'}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderOfflineBar = () => (
    <View style={styles.offlineBar}>
      <Text style={styles.offlineText}>You are offline. Showing cached data.</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grocery</Text>
        <View style={{ width: 24 }} />
      </View>
      {isOffline && renderOfflineBar()}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <View key={category.id}>
            {renderCategory({ item: category })}
          </View>
        ))}
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  selectedCategory: {
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
  },
  categoryIcon: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 10,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
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
  productImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },
  productCategory: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  productStock: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  offlineBar: {
    backgroundColor: '#f8d7da',
    padding: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: '#721c24',
  },
});

export default GroceryScreen;

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface Product {
  id: number;
  category: string;
  name: string;
  inStock: boolean;
}

const CACHE_KEY = 'GROCERY_PRODUCTS';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useProducts = (url: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check network connectivity
        const netInfo = await NetInfo.fetch();
        setIsOffline(!netInfo.isConnected);

        if (netInfo.isConnected) {
          // If online, fetch from API
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          setProducts(data);

          // Cache the new data
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        } else {
          // If offline, load from cache
          const cachedData = await AsyncStorage.getItem(CACHE_KEY);
          if (cachedData) {
            const { data } = JSON.parse(cachedData);
            setProducts(data);
          } else {
            throw new Error('No cached data available');
          }
        }

        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);

        // If error occurs, try to load cached data
        try {
          const cachedData = await AsyncStorage.getItem(CACHE_KEY);
          if (cachedData) {
            const { data } = JSON.parse(cachedData);
            setProducts(data);
            setError(null); // Clear error if we successfully loaded cached data
          }
        } catch (cacheErr) {
          console.error('Failed to load cached data:', cacheErr);
        }
      }
    };

    fetchProducts();

    // Set up a listener for network status changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [url]);

  return { products, loading, error, isOffline };
};

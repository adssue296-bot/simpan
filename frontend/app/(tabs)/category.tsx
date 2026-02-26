import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import CustomHeader from '../../src/components/CustomHeader';
import CategoryRow from '../../src/components/CategoryRow';
import { fetchCategories, fetchCartCount } from '../../src/constants/api';

export default function CategoryScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [cats, cart] = await Promise.all([fetchCategories(), fetchCartCount()]);
      setCategories(cats);
      setCartCount(cart.count || 0);
    } catch (e) {
      console.error('Error loading categories:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (loading) {
    return (
      <View testID="category-loading" style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View testID="category-screen" style={styles.container}>
      <CustomHeader
        title="Looking For"
        cartCount={cartCount}
        onSearchPress={() => router.push('/search')}
        onCartPress={() => {}}
      />
      <FlatList
        testID="category-list"
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryRow
            name={item.name}
            imageUrl={item.image_url}
            onPress={() => router.push(`/category/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

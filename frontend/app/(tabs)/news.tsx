import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';
import CustomHeader from '../../src/components/CustomHeader';
import { fetchNews, fetchCartCount } from '../../src/constants/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NewsScreen() {
  const router = useRouter();
  const [news, setNews] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [newsData, cart] = await Promise.all([fetchNews(), fetchCartCount()]);
      setNews(newsData);
      setCartCount(cart.count || 0);
    } catch (e) {
      console.error('Error loading news:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHrs < 1) return 'Baru sahaja';
    if (diffHrs < 24) return `${diffHrs} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('ms-MY');
  };

  if (loading) {
    return (
      <View testID="news-loading" style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View testID="news-screen" style={styles.container}>
      <CustomHeader
        title="News"
        cartCount={cartCount}
        onSearchPress={() => router.push('/search')}
        onCartPress={() => {}}
      />
      <View style={styles.headerSection}>
        <View style={styles.headerIcon}>
          <Ionicons name="newspaper" size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.headerText}>LATEST NEWS</Text>
      </View>
      <FlatList
        testID="news-list"
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity testID={`news-item-${item.id}`} style={[styles.newsCard, index === 0 && styles.firstCard]} activeOpacity={0.8}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={index === 0 ? styles.firstImage : styles.newsImage} resizeMode="cover" />
            ) : null}
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
              {item.description ? (
                <Text style={styles.newsDescription} numberOfLines={3}>{item.description}</Text>
              ) : null}
              <View style={styles.newsFooter}>
                <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.newsTime}>{formatDate(item.created_at)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
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
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  newsCard: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBg,
  },
  firstCard: {
    marginBottom: SPACING.l,
  },
  firstImage: {
    width: '100%',
    height: 180,
  },
  newsImage: {
    width: '100%',
    height: 140,
  },
  newsContent: {
    padding: SPACING.m,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 6,
  },
  newsDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newsTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

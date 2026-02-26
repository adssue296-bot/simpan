import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchListing } from '../../src/constants/api';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchListing(id!);
        setListing(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <View testID="listing-detail-loading" style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View testID="listing-not-found" style={styles.loadingContainer}>
        <Text style={{ color: COLORS.textSecondary }}>Perkhidmatan tidak dijumpai</Text>
      </View>
    );
  }

  return (
    <View testID="listing-detail-screen" style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity testID="listing-back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text testID="listing-detail-title" style={styles.headerTitle} numberOfLines={1}>{listing.name}</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          testID="listing-detail-image"
          source={{ uri: listing.image_url }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text testID="listing-name" style={styles.name}>{listing.name}</Text>
          {listing.rating > 0 && (
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★ {listing.rating.toFixed(1)}</Text>
              {listing.price_range && <Text style={styles.price}>{listing.price_range}</Text>}
            </View>
          )}
          {listing.description && (
            <Text testID="listing-description" style={styles.description}>{listing.description}</Text>
          )}
          {listing.address && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>{listing.address}</Text>
            </View>
          )}
          {listing.phone && (
            <TouchableOpacity testID="listing-call-btn" style={styles.infoRow} onPress={() => Linking.openURL(`tel:${listing.phone}`)}>
              <Ionicons name="call-outline" size={18} color={COLORS.primary} />
              <Text style={[styles.infoText, { color: COLORS.primary }]}>{listing.phone}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity testID="add-to-cart-btn" style={styles.actionBtn} activeOpacity={0.8}>
            <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Tambah ke Troli</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    padding: SPACING.l,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
    gap: 12,
  },
  rating: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.l,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.darkText,
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: SPACING.l,
    gap: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

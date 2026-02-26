import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../src/constants/theme';
import CustomHeader from '../../src/components/CustomHeader';
import ListingCard from '../../src/components/ListingCard';
import { fetchBanners, fetchListings, fetchCartCount } from '../../src/constants/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [bannersData, featuredData, allData, cartData] = await Promise.all([
        fetchBanners(),
        fetchListings(undefined, true),
        fetchListings(),
        fetchCartCount(),
      ]);
      setBanners(bannersData);
      setFeaturedListings(featuredData);
      setAllListings(allData);
      setCartCount(cartData.count || 0);
    } catch (e) {
      console.error('Error loading home data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (loading) {
    return (
      <View testID="home-loading" style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View testID="home-screen" style={styles.container}>
      <CustomHeader
        title="MYLokal"
        cartCount={cartCount}
        onSearchPress={() => router.push('/search')}
        onCartPress={() => {}}
      />
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View testID="welcome-banner" style={styles.welcomeBanner}>
          <Text style={styles.welcomeText}>WELCOME TO</Text>
          <View style={styles.logoRow}>
            <Text style={[styles.logoText, { color: '#FF0000' }]}>M</Text>
            <Text style={[styles.logoText, { color: '#00AA00' }]}>Y</Text>
            <Text style={[styles.logoText, { color: '#FF6600' }]}>L</Text>
            <Text style={[styles.logoText, { color: '#0066FF' }]}>o</Text>
            <Text style={[styles.logoText, { color: '#FF00FF' }]}>k</Text>
            <Text style={[styles.logoText, { color: '#FFD700' }]}>a</Text>
            <Text style={[styles.logoText, { color: '#FF0000' }]}>l</Text>
          </View>
          <TouchableOpacity testID="join-now-btn" style={styles.joinBtn}>
            <Text style={styles.joinBtnText}>JOIN NOW</Text>
          </TouchableOpacity>
        </View>

        {/* Jalan Jalan Banner */}
        <View testID="jalan-banner" style={styles.jalanBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1508062878650-88b52897f298?auto=format&fit=crop&w=800&q=80' }}
            style={styles.jalanImage}
            resizeMode="cover"
          />
          <View style={styles.jalanOverlay}>
            <Text style={styles.jalanTitle}>Jalan jalan</Text>
            <Text style={styles.jalanSubtitle}>Cari Makan</Text>
          </View>
        </View>

        {/* Featured Hotel Banner */}
        {banners.filter(b => b.banner_type === 'featured').map((banner) => (
          <View testID={`featured-banner-${banner.id}`} key={banner.id} style={styles.hotelBanner}>
            <View style={styles.hotelLeft}>
              <Text style={styles.hotelTitle}>{banner.title}</Text>
              <Text style={styles.hotelSubtitle}>{banner.subtitle}</Text>
            </View>
            <Image
              source={{ uri: banner.image_url }}
              style={styles.hotelImage}
              resizeMode="cover"
            />
          </View>
        ))}

        {/* Featured Listings */}
        {featuredListings.length > 0 && (
          <View style={styles.section}>
            <Text testID="featured-section-title" style={styles.sectionTitle}>Featured</Text>
            <View style={styles.listingGrid}>
              {featuredListings.map((item) => (
                <ListingCard
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  imageUrl={item.image_url}
                  rating={item.rating}
                  priceRange={item.price_range}
                  onPress={() => router.push(`/listing/${item.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {/* All Listings */}
        <View style={styles.section}>
          <Text testID="all-listings-title" style={styles.sectionTitle}>Semua Perkhidmatan</Text>
          <View style={styles.listingGrid}>
            {allListings.slice(0, 6).map((item) => (
              <ListingCard
                key={item.id}
                name={item.name}
                description={item.description}
                imageUrl={item.image_url}
                rating={item.rating}
                priceRange={item.price_range}
                onPress={() => router.push(`/listing/${item.id}`)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
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
  scrollView: {
    flex: 1,
  },
  welcomeBanner: {
    backgroundColor: COLORS.bannerYellow,
    paddingVertical: 24,
    paddingHorizontal: SPACING.m,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CC0000',
    letterSpacing: 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  joinBtn: {
    backgroundColor: '#CC0000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 12,
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  jalanBanner: {
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  jalanImage: {
    width: '100%',
    height: '100%',
  },
  jalanOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,50,0.4)',
  },
  jalanTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  jalanSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  hotelBanner: {
    flexDirection: 'row',
    height: 160,
    overflow: 'hidden',
    backgroundColor: '#1A2744',
  },
  hotelLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: SPACING.l,
    backgroundColor: '#C4A265',
  },
  hotelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  hotelSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 4,
  },
  hotelImage: {
    flex: 1.2,
    height: '100%',
  },
  section: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: SPACING.m,
  },
  listingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

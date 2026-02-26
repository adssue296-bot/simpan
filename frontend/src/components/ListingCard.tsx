import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

interface ListingCardProps {
  name: string;
  description: string;
  imageUrl: string;
  rating?: number;
  priceRange?: string;
  onPress: () => void;
}

export default function ListingCard({ name, description, imageUrl, rating, priceRange, onPress }: ListingCardProps) {
  return (
    <TouchableOpacity testID={`listing-card-${name.toLowerCase().replace(/\s+/g, '-')}`} style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {rating !== undefined && rating > 0 && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>★ {rating.toFixed(1)}</Text>
            {priceRange ? <Text style={styles.priceText}>{priceRange}</Text> : null}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: (width - 48) / 2,
    marginBottom: SPACING.m,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.lightGray,
  },
  overlay: {
    padding: SPACING.s,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

interface CategoryRowProps {
  name: string;
  imageUrl: string;
  onPress: () => void;
}

export default function CategoryRow({ name, imageUrl, onPress }: CategoryRowProps) {
  return (
    <TouchableOpacity testID={`category-row-${name.toLowerCase().replace(/[^a-z]/g, '-')}`} style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image
        testID={`category-image-${name.toLowerCase().replace(/[^a-z]/g, '-')}`}
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text testID={`category-name-${name.toLowerCase().replace(/[^a-z]/g, '-')}`} style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: COLORS.lightGray,
  },
  textContainer: {
    flex: 1,
    marginLeft: SPACING.l,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
    letterSpacing: 0.5,
  },
});

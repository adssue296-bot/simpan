import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

interface CustomHeaderProps {
  title: string;
  cartCount?: number;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onCartPress?: () => void;
}

export default function CustomHeader({ title, cartCount = 0, onMenuPress, onSearchPress, onCartPress }: CustomHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View testID="custom-header" style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <TouchableOpacity testID="header-menu-btn" onPress={onMenuPress} style={styles.iconBtn}>
          <Ionicons name="menu" size={26} color={COLORS.primary} />
        </TouchableOpacity>

        <Text testID="header-title" style={styles.title}>{title}</Text>

        <View style={styles.rightIcons}>
          <TouchableOpacity testID="header-search-btn" onPress={onSearchPress} style={styles.iconBtn}>
            <Ionicons name="search" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity testID="header-cart-btn" onPress={onCartPress} style={styles.iconBtn}>
            <Ionicons name="cart" size={24} color={COLORS.primary} />
            {cartCount > 0 && (
              <View testID="cart-badge" style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 50,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.notificationBadge,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

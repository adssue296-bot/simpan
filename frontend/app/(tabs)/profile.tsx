import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';
import CustomHeader from '../../src/components/CustomHeader';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const menuItems = [
  { icon: 'person-outline', label: 'Edit Profil', color: '#4CAF50' },
  { icon: 'cart-outline', label: 'Pesanan Saya', color: '#FF9800' },
  { icon: 'heart-outline', label: 'Senarai Kegemaran', color: '#E91E63' },
  { icon: 'gift-outline', label: 'Kupon Saya', color: '#9C27B0' },
  { icon: 'location-outline', label: 'Alamat Saya', color: '#2196F3' },
  { icon: 'card-outline', label: 'Kaedah Pembayaran', color: '#009688' },
  { icon: 'notifications-outline', label: 'Tetapan Notifikasi', color: '#FF5722' },
  { icon: 'help-circle-outline', label: 'Bantuan & Sokongan', color: '#607D8B' },
  { icon: 'information-circle-outline', label: 'Tentang MYLokal', color: '#3F51B5' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View testID="profile-screen" style={styles.container}>
      <CustomHeader
        title="MYProfile"
        onSearchPress={() => router.push('/search')}
        onCartPress={() => {}}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View testID="profile-header" style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <Ionicons name="person" size={40} color={COLORS.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profileEmail}>Sila log masuk untuk akses penuh</Text>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity testID="login-btn" style={styles.loginBtn} activeOpacity={0.8}>
          <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
          <Text style={styles.loginBtnText}>LOG MASUK / DAFTAR</Text>
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              testID={`profile-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              key={idx}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity testID="logout-btn" style={styles.logoutBtn} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Keluar</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0E6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    marginLeft: SPACING.m,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.m,
    marginTop: SPACING.m,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuSection: {
    marginTop: SPACING.m,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkText,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.m,
    marginTop: SPACING.l,
    paddingVertical: 14,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
});

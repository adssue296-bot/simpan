import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';
import CustomHeader from '../../src/components/CustomHeader';
import { fetchNotifications, markNotificationRead, fetchCartCount } from '../../src/constants/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const NOTIF_ICONS: Record<string, string> = {
  welcome: 'happy-outline',
  promo: 'pricetag-outline',
  update: 'refresh-outline',
  booking: 'calendar-outline',
  general: 'notifications-outline',
};

export default function NotificationScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [notifs, cart] = await Promise.all([fetchNotifications(), fetchCartCount()]);
      setNotifications(notifs);
      setCartCount(cart.count || 0);
    } catch (e) {
      console.error('Error loading notifications:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const handleRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

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
      <View testID="notification-loading" style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View testID="notification-screen" style={styles.container}>
      <CustomHeader
        title="Notification"
        cartCount={cartCount}
        onSearchPress={() => router.push('/search')}
        onCartPress={() => {}}
      />
      <FlatList
        testID="notification-list"
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`notification-item-${item.id}`}
            style={[styles.notifCard, !item.is_read && styles.unread]}
            activeOpacity={0.7}
            onPress={() => handleRead(item.id)}
          >
            <View style={[styles.iconWrap, !item.is_read && styles.iconWrapUnread]}>
              <Ionicons
                name={(NOTIF_ICONS[item.notification_type] || 'notifications-outline') as any}
                size={22}
                color={!item.is_read ? '#FFFFFF' : COLORS.primary}
              />
            </View>
            <View style={styles.notifContent}>
              <Text style={[styles.notifTitle, !item.is_read && styles.notifTitleUnread]}>{item.title}</Text>
              <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
              <Text style={styles.notifTime}>{formatDate(item.created_at)}</Text>
            </View>
            {!item.is_read && <View testID="unread-dot" style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: SPACING.s }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Tiada notifikasi</Text>
          </View>
        }
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
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  unread: {
    backgroundColor: '#FFF5FF',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  iconWrapUnread: {
    backgroundColor: COLORS.primary,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  notifTitleUnread: {
    fontWeight: 'bold',
  },
  notifMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.s,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
  },
});

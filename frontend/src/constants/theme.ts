const COLORS = {
  primary: '#FF00FF',
  secondary: '#FFA500',
  background: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#666666',
  border: '#E5E5E5',
  notificationBadge: '#FF0000',
  bannerYellow: '#FFD700',
  headerBg: '#FFFFFF',
  tabBarBg: '#FFFFFF',
  cardBg: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkText: '#1A1A1A',
  success: '#4CAF50',
};

const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

const FONTS = {
  heading: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500' as const,
  },
};

export { COLORS, SPACING, FONTS };

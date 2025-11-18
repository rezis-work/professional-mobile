/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    cardBackground: '#FFFFFF',
    border: '#E5E7EB',
    secondaryBackground: '#F3F4F6',
    mutedIcon: '#6B7280',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    unreadBadge: '#3B82F6',
    notificationBadgeBg: '#FEE2E2',
    notificationBadgeText: '#DC2626',
    white: '#FFFFFF',
    // Stats colors
    statBlue: '#3B82F6',
    statAmber: '#F59E0B',
    statGreen: '#10B981',
    statPurple: '#8B5CF6',
    statRed: '#EF4444',
    // Availability colors
    availabilityNow: '#10B981',
    availabilityTomorrow: '#F59E0B',
    availabilityNextWeek: '#3B82F6',
    availabilityOnHoliday: '#6B7280',
    // Status colors
    statusApproved: '#10B981',
    statusRejected: '#EF4444',
    statusPending: '#F59E0B',
    statusDefault: '#6B7280',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    cardBackground: '#1F2937',
    border: '#374151',
    secondaryBackground: '#111827',
    mutedIcon: '#9CA3AF',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    primary: '#2563EB',
    secondary: '#7C3AED',
    unreadBadge: '#2563EB',
    notificationBadgeBg: '#7F1D1D',
    notificationBadgeText: '#FCA5A5',
    white: '#FFFFFF',
    // Stats colors
    statBlue: '#3B82F6',
    statAmber: '#F59E0B',
    statGreen: '#10B981',
    statPurple: '#8B5CF6',
    statRed: '#EF4444',
    // Availability colors
    availabilityNow: '#10B981',
    availabilityTomorrow: '#F59E0B',
    availabilityNextWeek: '#2563EB',
    availabilityOnHoliday: '#9CA3AF',
    // Status colors
    statusApproved: '#10B981',
    statusRejected: '#EF4444',
    statusPending: '#F59E0B',
    statusDefault: '#9CA3AF',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

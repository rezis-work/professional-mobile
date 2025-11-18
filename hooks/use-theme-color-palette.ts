import { useThemeColor } from './use-theme-color';

export function useThemeColorPalette() {
  return {
    // Basic colors
    text: useThemeColor({}, 'text'),
    background: useThemeColor({}, 'background'),
    cardBackground: useThemeColor({}, 'cardBackground'),
    secondaryBackground: useThemeColor({}, 'secondaryBackground'),
    border: useThemeColor({}, 'border'),
    white: useThemeColor({}, 'white'),
    
    // Brand colors
    tint: useThemeColor({}, 'tint'),
    primary: useThemeColor({}, 'primary'),
    secondary: useThemeColor({}, 'secondary'),
    
    // Semantic colors
    success: useThemeColor({}, 'success'),
    error: useThemeColor({}, 'error'),
    warning: useThemeColor({}, 'warning'),
    
    // Icon colors
    icon: useThemeColor({}, 'icon'),
    mutedIcon: useThemeColor({}, 'mutedIcon'),
    
    // Stats colors
    statBlue: useThemeColor({}, 'statBlue'),
    statAmber: useThemeColor({}, 'statAmber'),
    statGreen: useThemeColor({}, 'statGreen'),
    statPurple: useThemeColor({}, 'statPurple'),
    statRed: useThemeColor({}, 'statRed'),
    
    // Availability colors
    availabilityNow: useThemeColor({}, 'availabilityNow'),
    availabilityTomorrow: useThemeColor({}, 'availabilityTomorrow'),
    availabilityNextWeek: useThemeColor({}, 'availabilityNextWeek'),
    availabilityOnHoliday: useThemeColor({}, 'availabilityOnHoliday'),
    
    // Status colors
    statusApproved: useThemeColor({}, 'statusApproved'),
    statusRejected: useThemeColor({}, 'statusRejected'),
    statusPending: useThemeColor({}, 'statusPending'),
    statusDefault: useThemeColor({}, 'statusDefault'),
    
    // Notification colors
    unreadBadge: useThemeColor({}, 'unreadBadge'),
    notificationBadgeBg: useThemeColor({}, 'notificationBadgeBg'),
    notificationBadgeText: useThemeColor({}, 'notificationBadgeText'),
  };
}

export default useThemeColorPalette;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type TabItem = {
  key: string;
  icon: string;
  label: string;
  badge?: boolean;
};

const TABS: TabItem[] = [
  { key: 'home', icon: '🏠', label: 'Accueil' },
  { key: 'network', icon: '👥', label: 'Réseau' },
  { key: 'messages', icon: '💬', label: 'Messages' },
  { key: 'notifications', icon: '🔔', label: 'Notifs', badge: true },
  { key: 'settings', icon: '⚙️', label: 'Paramètres' },
];

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const currentRouteName = state.routes[state.index]?.name;

  // Map the original tab keys to route names used in the navigator
  const mapKeyToRoute = (key: string) => (key === 'home' ? 'index' : key);

  return (
    <View style={[styles.navbar, { backgroundColor: theme.background }]}> 
      {TABS.map((tab) => {
        const routeName = mapKeyToRoute(tab.key);
        const focused = currentRouteName === routeName;
        const color = focused ? theme.tint : '#888';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: routeName });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(routeName as never);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: routeName });
        };

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="button"
          >
            {focused && <View style={styles.navIndicator} />}

            <View style={styles.navIconWrapper}>
              <Text style={[styles.navIcon, { color }]}>{tab.icon}</Text>
              {tab.badge === true && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              )}
            </View>

            <Text style={[styles.navLabel, focused && styles.navLabelActive, { color }]}> 
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
    position: 'relative',
  },
  navIconWrapper: {
    position: 'relative',
  },
  navIcon: {
    fontSize: 22,
  },
  navLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#000',
    fontWeight: '700',
  },
  navIndicator: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#000',
    borderRadius: 1,
  },
});

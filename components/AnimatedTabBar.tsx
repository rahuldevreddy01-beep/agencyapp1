import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { TabKey } from '../lib/types';

interface Tab {
  key: TabKey;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const TABS: Tab[] = [
  { key: 'Home',     icon: 'home-outline',       activeIcon: 'home',       label: 'Home'     },
  { key: 'Services', icon: 'layers-outline',     activeIcon: 'layers',     label: 'Services' },
  { key: 'Courses',  icon: 'school-outline',     activeIcon: 'school',     label: 'Courses'  },
  { key: 'Profile',  icon: 'person-outline',     activeIcon: 'person',     label: 'Profile'  },
];

interface Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const PRIMARY = '#004CD2';

export default function AnimatedTabBar({ activeTab, onTabChange }: Props) {
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const layouts = useRef<{ x: number; width: number }[]>(
    TABS.map(() => ({ x: 0, width: 0 })),
  );

  const handleLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      layouts.current[index] = { x, width };
      if (activeTab === TABS[index].key) {
        indicatorX.value = x;
        indicatorW.value = width;
      }
    },
    [activeTab, indicatorX, indicatorW],
  );

  const handleChange = useCallback(
    (tab: TabKey, index: number) => {
      const { x, width } = layouts.current[index];
      // Ultra smooth spring animation for indicator
      indicatorX.value = withSpring(x, { damping: 18, stiffness: 220, mass: 0.9 });
      indicatorW.value = withSpring(width, { damping: 18, stiffness: 220, mass: 0.9 });
      onTabChange(tab);
    },
    [onTabChange, indicatorX, indicatorW],
  );

  // Smooth sliding indicator
  const indicatorStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: indicatorX.value,
    width: indicatorW.value,
    height: 40,
    top: 5,
    borderRadius: 20,
    backgroundColor: PRIMARY,
  }));

  return (
    <View style={styles.footerContainer} pointerEvents="box-none">
      {/* Floating pill bar */}
      <View style={styles.pill}>
        {/* Smooth sliding indicator */}
        <Animated.View style={indicatorStyle} />

        {TABS.map((tab, i) => {
          const isActive = activeTab === tab.key;
          return (
            <AnimatedTabItem
              key={tab.key}
              tab={tab}
              isActive={isActive}
              onLayout={handleLayout(i)}
              onPress={() => handleChange(tab.key, i)}
            />
          );
        })}
      </View>

      {/* iOS-style home indicator */}
      <View style={styles.homeIndicator} />
    </View>
  );
}

/* ── Single tab item with subtle press feedback ──── */
function AnimatedTabItem({
  tab,
  isActive,
  onLayout,
  onPress,
}: {
  tab: Tab;
  isActive: boolean;
  onLayout: (e: LayoutChangeEvent) => void;
  onPress: () => void;
}) {
  const opacity = useSharedValue(1);
  const labelOpacity = useSharedValue(isActive ? 1 : 0);
  const labelWidth = useSharedValue(isActive ? 1 : 0);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const labelAnimStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ scaleX: labelWidth.value }],
    marginLeft: labelOpacity.value * 6,
  }));

  React.useEffect(() => {
    if (isActive) {
      labelOpacity.value = withTiming(1, { duration: 450, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
      labelWidth.value = withTiming(1, { duration: 450, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    } else {
      labelOpacity.value = withTiming(0, { duration: 350, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
      labelWidth.value = withTiming(0, { duration: 350, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    }
  }, [isActive, labelOpacity, labelWidth]);

  return (
    <Animated.View
      style={[styles.tabItem, animStyle]}
      onLayout={onLayout}
      onStartShouldSetResponder={() => true}
      onResponderGrant={() => {
        opacity.value = withTiming(0.6, { duration: 80 });
      }}
      onResponderRelease={() => {
        opacity.value = withTiming(1, { duration: 150 });
        onPress();
      }}
      onResponderTerminate={() => {
        opacity.value = withTiming(1, { duration: 150 });
      }}
    >
      <Ionicons
        name={isActive ? tab.activeIcon : tab.icon}
        size={20}
        color={isActive ? '#fff' : 'rgba(255,255,255,0.45)'}
      />
      <Animated.Text style={[styles.tabLabel, labelAnimStyle]}>
        {tab.label}
      </Animated.Text>
    </Animated.View>
  );
}

/* ── Styles ──────────────────────────────────────── */
const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 28,
    paddingVertical: 5,
    paddingHorizontal: 5,
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 18,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 21,
    gap: 0,
    minWidth: 40,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    opacity: 0.15,
    marginTop: 8,
  },
});

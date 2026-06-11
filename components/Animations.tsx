import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

/* ── FadeInUp ────────────────────────────────────── */
interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
  style?: any;
}

export function FadeInUp({
  children,
  delay = 0,
  duration = 250,
  translateY = 20,
  style,
}: FadeInUpProps) {
  const opacity = useSharedValue(0);
  const y = useSharedValue(translateY);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
    y.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 220 }),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

/* ── FadeIn ──────────────────────────────────────── */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
}

export function FadeIn({ children, delay = 0, duration = 200, style }: FadeInProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

/* ── ScaleIn ─────────────────────────────────────── */
interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}

export function ScaleIn({ children, delay = 0, style }: ScaleInProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 18, stiffness: 260 }),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

/* ── PressScale ──────────────────────────────────── */
export function usePressScale() {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 400 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 200 });
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { onPressIn, onPressOut, animStyle };
}

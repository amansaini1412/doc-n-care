import { Palette } from '@/constants/palette';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  type StyleProp,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

/**
 * Safe haptic trigger across physical devices and web
 */
export const triggerHaptic = (
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light
) => {
  try {
    Haptics.impactAsync(style).catch(() => {});
  } catch {
    // Ignore unsupported environments
  }
};

/**
 * 21st.dev Tactile Bouncy Pressable Card / Button
 * Smooth spring-physics pop-up on cursor hover (lift & scale) and spring compression on press.
 */
export function BouncyPressable({
  children,
  onPress,
  onLongPress,
  style,
  activeScale = 0.96,
  hoverScale = 1.03,
  hoverTranslateY = -6,
  hoverLift = true,
  haptic = true,
  disabled = false,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  activeScale?: number;
  hoverScale?: number;
  hoverTranslateY?: number;
  hoverLift?: boolean;
  haptic?: boolean;
  disabled?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled) return;
    if (haptic) triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: activeScale,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 80,
    }).start();
  };

  const handleHoverIn = () => {
    if (disabled || !hoverLift) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: hoverScale,
        useNativeDriver: true,
        friction: 6,
        tension: 110,
      }),
      Animated.spring(translateYAnim, {
        toValue: hoverTranslateY,
        useNativeDriver: true,
        friction: 6,
        tension: 110,
      }),
    ]).start();
  };

  const handleHoverOut = () => {
    if (disabled || !hoverLift) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 90,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 6,
        tension: 90,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onLongPress={disabled ? undefined : onLongPress}
      delayLongPress={340}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      disabled={disabled}
      style={({ hovered }: { hovered?: boolean }) => [
        {
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'default' : 'pointer',
        } as ViewStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

/**
 * 21st.dev Staggered Entrance Animation
 * Smooth spring/fade slide-up on screen mount.
 */
export function StaggeredEntrance({
  children,
  delay = 0,
  distance = 20,
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 480,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim, delay]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [distance, 0],
  });

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

/**
 * 21st.dev Traveling Shimmer Beam
 * Continuous sleek light sheen sweeping across cards.
 */
export function ShimmerBeam({
  color = 'rgba(255, 255, 255, 0.45)',
  duration = 2400,
}: {
  color?: string;
  duration?: number;
}) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(1400),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim, duration, reduceMotion]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 360],
  });

  return (
    <View style={styles.shimmerBeamContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.shimmerBar,
          {
            backgroundColor: color,
            transform: [{ translateX }, { skewX: '-25deg' }],
          },
        ]}
      />
    </View>
  );
}

/**
 * 21st.dev Continuous Floating Icon Micro-Motion
 * Subtle ambient float so the card feels active even before touching.
 */
export function FloatingIcon({
  children,
  offset = 3,
  duration = 2000,
}: {
  children: React.ReactNode;
  offset?: number;
  duration?: number;
}) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -offset,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: offset,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [floatAnim, offset, duration]);

  return (
    <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
      {children}
    </Animated.View>
  );
}

/**
 * 21st.dev Living Pulse Indicator
 * Continuous breathing concentric ring animation for active statuses.
 */
export function LivePulseDot({
  color = Palette.success,
  size = 10,
}: {
  color?: string;
  size?: number;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2.2,
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim, opacityAnim]);

  return (
    <View style={[styles.pulseContainer, { width: size * 2.5, height: size * 2.5 }]}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: opacityAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <View
        style={[
          styles.pulseCore,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

/**
 * 21st.dev Sweeping Holographic Laser Line
 * Smooth vertical oscillation for camera face scans and barcode viewfinder.
 */
export function SweepingLaser({
  height = 200,
  color = Palette.primary,
}: {
  height?: number;
  color?: string;
}) {
  const sweepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(sweepAnim, {
          toValue: height - 4,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sweepAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [sweepAnim, height]);

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      <Animated.View
        style={[
          styles.laserBeam,
          {
            backgroundColor: color,
            shadowColor: color,
            transform: [{ translateY: sweepAnim }],
          },
        ]}
      >
        <View style={[styles.laserFlare, { backgroundColor: Palette.white }]} />
      </Animated.View>
    </View>
  );
}

/**
 * 21st.dev Biometric Holographic Face Scan Reticle
 * Professional clinical viewfinder with animated laser beam, precision brackets, and facial points.
 */
export function BiometricFaceReticle() {
  const nodePulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(nodePulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(nodePulse, {
          toValue: 0.6,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [nodePulse]);

  return (
    <View style={styles.reticleOval}>
      {/* Precision corner ticks */}
      <View style={[styles.reticleTick, styles.tickTL]} />
      <View style={[styles.reticleTick, styles.tickTR]} />
      <View style={[styles.reticleTick, styles.tickBL]} />
      <View style={[styles.reticleTick, styles.tickBR]} />

      {/* Sweeping scan line */}
      <SweepingLaser height={320} color={Palette.gold} />

      {/* Pulsing facial biometric landmarks */}
      <Animated.View
        style={[
          styles.biometricPoint,
          { top: '22%', left: '50%', transform: [{ translateX: -6 }, { scale: nodePulse }] },
        ]}
      >
        <View style={styles.pointDot} />
        <Text style={styles.pointLabel}>FOREHEAD</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.biometricPoint,
          { top: '48%', left: '26%', transform: [{ translateX: -6 }, { scale: nodePulse }] },
        ]}
      >
        <View style={styles.pointDot} />
        <Text style={styles.pointLabel}>T-ZONE</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.biometricPoint,
          { top: '48%', right: '26%', transform: [{ translateX: 6 }, { scale: nodePulse }] },
        ]}
      >
        <View style={styles.pointDot} />
        <Text style={styles.pointLabel}>CHEEK</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.biometricPoint,
          { bottom: '16%', left: '50%', transform: [{ translateX: -6 }, { scale: nodePulse }] },
        ]}
      >
        <View style={styles.pointDot} />
        <Text style={styles.pointLabel}>BARRIER</Text>
      </Animated.View>
    </View>
  );
}

/**
 * 21st.dev Gesture-Driven Swipeable Routine Item
 * Swipe left/right gesture to complete with tactile haptic threshold, plus tap fallback!
 */
export function SwipeableRoutineItem({
  time,
  step,
  completed,
  onToggle,
}: {
  time: 'AM' | 'PM';
  step: string;
  completed: boolean;
  onToggle: () => void;
}) {
  const panX = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dy) < 16;
      },
      onPanResponderMove: (_, gestureState) => {
        // Clamp swipe movement with rubber-band damping
        const dx = gestureState.dx * 0.75;
        panX.setValue(dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 60) {
          triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
          onToggle();
        }
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 6,
          tension: 70,
        }).start();
      },
    })
  ).current;

  const handleTap = () => {
    triggerHaptic(
      completed ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    );
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.88, friction: 6, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1.15, friction: 4, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  return (
    <View style={styles.swipeOuterContainer}>
      {/* Revealed Action Background */}
      <View
        style={[
          styles.swipeUnderlay,
          {
            backgroundColor: completed
              ? 'rgba(245, 158, 11, 0.12)'
              : 'rgba(16, 185, 129, 0.14)',
          },
        ]}
      >
        <View style={styles.underlayRow}>
          <View style={styles.underlayActionLeft}>
            <Ionicons
              name={completed ? 'refresh' : 'checkmark-circle'}
              size={22}
              color={completed ? Palette.warning : Palette.success}
            />
            <Text
              style={[
                styles.underlayText,
                { color: completed ? Palette.warning : Palette.success },
              ]}
            >
              {completed ? 'Undo' : 'Complete'}
            </Text>
          </View>
          <View style={styles.underlayActionRight}>
            <Text
              style={[
                styles.underlayText,
                { color: completed ? Palette.warning : Palette.success },
              ]}
            >
              Swipe
            </Text>
            <Ionicons
              name={completed ? 'refresh' : 'checkmark-circle'}
              size={22}
              color={completed ? Palette.warning : Palette.success}
            />
          </View>
        </View>
      </View>

      {/* Draggable Top Layer */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.routineRow,
          completed && styles.routineRowCompleted,
          { transform: [{ translateX: panX }] },
        ]}
      >
        <Pressable onPress={handleTap} style={styles.checkboxTouchTarget}>
          <Animated.View
            style={[
              styles.checkbox,
              completed && {
                backgroundColor: Palette.primary,
                borderColor: Palette.primary,
              },
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {completed ? (
              <Ionicons name="checkmark" size={14} color={Palette.white} />
            ) : null}
          </Animated.View>
        </Pressable>

        <Pressable onPress={handleTap} style={{ flex: 1 }}>
          <View style={styles.timeKickerRow}>
            <Text style={styles.routineTimeBadge}>{time} PROTOCOL</Text>
            {completed ? (
              <Text style={styles.completedBadgeText}>COMPLETED</Text>
            ) : null}
          </View>
          <Text
            style={[
              styles.routineStepText,
              completed && { textDecorationLine: 'line-through', color: Palette.muted },
            ]}
          >
            {step}
          </Text>
        </Pressable>

        <Pressable onPress={handleTap}>
          <Ionicons
            name={completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={completed ? Palette.primary : Palette.beige}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

/**
 * 21st.dev Animated Sliding Segmented Pill Track
 * Fluid sliding pill indicator that transitions smoothly with spring physics between options!
 */
export function AnimatedSegmentedPill<T extends string>({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: T; label: string; icon?: keyof typeof Ionicons.glyphMap }[];
  activeTab: T;
  onChange: (id: T) => void;
}) {
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const slideAnim = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeIndex >= 0 ? activeIndex : 0,
      useNativeDriver: false,
      friction: 7,
      tension: 90,
    }).start();
  }, [activeIndex, slideAnim]);

  const pillWidthPercent = 100 / tabs.length;

  const leftPosition = slideAnim.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => `${i * pillWidthPercent}%`),
  });

  return (
    <View style={styles.segmentedContainer}>
      {/* Sliding Active Pill Background */}
      <Animated.View
        style={[
          styles.slidingPill,
          {
            width: `${pillWidthPercent}%`,
            left: leftPosition,
          },
        ]}
      />

      {/* Tabs */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.segmentedTab}
            onPress={() => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
              onChange(tab.id);
            }}
            activeOpacity={0.8}
          >
            {tab.icon ? (
              <Ionicons
                name={tab.icon}
                size={14}
                color={isActive ? Palette.white : Palette.primary}
                style={{ marginRight: 5 }}
              />
            ) : null}
            <Text
              style={[
                styles.segmentedTabText,
                isActive && styles.segmentedTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/**
 * 21st.dev Celebration Banner
 * Shown when the user finishes all steps in a routine tab.
 */
export function CelebrationBanner({
  time,
  onReset,
}: {
  time: 'AM' | 'PM';
  onReset?: () => void;
}) {
  const popAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
    Animated.spring(popAnim, {
      toValue: 1,
      friction: 5,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [popAnim]);

  return (
    <Animated.View style={[styles.celebrationCard, { transform: [{ scale: popAnim }] }]}>
      <View style={styles.celebrationIconCircle}>
        <Ionicons
          name={time === 'AM' ? 'sunny' : 'moon'}
          size={24}
          color={Palette.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.celebrationTitle}>
          {time} Skincare Protocol Complete!
        </Text>
        <Text style={styles.celebrationSub}>
          {time === 'AM'
            ? 'Barrier hydrated and photoprotected against diurnal UV exposome.'
            : 'Cutaneous lipids replenished for nocturnal cellular renewal.'}
        </Text>
      </View>
      {onReset ? (
        <TouchableOpacity onPress={onReset} style={styles.celebrationResetBtn}>
          <Ionicons name="refresh" size={16} color={Palette.primary} />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}

/**
 * 21st.dev Animated Number Counter
 * Smoothly counts from 0 up to target score (e.g. 88%).
 */
export function AnimatedCounter({
  target,
  suffix = '%',
  style,
}: {
  target: number;
  suffix?: string;
  style?: StyleProp<TextStyle>;
}) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    let current = Math.max(0, target - 20);
    setDisplay(current);
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        setDisplay(target);
        clearInterval(interval);
      } else {
        setDisplay(current);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [target]);

  return <Text style={style}>{display}{suffix}</Text>;
}

export const BouncyRoutineItem = SwipeableRoutineItem;

/**
 * 21st.dev Slide Changing Animation
 * Animates content smoothly in from left or right when changing slides or tabs.
 */
export function SlideTransition({
  children,
  slideKey,
  distance = 32,
}: {
  children: React.ReactNode;
  slideKey: string | number;
  distance?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
  }, [slideKey, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [distance, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
}

/**
 * 21st.dev Luxury Animated Carousel Dots
 * Active slide indicator expands from a 6px dot into a 22px pill with spring physics.
 */
export function CarouselDots({
  total,
  active,
  onSelect,
}: {
  total: number;
  active: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <View style={styles.carouselDotsRow}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => onSelect?.(i)}
            hitSlop={8}
            activeOpacity={0.8}
            style={[
              styles.carouselDot,
              isActive && styles.carouselDotActive,
            ]}
          />
        );
      })}
    </View>
  );
}

/**
 * 21st.dev Drag-Down-To-Dismiss Gesture Bottom Sheet
 */
export function GestureBottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120) {
          triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
          Animated.timing(translateY, {
            toValue: 600,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetBackdrop}>
        <Pressable style={styles.sheetBackdropPress} onPress={onClose} />
        <Animated.View
          style={[styles.sheetContent, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Drag Handle Bar */}
          <View style={styles.sheetHandleContainer}>
            <View style={styles.sheetHandle} />
          </View>

          <View style={styles.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle}>{title}</Text>
              {subtitle ? <Text style={styles.sheetSub}>{subtitle}</Text> : null}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.sheetCloseBtn}>
              <Ionicons name="close" size={20} color={Palette.ink} />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetBody}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/**
 * 21st.dev Rotating Chevron for Collapsible Cards
 */
export function RotatingChevron({
  expanded,
  color = Palette.primary,
}: {
  expanded: boolean;
  color?: string;
}) {
  const rotateAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: expanded ? 1 : 0,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [expanded, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <Ionicons name="chevron-down-circle" size={22} color={color} />
    </Animated.View>
  );
}

/**
 * 21st.dev Animated Breathing Aura / Halo
 * Surrounds important cards or scores with a gentle pulsing ambient light.
 */
export function BreathingAura({
  children,
  color = 'rgba(89, 69, 54, 0.15)',
  radius = 20,
}: {
  children: React.ReactNode;
  color?: string;
  radius?: number;
}) {
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.9,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <View style={styles.auraWrapper}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: color,
            borderRadius: radius,
            opacity: opacityAnim,
            transform: [{ scale: 1.03 }],
          },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
  },
  pulseCore: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  laserBeam: {
    height: 3,
    width: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laserFlare: {
    width: 24,
    height: 3,
    borderRadius: 2,
    opacity: 0.9,
  },
  reticleOval: {
    width: 250,
    height: 330,
    borderRadius: 125,
    borderWidth: 2,
    borderColor: 'rgba(182, 154, 112, 0.85)',
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleTick: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Palette.gold,
  },
  tickTL: {
    top: 20,
    left: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  tickTR: {
    top: 20,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  tickBL: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  tickBR: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  biometricPoint: {
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  pointDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.gold,
    borderWidth: 1.5,
    borderColor: Palette.ivory,
  },
  pointLabel: {
    color: Palette.ivory,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  swipeOuterContainer: {
    position: 'relative',
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  swipeUnderlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  underlayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  underlayActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  underlayActionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  underlayText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  routineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.beige,
    gap: 12,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  routineRowCompleted: {
    backgroundColor: 'rgba(89, 69, 54, 0.04)',
    borderColor: 'rgba(89, 69, 54, 0.12)',
  },
  checkboxTouchTarget: {
    padding: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.8,
    borderColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routineTimeBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 0.5,
  },
  completedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.success,
    letterSpacing: 0.4,
  },
  routineStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.ink,
    marginTop: 2,
    lineHeight: 18,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Palette.cream,
    borderRadius: 14,
    padding: 3,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.1)',
  },
  slidingPill: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    backgroundColor: Palette.primary,
    borderRadius: 11,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  segmentedTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  segmentedTabTextActive: {
    color: Palette.white,
  },
  celebrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 10,
  },
  celebrationIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  celebrationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  celebrationSub: {
    fontSize: 11,
    color: '#065F46',
    marginTop: 2,
    lineHeight: 15,
  },
  celebrationResetBtn: {
    padding: 6,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetBackdropPress: {
    flex: 1,
  },
  sheetContent: {
    backgroundColor: Palette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  sheetHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.beige,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.ink,
  },
  sheetSub: {
    fontSize: 12,
    color: Palette.muted,
    marginTop: 2,
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: {
    paddingTop: 6,
  },
  auraWrapper: {
    position: 'relative',
  },
  shimmerBeamContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 18,
    pointerEvents: 'none',
  },
  shimmerBar: {
    width: 60,
    height: '250%',
    position: 'absolute',
    top: '-50%',
    opacity: 0.6,
  },
  carouselDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.beige,
  },
  carouselDotActive: {
    width: 22,
    backgroundColor: Palette.gold,
    borderRadius: 3,
  },
});

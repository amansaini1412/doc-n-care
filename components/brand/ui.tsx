import {
  AnimatedCounter,
  AnimatedSegmentedPill,
  BiometricFaceReticle,
  BouncyPressable,
  BouncyRoutineItem,
  BreathingAura,
  CelebrationBanner,
  CarouselDots,
  FloatingIcon,
  GestureBottomSheet,
  LivePulseDot,
  RotatingChevron,
  ShimmerBeam,
  SlideTransition,
  StaggeredEntrance,
  SweepingLaser,
  SwipeableRoutineItem,
  triggerHaptic,
} from '@/components/brand/animatedUi';
import { Palette } from '@/constants/palette';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

export {
  AnimatedCounter,
  AnimatedSegmentedPill,
  BiometricFaceReticle,
  BouncyPressable,
  BouncyRoutineItem,
  BreathingAura,
  CelebrationBanner,
  CarouselDots,
  FloatingIcon,
  GestureBottomSheet,
  LivePulseDot,
  RotatingChevron,
  ShimmerBeam,
  SlideTransition,
  StaggeredEntrance,
  SweepingLaser,
  SwipeableRoutineItem,
  triggerHaptic,
};

export function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.75}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={active ? Palette.white : Palette.primary}
          style={{ marginRight: 4 }}
        />
      ) : null}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  return (
    <BouncyPressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.primary, disabled && styles.btnDisabled, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Palette.white} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon ? <Ionicons name={icon} size={18} color={Palette.white} /> : null}
          <Text style={styles.primaryText}>{label}</Text>
        </View>
      )}
    </BouncyPressable>
  );
}

export function GhostButton({
  label,
  onPress,
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.ghost, style]} activeOpacity={0.85}>
      {icon ? <Ionicons name={icon} size={18} color={Palette.primary} /> : null}
      <Text style={styles.ghostText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function OutlineButton({
  label,
  onPress,
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.outline, style]} activeOpacity={0.85}>
      {icon ? <Ionicons name={icon} size={16} color={Palette.primary} /> : null}
      <Text style={styles.outlineText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SoftCard({
  children,
  style,
  elevation = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: boolean;
}) {
  return <View style={[styles.card, elevation && styles.cardElevation, style]}>{children}</View>;
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={styles.sectionRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function Badge({
  label,
  variant = 'default',
  icon,
}: {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.12)', border: Palette.success, text: '#065F46' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.14)', border: Palette.warning, text: '#92400E' };
      case 'danger':
        return { bg: Palette.dangerSoft, border: Palette.dangerBorder, text: Palette.dangerText };
      case 'primary':
        return { bg: Palette.cream, border: Palette.primary, text: Palette.primary };
      default:
        return { bg: Palette.cream, border: Palette.beige, text: Palette.ink };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      {icon ? <Ionicons name={icon} size={12} color={colors.text} style={{ marginRight: 4 }} /> : null}
      <Text style={[styles.badgeText, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

export function ClinicalDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.disclaimerBox, compact && { padding: 10, marginVertical: 8 }]}>
      <Ionicons name="shield-checkmark-outline" size={compact ? 16 : 20} color={Palette.primary} />
      <Text style={styles.disclaimerText}>
        {compact
          ? 'Cosmetic & educational guide. Not a medical diagnosis.'
          : 'DOC-N-CARE provides cosmetic and educational skin health guidance grounded in dermatological consensus. Not a clinical diagnosis for medical conditions.'}
      </Text>
    </View>
  );
}

export function ConfidenceGauge({
  score,
  label = 'Match Confidence',
  size = 56,
}: {
  score: number;
  label?: string;
  size?: number;
}) {
  const color =
    score >= 80 ? Palette.success : score >= 60 ? Palette.warning : Palette.danger;

  return (
    <View style={styles.gaugeContainer}>
      <BreathingAura color={color === Palette.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(89, 69, 54, 0.15)'} radius={size / 2}>
        <View
          style={[
            styles.gaugeRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color,
            },
          ]}
        >
          <Text style={[styles.gaugeScore, { fontSize: size * 0.32 }]}>{score}%</Text>
        </View>
      </BreathingAura>
      {label ? <Text style={styles.gaugeLabel}>{label}</Text> : null}
    </View>
  );
}

export function InteractiveRoutineItem({
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
  return (
    <BouncyRoutineItem
      time={time}
      step={step}
      completed={completed}
      onToggle={onToggle}
    />
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Palette.cream,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.12)',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  chipText: {
    color: Palette.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: Palette.white,
    fontWeight: '700',
  },
  primary: {
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: Palette.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 12px rgba(89, 69, 54, 0.18)',
      },
    }),
  },
  primaryText: {
    color: Palette.white,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  ghost: {
    backgroundColor: Palette.beige,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.overlayStrong,
  },
  ghostText: {
    color: Palette.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  outlineText: {
    color: Palette.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  card: {
    backgroundColor: Palette.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.overlay,
  },
  cardElevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      },
    }),
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
    fontSize: 22,
    fontWeight: '600',
    color: Palette.ink,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Palette.muted,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.overlay,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.overlayStrong,
    padding: 12,
    marginVertical: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: Palette.primary,
    fontWeight: '500',
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeRing: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
  },
  gaugeScore: {
    fontWeight: '800',
    color: Palette.ink,
  },
  gaugeLabel: {
    fontSize: 11,
    color: Palette.muted,
    fontWeight: '600',
    marginTop: 4,
  },
  routineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.beige,
    marginBottom: 8,
    gap: 12,
  },
  routineRowCompleted: {
    backgroundColor: 'rgba(89, 69, 54, 0.04)',
    borderColor: 'rgba(89, 69, 54, 0.12)',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineTimeBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 0.5,
  },
  routineStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.ink,
    marginTop: 2,
    lineHeight: 18,
  },
});

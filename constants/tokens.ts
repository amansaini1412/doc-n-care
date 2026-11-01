import { Palette } from '@/constants/palette';
import { Platform } from 'react-native';

export const Type = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const Space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
} as const;

export const Motion = {
  fast: 180,
  base: 320,
  slow: 480,
  spring: { friction: 8, tension: 90 },
} as const;

export const Shadow = Platform.select({
  ios: {
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  android: { elevation: 2 },
  default: {
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
});

export const SKINCARE_TIPS = [
  {
    title: 'SPF is the first active',
    copy: 'Daily broad-spectrum sunscreen is the most evidence-backed step for pigment, collagen, and barrier protection.',
  },
  {
    title: 'Moisturise on damp skin',
    copy: 'Humectants such as glycerin and hyaluronic acid hold water better when applied to a slightly damp face.',
  },
  {
    title: 'Introduce one active at a time',
    copy: 'If a new serum stings, pause acids and retinoids and rebuild with ceramides and panthenol for a few days.',
  },
  {
    title: 'Fragrance is optional',
    copy: 'Essential oils and heavy perfume are common triggers for redness. Fragrance-free is safer for reactive skin.',
  },
];

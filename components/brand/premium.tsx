import {
  BouncyPressable,
  GestureBottomSheet,
  ShimmerBeam,
  triggerHaptic,
} from '@/components/brand/animatedUi';
import { Palette } from '@/constants/palette';
import { Radius, Shadow, Type } from '@/constants/tokens';
import { useShop } from '@/context/ShopContext';
import type { CatalogProduct } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from 'react-native';

export function DisplayTitle({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <Text style={[styles.display, style]}>{children}</Text>;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search products, brands, or actives',
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.search}>
      <Ionicons name="search-outline" size={18} color={Palette.muted} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={Palette.muted}
        value={value}
        onChangeText={onChange}
        clearButtonMode="while-editing"
      />
      {value ? (
        <Pressable onPress={() => onChange('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={Palette.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function SkeletonLoader({ height = 84, style }: { height?: number; style?: ViewStyle }) {
  return (
    <View style={[styles.skeleton, { height }, style]}>
      <ShimmerBeam color="rgba(255,255,255,0.55)" duration={1600} />
    </View>
  );
}

export function CustomToast() {
  const { toast, dismissToast } = useShop();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) return;
    Animated.timing(anim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    const t = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => dismissToast());
    }, 2200);
    return () => clearTimeout(t);
  }, [anim, dismissToast, toast]);

  if (!toast) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }),
            },
          ],
        },
      ]}
    >
      <Ionicons name="checkmark-circle" size={16} color={Palette.ivory} />
      <Text style={styles.toastText}>{toast.text}</Text>
    </Animated.View>
  );
}

export function HeartButton({
  productId,
  size = 20,
}: {
  productId: string;
  size?: number;
}) {
  const { isWishlisted, toggleWishlist } = useShop();
  const saved = isWishlisted(productId);
  const scale = useRef(new Animated.Value(1)).current;

  const onPress = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.28, friction: 4, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
    toggleWishlist(productId);
  };

  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={saved ? 'heart' : 'heart-outline'}
          size={size}
          color={saved ? Palette.danger : Palette.primary}
        />
      </Animated.View>
    </Pressable>
  );
}

export function ProductCard({
  product,
  onPress,
  onLongPress,
  compact,
  why,
}: {
  product: CatalogProduct;
  onPress: () => void;
  onLongPress?: () => void;
  compact?: boolean;
  why?: string;
}) {
  const lastTap = useRef(0);
  const { toggleWishlist } = useShop();

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      toggleWishlist(product.id);
      lastTap.current = 0;
      return;
    }
    lastTap.current = now;
    onPress();
  };

  return (
    <BouncyPressable
      style={[styles.productCard, compact && styles.productCardCompact]}
      onPress={handlePress}
    >
      <Pressable
        onLongPress={() => {
          triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
          onLongPress?.();
        }}
        delayLongPress={320}
        onPress={handlePress}
      >
        <Image source={{ uri: product.image }} style={[styles.productImage, compact && { height: 88 }]} />
        <View style={styles.heartAbs}>
          <HeartButton productId={product.id} size={18} />
        </View>
        <View style={styles.catRow}>
          <Text style={styles.productCat}>{product.category.toUpperCase()}</Text>
          {product.rating ? (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color={Palette.gold} />
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productBrand}>{product.brand}</Text>
        {why ? (
          <Text style={styles.productWhy} numberOfLines={2}>
            {why}
          </Text>
        ) : null}
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>{product.price}</Text>
          {product.originalPrice ? (
            <Text style={styles.origPrice}>{product.originalPrice}</Text>
          ) : null}
          {product.discount ? (
            <Text style={styles.discountBadge}>{product.discount}</Text>
          ) : null}
        </View>
      </Pressable>
    </BouncyPressable>
  );
}

export function EmptyState({
  icon,
  title,
  copy,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  copy: string;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={Palette.gold} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyCopy}>{copy}</Text>
    </View>
  );
}

export function AnimatedProgressBar({ progress }: { progress: number }) {
  const width = useRef(new Animated.Value(progress)).current;
  useEffect(() => {
    Animated.timing(width, {
      toValue: progress,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, width]);

  const pct = width.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { width: pct }]} />
    </View>
  );
}

export function CartSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { cartProducts, cartTotal, removeFromCart } = useShop();

  return (
    <GestureBottomSheet
      visible={visible}
      onClose={onClose}
      title="Routine bag"
      subtitle={cartProducts.length ? `${cartProducts.length} formulas selected` : 'Your bag is empty'}
    >
      {!cartProducts.length ? (
        <EmptyState
          icon="bag-outline"
          title="Nothing in your bag yet"
          copy="Add a compatible formula from Explore or your recommended kit."
        />
      ) : (
        <View style={{ gap: 10 }}>
          {cartProducts.map(({ product, qty }) => (
            <View key={product.id} style={styles.cartRow}>
              <Image source={{ uri: product.image }} style={styles.cartImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.productBrand}>
                  {product.brand} · Qty {qty}
                </Text>
              </View>
              <Text style={styles.productPrice}>{product.price}</Text>
              <Pressable onPress={() => removeFromCart(product.id)} hitSlop={8}>
                <Ionicons name="close" size={16} color={Palette.muted} />
              </Pressable>
            </View>
          ))}
          <View style={styles.cartTotal}>
            <Text style={styles.cartTotalLabel}>Estimated total</Text>
            <Text style={styles.productPrice}>₹{cartTotal}</Text>
          </View>
        </View>
      )}
    </GestureBottomSheet>
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: Type.display,
    color: Palette.ink,
    fontSize: 28,
    letterSpacing: -0.4,
  },
  search: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Palette.overlay,
  },
  searchInput: {
    flex: 1,
    color: Palette.ink,
    fontSize: 14,
  },
  skeleton: {
    backgroundColor: Palette.beige,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: 10,
  },
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 108,
    backgroundColor: Palette.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 40,
    ...Shadow,
  },
  toastText: {
    color: Palette.ivory,
    fontWeight: '600',
    fontSize: 13,
    flex: 1,
  },
  productCard: {
    width: 168,
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Palette.overlay,
    ...Shadow,
  },
  productCardCompact: {
    width: 140,
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: 118,
    borderRadius: Radius.md,
    marginBottom: 10,
    backgroundColor: Palette.cream,
  },
  heartAbs: {
    position: 'absolute',
    top: 18,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(249,246,240,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Palette.cream,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.ink,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  origPrice: {
    fontSize: 12,
    color: Palette.muted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.success,
  },
  productCat: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.gold,
    letterSpacing: 0.8,
  },
  productName: {
    fontWeight: '700',
    color: Palette.ink,
    fontSize: 13,
    lineHeight: 18,
  },
  productBrand: {
    color: Palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  productWhy: {
    color: Palette.primary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 6,
  },
  productPrice: {
    color: Palette.primary,
    fontWeight: '700',
    fontSize: 14,
    marginTop: 8,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: Type.display,
    fontSize: 18,
    color: Palette.ink,
    marginBottom: 6,
  },
  emptyCopy: {
    textAlign: 'center',
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Palette.beige,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Palette.gold,
    borderRadius: 2,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.ivory,
    borderRadius: Radius.md,
    padding: 10,
  },
  cartImg: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: Palette.beige,
  },
  cartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  cartTotalLabel: {
    color: Palette.muted,
    fontWeight: '600',
  },
});

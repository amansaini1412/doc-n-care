import {
  Badge,
  BouncyPressable,
  Chip,
  GhostButton,
  PrimaryButton,
  SectionTitle,
  SoftCard,
} from '@/components/brand/ui';
import { CartSheet, HeartButton, SearchBar } from '@/components/brand/premium';
import { Palette } from '@/constants/palette';
import { useShop } from '@/context/ShopContext';
import { useSkin } from '@/context/SkinContext';
import { CATALOG, TRENDING, catalogBrands, parsePrice } from '@/lib/catalog';
import { checkCompatibility } from '@/lib/engine';
import { ROUTES } from '@/lib/routes';
import type { CatalogProduct, CompatibilityResult, Concern, ProductCategory, SkinType } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const FILTERS: { id: 'all' | ProductCategory; name: string }[] = [
  { id: 'all', name: 'All' },
  { id: 'serum', name: 'Serums' },
  { id: 'moisturizer', name: 'Moisturizers' },
  { id: 'cleanser', name: 'Cleansers' },
  { id: 'sunscreen', name: 'Sunscreens' },
  { id: 'toner', name: 'Toners' },
  { id: 'mask', name: 'Masks' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { profile } = useSkin();
  const { addToCart, cartCount, viewProduct } = useShop();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof FILTERS)[number]['id']>('all');
  const [brand, setBrand] = useState<string | 'all'>('all');
  const [skinType, setSkinType] = useState<SkinType | 'all'>('all');
  const [concern, setConcern] = useState<Concern | 'all'>('all');
  const [ingredient, setIngredient] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<'match' | 'price-asc' | 'price-desc'>('match');
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const brands = useMemo(() => catalogBrands(), []);
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return CATALOG.filter((item) => item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const next = CATALOG.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const haystack = `${item.name} ${item.brand} ${item.description} ${item.ingredients.join(' ')} ${item.benefits.join(' ')}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesBrand = brand === 'all' || item.brand === brand;
      const matchesSkin = skinType === 'all' || item.skinTypes.includes(skinType);
      const matchesConcern =
        concern === 'all' ||
        item.benefits.join(' ').toLowerCase().includes(concern.toLowerCase()) ||
        item.description.toLowerCase().includes(concern.toLowerCase());
      const matchesIng =
        !ingredient.trim() ||
        item.ingredients.join(' ').toLowerCase().includes(ingredient.trim().toLowerCase());
      const matchesPrice = maxPrice == null || parsePrice(item.price) <= maxPrice;
      return (
        matchesCategory &&
        matchesQuery &&
        matchesBrand &&
        matchesSkin &&
        matchesConcern &&
        matchesIng &&
        matchesPrice
      );
    });
    return [...next].sort((a, b) => {
      if (sort === 'price-asc') return parsePrice(a.price) - parsePrice(b.price);
      if (sort === 'price-desc') return parsePrice(b.price) - parsePrice(a.price);
      const aFit = a.skinTypes.includes(profile.skinType) ? 1 : 0;
      const bFit = b.skinTypes.includes(profile.skinType) ? 1 : 0;
      return bFit - aFit;
    });
  }, [brand, category, concern, ingredient, maxPrice, profile.skinType, query, skinType, sort]);

  const selectedProductCompatibility: CompatibilityResult | null = useMemo(() => {
    if (!selectedProduct) return null;
    return checkCompatibility(selectedProduct, profile);
  }, [selectedProduct, profile]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Palette.primary}
          colors={[Palette.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandKicker}>CLINICAL DIRECTORY</Text>
          <Text style={styles.title}>Explore Formulas</Text>
          <Text style={styles.sub}>Dermatologist-evaluated actives & products</Text>
        </View>
        <TouchableOpacity
          style={styles.bell}
          onPress={() => setCartOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="bag-outline" size={22} color={Palette.primary} />
          {cartCount ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <SearchBar value={query} onChange={setQuery} placeholder="Search products, brands, or actives" />
      {suggestions.length ? (
        <View style={styles.suggestBox}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.suggestRow}
              onPress={() => {
                setQuery(item.name);
                setSelectedProduct(item);
                viewProduct(item.id);
              }}
            >
              <Text style={styles.suggestText}>{item.name}</Text>
              <Text style={styles.suggestBrand}>{item.brand}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((item) => (
          <Chip
            key={item.id}
            label={item.name}
            active={category === item.id}
            onPress={() => setCategory(item.id)}
          />
        ))}
      </ScrollView>
      <View style={styles.filterBar}>
        <Chip label="Filters" icon="options-outline" active={showFilters} onPress={() => setShowFilters((v) => !v)} />
        <Chip
          label={sort === 'match' ? 'Best match' : sort === 'price-asc' ? 'Price ↑' : 'Price ↓'}
          onPress={() =>
            setSort((s) => (s === 'match' ? 'price-asc' : s === 'price-asc' ? 'price-desc' : 'match'))
          }
        />
      </View>
      {showFilters ? (
        <View style={styles.filterPanel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip label="All brands" active={brand === 'all'} onPress={() => setBrand('all')} />
            {brands.map((b) => (
              <Chip key={b} label={b} active={brand === b} onPress={() => setBrand(b)} />
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(['all', 'Oily', 'Dry', 'Combination', 'Normal', 'Sensitive', 'Acne-Prone'] as const).map((t) => (
              <Chip key={t} label={t === 'all' ? 'All skin types' : t} active={skinType === t} onPress={() => setSkinType(t)} />
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(['all', 'Acne', 'Dryness', 'Dark spots', 'Redness', 'Fine lines'] as const).map((c) => (
              <Chip key={c} label={c === 'all' ? 'All concerns' : c} active={concern === c} onPress={() => setConcern(c)} />
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Niacinamide', 'Salicylic', 'Ceramide', 'Hyaluronic', 'Vitamin C'].map((ing) => (
              <Chip
                key={ing}
                label={ing}
                active={ingredient.toLowerCase().includes(ing.toLowerCase())}
                onPress={() => setIngredient((curr) => (curr === ing ? '' : ing))}
              />
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { label: 'Any price', value: null },
              { label: 'Under ₹400', value: 400 },
              { label: 'Under ₹700', value: 700 },
              { label: 'Under ₹1200', value: 1200 },
            ].map((p) => (
              <Chip
                key={p.label}
                label={p.label}
                active={maxPrice === p.value}
                onPress={() => setMaxPrice(p.value)}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Products Catalog Grid / List */}
      <View style={styles.section}>
        <SectionTitle
          title={
            profile.lastScanAt
              ? `Formulas for ${profile.skinType} Skin`
              : 'Verified Product Library'
          }
          subtitle={`Showing ${products.length} dermatologist-cataloged formulations`}
        />

        {products.map((product) => {
          const suited = product.skinTypes.includes(profile.skinType);
          return (
            <BouncyPressable
              key={product.id}
              hoverLift
              hoverScale={1.03}
              hoverTranslateY={-5}
              style={styles.card}
              onPress={() => {
                viewProduct(product.id);
                setSelectedProduct(product);
              }}
              onLongPress={() => {
                viewProduct(product.id);
                setSelectedProduct(product);
              }}
            >
              <Image source={{ uri: product.image }} style={styles.img} />
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name} numberOfLines={1}>
                    {product.name}
                  </Text>
                  {suited && profile.lastScanAt ? (
                    <Badge label="Fits Profile" variant="success" />
                  ) : null}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Text style={styles.brand}>{product.brand}</Text>
                  {product.rating ? (
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={10} color={Palette.gold} />
                      <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                      {product.reviewCount ? (
                        <Text style={styles.reviewText}>({product.reviewCount})</Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>{product.price}</Text>
                  {product.originalPrice ? (
                    <Text style={styles.originalPrice}>{product.originalPrice}</Text>
                  ) : null}
                  {product.discount ? (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{product.discount}</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.snippet} numberOfLines={2}>
                  {product.benefits[0] || product.description}
                </Text>

                <View style={styles.activesRow}>
                  {product.ingredients.slice(0, 3).map((ing) => (
                    <Text key={ing} style={styles.activeTag}>
                      {ing}
                    </Text>
                  ))}
                  {product.ingredients.length > 3 ? (
                    <Text style={styles.activeTagMore}>
                      +{product.ingredients.length - 3} more
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={{ alignItems: 'center', gap: 12 }}>
                <HeartButton productId={product.id} />
                <Ionicons name="chevron-forward" size={18} color={Palette.primary} />
              </View>
            </BouncyPressable>
          );
        })}

        {!products.length ? (
          <SoftCard style={{ alignItems: 'center', padding: 24 }}>
            <Ionicons name="search" size={36} color={Palette.muted} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>No matching formulas found</Text>
            <Text style={styles.emptyCopy}>
              Try searching for a different active ingredient (like Niacinamide, BHA, or Ceramides) or reset category filters.
            </Text>
            <View style={{ marginTop: 12 }}>
              <GhostButton
                label="Clear filters"
                onPress={() => {
                  setQuery('');
                  setCategory('all');
                  setBrand('all');
                  setSkinType('all');
                  setConcern('all');
                  setIngredient('');
                  setMaxPrice(null);
                }}
              />
            </View>
          </SoftCard>
        ) : null}
      </View>

      {/* Worth Reading / Dermatological Guides */}
      <View style={styles.section}>
        <SectionTitle
          title="Clinical Skincare Guides"
          subtitle="Grounded in AAD, DermNet & PubMed research"
        />
        {TRENDING.map((topic) => (
          <BouncyPressable
            key={topic.id}
            style={styles.topic}
            onPress={() => router.push(ROUTES.dermatologist)}
          >
            <View style={styles.topicIcon}>
              <Ionicons name="journal-outline" size={20} color={Palette.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicDesc}>{topic.description}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={Palette.primary} />
          </BouncyPressable>
        ))}
      </View>

      {/* Barcode Verification Promo */}
      <View style={{ marginHorizontal: 20, borderRadius: 20, overflow: 'hidden' }}>
        <LinearGradient
          colors={[Palette.primary, Palette.primaryDeep]}
          style={{ padding: 20 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Ionicons name="shield-checkmark" size={18} color={Palette.cream} />
            <Text style={{ color: Palette.cream, fontWeight: '800', fontSize: 11, letterSpacing: 1 }}>
              SAFETY VERIFICATION
            </Text>
          </View>
          <Text style={{ color: Palette.white, fontWeight: '800', fontSize: 18, marginBottom: 6 }}>
            Holding a physical bottle?
          </Text>
          <Text style={{ color: Palette.white, opacity: 0.9, marginBottom: 14, lineHeight: 19 }}>
            Scan the barcode with your camera. We instantly calculate barrier safety and comedogenic risk against your skin map.
          </Text>
          <TouchableOpacity
            style={styles.whiteBtn}
            onPress={() => router.push('/(tabs)/scan')}
            activeOpacity={0.85}
          >
            <Ionicons name="barcode-outline" size={16} color={Palette.primary} />
            <Text style={{ color: Palette.primary, fontWeight: '700' }}>Open Barcode Scanner</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Product Detail Modal */}
      <Modal
        visible={Boolean(selectedProduct)}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedProduct(null)}
      >
        {selectedProduct ? (
          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          >
            <View style={styles.modalBar}>
              <Text style={styles.brandKicker}>{selectedProduct.category.toUpperCase()}</Text>
              <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                <Ionicons name="close-circle" size={26} color={Palette.ink} />
              </TouchableOpacity>
            </View>

            <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />

            <Text style={styles.modalName}>{selectedProduct.name}</Text>
            <Text style={styles.modalBrand}>
              {selectedProduct.brand} · <Text style={styles.price}>{selectedProduct.price}</Text>
            </Text>
            <Text style={styles.modalBarcode}>Verified Barcode: {selectedProduct.barcode}</Text>

            {/* Compatibility Quick Banner */}
            {selectedProductCompatibility ? (
              <View
                style={[
                  styles.modalCompatBanner,
                  {
                    borderColor:
                      selectedProductCompatibility.verdict === 'compatible'
                        ? Palette.success
                        : selectedProductCompatibility.verdict === 'caution'
                          ? Palette.warning
                          : Palette.danger,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalCompatTitle}>
                    {selectedProductCompatibility.score}/100 Compatibility Score
                  </Text>
                  <Text style={styles.modalCompatSub}>
                    {selectedProductCompatibility.headline}
                  </Text>
                </View>
                <Badge
                  label={selectedProductCompatibility.verdict.toUpperCase()}
                  variant={
                    selectedProductCompatibility.verdict === 'compatible'
                      ? 'success'
                      : selectedProductCompatibility.verdict === 'caution'
                        ? 'warning'
                        : 'danger'
                  }
                />
              </View>
            ) : null}

            {/* Description */}
            <Text style={styles.modalSectionTitle}>Description</Text>
            <Text style={styles.modalBodyText}>{selectedProduct.description}</Text>

            {/* Clinical Benefits */}
            <Text style={styles.modalSectionTitle}>Dermatological Benefits</Text>
            {selectedProduct.benefits.map((b) => (
              <View key={b} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}

            {/* How to Use */}
            <Text style={styles.modalSectionTitle}>Application Instructions</Text>
            <SoftCard style={{ marginBottom: 14 }}>
              <Text style={styles.modalBodyText}>
                {selectedProduct.howToUse ||
                  'Apply to cleansed skin morning or evening. Follow with moisturizer.'}
              </Text>
            </SoftCard>

            {/* Precautions */}
            <Text style={styles.modalSectionTitle}>Precautions & Active Conflicts</Text>
            <SoftCard style={{ marginBottom: 14 }}>
              <Text style={styles.modalBodyText}>
                {selectedProduct.precautions ||
                  'Always patch test for 24h prior to use. Apply broad-spectrum SPF in the morning.'}
              </Text>
            </SoftCard>

            <Text style={styles.modalSectionTitle}>Why this may suit you</Text>
            <Text style={styles.modalBodyText}>
              {selectedProduct.skinTypes.includes(profile.skinType)
                ? `Listed for ${profile.skinType} skin. ${selectedProduct.benefits[0]}`
                : `Not specifically tagged for ${profile.skinType} skin. Review the compatibility score above before using.`}
            </Text>

            {/* Full INCI Ingredients */}
            <Text style={styles.modalSectionTitle}>Full Formula INCI</Text>
            <View style={styles.activesRow}>
              {selectedProduct.ingredients.map((ing) => (
                <View key={ing} style={styles.modalIngChip}>
                  <Text style={styles.modalIngText}>{ing}</Text>
                </View>
              ))}
            </View>

            <View style={{ gap: 10, marginTop: 24 }}>
              <PrimaryButton
                label="Add to routine bag"
                icon="bag-add"
                onPress={() => {
                  addToCart(selectedProduct.id);
                  setSelectedProduct(null);
                }}
              />
              <PrimaryButton
                label="Ask AI Dermatologist About This"
                icon="chatbubbles"
                onPress={() => {
                  setSelectedProduct(null);
                  router.push(ROUTES.dermatologist);
                }}
              />
              <GhostButton label="Close" onPress={() => setSelectedProduct(null)} />
            </View>
          </ScrollView>
        ) : null}
      </Modal>
      <CartSheet visible={cartOpen} onClose={() => setCartOpen(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Palette.ivory },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: { color: Palette.ivory, fontSize: 9, fontWeight: '800' },
  suggestBox: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: Palette.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.overlay,
    overflow: 'hidden',
  },
  suggestRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.overlay,
  },
  suggestText: { fontWeight: '700', color: Palette.ink, fontSize: 13 },
  suggestBrand: { color: Palette.muted, fontSize: 11, marginTop: 2 },
  filterBar: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 8 },
  filterPanel: { paddingLeft: 20, gap: 8, marginBottom: 8 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Palette.ink,
    letterSpacing: -0.3,
  },
  sub: {
    color: Palette.muted,
    marginTop: 2,
    fontSize: 13,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.12)',
  },
  search: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: Palette.cream,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.08)',
  },
  input: {
    flex: 1,
    color: Palette.ink,
    fontSize: 14,
  },
  filters: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Palette.cream,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.08)',
  },
  img: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: Palette.beige,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    flex: 1,
    fontWeight: '800',
    color: Palette.ink,
    fontSize: 14,
    marginRight: 6,
  },
  brand: {
    color: Palette.muted,
    fontSize: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Palette.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.1)',
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.ink,
  },
  reviewText: {
    fontSize: 9,
    color: Palette.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  price: {
    color: Palette.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  originalPrice: {
    fontSize: 11,
    color: Palette.muted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  snippet: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  activesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  activeTag: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.primary,
    backgroundColor: 'rgba(89, 69, 54, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeTagMore: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.muted,
    paddingVertical: 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.ink,
    marginTop: 4,
  },
  emptyCopy: {
    fontSize: 13,
    color: Palette.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  topic: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cream,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.08)',
  },
  topicIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: {
    fontWeight: '700',
    color: Palette.ink,
    fontSize: 14,
    marginBottom: 2,
  },
  topicDesc: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  whiteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  modalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: Palette.cream,
    marginBottom: 14,
  },
  modalName: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.ink,
    marginBottom: 4,
  },
  modalBrand: {
    fontSize: 14,
    color: Palette.muted,
    marginBottom: 2,
  },
  modalBarcode: {
    fontSize: 11,
    color: Palette.muted,
    marginBottom: 14,
  },
  modalCompatBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    backgroundColor: Palette.cream,
    marginBottom: 16,
  },
  modalCompatTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.ink,
  },
  modalCompatSub: {
    fontSize: 12,
    color: Palette.muted,
    marginTop: 2,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.ink,
    marginTop: 14,
    marginBottom: 8,
  },
  modalBodyText: {
    fontSize: 13,
    color: Palette.ink,
    lineHeight: 19,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    color: Palette.ink,
    lineHeight: 18,
  },
  modalIngChip: {
    backgroundColor: Palette.cream,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  modalIngText: {
    fontSize: 12,
    color: Palette.ink,
  },
});

import {
  AnimatedSegmentedPill,
  Badge,
  BouncyPressable,
  CelebrationBanner,
  CarouselDots,
  Chip,
  ConfidenceGauge,
  FloatingIcon,
  LivePulseDot,
  SectionTitle,
  ShimmerBeam,
  SlideTransition,
  SoftCard,
  StaggeredEntrance,
  SwipeableRoutineItem,
} from '@/components/brand/ui';
import { DisplayTitle, ProductCard } from '@/components/brand/premium';
import { Palette } from '@/constants/palette';
import { SKINCARE_TIPS } from '@/constants/tokens';
import { useShop } from '@/context/ShopContext';
import { useSkin } from '@/context/SkinContext';
import { productById, productsForSkin } from '@/lib/catalog';
import { generateSkincareKits, greetingFor } from '@/lib/engine';
import { ROUTES } from '@/lib/routes';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, toggleRoutineStep } = useSkin();
  const { recentlyViewed, viewProduct } = useShop();
  const [routineTab, setRoutineTab] = useState<'AM' | 'PM'>('AM');
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const dailyTip = SKINCARE_TIPS[new Date().getDate() % SKINCARE_TIPS.length];
  const recentProducts = recentlyViewed
    .map((id) => productById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const categories = [
    { id: 'cleanser', label: 'Cleansers', icon: 'water-outline' as const },
    { id: 'serum', label: 'Serums', icon: 'flask-outline' as const },
    { id: 'moisturizer', label: 'Moisturizers', icon: 'leaf-outline' as const },
    { id: 'sunscreen', label: 'SPF', icon: 'sunny-outline' as const },
  ];

  const products = useMemo(
    () => productsForSkin(profile.skinType, profile.suggestedProductIds),
    [profile.skinType, profile.suggestedProductIds]
  );

  const featuredKit = useMemo(
    () => generateSkincareKits(profile)[1] || generateSkincareKits(profile)[0],
    [profile]
  );

  const scanned = Boolean(profile.lastScanAt);
  const initial = (profile.name && profile.name !== 'there' ? profile.name : 'D')
    .charAt(0)
    .toUpperCase();

  const activeRoutine = useMemo(
    () => profile.dailyRoutine.filter((item) => item.time === routineTab),
    [profile.dailyRoutine, routineTab]
  );

  const completedSteps = profile.completedRoutineSteps ?? [];
  const completedCountForTab = activeRoutine.filter((item) =>
    completedSteps.includes(`${item.time}-${item.step}`)
  ).length;

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
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
      {/* 1. Header Bar */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.brandRow}>
            <Text style={styles.brandLogo}>DOC-N-CARE</Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.brandTagline}>CLINICAL AI</Text>
          </View>
          <DisplayTitle style={styles.greeting}>{greetingFor(profile.name)}</DisplayTitle>
          <Text style={styles.subGreeting}>
            {scanned
              ? `${profile.skinType} skin · Barrier: ${profile.barrierStatus || 'Balanced'}`
              : 'Scan your face to unlock personalized dermatology care'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{initial}</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Hero Face Scan Banner */}
      <View style={styles.heroWrap}>
        <LinearGradient
          colors={[Palette.primary, '#3F3228']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <View style={styles.kickerBadge}>
              <LivePulseDot color={Palette.cream} size={6} />
              <Text style={[styles.kicker, { marginLeft: 6 }]}>
                {scanned ? 'SKIN PROFILE ACTIVE' : 'AI DERMATOLOGY SCAN'}
              </Text>
            </View>
            <Text style={styles.heroTitle}>
              {scanned
                ? `${profile.skinType} Skin Profile (${profile.confidence}% Confidence)`
                : 'Map your skin barrier with AI Camera & Clinical Intake'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {scanned
                ? 'Your customized morning & evening routines are ready.'
                : 'Analyze hydration, sebum balance, and sensitivity in under 60 seconds.'}
            </Text>
            <TouchableOpacity
              style={styles.whiteBtn}
              onPress={() => router.push('/(tabs)/analyze')}
              activeOpacity={0.85}
            >
              <Text style={styles.whiteBtnText}>
                {scanned ? 'Update skin scan' : 'Start skin scan'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={Palette.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="scan-outline" size={38} color={Palette.white} />
          </View>
        </LinearGradient>
      </View>

      {/* 3. Core Quick Actions Hub (21st.dev Bento Architecture) */}
      <View style={styles.actionHub}>
        {/* Featured Flagship: AI Dermatologist (Full Width, Spacious, Shimmering) */}
        <StaggeredEntrance delay={120} distance={16}>
          <BouncyPressable
            style={styles.featuredActionCard}
            onPress={() => router.push(ROUTES.dermatologist)}
          >
            <ShimmerBeam duration={2800} />
            <View style={styles.featuredTopRow}>
              <View style={styles.featuredIconBox}>
                <FloatingIcon offset={3} duration={1800}>
                  <Ionicons name="chatbubbles" size={24} color={Palette.primary} />
                </FloatingIcon>
              </View>
              <View style={styles.featuredLiveBadge}>
                <LivePulseDot color={Palette.success} size={7} />
                <Text style={styles.featuredLiveBadgeText}>24/7 AI DERMATOLOGIST</Text>
              </View>
            </View>

            <Text style={styles.featuredTitle}>Clinical Skincare Guidance</Text>
            <Text style={styles.featuredCopy}>
              Ask about active breakouts, ingredient conflicts, or safe home remedies verified by AAD & DermNet monographs.
            </Text>

            <View style={styles.featuredFooter}>
              <View style={styles.tagWrap}>
                <View style={styles.miniTag}>
                  <Text style={styles.miniTagText}>Evidence-Grounded</Text>
                </View>
                <View style={styles.miniTag}>
                  <Text style={styles.miniTagText}>No Hallucinations</Text>
                </View>
              </View>
              <View style={styles.actionArrowCircle}>
                <Ionicons name="arrow-forward" size={16} color={Palette.primary} />
              </View>
            </View>
          </BouncyPressable>
        </StaggeredEntrance>

        {/* Supporting Secondary Actions (2 Balanced Spacious Columns) */}
        <View style={styles.dualActionRow}>
          <View style={{ flex: 1 }}>
            <StaggeredEntrance delay={220} distance={16}>
              <BouncyPressable
                style={styles.dualCard}
                onPress={() => router.push('/(tabs)/scan')}
              >
                <ShimmerBeam duration={3200} />
                <View style={styles.dualTopRow}>
                  <View style={styles.dualIconCircle}>
                    <FloatingIcon offset={2} duration={2200}>
                      <Ionicons name="barcode-outline" size={22} color={Palette.primary} />
                    </FloatingIcon>
                  </View>
                  <Badge label="Safety" variant="primary" />
                </View>
                <Text style={styles.dualTitle}>Barcode Scanner</Text>
                <Text style={styles.dualSub}>
                  Instant barrier & comedogenic check
                </Text>
                <View style={styles.dualFooter}>
                  <Text style={styles.dualLink}>Scan Bottle</Text>
                  <Ionicons name="scan-outline" size={14} color={Palette.primary} />
                </View>
              </BouncyPressable>
            </StaggeredEntrance>
          </View>

          <View style={{ flex: 1 }}>
            <StaggeredEntrance delay={280} distance={16}>
              <BouncyPressable
                style={styles.dualCard}
                onPress={() => router.push('/(tabs)/explore')}
              >
                <ShimmerBeam duration={3500} />
                <View style={styles.dualTopRow}>
                  <View style={styles.dualIconCircle}>
                    <FloatingIcon offset={2} duration={2400}>
                      <Ionicons name="sparkles-outline" size={22} color={Palette.primary} />
                    </FloatingIcon>
                  </View>
                  <Badge label="Catalog" variant="success" />
                </View>
                <Text style={styles.dualTitle}>Explore Actives</Text>
                <Text style={styles.dualSub}>
                  Vetted formulas & INCI index
                </Text>
                <View style={styles.dualFooter}>
                  <Text style={styles.dualLink}>Browse Library</Text>
                  <Ionicons name="arrow-forward" size={14} color={Palette.primary} />
                </View>
              </BouncyPressable>
            </StaggeredEntrance>
          </View>
        </View>
      </View>

      {/* 4. Active Daily Routine Checklist */}
      {scanned && activeRoutine.length > 0 ? (
        <View style={styles.section}>
          <SectionTitle
            title="Today's Skincare Routine"
            subtitle={`${completedCountForTab} of ${activeRoutine.length} steps completed · Swipe or tap to mark`}
            action={
              <View style={{ width: 130 }}>
                <AnimatedSegmentedPill<'AM' | 'PM'>
                  tabs={[
                    { id: 'AM', label: 'AM', icon: 'sunny' },
                    { id: 'PM', label: 'PM', icon: 'moon' },
                  ]}
                  activeTab={routineTab}
                  onChange={setRoutineTab}
                />
              </View>
            }
          />

          {completedCountForTab === activeRoutine.length && activeRoutine.length > 0 ? (
            <CelebrationBanner time={routineTab} />
          ) : null}

          <SlideTransition slideKey={routineTab}>
            <View style={styles.routineList}>
              {activeRoutine.map((item, idx) => {
                const stepKey = `${item.time}-${item.step}`;
                const isDone = completedSteps.includes(stepKey);
                return (
                  <SwipeableRoutineItem
                    key={`${item.time}-${idx}`}
                    time={item.time}
                    step={item.step}
                    completed={isDone}
                    onToggle={() => toggleRoutineStep(stepKey)}
                  />
                );
              })}
            </View>
          </SlideTransition>
        </View>
      ) : null}

      {/* 5. Diagnostic Summary Card (If scanned) */}
      {scanned ? (
        <View style={styles.section}>
          <SoftCard style={styles.statCard}>
            <View style={styles.statTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.statLabel}>LATEST DERMATOLOGICAL READ</Text>
                <Text style={styles.statType}>{profile.skinType} Skin</Text>
                <View style={styles.badgeRow}>
                  <Badge
                    label={`Barrier: ${profile.barrierStatus || 'Balanced'}`}
                    variant={profile.barrierStatus === 'Compromised' ? 'warning' : 'success'}
                  />
                  <Badge label="Clinical Match" variant="primary" />
                </View>
              </View>
              <ConfidenceGauge score={profile.confidence} size={62} />
            </View>

            <View style={styles.statDivider} />

            <View>
              <Text style={styles.statSubhead}>Primary Concerns Identified:</Text>
              <View style={styles.concernsWrap}>
                {(profile.concerns.length ? profile.concerns : ['General Maintenance']).map(
                  (c) => (
                    <Chip key={c} label={c} active />
                  )
                )}
              </View>
            </View>
          </SoftCard>
        </View>
      ) : null}

      {/* 5b. Recommended Skincare Kit Feature */}
      {scanned && featuredKit ? (
        <View style={styles.section}>
          <SectionTitle
            title="Your Recommended Skincare Kit"
            subtitle={`${featuredKit.products.length} compatible formulas · Complete routine`}
            action={
              <TouchableOpacity onPress={() => router.push('/(tabs)/analyze')}>
                <Text style={styles.link}>All Kits</Text>
              </TouchableOpacity>
            }
          />
          <BouncyPressable
            style={styles.kitFeatureCard}
            onPress={() => router.push('/(tabs)/analyze')}
          >
            <View style={styles.kitFeatureHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.kitBadgeRow}>
                  <Badge label={featuredKit.tierLabel} variant="primary" />
                  <Text style={styles.kitStepCountText}>
                    {featuredKit.products.length} Steps
                  </Text>
                </View>
                <Text style={styles.kitFeatureTitle}>{featuredKit.title}</Text>
                <Text style={styles.kitFeatureTagline}>{featuredKit.tagline}</Text>
              </View>
              <View style={styles.kitFeaturePriceBox}>
                <Text style={styles.kitFeaturePriceLabel}>TOTAL</Text>
                <Text style={styles.kitFeaturePriceVal}>{featuredKit.totalPrice}</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
            >
              {featuredKit.products.map((p, idx) => (
                <View key={`${p.id}-${idx}`} style={styles.kitMiniProduct}>
                  <Image source={{ uri: p.image }} style={styles.kitMiniImg} />
                  <Text style={styles.kitMiniCategory}>
                    {idx === 0
                      ? 'Cleanse'
                      : idx === 1
                        ? 'Target'
                        : idx === 2
                          ? 'Moisture'
                          : 'Protect'}
                  </Text>
                  <Text style={styles.kitMiniName} numberOfLines={1}>
                    {p.brand}
                  </Text>
                  <Text style={styles.kitMiniPrice}>{p.price}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.kitFeatureFooter}>
              <Text style={styles.kitFeatureFooterText}>
                Tailored for {profile.skinType.toLowerCase()} skin & barrier equilibrium
              </Text>
              <Ionicons name="arrow-forward-circle" size={20} color={Palette.primary} />
            </View>
          </BouncyPressable>
        </View>
      ) : null}

      {/* 6. Matched Products Horizontal Carousel */}
      <View style={styles.section}>
        <SectionTitle
          title={scanned ? `Vetted for ${profile.skinType} Skin` : 'Recommended Formulations'}
          subtitle="Formulated with physiological actives"
          action={
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.link}>View all</Text>
            </TouchableOpacity>
          }
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={196}
          decelerationRate="fast"
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / 196);
            if (index !== activeProductSlide && index >= 0) {
              setActiveProductSlide(index);
            }
          }}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingRight: 8, paddingVertical: 8 }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              why={
                scanned
                  ? `Chosen for ${profile.skinType.toLowerCase()} skin · ${product.benefits[0]}`
                  : product.benefits[0]
              }
              onPress={() => {
                viewProduct(product.id);
                router.push('/(tabs)/explore');
              }}
            />
          ))}
        </ScrollView>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <CarouselDots
            total={Math.min(products.length, 6)}
            active={Math.min(activeProductSlide, 5)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Skincare categories" subtitle="Browse by ritual step" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <BouncyPressable
              key={cat.id}
              style={styles.categoryChip}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Ionicons name={cat.icon} size={18} color={Palette.primary} />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </BouncyPressable>
          ))}
        </ScrollView>
      </View>

      {recentProducts.length ? (
        <View style={styles.section}>
          <SectionTitle title="Recently viewed" subtitle="Pick up where you left off" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                onPress={() => {
                  viewProduct(product.id);
                  router.push('/(tabs)/explore');
                }}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionTitle title="Today’s skin note" subtitle="A small, useful habit" />
        <SoftCard>
          <Text style={styles.tipKicker}>DAILY CARE</Text>
          <Text style={styles.headlineTitle}>{dailyTip.title}</Text>
          <Text style={styles.headlineCopy}>{dailyTip.copy}</Text>
        </SoftCard>
      </View>

      {/* 7. Barcode Verification Callout */}
      <BouncyPressable
        style={styles.safety}
        onPress={() => router.push('/(tabs)/scan')}
      >
        <View style={styles.safetyIcon}>
          <Ionicons name="shield-checkmark" size={24} color={Palette.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.safetyTitle}>Verify Skincare Ingredients</Text>
          <Text style={styles.safetyCopy}>
            Scan the barcode on any bottle to check comedogenic ratings, allergens, and barrier compatibility.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Palette.primary} />
      </BouncyPressable>

      {/* 8. Daily Clinical Note */}
      <View style={styles.section}>
        <SectionTitle title="Dermatological Insight" subtitle="Evidence-based guidance" />
        <BouncyPressable
          style={styles.headline}
          onPress={() => router.push(ROUTES.dermatologist)}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=600&q=80',
            }}
            style={styles.headlineImage}
          />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Badge label="AAD Monograph" variant="primary" />
            <Text style={styles.headlineTitle}>Broad-Spectrum SPF is Primary Treatment</Text>
            <Text style={styles.headlineCopy}>
              UV radiation stimulates melanocytes and degrades collagen. A 2-minute morning habit protects every other step.
            </Text>
          </View>
        </BouncyPressable>
      </View>

      {/* 9. AI Dermatologist Assistance Banner */}
      <View style={styles.heroWrap}>
        <LinearGradient
          colors={['#3F3228', Palette.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Ask Your AI Dermatologist</Text>
            <Text style={styles.heroCopy}>
              Evidence-based answers on active combinations, breakout remedies, and barrier soothing.
            </Text>
            <TouchableOpacity
              style={styles.whiteBtn}
              onPress={() => router.push(ROUTES.dermatologist)}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubbles" size={16} color={Palette.primary} />
              <Text style={styles.whiteBtnText}>Consult AI Dermatologist</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="pulse" size={32} color={Palette.white} />
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.ivory },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Palette.overlay,
  },
  categoryLabel: {
    fontWeight: '700',
    color: Palette.ink,
    fontSize: 13,
  },
  tipKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.gold,
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandLogo: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 1.5,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.beige,
    marginHorizontal: 6,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.muted,
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '600',
    color: Palette.ink,
    letterSpacing: -0.4,
  },
  subGreeting: {
    fontSize: 13,
    color: Palette.muted,
    marginTop: 2,
    lineHeight: 18,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Palette.cream,
  },
  avatarText: {
    color: Palette.white,
    fontWeight: '800',
    fontSize: 18,
  },
  heroWrap: {
    marginHorizontal: 20,
    marginVertical: 14,
    borderRadius: 20,
    overflow: 'hidden',
  },
  hero: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  kickerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  kicker: {
    color: Palette.cream,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  heroTitle: {
    color: Palette.white,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: Palette.cream,
    fontSize: 13,
    opacity: 0.95,
    marginBottom: 14,
    lineHeight: 18,
  },
  heroCopy: {
    color: Palette.white,
    opacity: 0.9,
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 19,
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
  whiteBtnText: {
    color: Palette.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionHub: {
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 6,
    gap: 12,
  },
  featuredActionCard: {
    backgroundColor: Palette.cream,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.12)',
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  featuredLiveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.ink,
    marginBottom: 4,
  },
  featuredCopy: {
    fontSize: 12,
    color: Palette.muted,
    lineHeight: 18,
    marginBottom: 14,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(89, 69, 54, 0.08)',
  },
  tagWrap: {
    flexDirection: 'row',
    gap: 6,
  },
  miniTag: {
    backgroundColor: Palette.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.08)',
  },
  miniTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.primary,
  },
  actionArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dualActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dualCard: {
    backgroundColor: Palette.cream,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.1)',
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    justifyContent: 'space-between',
  },
  dualTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dualIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  dualTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.ink,
    marginBottom: 3,
  },
  dualSub: {
    fontSize: 11,
    color: Palette.muted,
    lineHeight: 15,
    marginBottom: 12,
  },
  dualFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(89, 69, 54, 0.08)',
  },
  dualLink: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  routineToggle: {
    flexDirection: 'row',
    backgroundColor: Palette.cream,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
  },
  toggleBtnActive: {
    backgroundColor: Palette.primary,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  toggleTextActive: {
    color: Palette.white,
  },
  routineList: {
    marginTop: 8,
  },
  statCard: {
    backgroundColor: Palette.cream,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 0.8,
  },
  statType: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.ink,
    marginTop: 4,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statDivider: {
    height: 1,
    backgroundColor: Palette.beige,
    marginVertical: 14,
    opacity: 0.7,
  },
  statSubhead: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: 8,
  },
  concernsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  link: {
    color: Palette.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  productCard: {
    width: 156,
    backgroundColor: Palette.cream,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54), 0.08)',
  },
  productImage: {
    width: '100%',
    height: 106,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: Palette.beige,
  },
  productBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  productBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 0.5,
  },
  productTitle: {
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
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productPrice: {
    color: Palette.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  safety: {
    marginHorizontal: 20,
    marginTop: 22,
    backgroundColor: Palette.cream,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54), 0.1)',
  },
  safetyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyTitle: {
    fontWeight: '800',
    color: Palette.ink,
    fontSize: 15,
    marginBottom: 2,
  },
  safetyCopy: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  headline: {
    backgroundColor: Palette.cream,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54), 0.08)',
  },
  headlineImage: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: Palette.beige,
  },
  headlineTitle: {
    fontWeight: '700',
    color: Palette.ink,
    fontSize: 14,
    marginVertical: 4,
    lineHeight: 19,
  },
  headlineCopy: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  kitFeatureCard: {
    backgroundColor: Palette.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.beige,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  kitFeatureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  kitBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  kitStepCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.muted,
  },
  kitFeatureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.ink,
    marginTop: 2,
  },
  kitFeatureTagline: {
    fontSize: 12,
    color: Palette.muted,
    marginTop: 1,
  },
  kitFeaturePriceBox: {
    backgroundColor: Palette.cream,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54), 0.12)',
  },
  kitFeaturePriceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 0.5,
  },
  kitFeaturePriceVal: {
    fontSize: 15,
    fontWeight: '900',
    color: Palette.primaryDeep,
    marginTop: 1,
  },
  kitMiniProduct: {
    width: 90,
    padding: 8,
    borderRadius: 12,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54), 0.08)',
  },
  kitMiniImg: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Palette.white,
    marginBottom: 6,
  },
  kitMiniCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: Palette.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  kitMiniName: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.ink,
    textAlign: 'center',
    width: '100%',
  },
  kitMiniPrice: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.muted,
    marginTop: 2,
  },
  kitFeatureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(89, 69, 54), 0.08)',
  },
  kitFeatureFooterText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primary,
  },
});

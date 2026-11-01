import {
  AnimatedCounter,
  AnimatedSegmentedPill,
  Badge,
  BiometricFaceReticle,
  BouncyPressable,
  Chip,
  ClinicalDisclaimer,
  ConfidenceGauge,
  GhostButton,
  GestureBottomSheet,
  LivePulseDot,
  PrimaryButton,
  RotatingChevron,
  SlideTransition,
  SoftCard,
} from '@/components/brand/ui';
import { AnimatedProgressBar } from '@/components/brand/premium';
import { Palette } from '@/constants/palette';
import { useShop } from '@/context/ShopContext';
import { useSkin } from '@/context/SkinContext';
import { productById, productsForSkin, substitutesFor } from '@/lib/catalog';
import { buildProfile, generateSkincareKits } from '@/lib/engine';
import { ROUTES } from '@/lib/routes';
import type { Concern, ProblemDetail, QuizAnswers } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CONCERNS: { id: Concern; label: string; desc: string }[] = [
  { id: 'Acne', label: 'Acne & Blemishes', desc: 'Comedones, papules, congestion' },
  { id: 'Dryness', label: 'Dryness & Flaking', desc: 'Tightness, barrier dehydration' },
  { id: 'Oiliness', label: 'Excess Oil & Shine', desc: 'T-zone sebum hypersecretion' },
  { id: 'Dark spots', label: 'Dark Spots & PIH', desc: 'Post-acne marks, hyperpigmentation' },
  { id: 'Large pores', label: 'Visible Large Pores', desc: 'Dilated follicular openings' },
  { id: 'Redness', label: 'Redness & Erythema', desc: 'Flushing, stinging, reactivity' },
  { id: 'Fine lines', label: 'Fine Lines & Texture', desc: 'Early photoaging, dehydration lines' },
  { id: 'Dullness', label: 'Dullness & Uneven Tone', desc: 'Cellular stagnation, loss of glow' },
];

type Step = 'intro' | 'camera' | 'quiz' | 'working' | 'result';

const QUESTIONS = [
  {
    key: 'afterWash' as const,
    category: 'SEBUM & MOISTURE RETENTION',
    title: 'How does your skin feel 30 minutes after washing?',
    desc: 'Assesses natural lipid replenishment rate without any products applied.',
    options: [
      { id: 'tight', label: 'Tight, dry, or mildly flaky', sub: 'Indicates depleted intercellular lipids' },
      { id: 'comfortable', label: 'Comfortable & balanced', sub: 'Intact barrier homeostasis' },
      { id: 'oily', label: 'Shiny or oily (especially T-zone)', sub: 'Rapid sebum excretion rate' },
    ],
  },
  {
    key: 'breakouts' as const,
    category: 'FOLLICULAR CONGESTION',
    title: 'How frequently do you experience breakouts?',
    desc: 'Evaluates follicular occlusion and Cutibacterium acnes activity.',
    options: [
      { id: 'rarely', label: 'Rarely / Almost never', sub: 'Clear follicular channels' },
      { id: 'sometimes', label: 'Occasionally (1–3 spots per month)', sub: 'Mild localized congestion' },
      { id: 'often', label: 'Frequently / Recurring breakouts', sub: 'Active inflammatory comedogenesis' },
    ],
  },
  {
    key: 'sensitivity' as const,
    category: 'BARRIER INTEGRITY',
    title: 'How does your skin respond to environmental changes or new formulas?',
    desc: 'Measures neurosensory erythema and stratum corneum permeability.',
    options: [
      { id: 'low', label: 'Resilient — rarely reacts or stings', sub: 'Thick, intact cutaneous barrier' },
      { id: 'medium', label: 'Sometimes stings with active serums or fragrance', sub: 'Moderate barrier sensitivity' },
      { id: 'high', label: 'Frequently flushes, burns, or becomes red/itchy', sub: 'Compromised stratum corneum' },
    ],
  },
  {
    key: 'climate' as const,
    category: 'ENVIRONMENTAL EXPOSOME',
    title: 'What is your primary living climate or daily environment?',
    desc: 'Ambient humidity and temperature directly affect transepidermal water loss.',
    options: [
      { id: 'dry', label: 'Arid / Cold / Dry indoor heating', sub: 'Accelerates water evaporation' },
      { id: 'humid', label: 'Tropical / Humid / Coastal', sub: 'Triggers sweat and oil production' },
      { id: 'mixed', label: 'Temperate / Mixed AC indoor environment', sub: 'Variable barrier exposure' },
    ],
  },
];

export default function AnalyzeScreen() {
  const router = useRouter();
  const { profile, saveProfile } = useSkin();
  const { saveKit, addToCart, viewProduct } = useShop();
  const [kitOverrides, setKitOverrides] = useState<Record<string, string[]>>({});
  const [replaceSlot, setReplaceSlot] = useState<{ kitId: string; index: number } | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [step, setStep] = useState<Step>('intro');
  const [photo, setPhoto] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [workingPhase, setWorkingPhase] = useState(0);
  const [expandedConcern, setExpandedConcern] = useState<string | null>(null);
  const [selectedKitTier, setSelectedKitTier] = useState<'essential' | 'clinical' | 'advanced'>('clinical');

  const [quiz, setQuiz] = useState<QuizAnswers>({
    afterWash: 'comfortable',
    breakouts: 'sometimes',
    sensitivity: 'medium',
    climate: 'mixed',
    concerns: [],
  });

  const resultProducts = useMemo(
    () => productsForSkin(profile.skinType, profile.suggestedProductIds),
    [profile.skinType, profile.suggestedProductIds]
  );

  const skincareKits = useMemo(() => {
    const kits = generateSkincareKits(profile);
    return kits.map((kit) => {
      const ids = kitOverrides[kit.id];
      if (!ids) return kit;
      const products = kit.products.map((product, idx) => {
        const next = ids[idx];
        return next ? productById(next) || product : product;
      });
      const sum = products.reduce((acc, p) => acc + (parseInt(p.price.replace(/[^\d]/g, ''), 10) || 0), 0);
      return { ...kit, products, totalPrice: `₹${sum}` };
    });
  }, [kitOverrides, profile]);
  const currentKit = skincareKits.find((k) => k.tier === selectedKitTier) || skincareKits[1] || skincareKits[0];
  const replaceProduct =
    replaceSlot && currentKit
      ? currentKit.products[replaceSlot.index]
      : null;

  // Animate multi-stage processing during 'working' step
  useEffect(() => {
    if (step === 'working') {
      const timers = [
        setTimeout(() => setWorkingPhase(1), 500),
        setTimeout(() => setWorkingPhase(2), 1100),
        setTimeout(() => setWorkingPhase(3), 1700),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Palette.primary} size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <View style={styles.permIconCircle}>
          <Ionicons name="camera-outline" size={48} color={Palette.primary} />
        </View>
        <Text style={styles.permTitle}>Camera Permission Required</Text>
        <Text style={styles.permCopy}>
          DOC-N-CARE uses local camera imagery solely to calibrate your facial skin map. Your photo is processed locally on your device and never uploaded without your consent.
        </Text>
        <PrimaryButton label="Grant Camera Access" onPress={requestPermission} icon="camera" />
      </View>
    );
  }

  const capture = async () => {
    try {
      const shot = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
      if (!shot?.uri) throw new Error('No photo');
      setPhoto(shot.uri);
      setStep('quiz');
      setQIndex(0);
    } catch {
      Alert.alert('Capture Unsuccessful', 'Please ensure adequate lighting and hold still.');
    }
  };

  const finishQuiz = async () => {
    setStep('working');
    setWorkingPhase(0);
    await new Promise((r) => setTimeout(r, 2200));

    const next = buildProfile(quiz, {
      name: profile.name,
      age: profile.age,
      photoUri: photo,
    });

    await saveProfile(next);
    setStep('result');
  };

  const onSelect = (key: keyof Omit<QuizAnswers, 'concerns'>, id: string) => {
    setQuiz((prev) => ({ ...prev, [key]: id }));
  };

  // 1. WORKING / PROCESSING SCREEN
  if (step === 'working') {
    const phases = [
      'Calibrating surface reflection & facial geometry…',
      'Assessing epidermal hydration & barrier index…',
      'Cross-referencing clinical dermatology consensus (AAD/DermNet)…',
      'Synthesizing personalized active regimen & routine…',
    ];

    return (
      <View style={styles.center}>
        <View style={styles.radarPulse}>
          <ActivityIndicator size="large" color={Palette.gold} />
        </View>
        <Text style={styles.workingTitle}>Reading your skin map</Text>
        <Text style={styles.workingPhaseText}>{phases[workingPhase] || phases[0]}</Text>
        <View style={{ width: '78%', marginTop: 18 }}>
          <AnimatedProgressBar progress={(workingPhase + 1) / 4} />
        </View>
      </View>
    );
  }

  // 2. RESULTS SCREEN
  if (step === 'result') {
    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.resultHead}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbFallback]}>
              <Ionicons name="person" size={32} color={Palette.primary} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.kickerRow}>
              <LivePulseDot color={Palette.success} size={6} />
              <Text style={[styles.kicker, { marginLeft: 6 }]}>ANALYSIS COMPLETE</Text>
              <Badge
                label={`Barrier: ${profile.barrierStatus || 'Balanced'}`}
                variant={profile.barrierStatus === 'Compromised' ? 'warning' : 'success'}
              />
            </View>
            <Text style={styles.bigType}>{profile.skinType} Skin</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <AnimatedCounter target={profile.confidence} style={styles.counterText} />
              <Text style={styles.metaSub}> clinical match from camera + intake</Text>
            </View>
          </View>
          <ConfidenceGauge score={profile.confidence} size={56} />
        </View>

        {/* Regulatory & Safety Notice */}
        <ClinicalDisclaimer />

        {/* Detected Concerns Section */}
        <Text style={styles.blockTitle}>Detected Cutaneous Concerns</Text>
        <Text style={styles.blockSubtitle}>
          Tap any concern to view biological mechanism and proven actives:
        </Text>
        {profile.problems.map((item: ProblemDetail) => {
          const isExpanded = expandedConcern === item.title;
          return (
            <BouncyPressable
              key={item.title}
              onPress={() => setExpandedConcern(isExpanded ? null : item.title)}
            >
              <SoftCard style={{ marginBottom: 10 }}>
                <View style={styles.concernHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardCopy}>{item.detail}</Text>
                  </View>
                  <RotatingChevron expanded={isExpanded} />
                </View>

                {isExpanded ? (
                  <View style={styles.expandedDetails}>
                    {item.mechanism ? (
                      <View style={{ marginBottom: 8 }}>
                        <Text style={styles.detailHeading}>Biological Mechanism:</Text>
                        <Text style={styles.detailCopy}>{item.mechanism}</Text>
                      </View>
                    ) : null}

                    {item.provenActives?.length ? (
                      <View>
                        <Text style={styles.detailHeading}>Evidence-Based Actives:</Text>
                        <View style={styles.rowWrap}>
                          {item.provenActives.map((active) => (
                            <Badge key={active} label={active} variant="primary" />
                          ))}
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </SoftCard>
            </BouncyPressable>
          );
        })}

        {/* Recommended Ingredients */}
        <Text style={styles.blockTitle}>Prioritize These Physiological Actives</Text>
        <Text style={styles.blockSubtitle}>
          Targeted molecular ingredients selected for {profile.skinType.toLowerCase()} skin:
        </Text>
        <View style={styles.rowWrap}>
          {profile.recommendedIngredients.map((item) => (
            <Chip key={item} label={item} active icon="sparkles" />
          ))}
        </View>

        {/* Avoid Ingredients */}
        <Text style={styles.blockTitle}>Ingredients to Avoid or Minimize</Text>
        <Text style={styles.blockSubtitle}>
          Potential comedogens or barrier irritants flagged for your profile:
        </Text>
        <View style={styles.rowWrap}>
          {profile.avoidIngredients.map((item) => (
            <View key={item} style={styles.avoidChip}>
              <Ionicons
                name="alert-circle"
                size={14}
                color={Palette.dangerText}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.avoidText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Personalized Daily Routine */}
        <Text style={styles.blockTitle}>Your Evidence-Based Daily Routine</Text>
        <Text style={styles.blockSubtitle}>
          Designed for morning defense and nighttime cellular repair:
        </Text>
        {profile.dailyRoutine.map((item, index) => (
          <View key={`${item.time}-${index}`} style={styles.routineRow}>
            <View
              style={[
                styles.routineBadge,
                item.time === 'AM' ? styles.routineAm : styles.routinePm,
              ]}
            >
              <Text style={styles.routineBadgeText}>{item.time}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.routineStepNumber}>Step {index + 1}</Text>
              <Text style={styles.routineStepTitle}>{item.step}</Text>
            </View>
          </View>
        ))}

        {/* Personalized Skincare Kits (3-4 Product Sets by Budget) */}
        <Text style={styles.blockTitle}>Recommended Complete Skincare Kits</Text>
        <Text style={styles.blockSubtitle}>
          Complete 3–4 product regimens matched to your barrier health and budget:
        </Text>

        {/* Kit Tier Selector with 21st.dev Sliding Pill Track */}
        <View style={{ marginBottom: 14 }}>
          <AnimatedSegmentedPill<'essential' | 'clinical' | 'advanced'>
            tabs={[
              { id: 'essential', label: 'Budget', icon: 'leaf' },
              { id: 'clinical', label: 'Standard (Top)', icon: 'star' },
              { id: 'advanced', label: 'Premium', icon: 'shield-checkmark' },
            ]}
            activeTab={selectedKitTier}
            onChange={setSelectedKitTier}
          />
        </View>

        {/* Selected Kit Card */}
        {currentKit ? (
          <SlideTransition slideKey={selectedKitTier}>
            <View style={styles.kitCard}>
              <View style={styles.kitCardHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.kitBadgeRow}>
                  <Badge
                    label={currentKit.tierLabel}
                    variant={
                      currentKit.tier === 'clinical'
                        ? 'primary'
                        : currentKit.tier === 'advanced'
                          ? 'warning'
                          : 'success'
                    }
                  />
                  <Text style={styles.kitStepCount}>
                    {currentKit.products.length} Products Included
                  </Text>
                </View>
                <Text style={styles.kitCardTitle}>{currentKit.title}</Text>
                <Text style={styles.kitTagline}>{currentKit.tagline}</Text>
              </View>
              <View style={styles.kitPriceBox}>
                <Text style={styles.kitPriceLabel}>KIT TOTAL</Text>
                <Text style={styles.kitPriceVal}>{currentKit.totalPrice}</Text>
              </View>
            </View>

            <View style={styles.kitRationaleBox}>
              <View style={styles.rationaleHeader}>
                <Ionicons
                  name="medical"
                  size={13}
                  color={Palette.primary}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.rationaleTitle}>Dermatological Rationale</Text>
              </View>
              <Text style={styles.rationaleText}>{currentKit.rationale}</Text>
            </View>

            <View style={styles.kitProductsWrap}>
              {currentKit.products.map((product, pIdx) => {
                const stepLabels = [
                  'Step 1 · Cleanse',
                  'Step 2 · Target / Treat',
                  'Step 3 · Barrier Hydration',
                  'Step 4 · Photoprotection',
                ];
                const stepLabel = stepLabels[pIdx] || `Step ${pIdx + 1} · ${product.category}`;
                return (
                  <View key={`${product.id}-${pIdx}`} style={styles.kitProductItem}>
                    <Image source={{ uri: product.image }} style={styles.kitProductThumb} />
                    <View style={{ flex: 1 }}>
                      <View style={styles.kitProductStepRow}>
                        <Text style={styles.kitProductStep}>{stepLabel}</Text>
                        <Text style={styles.kitProductPrice}>{product.price}</Text>
                      </View>
                      <Text style={styles.kitProductName} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text style={styles.kitProductBrand}>{product.brand}</Text>
                      <Text style={styles.kitProductBenefit} numberOfLines={2}>
                        Why it suits you: {product.benefits[0] || `Compatible with ${profile.skinType} skin.`}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                        <TouchableOpacity
                          onPress={() => {
                            viewProduct(product.id);
                            router.push('/(tabs)/explore');
                          }}
                        >
                          <Text style={styles.kitLink}>Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setReplaceSlot({ kitId: currentKit.id, index: pIdx })}
                        >
                          <Text style={styles.kitLink}>Replace</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => addToCart(product.id)}>
                          <Text style={styles.kitLink}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={{ gap: 10, marginBottom: 10 }}>
              <PrimaryButton
                label="Save this routine"
                icon="bookmark"
                onPress={() => saveKit(currentKit)}
              />
            </View>

            <BouncyPressable
              style={styles.kitConsultBtn}
              onPress={() => router.push(ROUTES.dermatologist)}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={16}
                color={Palette.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.kitConsultBtnText}>
                Discuss this {currentKit.tierLabel} Kit with AI Dermatologist
              </Text>
            </BouncyPressable>
          </View>
        </SlideTransition>
        ) : null}

        {/* Suggested Matched Products */}
        <Text style={styles.blockTitle}>Matched Skincare Formulations</Text>
        <Text style={styles.blockSubtitle}>
          Dermatologically vetted formulas compatible with your barrier:
        </Text>
        {resultProducts.map((product) => (
          <BouncyPressable
            key={product.id}
            style={styles.productRow}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Image source={{ uri: product.image }} style={styles.productImg} />
            <View style={{ flex: 1 }}>
              <View style={styles.productHeader}>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {product.name}
                </Text>
                <Badge label="Fits Profile" variant="success" />
              </View>
              <Text style={styles.productSub}>
                {product.brand} · {product.price}
              </Text>
              <Text style={styles.productSnippet} numberOfLines={2}>
                {product.benefits[0] || product.description}
              </Text>
            </View>
          </BouncyPressable>
        ))}

        {/* CTA Actions */}
        <View style={{ gap: 12, marginTop: 24 }}>
          <PrimaryButton
            label="Discuss Profile with AI Dermatologist"
            icon="chatbubbles"
            onPress={() => router.push(ROUTES.dermatologist)}
          />
          <GhostButton
            label="Retake Skin Analysis"
            icon="camera"
            onPress={() => {
              setStep('intro');
              setPhoto(null);
            }}
          />
        </View>

        <GestureBottomSheet
          visible={Boolean(replaceSlot && replaceProduct)}
          onClose={() => setReplaceSlot(null)}
          title="Replace product"
          subtitle={replaceProduct ? `Same step · ${replaceProduct.category}` : undefined}
        >
          {replaceProduct && replaceSlot
            ? substitutesFor(
                replaceProduct,
                currentKit?.products.map((p) => p.id) || []
              ).map((alt) => (
                <BouncyPressable
                  key={alt.id}
                  style={styles.productRow}
                  onPress={() => {
                    const kit = skincareKits.find((k) => k.id === replaceSlot.kitId);
                    const ids = (kit?.products || []).map((p) => p.id);
                    ids[replaceSlot.index] = alt.id;
                    setKitOverrides((prev) => ({ ...prev, [replaceSlot.kitId]: ids }));
                    setReplaceSlot(null);
                  }}
                >
                  <Image source={{ uri: alt.image }} style={styles.productImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productTitle}>{alt.name}</Text>
                    <Text style={styles.productSub}>
                      {alt.brand} · {alt.price}
                    </Text>
                  </View>
                </BouncyPressable>
              ))
            : null}
        </GestureBottomSheet>
      </ScrollView>
    );
  }

  // 3. QUIZ SCREEN
  if (step === 'quiz') {
    const isConcerns = qIndex === QUESTIONS.length;
    const current = QUESTIONS[qIndex];
    const totalSteps = QUESTIONS.length + 1;
    const progress = (qIndex + 1) / totalSteps;

    return (
      <View style={styles.page}>
        <AnimatedProgressBar progress={progress} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.stepKicker}>
            QUESTION {qIndex + 1} OF {totalSteps} · {isConcerns ? 'SKIN FOCUS' : current.category}
          </Text>
          <Text style={styles.qTitle}>
            {isConcerns ? 'Which skin concerns do you want to address?' : current.title}
          </Text>
          <Text style={styles.qDesc}>
            {isConcerns
              ? 'Select all that apply. We will customize your active ingredients accordingly.'
              : current.desc}
          </Text>

          <View style={{ marginTop: 20 }}>
            {isConcerns ? (
              <View style={styles.concernsGrid}>
                {CONCERNS.map((item) => {
                  const selected = quiz.concerns.includes(item.id);
                  return (
                    <BouncyPressable
                      key={item.id}
                      style={[styles.concernCard, selected && styles.concernCardActive]}
                      onPress={() =>
                        setQuiz((prev) => ({
                          ...prev,
                          concerns: selected
                            ? prev.concerns.filter((c) => c !== item.id)
                            : [...prev.concerns, item.id],
                        }))
                      }
                    >
                      <View style={styles.concernCardTop}>
                        <Text style={[styles.concernLabel, selected && styles.concernLabelActive]}>
                          {item.label}
                        </Text>
                        <Ionicons
                          name={selected ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={selected ? Palette.primary : Palette.beige}
                        />
                      </View>
                      <Text style={[styles.concernDesc, selected && styles.concernDescActive]}>
                        {item.desc}
                      </Text>
                    </BouncyPressable>
                  );
                })}
              </View>
            ) : (
              current.options.map((option) => {
                const isSelected = quiz[current.key] === option.id;
                return (
                  <BouncyPressable
                    key={option.id}
                    style={[styles.optionCard, isSelected && styles.optionCardActive]}
                    onPress={() => onSelect(current.key, option.id)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                        {option.label}
                      </Text>
                      <Text style={styles.optionSub}>{option.sub}</Text>
                    </View>
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={isSelected ? Palette.primary : Palette.beige}
                    />
                  </BouncyPressable>
                );
              })
            )}
          </View>
        </ScrollView>

        <View style={styles.quizBottomBar}>
          {qIndex > 0 ? (
            <GhostButton
              label="Back"
              onPress={() => setQIndex((n) => n - 1)}
              style={{ flex: 1 }}
            />
          ) : null}
          <PrimaryButton
            label={isConcerns ? 'Generate Skin Analysis' : 'Next Question'}
            icon={isConcerns ? 'sparkles' : 'arrow-forward'}
            onPress={() => {
              if (isConcerns) finishQuiz();
              else setQIndex((n) => n + 1);
            }}
            style={{ flex: qIndex > 0 ? 2 : 1 }}
          />
        </View>
      </View>
    );
  }

  // 4. CAMERA SCREEN
  if (step === 'camera') {
    return (
      <View style={styles.camPage}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

        {/* Viewfinder Overlays */}
        <View style={styles.camMask}>
          <BiometricFaceReticle />
          <View style={styles.camHintBox}>
            <Ionicons name="sunny-outline" size={16} color={Palette.cream} />
            <Text style={styles.camHint}>
              Center face in biometric reticle · Even lighting · Hold still
            </Text>
          </View>
        </View>

        {/* Bottom Shutter Controls */}
        <View style={styles.camBar}>
          <TouchableOpacity
            style={styles.camIconBtn}
            onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-reverse" size={24} color={Palette.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.shutter} onPress={capture} activeOpacity={0.8}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.camIconBtn}
            onPress={() => setStep('intro')}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color={Palette.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 5. INTRO / LANDING SCREEN
  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <SoftCard style={{ marginBottom: 16 }}>
        <View style={styles.kickerRow}>
          <Text style={styles.kicker}>CLINICAL SKIN MAPPING</Text>
          <Badge label="Baumann & AAD Grounded" variant="primary" />
        </View>
        <Text style={styles.introTitle}>Map Your Skin Barrier & Active Needs</Text>
        <Text style={styles.introBody}>
          Our multi-parameter assessment combines local camera imaging with a dermatological questionnaire to evaluate hydration, sebum rate, and barrier sensitivity.
        </Text>

        <View style={styles.stepGuideList}>
          <StepItem
            num="1"
            title="Facial Capture"
            desc="Frontal camera snapshot to examine surface oiliness, redness, and texture."
          />
          <StepItem
            num="2"
            title="Dermatological Intake"
            desc="4 short questions on post-cleansing sensations, barrier resilience, and climate."
          />
          <StepItem
            num="3"
            title="Custom Active Protocol"
            desc="Targeted ingredients to prioritize, irritants to avoid, and personalized routine."
          />
        </View>
      </SoftCard>

      {profile.lastScanAt ? (
        <TouchableOpacity
          style={styles.lastScanPill}
          onPress={() => setStep('result')}
          activeOpacity={0.85}
        >
          <View style={styles.lastScanIcon}>
            <Ionicons name="shield-checkmark" size={20} color={Palette.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.lastScanLabel}>Active Profile Stored</Text>
            <Text style={styles.lastScanValue}>
              {profile.skinType} Skin · {profile.confidence}% Confidence
            </Text>
          </View>
          <Text style={styles.lastScanAction}>View Results</Text>
        </TouchableOpacity>
      ) : null}

      <ClinicalDisclaimer />

      <View style={{ marginTop: 16 }}>
        <PrimaryButton
          label="Open Camera & Begin Scan"
          icon="camera"
          onPress={() => setStep('camera')}
        />
      </View>
    </ScrollView>
  );
}

function StepItem({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{num}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kitLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.gold,
  },
  page: { flex: 1, backgroundColor: Palette.ivory, padding: 20 },
  center: {
    flex: 1,
    backgroundColor: Palette.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  permTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  permCopy: {
    color: Palette.muted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontSize: 14,
  },
  kickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  kicker: {
    color: Palette.primary,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1.1,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.ink,
    marginBottom: 10,
    lineHeight: 28,
  },
  introBody: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  stepGuideList: {
    gap: 12,
    marginTop: 4,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: Palette.white,
    fontWeight: '800',
    fontSize: 13,
  },
  stepTitle: {
    fontWeight: '700',
    color: Palette.ink,
    fontSize: 14,
    marginBottom: 2,
  },
  stepDesc: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  lastScanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cream,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54), 0.12)',
    marginVertical: 10,
    gap: 12,
  },
  lastScanIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastScanLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  lastScanValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.ink,
    marginTop: 2,
  },
  lastScanAction: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Palette.cream,
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Palette.primary,
  },
  stepKicker: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  qTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.ink,
    lineHeight: 28,
    marginBottom: 6,
  },
  qDesc: {
    fontSize: 13,
    color: Palette.muted,
    lineHeight: 19,
  },
  optionCard: {
    backgroundColor: Palette.cream,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(89, 69, 54), 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCardActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.beige,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.ink,
  },
  optionLabelActive: {
    color: Palette.primary,
  },
  optionSub: {
    fontSize: 12,
    color: Palette.muted,
    marginTop: 3,
  },
  concernsGrid: {
    gap: 10,
  },
  concernCard: {
    backgroundColor: Palette.cream,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(89, 69, 54), 0.08)',
  },
  concernCardActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.beige,
  },
  concernCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  concernLabel: {
    fontWeight: '700',
    fontSize: 14,
    color: Palette.ink,
  },
  concernLabelActive: {
    color: Palette.primary,
  },
  concernDesc: {
    fontSize: 12,
    color: Palette.muted,
  },
  concernDescActive: {
    color: Palette.primary,
    opacity: 0.85,
  },
  quizBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: Palette.white,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(89, 69, 54), 0.08)',
  },
  radarPulse: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  workingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.primary,
    marginBottom: 8,
  },
  workingPhaseText: {
    fontSize: 13,
    color: Palette.muted,
    textAlign: 'center',
    marginBottom: 24,
    height: 40,
  },
  workingTrack: {
    width: 220,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.cream,
    overflow: 'hidden',
  },
  workingBar: {
    height: '100%',
    backgroundColor: Palette.primary,
  },
  camPage: { flex: 1, backgroundColor: '#000' },
  camMask: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oval: {
    width: 250,
    height: 320,
    borderRadius: 160,
    borderWidth: 2.5,
    borderColor: Palette.cream,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  foreheadCrosshair: {
    width: 24,
    height: 2,
    backgroundColor: Palette.cream,
    opacity: 0.7,
  },
  chinCrosshair: {
    width: 24,
    height: 2,
    backgroundColor: Palette.cream,
    opacity: 0.7,
  },
  camHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 16,
  },
  camHint: {
    color: Palette.white,
    fontSize: 12,
    fontWeight: '600',
  },
  camBar: {
    position: 'absolute',
    bottom: 32,
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  camIconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Palette.white,
  },
  resultHead: {
    backgroundColor: Palette.cream,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Palette.beige,
    borderWidth: 2,
    borderColor: Palette.primary,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigType: {
    fontSize: 26,
    fontWeight: '800',
    color: Palette.primary,
    marginTop: 2,
  },
  metaSub: {
    color: Palette.muted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  counterText: {
    color: Palette.primary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  blockTitle: {
    marginTop: 24,
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.ink,
  },
  blockSubtitle: {
    fontSize: 12,
    color: Palette.muted,
    marginBottom: 12,
    lineHeight: 16,
  },
  concernHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontWeight: '700',
    color: Palette.ink,
    fontSize: 15,
    marginBottom: 4,
  },
  cardCopy: {
    color: Palette.muted,
    lineHeight: 19,
    fontSize: 13,
  },
  expandedDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(89, 69, 54), 0.1)',
  },
  detailHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  detailCopy: {
    fontSize: 12,
    color: Palette.ink,
    lineHeight: 17,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  avoidChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.dangerSoft,
    borderColor: Palette.dangerBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  avoidText: {
    color: Palette.dangerText,
    fontWeight: '700',
    fontSize: 12,
  },
  routineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.cream,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54), 0.08)',
  },
  routineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineAm: { backgroundColor: Palette.primary },
  routinePm: { backgroundColor: Palette.primaryDeep },
  routineBadgeText: { color: Palette.white, fontWeight: '800', fontSize: 10 },
  routineStepNumber: { fontSize: 10, fontWeight: '700', color: Palette.muted },
  routineStepTitle: { fontSize: 14, fontWeight: '700', color: Palette.ink, marginTop: 1 },
  productRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.beige,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: Palette.white,
  },
  productImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: Palette.cream,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  productTitle: {
    flex: 1,
    fontWeight: '700',
    color: Palette.ink,
    fontSize: 14,
    marginRight: 8,
  },
  productSub: {
    color: Palette.primary,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 4,
  },
  productSnippet: {
    color: Palette.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  kitTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  kitTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.beige,
    backgroundColor: Palette.white,
  },
  kitTabActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  kitTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  kitTabTextActive: {
    color: Palette.white,
  },
  kitCard: {
    backgroundColor: Palette.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.beige,
    marginBottom: 20,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  kitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  kitBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  kitStepCount: {
    fontSize: 11,
    color: Palette.muted,
    fontWeight: '600',
  },
  kitCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.ink,
    marginBottom: 2,
  },
  kitTagline: {
    fontSize: 12,
    color: Palette.muted,
    lineHeight: 16,
  },
  kitPriceBox: {
    backgroundColor: Palette.cream,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54), 0.12)',
  },
  kitPriceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 0.5,
  },
  kitPriceVal: {
    fontSize: 16,
    fontWeight: '900',
    color: Palette.primaryDeep,
    marginTop: 1,
  },
  kitRationaleBox: {
    backgroundColor: Palette.cream,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Palette.primary,
  },
  rationaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rationaleTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rationaleText: {
    fontSize: 12,
    color: Palette.ink,
    lineHeight: 17,
  },
  kitProductsWrap: {
    gap: 10,
    marginBottom: 14,
  },
  kitProductItem: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FAFAF8',
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54), 0.08)',
  },
  kitProductThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Palette.cream,
  },
  kitProductStepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  kitProductStep: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.primary,
    textTransform: 'uppercase',
  },
  kitProductPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.ink,
  },
  kitProductName: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.ink,
    marginBottom: 1,
  },
  kitProductBrand: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.muted,
    marginBottom: 2,
  },
  kitProductBenefit: {
    fontSize: 11,
    color: Palette.muted,
  },
  kitConsultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.primary,
    backgroundColor: Palette.cream,
  },
  kitConsultBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
});

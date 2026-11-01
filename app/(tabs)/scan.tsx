import {
  Badge,
  BouncyPressable,
  ClinicalDisclaimer,
  GhostButton,
  LivePulseDot,
  OutlineButton,
  PrimaryButton,
  SoftCard,
  SweepingLaser,
  triggerHaptic,
} from '@/components/brand/ui';
import { Palette } from '@/constants/palette';
import { useSkin } from '@/context/SkinContext';
import { CATALOG, productFromBarcode } from '@/lib/catalog';
import { checkCompatibility, checkCustomIngredients } from '@/lib/engine';
import { ROUTES } from '@/lib/routes';
import type { CatalogProduct, CompatibilityResult } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ScanScreen() {
  const router = useRouter();
  const { profile } = useSkin();
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [unrecognizedBarcode, setUnrecognizedBarcode] = useState<string | null>(null);

  // Manual ingredient entry state
  const [showManualModal, setShowManualModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIngredients, setCustomIngredients] = useState('');

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
        <View style={styles.iconCircle}>
          <Ionicons name="barcode-outline" size={54} color={Palette.primary} />
        </View>
        <Text style={styles.title}>Camera Access Required</Text>
        <Text style={styles.copy}>
          DOC-N-CARE requires camera access to scan and decode product barcodes for dermatological ingredient analysis.
        </Text>
        <PrimaryButton label="Grant Camera Access" onPress={requestPermission} icon="camera" />
      </View>
    );
  }

  const onScan = ({ data }: BarcodeScanningResult) => {
    if (locked || !data) return;
    triggerHaptic();
    setLocked(true);
    setLoading(true);

    setTimeout(() => {
      const product = productFromBarcode(data);
      if (product) {
        setResult(checkCompatibility(product, profile));
        setUnrecognizedBarcode(null);
      } else {
        // Transparent communication: product barcode is not in verified database
        setResult(null);
        setUnrecognizedBarcode(data);
      }
      setLoading(false);
    }, 700);
  };

  const handleSelectFromCatalog = (product: CatalogProduct) => {
    setResult(checkCompatibility(product, profile));
    setUnrecognizedBarcode(null);
    setShowManualModal(false);
  };

  const handleAnalyzeCustom = () => {
    if (!customIngredients.trim()) return;
    const list = customIngredients
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const customResult = checkCustomIngredients(
      customName.trim() || 'Custom Formulation',
      'User Provided',
      list,
      profile
    );
    setResult(customResult);
    setShowManualModal(false);
    setUnrecognizedBarcode(null);
  };

  const reset = () => {
    setResult(null);
    setUnrecognizedBarcode(null);
    setLocked(false);
    setLoading(false);
    setShowManualModal(false);
    setCustomName('');
    setCustomIngredients('');
  };

  // 1. LOADING STATE
  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.radarPulse}>
          <ActivityIndicator size="large" color={Palette.primary} />
        </View>
        <Text style={styles.title}>Decoding Barcode & Ingredients</Text>
        <Text style={styles.copy}>
          {profile.lastScanAt
            ? `Cross-referencing ingredients against ${profile.skinType} skin profile…`
            : 'Evaluating dermatological safety profile…'}
        </Text>
      </View>
    );
  }

  // 2. UNRECOGNIZED BARCODE STATE (No fake data generated!)
  if (unrecognizedBarcode) {
    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.notFoundCard}>
          <View style={styles.warningCircle}>
            <Ionicons name="alert" size={32} color={Palette.warning} />
          </View>
          <Text style={styles.notFoundTitle}>Product Not Yet in Database</Text>
          <Text style={styles.barcodeTag}>Scanned Barcode: {unrecognizedBarcode}</Text>
          <Text style={styles.notFoundCopy}>
            To protect your skin, DOC-N-CARE never invents fake product details, prices, or claims. This barcode has not yet been cataloged in our verified ingredient registry.
          </Text>
        </View>

        <Text style={styles.sectionHeader}>Instant Verification Options</Text>

        <SoftCard style={{ marginBottom: 14 }}>
          <Text style={styles.optionHeading}>1. Paste or Type Ingredients</Text>
          <Text style={styles.optionCopy}>
            Have the bottle in your hand? Enter the ingredients to run an immediate clinical compatibility check.
          </Text>
          <View style={{ marginTop: 10 }}>
            <PrimaryButton
              label="Enter Ingredients Manually"
              icon="create-outline"
              onPress={() => setShowManualModal(true)}
            />
          </View>
        </SoftCard>

        <SoftCard style={{ marginBottom: 14 }}>
          <Text style={styles.optionHeading}>2. Select Verified Product from Catalog</Text>
          <Text style={styles.optionCopy}>
            Browse our list of verified dermatologist-tested formulas:
          </Text>
          <View style={{ marginTop: 10 }}>
            <OutlineButton
              label="Browse Verified Catalog"
              icon="search-outline"
              onPress={() => router.push('/(tabs)/explore')}
            />
          </View>
        </SoftCard>

        <GhostButton label="Scan Another Barcode" icon="scan" onPress={reset} />
      </ScrollView>
    );
  }

  // 3. MANUAL INGREDIENT ENTRY MODAL / VIEW
  if (showManualModal) {
    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Ingredient Safety Analyzer</Text>
          <Text style={styles.copy}>
            Enter ingredients separated by commas to evaluate barrier safety and comedogenic risk against your profile.
          </Text>
        </View>

        <Text style={styles.fieldLabel}>Product Name (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Daily Barrier Lotion"
          placeholderTextColor={Palette.muted}
          value={customName}
          onChangeText={setCustomName}
        />

        <Text style={styles.fieldLabel}>Ingredients List (INCI)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. Aqua, Glycerin, Niacinamide, Ceramide NP, Shea Butter, Fragrance..."
          placeholderTextColor={Palette.muted}
          value={customIngredients}
          onChangeText={setCustomIngredients}
          multiline
        />

        <View style={{ gap: 10, marginTop: 14 }}>
          <PrimaryButton
            label="Analyze Compatibility"
            icon="analytics"
            onPress={handleAnalyzeCustom}
            disabled={!customIngredients.trim()}
          />
          <GhostButton label="Cancel" onPress={() => setShowManualModal(false)} />
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Or pick from verified formulas:</Text>
        {CATALOG.slice(0, 4).map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.miniPickRow}
            onPress={() => handleSelectFromCatalog(p)}
          >
            <Text style={styles.miniPickName}>{p.name}</Text>
            <Text style={styles.miniPickBrand}>{p.brand}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // 4. DETAILED COMPATIBILITY RESULT SCREEN
  if (result) {
    const tone =
      result.verdict === 'compatible'
        ? Palette.success
        : result.verdict === 'caution'
          ? Palette.warning
          : Palette.danger;

    const toneBg =
      result.verdict === 'compatible'
        ? 'rgba(16, 185, 129, 0.1)'
        : result.verdict === 'caution'
          ? 'rgba(245, 158, 11, 0.1)'
          : Palette.dangerSoft;

    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Verdict Banner */}
        <View style={[styles.verdictCard, { borderColor: tone, backgroundColor: toneBg }]}>
          <View style={styles.verdictTopRow}>
            <View style={[styles.verdictPill, { backgroundColor: tone }]}>
              <Text style={styles.verdictPillText}>{result.verdict.toUpperCase()}</Text>
            </View>
            <Text style={[styles.scoreText, { color: tone }]}>{result.score}/100 Match</Text>
          </View>
          <Text style={styles.verdictHeadline}>{result.headline}</Text>

          {/* Metric breakdown badges */}
          <View style={styles.metricRow}>
            <Badge
              label={`Barrier: ${result.barrierSafety || 'Optimal'}`}
              variant={result.barrierSafety === 'High Risk' ? 'danger' : 'success'}
            />
            <Badge
              label={`Comedogenic: ${result.comedogenicRisk || 'Low'}`}
              variant={result.comedogenicRisk === 'High' ? 'danger' : 'default'}
            />
            <Badge
              label={profile.lastScanAt ? `${profile.skinType} Profile` : 'General Read'}
              variant="primary"
            />
          </View>
        </View>

        {/* Product Identity */}
        <View style={styles.productHead}>
          <Image source={{ uri: result.product.image }} style={styles.pImg} />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.pName}>{result.product.name}</Text>
            <Text style={styles.pBrand}>
              {result.product.brand} · {result.product.price}
            </Text>
            <Text style={styles.barcodeText}>Barcode: {result.product.barcode}</Text>
          </View>
        </View>

        {!profile.lastScanAt ? (
          <SoftCard style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Ionicons name="aperture" size={24} color={Palette.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.optionHeading}>Personalize this compatibility score</Text>
                <Text style={styles.optionCopy}>
                  Scan your face to test against your exact barrier resilience and sebum rate.
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <PrimaryButton
                label="Run Face Scan"
                icon="camera"
                onPress={() => router.push('/(tabs)/analyze')}
              />
            </View>
          </SoftCard>
        ) : null}

        {/* Why Recommended / Compatibility Rationale */}
        <Text style={styles.blockTitle}>Dermatological Rationale</Text>
        {result.reasons.map((line) => (
          <View key={line} style={styles.line}>
            <Ionicons name="checkmark-circle" size={18} color={Palette.success} style={{ marginTop: 2 }} />
            <Text style={styles.lineText}>{line}</Text>
          </View>
        ))}

        {/* Watch-Outs / Irritants */}
        {result.watchouts.length ? (
          <>
            <Text style={styles.blockTitle}>Watch-Outs & Potential Irritants</Text>
            {result.watchouts.map((line) => (
              <View key={line} style={styles.line}>
                <Ionicons name="alert-circle" size={18} color={Palette.danger} style={{ marginTop: 2 }} />
                <Text style={[styles.lineText, { color: Palette.dangerText }]}>{line}</Text>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.line}>
            <Ionicons name="shield-checkmark" size={18} color={Palette.success} style={{ marginTop: 2 }} />
            <Text style={styles.lineText}>
              No common high-hazard irritants or aggressive allergens detected for your skin profile.
            </Text>
          </View>
        )}

        {/* How to Use */}
        <Text style={styles.blockTitle}>How to Incorporate</Text>
        <SoftCard style={{ marginBottom: 12 }}>
          <Text style={styles.instructionText}>
            {result.usageAdvice || result.product.howToUse || 'Apply following cleansing and prior to heavier creams.'}
          </Text>
        </SoftCard>

        {/* Precautions */}
        <Text style={styles.blockTitle}>Clinical Precautions</Text>
        <SoftCard style={{ marginBottom: 12 }}>
          <Text style={styles.precautionText}>
            {result.precautions || result.product.precautions || 'Always patch test on your jawline for 24 hours prior to initial application.'}
          </Text>
        </SoftCard>

        {/* Complete INCI Ingredients Breakdown */}
        <Text style={styles.blockTitle}>
          Full Formula INCI ({result.product.ingredients.length} Ingredients)
        </Text>
        <View style={styles.ingredientsContainer}>
          {result.product.ingredients.map((item) => {
            const isRec = profile.recommendedIngredients.some((r) =>
              item.toLowerCase().includes(r.toLowerCase().split(' ')[0])
            );
            const isAvoid = profile.avoidIngredients.some((a) =>
              item.toLowerCase().includes(a.toLowerCase().split(' ')[0])
            );

            return (
              <View
                key={item}
                style={[
                  styles.ingredientChip,
                  isRec && styles.ingredientRec,
                  isAvoid && styles.ingredientAvoid,
                ]}
              >
                {isRec ? (
                  <Ionicons name="sparkles" size={12} color={Palette.primary} style={{ marginRight: 4 }} />
                ) : isAvoid ? (
                  <Ionicons name="alert-circle" size={12} color={Palette.dangerText} style={{ marginRight: 4 }} />
                ) : null}
                <Text
                  style={[
                    styles.ingredientChipText,
                    isRec && { color: Palette.primary, fontWeight: '700' },
                    isAvoid && { color: Palette.dangerText, fontWeight: '700' },
                  ]}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </View>

        <ClinicalDisclaimer compact />

        {/* Action Buttons */}
        <View style={{ gap: 12, marginTop: 16 }}>
          <PrimaryButton
            label="Ask AI Dermatologist About This Formula"
            icon="chatbubbles"
            onPress={() => router.push(ROUTES.dermatologist)}
          />
          <GhostButton label="Scan Another Product Barcode" icon="scan" onPress={reset} />
        </View>
      </ScrollView>
    );
  }

  // 5. CAMERA VIEWFINDER (SCANNING VIEW)
  return (
    <View style={styles.camPage}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={locked ? undefined : onScan}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr', 'code128'],
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          <SweepingLaser height={240} color={Palette.primary} />
        </View>
        <View style={styles.scanTextRow}>
          <LivePulseDot color={Palette.success} size={6} />
          <Text style={[styles.scanText, { marginLeft: 8 }]}>
            Align barcode within precision frame
          </Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.bottomHint}>
          {profile.lastScanAt
            ? `Evaluating for ${profile.skinType} skin (Barrier: ${profile.barrierStatus || 'Balanced'})`
            : 'Analyzing against universal dermatological safety criteria'}
        </Text>
        <BouncyPressable
          style={styles.manualEntryBtn}
          onPress={() => setShowManualModal(true)}
        >
          <Ionicons name="create-outline" size={16} color={Palette.primary} />
          <Text style={styles.manualEntryText}>Manual Ingredient Entry</Text>
        </BouncyPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Palette.ivory, padding: 20 },
  center: {
    flex: 1,
    backgroundColor: Palette.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  radarPulse: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  copy: {
    color: Palette.muted,
    textAlign: 'center',
    lineHeight: 21,
    fontSize: 14,
    marginBottom: 20,
  },
  notFoundCard: {
    backgroundColor: Palette.cream,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  warningCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.ink,
    marginBottom: 4,
    textAlign: 'center',
  },
  barcodeTag: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
    backgroundColor: Palette.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  notFoundCopy: {
    fontSize: 13,
    color: Palette.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.ink,
    marginBottom: 10,
  },
  optionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.ink,
    marginBottom: 4,
  },
  optionCopy: {
    fontSize: 12,
    color: Palette.muted,
    lineHeight: 17,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.ink,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: 6,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Palette.cream,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Palette.ink,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.12)',
    fontSize: 14,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  miniPickRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Palette.cream,
    borderRadius: 10,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniPickName: {
    fontWeight: '600',
    color: Palette.ink,
    fontSize: 13,
  },
  miniPickBrand: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  verdictCard: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  verdictTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verdictPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verdictPillText: {
    color: Palette.white,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
  },
  verdictHeadline: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.ink,
    lineHeight: 26,
    marginBottom: 10,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  productHead: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
    backgroundColor: Palette.cream,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.08)',
  },
  pImg: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: Palette.beige,
  },
  pName: {
    fontWeight: '800',
    color: Palette.ink,
    fontSize: 15,
    lineHeight: 20,
  },
  pBrand: {
    color: Palette.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  barcodeText: {
    color: Palette.muted,
    fontSize: 11,
    marginTop: 4,
  },
  blockTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontWeight: '800',
    fontSize: 16,
    color: Palette.ink,
  },
  line: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  lineText: {
    flex: 1,
    color: Palette.ink,
    lineHeight: 20,
    fontSize: 13,
  },
  instructionText: {
    color: Palette.ink,
    fontSize: 13,
    lineHeight: 19,
  },
  precautionText: {
    color: Palette.ink,
    fontSize: 13,
    lineHeight: 19,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cream,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  ingredientRec: {
    backgroundColor: 'rgba(89, 69, 54, 0.08)',
    borderColor: Palette.primary,
  },
  ingredientAvoid: {
    backgroundColor: Palette.dangerSoft,
    borderColor: Palette.dangerBorder,
  },
  ingredientChipText: {
    fontSize: 12,
    color: Palette.ink,
  },
  camPage: { flex: 1, backgroundColor: '#000' },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  frame: {
    width: width * 0.74,
    height: width * 0.5,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderColor: Palette.primary,
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  laserLine: {
    width: '90%',
    height: 2,
    backgroundColor: Palette.danger,
    opacity: 0.8,
  },
  scanTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: 'rgba(89, 69, 54, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  scanText: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBar: {
    backgroundColor: Palette.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  bottomHint: {
    fontSize: 12,
    color: Palette.muted,
    textAlign: 'center',
  },
  manualEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  manualEntryText: {
    color: Palette.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});

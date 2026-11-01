import {
  Badge,
  Chip,
  ClinicalDisclaimer,
  ConfidenceGauge,
  GhostButton,
  PrimaryButton,
  SoftCard,
} from '@/components/brand/ui';
import { Palette } from '@/constants/palette';
import { useShop } from '@/context/ShopContext';
import { useSkin } from '@/context/SkinContext';
import { productById, productsForSkin } from '@/lib/catalog';
import { ROUTES } from '@/lib/routes';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, patchProfile, resetChat } = useSkin();
  const { wishlist, savedKit, cartCount } = useShop();
  const savedProducts = wishlist.map((id) => productById(id)).filter(Boolean);
  const [name, setName] = useState(profile.name === 'there' ? '' : profile.name);
  const [age, setAge] = useState(profile.age);
  const [saving, setSaving] = useState(false);

  const products = productsForSkin(profile.skinType, profile.suggestedProductIds);
  const scanned = Boolean(profile.lastScanAt);

  const save = async () => {
    setSaving(true);
    await patchProfile({ name: name.trim() || 'there', age: age.trim() });
    setSaving(false);
    Alert.alert('Profile Updated', 'Your demographic and skin preferences have been saved locally.');
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear AI Dermatologist History',
      'Are you sure you want to delete your conversation history with the AI Dermatologist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear History',
          style: 'destructive',
          onPress: async () => {
            await resetChat();
            Alert.alert('History Cleared', 'Your AI chat transcript has been reset.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Profile Hero Card */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(name || 'D').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.heroBadgeRow}>
            <Text style={styles.kicker}>USER PROFILE</Text>
            {scanned ? (
              <Badge
                label={`Barrier: ${profile.barrierStatus || 'Balanced'}`}
                variant={profile.barrierStatus === 'Compromised' ? 'warning' : 'success'}
              />
            ) : null}
          </View>
          <Text style={styles.user}>{name || 'Skincare Member'}</Text>
          <Text style={styles.meta}>
            {scanned
              ? `${profile.skinType} Skin · ${profile.confidence}% Confidence`
              : 'No face scan completed yet'}
            {age ? ` · ${age} yrs` : ''}
          </Text>
        </View>
      </View>

      {/* 2. Personal Details Edit Section */}
      <View style={styles.block}>
        <Text style={styles.heading}>Personal Information</Text>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Alex"
          placeholderTextColor={Palette.muted}
        />

        <Text style={styles.label}>Age (Optional)</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="e.g. 26"
          keyboardType="number-pad"
          placeholderTextColor={Palette.muted}
        />

        <View style={{ marginTop: 6 }}>
          <PrimaryButton label="Save Profile Info" onPress={save} loading={saving} />
        </View>
      </View>

      {/* 3. Diagnostic Skin Map Summary */}
      <View style={styles.block}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.heading}>Clinical Skin Map</Text>
          {scanned ? (
            <Badge label="Verified Profile" variant="primary" />
          ) : (
            <Badge label="Pending Scan" variant="warning" />
          )}
        </View>

        {scanned ? (
          <SoftCard style={{ marginBottom: 12 }}>
            <View style={styles.skinMapTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.skinMapType}>{profile.skinType} Skin</Text>
                <Text style={styles.skinMapSub}>
                  Assessed via AI Camera & Bauman/AAD Intake
                </Text>
              </View>
              <ConfidenceGauge score={profile.confidence} size={54} />
            </View>

            <View style={styles.divider} />

            <Text style={styles.subLabel}>Target Concerns:</Text>
            <View style={styles.rowWrap}>
              {(profile.concerns.length ? profile.concerns : ['Balanced Homeostasis']).map(
                (item) => (
                  <Chip key={item} label={item} active />
                )
              )}
            </View>

            <Text style={[styles.subLabel, { marginTop: 10 }]}>Prioritize Actives:</Text>
            <Text style={styles.activeListText}>
              {profile.recommendedIngredients.slice(0, 4).join(' · ')}
            </Text>

            <Text style={[styles.subLabel, { marginTop: 10, color: Palette.dangerText }]}>
              Contraindicated / Skip:
            </Text>
            <Text style={[styles.activeListText, { color: Palette.dangerText }]}>
              {profile.avoidIngredients.slice(0, 3).join(' · ') || 'None flagged'}
            </Text>
          </SoftCard>
        ) : (
          <SoftCard style={{ marginBottom: 12 }}>
            <Text style={styles.emptyPrompt}>
              You have not yet completed a facial analysis. Scan your face to map your sebum rate, barrier resilience, and customized routine.
            </Text>
          </SoftCard>
        )}

        <GhostButton
          label={scanned ? 'Update Skin Map (Retake Scan)' : 'Start Facial Skin Analysis'}
          icon="aperture"
          onPress={() => router.push('/(tabs)/analyze')}
        />
      </View>

      {/* 4. Suggested Formulations */}
      <View style={styles.block}>
        <Text style={styles.heading}>Formulations Curated For You</Text>
        {products.slice(0, 3).map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productRow}
            onPress={() => router.push('/(tabs)/explore')}
            activeOpacity={0.85}
          >
            <Image source={{ uri: product.image }} style={styles.pImg} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pName}>{product.name}</Text>
              <Text style={styles.pBrand}>
                {product.brand} · <Text style={{ color: Palette.primary, fontWeight: '700' }}>{product.price}</Text>
              </Text>
              <Text style={styles.pBenefit} numberOfLines={1}>
                {product.benefits[0]}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Palette.primary} />
          </TouchableOpacity>
        ))}
      </View>

      {savedKit ? (
        <View style={styles.block}>
          <Text style={styles.heading}>Saved routine</Text>
          <SoftCard>
            <Badge label={savedKit.tierLabel} variant="primary" />
            <Text style={[styles.pName, { marginTop: 8 }]}>{savedKit.title}</Text>
            <Text style={styles.meta}>{savedKit.tagline} · {savedKit.totalPrice}</Text>
            <Text style={[styles.pBenefit, { marginTop: 8 }]}>
              {savedKit.products.map((p) => p.brand).join(' · ')}
            </Text>
          </SoftCard>
        </View>
      ) : null}

      {savedProducts.length ? (
        <View style={styles.block}>
          <Text style={styles.heading}>Wishlist · {cartCount} in bag</Text>
          {savedProducts.map((product) =>
            product ? (
              <TouchableOpacity
                key={product.id}
                style={styles.productRow}
                onPress={() => router.push('/(tabs)/explore')}
                activeOpacity={0.85}
              >
                <Image source={{ uri: product.image }} style={styles.pImg} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.pName}>{product.name}</Text>
                  <Text style={styles.pBrand}>{product.brand}</Text>
                </View>
              </TouchableOpacity>
            ) : null
          )}
        </View>
      ) : null}

      {/* 5. AI Dermatologist & Chat History */}
      <View style={styles.block}>
        <Text style={styles.heading}>AI Clinical Assistant</Text>
        <View style={styles.dermCard}>
          <View style={styles.dermAvatar}>
            <Ionicons name="pulse" size={24} color={Palette.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pName}>DOC-N-CARE AI Dermatologist</Text>
            <Text style={styles.meta}>
              Evidence-based routine questions, active conflicts, and safe home remedies.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.consultBtn}
            onPress={() => router.push(ROUTES.dermatologist)}
            activeOpacity={0.8}
          >
            <Text style={styles.consultText}>Consult</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleClearChat} style={styles.clearBtn} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={16} color={Palette.dangerText} />
          <Text style={styles.clearText}>Clear conversation history</Text>
        </TouchableOpacity>
      </View>

      {/* 6. Privacy & Device Storage Reassurance */}
      <View style={{ paddingHorizontal: 20 }}>
        <ClinicalDisclaimer />
        <View style={styles.privacyNote}>
          <Ionicons name="lock-closed-outline" size={16} color={Palette.muted} />
          <Text style={styles.privacyText}>
            Privacy Assurance: Your facial photographs, responses, and skincare logs are stored exclusively in local app storage on your device.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Palette.ivory },
  hero: {
    backgroundColor: Palette.cream,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Palette.beige,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Palette.white,
  },
  avatarText: {
    color: Palette.white,
    fontWeight: '800',
    fontSize: 26,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 1.1,
  },
  user: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.ink,
    letterSpacing: -0.2,
  },
  meta: {
    color: Palette.muted,
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
  },
  block: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.ink,
    marginBottom: 10,
  },
  label: {
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: 6,
    marginTop: 8,
    fontSize: 13,
  },
  input: {
    backgroundColor: Palette.cream,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Palette.ink,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.1)',
    marginBottom: 10,
  },
  skinMapTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skinMapType: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.ink,
  },
  skinMapSub: {
    fontSize: 12,
    color: Palette.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.beige,
    marginVertical: 12,
    opacity: 0.7,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.primary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  activeListText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.ink,
    lineHeight: 18,
  },
  emptyPrompt: {
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Palette.cream,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.08)',
  },
  pImg: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: Palette.beige,
  },
  pName: {
    fontWeight: '700',
    color: Palette.ink,
    fontSize: 14,
  },
  pBrand: {
    color: Palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  pBenefit: {
    color: Palette.primary,
    fontSize: 11,
    marginTop: 2,
  },
  dermCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Palette.beige,
    borderRadius: 16,
    padding: 14,
    backgroundColor: Palette.cream,
  },
  dermAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  consultText: {
    color: Palette.white,
    fontWeight: '700',
    fontSize: 13,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  clearText: {
    color: Palette.dangerText,
    fontSize: 13,
    fontWeight: '600',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  privacyText: {
    flex: 1,
    fontSize: 11,
    color: Palette.muted,
    lineHeight: 15,
  },
});

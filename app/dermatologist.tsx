import {
  BouncyPressable,
  ClinicalDisclaimer,
  LivePulseDot,
  triggerHaptic,
} from '@/components/brand/ui';
import { Palette } from '@/constants/palette';
import { useSkin } from '@/context/SkinContext';
import { dermatologistReply } from '@/lib/dermatologist';
import type { ChatMessage } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function DermatologistScreen() {
  const { profile, chat, setChat } = useSkin();
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Dynamic clinical starters tailored to the patient profile
  const starters = useMemo(() => {
    const list: string[] = [];
    if (profile.concerns.includes('Acne') || profile.skinType === 'Acne-Prone') {
      list.push('Safe evidence-based home remedy for a fresh breakout');
      list.push('How should I layer Salicylic Acid (BHA) in my routine?');
    }
    if (profile.concerns.includes('Dryness') || profile.skinType === 'Dry') {
      list.push('My skin feels tight after washing — how to restore my barrier?');
    }
    if (profile.concerns.includes('Dark spots')) {
      list.push('What is the clinical difference between PIE and PIH marks?');
      list.push('Which tyrosinase inhibitors are safest to fade dark marks?');
    }
    if (profile.skinType === 'Sensitive' || profile.barrierStatus === 'Compromised') {
      list.push('My skin is stinging — what is the 7-day barrier reset protocol?');
    }
    list.push('Can I combine Niacinamide with Vitamin C or Retinoids?');
    list.push('Which home remedies are actually safe vs dangerous DIY hacks?');
    return list.slice(0, 4);
  }, [profile.concerns, profile.skinType, profile.barrierStatus]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    triggerHaptic();

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    const pending = [...chat, userMsg];
    await setChat(pending);
    setDraft('');
    setIsTyping(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 40);

    // Realistic clinical response delay (600ms)
    setTimeout(async () => {
      const replyText = dermatologistReply(trimmed, profile, pending);
      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        createdAt: new Date().toISOString(),
      };
      await setChat([...pending, botMsg]);
      setIsTyping(false);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* Patient Profile Context Ribbon */}
      <View style={styles.contextRibbon}>
        <LivePulseDot color={profile.barrierStatus === 'Compromised' ? Palette.warning : Palette.success} size={7} />
        <Text style={[styles.contextText, { marginLeft: 6 }]}>
          {profile.lastScanAt
            ? `Active Patient: ${profile.skinType} Skin · Barrier: ${profile.barrierStatus || 'Balanced'}`
            : 'General Skincare Guidance · Complete Face Scan for Precision Advice'}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.thread}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.introHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="medical" size={20} color={Palette.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.introTitle}>DOC-N-CARE Clinical Assistant</Text>
              <Text style={styles.introSubtitle}>
                Evidence-grounded dermatology support (AAD, DermNet, PubMed)
              </Text>
            </View>
          </View>
          <ClinicalDisclaimer compact />
        </View>

        {/* Suggested Conversation Starters */}
        {!chat.length ? (
          <View style={styles.startersSection}>
            <Text style={styles.startersTitle}>Recommended Inquiries For Your Skin:</Text>
            {starters.map((item) => (
              <BouncyPressable
                key={item}
                style={styles.starterChip}
                onPress={() => send(item)}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={15} color={Palette.primary} />
                <Text style={styles.starterText}>{item}</Text>
              </BouncyPressable>
            ))}
          </View>
        ) : null}

        {/* Chat Thread */}
        {chat.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <View
              key={msg.id}
              style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.botWrapper]}
            >
              {!isUser ? (
                <View style={styles.botIcon}>
                  <Ionicons name="pulse" size={14} color={Palette.white} />
                </View>
              ) : null}
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                <Text
                  style={[
                    styles.bubbleText,
                    isUser ? styles.userBubbleText : styles.botBubbleText,
                  ]}
                  selectable
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Typing State */}
        {isTyping ? (
          <View style={[styles.bubbleWrapper, styles.botWrapper]}>
            <View style={styles.botIcon}>
              <Ionicons name="pulse" size={14} color={Palette.white} />
            </View>
            <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color={Palette.primary} />
              <Text style={styles.typingText}>Analyzing dermatological evidence…</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Composer Bar */}
      <View style={styles.composerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about breakouts, ingredients, home remedies…"
          placeholderTextColor={Palette.muted}
          value={draft}
          onChangeText={setDraft}
          multiline
          maxLength={600}
        />
        <BouncyPressable
          style={[styles.sendBtn, (!draft.trim() || isTyping) && styles.sendBtnDisabled]}
          onPress={() => send(draft)}
          disabled={!draft.trim() || isTyping}
        >
          <Ionicons name="arrow-up" size={20} color={Palette.white} />
        </BouncyPressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Palette.ivory },
  contextRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.cream,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.beige,
  },
  contextText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
    flex: 1,
  },
  thread: {
    padding: 16,
    paddingBottom: 28,
  },
  introCard: {
    backgroundColor: Palette.cream,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.1)',
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.ink,
  },
  introSubtitle: {
    fontSize: 12,
    color: Palette.muted,
    marginTop: 2,
  },
  startersSection: {
    marginBottom: 16,
  },
  startersTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  starterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.cream,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  starterText: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  botWrapper: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  botIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: Palette.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Palette.cream,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.08)',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 22,
  },
  userBubbleText: {
    color: Palette.white,
    fontWeight: '500',
  },
  botBubbleText: {
    color: Palette.ink,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  typingText: {
    fontSize: 12,
    color: Palette.primary,
    fontWeight: '600',
  },
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.beige,
    backgroundColor: Palette.white,
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: Palette.cream,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 11,
    color: Palette.ink,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(89, 69, 54, 0.1)',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});

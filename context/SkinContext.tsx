import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { DEFAULT_PROFILE } from '../lib/engine';
import type { ChatMessage, SkinProfile } from '../lib/types';

const PROFILE_FILE = 'docncare_profile.json';
const CHAT_FILE = 'docncare_chat.json';

type SkinContextValue = {
  profile: SkinProfile;
  ready: boolean;
  chat: ChatMessage[];
  saveProfile: (next: SkinProfile) => Promise<void>;
  patchProfile: (partial: Partial<SkinProfile>) => Promise<void>;
  toggleRoutineStep: (stepKey: string) => Promise<void>;
  setChat: (messages: ChatMessage[]) => Promise<void>;
  resetChat: () => Promise<void>;
};

const SkinContext = createContext<SkinContextValue | null>(null);

function getFilePath(filename: string): string | null {
  try {
    const dir = FileSystem.documentDirectory;
    if (!dir) return null;
    return dir.endsWith('/') ? `${dir}${filename}` : `${dir}/${filename}`;
  } catch {
    return null;
  }
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const path = getFilePath(filename);
    if (!path) return fallback;
    const info = await FileSystem.getInfoAsync(path);
    if (!info || !info.exists) return fallback;
    const raw = await FileSystem.readAsStringAsync(path);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(filename: string, value: unknown) {
  try {
    const path = getFilePath(filename);
    if (!path) return;
    await FileSystem.writeAsStringAsync(path, JSON.stringify(value));
  } catch {
    // Graceful fallback if storage write fails
  }
}

export function SkinProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SkinProfile>(DEFAULT_PROFILE);
  const [chat, setChatState] = useState<ChatMessage[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await readJson<SkinProfile>(PROFILE_FILE, DEFAULT_PROFILE);
        const storedChat = await readJson<ChatMessage[]>(CHAT_FILE, []);
        setProfile({ ...DEFAULT_PROFILE, ...stored });
        setChatState(storedChat);
      } catch {
        setProfile(DEFAULT_PROFILE);
        setChatState([]);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const saveProfile = useCallback(async (next: SkinProfile) => {
    setProfile(next);
    await writeJson(PROFILE_FILE, next);
  }, []);

  const patchProfile = useCallback(
    async (partial: Partial<SkinProfile>) => {
      const next = { ...profile, ...partial };
      setProfile(next);
      await writeJson(PROFILE_FILE, next);
    },
    [profile]
  );

  const toggleRoutineStep = useCallback(
    async (stepKey: string) => {
      const currentSteps = profile.completedRoutineSteps ?? [];
      const updated = currentSteps.includes(stepKey)
        ? currentSteps.filter((s) => s !== stepKey)
        : [...currentSteps, stepKey];
      const next = { ...profile, completedRoutineSteps: updated };
      setProfile(next);
      await writeJson(PROFILE_FILE, next);
    },
    [profile]
  );

  const setChat = useCallback(async (messages: ChatMessage[]) => {
    setChatState(messages);
    await writeJson(CHAT_FILE, messages);
  }, []);

  const resetChat = useCallback(async () => {
    setChatState([]);
    await writeJson(CHAT_FILE, []);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      ready,
      chat,
      saveProfile,
      patchProfile,
      toggleRoutineStep,
      setChat,
      resetChat,
    }),
    [profile, ready, chat, saveProfile, patchProfile, toggleRoutineStep, setChat, resetChat]
  );

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}

export function useSkin() {
  const ctx = useContext(SkinContext);
  if (!ctx) throw new Error('useSkin must be used inside SkinProvider');
  return ctx;
}

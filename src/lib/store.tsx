"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AccountState, UserProfile, Strategy, Plan, ContentItem, SavedIdea } from "./types";
import { isSupabaseConfigured } from "./supabase";

const STORAGE_KEY = "contentflow_account_v1";
const SESSION_KEY = "contentflow_session_v1";

const emptyAccount: AccountState = {
  profile: null,
  strategy: null,
  plan: null,
  savedIdeas: [],
  trialStartedAt: null,
  subscriptionStatus: "none",
};

interface Session {
  name: string;
  email: string;
}

interface Ctx {
  session: Session | null;
  account: AccountState;
  isDevMode: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  saveProfile: (p: UserProfile) => void;
  setStrategy: (s: Strategy) => void;
  setPlan: (p: Plan) => void;
  updateItem: (day: number, patch: Partial<ContentItem>) => void;
  toggleDone: (day: number) => void;
  saveIdea: (item: ContentItem) => void;
  removeIdea: (id: string) => void;
  startTrial: () => void;
  trialDaysLeft: () => number | null;
}

const AccountContext = createContext<Ctx | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [account, setAccount] = useState<AccountState>(emptyAccount);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      const a = localStorage.getItem(STORAGE_KEY);
      if (s) setSession(JSON.parse(s));
      if (a) setAccount(JSON.parse(a));
    } catch {
      // ignora storage indisponível (ex: modo privado)
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } catch {}
  }, [account, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(SESSION_KEY);
    } catch {}
  }, [session, hydrated]);

  const login = useCallback((email: string, name?: string) => {
    setSession({ email, name: name || email.split("@")[0] });
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const saveProfile = useCallback((p: UserProfile) => {
    setAccount((a) => ({ ...a, profile: p }));
  }, []);

  const setStrategy = useCallback((s: Strategy) => {
    setAccount((a) => ({ ...a, strategy: s }));
  }, []);

  const setPlan = useCallback((p: Plan) => {
    setAccount((a) => ({ ...a, plan: p }));
  }, []);

  const updateItem = useCallback((day: number, patch: Partial<ContentItem>) => {
    setAccount((a) => {
      if (!a.plan) return a;
      const items = a.plan.items.map((it) => (it.day === day ? { ...it, ...patch } : it));
      return { ...a, plan: { ...a.plan, items } };
    });
  }, []);

  const toggleDone = useCallback((day: number) => {
    setAccount((a) => {
      if (!a.plan) return a;
      const items = a.plan.items.map((it) =>
        it.day === day ? { ...it, status: it.status === "done" ? "todo" : "done" } : it
      );
      return { ...a, plan: { ...a.plan, items } } as AccountState;
    });
  }, []);

  const saveIdea = useCallback((item: ContentItem) => {
    setAccount((a) => ({
      ...a,
      savedIdeas: [
        { id: `${Date.now()}`, createdAt: new Date().toISOString(), item },
        ...a.savedIdeas,
      ],
    }));
  }, []);

  const removeIdea = useCallback((id: string) => {
    setAccount((a) => ({ ...a, savedIdeas: a.savedIdeas.filter((i) => i.id !== id) }));
  }, []);

  const startTrial = useCallback(() => {
    setAccount((a) => ({
      ...a,
      trialStartedAt: a.trialStartedAt || new Date().toISOString(),
      subscriptionStatus: "trial",
    }));
  }, []);

  const trialDaysLeft = useCallback((): number | null => {
    if (!account.trialStartedAt) return null;
    const started = new Date(account.trialStartedAt).getTime();
    const diffDays = (Date.now() - started) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(7 - diffDays));
  }, [account.trialStartedAt]);

  return (
    <AccountContext.Provider
      value={{
        session,
        account,
        isDevMode: !isSupabaseConfigured(),
        login,
        logout,
        saveProfile,
        setStrategy,
        setPlan,
        updateItem,
        toggleDone,
        saveIdea,
        removeIdea,
        startTrial,
        trialDaysLeft,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount deve ser usado dentro de <AccountProvider>");
  return ctx;
}

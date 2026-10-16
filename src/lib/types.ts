export type Platform = "instagram" | "tiktok" | "youtube" | "linkedin";

export interface UserProfile {
  name: string;
  profession: string;
  services: string;
  experience: string;
  story: string;
  goals: string;
  targetAudience: string;
  audienceProblems: string;
  communicationStyle: string;
  platforms: Platform[];
  recordingTime: string; // e.g. "15 minutos por dia"
  videoConfidence: string; // free text: "nunca gravei" ... "já tenho prática"
  topicsToAvoid: string;
}

export interface Strategy {
  promise: string;
  tone: string;
  pillars: { name: string; percentage: number; description: string }[];
  weekThemes: string[]; // 7 short day themes
}

export type ContentFormat = "video" | "carousel" | "story" | "post";

export interface ContentItem {
  day: number; // 1-7
  format: ContentFormat;
  theme: string;
  hook: string;
  script: string;
  example: string;
  conclusion: string;
  cta: string;
  durationSeconds: number;
  recordingInstructions: string;
  onScreenText: string;
  coverTitle: string;
  caption: string;
  status: "todo" | "done";
  isSample: boolean;
}

export interface Plan {
  id: string;
  createdAt: string;
  items: ContentItem[];
}

export interface SavedIdea {
  id: string;
  createdAt: string;
  item: ContentItem;
}

export interface AccountState {
  profile: UserProfile | null;
  strategy: Strategy | null;
  plan: Plan | null;
  savedIdeas: SavedIdea[];
  trialStartedAt: string | null;
  subscriptionStatus: "trial" | "active" | "expired" | "none";
}

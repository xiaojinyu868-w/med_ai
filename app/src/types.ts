export type Question = {
  id: string;
  title: string;
  options: string[];
  type: "single";
};

export type DwellTime = {
  questionId: string;
  value: string;
  dwellTimeMs: number;
};

export type NarrativeMaterial = {
  id: string;
  imageUrl: string;
  instruction: string;
  category: "negative" | "neutral" | "positive";
};

export type ChatMessage =
  | {
      id: string;
      role: "user" | "ai" | "system";
      type: "text";
      content: string;
    }
  | {
      id: string;
      role: "ai";
      type: "options";
      content: string;
      options: string[];
      disabled?: boolean;
    };

export type ReportData = {
  anxietyScore: number;
  authenticityScore: number;
  radar: { dimension: string; value: number }[];
  insights: string[];
  riskLabel?: string;
  summary?: string;
  confidence?: number;
};

export type AuthState = {
  token: string | null;
  user?: {
    id: string;
    name: string;
    role: "student" | "school_admin";
    school?: string;
    className?: string;
  };
};

export type PictureText = {
  imageId: string;
  category: "negative" | "neutral" | "positive";
  content: string;
};

export type ReadingPassage = { id: number; title: string; content: string };

export type InterviewQuestion = {
  id: number;
  category: "A" | "B" | "C";
  content: string;
};

export type InterviewAnswer = {
  questionId: number;
  category: "A" | "B" | "C";
  content: string;
};

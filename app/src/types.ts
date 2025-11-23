export type Question = {
  id: string;
  title: string;
  options: string[];
  type: 'single';
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
};

export type ChatMessage =
  | {
      id: string;
      role: 'user' | 'ai' | 'system';
      type: 'text';
      content: string;
    }
  | {
      id: string;
      role: 'ai';
      type: 'options';
      content: string;
      options: string[];
      disabled?: boolean;
    };

export type ReportData = {
  anxietyScore: number;
  authenticityScore: number;
  radar: { dimension: string; value: number }[];
  insights: string[];
};

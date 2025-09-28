export type LocalizedText = {
  en: string;
  ka: string;
  ru: string;
};

export type Category = {
  id: string;
  name: LocalizedText;
  jobCount?: number;
};

export type Job = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  createdAt: string;
  masterCount: number;
};

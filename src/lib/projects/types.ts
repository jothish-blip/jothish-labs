export interface Asset {
  name: string;
  type: string;
  url: string;
  isPrimary: boolean;
}

export interface ChecklistItem {
  control: string;
  status: string;
  note: string;
}

export interface TimelineEvent {
  title: string;
  desc: string;
  tag?: string;
}

export interface PlaybackRow {
  [key: string]: string;
}

export interface PlaybackStep {
  step: string;
  title: string;
  intent: string;
  query: string;
  delta: string;
  anomaly?: string;
  logs: string[];
  resultRows: PlaybackRow[];
  linkedControl: string;
}

export interface CaseData {
  id: string;
  category: string;
  title: string;
  status: string;
  riskScore: string;
  riskLevel: string;
  vulnerabilities: number;
  controlsFailed: number;
  description: string;
  investigationNotes: string;
  timeline?: TimelineEvent[];
  playback?: PlaybackStep[];
  checklist: ChecklistItem[];
  recommendations: string[];
  assets: Asset[];
}
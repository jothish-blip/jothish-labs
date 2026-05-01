export interface Asset {
  name: string;
  type: string; // 'pdf' | 'image'
  url: string;
  isPrimary: boolean;
}

export interface ChecklistItem {
  control: string;
  status: string; // 'Verified' | 'Failed'
  note: string;
}

export interface TimelineEvent {
  title: string;
  desc: string;
  tag: string;
}

export interface PlaybackRow {
  [key: string]: string | number;
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
  riskScore: number;    // Changed from string to number for logic operations
  riskLevel: string;
  vulnerabilities: number;
  failedControls: number; // Renamed from controlsFailed for clarity
  description: string;
  summary: string;      // Renamed from investigationNotes to align with data
  timeline?: TimelineEvent[];
  playback?: PlaybackStep[];
  checklist: ChecklistItem[];
  recommendations: string[];
  assets: Asset[];
}
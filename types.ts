export interface Task {
  id: string;
  text: string;
  isHeader?: boolean;
}

export interface DayPlan {
  day: number;
  title: string;
  pluginFocus: string;
  description: string;
  tasks: Task[];
}

export interface LessonPlan {
  week1: DayPlan[];
  week2: DayPlan[];
}

export interface FlashCard {
  id: string;
  term: string;
  definition: string;
  category: 'Plugin' | 'Concept' | 'Term';
}

export type AudioStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type Theme = 'dark' | 'light';

export type VoiceOption = 'Puck' | 'Kore' | 'Zephyr';

export const VOICES: Record<VoiceOption, { label: string; desc: string }> = {
  Puck: { label: 'Male American', desc: 'Deep & Authoritative' },
  Kore: { label: 'British Female', desc: 'Crisp & Professional' },
  Zephyr: { label: 'African American Female', desc: 'Warm & Engaging' }
};
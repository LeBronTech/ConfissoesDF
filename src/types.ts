export type DayOfWeek = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface DayInfo {
  id: DayOfWeek;
  label: string;
  shortLabel: string;
}

export const DAYS_LIST: DayInfo[] = [
  { id: 'segunda', label: 'Segunda-feira', shortLabel: 'Seg' },
  { id: 'terca', label: 'Terça-feira', shortLabel: 'Ter' },
  { id: 'quarta', label: 'Quarta-feira', shortLabel: 'Qua' },
  { id: 'quinta', label: 'Quinta-feira', shortLabel: 'Qui' },
  { id: 'sexta', label: 'Sexta-feira', shortLabel: 'Sex' },
  { id: 'sabado', label: 'Sábado', shortLabel: 'Sáb' },
  { id: 'domingo', label: 'Domingo', shortLabel: 'Dom' },
];

export interface ParishSchedule {
  days: DayOfWeek[];
  text: string;
}

export interface Parish {
  id: string;
  region: string;
  title: string;
  instagram: string;
  schedules: ParishSchedule[];
}

export interface DailyScheduleEntry {
  rawText: string;
  locationName: string;
  isChapel: boolean;
  timeDescription: string;
}

export interface DayScheduleGroup {
  day: DayOfWeek;
  dayLabel: string;
  shortLabel: string;
  entries: DailyScheduleEntry[];
}

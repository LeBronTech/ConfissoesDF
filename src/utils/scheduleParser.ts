import { Parish, DayOfWeek, DAYS_LIST, DayScheduleGroup, DailyScheduleEntry } from '../types';

export type PeriodFilter = 'Todos' | 'Manhã' | 'Tarde' | 'Noite';

export function matchesPeriod(scheduleText: string, period: PeriodFilter): boolean {
  if (period === 'Todos') return true;

  const text = scheduleText.toLowerCase();

  // Explicit keyword checks in text
  if (period === 'Manhã' && (text.includes('manhã') || text.includes('manha'))) return true;
  if (period === 'Tarde' && text.includes('tarde')) return true;
  if (period === 'Noite' && (text.includes('noite') || text.includes('noturno'))) return true;

  // Extract hours and minutes from formats like 08:00, 19:30, 18h, 9:30, 12h59, etc.
  const timeMatches = Array.from(text.matchAll(/\b([0-2]?\d)(?::([0-5]\d)|h([0-5]\d)?)?\b/g));
  const timeEntriesInMinutes: number[] = [];

  for (const match of timeMatches) {
    const hr = parseInt(match[1], 10);
    const minStr = match[2] || match[3] || '0';
    const min = parseInt(minStr, 10);
    const fullMatch = match[0];
    const matchIndex = match.index ?? 0;

    // Surrounding context check to prevent false positives like "40 min", "50 senhas", "100 senhas"
    const surrounding = text.substring(
      Math.max(0, matchIndex - 6),
      Math.min(text.length, matchIndex + fullMatch.length + 8)
    );

    if (
      surrounding.includes('min') ||
      surrounding.includes('senha') ||
      surrounding.includes('mês') ||
      surrounding.includes('mes') ||
      surrounding.includes('semana')
    ) {
      continue;
    }

    const isExplicitTimeFormat = fullMatch.includes(':') || fullMatch.includes('h');
    const isPlausibleHour = hr >= 5 && hr <= 23;

    if (isExplicitTimeFormat || isPlausibleHour) {
      timeEntriesInMinutes.push(hr * 60 + min);
    }
  }

  // If no explicit time could be parsed (e.g., "por agendamento"), don't filter it out
  if (timeEntriesInMinutes.length === 0) {
    return true;
  }

  // Period boundaries in minutes from midnight:
  // Manhã: 05:00 (300 min) a 12:59 (779 min) - até 12h59
  // Tarde: 13:00 (780 min) a 18:00 (1080 min) - até 18h
  // Noite: 18:00 (1080 min) a 23:59 (1439 min)
  return timeEntriesInMinutes.some((totalMin) => {
    if (period === 'Manhã') return totalMin >= 300 && totalMin < 780; // < 13:00 (até 12h59)
    if (period === 'Tarde') return totalMin >= 780 && totalMin <= 1080; // 13:00 até 18:00
    if (period === 'Noite') return totalMin >= 1080 && totalMin <= 1439; // >= 18:00
    return false;
  });
}

export function parseLocationAndText(rawText: string): { locationName: string; isChapel: boolean; timeDescription: string } {
  const text = rawText.trim();
  
  // Check if it's a chapel or community
  const isChapelMatch = text.match(/(Capela|Comunidade)\s+([^-\:]+)/i);
  let isChapel = false;
  let locationName = 'Matriz / Igreja Principal';
  let timeDescription = text;

  if (isChapelMatch) {
    isChapel = true;
    locationName = isChapelMatch[0].trim();
    
    // Remove location prefix if it's separated by '-' or ':' to get time details
    const parts = text.split(/[-–:]/);
    if (parts.length > 1) {
      // Rejoin remaining parts
      const remaining = parts.slice(1).join(':').trim();
      if (remaining) {
        timeDescription = remaining;
      }
    }
  }

  return {
    locationName,
    isChapel,
    timeDescription
  };
}

export function getParish7DaySchedule(parish: Parish): DayScheduleGroup[] {
  return DAYS_LIST.map((dayInfo) => {
    const matchedSchedules = parish.schedules.filter((s) => s.days.includes(dayInfo.id));
    
    const entries: DailyScheduleEntry[] = matchedSchedules.map((s) => {
      const parsed = parseLocationAndText(s.text);
      return {
        rawText: s.text,
        locationName: parsed.locationName,
        isChapel: parsed.isChapel,
        timeDescription: parsed.timeDescription,
      };
    });

    return {
      day: dayInfo.id,
      dayLabel: dayInfo.label,
      shortLabel: dayInfo.shortLabel,
      entries,
    };
  });
}

import { useState } from 'react';
import { Parish, DayOfWeek, DAYS_LIST } from '../types';
import { getParish7DaySchedule, PeriodFilter, matchesPeriod } from '../utils/scheduleParser';
import { Church, MapPin, Instagram, Heart, Share2, Check, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface ParishCardProps {
  key?: string;
  parish: Parish;
  selectedDay: DayOfWeek | 'Todos';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  periodFilter?: PeriodFilter;
}

export const ParishCard = ({
  parish,
  selectedDay,
  isFavorite,
  onToggleFavorite,
  periodFilter = 'Todos',
}: ParishCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);

  const daySchedules = getParish7DaySchedule(parish);

  // Calculate total chapels
  const chapelCount = parish.schedules.filter((s) =>
    s.text.toLowerCase().includes('capela') || s.text.toLowerCase().includes('comunidade')
  ).length;

  const handleShare = () => {
    const textToCopy = `*${parish.title}* (${parish.region})\n` +
      `Instagram: https://instagram.com/${parish.instagram.replace('@', '')}\n\n` +
      `*Horários de Confissão:*\n` +
      parish.schedules.map((s) => `• ${s.text}`).join('\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter day schedules if periodFilter is set
  const filteredDaySchedules = daySchedules.map((group) => {
    let filteredEntries = group.entries;
    if (periodFilter && periodFilter !== 'Todos') {
      filteredEntries = filteredEntries.filter((e) => matchesPeriod(e.rawText, periodFilter));
    }
    return {
      ...group,
      entries: filteredEntries,
    };
  });

  // Determine active day highlighting
  const activeDayIndex = selectedDay !== 'Todos' ? DAYS_LIST.findIndex((d) => d.id === selectedDay) : -1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                <MapPin className="w-3 h-3" />
                {parish.region}
              </span>
              {chapelCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <Church className="w-3 h-3 text-emerald-600" />
                  {chapelCount} {chapelCount === 1 ? 'Capela' : 'Capelas'}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
              {parish.title}
            </h3>

            {parish.instagram && (
              <a
                href={`https://instagram.com/${parish.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 hover:text-pink-700 hover:underline mt-1 transition-colors"
                title="Abrir no Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
                {parish.instagram}
              </a>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(parish.id)}
              className={`p-2 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              aria-label="Favoritar"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all relative"
              title="Copiar horários para compartilhar"
              aria-label="Compartilhar"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Block Breakdown */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Horários por Dia da Semana (7 Blocos)
            </span>
            <button
              onClick={() => setShowAllDays(!showAllDays)}
              className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
            >
              {showAllDays ? 'Ocultar dias sem horário' : 'Ver 7 dias completos'}
              {showAllDays ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* 7 Day Blocks Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {filteredDaySchedules.map((dayGroup) => {
              const isSelectedDay = selectedDay === dayGroup.day;
              const hasEntries = dayGroup.entries.length > 0;

              // If not showing all days and day has no entries and is not selected, skip
              if (!showAllDays && !hasEntries && !isSelectedDay && selectedDay !== 'Todos') {
                return null;
              }

              return (
                <div
                  key={dayGroup.day}
                  className={`p-3 rounded-xl transition-all text-xs border ${
                    isSelectedDay
                      ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                      : hasEntries
                      ? 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/60'
                      : 'bg-slate-50/30 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 ${
                        isSelectedDay ? 'text-blue-900' : 'text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          hasEntries
                            ? isSelectedDay
                              ? 'bg-blue-600 animate-pulse'
                              : 'bg-emerald-500'
                            : 'bg-slate-300'
                        }`}
                      />
                      {dayGroup.dayLabel}
                    </span>

                    {!hasEntries && (
                      <span className="text-[11px] text-slate-400 font-normal italic">
                        Sem confissão agendada
                      </span>
                    )}
                  </div>

                  {hasEntries && (
                    <div className="space-y-1.5 mt-1.5">
                      {dayGroup.entries.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col gap-0.5 bg-white p-2 rounded-lg border border-slate-200/60"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                                entry.isChapel
                                  ? 'bg-amber-50 text-amber-900 border border-amber-200/70'
                                  : 'bg-blue-50 text-blue-900 border border-blue-200/70'
                              }`}
                            >
                              {entry.isChapel ? '⛪ ' : '🏛️ '}
                              {entry.locationName}
                            </span>
                          </div>
                          <p className="text-slate-700 text-xs font-medium pl-1 leading-relaxed">
                            {entry.rawText}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Consulta atualizada • DF</span>
          {isFavorite && <span className="font-semibold text-rose-600">★ Salva em seus favoritos</span>}
        </div>
      </div>
    </div>
  );
};

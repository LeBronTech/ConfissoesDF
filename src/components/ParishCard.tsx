import { useState } from 'react';
import { Parish, DayOfWeek } from '../types';
import {
  getParish7DaySchedule,
  PeriodFilter,
  matchesPeriod,
  getCurrentDayOfWeek,
  reorderDaysWithTargetFirst,
} from '../utils/scheduleParser';
import {
  Church,
  MapPin,
  Instagram,
  Heart,
  Share2,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CalendarCheck,
} from 'lucide-react';

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
  const [showOtherDays, setShowOtherDays] = useState(false);

  const daySchedules = getParish7DaySchedule(parish);

  // Calculate total chapels
  const chapelCount = parish.schedules.filter((s) =>
    s.text.toLowerCase().includes('capela') || s.text.toLowerCase().includes('comunidade')
  ).length;

  const handleShare = () => {
    const textToCopy =
      `*${parish.title}* (${parish.region})\n` +
      `Instagram: https://instagram.com/${parish.instagram.replace('@', '')}\n\n` +
      `*Aviso:* Consulte a paróquia pelo WhatsApp, Instagram ou telefone para confirmar os horários.\n\n` +
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

  // Determine the target/corresponding day (selected day or today's day)
  const currentDayOfWeek = getCurrentDayOfWeek();
  const targetDay: DayOfWeek = selectedDay !== 'Todos' ? selectedDay : currentDayOfWeek;
  const isTodayTarget = targetDay === currentDayOfWeek;

  // Reorder so that the corresponding day is strictly the first one
  const orderedSchedules = reorderDaysWithTargetFirst(filteredDaySchedules, targetDay);
  const targetDayGroup = orderedSchedules[0];
  const otherDayGroups = orderedSchedules.slice(1);

  // Count how many of the other days have schedules
  const otherDaysWithSchedules = otherDayGroups.filter((g) => g.entries.length > 0);

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

      {/* Schedule Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Mandatory verification alert at the beginning of all blocks */}
          <div className="mb-4 p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-xl text-amber-900 text-xs flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Aviso importante:</span> Consulte a paróquia pelo WhatsApp, Instagram ou telefone para confirmar os horários.
            </div>
          </div>

          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Horário Correspondente:
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70">
              <CalendarCheck className="w-3 h-3" />
              {targetDayGroup.dayLabel} {isTodayTarget ? '(Hoje)' : ''}
            </span>
          </div>

          {/* Primary / Corresponding Day Block (Always First) */}
          <div className="space-y-2.5">
            <div
              className={`p-3 rounded-xl transition-all text-xs border ${
                targetDayGroup.entries.length > 0
                  ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-blue-900">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      targetDayGroup.entries.length > 0
                        ? 'bg-blue-600 animate-pulse'
                        : 'bg-slate-300'
                    }`}
                  />
                  {targetDayGroup.dayLabel}
                  {isTodayTarget && (
                    <span className="text-[10px] bg-blue-600 text-white font-semibold px-1.5 py-0.2 rounded-full normal-case">
                      Hoje
                    </span>
                  )}
                </span>

                {targetDayGroup.entries.length === 0 && (
                  <span className="text-[11px] text-slate-400 font-normal italic">
                    Sem confissão neste dia/período
                  </span>
                )}
              </div>

              {targetDayGroup.entries.length > 0 ? (
                <div className="space-y-1.5 mt-2">
                  {targetDayGroup.entries.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-0.5 bg-white p-2.5 rounded-lg border border-slate-200/70 shadow-2xs"
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
                      <p className="text-slate-800 text-xs font-medium pl-1 leading-relaxed">
                        {entry.rawText}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic mt-1">
                  Não há horários listados para este dia específico. Clique abaixo para consultar os outros dias da semana desta paróquia.
                </p>
              )}
            </div>

            {/* Other Days (Expanded when showOtherDays is true) */}
            {showOtherDays && (
              <div className="space-y-2 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Outros dias da semana:
                </span>
                {otherDayGroups.map((dayGroup) => {
                  const hasEntries = dayGroup.entries.length > 0;
                  return (
                    <div
                      key={dayGroup.day}
                      className={`p-2.5 rounded-xl transition-all text-xs border ${
                        hasEntries
                          ? 'bg-slate-50/90 border-slate-200'
                          : 'bg-slate-50/30 border-slate-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              hasEntries ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                          {dayGroup.dayLabel}
                        </span>
                        {!hasEntries && (
                          <span className="text-[10px] text-slate-400 italic">
                            Sem confissão
                          </span>
                        )}
                      </div>

                      {hasEntries && (
                        <div className="space-y-1 mt-1">
                          {dayGroup.entries.map((entry, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-2 rounded-lg border border-slate-200/60 text-xs"
                            >
                              <span className="font-semibold text-[10px] text-slate-600 block">
                                {entry.locationName}
                              </span>
                              <p className="text-slate-700 text-xs mt-0.5">{entry.rawText}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Button to Expand / Collapse Other Days */}
            <button
              onClick={() => setShowOtherDays(!showOtherDays)}
              className={`w-full mt-2 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                showOtherDays
                  ? 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-800 shadow-2xs'
              }`}
            >
              <span>
                {showOtherDays
                  ? 'Ocultar outros dias'
                  : otherDaysWithSchedules.length > 0
                  ? `Ver outros dias da semana (${otherDaysWithSchedules.length} com horários)`
                  : 'Ver outros dias da semana'}
              </span>
              {showOtherDays ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
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

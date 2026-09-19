import { useState } from 'react';
import { Parish, DAYS_LIST, DayOfWeek } from '../types';
import { getParish7DaySchedule, PeriodFilter, matchesPeriod, getCurrentDayOfWeek } from '../utils/scheduleParser';
import { Calendar, Church, MapPin, Instagram, Heart, Clock, AlertCircle } from 'lucide-react';

interface WeeklyScheduleGridProps {
  parishes: Parish[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  periodFilter?: PeriodFilter;
}

export const WeeklyScheduleGrid = ({
  parishes,
  favorites,
  onToggleFavorite,
  periodFilter = 'Todos',
}: WeeklyScheduleGridProps) => {
  const currentDayOfWeek = getCurrentDayOfWeek();
  const [activeDayTab, setActiveDayTab] = useState<DayOfWeek | 'todos'>('todos');

  // Compute entries per day across all filtered parishes
  const scheduleByDay = DAYS_LIST.map((dayInfo) => {
    const dayParishes = parishes
      .map((parish) => {
        const weeklySchedule = getParish7DaySchedule(parish);
        const dayGroup = weeklySchedule.find((d) => d.day === dayInfo.id);

        let entries = dayGroup ? dayGroup.entries : [];
        if (periodFilter && periodFilter !== 'Todos') {
          entries = entries.filter((e) => matchesPeriod(e.rawText, periodFilter));
        }

        return {
          parish,
          entries,
        };
      })
      .filter((item) => item.entries.length > 0);

    return {
      dayInfo,
      dayParishes,
      isToday: dayInfo.id === currentDayOfWeek,
    };
  });

  // Reorder so that today comes first when viewing all days
  const reorderedSchedule = [...scheduleByDay].sort((a, b) => {
    if (a.isToday) return -1;
    if (b.isToday) return 1;
    return 0;
  });

  const displayDays = activeDayTab === 'todos' 
    ? reorderedSchedule 
    : scheduleByDay.filter((s) => s.dayInfo.id === activeDayTab);

  return (
    <div className="space-y-6">
      {/* Day Filter Tabs for Grid View */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveDayTab('todos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeDayTab === 'todos'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Ver Todos os 7 Dias
        </button>

        {DAYS_LIST.map((day) => {
          const count = scheduleByDay.find((s) => s.dayInfo.id === day.id)?.dayParishes.length || 0;
          const isToday = day.id === currentDayOfWeek;
          return (
            <button
              key={day.id}
              onClick={() => setActiveDayTab(day.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeDayTab === day.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{day.label}</span>
              {isToday && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  activeDayTab === day.id ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'
                }`}>
                  Hoje
                </span>
              )}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeDayTab === day.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 7 Blocks Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayDays.map(({ dayInfo, dayParishes, isToday }) => (
          <div
            key={dayInfo.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col ${
              isToday ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200'
            }`}
          >
            {/* Block Day Title Header */}
            <div className={`p-4 flex items-center justify-between text-white ${
              isToday
                ? 'bg-gradient-to-r from-blue-800 to-indigo-800'
                : 'bg-gradient-to-r from-slate-900 to-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-300" />
                <h3 className="font-bold text-base tracking-tight">{dayInfo.label}</h3>
                {isToday && (
                  <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    HOJE
                  </span>
                )}
              </div>
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
                {dayParishes.length} {dayParishes.length === 1 ? 'locação' : 'locações'}
              </span>
            </div>

            {/* Mandatory Disclaimer phrase in all blocks at the start */}
            <div className="p-2.5 mx-3 mt-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-amber-900 text-[11px] flex items-start gap-1.5 leading-tight">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>Consulte a paróquia pelo WhatsApp, Instagram ou telefone para confirmar os horários.</span>
            </div>

            {/* Content List for this Day */}
            <div className="p-4 flex-1 divide-y divide-slate-100 space-y-3">
              {dayParishes.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  Nenhum horário de confissão neste dia para os filtros selecionados.
                </div>
              ) : (
                dayParishes.map(({ parish, entries }) => {
                  const isFav = favorites.includes(parish.id);

                  return (
                    <div key={parish.id} className="pt-3 first:pt-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                            {parish.region}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{parish.title}</h4>
                        </div>
                        <button
                          onClick={() => onToggleFavorite(parish.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="Favorito"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {parish.instagram && (
                        <a
                          href={`https://instagram.com/${parish.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-pink-600 hover:underline inline-flex items-center gap-1 mb-2"
                        >
                          <Instagram className="w-3 h-3" />
                          {parish.instagram}
                        </a>
                      )}

                      {/* Schedule entries for this day */}
                      <div className="space-y-1.5 mt-1">
                        {entries.map((entry, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg text-xs border ${
                              entry.isChapel
                                ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                                : 'bg-slate-50 border-slate-200/80 text-slate-800'
                            }`}
                          >
                            <div className="font-semibold text-[11px] mb-0.5 flex items-center gap-1">
                              {entry.isChapel ? (
                                <Church className="w-3 h-3 text-amber-600 shrink-0" />
                              ) : (
                                <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                              )}
                              <span>{entry.locationName}</span>
                            </div>
                            <p className="text-slate-700 font-medium pl-4">{entry.rawText}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

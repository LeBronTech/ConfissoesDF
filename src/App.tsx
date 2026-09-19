/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ParishCard } from './components/ParishCard';
import { WeeklyScheduleGrid } from './components/WeeklyScheduleGrid';
import { CityMultiSelect } from './components/CityMultiSelect';
import { parishData } from './data';
import { DayOfWeek, DAYS_LIST } from './types';
import {
  PeriodFilter,
  matchesPeriod,
  getCurrentDayOfWeek,
  getCurrentPeriod,
} from './utils/scheduleParser';
import {
  Church,
  Search,
  MapPin,
  Calendar,
  Filter,
  Heart,
  Grid,
  LayoutList,
  Sparkles,
  X,
  Info,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  const currentDayOfWeek = getCurrentDayOfWeek();
  const currentPeriod = getCurrentPeriod();

  const [search, setSearch] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  // Automatically pre-determine and select current day & period
  const [day, setDay] = useState<DayOfWeek | 'Todos'>(() => getCurrentDayOfWeek());
  const [period, setPeriod] = useState<PeriodFilter>(() => getCurrentPeriod());
  const [viewMode, setViewMode] = useState<'cards' | '7blocks'>('cards');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('parish_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('parish_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const cities = [...new Set(parishData.map((p) => p.region))].sort();

  // Total stats calculations
  const totalParishes = parishData.length;
  const totalCapelas = parishData.reduce((acc, p) => {
    const chapels = p.schedules.filter(
      (s) => s.text.toLowerCase().includes('capela') || s.text.toLowerCase().includes('comunidade')
    ).length;
    return acc + chapels;
  }, 0);

  // Filter parishes based on search, selected cities, day, period, and favorites
  const filteredParishes = parishData.filter((parish) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      parish.title.toLowerCase().includes(searchLower) ||
      parish.region.toLowerCase().includes(searchLower) ||
      parish.instagram.toLowerCase().includes(searchLower) ||
      parish.schedules.some((s) => s.text.toLowerCase().includes(searchLower));

    const matchesCity = selectedCities.length === 0 || selectedCities.includes(parish.region);

    const matchesDay =
      day === 'Todos' || parish.schedules.some((s) => s.days.includes(day));

    const matchesFavorites = !onlyFavorites || favorites.includes(parish.id);

    const matchesPeriodFilter =
      period === 'Todos' ||
      parish.schedules.some((s) => {
        const matchesDayCondition = day === 'Todos' || s.days.includes(day);
        return matchesDayCondition && matchesPeriod(s.text, period);
      });

    return (
      matchesSearch &&
      matchesCity &&
      matchesDay &&
      matchesPeriodFilter &&
      matchesFavorites
    );
  });

  const clearFilters = () => {
    setSearch('');
    setSelectedCities([]);
    setDay('Todos');
    setPeriod('Todos');
    setOnlyFavorites(false);
  };

  const hasActiveFilters =
    search !== '' ||
    selectedCities.length > 0 ||
    day !== 'Todos' ||
    period !== 'Todos' ||
    onlyFavorites;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased pb-16">
      {/* Top Banner & Header */}
      <header className="bg-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Church className="w-4 h-4 text-blue-400" />
            <span>Guia Oficial de Confissões - Arquidiocese de Brasília / DF</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Horários de Confissão no DF
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Consulte por dia da semana (7 blocos), cidades, períodos e paróquias em todo o Distrito Federal.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-xl text-slate-200 flex items-center gap-2 shadow-sm">
              <Church className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white">{totalParishes}</span> Paróquias Cadastradas
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-xl text-slate-200 flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">{totalCapelas}</span> Capelas & Comunidades
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-xl text-slate-200 flex items-center gap-2 shadow-sm">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">{cities.length}</span> Cidades do DF
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Filter Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 mb-8 backdrop-blur-sm">
          {/* Automatic Identification Banner */}
          <div className="mb-5 p-3 bg-blue-50/90 border border-blue-200/90 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs text-blue-950">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <div>
                <span className="font-bold">Dia e Período Identificados: </span>
                <span className="font-semibold text-blue-900">
                  {DAYS_LIST.find((d) => d.id === currentDayOfWeek)?.label} • {currentPeriod}
                </span>
                <span className="text-blue-700 ml-1.5 hidden md:inline font-normal">
                  (pré-selecionados automaticamente)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {(day !== currentDayOfWeek || period !== currentPeriod) && (
                <button
                  onClick={() => {
                    setDay(currentDayOfWeek);
                    setPeriod(currentPeriod);
                  }}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[11px] transition-all flex items-center gap-1 shadow-2xs"
                  title="Restaurar filtro para hoje e período atual"
                >
                  <RotateCcw className="w-3 h-3" />
                  Hoje & Agora
                </button>
              )}
              {(day !== 'Todos' || period !== 'Todos') && (
                <button
                  onClick={() => {
                    setDay('Todos');
                    setPeriod('Todos');
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold text-[11px] transition-all"
                  title="Ver todos os dias e períodos"
                >
                  Ver Todos os Dias
                </button>
              )}
            </div>
          </div>

          {/* Top Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                Pesquisar
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nome, capela, bairro ou horário..."
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Cidades Multi-Select */}
            <CityMultiSelect
              cities={cities}
              selectedCities={selectedCities}
              onChange={setSelectedCities}
            />

            {/* Day Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Dia da Semana
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek | 'Todos')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
              >
                <option value="Todos">Todos os 7 Dias</option>
                {DAYS_LIST.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label} {d.id === currentDayOfWeek ? '• (Hoje)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Period Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
              >
                <option value="Todos">Todos os Períodos</option>
                <option value="Manhã">
                  🌅 Manhã (até 12h59) {currentPeriod === 'Manhã' ? '• (Agora)' : ''}
                </option>
                <option value="Tarde">
                  ☀️ Tarde (13:00 - 18:00) {currentPeriod === 'Tarde' ? '• (Agora)' : ''}
                </option>
                <option value="Noite">
                  🌙 Noite (a partir das 18:00) {currentPeriod === 'Noite' ? '• (Agora)' : ''}
                </option>
              </select>
            </div>
          </div>

          {/* Day & Period Pills Bar for Quick Filtering */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline-block">
                  Dia:
                </span>
                <button
                  onClick={() => setDay('Todos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    day === 'Todos'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Todos
                </button>
                {DAYS_LIST.map((d) => {
                  const isCurrent = d.id === currentDayOfWeek;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDay(d.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                        day === d.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{d.shortLabel}</span>
                      {isCurrent && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            day === d.id ? 'bg-amber-300' : 'bg-blue-600'
                          }`}
                          title="Hoje"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="h-4 w-px bg-slate-200 mx-1 hidden md:block" />

              {/* Quick Period Pills */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline-block">
                  Período:
                </span>
                {(['Todos', 'Manhã', 'Tarde', 'Noite'] as PeriodFilter[]).map((p) => {
                  const isCurrent = p === currentPeriod;
                  return (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                        period === p
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{p === 'Todos' ? 'Qualquer' : p}</span>
                      {isCurrent && p !== 'Todos' && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            period === p ? 'bg-amber-300' : 'bg-indigo-600'
                          }`}
                          title="Agora"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extra Controls (Favorites & View Mode) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  onlyFavorites
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>Favoritas ({favorites.length})</span>
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'cards'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Visão por Cartão Paroquial"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('7blocks')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === '7blocks'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Visão em Grade de 7 Blocos Diários"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 underline flex items-center gap-1"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info & Active Filters Badge Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {filteredParishes.length} {filteredParishes.length === 1 ? 'Paróquia Encontrada' : 'Paróquias Encontradas'}
            </h2>
            {hasActiveFilters && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-semibold">
                Filtros ativos
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            {viewMode === 'cards' ? 'Exibindo cartões com blocos diários' : 'Exibindo grade semanal em 7 blocos'}
          </div>
        </div>

        {/* Global Guidance Notice */}
        <div className="mb-6 p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-start sm:items-center gap-3 text-amber-950 text-xs sm:text-sm font-medium shadow-2xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="font-bold">Aviso importante:</strong> Consulte a paróquia pelo WhatsApp, Instagram ou telefone para confirmar os horários antes de se deslocar.
          </p>
        </div>

        {/* Dynamic Display based on View Mode */}
        {filteredParishes.length > 0 ? (
          viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredParishes.map((parish) => (
                <ParishCard
                  key={parish.id}
                  parish={parish}
                  selectedDay={day}
                  isFavorite={favorites.includes(parish.id)}
                  onToggleFavorite={toggleFavorite}
                  periodFilter={period}
                />
              ))}
            </div>
          ) : (
            <WeeklyScheduleGrid
              parishes={filteredParishes}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              periodFilter={period}
            />
          )
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm my-8">
            <Church className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhuma paróquia encontrada</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Não encontramos confissões para a combinação de filtros selecionada (
              <span className="font-semibold">{DAYS_LIST.find((d) => d.id === day)?.label || 'Todos'}</span> •{' '}
              <span className="font-semibold">{period}</span>).
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  setDay('Todos');
                  setPeriod('Todos');
                }}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition shadow-sm"
              >
                Ver Todos os Dias e Horários
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 transition border border-slate-200"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Horários de Confissão - Distrito Federal (DF). Todos os direitos reservados.</p>
        <p className="mt-1 text-slate-400">Desenvolvido com design inclusivo para facilitar o acesso aos sacramentos na Arquidiocese de Brasília.</p>
      </footer>
    </div>
  );
}

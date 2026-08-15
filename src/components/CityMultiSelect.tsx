import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, X } from 'lucide-react';

interface CityMultiSelectProps {
  cities: string[];
  selectedCities: string[];
  onChange: (cities: string[]) => void;
}

export function CityMultiSelect({ cities, selectedCities, onChange }: CityMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      onChange(selectedCities.filter((c) => c !== city));
    } else {
      onChange([...selectedCities, city]);
    }
  };

  const selectAll = () => {
    onChange([]);
  };

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayText = () => {
    if (selectedCities.length === 0) {
      return `Todas as ${cities.length} Cidades`;
    }
    if (selectedCities.length === 1) {
      return selectedCities[0];
    }
    return `${selectedCities.length} cidades selecionadas`;
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          Cidades
        </span>
        {selectedCities.length > 0 && (
          <button
            type="button"
            onClick={selectAll}
            className="text-[10px] text-blue-600 hover:underline font-semibold capitalize"
          >
            Limpar ({selectedCities.length})
          </button>
        )}
      </label>

      {/* Control Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 text-left flex items-center justify-between transition-all ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white'
            : selectedCities.length > 0
            ? 'border-blue-300 bg-blue-50/50 text-blue-900'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="truncate pr-2 font-medium">
          {getDisplayText()}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[260px] bg-white border border-slate-200 rounded-xl shadow-2xl p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-100">
          {/* Internal Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar cidade..."
            className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />

          {/* Quick Actions */}
          <div className="flex items-center justify-between text-xs px-1 text-slate-500 border-b border-slate-100 pb-1.5">
            <button
              type="button"
              onClick={selectAll}
              className={`hover:text-blue-600 font-semibold ${selectedCities.length === 0 ? 'text-blue-600' : ''}`}
            >
              Todas
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => onChange([...cities])}
              className="hover:text-blue-600"
            >
              Marcar Todas
            </button>
          </div>

          {/* City List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1 text-xs">
            {filteredCities.map((city) => {
              const isSelected = selectedCities.includes(city);
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggleCity(city)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 font-semibold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">{city}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
            {filteredCities.length === 0 && (
              <p className="text-center py-3 text-slate-400 text-xs">Nenhuma cidade encontrada</p>
            )}
          </div>
        </div>
      )}

      {/* Selected Cities Badges / Tags below selector */}
      {selectedCities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedCities.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100/80 text-blue-900 rounded-md text-[11px] font-semibold border border-blue-200"
            >
              <span className="truncate max-w-[120px]">{c}</span>
              <button
                type="button"
                onClick={() => toggleCity(c)}
                className="text-blue-700 hover:text-blue-900 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

import { usePokemonTypes } from '@/hooks/usePokemon';
import { useState, useEffect } from 'react';

interface SearchFormProps {
  selectedType: string;
  searchTerm: string;
  onTypeChange: (type: string) => void;
  onSearchChange: (term: string) => void;
  showButton?: boolean;
}

export const SearchForm = ({
  selectedType,
  searchTerm,
  onTypeChange,
  onSearchChange,
  showButton = false,
}: SearchFormProps) => {
  const { types, loading } = usePokemonTypes();
  const [inputValue, setInputValue] = useState(searchTerm);
  const [selectValue, setSelectValue] = useState(selectedType);

  useEffect(() => { setInputValue(searchTerm); }, [searchTerm]);
  useEffect(() => { setSelectValue(selectedType); }, [selectedType]);

  const handleSearch = () => {
    onTypeChange(selectValue);
    onSearchChange(inputValue);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-col gap-4 items-start">
        <select
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[50%]"
          disabled={loading}
        >
          <option value="" disabled hidden>
            Select
          </option>
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type.name} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[75%] flex">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-2 py-2 border border-r-0 rounded-l-lg rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12"
          />
          {showButton && (
            <button
              type="button"
              className="bg-[#133a50] text-white px-6 h-12 rounded-r-lg rounded-l-none font-medium hover:bg-blue-700 transition-colors min-w-[100px] border border-l-0 border-[#133a50]"
              tabIndex={-1}
              onClick={handleSearch}
            >
              Search
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 
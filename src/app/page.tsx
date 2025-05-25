'use client';

import { useState } from 'react';
import { SearchForm } from '@/components/molecules/SearchForm';
import { PokemonCard } from '@/components/atoms/PokemonCard';
import { usePokemonList } from '@/hooks/usePokemon';

export default function Home() {
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { pokemon, loading, error, hasMore, loadMore, loadingMore } = usePokemonList(selectedType, searchTerm);

  return (
    <main className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <SearchForm
            selectedType={selectedType}
            searchTerm={searchTerm}
            onTypeChange={setSelectedType}
            onSearchChange={setSearchTerm}
            showButton
          />
        </div>
        {loading && (
          <div className="text-center py-8">
            <span className="inline-block w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></span>
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 py-8">{error}</div>
        )}
        {!loading && !error && pokemon.length === 0 && (
          <div className="text-center text-gray-500 text-lg mt-12">
            Looks like that Pokemon&apos;s not in our Pokedex yet!
          </div>
        )}
        {!loading && !error && pokemon.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {pokemon.map((pokemon, idx) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} priority={idx === 0} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors min-w-[140px] flex items-center justify-center"
                >
                  {loadingMore ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

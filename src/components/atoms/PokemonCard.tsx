import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pokemon } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  priority?: boolean;
}

export const PokemonCard = ({ pokemon, priority = false }: PokemonCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDetailsClick = () => {
    setLoading(true);
    router.push(`/pokemon/${pokemon.name}`);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-between min-h-[270px]">
      <div className="w-full flex-1 flex flex-col items-center">
        <div className="relative w-28 h-28 mb-2">
          {pokemon.sprites.other['official-artwork'].front_default?.length ? (
            <Image
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <h3 className="text-center text-lg font-semibold capitalize mb-4 text-[#133a50]">
          {pokemon.name}
        </h3>
      </div>
      <button
        onClick={handleDetailsClick}
        className="text-[#4088b5] font-medium hover:underline mt-2 flex items-center justify-center min-h-[28px]"
        disabled={loading}
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-[#4088b5] border-t-transparent rounded-full animate-spin"></span>
        ) : (
          'Details →'
        )}
      </button>
    </div>
  );
}; 
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPokemonDetails, getPokemonMoves } from '@/services/pokemonService';

export default async function PokemonDetail({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  let pokemon;
  try {
    pokemon = await getPokemonDetails(name);
  } catch (err: any) {
    if (err.response && err.response.status === 404) {
      notFound();
    }
    throw err;
  }
  const moves = await getPokemonMoves(name);

  if (!pokemon) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto px-4">
        <Link href="/" className="text-[#60e2c9] font-medium hover:underline mb-6 inline-block">&lt; Back</Link>
        <div className="flex justify-center items-center mt-4">
          <div className="bg-[#60e2c9] rounded-xl flex flex-col items-center p-0 w-full max-w-md">
            <div className="relative w-100 h-100 mb-4">
              <Image
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                fill
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-contain"
                priority
              />
            </div>
            <div className="bg-[#fcc666] p-4 w-full mt-2">
              <div className="mb-2"><span className="font-bold">Name:</span> {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
              <div className="mb-2"><span className="font-bold">Type:</span> {pokemon.types.map((t: any) => t.type.name).join(', ')}</div>
              <div className="mb-2"><span className="font-bold">Stats:</span> {pokemon.stats.map((s: any) => s.stat.name).join(', ')}</div>
              <div className="mb-2"><span className="font-bold">Abilities:</span> {pokemon.abilities.map((a: any) => a.ability.name).join(', ')}</div>
              <div className="mb-2"><span className="font-bold">Some Moves:</span> {moves.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
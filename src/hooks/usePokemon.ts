import { useState, useEffect, useRef } from 'react';
import { Pokemon, PokemonType } from '@/types/pokemon';
import {
  getPokemonTypes,
  getPokemonList,
  getPokemonByType,
  getPokemonDetails,
  getAllPokemonList,
} from '@/services/pokemonService';

const SPRITE_BASE_URL = process.env.POKEMON_SPRITE_BASE_URL || 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail';

export const usePokemonTypes = () => {
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getPokemonTypes();
        setTypes(types);
      } catch (err) {
        setError('Failed to fetch Pokemon types');
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  return { types, loading, error };
};

const getIdFromUrl = (url: string) => {
  const parts = url.split('/').filter(Boolean);
  const id = parts[parts.length - 1];
  if (!id) return '';
  if (parseInt(id, 10) > 999) return id;
  return id.padStart(3, '0');
};

export const usePokemonList = (type: string = '', search: string = '') => {
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const allPokemonList = useRef<any[] | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        if (search) {
          if (!allPokemonList.current) {
            const data = await getAllPokemonList();
            allPokemonList.current = data.results;
          }
          let matches = (allPokemonList.current || []).filter((p: any) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
          if (type) {
            const detailedMatches = await Promise.all(
              matches.map(async (p: any) => {
                try {
                  const details = await getPokemonDetails(p.name);
                  return details.types.some((t: any) => t.type.name === type)
                    ? {
                        id: details.id,
                        name: details.name,
                        sprites: details.sprites,
                        types: details.types,
                      }
                    : null;
                } catch {
                  return null;
                }
              })
            );
            matches = detailedMatches.filter(Boolean);
            setPokemon(matches);
            setNext(null);
            return;
          }
          const pokemonData = matches.map((p: any) => {
            const id = p.url ? getIdFromUrl(p.url) : p.name;
            return {
              id,
              name: p.name,
              sprites: {
                other: {
                  'official-artwork': {
                    front_default: `${SPRITE_BASE_URL}/${id}.png`,
                  },
                },
              },
              types: [],
            };
          });
          setPokemon(pokemonData);
          setNext(null);
          return;
        }
        let list: any[] = [];
        let nextUrl: string | null = null;
        if (type) {
          const pokemonList = await getPokemonByType(type);
          list = pokemonList;
          nextUrl = null;
        } else {
          const data = await getPokemonList();
          list = data.results;
          nextUrl = data.next;
        }
        const pokemonData = list.map((p: any) => {
          const id = p.url ? getIdFromUrl(p.url) : p.name;
          return {
            id,
            name: p.name,
            sprites: {
              other: {
                'official-artwork': {
                  front_default: `${SPRITE_BASE_URL}/${id}.png`,
                },
              },
            },
            types: [],
          };
        });
        setPokemon(pokemonData);
        setNext(nextUrl);
      } catch (err) {
        setError('Failed to fetch Pokemon');
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [type, search]);

  const loadMore = async () => {
    if (!next) return;
    setLoadingMore(true);
    try {
      const data = await getPokemonList(next);
      const newPokemon = data.results.map((p: any) => {
        const id = p.url ? getIdFromUrl(p.url) : p.name;
        return {
          id,
          name: p.name,
          sprites: {
            other: {
              'official-artwork': {
                front_default: `${SPRITE_BASE_URL}/${id}.png`,
              },
            },
          },
          types: [],
        };
      });
      setPokemon((prev) => [...prev, ...newPokemon]);
      setNext(data.next);
    } catch (err) {
      setError('Failed to load more Pokemon');
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    pokemon,
    loading,
    error,
    hasMore: !search && !!next,
    loadMore,
    loadingMore,
  };
}; 
import { api } from './api';

export const getPokemonTypes = async () => {
  const { data } = await api.get('/type');
  return data.results;
};

export const getAllPokemonList = async () => {
  const { data } = await api.get(`/pokemon?limit=100000`);
  return data;
};

export const getPokemonList = async (url?: string) => {
  const { data } = await api.get(url || `/pokemon?limit=151`);
  return data;
};

export const getPokemonByType = async (type: string) => {
  const { data } = await api.get(`/type/${type}`);
  return data.pokemon.map((p: any) => ({
    name: p.pokemon.name,
    url: p.pokemon.url,
  }));
};

export const getPokemonDetails = async (name: string) => {
  const { data } = await api.get(`/pokemon/${name}`);
  return data;
};

export const getPokemonMoves = async (name: string, count = 6) => {
  const { data } = await api.get(`/pokemon/${name}`);
  return data.moves.slice(0, count).map((m: any) => m.move.name.replace('-', ' '));
}; 
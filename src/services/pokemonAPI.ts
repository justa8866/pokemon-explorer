export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    back_default?: string;
    front_shiny?: string;
    back_shiny?: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      home: {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
      url: string;
    };
  }>;
  height: number;
  weight: number;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  species: {
    url: string;
  };
}

export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonSpecies {
  evolution_chain: {
    url: string;
  };
}

export interface Evolution {
  id: number;
  name: string;
  sprite: string;
}

interface TypePokemonEntry {
  pokemon: {
    name: string;
    url: string;
  };
}

interface TypeApiResponse {
  pokemon: TypePokemonEntry[];
}

interface EvolutionChainData {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainData[];
}

interface EvolutionChainResponse {
  chain: EvolutionChainData;
}

export const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
} as const;

export class PokemonAPI {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private cache = new Map<string, unknown>();

  private async fetchWithCache<T>(url: string): Promise<T> {
    if (this.cache.has(url)) {
      return this.cache.get(url) as T;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as T;
      this.cache.set(url, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  async getPokemonList(limit: number = 24, offset: number = 0): Promise<PokemonListResponse> {
    const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;
    return this.fetchWithCache<PokemonListResponse>(url);
  }

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const url = `${this.baseUrl}/pokemon/${nameOrId}`;
    return this.fetchWithCache<Pokemon>(url);
  }

  async getPokemonTypes(): Promise<PokemonType[]> {
    const url = `${this.baseUrl}/type`;
    const response = await this.fetchWithCache<{results: PokemonType[]}>(url);
    return response.results.filter(type => 
      !['unknown', 'shadow'].includes(type.name)
    );
  }

  async getPokemonByType(typeName: string): Promise<Pokemon[]> {
    const url = `${this.baseUrl}/type/${typeName}`;
    const typeData = await this.fetchWithCache<TypeApiResponse>(url);
    
    const pokemonPromises = typeData.pokemon
      .slice(0, 100)
      .map((entry) => this.getPokemon(entry.pokemon.name));
    
    return Promise.all(pokemonPromises);
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      const pokemon = await this.getPokemon(query.toLowerCase());
      return [pokemon];
    } catch {
      return [];
    }
  }

  async getPokemonSpecies(pokemonId: number): Promise<PokemonSpecies> {
    const url = `${this.baseUrl}/pokemon-species/${pokemonId}`;
    return this.fetchWithCache<PokemonSpecies>(url);
  }

  async getEvolutionChain(evolutionChainUrl: string): Promise<Evolution[]> {
    const response = await this.fetchWithCache<EvolutionChainResponse>(evolutionChainUrl);
    const evolutions: Evolution[] = [];

    const extractEvolutions = async (chainData: EvolutionChainData): Promise<void> => {
      if (chainData.species) {
        try {
          const pokemon = await this.getPokemon(chainData.species.name);
          evolutions.push({
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || ''
          });
        } catch (error) {
          console.error(`Error fetching evolution ${chainData.species.name}:`, error);
        }
      }

      if (chainData.evolves_to && chainData.evolves_to.length > 0) {
        for (const evolution of chainData.evolves_to) {
          await extractEvolutions(evolution);
        }
      }
    };

    await extractEvolutions(response.chain);
    return evolutions;
  }

  getPokemonIdFromUrl(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1]) : 0;
  }

  getTypeColor(type: string): string {
    return typeColors[type as keyof typeof typeColors] || '#68A090';
  }

  getTypeGradient(types: string[]): string {
    if (types.length === 1) {
      return this.getTypeColor(types[0]);
    }
    
    const colors = types.map(type => this.getTypeColor(type));
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  }
}

import { useState, useEffect, useCallback } from 'react';
import type { Pokemon, PokemonType, Evolution } from './services/pokemonAPI';
import { PokemonAPI, typeColors } from './services/pokemonAPI';
import { PokemonCard } from './components/PokemonCard';
import { TypePill } from './components/TypePill';
import { SearchBar } from './components/SearchBar';
import { PokemonModal } from './components/PokemonModal';
import { Loader2 } from 'lucide-react';
import './App.css';

const pokemonAPI = new PokemonAPI();

function App() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [displayCount, setDisplayCount] = useState(24);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showFavorites, setShowFavorites] = useState(false);

  const POKEMON_PER_PAGE = 24;

  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [pokemonTypes, pokemonListResponse] = await Promise.all([
          pokemonAPI.getPokemonTypes(),
          pokemonAPI.getPokemonList(POKEMON_PER_PAGE, 0)
        ]);

        setTypes(pokemonTypes);

        const pokemonDetails = await Promise.all(
          pokemonListResponse.results.map(pokemon => 
            pokemonAPI.getPokemon(pokemon.name)
          )
        );

        setAllPokemon(pokemonDetails);
        setCurrentOffset(POKEMON_PER_PAGE);
        setHasMore(pokemonListResponse.next !== null);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const filterPokemon = useCallback(() => {
    let filtered = allPokemon;

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(type =>
          selectedTypes.includes(type.type.name)
        )
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query) ||
        pokemon.id.toString().includes(query)
      );
    }

    if (showFavorites) {
      filtered = filtered.filter(pokemon => favorites.has(pokemon.id));
    }

    setFilteredPokemon(filtered);
  }, [allPokemon, selectedTypes, searchQuery, showFavorites, favorites]);

  useEffect(() => {
    filterPokemon();
  }, [filterPokemon]);

  useEffect(() => {
    setDisplayCount(POKEMON_PER_PAGE);
  }, [searchQuery, selectedTypes, showFavorites]);

  useEffect(() => {
    if (searchQuery.trim() || selectedTypes.length > 0 || showFavorites) {
      setDisplayedPokemon(filteredPokemon);
    } else {
      setDisplayedPokemon(filteredPokemon.slice(0, displayCount));
    }
  }, [filteredPokemon, displayCount, searchQuery, selectedTypes, showFavorites]);

  const loadMorePokemon = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const pokemonListResponse = await pokemonAPI.getPokemonList(
        POKEMON_PER_PAGE,
        currentOffset
      );

      const pokemonDetails = await Promise.all(
        pokemonListResponse.results.map(pokemon =>
          pokemonAPI.getPokemon(pokemon.name)
        )
      );

      setAllPokemon(prev => [...prev, ...pokemonDetails]);
      setCurrentOffset(prev => prev + POKEMON_PER_PAGE);
      setDisplayCount(prev => prev + POKEMON_PER_PAGE);
      setHasMore(pokemonListResponse.next !== null);
    } catch (error) {
      console.error('Error loading more Pokemon:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, currentOffset]);

  const handleScroll = useCallback(() => {
    if (showFavorites || searchQuery.trim() || selectedTypes.length > 0) {
      return;
    }

    if (loadingMore || !hasMore) {
      return;
    }

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 300) {
      console.log('Infinite scroll triggered:', {
        scrollTop,
        windowHeight,
        documentHeight,
        hasMore,
        loadingMore,
        displayedCount: displayedPokemon.length,
        allCount: allPokemon.length
      });
      loadMorePokemon();
    }
  }, [showFavorites, searchQuery, selectedTypes, loadingMore, hasMore, displayedPokemon.length, allPokemon.length, loadMorePokemon]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleTypeToggle = (typeName: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeName)
        ? prev.filter(t => t !== typeName)
        : [...prev, typeName]
    );
  };

  const handlePokemonClick = async (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setEvolutions([]);
  };

  const toggleFavorite = (pokemon: Pokemon) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(pokemon.id)) {
        newFavorites.delete(pokemon.id);
      } else {
        newFavorites.add(pokemon.id);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterPokemon();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterPokemon]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-xl text-gray-300">Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-3">
              <img 
                src="/poke-ball.png" 
                alt="Pokeball" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-3xl font-bold" style={{ color: '#ff6900' }}>
                Pokemon Explorer
              </h1>
            </div>
          </div>

          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search Pokemon by name or number..."
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {types.map((type) => (
              <TypePill
                key={type.name}
                type={type.name}
                isSelected={selectedTypes.includes(type.name)}
                onClick={handleTypeToggle}
                color={typeColors[type.name as keyof typeof typeColors] || '#68A090'}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <p className="text-gray-300">
            {showFavorites 
              ? `Showing ${filteredPokemon.length} favorite Pokemon`
              : `Showing ${filteredPokemon.length} Pokemon`
            }
            {selectedTypes.length > 0 && (
              <span className="ml-2">
                filtered by: {selectedTypes.join(', ')}
              </span>
            )}
          </p>
        </div>

        {filteredPokemon.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-4">
              {showFavorites 
                ? "No favorite Pokemon found"
                : "No Pokemon found matching your criteria"
              }
            </p>
            {(selectedTypes.length > 0 || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTypes([]);
                  setSearchQuery('');
                  setShowFavorites(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {displayedPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={handlePokemonClick}
                />
              ))}
            </div>

            {!showFavorites && !searchQuery.trim() && selectedTypes.length === 0 && loadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading more Pokemon...</span>
                </div>
              </div>
            )}

            {!showFavorites && !searchQuery.trim() && selectedTypes.length === 0 && (hasMore || displayedPokemon.length < allPokemon.length) && !loadingMore && (
              <div className="flex justify-center py-8">
                <button
                  onClick={loadMorePokemon}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <PokemonModal
        pokemon={selectedPokemon}
        evolutions={evolutions}
        onClose={() => setSelectedPokemon(null)}
        isFavorite={selectedPokemon ? favorites.has(selectedPokemon.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default App;

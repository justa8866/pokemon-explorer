import type { Pokemon, Evolution } from '../services/pokemonAPI';
import { typeColors } from '../services/pokemonAPI';
import { X, Heart } from 'lucide-react';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  evolutions: Evolution[];
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: Pokemon) => void;
}

export const PokemonModal = ({ 
  pokemon, 
  evolutions,
  onClose, 
  isFavorite,
  onToggleFavorite 
}: PokemonModalProps) => {
  if (!pokemon) return null;

  const types = pokemon.types.map(t => t.type.name);
  const typeColor = typeColors[types[0] as keyof typeof typeColors] || '#68A090';
  
  const backgroundStyle = types.length > 1 
    ? {
        background: `linear-gradient(135deg, ${types.map(type => 
          typeColors[type as keyof typeof typeColors] || '#68A090'
        ).join(', ')})`
      }
    : { backgroundColor: typeColor };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pokemon-modal-title"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div 
          className="relative p-6 text-white rounded-t-2xl"
          style={backgroundStyle}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => onToggleFavorite(pokemon)}
            className="absolute top-4 right-16 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <div className="flex items-center gap-6">
            <img
              src={pokemon.sprites.other?.['official-artwork']?.front_default || 
                   pokemon.sprites.other?.home?.front_default ||
                   pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-32 h-32 object-contain drop-shadow-lg"
            />
            <div>
              <h2 id="pokemon-modal-title" className="text-3xl font-bold capitalize mb-2">
                {pokemon.name}
              </h2>
              <p className="text-lg opacity-90 mb-4">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
              <div className="flex gap-2 flex-wrap">
                {types.map((type) => (
                  <span
                    key={type}
                    className="
                      px-3 py-1 rounded-full text-sm font-medium
                      bg-white/20 backdrop-blur-md
                      shadow-lg
                      capitalize transition-all duration-200
                      hover:bg-white/30
                    "
                    style={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Height:</span>
                <span className="ml-2 font-medium">{pokemon.height / 10} m</span>
              </div>
              <div>
                <span className="text-gray-600">Weight:</span>
                <span className="ml-2 font-medium">{pokemon.weight / 10} kg</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Base Stats</h3>
            <div className="space-y-3">
              {pokemon.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-24 text-sm capitalize text-gray-600">
                    {stat.stat.name.replace('-', ' ')}:
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                        backgroundColor: typeColor
                      }}
                    />
                  </div>
                  <span className="w-12 text-sm font-medium text-gray-800">
                    {stat.base_stat}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Sprites</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pokemon.sprites.front_default && (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <img 
                    src={pokemon.sprites.front_default} 
                    alt={`${pokemon.name} front`}
                    className="w-full h-20 object-contain"
                  />
                  <p className="text-xs text-gray-600 mt-2">Front</p>
                </div>
              )}
              {pokemon.sprites.back_default && (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <img 
                    src={pokemon.sprites.back_default} 
                    alt={`${pokemon.name} back`}
                    className="w-full h-20 object-contain"
                  />
                  <p className="text-xs text-gray-600 mt-2">Back</p>
                </div>
              )}
              {pokemon.sprites.front_shiny && (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <img 
                    src={pokemon.sprites.front_shiny} 
                    alt={`${pokemon.name} shiny front`}
                    className="w-full h-20 object-contain"
                  />
                  <p className="text-xs text-gray-600 mt-2">Shiny Front</p>
                </div>
              )}
              {pokemon.sprites.back_shiny && (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <img 
                    src={pokemon.sprites.back_shiny} 
                    alt={`${pokemon.name} shiny back`}
                    className="w-full h-20 object-contain"
                  />
                  <p className="text-xs text-gray-600 mt-2">Shiny Back</p>
                </div>
              )}
            </div>
          </section>

          {evolutions.length > 1 && (
            <section>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Evolution Chain</h3>
              <div className="flex flex-wrap gap-4">
                {evolutions.map((evolution, index) => (
                  <div key={evolution.id} className="flex items-center">
                    <div className="text-center">
                      <img 
                        src={evolution.sprite} 
                        alt={evolution.name}
                        className="w-16 h-16 object-contain mx-auto"
                      />
                      <p className="text-sm capitalize font-medium mt-1">
                        {evolution.name}
                      </p>
                    </div>
                    {index < evolutions.length - 1 && (
                      <div className="mx-2 text-gray-400">→</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

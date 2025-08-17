import type { Pokemon } from '../services/pokemonAPI';
import { typeColors } from '../services/pokemonAPI';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

export const PokemonCard = ({ pokemon, onClick }: PokemonCardProps) => {
  const types = pokemon.types.map(t => t.type.name);
  const typeColor = typeColors[types[0] as keyof typeof typeColors] || '#68A090';

  const backgroundStyle = types.length > 1 
    ? {
        background: `linear-gradient(135deg, ${types.map(type => 
          typeColors[type as keyof typeof typeColors] || '#68A090'
        ).join(', ')})`
      }
    : { backgroundColor: typeColor };

  return (
    <article 
      className="
        relative overflow-hidden rounded-xl shadow-lg cursor-pointer
        transform transition-all duration-300 hover:scale-105 hover:shadow-xl
      "
      onClick={() => onClick(pokemon)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(pokemon);
        }
      }}
      aria-label={`View details for ${pokemon.name}`}
    >
      <div 
        className="absolute inset-0 opacity-90"
        style={backgroundStyle}
      />
      
      <div className="relative z-10 p-6 text-white">
        <div className="flex justify-center mb-4">
          <img
            src={pokemon.sprites.other?.['official-artwork']?.front_default || 
                 pokemon.sprites.other?.home?.front_default ||
                 pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-24 h-24 object-contain drop-shadow-lg"
            loading="lazy"
          />
        </div>
        
        <h3 className="text-xl font-bold capitalize mb-2 text-center text-shadow">
          {pokemon.name}
        </h3>

        <div className="text-center mb-3">
          <span className="text-sm font-bold opacity-80">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          {types.map((type) => (
            <span
              key={type}
              className="
                px-3 py-1 rounded-full text-xs font-medium
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
    </article>
  );
};

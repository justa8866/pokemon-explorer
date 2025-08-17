interface TypePillProps {
  type: string;
  isSelected: boolean;
  onClick: (type: string) => void;
  color: string;
}

export const TypePill = ({ type, isSelected, onClick, color }: TypePillProps) => {
  return (
    <button
      onClick={() => onClick(type)}
      className={`
        px-4 py-2 rounded-full text-sm font-medium capitalize
        transition-all duration-200 hover:scale-105 hover:shadow-md
        ${isSelected 
          ? 'ring-2 ring-white ring-opacity-80 shadow-lg' 
          : 'hover:ring-1 hover:ring-white hover:ring-opacity-40'
        }
      `}
      style={{
        backgroundColor: color,
        color: 'white',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
      }}
      aria-pressed={isSelected}
      aria-label={`Filter by ${type} type`}
    >
      {type}
    </button>
  );
};

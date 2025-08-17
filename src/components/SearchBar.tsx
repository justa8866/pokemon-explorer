interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search Pokemon..." 
}: SearchBarProps) => {
  return (
    <div className="relative max-w-sm mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full px-4 py-2 rounded-xl text-sm
          border-none
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all duration-200
          text-white placeholder-gray-400
        "
        style={{ backgroundColor: '#1e1e1e' }}
        aria-label="Search Pokemon"
      />
    </div>
  );
};

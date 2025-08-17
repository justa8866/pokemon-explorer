import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  hasMore: boolean;
}

export const LoadMoreButton = ({ 
  onClick, 
  loading, 
  hasMore 
}: LoadMoreButtonProps) => {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No more Pokemon to load</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <button
        onClick={onClick}
        disabled={loading}
        className="
          px-8 py-3 bg-blue-600 text-white rounded-lg font-medium
          hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed
          transition-all duration-200 hover:scale-105 hover:shadow-lg
          flex items-center gap-2
        "
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading...
          </>
        ) : (
          'Load More'
        )}
      </button>
    </div>
  );
};

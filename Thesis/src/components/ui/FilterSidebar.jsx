import { useState, useEffect } from 'react';
import useGameStore from '../../store/useGameStore';
import { gamesAPI } from '../../services/api';

const FilterSidebar = ({ onFilterChange }) => {
  const { filters, setFilters, fetchGenres, fetchPlatforms, genres, platforms } = useGameStore();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  useEffect(() => {
    fetchGenres();
    fetchPlatforms();
  }, []);

  const handleGenreChange = (genreId) => {
    const newFilters = { ...filters, genre: filters.genre === genreId ? null : genreId };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePlatformChange = (platformId) => {
    const newFilters = { ...filters, platform: filters.platform === platformId ? null : platformId };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (ordering) => {
    const newFilters = { ...filters, ordering };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { genre: null, platform: null, ordering: '-added' };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-400 hover:text-primary-300"
        >
          Clear All
        </button>
      </div>

      {/* Sort By */}
      <div>
        <h4 className="text-white font-semibold mb-3">Sort By</h4>
        <div className="space-y-2">
          {[
            { value: '-added', label: 'Recently Added' },
            { value: '-rating', label: 'Highest Rated' },
            { value: '-released', label: 'Newest Release' },
            { value: 'name', label: 'Name (A-Z)' },
            { value: '-metacritic', label: 'Metacritic Score' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                filters.ordering === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <h4 className="text-white font-semibold mb-3">Genres</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {genres.slice(0, 15).map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreChange(genre.id.toString())}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                filters.genre === genre.id.toString()
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div>
        <h4 className="text-white font-semibold mb-3">Platforms</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {platforms.slice(0, 10).map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformChange(platform.id.toString())}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                filters.platform === platform.id.toString()
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range (Visual only for now) */}
      <div>
        <h4 className="text-white font-semibold mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">$0</span>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="flex-1"
            />
            <span className="text-gray-400 text-sm">$100+</span>
          </div>
          <p className="text-gray-400 text-sm text-center">
            ${priceRange.min} - ${priceRange.max}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;


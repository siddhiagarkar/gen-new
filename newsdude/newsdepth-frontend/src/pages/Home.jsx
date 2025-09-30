import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from '../components/Dashboard';

const Home = () => {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedCountry, setSelectedCountry] = useState('us');//U.S. by default
  const [searchQuery, setSearchQuery] = useState('');

  // Available countries with flags
  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'in', name: 'India', flag: '🇮🇳' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'it', name: 'Italy', flag: '🇮🇹' },
    { code: 'jp', name: 'Japan', flag: '🇯🇵' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
    { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
  ];

  const categories = [
    { value: 'general', label: 'General', emoji: '🌐' },
    { value: 'business', label: 'Business', emoji: '💼' },
    { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
    { value: 'health', label: 'Health', emoji: '🏥' },
    { value: 'science', label: 'Science', emoji: '🔬' },
    { value: 'sports', label: 'Sports', emoji: '⚽' },
    { value: 'technology', label: 'Tech', emoji: '💻' }
  ];

  const fetchHeadlines = async (category = selectedCategory, country = selectedCountry, query = searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      
      const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
      let url;
      let params = {};

      if (query.trim()) {
        // Search across all articles (no country filter in everything endpoint)
        url = 'https://newsapi.org/v2/everything';
        params = {
          q: query,
          sortBy: 'publishedAt',
          pageSize: 15,
          language: 'en'
        };
      } else {
        // Top headlines with country and category
        url = 'https://newsapi.org/v2/top-headlines';
        params = {
          country: country,
          category: category,
          pageSize: 12
        };
      }

      const response = await axios.get(url, {
        params: {
          ...params,
          apiKey: API_KEY
        }
      });

      const filteredArticles = response.data.articles.filter(
        article => article.title && article.title !== '[Removed]'
      );

      setHeadlines(filteredArticles.slice(0, 12));

    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when changing category
    fetchHeadlines(category, selectedCountry);
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    fetchHeadlines(selectedCategory, country);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHeadlines(selectedCategory, selectedCountry, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchHeadlines(selectedCategory, selectedCountry);
  };

  useEffect(() => {
    fetchHeadlines();
  }, []);

  // Loader component
  const Loader = () => (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent rounded-full border-t-blue-600 animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {/* Loading {selectedCategory} News from {countries.find(c => c.code === selectedCountry)?.name} */}
          dive deeper
        </h2>
      </div>
    </div>
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-serif">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">NewsThru AI</h1>
        
        {/* Country Selector
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Region:</h3>
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountryChange(country.code)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCountry === country.code
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2 text-lg">{country.flag}</span>
                {country.name}
              </button>
            ))}
          </div>
        </div> */}

        {/* Category Filter */}
        <div className="mb-6">
          {/* <h3 className="text-lg font-semibold text-gray-700 mb-3">Category:</h3> */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search news from ${countries.find(c => c.code === selectedCountry)?.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                <span className="text-gray-400 text-lg">🔍</span>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Current Selection Info */}
        <div className="text-center text-gray-600">
          Engage with {searchQuery ? `results for "${searchQuery}"` : `${selectedCategory} news`} from {countries.find(c => c.code === selectedCountry)?.name}
        </div>
      </div>

      {/* News Dashboard */}
      <Dashboard 
        headlines={headlines} 
        refreshHeadlines={() => fetchHeadlines(selectedCategory, selectedCountry, searchQuery)}
        loading={loading}
        error={error}
        selectedCategory={selectedCategory}
        selectedCountry={selectedCountry}
      />
    </div>
  );
};

export default Home;
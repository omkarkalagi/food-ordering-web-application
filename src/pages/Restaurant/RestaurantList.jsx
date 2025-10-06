import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import RestaurantCard from '../../components/Restaurant/RestaurantCard';

// Mock data for restaurants
const mockRestaurants = [
  {
    id: '1',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    cuisine: ['Indian', 'North Indian'],
    rating: 4.5,
    deliveryTime: '25-35 min',
    costForTwo: '₹400 for two',
    isOpen: true,
    discount: '20% OFF',
    description: 'Authentic North Indian cuisine with traditional spices and flavors.',
  },
  {
    id: '2',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    cuisine: ['Italian', 'Pizza'],
    rating: 4.3,
    deliveryTime: '20-30 min',
    costForTwo: '₹600 for two',
    isOpen: true,
    discount: '15% OFF',
    description: 'Wood-fired pizzas with fresh toppings and authentic Italian recipes.',
  },
  {
    id: '3',
    name: 'Dragon Wok',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
    cuisine: ['Chinese', 'Asian'],
    rating: 4.6,
    deliveryTime: '30-40 min',
    costForTwo: '₹350 for two',
    isOpen: false,
    discount: null,
    description: 'Traditional Chinese dishes with authentic flavors and fresh ingredients.',
  },
  {
    id: '4',
    name: 'Burger Junction',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    cuisine: ['American', 'Fast Food'],
    rating: 4.2,
    deliveryTime: '15-25 min',
    costForTwo: '₹250 for two',
    isOpen: true,
    discount: '10% OFF',
    description: 'Juicy burgers and crispy fries made with premium ingredients.',
  },
  {
    id: '5',
    name: 'Biryani House',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    cuisine: ['Indian', 'Biryani'],
    rating: 4.7,
    deliveryTime: '35-45 min',
    costForTwo: '₹300 for two',
    isOpen: true,
    discount: '25% OFF',
    description: 'Aromatic biryani cooked with traditional spices and long-grain rice.',
  },
  {
    id: '6',
    name: 'Sweet Delights',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    cuisine: ['Desserts', 'Bakery'],
    rating: 4.4,
    deliveryTime: '20-30 min',
    costForTwo: '₹200 for two',
    isOpen: true,
    discount: null,
    description: 'Freshly baked cakes, pastries, and traditional Indian sweets.',
  },
];

const categories = [
  'All',
  'Indian',
  'Chinese',
  'Italian',
  'Fast Food',
  'Desserts',
  'Pizza',
  'Burger',
  'Biryani',
];

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchQuery, selectedCategory, sortBy]);

  const filterRestaurants = () => {
    let filtered = restaurants;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.some((cuisine) =>
          cuisine.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((restaurant) =>
        restaurant.cuisine.includes(selectedCategory)
      );
    }

    // Sort restaurants
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery-time':
        filtered.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
          return aTime - bTime;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredRestaurants(filtered);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            All Restaurants
          </h1>
          <p className="text-gray-600">
            Discover amazing restaurants in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="delivery-time">Fastest Delivery</option>
                <option value="name">Name A-Z</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors"
              >
                <FiFilter />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;

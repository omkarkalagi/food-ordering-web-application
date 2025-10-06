import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiTruck, FiStar, FiSearch } from 'react-icons/fi';
import RestaurantCard from '../Restaurant/RestaurantCard';
import CategoryCard from '../Category/CategoryCard';

// Mock data for demo
const featuredRestaurants = [
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
  },
];

const categories = [
  { id: '1', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200', count: 25 },
  { id: '2', name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', count: 18 },
  { id: '3', name: 'Biryani', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200', count: 32 },
  { id: '4', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200', count: 15 },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to restaurants page with search query
      window.location.href = `/restaurants?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Delicious Food
              <span className="block text-yellow-300">Delivered Fast</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Order from your favorite restaurants and get fresh food delivered to your doorstep
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex bg-white rounded-full p-2 shadow-lg">
                <input
                  type="text"
                  placeholder="Search for restaurants or food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 text-gray-700 rounded-l-full focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
                >
                  <FiSearch className="text-xl" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/restaurants"
                className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Restaurants
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-colors"
              >
                Join as Restaurant Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered within 30 minutes or it's free!
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="text-green-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">
                Free delivery on orders above ₹200. No hidden charges!
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-yellow-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
              <p className="text-gray-600">
                Fresh ingredients and hygienic preparation guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What are you craving?
            </h2>
            <p className="text-xl text-gray-600">
              Explore our popular food categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Restaurants
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked restaurants just for you
              </p>
            </div>
            <Link
              to="/restaurants"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to order your favorite food?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy customers and get amazing food delivered to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/restaurants"
              className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Order Now
            </Link>
            <Link
              to="/restaurant/register"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-colors"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

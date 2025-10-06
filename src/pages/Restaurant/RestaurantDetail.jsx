import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin, FiPhone, FiPlus, FiMinus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addItem } from '../../slices/cartSlice';
import { toast } from 'react-toastify';

// Mock restaurant data
const mockRestaurant = {
  id: '1',
  name: 'Spice Garden',
  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
  cuisine: ['Indian', 'North Indian'],
  rating: 4.5,
  deliveryTime: '25-35 min',
  costForTwo: '₹400 for two',
  isOpen: true,
  address: '123 MG Road, Bangalore, Karnataka 560001',
  phone: '+91 9876543210',
  description: 'Authentic North Indian cuisine with traditional spices and flavors. We serve the most delicious butter chicken, dal makhani, and tandoori items in the city.',
  menu: [
    {
      id: '1',
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken pieces',
      price: 280,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300',
      category: 'Main Course',
      isVeg: false,
      isPopular: true,
    },
    {
      id: '2',
      name: 'Paneer Butter Masala',
      description: 'Rich and creamy paneer curry with butter and spices',
      price: 240,
      image: 'https://images.unsplash.com/photo-1631452180539-96aca167782d?w=300',
      category: 'Main Course',
      isVeg: true,
      isPopular: true,
    },
    {
      id: '3',
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice cooked with chicken and spices',
      price: 320,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300',
      category: 'Rice & Biryani',
      isVeg: false,
      isPopular: false,
    },
    {
      id: '4',
      name: 'Garlic Naan',
      description: 'Soft and fluffy Indian bread with garlic flavor',
      price: 60,
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300',
      category: 'Breads',
      isVeg: true,
      isPopular: true,
    },
    {
      id: '5',
      name: 'Gulab Jamun',
      description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
      price: 80,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300',
      category: 'Desserts',
      isVeg: true,
      isPopular: false,
    },
  ],
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    // In a real app, you'd fetch restaurant data by ID
    setRestaurant(mockRestaurant);
  }, [id]);

  const categories = ['All', ...new Set(restaurant?.menu.map(item => item.category) || [])];

  const filteredMenu = selectedCategory === 'All'
    ? restaurant?.menu || []
    : restaurant?.menu.filter(item => item.category === selectedCategory) || [];

  const updateCartItem = (itemId, quantity) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity),
    }));
  };

  const addToCart = (item) => {
    const quantity = cartItems[item.id] || 0;
    if (quantity > 0) {
      dispatch(addItem({
        restaurantId: restaurant.id,
        item: {
          id: item.id,
          name: item.name,
          price: item.price,
          image_url: item.image,
        }
      }));
      toast.success(`${item.name} added to cart!`);
    }
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
            <div className="flex items-center space-x-1">
              <FiStar className="fill-current" />
              <span>{restaurant.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiClock />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiMapPin />
              <span>{restaurant.costForTwo}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {restaurant.cuisine.map((cuisine, index) => (
              <span key={index} className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full text-sm">
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Info</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600 text-sm">{restaurant.address}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiPhone />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{restaurant.description}</p>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isOpen ? '● Currently Open' : '● Currently Closed'}
                </div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Menu</h2>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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

              {/* Menu Items */}
              <div className="space-y-6">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          {item.isPopular && (
                            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mt-1">
                              Popular
                            </span>
                          )}
                        </div>
                        <span className="text-lg font-bold text-orange-500">₹{item.price}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                        </span>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartItem(item.id, (cartItems[item.id] || 0) - 1)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                              <FiMinus className="text-sm" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {cartItems[item.id] || 0}
                            </span>
                            <button
                              onClick={() => updateCartItem(item.id, (cartItems[item.id] || 0) + 1)}
                              className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                            >
                              <FiPlus className="text-sm" />
                            </button>
                          </div>

                          <button
                            onClick={() => addToCart(item)}
                            disabled={!cartItems[item.id]}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              cartItems[item.id]
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cart Summary - Fixed at bottom for mobile */}
        {Object.values(cartItems).some(quantity => quantity > 0) && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {Object.values(cartItems).reduce((total, quantity) => total + quantity, 0)} items
                </p>
                <p className="text-gray-600 text-sm">
                  ₹{restaurant.menu.reduce((total, item) => {
                    const quantity = cartItems[item.id] || 0;
                    return total + (item.price * quantity);
                  }, 0)}
                </p>
              </div>
              <button
                onClick={() => navigate('/cart')}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                View Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;

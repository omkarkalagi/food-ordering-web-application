import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiStar } from 'react-icons/fi';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
    >
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        {restaurant.discount && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {restaurant.discount}
          </div>
        )}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-sm font-medium ${
          restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {restaurant.isOpen ? '● Open' : '● Closed'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <FiStar className="text-yellow-500 fill-current" />
            <span className="text-gray-700 font-medium">{restaurant.rating}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <FiClock className="text-sm" />
            <span className="text-sm">{restaurant.deliveryTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {restaurant.cuisine.slice(0, 2).map((item, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {item}
              </span>
            ))}
            {restaurant.cuisine.length > 2 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                +{restaurant.cuisine.length - 2}
              </span>
            )}
          </div>
          <span className="text-gray-600 text-sm">{restaurant.costForTwo}</span>
        </div>

        <div className="flex items-center justify-between">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Quick Order
          </button>
          <span className="text-gray-500 text-sm">
            📍 2.5 km away
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;

import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/restaurants?category=${category.name.toLowerCase()}`}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 block"
    >
      <div className="relative">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
          {category.name}
        </h3>
        <p className="text-gray-600 text-sm">
          {category.count} restaurants
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;

'use client';

import { useState } from 'react';

// 类别类型
type Category = {
  id: number;
  name: string;
  slug?: string;
};

type CategoryNavigationProps = {
  categories: Category[];
};

export const CategoryNavigation = ({ categories }: CategoryNavigationProps) => {
  const [showAll, setShowAll] = useState(false);
  
  // 默认显示前8个类别
  const displayCategories = showAll ? categories : categories.slice(0, 8);
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {displayCategories.map((category) => (
          <a 
            key={category.id} 
            href={`/category/${category.slug || category.id}`}
            className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
          >
            {category.name}
          </a>
        ))}
        {categories.length > 8 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center"
          >
            {showAll ? 'Less' : 'More'} <span className="ml-1">{showAll ? '-' : '+'}</span>
          </button>
        )}
      </div>
    </div>
  );
}; 
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
  onCategorySelect: (category: Category | null) => void;
  selectedCategory: Category | null;
};

export const CategoryNavigation = ({ 
  categories, 
  onCategorySelect,
  selectedCategory 
}: CategoryNavigationProps) => {
  const [showAll, setShowAll] = useState(false);
  
  // 默认显示前8个类别
  const displayCategories = showAll ? categories : categories.slice(0, 8);
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {displayCategories.map((category) => (
          <button 
            key={category.id} 
            onClick={() => onCategorySelect(selectedCategory?.id === category.id ? null : category)}
            className={`whitespace-nowrap px-4 py-2 rounded-full border ${
              selectedCategory?.id === category.id 
                ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                : 'border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
            } transition-colors`}
          >
            {category.name}
          </button>
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
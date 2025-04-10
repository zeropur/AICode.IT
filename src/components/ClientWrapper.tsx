'use client';

import { useState, useEffect } from 'react';
import { CategoryNavigation } from './CategoryNavigation';
import { ApiToolsGrid } from './ApiToolsGrid';
import { searchService } from '@/services/searchService';

// 类别类型
type Category = {
  id: number;
  name: string;
  slug?: string;
  isNew?: boolean;
};

type ClientWrapperProps = {
  categories: Category[];
};

export default function ClientWrapper({
  categories
}: ClientWrapperProps) {
  // 创建一个特殊的 New 类别
  const newCategory: Category = {
    id: -1, // 使用特殊 ID 表示这是 New 类别
    name: 'New',
    isNew: true
  };
  
  // 状态管理：选中的类别，默认为 New 类别
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(newCategory);
  // 搜索查询
  const [searchQuery, setSearchQuery] = useState('');
  // 是否处于搜索模式
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // 创建包含 New 类别的完整类别列表
  const allCategories = [newCategory, ...categories];

  // 处理类别选择
  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
    // 退出搜索模式
    setIsSearchMode(false);
    setSearchQuery('');
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchMode(!!query);
  };

  // 订阅搜索服务
  useEffect(() => {
    // 注册搜索事件监听
    const unsubscribe = searchService.subscribe(handleSearch);
    
    // 清理
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {/* 类别导航 - 始终显示 */}
      <CategoryNavigation 
        categories={allCategories} 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      {/* 工具列表区域 */}
      <div className="mt-8">
        <ApiToolsGrid 
          categoryId={selectedCategory?.id === -1 ? null : selectedCategory?.id} 
          customTitle={isSearchMode ? 
            (selectedCategory && selectedCategory.id !== -1 ? 
              `Search Results in ${selectedCategory.name}` : 
              "Search Results") : 
            (selectedCategory?.isNew ? "Just launched" : 
              (selectedCategory ? selectedCategory.name : undefined))}
          showNewOnly={!isSearchMode && selectedCategory?.isNew}
          searchQuery={searchQuery}
          categories={allCategories}
        />
      </div>
    </div>
  );
} 
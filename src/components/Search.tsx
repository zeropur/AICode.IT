'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { searchService } from '@/services/searchService';

type SearchProps = {
  onSearch?: (query: string) => void;
};

export const Search = ({ onSearch }: SearchProps) => {
  const [query, setQuery] = useState('');
  // @ts-ignore - 忽略类型错误
  const t = useTranslations('Index');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 调用搜索服务进行全局广播
    searchService.search(query);
    
    // 如果有 onSearch 回调，同时调用它
    if (onSearch) {
      onSearch(query);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchService.search(query);
      
      if (onSearch) {
        onSearch(query);
      }
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          // @ts-ignore - 忽略类型错误
          placeholder={t('search_placeholder')}
          className="flex-grow h-10 px-4 text-sm rounded-l-lg bg-white border border-gray-200 border-r-0 focus:outline-none focus:border-indigo-300"
          aria-label="Search AI tools"
        />
        <button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 w-10 flex items-center justify-center rounded-r-lg focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
    </div>
  );
}; 
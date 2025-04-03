'use client';

import { Link } from '@/libs/i18nNavigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // @ts-ignore - 暂时忽略类型错误
  const t = useTranslations('Navigation');

  return (
    <nav className="bg-white py-3 border-b border-gray-100">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <span className="text-base font-bold ml-2">AICode.IT</span>
          </Link>

          {/* Desktop navigation - moved here */}
          <div className="hidden md:flex items-center ml-10">
          </div>
        </div>

        {/* Right side buttons - 移除Favourite和Login */}
        <div className="hidden md:flex items-center space-x-3">
          {/* 这里已删除Favourite按钮和UserMenu */}
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-700 cursor-pointer"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link href="/submit" className="text-sm text-gray-800 hover:text-indigo-600 py-1.5 cursor-pointer">
              {/* @ts-ignore */}
              {t('submit')}
            </Link>
            {/* 移除UserMenu */}
          </div>
        </div>
      )}
    </nav>
  );
}; 
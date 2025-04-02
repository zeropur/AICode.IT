'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { placeholderImage } from '@/utils/imageUtils';

type AIToolCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  rating?: number;
  isNew?: boolean;
};

export const AIToolCard = ({
  title,
  description,
  imageUrl,
  link,
  category,
  rating = 0,
  isNew = false,
}: AIToolCardProps) => {
  const [imgSrc, setImgSrc] = useState(placeholderImage);
  const [imgError, setImgError] = useState(false);

  // 图片加载错误处理函数
  const handleImageError = () => {
    setImgSrc(placeholderImage);
    setImgError(true);
  };

  // 当imageUrl属性变化时，尝试预加载图片
  useEffect(() => {
    if (!imageUrl) return;

    const img = new globalThis.Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setImgSrc(imageUrl);
    };
    
    img.onerror = () => {
      setImgSrc(placeholderImage);
      setImgError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
      <Link href={link} className="absolute inset-0 z-0" aria-hidden="true" target="_blank" rel="noopener noreferrer" />
      
      <div className="relative h-32 w-full mb-3 overflow-hidden rounded-lg bg-indigo-50">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={title}
            width={128}
            height={128}
            className="w-full h-full object-cover"
            onError={handleImageError}
            unoptimized={imgError} // 当使用默认图片时禁用图像优化
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-2 relative">
        <div className="relative z-20 max-w-[80%]">
          <Link 
            href={link} 
            className="text-base font-semibold truncate block hover:text-indigo-600 transition-colors" 
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </Link>
        </div>
        
        <div className="relative z-20">
          <Link 
            href={link} 
            className="text-gray-500 block hover:text-indigo-600 transition-colors" 
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </Link>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2 relative z-10 pointer-events-none">{description}</p>
      
      <div className="flex items-center justify-between">
        <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full relative z-20">
          {category}
        </span>
        
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-xs text-gray-500">{rating}</span>
          {isNew && (
            <span className="ml-2 bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full relative z-20">
              New
            </span>
          )}
        </div>
      </div>
    </div>
  );
}; 
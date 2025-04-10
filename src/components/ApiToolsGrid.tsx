'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { AIToolCard } from './AIToolCard';
import { createClient } from '@supabase/supabase-js';
import { placeholderImage } from '@/utils/imageUtils';

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// 只有在URL不为空时才创建Supabase客户端
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// API工具数据需要转换为应用所需的格式
interface ApiTool {
  id: number;
  name: string;
  link: string;
  rating: number;
  description: string;
  release_date: string;
  image_url: string;
  category_id?: number;
  category_name?: string;
}

interface AITool {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  rating?: number;
  isNew?: boolean;
}

// 转换函数
const convertApiToolToAITool = (apiTool: ApiTool): AITool => {
  // 检查URL是否有效
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return {
    id: apiTool.id.toString(),
    title: apiTool.name,
    description: apiTool.description,
    imageUrl: isValidUrl(apiTool.image_url) ? apiTool.image_url : placeholderImage,
    link: apiTool.link,
    category: apiTool.category_name || 'AI Tool', // 使用类别名称
    rating: apiTool.rating,
    isNew: false // 将isNew设置为false，不再显示New标签
  };
};

// 示例数据
const sampleAITools: AITool[] = [
  {
    id: '1',
    title: 'AI Image Generator',
    description: 'Generate stunning images with AI',
    imageUrl: placeholderImage,
    link: '/tools/ai-image-generator',
    category: 'Image Generation',
    rating: 4.5,
    isNew: false
  },
  {
    id: '2',
    title: 'AI Text Analyzer',
    description: 'Analyze text with advanced AI',
    imageUrl: placeholderImage,
    link: '/tools/ai-text-analyzer',
    category: 'Text Analysis',
    rating: 4.2,
    isNew: false
  },
  {
    id: '3',
    title: 'AI Code Assistant',
    description: 'Get help with coding using AI',
    imageUrl: placeholderImage,
    link: '/tools/ai-code-assistant',
    category: 'Development',
    rating: 4.8,
    isNew: false
  },
  {
    id: '4',
    title: 'AI Music Composer',
    description: 'Create music with AI assistance',
    imageUrl: placeholderImage,
    link: '/tools/ai-music-composer',
    category: 'Music',
    rating: 4.3,
    isNew: false
  },
  {
    id: '5',
    title: 'AI Writing Assistant',
    description: 'Improve your writing with AI',
    imageUrl: placeholderImage,
    link: '/tools/ai-writing-assistant',
    category: 'Writing',
    rating: 4.6,
    isNew: false
  }
];

// 占位卡片数据
const skeletonTools: AITool[] = Array(5).fill(0).map((_, index) => ({
  id: `skeleton-${index}`,
  title: 'Loading...',
  description: 'Loading description...',
  imageUrl: placeholderImage,
  link: '#',
  category: 'Loading...',
  rating: 0,
  isNew: false
}));

type ApiToolsGridProps = {
  categoryId?: number | null;
  customTitle?: string;
  showNewOnly?: boolean;
  searchQuery?: string;
  categories?: Array<{id: number, name: string}>;
};

export const ApiToolsGrid = ({ 
  categoryId, 
  customTitle, 
  showNewOnly = false,
  searchQuery = '',
  categories = []
}: ApiToolsGridProps) => {
  const [tools, setTools] = useState<AITool[]>(skeletonTools);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    pageCount: 0,
    hasMore: false
  });
  
  // 无限滚动相关状态
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastToolElementRef = useRef<HTMLDivElement | null>(null);

  // 获取工具数据的函数
  const fetchTools = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      
      // 只有在supabase客户端存在时才尝试获取数据
      if (supabase) {
        // 构建API URL
        let apiUrl = `/api/tools?page=${page}&pageSize=10`;
        
        // 添加排序参数
        if (showNewOnly) {
          apiUrl += `&sort=latest`;
        }
        
        // 添加类别筛选
        if (categoryId) {
          apiUrl += `&category=${categoryId}`;
        }
        
        // 添加搜索参数
        if (searchQuery) {
          apiUrl += `&search=${encodeURIComponent(searchQuery)}`;
        }
        
        // 从API获取工具数据
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (response.ok && result.data) {
          // 将API工具数据转换为AITool格式
          const convertedTools = result.data.map(convertApiToolToAITool);
          
          // 更新工具列表
          if (append) {
            setTools(prev => [...prev, ...convertedTools]);
          } else {
            setTools(convertedTools);
          }
          
          // 更新分页信息
          setPagination({
            ...result.pagination,
            hasMore: result.pagination.page < result.pagination.pageCount
          });
          
          setLoading(false);
          setIsFetchingMore(false);
          return;
        }
      }
      
      // 如果没有Supabase客户端或者没有数据，使用示例数据
      if (!append) {
        // 如果有搜索查询，过滤示例数据
        let filteredTools = sampleAITools;
        
        // 应用类别筛选
        if (categoryId) {
          filteredTools = filteredTools.filter(tool => {
            const category = categories.find(c => c.id === categoryId);
            return category ? tool.category.toLowerCase() === category.name.toLowerCase() : false;
          });
        }
        
        // 应用搜索查询
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredTools = filteredTools.filter(tool => 
            tool.title.toLowerCase().includes(query) || 
            tool.description.toLowerCase().includes(query)
          );
        }
        
        setTools(filteredTools);
      }
      setLoading(false);
      setIsFetchingMore(false);
    } catch (error) {
      console.error('Error fetching tools:', error);
      // 在API请求失败时使用示例数据
      if (!append) {
        // 过滤示例数据
        let filteredTools = sampleAITools;
        
        // 应用类别筛选
        if (categoryId) {
          filteredTools = filteredTools.filter(tool => {
            const category = categories.find(c => c.id === categoryId);
            return category ? tool.category.toLowerCase() === category.name.toLowerCase() : false;
          });
        }
        
        // 应用搜索查询
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredTools = filteredTools.filter(tool => 
            tool.title.toLowerCase().includes(query) || 
            tool.description.toLowerCase().includes(query)
          );
        }
        
        setTools(filteredTools);
      }
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [categoryId, showNewOnly, searchQuery, categories]);

  // 初始加载数据
  useEffect(() => {
    // 重置分页
    setPagination({
      total: 0,
      page: 1,
      pageSize: 10,
      pageCount: 0,
      hasMore: false
    });
    
    // 获取第一页数据
    fetchTools(1, false);
  }, [categoryId, showNewOnly, searchQuery, fetchTools]);

  // 设置无限滚动
  useEffect(() => {
    // 创建观察器
    const setupObserver = () => {
      // 如果已经没有更多数据，不需要设置观察器
      if (!pagination.hasMore || loading || isFetchingMore) return;
      
      // 注销旧的观察器
      if (observer.current) {
        observer.current.disconnect();
      }
      
      // 创建新的观察器
      observer.current = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting && pagination.hasMore && !isFetchingMore) {
          // 当最后一个元素可见且有更多数据时，加载下一页
          fetchTools(pagination.page + 1, true);
        }
      });
      
      // 观察最后一个元素
      if (lastToolElementRef.current) {
        observer.current.observe(lastToolElementRef.current);
      }
    };
    
    setupObserver();
    
    // 清理观察器
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [pagination.hasMore, pagination.page, loading, isFetchingMore, fetchTools]);

  const displayTitle = searchQuery 
    ? 'Search Results' 
    : (customTitle || 'Just launched');

  // 渲染工具卡片并添加 ref 到最后一个元素
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{displayTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool, index) => {
          // 如果是最后一个元素，添加 ref
          if (index === tools.length - 1) {
            return (
              <div key={tool.id} ref={lastToolElementRef}>
                <AIToolCard
                  title={tool.title}
                  description={tool.description}
                  imageUrl={tool.imageUrl}
                  link={tool.link}
                  category={tool.category}
                  rating={tool.rating}
                  isNew={tool.isNew}
                />
              </div>
            );
          }
          
          // 普通元素
          return (
            <div key={tool.id}>
              <AIToolCard
                title={tool.title}
                description={tool.description}
                imageUrl={tool.imageUrl}
                link={tool.link}
                category={tool.category}
                rating={tool.rating}
                isNew={tool.isNew}
              />
            </div>
          );
        })}
      </div>
      
      {/* 加载中指示器 */}
      {isFetchingMore && (
        <div className="mt-4 text-center">
          <div className="inline-block w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}; 
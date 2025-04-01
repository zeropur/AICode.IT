'use client';

import { useEffect, useState } from 'react';
import { AIToolGrid } from './AIToolGrid';
import { createClient } from '@supabase/supabase-js';
import { placeholderImage } from '@/utils/imageUtils';
import { useTranslations } from 'next-intl';

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API工具数据和AIToolGrid组件需要的数据格式有所不同，需要转换
interface ApiTool {
  id: number;
  name: string;
  link: string;
  rating: number;
  description: string;
  release_date: string;
  image_url: string;
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
    category: 'AI Tool', // 可以根据需要添加分类
    rating: apiTool.rating,
    isNew: true // 可以根据release_date判断是否为新工具
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
    isNew: true
  },
  {
    id: '2',
    title: 'AI Text Analyzer',
    description: 'Analyze text with advanced AI',
    imageUrl: placeholderImage,
    link: '/tools/ai-text-analyzer',
    category: 'Text Analysis',
    rating: 4.2,
    isNew: true
  },
  {
    id: '3',
    title: 'AI Code Assistant',
    description: 'Get help with coding using AI',
    imageUrl: placeholderImage,
    link: '/tools/ai-code-assistant',
    category: 'Development',
    rating: 4.8,
    isNew: true
  },
  {
    id: '4',
    title: 'AI Music Composer',
    description: 'Create music with AI assistance',
    imageUrl: placeholderImage,
    link: '/tools/ai-music-composer',
    category: 'Music',
    rating: 4.3,
    isNew: true
  },
  {
    id: '5',
    title: 'AI Writing Assistant',
    description: 'Improve your writing with AI',
    imageUrl: placeholderImage,
    link: '/tools/ai-writing-assistant',
    category: 'Writing',
    rating: 4.6,
    isNew: true
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

export const ApiToolsGrid = () => {
  const [tools, setTools] = useState<AITool[]>(skeletonTools);
  // @ts-ignore - 忽略类型错误
  const t = useTranslations('AIToolGrid');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        // 从Supabase获取工具数据
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('id');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // 将Supabase工具数据转换为AITool格式
          const convertedTools = data.map(convertApiToolToAITool);
          setTools(convertedTools);
        } else {
          // 如果没有数据，使用示例数据
          setTools(sampleAITools);
        }
      } catch (error) {
        console.error('Error fetching tools:', error);
        // 在Supabase请求失败时使用示例数据
        setTools(sampleAITools);
      }
    };

    // 延迟获取数据，让占位卡片有时间显示
    const timer = setTimeout(() => {
      fetchTools();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 直接使用 AIToolGrid 组件显示工具数据（即使在加载中也显示占位卡片）
  // @ts-ignore - 忽略类型错误
  return <AIToolGrid tools={tools} title={t('just_launched')} />;
}; 
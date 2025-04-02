'use client';

import { AIToolCard } from './AIToolCard';
import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';

type AITool = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  rating?: number;
  isNew?: boolean;
};

type AIToolGridProps = {
  tools: AITool[];
  title: string;
  loading?: boolean;
};

export const AIToolGrid = ({ tools, title, loading = false }: AIToolGridProps) => {
  // @ts-ignore - 忽略类型错误
  const t = useTranslations('AIToolGrid');
  // @ts-ignore - 忽略类型错误
  const tIndex = useTranslations('Index');
  
  // 避免在渲染中直接调用hooks，使用useState保存需要的值
  const [viewAllText] = useState(() => {
    // @ts-ignore - 忽略类型错误
    return tIndex('view_all');
  });
  
  // 检查是否是"最新发布"标题，考虑不同语言
  const isJustLaunched = useCallback(() => {
    // @ts-ignore - 忽略类型错误
    return title === t('just_launched') || 
           title === 'Just launched' || 
           title === '最新发布' || 
           title === 'Recién lanzados';
  }, [title, t]);
  
  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tools.map((tool) => (
          <AIToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            imageUrl={tool.imageUrl}
            link={tool.link}
            category={tool.category}
            rating={tool.rating}
            isNew={tool.isNew}
          />
        ))}
      </div>
    </section>
  );
}; 
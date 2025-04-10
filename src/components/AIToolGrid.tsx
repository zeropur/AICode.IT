'use client';

import { AIToolCard } from './AIToolCard';

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
};

export const AIToolGrid = ({ tools, title }: AIToolGridProps) => {
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
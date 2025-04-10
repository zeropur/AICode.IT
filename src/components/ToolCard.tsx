'use client';

import React, { useEffect, useState } from 'react';

interface Tool {
  id: number;
  name: string;
  link: string;
  rating: number;
  description: string;
  release_date: string;
  image_url: string;
}

// 添加示例数据用于开发
const sampleTools: Tool[] = [
  {
    id: 1,
    name: 'ChatGPT',
    link: 'https://chat.openai.com',
    rating: 5,
    description: 'Advanced AI chatbot developed by OpenAI that understands and generates human-like text.',
    release_date: '2022-11-30',
    image_url: 'https://static.vecteezy.com/system/resources/previews/021/608/790/original/chatgpt-logo-chat-gpt-icon-on-black-background-free-vector.jpg'
  },
  {
    id: 2,
    name: 'Midjourney',
    link: 'https://www.midjourney.com',
    rating: 4,
    description: 'AI-powered service that generates images from text descriptions provided by users.',
    release_date: '2022-07-12',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOBP-lBqTpCJbH7OLs9UAxvzNn69JYH6fNz6wU6UoFYw&s'
  },
  {
    id: 3,
    name: 'Claude AI',
    link: 'https://claude.ai',
    rating: 4,
    description: 'Conversational AI assistant developed by Anthropic to be helpful, harmless, and honest.',
    release_date: '2023-03-14',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-MAx13QcT_DGvSyd01QZ2IjFVkGU0F1vRK-Wn4Dld&s'
  }
];

const ToolCard: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/tools')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // 如果从API获取数据成功，则使用API数据
        // 如果返回的数据为空，则使用示例数据
        setTools(data.length > 0 ? data : sampleTools);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tools:', error);
        // 在API请求失败的情况下使用示例数据
        setTools(sampleTools);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading tools...</div>;
  }

  if (tools.length === 0) {
    return <div className="text-center py-8">No tools available at the moment.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <div key={tool.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <img src={tool.image_url} alt={tool.name} className="w-full h-40 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-bold">{tool.name}</h3>
            <div className="flex items-center mt-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < tool.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({tool.rating}/5)</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
            <div className="flex justify-between items-center">
              <a 
                href={tool.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Visit Website →
              </a>
              <span className="text-xs text-gray-400">
                {new Date(tool.release_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolCard; 
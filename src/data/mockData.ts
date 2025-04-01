// 使用公共占位图服务作为图片源
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='24' fill='%23f0f0ff'/%3E%3Crect x='32' y='32' width='64' height='64' rx='12' fill='%236366f1'/%3E%3Crect x='48' y='32' width='8' height='64' fill='%23f0f0ff'/%3E%3C/svg%3E";

export const recentlyLaunchedTools = [
  {
    id: '1',
    title: 'Whimsey: AI Scheduler',
    description: 'AI-powered scheduling solution integrating with Google Calendar and Outlook',
    imageUrl: placeholderImage,
    link: '/tools/whimsey',
    category: 'AI Email Assistant',
    rating: 0,
    isNew: true
  },
  {
    id: '2',
    title: 'aigirlFriend',
    description: 'The newest and best AI girlfriend on the market, your virtual companion',
    imageUrl: placeholderImage,
    link: '/tools/aigirlfriend',
    category: 'Text to Image',
    rating: 0,
    isNew: true
  },
  {
    id: '3',
    title: 'ROK Solution',
    description: 'Platform for No Code applications and organization management',
    imageUrl: placeholderImage,
    link: '/tools/rok',
    category: 'AI Productivity Tools',
    rating: 4.8,
    isNew: true
  },
  {
    id: '4',
    title: 'Zavimo',
    description: 'AI work management platform for team collaboration',
    imageUrl: placeholderImage,
    link: '/tools/zavimo',
    category: 'AI Productivity Tools',
    rating: 0,
    isNew: true
  },
  {
    id: '5',
    title: 'GPT Translator',
    description: 'Advanced AI translation service using GPT technology for accurate translations',
    imageUrl: placeholderImage,
    link: '/tools/gpt-translator',
    category: 'Translate',
    rating: 4.2,
    isNew: true
  }
];

export const featuredTools = [
  {
    id: '1',
    title: 'Whimsey: AI Scheduler',
    description: 'AI-powered scheduling solution integrating with Google Calendar and Outlook',
    imageUrl: placeholderImage,
    link: '/tools/whimsey',
    category: 'AI Email Assistant',
    rating: 4.5,
    isNew: false
  },
  {
    id: '6',
    title: 'Voiset',
    description: 'More than just an AI task manager. Voiset is your AI-powered project management assistant',
    imageUrl: placeholderImage,
    link: '/tools/voiset',
    category: 'AI Project Management',
    rating: 4.7,
    isNew: false
  },
  {
    id: '7',
    title: 'Ghibli Image Generator',
    description: 'AI tool to transform images into Ghibli-style art',
    imageUrl: placeholderImage,
    link: '/tools/ghibli-image',
    category: 'AI Art Generator',
    rating: 4.9,
    isNew: false
  },
  {
    id: '8',
    title: 'Ghibli Art AI',
    description: 'Create magical Ghibli-style images from photos and text prompts',
    imageUrl: placeholderImage,
    link: '/tools/ghibli-art',
    category: 'AI Photo & Image Generator',
    rating: 4.6,
    isNew: false
  },
  {
    id: '9',
    title: 'Ghibli Studio AI',
    description: 'AI image generator for creating Studio Ghibli style artwork',
    imageUrl: placeholderImage,
    link: '/tools/ghibli-studio',
    category: 'AI Art Generator',
    rating: 4.8,
    isNew: false
  }
]; 
import { db } from '@/libs/DB';
import { tools } from '@/models/Schema';

async function seedTools() {
  try {
    // Check if tools already exist
    const existingTools = await db.select().from(tools);
    
    if (existingTools.length > 0) {
      console.log('Tools already seeded. Skipping...');
      return;
    }
    
    // Example tool data
    const toolsData = [
      {
        name: 'ChatGPT',
        link: 'https://chat.openai.com',
        rating: 5,
        description: 'Advanced AI chatbot developed by OpenAI that understands and generates human-like text.',
        releaseDate: new Date('2022-11-30'),
        imageUrl: 'https://static.vecteezy.com/system/resources/previews/021/608/790/original/chatgpt-logo-chat-gpt-icon-on-black-background-free-vector.jpg'
      },
      {
        name: 'Midjourney',
        link: 'https://www.midjourney.com',
        rating: 4,
        description: 'AI-powered service that generates images from text descriptions provided by users.',
        releaseDate: new Date('2022-07-12'),
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOBP-lBqTpCJbH7OLs9UAxvzNn69JYH6fNz6wU6UoFYw&s'
      },
      {
        name: 'Claude AI',
        link: 'https://claude.ai',
        rating: 4,
        description: 'Conversational AI assistant developed by Anthropic to be helpful, harmless, and honest.',
        releaseDate: new Date('2023-03-14'),
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-MAx13QcT_DGvSyd01QZ2IjFVkGU0F1vRK-Wn4Dld&s'
      },
      {
        name: 'Leonardo.AI',
        link: 'https://leonardo.ai',
        rating: 4,
        description: 'AI-powered platform for generating and editing visual content, designed for creators.',
        releaseDate: new Date('2022-12-20'),
        imageUrl: 'https://i.pcmag.com/imagery/reviews/025Wo4VFGjDJT6BEzXg22JY-13.fit_scale.size_1028x578.v1680804871.jpg'
      },
      {
        name: 'Perplexity AI',
        link: 'https://perplexity.ai',
        rating: 4,
        description: 'AI search engine that provides comprehensive answers with cited sources.',
        releaseDate: new Date('2022-08-30'),
        imageUrl: 'https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/b0od9qpkxdnaagchppik'
      },
      {
        name: 'Cursor',
        link: 'https://cursor.sh',
        rating: 5,
        description: 'AI-first code editor that helps you write, edit, and navigate code faster.',
        releaseDate: new Date('2023-02-22'),
        imageUrl: 'https://content.app-sources.com/s/52885656531178520/uploads/Images/cursor_AI-0230472.png'
      }
    ];
    
    // Insert tools
    for (const tool of toolsData) {
      await db.insert(tools).values(tool);
    }
    
    console.log('Tools seeded successfully!');
  } catch (error) {
    console.error('Error seeding tools:', error);
  }
}

// Execute the seed function
seedTools(); 
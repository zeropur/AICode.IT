import { adminSupabase } from '@/libs/Supabase';

async function seedTools() {
  try {
    // 检查表是否存在，如果不存在则创建
    const { error: checkError } = await adminSupabase.from('tools').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') { // 表不存在错误
      console.log('Creating tools table...');
      // 使用rpc方法执行SQL
      await adminSupabase.rpc('exec_sql', {
        sql_query: `
          CREATE TABLE tools (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            link TEXT NOT NULL,
            rating INTEGER NOT NULL,
            description TEXT NOT NULL,
            release_date TIMESTAMP NOT NULL,
            image_url TEXT NOT NULL
          );
        `
      });
      console.log('Tools table created.');
    }
    
    // 检查是否已有工具数据
    const { data: existingTools, error } = await adminSupabase
      .from('tools')
      .select('id')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    if (existingTools && existingTools.length > 0) {
      console.log('Tools already seeded. Skipping...');
      return;
    }
    
    // 示例工具数据
    const toolsData = [
      {
        name: 'ChatGPT',
        link: 'https://chat.openai.com',
        rating: 5,
        description: 'Advanced AI chatbot developed by OpenAI that understands and generates human-like text.',
        release_date: new Date('2022-11-30').toISOString(),
        image_url: 'https://static.vecteezy.com/system/resources/previews/021/608/790/original/chatgpt-logo-chat-gpt-icon-on-black-background-free-vector.jpg'
      },
      {
        name: 'Midjourney',
        link: 'https://www.midjourney.com',
        rating: 4,
        description: 'AI-powered service that generates images from text descriptions provided by users.',
        release_date: new Date('2022-07-12').toISOString(),
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOBP-lBqTpCJbH7OLs9UAxvzNn69JYH6fNz6wU6UoFYw&s'
      },
      {
        name: 'Claude AI',
        link: 'https://claude.ai',
        rating: 4,
        description: 'Conversational AI assistant developed by Anthropic to be helpful, harmless, and honest.',
        release_date: new Date('2023-03-14').toISOString(),
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-MAx13QcT_DGvSyd01QZ2IjFVkGU0F1vRK-Wn4Dld&s'
      },
      {
        name: 'Leonardo.AI',
        link: 'https://leonardo.ai',
        rating: 4,
        description: 'AI-powered platform for generating and editing visual content, designed for creators.',
        release_date: new Date('2022-12-20').toISOString(),
        image_url: 'https://i.pcmag.com/imagery/reviews/025Wo4VFGjDJT6BEzXg22JY-13.fit_scale.size_1028x578.v1680804871.jpg'
      },
      {
        name: 'Perplexity AI',
        link: 'https://perplexity.ai',
        rating: 4,
        description: 'AI search engine that provides comprehensive answers with cited sources.',
        release_date: new Date('2022-08-30').toISOString(),
        image_url: 'https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/b0od9qpkxdnaagchppik'
      },
      {
        name: 'Cursor',
        link: 'https://cursor.sh',
        rating: 5,
        description: 'AI-first code editor that helps you write, edit, and navigate code faster.',
        release_date: new Date('2023-02-22').toISOString(),
        image_url: 'https://content.app-sources.com/s/52885656531178520/uploads/Images/cursor_AI-0230472.png'
      }
    ];
    
    // 插入工具数据
    const { error: insertError } = await adminSupabase
      .from('tools')
      .insert(toolsData);
    
    if (insertError) {
      throw insertError;
    }
    
    console.log('Tools seeded successfully!');
  } catch (error) {
    console.error('Error seeding tools:', error);
  }
}

// 执行种子函数
seedTools(); 
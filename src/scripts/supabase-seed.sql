-- 注意：此脚本需要在Supabase SQL编辑器中运行

-- 确认工具表是否已存在，不存在则创建
CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  link TEXT NOT NULL,
  rating INTEGER NOT NULL,
  description TEXT NOT NULL,
  release_date TIMESTAMP NOT NULL,
  image_url TEXT NOT NULL
);

-- 如表中没有数据，则插入示例数据
INSERT INTO tools (name, link, rating, description, release_date, image_url)
SELECT 
  'ChatGPT',
  'https://chat.openai.com',
  5,
  'Advanced AI chatbot developed by OpenAI that understands and generates human-like text.',
  '2022-11-30',
  'https://static.vecteezy.com/system/resources/previews/021/608/790/original/chatgpt-logo-chat-gpt-icon-on-black-background-free-vector.jpg'
WHERE NOT EXISTS (SELECT 1 FROM tools WHERE name = 'ChatGPT');

INSERT INTO tools (name, link, rating, description, release_date, image_url)
SELECT 
  'Midjourney',
  'https://www.midjourney.com',
  4,
  'AI-powered service that generates images from text descriptions provided by users.',
  '2022-07-12',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOBP-lBqTpCJbH7OLs9UAxvzNn69JYH6fNz6wU6UoFYw&s'
WHERE NOT EXISTS (SELECT 1 FROM tools WHERE name = 'Midjourney');

INSERT INTO tools (name, link, rating, description, release_date, image_url)
SELECT
  'Claude AI',
  'https://claude.ai',
  4,
  'Conversational AI assistant developed by Anthropic to be helpful, harmless, and honest.',
  '2023-03-14',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-MAx13QcT_DGvSyd01QZ2IjFVkGU0F1vRK-Wn4Dld&s'
WHERE NOT EXISTS (SELECT 1 FROM tools WHERE name = 'Claude AI');

INSERT INTO tools (name, link, rating, description, release_date, image_url)
SELECT
  'Leonardo.AI',
  'https://leonardo.ai',
  4,
  'AI-powered platform for generating and editing visual content, designed for creators.',
  '2022-12-20',
  'https://i.pcmag.com/imagery/reviews/025Wo4VFGjDJT6BEzXg22JY-13.fit_scale.size_1028x578.v1680804871.jpg'
WHERE NOT EXISTS (SELECT 1 FROM tools WHERE name = 'Leonardo.AI');

INSERT INTO tools (name, link, rating, description, release_date, image_url)
SELECT
  'Perplexity AI',
  'https://perplexity.ai',
  4,
  'AI search engine that provides comprehensive answers with cited sources.',
  '2022-08-30',
  'https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/b0od9qpkxdnaagchppik'
WHERE NOT EXISTS (SELECT 1 FROM tools WHERE name = 'Perplexity AI');

INSERT INTO tools (name, link, rating, description, release_date, image_url)
SELECT
  'Cursor',
  'https://cursor.sh',
  5,
  'AI-first code editor that helps you write, edit, and navigate code faster.',
  '2023-02-22',
  'https://content.app-sources.com/s/52885656531178520/uploads/Images/cursor_AI-0230472.png'
WHERE NOT EXISTS (SELECT 1 FROM tools WHERE name = 'Cursor');

-- 设置行级安全策略，允许匿名访问读取数据
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- 创建策略允许所有人查看工具数据
DROP POLICY IF EXISTS "Allow anon select" ON tools;
CREATE POLICY "Allow anon select" ON tools
  FOR SELECT
  TO anon
  USING (true);

-- 确认数据已添加
SELECT * FROM tools; 
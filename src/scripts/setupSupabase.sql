-- Supabase 设置 SQL 脚本
-- 你可以在 Supabase 控制台的 SQL 编辑器中运行这个脚本

-- 创建工具表
CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  link TEXT NOT NULL,
  rating INTEGER NOT NULL,
  description TEXT NOT NULL,
  release_date TIMESTAMP NOT NULL,
  image_url TEXT NOT NULL
);

-- 添加RLS策略(行级安全)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- 创建允许匿名用户查询的策略
CREATE POLICY "Allow anonymous SELECT" ON tools
  FOR SELECT USING (true);

-- 添加一些示例数据 (仅当表为空时)
INSERT INTO tools (name, link, rating, description, release_date, image_url)
SELECT
  'ChatGPT',
  'https://chat.openai.com',
  5,
  'Advanced AI chatbot developed by OpenAI that understands and generates human-like text.',
  '2022-11-30'::TIMESTAMP,
  'https://static.vecteezy.com/system/resources/previews/021/608/790/original/chatgpt-logo-chat-gpt-icon-on-black-background-free-vector.jpg'
WHERE NOT EXISTS (SELECT 1 FROM tools LIMIT 1);

-- 添加更多示例数据
INSERT INTO tools (name, link, rating, description, release_date, image_url)
SELECT
  'Midjourney',
  'https://www.midjourney.com',
  4,
  'AI-powered service that generates images from text descriptions provided by users.',
  '2022-07-12'::TIMESTAMP,
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOBP-lBqTpCJbH7OLs9UAxvzNn69JYH6fNz6wU6UoFYw&s'
WHERE NOT EXISTS (SELECT 1 FROM tools LIMIT 1);

INSERT INTO tools (name, link, rating, description, release_date, image_url)
SELECT
  'Claude AI',
  'https://claude.ai',
  4,
  'Conversational AI assistant developed by Anthropic to be helpful, harmless, and honest.',
  '2023-03-14'::TIMESTAMP,
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-MAx13QcT_DGvSyd01QZ2IjFVkGU0F1vRK-Wn4Dld&s'
WHERE NOT EXISTS (SELECT 1 FROM tools LIMIT 1);

-- 创建一个 exec_sql 函数以便在种子脚本中使用
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
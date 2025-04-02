-- 创建类别表
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加默认类别数据
INSERT INTO categories (name, description) VALUES
('工具类', '各种实用工具'),
('开发类', '开发相关工具'),
('设计类', '设计相关工具'),
('AI类', 'AI相关工具'),
('娱乐类', '娱乐类工具')
ON CONFLICT (id) DO NOTHING;

-- 为工具表添加类别ID字段
ALTER TABLE tools ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);

-- 为工具表更新时间字段格式
ALTER TABLE tools 
  ALTER COLUMN release_date TYPE TIMESTAMP WITH TIME ZONE;

-- 更新工具表中的已有数据，设置随机类别
UPDATE tools SET category_id = floor(random() * 5) + 1 WHERE category_id IS NULL;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为类别表添加更新时间触发器
CREATE TRIGGER update_categories_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- 为工具表添加更新时间触发器（先尝试删除可能存在的触发器，然后创建新的）
DO $$
BEGIN
    -- 检查触发器是否存在
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tools_timestamp') THEN
        -- 创建触发器
        CREATE TRIGGER update_tools_timestamp
        BEFORE UPDATE ON tools
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
    END IF;
END
$$; 
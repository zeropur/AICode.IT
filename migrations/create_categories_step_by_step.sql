-- 步骤1: 创建类别表
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 步骤2: 添加默认类别数据
INSERT INTO categories (name, description) VALUES
('工具类', '各种实用工具'),
('开发类', '开发相关工具'),
('设计类', '设计相关工具'),
('AI类', 'AI相关工具'),
('娱乐类', '娱乐类工具')
ON CONFLICT (id) DO NOTHING;

-- 步骤3: 为工具表添加类别ID字段
ALTER TABLE tools ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);

-- 步骤4: 为工具表更新时间字段格式
ALTER TABLE tools ALTER COLUMN release_date TYPE TIMESTAMP WITH TIME ZONE;

-- 步骤5: 更新工具表中的已有数据，设置随机类别
UPDATE tools SET category_id = floor(random() * 5) + 1 WHERE category_id IS NULL;

-- 步骤6: 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 步骤7: 为类别表添加更新时间触发器
DROP TRIGGER IF EXISTS update_categories_timestamp ON categories;
CREATE TRIGGER update_categories_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- 步骤8: 为工具表添加更新时间触发器
DROP TRIGGER IF EXISTS update_tools_timestamp ON tools;
CREATE TRIGGER update_tools_timestamp
BEFORE UPDATE ON tools
FOR EACH ROW
EXECUTE FUNCTION update_timestamp(); 
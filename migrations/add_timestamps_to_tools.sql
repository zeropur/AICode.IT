-- 为工具表添加时间戳字段
ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 更新现有记录的时间戳
UPDATE tools SET 
created_at = NOW(), 
updated_at = NOW()
WHERE created_at IS NULL OR updated_at IS NULL; 
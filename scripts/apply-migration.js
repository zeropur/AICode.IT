const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 从环境变量获取Supabase凭据
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少Supabase凭据。请确保.env.local文件中有NEXT_PUBLIC_SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY。');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    // 读取迁移SQL文件
    const sqlFilePath = path.join(__dirname, '../migrations/create_categories_table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('开始执行数据库迁移...');
    
    // 执行SQL
    const { error } = await supabase.rpc('run_sql_query', { query: sql });
    
    if (error) {
      throw error;
    }
    
    console.log('数据库迁移成功完成！');
  } catch (error) {
    console.error('迁移过程中出错:', error);
    process.exit(1);
  }
}

runMigration(); 
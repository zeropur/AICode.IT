const fs = require('fs');
const path = require('path');

// 读取迁移SQL文件
const sqlFilePath = path.join(__dirname, '../migrations/create_categories_table.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// 输出SQL到控制台
console.log('-- 复制以下SQL并在Supabase SQL编辑器中执行:');
console.log('----------------------------------------------------');
console.log(sql);
console.log('----------------------------------------------------'); 
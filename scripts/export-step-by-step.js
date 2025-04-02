const fs = require('fs');
const path = require('path');

// 读取迁移SQL文件
const sqlFilePath = path.join(__dirname, '../migrations/create_categories_step_by_step.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// 分割SQL语句并逐个输出
const statements = sql.split(';').filter(stmt => stmt.trim());

console.log('-- 复制以下SQL并在Supabase SQL编辑器中执行:');
console.log('-- 请一次执行一个命令，确保每个命令都成功执行');
console.log('----------------------------------------------------');

statements.forEach((stmt, index) => {
  console.log(`-- 命令 ${index + 1}:`);
  console.log(stmt.trim() + ';');
  console.log('');
});

console.log('----------------------------------------------------'); 
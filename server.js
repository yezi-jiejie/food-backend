require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process'); // ← 新增这行
const routes = require('./src/routes');

// === 新增的数据库自动初始化代码 ===
try {
  console.log('🚀 开始自动初始化数据库...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  execSync('node prisma/seed.js', { stdio: 'inherit' });
  console.log('✅ 数据库初始化完成！');
} catch (error) {
  console.log('⚠️ 数据库初始化跳过（可能已初始化）');
}
// === 新增代码结束 ===

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

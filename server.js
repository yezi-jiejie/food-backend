require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const routes = require('./src/routes');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: '服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

const initDatabase = async () => {
  try {
    console.log('🔄 正在检查并创建数据库表...');
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
    console.log('✅ 数据库表初始化完成');
  } catch (error) {
    console.log('⚠️ 数据库表可能已存在，继续启动服务器');
  }
};

app.listen(PORT, async () => {
  console.log(`🚀 服务器运行在端口: ${PORT}`);
  initDatabase().catch(console.error);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
require('dotenv').config(); // 确保加载环境变量

const app = express();
const PORT = process.env.PORT || 3000;

// 调试中间件 - 检查环境变量
app.use((req, res, next) => {
  console.log('当前DATABASE_URL:', process.env.DATABASE_URL ? '已设置' : '未设置');
  next();
});

app.use(cors());
app.use(express.json());

// 食品数据接口
app.get('/api/foods', async (req, res) => {
  try {
    console.log('环境变量状态:', {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrl: process.env.DATABASE_URL ? '已设置' : '未设置'
    });

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const foods = await prisma.food.findMany();
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ 
      success: false, 
      message: '获取食品失败',
      error: error.message
    });
  }
});

app.use('/api', routes);

app.listen(PORT, '0.0.0.0', () => {
  console.log('服务器启动环境变量检查:');
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✓ 已设置' : '✗ 未设置');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✓ 已设置' : '✗ 未设置');
  console.log(`服务器运行在端口 ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// 临时调试路由 - 检查数据库状态
app.get('/debug-db', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const foodCount = await prisma.food.count();
    const tables = await prisma.$queryRaw`SHOW TABLES`;
    
    res.json({
      success: true,
      foodCount: foodCount,
      tables: tables,
      database: '连接正常'
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      error: '数据库连接或查询失败'
    });
  }
});

// 临时调试路由 - 直接执行种子
app.get('/debug-seed', async (req, res) => {
  try {
    console.log('手动执行种子数据...');
    await require('./prisma/seed.js');
    res.json({ success: true, message: '种子数据执行成功' });
  } catch (error) {
    console.error('种子执行失败:', error);
    res.json({ success: false, message: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

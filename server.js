const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// 数据库种子检查函数
async function seedIfNeeded() {
  try {
    console.log('开始检查数据库种子数据...');
    
    // 检查是否已有食品数据
    const foodCount = await prisma.food.count();
    console.log(`当前数据库食品数量: ${foodCount}`);
    
    if (foodCount === 0) {
      console.log('数据库为空，开始执行种子数据...');
      // 执行种子脚本
      await require('./prisma/seed.js');
      console.log('种子数据执行完成！');
    } else {
      console.log(`数据库中已有 ${foodCount} 条食品记录，跳过种子执行`);
    }
  } catch (error) {
    console.log('种子执行检查出错:', error.message);
    console.log('错误详情:', error);
  }
}

// 应用启动时调用种子检查
seedIfNeeded().catch(console.error);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

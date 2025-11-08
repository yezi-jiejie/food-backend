const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 3000;

// 修复 BigInt JSON 序列化问题
BigInt.prototype.toJSON = function() {
  return this.toString();
};

// 直接硬编码数据库连接
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root:vnGseEkwdsCyhJYIRPMTJpNuzrbXUghz@metro.proxy.rlwy.net:10233/railway"
    }
  }
});

// 初始化数据库和数据填充
async function initializeDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 运行 Prisma 迁移创建所有表结构
    const { execSync } = require('child_process');
    console.log('运行数据库迁移...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ 数据库表结构创建成功');
    
    // 运行数据填充
    console.log('开始填充初始数据...');
    require('./prisma/seed.js');
    console.log('✅ 初始数据填充完成');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
  }
}

app.use(cors());
app.use(express.json());

// 添加数据库连接测试
app.get('/test-db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ 数据库连接成功:', result);
    res.json({ success: true, message: '数据库连接成功', data: result });
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    res.json({ success: false, message: '数据库连接失败', error: error.message });
  }
});

// 初始化数据库
initializeDatabase();

app.use('/api', routes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

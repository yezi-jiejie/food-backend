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

app.use(cors());
app.use(express.json());

// 初始化数据库表
app.get('/init-db', async (req, res) => {
  try {
    console.log('开始创建数据库表...');
    
    // 创建 Food 表
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS Food (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        calories INT NOT NULL,
        protein FLOAT NOT NULL,
        fat FLOAT NOT NULL,
        carbs FLOAT NOT NULL,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    // 插入示例数据
    await prisma.$executeRaw`
      INSERT IGNORE INTO Food (name, calories, protein, fat, carbs, image_url) VALUES
      ('苹果', 52, 0.3, 0.2, 14, 'picture/苹果.jpg'),
      ('鸡胸肉', 165, 31, 3.6, 0, 'picture/鸡胸肉.jpg'),
      ('燕麦', 389, 17, 7, 66, 'picture/燕麦.jpg')
    `;
    
    console.log('数据库表创建成功');
    const foods = await prisma.food.findMany();
    res.json({ success: true, message: '数据库初始化成功', count: foods.length, data: foods });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    res.json({ success: false, error: error.message });
  }
});

// 数据库连接测试
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

// 食品数据调试接口
app.get('/debug-foods', async (req, res) => {
  try {
    console.log('开始查询食品数据...');
    const foods = await prisma.food.findMany();
    console.log('查询到的食品数据:', foods);
    res.json({ success: true, count: foods.length, data: foods });
  } catch (error) {
    console.error('查询食品失败:', error);
    res.json({ success: false, error: error.message });
  }
});

app.use('/api', routes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

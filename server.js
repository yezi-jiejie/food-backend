const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 3000;

// 直接硬编码数据库连接，绕过环境变量问题
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root:vnGseEkwdsCyhJYIRPMTJpNuzrbXUghz@metro.proxy.rlwy.net:10233/railway"
    }
  }
});

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

app.use('/api', routes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

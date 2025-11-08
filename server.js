const { execSync } = require('child_process');
try {
  console.log('正在检查并创建数据库表...');
  execSync('npx prisma db push --force', { stdio: 'inherit' });
  console.log('数据库表创建完成');
} catch (error) {
  console.log('数据库表可能已存在，继续启动服务器');
}

const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: '服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口: ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const routes = require('./src/routes');

try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  execSync('node prisma/seed.js', { stdio: 'inherit' });
} catch (error) {}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

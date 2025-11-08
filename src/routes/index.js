const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/foods', async (req, res) => {
  try {
    console.log('开始获取食品数据...');
    const foods = await prisma.food.findMany();
    console.log(`成功获取 ${foods.length} 条食品数据`);
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('获取食品数据失败:', error);
    res.json({ success: false, message: '获取食品数据失败: ' + error.message });
  }
});

module.exports = router;

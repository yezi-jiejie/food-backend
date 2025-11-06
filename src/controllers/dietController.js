const prisma = require('../utils/prisma');

const addDietLog = async (req, res) => {
  try {
    const { foodId, quantity = 100 } = req.body;
    const userId = req.user.id;
    const date = new Date().toISOString().split('T')[0];

    const food = await prisma.food.findUnique({
      where: { id: parseInt(foodId) }
    });
    if (!food) {
      return res.status(404).json({ success: false, message: '食品不存在' });
    }

    const dietLog = await prisma.dietLog.create({
      data: {
        userId,
        foodId: parseInt(foodId),
        quantity,
        date
      },
      include: {
        food: true
      }
    });

    res.status(201).json({ success: true, data: dietLog });
  } catch (error) {
    res.status(500).json({ success: false, message: '添加到饮食记录失败' });
  }
};

const getUserDietLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;
    const where = { userId };
    if (date) {
      where.date = date;
    }

    const dietLogs = await prisma.dietLog.findMany({
      where,
      include: {
        food: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: dietLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取饮食记录失败' });
  }
};

const updateDietLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { foodId, quantity, date } = req.body;

    const existingLog = await prisma.dietLog.findFirst({
      where: { 
        id: parseInt(id),
        userId: userId
      }
    });

    if (!existingLog) {
      return res.status(404).json({ success: false, message: '饮食记录不存在' });
    }

    if (foodId) {
      const food = await prisma.food.findUnique({
        where: { id: parseInt(foodId) }
      });
      if (!food) {
        return res.status(404).json({ success: false, message: '食品不存在' });
      }
    }

    const updatedLog = await prisma.dietLog.update({
      where: { id: parseInt(id) },
      data: {
        ...(foodId && { foodId: parseInt(foodId) }),
        ...(quantity && { quantity: parseFloat(quantity) }),
        ...(date && { date })
      },
      include: {
        food: true
      }
    });

    res.json({ success: true, data: updatedLog });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新饮食记录失败' });
  }
};

const deleteDietLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLog = await prisma.dietLog.findFirst({
      where: { 
        id: parseInt(id),
        userId: userId
      }
    });

    if (!existingLog) {
      return res.status(404).json({ success: false, message: '饮食记录不存在' });
    }

    await prisma.dietLog.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: '饮食记录已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除饮食记录失败' });
  }
};

module.exports = { 
  addDietLog, 
  getUserDietLogs,
  updateDietLog, 
  deleteDietLog   
};
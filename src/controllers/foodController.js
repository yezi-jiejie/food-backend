const prisma = require('../utils/prisma');

const getAllFoods = async (req, res) => {
  try {
    const foods = await prisma.food.findMany({ 
      orderBy: { name: 'asc' } 
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '获取食品失败' 
    });
  }
};

const createFood = async (req, res) => {
  try {
    const { name, calories, protein, fat, carbs, imageUrl } = req.body;
    
    if (!name || calories === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: '食品名称和热量为必填项' 
      });
    }

    const existingFood = await prisma.food.findFirst({ 
      where: { name: name.trim() } 
    });
    
    if (existingFood) {
      return res.status(400).json({ 
        success: false, 
        message: '食品名称已存在' 
      });
    }

    const foodData = {
      name: name.trim(),
      calories: Math.max(0, parseInt(calories) || 0),
      protein: Math.max(0, parseFloat(protein) || 0),
      fat: Math.max(0, parseFloat(fat) || 0),
      carbs: Math.max(0, parseFloat(carbs) || 0),
      imageUrl: imageUrl || ''
    };

    const food = await prisma.food.create({
      data: foodData
    });
    
    res.status(201).json({ 
      success: true, 
      data: food,
      message: '食品添加成功'
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false, 
        message: '食品名称已存在' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: '添加食品失败，请检查数据格式' 
    });
  }
};

const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, calories, protein, fat, carbs, imageUrl } = req.body;

    const existingFood = await prisma.food.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingFood) {
      return res.status(404).json({
        success: false,
        message: '食品不存在'
      });
    }

    if (name && name.trim() !== existingFood.name) {
      const nameExists = await prisma.food.findFirst({
        where: { name: name.trim() }
      });
      
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: '食品名称已存在'
        });
      }
    }

    const food = await prisma.food.update({
      where: { id: parseInt(id) },
      data: { 
        name: name?.trim(),
        calories: parseInt(calories) || 0,
        protein: parseFloat(protein) || 0,
        fat: parseFloat(fat) || 0,
        carbs: parseFloat(carbs) || 0,
        imageUrl: imageUrl || ''
      }
    });
    
    res.json({ 
      success: true, 
      data: food,
      message: '食品更新成功'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: '食品不存在'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: '更新食品失败' 
    });
  }
};

const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingFood = await prisma.food.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingFood) {
      return res.status(404).json({
        success: false,
        message: '食品不存在'
      });
    }
    
    await prisma.food.delete({ 
      where: { id: parseInt(id) } 
    });
    
    res.json({ 
      success: true, 
      message: '食品已删除' 
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: '食品不存在'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: '删除食品失败' 
    });
  }
};

module.exports = { 
  getAllFoods, 
  createFood, 
  updateFood, 
  deleteFood 
};
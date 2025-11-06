const prisma = require('../utils/prisma');

const getNutritionAnalysis = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;
    
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const dietLogs = await prisma.dietLog.findMany({
      where: { 
        userId,
        date: targetDate
      },
      include: { food: true }
    });
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    
    dietLogs.forEach(log => {
      const ratio = log.quantity / 100;
      totalCalories += log.food.calories * ratio;
      totalProtein += log.food.protein * ratio;
      totalFat += log.food.fat * ratio;
      totalCarbs += log.food.carbs * ratio;
    });
    
    res.json({
      success: true,
      data: {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein),
        fat: Math.round(totalFat),
        carbs: Math.round(totalCarbs),
        date: targetDate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取营养分析失败' });
  }
};

const getWeeklyNutritionData = async (req, res) => {
  try {
    const userId = req.user.id;
    const weeklyData = {
      calories: [],
      protein: [],
      fat: [],
      carbs: [],
      dates: []
    };
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dietLogs = await prisma.dietLog.findMany({
        where: { 
          userId,
          date: dateStr
        },
        include: { food: true }
      });
      
      let dayCalories = 0;
      let dayProtein = 0;
      let dayFat = 0;
      let dayCarbs = 0;
      
      dietLogs.forEach(log => {
        const ratio = log.quantity / 100;
        dayCalories += log.food.calories * ratio;
        dayProtein += log.food.protein * ratio;
        dayFat += log.food.fat * ratio;
        dayCarbs += log.food.carbs * ratio;
      });
      
      weeklyData.calories.push(Math.round(dayCalories));
      weeklyData.protein.push(Math.round(dayProtein));
      weeklyData.fat.push(Math.round(dayFat));
      weeklyData.carbs.push(Math.round(dayCarbs));
      weeklyData.dates.push(dateStr);
    }
    
    res.json({ success: true, data: weeklyData });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取周营养数据失败' });
  }
};

module.exports = { getNutritionAnalysis, getWeeklyNutritionData };
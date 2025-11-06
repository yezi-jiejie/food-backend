const prisma = require('../utils/prisma');

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        gender: true,
        age: true,
        height: true,
        weight: true,
        calorie_goal: true,
        diet_preferences: true,
        allergies: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const processedUser = {
      ...user,
      diet_preferences: user.diet_preferences ? JSON.parse(user.diet_preferences) : [],
      allergies: user.allergies ? JSON.parse(user.allergies) : []
    };

    res.json({ 
      success: true, 
      data: processedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取用户信息失败' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      gender, 
      age, 
      height, 
      weight, 
      calorie_goal, 
      diet_preferences, 
      allergies 
    } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (gender !== undefined) updateData.gender = gender;
    if (age !== undefined) updateData.age = age !== null ? parseInt(age) : null;
    if (height !== undefined) updateData.height = height !== null ? parseFloat(height) : null;
    if (weight !== undefined) updateData.weight = weight !== null ? parseFloat(weight) : null;
    if (calorie_goal !== undefined) updateData.calorie_goal = parseInt(calorie_goal) || 2000;
    
    if (diet_preferences !== undefined) {
      updateData.diet_preferences = Array.isArray(diet_preferences) 
        ? JSON.stringify(diet_preferences) 
        : (diet_preferences || '[]');
    }
    
    if (allergies !== undefined) {
      updateData.allergies = Array.isArray(allergies) 
        ? JSON.stringify(allergies) 
        : (allergies || '[]');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { 
        id: true, 
        username: true, 
        email: true, 
        role: true, 
        gender: true,
        age: true,
        height: true,
        weight: true,
        calorie_goal: true,
        diet_preferences: true,
        allergies: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const processedUser = {
      ...updatedUser,
      diet_preferences: updatedUser.diet_preferences ? JSON.parse(updatedUser.diet_preferences) : [],
      allergies: updatedUser.allergies ? JSON.parse(updatedUser.allergies) : []
    };

    res.json({ 
      success: true, 
      message: '用户信息更新成功', 
      data: processedUser 
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false, 
        message: '用户名或邮箱已存在' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: '更新用户信息失败' 
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        username: true, 
        email: true, 
        role: true, 
        createdAt: true 
      }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取用户列表失败' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({ where: { id: parseInt(id) } });
    
    res.json({ success: true, message: '用户已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除用户失败' });
  }
};

module.exports = { 
  getCurrentUser, 
  updateUser,
  getAllUsers, 
  deleteUser 
};
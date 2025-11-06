const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名、密码和邮箱为必填项' 
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { username: username.trim() }, 
          { email: email.trim().toLowerCase() }
        ] 
      }
    });
    
    if (existingUser) {
      if (existingUser.username === username.trim()) {
        return res.status(400).json({ 
          success: false, 
          message: '用户名已被使用' 
        });
      }
      if (existingUser.email === email.trim().toLowerCase()) {
        return res.status(400).json({ 
          success: false, 
          message: '邮箱已被使用' 
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { 
        username: username.trim(), 
        password: hashedPassword, 
        email: email.trim().toLowerCase(),
        role: 'USER', 
        calorie_goal: 2000,
        diet_preferences: '[]', 
        allergies: '[]' 
      }
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        }
      }
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
      message: '注册失败，请稍后重试' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await prisma.user.findUnique({ 
      where: { username: username.trim() } 
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }

    if (user.role === 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: '管理员账号请使用管理员登录入口' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '登录失败' 
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await prisma.user.findUnique({ 
      where: { username: username.trim() } 
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '管理员账号或密码错误' 
      });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: '普通用户账号请使用用户登录入口' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: '管理员账号或密码错误' 
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '登录失败' 
    });
  }
};

module.exports = { register, login, adminLogin };
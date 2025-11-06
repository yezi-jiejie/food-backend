const prisma = require('../utils/prisma');

const getAllWarnings = async (req, res) => {
  try {
    const warnings = await prisma.warning.findMany({
      orderBy: { publishDate: 'desc' }
    });
    res.json({ success: true, data: warnings });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取安全预警失败' });
  }
};

const createWarning = async (req, res) => {
  try {
    const { foodName, riskType, riskLevel, description, imageUrl, publishDate } = req.body;

    if (!foodName || !riskType || !riskLevel || !description || !publishDate) {
      return res.status(400).json({ success: false, message: '请填写完整预警信息' });
    }

    const warning = await prisma.warning.create({
      data: { foodName, riskType, riskLevel, description, imageUrl, publishDate }
    });

    res.status(201).json({ success: true, data: warning });
  } catch (error) {
    res.status(500).json({ success: false, message: '发布安全预警失败' });
  }
};

const updateWarning = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodName, riskType, riskLevel, description, imageUrl, publishDate } = req.body;

    const existingWarning = await prisma.warning.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingWarning) {
      return res.status(404).json({ success: false, message: '预警不存在' });
    }

    const updatedWarning = await prisma.warning.update({
      where: { id: parseInt(id) },
      data: { foodName, riskType, riskLevel, description, imageUrl, publishDate }
    });

    res.json({ success: true, data: updatedWarning });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新安全预警失败' });
  }
};

const deleteWarning = async (req, res) => {
  try {
    const { id } = req.params;

    const existingWarning = await prisma.warning.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingWarning) {
      return res.status(404).json({ success: false, message: '预警不存在' });
    }

    await prisma.warning.delete({ where: { id: parseInt(id) } });

    res.json({ success: true, message: '安全预警已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除安全预警失败' });
  }
};

module.exports = { 
  getAllWarnings, 
  createWarning, 
  updateWarning, 
  deleteWarning 
};
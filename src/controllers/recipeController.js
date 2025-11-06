const prisma = require('../utils/prisma');

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { tags: true },
      orderBy: { id: 'asc' }
    });
    
    const recommendedRecipeNames = [
      '地中海式烤鸡胸配蔬菜',
      '藜麦牛油果沙拉', 
      '番茄炖牛肉'
    ];
    
    const transformedRecipes = recipes
      .filter(recipe => !recommendedRecipeNames.includes(recipe.name))
      .map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        prepTime: recipe.prepTime,
        mealType: recipe.mealType,
        calories: recipe.calories,
        ingredients: typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients,
        steps: typeof recipe.steps === 'string' ? JSON.parse(recipe.steps) : recipe.steps,
        tags: recipe.tags.map(tag => ({
          id: tag.id,
          tag: tag.tag,
          recipeId: tag.recipeId
        }))
      }));
    
    res.json({ success: true, data: transformedRecipes });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取食谱失败' });
  }
};

const getRecommendedRecipes = async (req, res) => {
  try {
    const recommendedRecipeNames = [
      '地中海式烤鸡胸配蔬菜',
      '藜麦牛油果沙拉', 
      '番茄炖牛肉'
    ];
    
    const recommendedRecipes = await prisma.recipe.findMany({
      where: {
        name: {
          in: recommendedRecipeNames
        }
      },
      include: { tags: true }
    });
    
    const transformedRecipes = recommendedRecipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      prepTime: recipe.prepTime,
      mealType: recipe.mealType,
      calories: recipe.calories,
      ingredients: typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients,
      steps: typeof recipe.steps === 'string' ? JSON.parse(recipe.steps) : recipe.steps,
      tags: recipe.tags.map(tag => ({
        id: tag.id,
        tag: tag.tag,
        recipeId: tag.recipeId
      }))
    }));
    
    res.json({ success: true, data: transformedRecipes });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取推荐食谱失败' });
  }
};

const getRecipeTags = async (req, res) => {
  try {
    const tags = await prisma.recipeTag.findMany();
    
    const transformedTags = tags.map(tag => ({
      id: tag.id,
      recipeId: tag.recipeId,
      tag: tag.tag
    }));
    
    res.json({ success: true, data: transformedTags });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取食谱标签失败' });
  }
};

module.exports = { getAllRecipes, getRecommendedRecipes, getRecipeTags };
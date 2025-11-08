const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController');
const warningController = require('../controllers/warningController');
const userController = require('../controllers/userController');
const dietController = require('../controllers/dietController');
const recipeController = require('../controllers/recipeController');
const nutritionController = require('../controllers/nutritionController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/admin/login', authController.adminLogin);

router.get('/user/current', authenticate, userController.getCurrentUser);
router.put('/user/update', authenticate, userController.updateUser);

router.get('/foods', foodController.getAllFoods);
router.post('/foods', authenticate, isAdmin, foodController.createFood);
router.put('/foods/:id', authenticate, isAdmin, foodController.updateFood);
router.delete('/foods/:id', authenticate, isAdmin, foodController.deleteFood);

router.get('/warnings', warningController.getAllWarnings);
router.get('/food-warnings', warningController.getAllWarnings);
router.post('/warnings', authenticate, isAdmin, warningController.createWarning);
router.put('/warnings/:id', authenticate, isAdmin, warningController.updateWarning);
router.delete('/warnings/:id', authenticate, isAdmin, warningController.deleteWarning);

router.get('/users', authenticate, isAdmin, userController.getAllUsers);
router.delete('/users/:id', authenticate, isAdmin, userController.deleteUser);

router.post('/diet/add', authenticate, dietController.addDietLog);
router.get('/diet/records', authenticate, dietController.getUserDietLogs);
router.get('/diet-records', authenticate, dietController.getUserDietLogs); 
router.post('/diet-records', authenticate, dietController.addDietLog); 
router.put('/diet-records/:id', authenticate, dietController.updateDietLog);
router.delete('/diet-records/:id', authenticate, dietController.deleteDietLog);

router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/recommended', recipeController.getRecommendedRecipes);
router.get('/recipe-tags', recipeController.getRecipeTags);

router.get('/nutrition/analysis', authenticate, nutritionController.getNutritionAnalysis);
router.get('/nutrition/weekly', authenticate, nutritionController.getWeeklyNutritionData);

module.exports = router;

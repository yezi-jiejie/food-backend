const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const initialData = {
  users: [
    {
      username: '管理员',
      email: 'guanliyuan@163.com',
      password: '123456',
      role: 'ADMIN',
      gender: 'male',
      age: 35,
      height: 175,
      weight: 70,
      calorie_goal: 2200,
      diet_preferences: JSON.stringify(['highProtein', 'lowFat']),
      allergies: JSON.stringify(['peanut'])
    },
    {
      username: '一一',
      email: 'yiyi@163.com',
      password: '123456',
      role: 'USER',
      gender: 'female',
      age: 28,
      height: 165,
      weight: 55,
      calorie_goal: 1800,
      diet_preferences: JSON.stringify(['vegetarian']),
      allergies: JSON.stringify([])
    },
    {
      username: '二二',
      email: 'erer@163.com',
      password: '123456',
      role: 'USER',
      gender: 'male',
      age: 32,
      height: 178,
      weight: 75,
      calorie_goal: 2400,
      diet_preferences: JSON.stringify(['lowCarb']),
      allergies: JSON.stringify(['seafood'])
    },
    {
      username: '三三',
      email: 'sansan@163.com',
      password: '123456',
      role: 'USER',
      gender: 'female',
      age: 25,
      height: 160,
      weight: 50,
      calorie_goal: 1600,
      diet_preferences: JSON.stringify(['highProtein', 'lowCarb']),
      allergies: JSON.stringify(['milk'])
    }
  ],

  foods: [
    { name: '苹果', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, imageUrl: 'picture/苹果.jpg' },
    { name: '鸡胸肉', calories: 165, protein: 31, fat: 3.6, carbs: 0, imageUrl: 'picture/鸡胸肉.jpg' },
    { name: '燕麦', calories: 389, protein: 17, fat: 7, carbs: 66, imageUrl: 'picture/燕麦.jpg' },
    { name: '香蕉', calories: 89, protein: 1.1, fat: 0.3, carbs: 22.8, imageUrl: 'picture/香蕉.jpg' },
    { name: '鸡蛋', calories: 155, protein: 13, fat: 11, carbs: 1.1, imageUrl: 'picture/鸡蛋.jpg' },
    { name: '牛奶', calories: 61, protein: 3.2, fat: 3.6, carbs: 4.8, imageUrl: 'picture/牛奶.jpg' },
    { name: '牛肉', calories: 250, protein: 26, fat: 15, carbs: 0, imageUrl: 'picture/牛肉.jpg' },
    { name: '三文鱼', calories: 208, protein: 20, fat: 13, carbs: 0, imageUrl: 'picture/三文鱼.jpg' },
    { name: '西兰花', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, imageUrl: 'picture/西兰花.jpg' },
    { name: '米饭', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, imageUrl: 'picture/米饭.jpg' },
    { name: '菠菜', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, imageUrl: 'picture/菠菜.jpg' },
    { name: '土豆', calories: 77, protein: 2, fat: 0.1, carbs: 17, imageUrl: 'picture/土豆.jpg' },
    { name: '豆腐', calories: 76, protein: 8.1, fat: 4.2, carbs: 1.9, imageUrl: 'picture/豆腐.jpg' },
    { name: '橙子', calories: 47, protein: 0.9, fat: 0.1, carbs: 12, imageUrl: 'picture/橙子.jpg' },
    { name: '草莓', calories: 32, protein: 0.7, fat: 0.3, carbs: 7.7, imageUrl: 'picture/草莓.jpg' },
    { name: '酸奶', calories: 61, protein: 3.5, fat: 3.3, carbs: 4.7, imageUrl: 'picture/酸奶.jpg' },
    { name: '玉米', calories: 86, protein: 3.3, fat: 1.2, carbs: 19, imageUrl: 'picture/玉米.jpg' },
    { name: '花生', calories: 567, protein: 25.8, fat: 49.2, carbs: 16.1, imageUrl: 'picture/花生.jpg' },
    { name: '胡萝卜', calories: 41, protein: 0.9, fat: 0.2, carbs: 10, imageUrl: 'picture/胡萝卜.jpg' },
    { name: '面包', calories: 265, protein: 9, fat: 3.2, carbs: 49, imageUrl: 'picture/面包.jpg' }
  ],

  warnings: [
    {
      foodName: '草莓',
      riskType: '农药超标',
      riskLevel: 'high',
      description: '某品牌草莓检测出多菌灵超标，请谨慎购买',
      imageUrl: 'picture/草莓.jpg',
      publishDate: '2025-05-20'
    },
    {
      foodName: '奶皮子酸奶',
      riskType: '酵母超标',
      riskLevel: 'high',
      description: '某品牌奶皮子酸奶酵母超标，已下架',
      imageUrl: 'picture/奶皮子酸奶.jpeg',
      publishDate: '2025-06-14'
    },
    {
      foodName: '三文鱼',
      riskType: '大肠菌群',
      riskLevel: 'medium',
      description: '部分散装三文鱼检测出含有大肠菌群',
      imageUrl: 'picture/三文鱼.jpeg',
      publishDate: '2022-11-11'
    },
    {
      foodName: '生菜',
      riskType: '阿维菌素超标',
      riskLevel: 'medium',
      description: '某商店生菜检测出阿维菌素超标',
      imageUrl: 'picture/生菜.jpg',
      publishDate: '2024-05-22'
    },
    {
      foodName: '花生酱',
      riskType: '过氧化值超标',
      riskLevel: 'low',
      description: '某品牌花生酱过氧化值（以脂肪计）超标',
      imageUrl: 'picture/花生酱.jpg',
      publishDate: '2024-07-26'
    }
  ],

  recipes: [
    { name: '燕麦水果碗', mealType: 'breakfast', description: '富含纤维和维生素的健康早餐', calories: 320, prepTime: '10分钟', imageUrl: 'picture/燕麦水果碗.jpg', ingredients: JSON.stringify(['燕麦片 50g', '牛奶 200ml', '混合水果 100g', '蜂蜜 1勺']), steps: JSON.stringify(['准备食材', '混合燕麦和牛奶', '加入水果', '淋上蜂蜜']) },
    { name: '全麦吐司配牛油果', mealType: 'breakfast', description: '健康脂肪与全谷物的完美结合', calories: 280, prepTime: '5分钟', imageUrl: 'picture/全麦吐司配牛油果.jpg', ingredients: JSON.stringify(['全麦吐司 2片', '牛油果 1个', '柠檬汁 适量', '盐 少许']), steps: JSON.stringify(['吐司烤至金黄', '牛油果捣成泥', '加入柠檬汁和盐', '涂抹在吐司上']) },
    { name: '蔬菜鸡蛋卷', mealType: 'breakfast', description: '高蛋白早餐，提供持久能量', calories: 250, prepTime: '15分钟', imageUrl: 'picture/蔬菜鸡蛋卷.jpg', ingredients: JSON.stringify(['鸡蛋 3个', '菠菜 50g', '胡萝卜 30g', '芝士 20g']), steps: JSON.stringify(['蔬菜切碎', '鸡蛋打散', '混合所有食材', '煎至金黄']) },
    { name: '希腊酸奶配坚果', mealType: 'breakfast', description: '高蛋白低碳水，适合健身人士', calories: 300, prepTime: '5分钟', imageUrl: 'picture/希腊酸奶配坚果.jpg', ingredients: JSON.stringify(['希腊酸奶 200g', '混合坚果 30g', '蜂蜜 1勺', '莓果 50g']), steps: JSON.stringify(['酸奶倒入碗中', '撒上坚果', '加入莓果', '淋上蜂蜜']) },
    { name: '蔬菜豆腐汤', mealType: 'breakfast', description: '清淡暖胃，适合早晨', calories: 200, prepTime: '20分钟', imageUrl: 'picture/蔬菜豆腐汤.jpg', ingredients: JSON.stringify(['豆腐 150g', '白菜 100g', '香菇 3朵', '高汤 500ml']), steps: JSON.stringify(['食材切块', '高汤煮沸', '加入食材', '煮10分钟']) },
    
    { name: '藜麦鸡胸沙拉', mealType: 'lunch', description: '高蛋白低脂，营养均衡', calories: 450, prepTime: '20分钟', imageUrl: 'picture/藜麦鸡胸沙拉.jpg', ingredients: JSON.stringify(['藜麦 100g', '鸡胸肉 150g', '蔬菜 200g', '橄榄油 1勺']), steps: JSON.stringify(['煮藜麦', '煎鸡胸肉', '混合蔬菜', '加入调料']) },
    { name: '番茄牛肉意面', mealType: 'lunch', description: '富含番茄红素和铁质', calories: 520, prepTime: '30分钟', imageUrl: 'picture/番茄牛肉意面.jpg', ingredients: JSON.stringify(['意面 100g', '牛肉 150g', '番茄 2个', '洋葱 1个']), steps: JSON.stringify(['煮意面', '炒牛肉', '制作番茄酱', '混合所有食材']) },
    { name: '蔬菜炒饭', mealType: 'lunch', description: '多种蔬菜提供丰富维生素', calories: 480, prepTime: '15分钟', imageUrl: 'picture/蔬菜炒饭.jpg', ingredients: JSON.stringify(['米饭 200g', '鸡蛋 2个', '混合蔬菜 150g', '酱油 1勺']), steps: JSON.stringify(['炒鸡蛋', '加入蔬菜', '加入米饭', '调味翻炒']) },
    { name: '烤鱼配烤蔬菜', mealType: 'lunch', description: 'Omega-3脂肪酸丰富', calories: 380, prepTime: '25分钟', imageUrl: 'picture/烤鱼配烤蔬菜.jpg', ingredients: JSON.stringify(['鱼排 200g', '西兰花 100g', '胡萝卜 100g', '橄榄油 1勺']), steps: JSON.stringify(['腌制鱼排', '切配蔬菜', '烤制20分钟', '装盘']) },
    { name: '虾仁豆腐汤', mealType: 'lunch', description: '低卡路里，适合减脂', calories: 280, prepTime: '20分钟', imageUrl: 'picture/虾仁豆腐汤.jpg', ingredients: JSON.stringify(['虾仁 100g', '豆腐 150g', '青菜 100g', '姜片 适量']), steps: JSON.stringify(['处理虾仁', '切豆腐', '煮汤', '调味']) },
    
    { name: '蒸鸡胸配西兰花', mealType: 'dinner', description: '高蛋白低脂晚餐', calories: 350, prepTime: '25分钟', imageUrl: 'picture/蒸鸡胸配西兰花.jpg', ingredients: JSON.stringify(['鸡胸肉 200g', '西兰花 200g', '蒜末 适量', '生抽 1勺']), steps: JSON.stringify(['腌制鸡胸', '准备西兰花', '蒸制15分钟', '调味']) },
    { name: '烤三文鱼配芦笋', mealType: 'dinner', description: '富含健康脂肪', calories: 420, prepTime: '20分钟', imageUrl: 'picture/烤三文鱼配芦笋.jpg', ingredients: JSON.stringify(['三文鱼 200g', '芦笋 150g', '柠檬 1个', '橄榄油 1勺']), steps: JSON.stringify(['腌制三文鱼', '准备芦笋', '烤制15分钟', '挤柠檬汁']) },
    { name: '蔬菜豆腐煲', mealType: 'dinner', description: '素食者的完美晚餐', calories: 300, prepTime: '30分钟', imageUrl: 'picture/蔬菜豆腐煲.jpg', ingredients: JSON.stringify(['豆腐 200g', '蘑菇 100g', '青菜 100g', '高汤 500ml']), steps: JSON.stringify(['准备食材', '炖煮20分钟', '调味', '装盘']) },
    { name: '牛肉蔬菜卷', mealType: 'dinner', description: '均衡营养，易于消化', calories: 380, prepTime: '15分钟', imageUrl: 'picture/牛肉蔬菜卷.jpg', ingredients: JSON.stringify(['牛肉片 150g', '生菜 100g', '胡萝卜 50g', '酱料 适量']), steps: JSON.stringify(['煎牛肉', '切蔬菜', '卷制', '装盘']) },
    { name: '蘑菇汤配全麦面包', mealType: 'dinner', description: '温暖舒适的轻晚餐', calories: 320, prepTime: '25分钟', imageUrl: 'picture/蘑菇汤配全麦面包.jpg', ingredients: JSON.stringify(['蘑菇 200g', '全麦面包 2片', '牛奶 200ml', '洋葱 半个']), steps: JSON.stringify(['炒蘑菇', '煮汤', '烤面包', '搭配食用']) },
    
    { name: '地中海式烤鸡胸配蔬菜', mealType: 'dinner', description: '地中海风味烤鸡胸，搭配新鲜蔬菜，富含蛋白质和纤维', calories: 380, prepTime: '35分钟', imageUrl: 'picture/地中海式烤鸡胸配蔬菜.jpg', ingredients: JSON.stringify(['鸡胸肉 200g', '彩椒 100g', '西葫芦 100g', '橄榄油 2勺', '香草 适量']), steps: JSON.stringify(['腌制鸡胸', '切配蔬菜', '烤制25分钟', '装盘装饰']) },
    { name: '藜麦牛油果沙拉', mealType: 'lunch', description: '营养丰富的藜麦搭配牛油果，健康又美味', calories: 320, prepTime: '20分钟', imageUrl: 'picture/藜麦牛油果沙拉.jpg', ingredients: JSON.stringify(['藜麦 100g', '牛油果 1个', '小番茄 100g', '柠檬汁 适量']), steps: JSON.stringify(['煮藜麦', '切牛油果', '混合食材', '加入调料']) },
    { name: '番茄炖牛肉', mealType: 'dinner', description: '慢炖牛肉配番茄，肉质鲜嫩，汤汁浓郁', calories: 450, prepTime: '60分钟', imageUrl: 'picture/番茄炖牛肉.jpg', ingredients: JSON.stringify(['牛肉 300g', '番茄 3个', '胡萝卜 100g', '洋葱 1个']), steps: JSON.stringify(['处理牛肉', '炒香蔬菜', '慢炖45分钟', '调味']) }
  ],

  recipeTags: [
    { recipeName: '燕麦水果碗', tag: '高纤维' }, { recipeName: '燕麦水果碗', tag: '低脂' }, { recipeName: '燕麦水果碗', tag: '快速' },
    { recipeName: '全麦吐司配牛油果', tag: '健康脂肪' }, { recipeName: '全麦吐司配牛油果', tag: '全谷物' }, { recipeName: '全麦吐司配牛油果', tag: '素食' },
    { recipeName: '蔬菜鸡蛋卷', tag: '高蛋白' }, { recipeName: '蔬菜鸡蛋卷', tag: '蔬菜' }, { recipeName: '蔬菜鸡蛋卷', tag: '低卡' },
    { recipeName: '希腊酸奶配坚果', tag: '高蛋白' }, { recipeName: '希腊酸奶配坚果', tag: '低碳水' }, { recipeName: '希腊酸奶配坚果', tag: '坚果' },
    { recipeName: '蔬菜豆腐汤', tag: '清淡' }, { recipeName: '蔬菜豆腐汤', tag: '素食' }, { recipeName: '蔬菜豆腐汤', tag: '暖胃' },
    
    { recipeName: '藜麦鸡胸沙拉', tag: '高蛋白' }, { recipeName: '藜麦鸡胸沙拉', tag: '低脂' }, { recipeName: '藜麦鸡胸沙拉', tag: '沙拉' },
    { recipeName: '番茄牛肉意面', tag: '高铁' }, { recipeName: '番茄牛肉意面', tag: '意面' }, { recipeName: '番茄牛肉意面', tag: '番茄' },
    { recipeName: '蔬菜炒饭', tag: '蔬菜' }, { recipeName: '蔬菜炒饭', tag: '快速' }, { recipeName: '蔬菜炒饭', tag: '中式' },
    { recipeName: '烤鱼配烤蔬菜', tag: '烤制' }, { recipeName: '烤鱼配烤蔬菜', tag: '健康脂肪' }, { recipeName: '烤鱼配烤蔬菜', tag: '高蛋白' },
    { recipeName: '虾仁豆腐汤', tag: '低卡' }, { recipeName: '虾仁豆腐汤', tag: '海鲜' }, { recipeName: '虾仁豆腐汤', tag: '清淡' },
    
    { recipeName: '蒸鸡胸配西兰花', tag: '蒸制' }, { recipeName: '蒸鸡胸配西兰花', tag: '高蛋白' }, { recipeName: '蒸鸡胸配西兰花', tag: '低脂' },
    { recipeName: '烤三文鱼配芦笋', tag: '烤制' }, { recipeName: '烤三文鱼配芦笋', tag: '健康脂肪' }, { recipeName: '烤三文鱼配芦笋', tag: '高蛋白' },
    { recipeName: '蔬菜豆腐煲', tag: '素食' }, { recipeName: '蔬菜豆腐煲', tag: '清淡' }, { recipeName: '蔬菜豆腐煲', tag: '中式' },
    { recipeName: '牛肉蔬菜卷', tag: '高蛋白' }, { recipeName: '牛肉蔬菜卷', tag: '均衡' }, { recipeName: '牛肉蔬菜卷', tag: '蔬菜' },
    { recipeName: '蘑菇汤配全麦面包', tag: '温暖' }, { recipeName: '蘑菇汤配全麦面包', tag: '轻食' }, { recipeName: '蘑菇汤配全麦面包', tag: '西式' },
    
    { recipeName: '地中海式烤鸡胸配蔬菜', tag: '地中海风味' }, { recipeName: '地中海式烤鸡胸配蔬菜', tag: '高蛋白' }, { recipeName: '地中海式烤鸡胸配蔬菜', tag: '烤制' }, { recipeName: '地中海式烤鸡胸配蔬菜', tag: '蔬菜' },
    { recipeName: '藜麦牛油果沙拉', tag: '健康脂肪' }, { recipeName: '藜麦牛油果沙拉', tag: '素食' }, { recipeName: '藜麦牛油果沙拉', tag: '沙拉' }, { recipeName: '藜麦牛油果沙拉', tag: '营养均衡' },
    { recipeName: '番茄炖牛肉', tag: '高蛋白' }, { recipeName: '番茄炖牛肉', tag: '炖煮' }, { recipeName: '番茄炖牛肉', tag: '传统' }, { recipeName: '番茄炖牛肉', tag: '温暖' }
  ]
};

async function seed() {
  try {
    await prisma.recipeTag.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.dietLog.deleteMany();
    await prisma.warning.deleteMany();
    await prisma.food.deleteMany();
    await prisma.user.deleteMany();

    for (const user of initialData.users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          gender: user.gender,
          age: user.age,
          height: user.height,
          weight: user.weight,
          calorie_goal: user.calorie_goal,
          diet_preferences: user.diet_preferences,
          allergies: user.allergies
        }
      });
    }

    for (const food of initialData.foods) {
      await prisma.food.create({ data: food });
    }

    for (const warning of initialData.warnings) {
      await prisma.warning.create({ data: warning });
    }

    const recipeMap = new Map(); 
    for (const recipe of initialData.recipes) {
      const createdRecipe = await prisma.recipe.create({ data: recipe });
      recipeMap.set(recipe.name, createdRecipe.id);
    }

    let tagCount = 0;
    let skippedCount = 0;
    
    for (const tagData of initialData.recipeTags) {
      const recipeId = recipeMap.get(tagData.recipeName);
      
      if (recipeId) {
        await prisma.recipeTag.create({
          data: {
            recipeId: recipeId,
            tag: tagData.tag
          }
        });
        tagCount++;
      } else {
        skippedCount++;
      }
    }

  } catch (error) {
    console.error('数据导入失败：', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
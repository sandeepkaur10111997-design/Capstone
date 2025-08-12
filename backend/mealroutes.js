const express = require('express');
const router = express.Router();
const MealPlan = require('./mealplan');

// POST: Save meal plans
router.post('/', async (req, res) => {
  try {
    const meals = req.body; // expects an array
    
    // Filter out empty meals
    const validMeals = meals.filter(meal => 
      meal.day && meal.meal && meal.ingredients && 
      meal.meal.trim() !== '' && meal.ingredients.trim() !== ''
    );
    
    if (validMeals.length === 0) {
      return res.status(400).json({ error: "No valid meal plans to save" });
    }
    
    // Use Promise.all to handle each day individually with upsert
    const updatePromises = validMeals.map(meal => 
      MealPlan.findOneAndUpdate(
        { day: meal.day }, // find by day
        { 
          day: meal.day,
          meal: meal.meal.trim(),
          ingredients: meal.ingredients.trim()
        }, // update with new data
        { 
          upsert: true, // create if not exists
          new: true,    // return updated document
          runValidators: true
        }
      )
    );
    
    const savedMeals = await Promise.all(updatePromises);
    
    res.status(201).json({ 
      message: "Meal plan saved successfully", 
      meals: savedMeals 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch saved meal plans
router.get('/', async (req, res) => {
  try {
    const meals = await MealPlan.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch meal plan by day
router.get('/:day', async (req, res) => {
  try {
    const { day } = req.params;
    const meal = await MealPlan.findOne({ day: day });
    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove meal plan for a specific day
router.delete('/:day', async (req, res) => {
  try {
    const { day } = req.params;
    const result = await MealPlan.deleteOne({ day: day });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No meal plan found for this day" });
    }
    
    res.json({ message: `Meal plan for ${day} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

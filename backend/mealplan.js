const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  day: { 
    type: String, 
    required: true, 
    unique: true // Ensure only one plan per day
  },
  meal: { 
    type: String, 
    required: true 
  },
  ingredients: { 
    type: String, 
    required: true 
  },
  userId: String // optional, for future login
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);

const express = require('express');
const router = express.Router();
const Budget = require('./Budget');

// POST: Set/Update monthly budget
router.post('/', async (req, res) => {
  try {
    const { totalBudget, month, year } = req.body;
    
    if (!totalBudget || totalBudget <= 0) {
      return res.status(400).json({ error: "Total budget must be a positive number" });
    }
    
    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }
    
    // Use current month/year if not provided
    const currentDate = new Date();
    const budgetMonth = month || currentDate.toLocaleString('default', { month: 'long' });
    const budgetYear = year || currentDate.getFullYear();
    
    // Update or create budget for the specified month/year
    const budget = await Budget.findOneAndUpdate(
      { month: budgetMonth, year: budgetYear },
      { 
        totalBudget: totalBudget,
        month: budgetMonth,
        year: budgetYear
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true
      }
    );
    
    res.status(201).json({ 
      message: "Budget set successfully",
      budget: {
        totalBudget: budget.totalBudget,
        amountSpent: budget.amountSpent,
        remainingBudget: budget.remainingBudget,
        percentageSpent: budget.percentageSpent,
        month: budget.month,
        year: budget.year
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch current month's budget
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    
    const budget = await Budget.findOne({ 
      month: currentMonth, 
      year: currentYear 
    });
    
    if (!budget) {
      return res.status(404).json({ error: "No budget found for current month" });
    }
    
    res.json({
      totalBudget: budget.totalBudget,
      amountSpent: budget.amountSpent,
      remainingBudget: budget.remainingBudget,
      percentageSpent: budget.percentageSpent,
      month: budget.month,
      year: budget.year
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch budget for specific month/year
router.get('/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const budget = await Budget.findOne({ 
      month: month, 
      year: parseInt(year) 
    });
    
    if (!budget) {
      return res.status(404).json({ error: `No budget found for ${month} ${year}` });
    }
    
    res.json({
      totalBudget: budget.totalBudget,
      amountSpent: budget.amountSpent,
      remainingBudget: budget.remainingBudget,
      percentageSpent: budget.percentageSpent,
      month: budget.month,
      year: budget.year
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update amount spent (when groceries are purchased)
router.put('/spend', async (req, res) => {
  try {
    const { amount, month, year } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }
    
    const currentDate = new Date();
    const budgetMonth = month || currentDate.toLocaleString('default', { month: 'long' });
    const budgetYear = year || currentDate.getFullYear();
    
    const budget = await Budget.findOne({ 
      month: budgetMonth, 
      year: budgetYear 
    });
    
    if (!budget) {
      return res.status(404).json({ error: "No budget found for the specified month" });
    }
    
    budget.amountSpent += amount;
    await budget.save();
    
    res.json({
      message: "Expense added successfully",
      budget: {
        totalBudget: budget.totalBudget,
        amountSpent: budget.amountSpent,
        remainingBudget: budget.remainingBudget,
        percentageSpent: budget.percentageSpent,
        month: budget.month,
        year: budget.year
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete budget for specific month/year
router.delete('/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const result = await Budget.deleteOne({ 
      month: month, 
      year: parseInt(year) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: `No budget found for ${month} ${year}` });
    }
    
    res.json({ message: `Budget for ${month} ${year} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

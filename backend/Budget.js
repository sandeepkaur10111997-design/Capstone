const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  totalBudget: { 
    type: Number, 
    required: true,
    min: 0
  },
  amountSpent: { 
    type: Number, 
    default: 0,
    min: 0
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: String // optional, for future login
});

// ✅ Ensure uniqueness for combination of month and year
BudgetSchema.index({ month: 1, year: 1 }, { unique: true });

// ✅ Virtual: Remaining budget
BudgetSchema.virtual('remainingBudget').get(function() {
  return this.totalBudget - this.amountSpent;
});

// ✅ Virtual: Percentage spent
BudgetSchema.virtual('percentageSpent').get(function() {
  return this.totalBudget > 0 ? (this.amountSpent / this.totalBudget) * 100 : 0;
});

// ✅ Pre-save validation to prevent budget entries for past months of the current year
BudgetSchema.pre('validate', function(next) {
  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0 = Jan
  const currentYear = now.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const selectedMonthIndex = monthNames.indexOf(this.month);

  if (
    this.year < currentYear ||
    (this.year === currentYear && selectedMonthIndex < currentMonthIndex)
  ) {
    return next(new Error('Cannot set budget for a past month in the current year.'));
  }

  next();
});

module.exports = mongoose.model('Budget', BudgetSchema);

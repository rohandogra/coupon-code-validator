const getPercentage = (amount, discountValue) => {
  return Number(amount) - (Number(discountValue) / 100) * Number(amount);
};

module.exports = getPercentage;

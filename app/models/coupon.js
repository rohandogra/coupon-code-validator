const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  couponCode: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ["flat", "percent"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  maxDiscountAmount: {
    type: Number,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = { Coupon };

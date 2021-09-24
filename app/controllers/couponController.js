const { Coupon } = require("../models/coupon");
const getPercentage = require("../utils/getPercentage");

module.exports.create = async (req, res) => {
  console.log("Create Coupon Controller Invoked");

  let body = req.body;
  console.log(body);
  try {
    const couponCheck = await Coupon.findOne({
      couponCode: body.couponCode,
    });
    // To check if couponCode exists or not
    if (couponCheck) {
      return res.status(400).json({
        error: `Coupon already exists with this coupon name ${body.couponCode}`,
      });
    }
  } catch (err) {
    console.log(err);
  }

  //* Create a new Coupon
  const coupon = new Coupon({
    ...body,
    maxDiscountAmount: body.category === "flat" ? null : body.maxDiscountAmount,
  });
  try {
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.show = async (req, res, next) => {
  console.log("Invoked Show Coupon Controller");

  //* Get all coupon
  try {
    const coupon = await Coupon.find();
    res.status(200).json(coupon);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.verifyCoupon = async (req, res, next) => {
  console.log("Invoked  verify coupon controller");

  const { code, totalamount } = req.query;
  let amount = Number(totalamount);
  try {
    // To find coupon by couponCode
    const coupon = await Coupon.findOne({ couponCode: code });

    if (coupon.category === "flat") {
      let totalAmountToBeDiscounted = amount - coupon.discountValue;
      res.status(200).json({
        totalAmountToBeDiscounted,
        discountedAmount: coupon.discountValue,
        amount,
        couponCode: coupon.couponCode,
        category: coupon.category,
        discountValue: coupon.discountValue,
      });
    } else {
      let totalAmountToBeDiscounted = getPercentage(
        amount,
        coupon.discountValue
      );

      let discountedAmountValue = amount - totalAmountToBeDiscounted;

      // check if discountedAmountValue is less than or equals to maxDiscountAmount
      if (discountedAmountValue <= coupon.maxDiscountAmount) {
        res.status(200).json({
          totalAmountToBeDiscounted,
          discountedAmount: Math.floor(discountedAmountValue * 10) / 10,
          amount,
          couponCode: coupon.couponCode,
          category: coupon.category,
          discountValue: coupon.discountValue,
        });
      } else {
        // if discountedAmount is more than maxDiscountAmount
        let totalAmountToBeDiscounted = amount - coupon.maxDiscountAmount;
        res.status(200).json({
          totalAmountToBeDiscounted,
          discountedAmount: coupon.maxDiscountAmount,
          amount,
          couponCode: coupon.couponCode,
          category: coupon.category,
          discountValue: coupon.discountValue,
        });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

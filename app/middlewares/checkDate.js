const { Coupon } = require("../models/coupon");

const checkDate = async (req, res, next) => {
  console.log("Invoked checkDate");

  const { code } = req.query;

  try {
    const coupon = await Coupon.findOne({ couponCode: code });

    let today = new Date();
    let start = new Date(coupon?.startDate);
    let end = new Date(coupon?.endDate);

    // if coupon does not exists
    if (!coupon) {
      return res.status(400).send({ error: "this coupon code is invalid!" });
    }
    // if start date is greater then today's date
    else if (today < start) {
      return res.status(400).send({ error: "this coupon is not active yet!" });
    }
    // if today's date is greater then end date
    else if (today > end) {
      return res.status(400).send({ error: "this coupon is expired!" });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

module.exports = checkDate;

const { Coupon } = require("../models/coupon");

const checkDate = async (req, res, next) => {
  console.log("Invoked checkDate");

  const { code } = req.query;

  try {
    const coupon = await Coupon.findOne({ couponCode: code });
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    };
    let today = new Date().toLocaleString("en-US", options);
    let start = new Date(coupon?.startDate).toLocaleString("en-US", options);
    let end = new Date(coupon?.endDate).toLocaleString("en-US", options);

    // if coupon does not exists
    if (!coupon) {
      return res.status(400).json({ error: "This coupon code is invalid!" });
    }
    // if start date is greater then today's date
    else if (today < start) {
      return res.status(400).json({ error: "This coupon is not active yet!" });
    }
    // if today's date is greater then end date
    else if (today > end) {
      return res.status(400).json({ error: "This coupon is expired!" });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports = checkDate;

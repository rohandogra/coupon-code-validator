const express = require("express");
const router = express.Router();
const couponController = require("../app/controllers/couponController");
const checkDate = require("../app/middlewares/checkDate");
const categoryCheck = require("../app/middlewares/categoryCheck");

router.post("/coupon", categoryCheck, couponController.create);
router.get("/coupon", couponController.show);
router.get("/verify-coupon", checkDate, couponController.verifyCoupon);

module.exports = router;

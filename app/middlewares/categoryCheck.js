const categoryCheck = async (req, res, next) => {
  const body = req.body;

  if (body.category === "percent") {
    // check for maxDiscountAmount is missing
    if (!body.maxDiscountAmount) {
      return res.status(400).send({ error: "maxDiscountAmount is required!" });
    }
    // check if discountValue is in range of 1 to 99 because of the percent check and discountValue cannot be negative or 0
    else if (body.discountValue > 99 || body.discountValue < 1) {
      return res.status(400).send({
        error:
          "discountValue needs to be in range of 1 to 99 and cannot be a negative number.",
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = categoryCheck;

const express = require("express");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product");
const Product = require("../models/product");
const advancedResult = require("../middlewares/advancedResult");

const router = express.Router({ mergeParams: true });

router.route("/").get(advancedResult(Product), getProducts).post(createProduct);

router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;

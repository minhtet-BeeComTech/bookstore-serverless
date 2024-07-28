const Product = require("../models/product");
const errorResult = require("../middlewares/errorResult");
const asyncHandler = require("../middlewares/asyncHandler");

// @desc:     get all product
// @route:    get /api/v1/product
// @access:   private/admin
const getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

// @desc:     get product by id
// @route:    get /api/v1/product/:id
// @access:   private/admin
const getProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    throw errorResult(400, `does not exist product id ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc:     create product
// @route:    post /api/v1/product
// @access:   private/admin
const createProduct = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  let product = await Product.findOne({ name });

  if (product) {
    throw errorResult(400, `${name} already exist`);
  }

  let createObj = {
    ...req.body,
  };

  let createdProduct = await Product.create(createObj);

  res.status(200).json({
    success: true,
    data: createdProduct,
  });
});

// @desc:     update product
// @route:    put /api/v1/product/:id
// @access:   private/admin
const updateProduct = asyncHandler(async (req, res, next) => {
  let updateObj = {
    ...req.body,
  };
  let product = await Product.findByIdAndUpdate(req.params.id, updateObj, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc:     delete product
// @route:    delete /api/v1/product/:id
// @access:   private/admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    throw errorResult(400, `does not exist product id ${req.params.id}`);
  }

  await Product.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: null,
  });
});

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct
}
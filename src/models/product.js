const mongoose = require("mongoose");

const productInfoSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Please add a name"],
      },
      quantity: {
        type: Number,
        required: [true, "Please add a quantity"],
      },
      price: {
        type: Number,
        required: [true, "Please add a price"],
      },
      description: {
        type: String,
      },
      productInfo: [productInfoSchema],
      status: {
        type: String,
        enum: ["opened", "closed"],
        default: "opened",
      },
    },
    { timestamps: true }
  )
);

module.exports = Product;

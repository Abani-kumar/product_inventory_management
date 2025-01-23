import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true, // for fast search
    },
    category: {
      // for one product one category
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    price: {
      type: Number,
      required: true,
      min: [1, "The price must be greater than 0"],
    },
    quantity: {
      type: Number,
      required: true,
      min:[1, "At least one product is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;


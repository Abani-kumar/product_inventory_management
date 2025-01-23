import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: [
    {
      // for one category multiple products
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);

export default Category;

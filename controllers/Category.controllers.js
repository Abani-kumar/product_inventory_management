import Category from "../models/Category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }
    const category = await Category.create({ name });
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

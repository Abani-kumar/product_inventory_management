import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";

export const createProduct = async (req, res) => {
  try {
    // get data from request
    const { name, category, price, quantity } = req.body;

    //request validation
    if (!name || !category || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // price & quantity validation
    if (price <= 0 || !Number.isInteger(price)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (quantity < 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative integer",
      });
    }
    if (typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid category format",
      });
    }

    // check if category exists
    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid category",
      });
    }
    // add product
    const newProduct = new Product({ name, category: categoryExists._id, price, quantity });
    await newProduct.save();

    return res.status(200).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};


// Note => we can improve search function 
export const getProducts = async (req, res) => {
  try {
    // Validation on limit and page
    //limit => Min 1, Max 20, page => Min 1
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 20);
    const page = Math.max(parseInt(req.query.page) || 1, 1); // Min: 1
    const offset = (page - 1) * limit;

    let { search, category } = req.query;

    const query = {};
    if (category) {
      const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid category"
        });
      }
      query.category = categoryExists._id;
    }

    if (search) {
      query.$or = [
        { name: search }
      ];
    }

    // parallel query => better optimization
    const [products, totalProducts] = await Promise.all([
      Product.find(query).limit(limit).skip(offset),
      Product.countDocuments(query),
    ]);
    if(products.length<=0){
      return res.status(400).json({
        success: false,
        message: "Products not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      meta: {
        total: totalProducts,
        limit,
        page,
        totalPages: Math.ceil(totalProducts / limit),
      },
    });
  } catch (error) {
    // Catch and return any errors
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    // validation
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }
    // get product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // validation
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }
    // Note  : I am only update quantity as given in the assignment
    // for other things to update just comment the below if condition
    if (
      req.body.name ||
      req.body.category ||
      (req.body.price && req.body.price > 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "You can only update quantity",
      });
    }
    // validation
    if (!req.body.quantity || req.body.quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "You must only update quanity",
      });
    }

    // get product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // validation
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }
    // get product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // delete product
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

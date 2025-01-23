import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/Product.controllers.js";

const router = express.Router();

router.post("/createproduct", createProduct);
router.get("/getproducts", getProducts);
router.get("/getproduct/:id", getProduct);
router.put("/updateproduct/:id", updateProduct);
router.delete("/deleteproduct/:id", deleteProduct);

export default router;

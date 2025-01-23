import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.config.js";
import Product from "./routes/Product.route.js";
import Category from "./routes/Category.route.js";

dotenv.config({
  path: "./.env",
});

const PORT = 8080;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/product",Product); 
app.use("/api/category",Category);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is on",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});

connectDB();

export default app;

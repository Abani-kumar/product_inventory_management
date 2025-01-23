import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";

let mongoServer;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Product Controller", () => {
  let testCategory, testProduct;

  beforeEach(async () => {
    testCategory = await Category.create({ name: "electronics" });

    testProduct = await Product.create({
      name: "Test Laptop",
      category: testCategory._id,
      price: 1000,
      quantity: 10,
    });
  });

  afterEach(async () => {
    await Product.deleteMany({});
    await Category.deleteMany({});
  });

  describe("Product Controller", () => {
    describe("createProduct", () => {
      it("should create a new product successfully", async () => {
        const productData = {
          name: "New Laptop",
          category: "electronics",
          price: 1200,
          quantity: 5,
        };

        const response = await request(app)
          .post("/api/product/createproduct")
          .send(productData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("name", productData.name);
      });
    });
  });

  describe("getProducts", () => {
    it("should fetch products with default pagination", async () => {
      const response = await request(app).get("/api/product/getproducts");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta).toHaveProperty("total");
      expect(response.body.meta).toHaveProperty("limit", 10);
    });

    it("should filter products by category", async () => {
      const response = await request(app).get(
        "/api/product/getproducts?category=electronics"
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("getProduct", () => {
    it("should fetch a specific product by ID", async () => {
      const response = await request(app).get(
        `/api/product/getproduct/${testProduct._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty(
        "_id",
        testProduct._id.toString()
      );
    });

    it("should return error for invalid product ID", async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const response = await request(app).get(
        `/api/product/getproduct/${invalidId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("updateProduct", () => {
    it("should update product quantity", async () => {
      const response = await request(app)
        .put(`/api/product/updateproduct/${testProduct._id}`)
        .send({ quantity: 15 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("quantity", 15);
    });

    it("should prevent updating other product fields", async () => {
      const response = await request(app)
        .put(`/api/product/updateproduct/${testProduct._id}`)
        .send({ name: "Updated Name" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      const response = await request(app).delete(
        `/api/product/deleteproduct/${testProduct._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedProduct = await Product.findById(testProduct._id);
      expect(deletedProduct).toBeNull();
    });

    it("should return error for deleting non-existent product", async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(
        `/api/product/deleteproduct/${invalidId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});

# Product Inventory Management API

## Overview
The Product Inventory Management API is a RESTful service designed for managing products and categories. It supports creating, retrieving, updating, and deleting products as well as creating categories.

## Base URL
```
http://localhost:8080
```

## Endpoints

### 1. **Create a Product**
**POST** `/product/createproduct`

#### Request Body
```json
{
  "name": "iPhone",
  "category": "mobile",
  "price": 1000,
  "quantity": 10
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "64b8c9c0567ab9f4c91c147c",
    "name": "iPhone",
    "category": "64b8c89a7f45a1d89c12b213",
    "price": 1000,
    "quantity": 10,
    "__v": 0
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "All fields are required"
}
```

---

### 2. **Get All Products**
**GET** `/product/getproducts`

#### Query Parameters
| Parameter  | Type   | Description                            |
|------------|--------|----------------------------------------|
| `limit`    | Number | (Optional) Maximum number of results. |
| `page`     | Number | (Optional) Pagination page number.    |
| `search`   | String | (Optional) Search by product name.    |
| `category` | String | (Optional) Filter by category name.   |

#### Example Request
```
GET /product/getproducts?limit=5&page=1&category=mobile
```

#### Success Response
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "64b8c9c0567ab9f4c91c147c",
      "name": "iPhone",
      "category": "64b8c89a7f45a1d89c12b213",
      "price": 1000,
      "quantity": 10
    }
  ],
  "meta": {
    "total": 1,
    "limit": 5,
    "page": 1,
    "totalPages": 1
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Products not found"
}
```

---

### 3. **Get a Single Product**
**GET** `/product/getproduct/:id`

#### Success Response
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "_id": "64b8c9c0567ab9f4c91c147c",
    "name": "iPhone",
    "category": "64b8c89a7f45a1d89c12b213",
    "price": 1000,
    "quantity": 10
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 4. **Update a Product**
**PUT** `/product/updateproduct/:id`

#### Request Body
```json
{
  "quantity": 15
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "64b8c9c0567ab9f4c91c147c",
    "name": "iPhone",
    "category": "64b8c89a7f45a1d89c12b213",
    "price": 1000,
    "quantity": 15
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "You can only update quantity"
}
```

---

### 5. **Delete a Product**
**DELETE** `/product/deleteproduct/:id`

#### Success Response
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 6. **Create a Category**
**POST** `/category/createcategory`

#### Request Body
```json
{
  "name": "mobile"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "64b8c89a7f45a1d89c12b213",
    "name": "mobile",
    "__v": 0
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Category already exists"
}
```

---

## Notes
- Ensure the server is running before making requests.
- Use a tool like Postman or cURL for testing the API.
- Replace `:id` in the URL with the actual product or category ID when required.


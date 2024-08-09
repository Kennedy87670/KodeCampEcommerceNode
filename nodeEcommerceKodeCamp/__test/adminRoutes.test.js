const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const userModel = require("../models/usersModel");
const Product = require("../models/productModel");

beforeAll(async () => {
  await userModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  // app.close(); // No need to call app.close since it doesn't exist
});

let adminToken;

describe("Admin Routes to Register an Admin", () => {
  test("Register an Admin", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      fullName: "Admin User",
      email: "admin@example.com",
      password: "Admin123!",
      role: "admin",
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Successful");
  });

  test("Login an Admin", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "admin@example.com",
      password: "Admin123!",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You have successfully logged in");
    expect(response.body.userToken).toBeTruthy();
    adminToken = response.body.userToken;
  });

  let productId;

  test("Admin can add a product", async () => {
    const response = await request(app)
      .post("/v1/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Coke",
        description: "Coke Description",
        price: 100,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Coke");
    productId = response.body.data._id;
  });

  test("Admin can add a second product", async () => {
    const response = await request(app)
      .post("/v1/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Beer",
        description: "Beer Description",
        price: 200,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Beer");
  });

  test("Admin can edit the second product", async () => {
    const product = await Product.findOne({ name: "Beer" });

    const response = await request(app)
      .put(`/v1/products/${product._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Beer and Best",
        description: "Drinks and Beer",
        price: 250,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Beer and Best");
  });

  test("Admin can delete the second product", async () => {
    const product = await Product.findOne({ name: "Beer and Best" });

    const response = await request(app)
      .delete(`/v1/products/${product._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
  });
});

const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const userModel = require("../models/usersModel");

beforeAll(async () => {
  await userModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

let userToken;

describe("User Routes", () => {
  test("Register a User", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      fullName: "User",
      email: "user@example.com",
      password: "userpass",
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Successful");
  });

  test("Login a User", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "user@example.com",
      password: "userpass",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You have successfully logged in");
    expect(response.body.userToken).toBeTruthy();
    userToken = response.body.userToken;
  });

  let productId;

  test("User can view products", async () => {
    const response = await request(app)
      .get("/v1/products")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);

    if (response.body.data.length > 0) {
      productId = response.body.data[0]._id;
    }
  });

  test("User can view a single product", async () => {
    if (!productId) {
      throw new Error("No productId available for test");
    }

    const response = await request(app)
      .get(`/v1/products/${productId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(productId);
  });

  test("User can checkout/creating an order", async () => {
    if (!productId) {
      throw new Error("No productId available for test");
    }

    const response = await request(app)
      .post("/v1/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        orderItems: [
          {
            product: productId,
            quantity: 1,
            totalCost: 100,
          },
        ],
        totalPrice: 100,
      });

    expect(response.status).toBe(201);
    expect(response.body.totalPrice).toBe(100);
  });
});

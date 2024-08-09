# KodeCampEcommerceNode
# E-commerce API

## Overview
This project is a simple E-commerce API built with Node.js and Express. It includes features for user registration, login, product management, and order processing.

## Features
- User and Admin registration and login
- Product management (add, edit, delete)
- Viewing all products or a single product
- Order creation and checkout

## Routes
### Auth
- `POST /v1/auth/register` - Register a new user or admin
- `POST /v1/auth/login` - Login a user or admin

### Products
- `GET /v1/products` - Get all products
- `GET /v1/products/:id` - Get a single product by ID
- `POST /v1/products` - Add a new product (Admin only)
- `PUT /v1/products/:id` - Update a product (Admin only)
- `DELETE /v1/products/:id` - Delete a product (Admin only)

### Orders
- `POST /v1/orders` - Create a new order
- `GET /v1/orders/:id` - Get an order by ID

## Environment Variables
- `DATABASE` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `NODE_MAILER_EMAIL` - Email for sending notifications
- `NODE_MAILER_PASSWORD` - Password for the email account

## Running Tests
To run the tests for both admin and user routes, use the following commands:

```bash
npm test

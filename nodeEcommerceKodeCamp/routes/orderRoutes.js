const express = require('express');
const { createOrder, getOrderById, getAllOrders } = require('../controllers/orderController');
const verifyAuth = require('../middleware/verifyAuth');
const rolesAllowed = require('../middleware/roleBasedAuth');
const router = express.Router();

/**
 * @swagger
 * /v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *               - totalPrice
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                     - totalCost
 *                   properties:
 *                     product:
 *                       type: string
 *                       format: ObjectId
 *                     quantity:
 *                       type: number
 *                     totalCost:
 *                       type: number
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', verifyAuth, rolesAllowed(['admin','user']), createOrder);

/**
 * @swagger
 * /v1/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', verifyAuth, rolesAllowed(['admin', 'user']), getOrderById);

/**
 * @swagger
 * /v1/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter orders by product name
 *       - in: query
 *         name: minTotalPrice
 *         schema:
 *           type: number
 *         description: Minimum total price to filter orders
 *       - in: query
 *         name: maxTotalPrice
 *         schema:
 *           type: number
 *         description: Maximum total price to filter orders
 *       - in: query
 *         name: minDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Minimum date to filter orders
 *       - in: query
 *         name: maxDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Maximum date to filter orders
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyAuth, rolesAllowed(['admin']), getAllOrders);

module.exports = router;

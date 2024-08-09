const express = require('express');
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const verifyAuth = require('../middleware/verifyAuth');
const rolesAllowed = require('../middleware/roleBasedAuth');
const router = express.Router();

/**
 * @swagger
 * /v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
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
 *         description: Search term to filter products by name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price to filter products
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price to filter products
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalDocs:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.get('/', getProducts);

/**
 * @swagger
 * /v1/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /v1/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 */
router.post('/', verifyAuth, rolesAllowed(['admin']), addProduct);

/**
 * @swagger
 * /v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.put('/:id', verifyAuth, rolesAllowed(['admin']), updateProduct);

/**
 * @swagger
 * /v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', verifyAuth, rolesAllowed(['admin']), deleteProduct);

module.exports = router;



// const express = require('express');
// const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
// const verifyAuth = require('../middleware/verifyAuth');
// const rolesAllowed = require('../middleware/roleBasedAuth');
// const router = express.Router();

// router.post('/', verifyAuth, rolesAllowed(['admin']), addProduct);
// router.get('/', getProducts);
// router.get('/:id', getProductById);
// router.put('/:id', verifyAuth, rolesAllowed(['admin']), updateProduct);
// router.delete('/:id', verifyAuth, rolesAllowed(['admin']), deleteProduct);

// module.exports = router;

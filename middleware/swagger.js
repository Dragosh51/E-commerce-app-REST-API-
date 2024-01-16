// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Title',
            version: '1.0.0',
            description: 'Your API Description',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./server.js'], // Point to the file that contains your route definitions
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve order history for the authenticated user
 *     tags: [Order]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successful response with order history
 *         content:
 *           application/json:
 *             example:
 *               - order_id: 1
 *                 user_id: 123
 *                 cart_id: 456
 *                 payment_details: {}
 *                 order_date: '2023-01-01'
 *               - order_id: 2
 *                 user_id: 123
 *                 cart_id: 789
 *                 payment_details: {}
 *                 order_date: '2023-02-01'
 */

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Retrieve details of a specific order by ID for the authenticated user
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with order details
 *         content:
 *           application/json:
 *             example:
 *               order_id: 1
 *               user_id: 123
 *               cart_id: 456
 *               payment_details: {}
 *               order_date: '2023-01-01'
 *       404:
 *         description: Order not found
 */



/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Process the checkout for the shopping cart
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             paymentDetails: {}
 *     responses:
 *       201:
 *         description: Checkout successful, order created
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Cart is empty or not found
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the shopping cart of the authenticated user
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the shopping cart
 *         content:
 *           application/json:
 *             example:
 *               cart_id: 1
 *               user_id: 123
 *               products: [
 *                 {
 *                   product_id: 1,
 *                   name: Strength programme,
 *                   category: Strength,
 *                   price: 19.99,
 *                   quantity: 2
 *                 },
 *                 {
 *                   product_id: 2,
 *                   name: Cardio programme,
 *                   category: Cardio,
 *                   price: 14.99,
 *                   quantity: 1
 *                 }
 *               ]
 */




/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the shopping cart
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             product_id: 3
 *             quantity: 1
 *     responses:
 *       201:
 *         description: Product successfully added to the cart
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints related to user authentication
 *   - name: User
 *     description: Endpoints related to user information
 *   - name: Product
 *     description: Endpoints related to products
 *   - name: Cart
 *     description: Endpoints related to shopping cart
 *   - name: Order
 *     description: Endpoints related to orders
 */



/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the details of the authenticated user
 *     tags: [User]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successful response with user details
 *         content:
 *           application/json:
 *             example:
 *               user_id: 123
 *               username: example_user
 */






/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Successful response with a list of products
 *         content:
 *           application/json:
 *             example:
 *               - product_id: 1
 *                 name: Strength programme
 *                 category: Strength
 *                 description: A strength training program
 *                 price: 19.99
 *               - product_id: 2
 *                 name: Cardio programme
 *                 category: Cardio
 *                 description: A cardio workout program
 *                 price: 14.99
 *               - product_id: 3
 *                 name: Hypertrophy programme
 *                 category: Hypertrophy
 *                 description: A hypertrophy training program
 *                 price: 24.99
 */



/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get details of a specific product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with product details
 *         content:
 *           application/json:
 *             example:
 *               product_id: 1
 *               name: Strength programme
 *               category: Strength
 *               description: A strength training program
 *               price: 19.99
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in with a username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: example_user
 *             password: example_password
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             example:
 *               user_id: 123
 *               username: example_user
 *       401:
 *         description: Authentication failed
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: example_user
 *             password: example_password
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: User already exists
 */
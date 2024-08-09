const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;
    const totalPrice = orderItems.reduce((acc, item) => acc + item.totalCost, 0);
    const order = new Order({
      user: req.userDetails.userId,
      orderItems,
      totalPrice,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product').populate('user', 'fullName email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders with pagination, search, and filter
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, minTotalPrice, maxTotalPrice, minDate, maxDate } = req.query;

    let query = {};
    if (search) {
      query['orderItems.product'] = { $regex: search, $options: 'i' };
    }
    if (minTotalPrice && maxTotalPrice) {
      query.totalPrice = { $gte: minTotalPrice, $lte: maxTotalPrice };
    } else if (minTotalPrice) {
      query.totalPrice = { $gte: minTotalPrice };
    } else if (maxTotalPrice) {
      query.totalPrice = { $lte: maxTotalPrice };
    }
    if (minDate && maxDate) {
      query.createdAt = { $gte: new Date(minDate), $lte: new Date(maxDate) };
    } else if (minDate) {
      query.createdAt = { $gte: new Date(minDate) };
    } else if (maxDate) {
      query.createdAt = { $lte: new Date(maxDate) };
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const orders = await Order.paginate(query, options);

    res.json({
      message: 'Successful',
      data: orders.docs,
      totalDocs: orders.totalDocs,
      totalPages: orders.totalPages,
      page: orders.page,
      limit: orders.limit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

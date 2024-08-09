const Product = require("../models/productModel");


exports.addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Check if the product already exists for the same user
    const existingProduct = await Product.findOne({ name, user: req.userDetails.userId });
    if (existingProduct) {
      return res.status(400).json({
        status: "Failed",
        message: "Product with this name already exists",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      user: req.userDetails.userId,
    });

    await product.save();

    res.status(201).json({
      status: "Created",
      message: "Product created Successfully",
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getProducts = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, minPrice, maxPrice, minDate, maxDate } = req.query;
  
      let query = {};
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      if (minPrice && maxPrice) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      } else if (minPrice) {
        query.price = { $gte: minPrice };
      } else if (maxPrice) {
        query.price = { $lte: maxPrice };
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
  
      const products = await Product.paginate(query, options);
  
      res.json({
        message: 'Successful',
        data: products.docs,
        totalDocs: products.totalDocs,
        totalPages: products.totalPages,
        page: products.page,
        limit: products.limit,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
        message:"Successful",
        data: product
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.user.toString() !== req.userDetails.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    product.name = name;
    product.description = description;
    product.price = price;
    await product.save();
    res.json({
        message:"Successful",
        data: product
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.user.toString() !== req.userDetails.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await Product.deleteOne({ _id: req.params.id });
    res.json({
        message:"Deleted Successfully",
        
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

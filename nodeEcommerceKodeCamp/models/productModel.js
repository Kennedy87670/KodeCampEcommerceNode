const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

// Add a unique index to prevent duplicate product names per user
productSchema.index({ name: 1, user: 1 }, { unique: true });


productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);

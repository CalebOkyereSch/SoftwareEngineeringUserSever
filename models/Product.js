const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  price: {
    type: Number,
  },
  main: {
    type: String,
    trim: true,
  },
  image: [
    {
      type: String,
      trim: true,
    },
  ],
  rooms: {
    type: String,
  },
  bath: {
    type: String,
  },
  bed: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = Product = mongoose.model("product", ProductSchema);

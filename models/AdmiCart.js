const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdmiCartSchema = new Schema({
  cart: {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
});

module.exports = AdmiCart = mongoose.model("admicart", AdmiCartSchema);

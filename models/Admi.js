const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdmiSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = Admi = mongoose.model("admi", AdmiSchema);

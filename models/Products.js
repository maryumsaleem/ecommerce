const mongoose = require("mongoose");
let ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is Required"],
  },
  location: {
    type: String,
    required: [true, "Location is Required"],
  },
  type: {
    type: String,
    required: [true, "Type is Required"],
  },
  contacts: [
    {
      phone: {
        type: String,
        required: [true, "Phone is Required"],
      },
      email: {
        type: String,
        required: [true, "Email is Required"],
      },
      website: {
        type: String,
        required: [true, "Website Url is Required"],
      },
    },
  ],
  image: {
    type: String,
    required: [true, "Image is Required"],
  },
  image_id: {
    type: String,
    required: [true, "Image Id is Required"],
  },
  Category: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is Required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
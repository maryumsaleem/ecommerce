const mongoose = require("mongoose"); 
let CategorySchema = new mongoose.Schema({
  title: { 
    type: String,
    required: [true, "Category is required!"], 
    sparse: true,
    unique: true,
    index: true
  },
  image: {
    type: String,
    required: [true, "Category image is required!"]
  },
  image_id:{
    type: String, 
  },
  createdAt:{
    type: Date,
    default: Date.now(),
    select: false
  }
});
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
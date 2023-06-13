const mongoose = require("mongoose");
const Product = require("../models/Products"); 
const cloudinary = require("../utils/cloudinary");

module.exports = {
  /*** Add product to Database ***/
  addProduct: async (req, res) => {
    try {
      if(!req.file) {
        return res.status(400).send({ status: "fail", message: "Please upload image" });
      }

      const { title, location, type, email, phone, website, Category } = req.body;
      let image_upload = await cloudinary.uploader.upload(req.file.path);
      let contacts = [{email, phone, website}]
      let data = {
        title,
        location,
        type,
        contacts, 
        image: image_upload.secure_url,
        image_id: image_upload.public_id,
        Category: new mongoose.Types.ObjectId(Category),
      } 
      const product = await Product.create(data);
      res.status(200).json({ 
        status: "success", 
        data: {
          product
        } 
      });
    } catch (err) {
      res.status(500).send({ status: "fail", message: err.message });
    }
  },

  /*** Get product from Database ***/
  getProduct: async (req, res) => {
    try {
      // Filteration
      let queryObj = {...req.query};
      let excludedFields = ['page', 'limit', 'sort', 'fields'];
      excludedFields.forEach(field => delete queryObj[field]);
      
      // Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);
      console.log(JSON.parse(queryStr));


      let query = Product.find(JSON.parse(queryStr)).populate('Category'); 
      
      // Sorting
      if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt');
      }

      //Fields Limiting

      if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
      } else {
        query = query.select('-__v');
      }

      //Pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 10;
      const skip = (page - 1) * limit;
      
      query = query.skip(skip).limit(limit);
      
      if(req.query.page) {
        const data = await Product.countDocuments();
        if(skip >= data) throw new Error("This page does not exist");
      }
      // Execute the Query
      const product = await query;

      // Send the Response
      res.status(200).json({ 
          status: "success",
          data: {
        product
          }
        });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  },


  /*** get an single product ***/
  editProduct: async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);
      res.status(200).json({ 
        status: "success", 
        data: {
          product
        }
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  },

  /*** Update a product ***/
  updateProduct: async(req, res) => {
    try {
      let image_upload;
      if (req.file) {
        let record = await Product.findById(req.params.id);
        console.log(record);
        await cloudinary.uploader.destroy(record.image_id);
        image_upload = await cloudinary.uploader.upload(req.file.path);
      }
      console.log(image_upload);
      let data = {
        ...req.body,
        image: image_upload && image_upload.secure_url,
        image_id: image_upload && image_upload.public_id,
      };
      console.log(req.body);
      const product = await Product.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true
      });
        res.status(200).json({
          status:'success', 
          data: {
            product
          }
        });
    } catch (err) {
        res.status(401).json({status:"fail",message: err.message});
    }
  },
  /*** Remove product ***/
  removeProduct: async (req, res) => {
    try {
      let result = await Product.findById(req.params.id);
      if(!result) {
        res.status(404).json({ status: "fail", message: "Product not found" });
       return true;
      }
      await Product.findByIdAndDelete(req.params.id);
      await cloudinary.uploader.destroy(result.image_id);
      res.status(200).json({
        status:'success', 
        data: null,
        message: "Product deleted successfully"
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
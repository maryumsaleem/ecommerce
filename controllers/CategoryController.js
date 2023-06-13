const Category = require("../models/Category");
const cloudinary = require("../utils/cloudinary");
module.exports = {
  /*** Add New Category to Database ***/
  add_category: async (req, res) => {
    if (!req.file) {
      res.status(404).json({ message: "Category Image is Required!!" });
      return true;
    }
    let image_upload = await cloudinary.uploader.upload(req.file.path);
  
    try {
      let data = {
        title: req.body.title,
        image: image_upload && image_upload.secure_url,
        image_id: image_upload && image_upload.public_id,
      };
      console.log(data)
      const category = await Category.create(data);
      res.status(200).json({
        status: "success",
        data: {
          category,
        },
      });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Get Categories from Database ***/
  get_categories: async (req, res) => {
    try {
      let categories = await Category.find();
      res.status(200).json({
        status: "success",
        results: categories.length,
        data: {
          categories,
        },
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** edit an existing category ***/
  edit_category: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.status(200).json({
        status: "success",
        data: {
          category,
        },
      });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Update Category ***/
  update_category: async (req, res) => {
    try {
      
      console.log(req.body.title);
      let image_upload;
      if (req.file) {
        let record = await Category.findById(req.params.id);
        console.log(record);
        await cloudinary.uploader.destroy(record.image_id);
        image_upload = await cloudinary.uploader.upload(req.file.path);
      }
      console.log(image_upload);
      let data = {
        title: req.body.title && req.body.title,
        image: image_upload && image_upload.secure_url,
        image_id: image_upload && image_upload.public_id,
      };
      const category = await Category.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        status: "success",
        data: {
          category,
        },
      });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Remove a Category ***/
  remove_category: async (req, res) => {
    try {
      let result = await Category.findById(req.params.id);
      if(!result) {
        return res.status(404).json({ status: "fail", message: "Category not found" });
      }
      await Category.findByIdAndDelete(req.params.id);
      await cloudinary.uploader.destroy(result.image_id);
      res.status(204).json({
          status: "success", 
          message: "Category deleted successfully",
        });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
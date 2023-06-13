const mongoose = require("mongoose");
const Reviews = require("../models/Reviews");

module.exports = {
  /****     addReview  ******/
  addReview: async (req, res) => {
    try {
      const { title, details, rating, product } = req.body;
      let data = {
        title,
        details,
        rating,
        product: new mongoose.Types.ObjectId(product),
      };
      const review = await Reviews.create(data);
      res.status(201).json({ status: "success", data: review });
    } catch (err) {
      res.status(500).send({ status: "fail", message: err.message });
    }
  },

  /****     getReview  ******/
  getReview: async (req, res) => {
    try {
      // Filteration
      let queryObj = { ...req.query };
      let excludedFields = ["page", "limit", "sort", "fields"];
      excludedFields.forEach((field) => delete queryObj[field]);

      // Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      console.log(JSON.parse(queryStr));

      let query = Reviews.find(JSON.parse(queryStr)).populate({
        path: 'product',
        populate: {
          path: 'category',
          model: 'Category'
        }
      });
      

      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      //Fields Limiting

      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }

      //Pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 10;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);

      if (req.query.page) {
        const data = await Reviews.countDocuments();
        if (skip >= data) throw new Error("This page does not exist");
      }
      // Execute the Query
      const reviews = await query;

      // Send the Response
      res.status(200).json({
        status: "success",
        data: {
          reviews,
        },
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  },

  /*** get an single review ***/
  editReview: async (req, res) => {
    try {
      let review = await Reviews.findById(req.params.id);
      res.status(200).json({
        status: "success",
        data: {
          review,
        },
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  },

  /*** Update a review ***/
  updateReview: async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const review = await Reviews.findByIdAndUpdate(id, data, { new: true });
    try {
      res.status(201).json({
        status: "success",
        data: review,
      });
    } catch (err) {
      res.status(400).json({
        status: "failed",
        message: err,
      });
    }
  },

  /*** Delete a review ***/
  removeReview: async (req, res) => {
    try {
      let result = await Reviews.findById(req.params.id);
      if (!result) {
        res.status(404).json({ status: "fail", message: "Product not found" });
        return true;
      }
      await Reviews.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: "success",
        data: null,
        message: "Product deleted successfully",
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};

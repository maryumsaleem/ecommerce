const express = require("express");
const router = express.Router();
const upload = require("../middleware/MulterMiddleware");
//-- *********** Import Controller Functions *********** --//
const CategoryController = require("../controllers/CategoryController");
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");
//-- ********************* Routes ********************* --//

router.get("/", (req, res) => {
  res.send("Products Api");
});

//! *** Category Routes ***!//
router
  .route("/category")
  .get(CategoryController.get_categories) /*** Get all Category ***/
  .post(
    upload.single("image"),
    CategoryController.add_category
  ); /*** Add New Category ***/
router
  .route("/category/:id")
  .get(CategoryController.edit_category) /*** Get a Single Category ***/
  .patch(
    upload.single("image"),
    CategoryController.update_category
  ) /*** Update Category ***/
  .delete(CategoryController.remove_category); /*** Remove Category ***/

//! *** Products Routes ***!//
router
  .route("/products")
  .get(productController.getProduct) /*** Get all products ***/
  .post(
    upload.single("image"),
    productController.addProduct
  ); /*** Add New Sub Category ***/
router
  .route("/products/:id")
  .get(productController.editProduct) /*** Get a Single product ***/
  .patch(
    upload.single("image"),
    productController.updateProduct
  ) /*** Update Sub Category ***/
  .delete(productController.removeProduct); /*** Remove product ***/

//! *** Reviews Routes ***!//

router
  .route("/reviews")
  .get(reviewController.getReview) /*** Get all reviews ***/
  .post(reviewController.addReview); /*** Add New Sub Category ***/

router
  .route("/reviews/:id")
  .get(reviewController.editReview) /*** Get a Single review ***/
  .patch(reviewController.updateReview) /*** Update Sub Category ***/
  .delete(reviewController.removeReview); /*** Remove review ***/

module.exports = router;

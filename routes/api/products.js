const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const User = require("../../models/User");
const passport = require("passport");

// @route   GET api/product/
// @desc    Get all product in database
// @access  Public

router.get("/", (req, res) => {
  Product.find()
    .then((product) => res.json(product))
    .catch((err) => res.status.json(err));
});

// @route   GET api/product/:item
// @desc    Get a particular product in database
// @access  Public

router.get("/:item", (req, res) => {
  Product.findById(req.params.item)
    .then((item) => {
      res.json(item);
    })
    .catch((err) => res.status.json({ item: "Item not found" }));
});

// @route   Post api/product/:item
// @desc    Add item to user cart
// @access  Private

router.post(
  "/:item",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Product.findById(req.params.item).then((item) => {
      User.findOne({ email: req.user.email }, (err, user) => {
        user.cart.forEach((element) => {
          if (element == item.id) {
            res.status.json({ msg: "Item already exist" });
          }
        });
        user.cart.push(item.id);
        user
          .save()
          .then((user) => {
            res.json(user);
          })
          .catch((err) => res.json(err));
      });
    });
  }
);

// @route    api/product/:item
// @desc    Buy Item In Cart  done
// @access  Private

module.exports = router;

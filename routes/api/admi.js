const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const Admi = require("../../models/Admi");
const Product = require("../../models/Product");
const key = require("../../config/keys");
const validateAdmiLoginInput = require("../../validation/admiLogin");
const validateAdmiInput = require("../../validation/admi");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const fs = require("fs");
const uploadPhotos = require("../../utils");

// @route  Post api/admi/signup
// @desc    Allow admi to register ... this will be removed
// @access  Public

router.post("/signup", (req, res) => {
  const { errors, isValid } = validateAdmiInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  } else {
    Admi.findOne({ username: req.body.username }).then((admi) => {
      if (admi) {
        errors.username = "username already exist";
        res.status(400).json(errors);
      } else {
        const newAdmi = new Admi({
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmi.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmi.password = hash;
            newAdmi
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// @route   GEt api/admi/signin
// @desc    Admi signin
// @access  Public

router.get("/signin", (req, res) => {
  res.send("login");
});

// Admi signin
router.post("/signin", (req, res) => {
  const { errors, isValid } = validateAdmiLoginInput(req.body);
  if (!isValid) {
    res.json(errors);
  }
  const username = req.body.username;
  const password = req.body.password;

  Admi.findOne({ username: username }).then((admi) => {
    if (!admi) {
      errors.username = "User not found";
      res.status(400).json(errors);
    } else {
      bcrypt.compare(password, admi.password).then((isMatch) => {
        if (isMatch) {
          // res.status(200).json({ msg: "Successful" });
          const payload = {
            id: admi.id,
            username: admi.username,
            name: admi.name,
          };
          jwt.sign(
            payload,
            key.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.status(200).json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          errors.password = "Password incorrect";
          res.status(400).json(errors);
        }
      });
    }
  });
});

// @route   Post api/admi/
// @desc    add new admi
// @access  Private

router.post(
  "/others",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newAdmi = new Admi({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });
    Admi.findOne({ username: req.body.username }).then((admi) => {
      if (admi) {
        return res.status(400).json({ msg: "User Already Exist" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmi.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmi.password = hash;
            newAdmi
              .save()
              .then((admi) => {
                res.json(admi);
              })
              .catch((err) => res.json(err));
          });
        });
      }
    });
  }
);

// @route   delete api/admi/remove_admi
// @desc    remove admi
// @access  Private
router.delete(
  "/others",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Admi.findOneAndDelete({ username: req.body.username }).then(() => {
      res.json({ msg: "Admi Delete Successful" });
    });
  }
);

// @route   Post api/admi/product/add_item
// @desc    add new item
// @access  Private
router.post(
  "/product",
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "image", maxCount: 12 },
  ]),
  passport.authenticate("jwt", { session: false }), // so sey ego authenticate first
  uploadPhotos, //so ago pass the req.body.images come here
  (req, res) => {
    //so sey we go fit barb the array of file paths for here, then we just go save to
    //db
    let newProduct = {};
    if (req.body.type) newProduct.type = req.body.type;
    if (req.body.status) newProduct.status = req.body.status;
    if (req.body.location) newProduct.location = req.body.location;
    if (req.body.price) newProduct.price = req.body.price;
    if (req.body.rooms) newProduct.rooms = req.body.rooms;
    if (req.body.bath) newProduct.bath = req.body.bath;
    if (req.body.bed) newProduct.bed = req.body.bed;
    if (req.body.description) newProduct.description = req.body.description;
    newProduct.main = req.body.main;
    newProduct.image = req.body.image;
    new Product(newProduct)
      .save()
      .then((product) => res.json(product))
      .catch((err) => res.json(err));
  }
);

// @route   Delete api/admi/product/:id
// @desc    remove item
// @access  Private

router.delete(
  "/product/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Product.findById(req.params.id).then((item) => {
      item
        .remove()
        .then(() => res.json({ success: true }))
        .catch((err) => res.status(404).json({ found: "No post found" }));
    });
  }
);

module.exports = router;

const express = require("express");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Product = require("../../models/Product");
const AdmiCart = require("../../models/AdmiCart");
const key = require("../../config/keys");
const validateLoginInput = require("../../validation/login");
const validateRegisterInput = require("../../validation/register");
const router = express.Router();

// @route   GET api/users/signup
// @desc    get signup page
// @access  Public tested

router.get("/signup", (req, res) => {
  res.send("register");
});

// @route   POST api/users/signup
// @desc    register user
// @access  Public tested

router.post("/signup", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        errors.email = "Email Already Exist";
        res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "mm",
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.get("/signin", (req, res) => {
  res.send("login");
});

// @route   POST api/users/signin
// @desc    log in user
// @access  Public tested

router.post("/signin", (req, res) => {
  const { isValid, errors } = validateLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      errors.email = "User not found";
      res.status(400).json(errors);
    } else {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          };
          jwt.sign(
            payload,
            key.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          errors.password = "Password Incorrect";
          res.status(400).json(errors);
        }
      });
    }
  });
});

// @route   GET api/users/cartnp
// @desc    get cart page
// @access  Public tested

router.get(
  "/cart",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ email: req.user.email }).then(async (user) => {
      let item = [];
      if (user.cart.length > 0) {
        for (let i = 0; i < user.cart.length; i++) {
          let product = await Product.findById(user.cart[i]);
          item.push(product);
        }
        res.json(item);
      } else {
        res.json({ msg: "Cart is Empty" });
      }
    });
  }
);

// @route   GET api/users/cart/:id
// @desc    buy item in cart and add item to admi cart
// @access  Public tested

router.get(
  "/cart/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      // find product using the id of params
      Product.findById(req.params.id).then((product) => {
        // this is going to admi's cart to display on admi dashboard
        console.log(product);
        const cus = req.user._id;
        const prod = product._id;
        console.log(req.user);
        const newCart = new AdmiCart({});
        newCart.customer = cus;
        newCart.product = prod;

        newCart
          .save()
          .then((item) => {
            res.json(item.product);
          })
          .catch((err) => res.status(400).json(err));
      });
    } else {
      res.json({ msg: "Property not found" });
    }
  }
);

// @route   Delete api/users/cart/:id
// @desc    remove from cart
// @access  Private tested

router.delete(
  "/cart/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .then((user) => {
        // Get remove index
        const removeIndex = user.cart
          .map((item) => item.id)
          .indexOf(req.params.id);

        // Splice out of array
        user.cart.splice(removeIndex, 1);

        // Save
        user.save().then((user) => res.json(user.cart));
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;

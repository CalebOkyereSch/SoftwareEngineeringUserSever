const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateAdmiInput(data) {
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.username) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  let errors = {};
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name Field Required";
  }
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30";
  }
  if (Validator.isEmpty(data.username)) {
    errors.email = "Email Field Required";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password Field Required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 100 })) {
    errors.password = "Password must be between 6 to 30 characters";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password Field Required";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Password don't match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

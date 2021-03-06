const Validator = require("validator");
const isEmpty = require("./isEmpty");
module.exports = function validateAdmiLoginInput(data) {
  let errors = {};
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.username)) {
    errors.username = "username field required";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

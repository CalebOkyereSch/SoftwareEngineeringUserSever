const userApp = require("./userServer");
const configUser = require("./configUser");

userApp.listen(configUser.port, () => {
  console.log(`API for user is running on port ${configUser.port}`);
});

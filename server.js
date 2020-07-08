const userApp = require("./userServer");
const admiApp = require("./admiServer");
const configAdmi = require("./configAdmi");
const configUser = require("./configUser");

userApp.listen(configUser.port, () => {
  console.log(`API for user is running on port ${configUser.port}`);
});
admiApp.listen(configAdmi.port, () => {
  console.log(`API for user is running on port ${configAdmi.port} `);
});

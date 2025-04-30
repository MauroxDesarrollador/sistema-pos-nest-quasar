const fakeUsers = require("./seeds/users");

fakeUsers().then(() => {
  console.log('Se han creado los usuarios.');
})
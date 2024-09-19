const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sureshkunkatla7:Zc9942yp78mz9aEH@nodemongolearning.e0oem.mongodb.net/devTinder"
  );
};

// const db = connectToDB()
//   .then(() => {
//     console.log("Connection to database is successful");
//   })
//   .catch((e) => {
//     console.log("unable to connect the database");
//     console.log(e);
//   });

module.exports = { connectToDB };

const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sureshkunkatla7:Zc9942yp78mz9aEH@nodemongolearning.e0oem.mongodb.net/devTinder"
  );
};

module.exports = { connectToDB };

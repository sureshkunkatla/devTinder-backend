const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: "String",
      required: [true, " First Name is required"],
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: "String",
      required: [true, "Last Name is required"],
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    emailId: {
      type: "String",
      required: [true, "Last Name is required"],
      unique: [true, "Already a user exists with this email"],
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid Email",
      },
    },
    password: {
      type: "String",
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (value) {
          return /[0-9]/.test(value) && /[!@#$%^&*]/.test(value);
        },
        message:
          "Password must contain at least one number and one special character in !@#$%^&*",
      },
    },
    age: {
      type: "Number",
      required: [true, "Password is required"],
      min: [18, "Age should be at least 18"],
    },
    gender: {
      type: "String",
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "{VALUE} is not supported",
      },
    },
    profileURL: {
      type: "String",
      default: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function () {
  const user = this;

  const token = jwt.sign({ id: user._id }, "IamJustASecretKey", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;

  const checkAndCompare = await bcrypt.compare(password, user.password);

  return checkAndCompare;
};

module.exports = mongoose.model("User", userSchema);

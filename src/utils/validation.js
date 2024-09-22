const userProfileUpdateValidation = (reqObj) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "about",
    "skills",
    "profileURL",
  ];

  const validateFields = Object.keys(reqObj).every((el) =>
    allowedFields.includes(el)
  );

  return validateFields;
};

module.exports = { userProfileUpdateValidation };

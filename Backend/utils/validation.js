const validator = require('validator');

const signUpValidator = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error('Please fill all the mandatory details');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Please Enter a valid emailId');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('password is weak! ');
  }
};

const validateEditProfileData = (data) => {
  const ALLOWED_UPDATES = [
    'firstName',
    'lastName',
    'emailId',
    'profile',
    'about',
    'gender',
    'age',
    'skills',
  ];

  const isAllowedUpdates = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );

  return isAllowedUpdates;
};

const updatePassValidator = (data) => {};

module.exports = {
  signUpValidator,
  validateEditProfileData,
};

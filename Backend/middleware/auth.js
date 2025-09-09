const adminAuth = (req, res, next) => {
  const token = 'asd';
  const isAuth = token === 'asdi';
  if (!isAuth) {
    res.status(401).send('Access is denied!');
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = 'as';
  const isAuth = token === 'as';
  if (!isAuth) {
    res.status(401).send('Access is denied!');
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};

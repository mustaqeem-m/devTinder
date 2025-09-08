const express = require('express');

const app = express();

//! this '/' routehandler will act like a widlcard means that any route start with / eg.login, express assume that it's this '/' route. express ll check routes by order ,
//! order of routing is very important when its comes to routing, put handler like '/'  or '' after all routes otherewise all routes ll fall under these route.

app.use(
  (req, res, next) => {
    next();
    // res.send('your request just hit the port 2222');
  },
  (req, res, next) => {
    // res.send('hello there what are you looking at this port 2:)');
    next();
  },
  (req, res, next) => {
    // res.send('hello there what are you looking at this port 3:)');
    next();
  },
  (req, res, next) => {
    // res.send('hello there what are you looking at this port 4:)');
    next();
  },
  (req, res, next) => {
    res.send('hello there what are you looking at this port 5:)');
  }
);

app.listen(2222, () => {
  console.log('server is listening to the port 2222');
});

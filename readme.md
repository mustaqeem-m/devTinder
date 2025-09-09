# Dev Tider

## Backend

- Note : this '/' routehandler will act like a widlcard means that any route start with / eg.login, express assume that it's this '/' route. express ll check routes by order ,
- order of routing is very important when its comes to routing, put handler like '/' or '' after all routes otherewise all routes ll fall under these route.

- //! this order is must 1 -> connect to DB 2 -> Listen to the server , bcuz what if the server Listen first and db is not created ,the server is started to listen to the user request , with even connect to DB
  Reason: If you start the server first and DB connection fails, users will hit endpoints but your app can’t process DB-dependent logic → leads to errors and a bad UX.
  So always ensure DB is connected successfully before calling app.listen().

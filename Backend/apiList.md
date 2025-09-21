# API's

## Auth API's

- POST /signup
- POST /login
- POST /logout

## Profile API's

- GET /profile
- POST /profile/edit
- POST /profile/password
- POST /profile/view

## Connection request router API's

### POST /request/send/:status/:userId

- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId

### POST /request/review/:status/:requestId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## core API's

- GET /user/request/received
- GET /user/connection
- GET /user/feed - core api which get u the profiles of other users available in the platform
  Status - pass, like, accepted, rejected

### backnend deployment

- allowed EC2 instance public ip mongoDB server
- npm install pm2 -g => a package helps us to keep our server run 24/7 on background
- pm2 start npm -- name "server-name" -- start
- pm2 logs
- pm2 list, pm2 stop <name>, pm2 delete <name>, pm2 flush <name>

frontend => http://13.48.59.148/
backend => http://13.48.59.148:2222/

Domain Name -> devTinder.com => 13.48.59.148

frontend -> http://devTinder.com
backend -> http://devTinder.com:7777 => http://devTinder.com/api

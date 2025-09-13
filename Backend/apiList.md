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

- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## core API's

- GET /user/connection
- GET /user/request/received
- GET /user/feed - core api which get u the profiles of other users available in the platform

Status - pass, like, accepted, rejected

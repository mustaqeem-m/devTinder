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

### hosting and domain name

- purchasing a domain name in bigrock -> devstinder.online
- signup in cloudflare and add new domain name
- changing the nameservers in from bigrock -> cloudflare => letting cloudflare handles all DNS traffic of our domain
- creating DNS record type A and type CNAME
- Enable full SSL for domain , by configure server EC2 to provide SSL certificate

## sending Email using amazon SES

- create a IAM user
- give amazon SES acess
- create a identity -> in amazon SES (both domain and email identity)
- verify domain identity using CNAME provided by Amazon SES and update record in Cloudflare using this
-

## Scheduling cron job in Nodejs

- Installing node-cron
- learning about cron expression syntax - crontab.guru
- scheduling a job
- date-fns -> a package make work with date easier
- find all unique emailID and send a remainder of pending connection requsts of previous day
- send Email
- Explore queue mechanism in sending bulk emails
- bee Queue -> a package used to send bulk emails
- Amazon SES bulk emails
- Make send email function dynamic

## Websocket and socket.io -> implemeting Chat using chat

- npm i socket.io
- require htttp
- in backend/app.js -> <require(http)> -> create a server <http.createServer(app)> -> listen to that server, <server.listen>
- change app.listen to server.listen -- \*
- create io
  <const io = socket(server, {
  cors: {
  origin: 'http://localhost:5173',
  },
  });>
- Accept a connection using io.on
  <io.on('connection', (socket) => {})>

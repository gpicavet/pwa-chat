"use strict"

var express    = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var auth = require('./auth.js')();
var bodyParser = require('body-parser');
var jwt = require("jwt-simple");
var socketioJwt = require("socketio-jwt");
var cfg = require("./config.js");

var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/nodechat';
var db=null;


app.use(bodyParser.json());
app.use(auth.initialize());

app.use(express.static(__dirname+"/../static/"));

app.get('/', /*auth.authenticate(), */function(req, res){
   res.sendFile(__dirname + '/../static/index.html');
});


app.post("/token", function(req, res, next) {
  console.log(req.body);
    if (req.body.email && req.body.password) {
        db.collection("users").findOne({email:req.body.email, password:req.body.password}).then((user)=> {
          if (user) {
              var payload = {
                  id: user.id
              };
              var token = jwt.encode(payload, cfg.jwtSecret);
              res.json({
                  token: token
              });
          } else {
              res.sendStatus(401);
          }
        }).catch((e) => {
          console.error(e);
          next(e);
        });
    } else {
        res.sendStatus(401);
    }
});

app.get('/secured/room/:id', /*auth.authenticate(),*/ function(req, res){
  let roomId = req.params.id;
  let messages = [
    {id:1, date:Date.now(), userId:1, text:"aaaa bbbb ccccccc"},
    {id:2, date:Date.now(), userId:2, text:"aefefjajf aefeakfjaelfjkl"}];
   res.json({
     users: {1:{id:1, fullname:"Nom Prénom 1", avatar:"/secured/users/1/avatar"}, 2:{id:2, fullname:"Nom Prénom 2", avatar:"/secured/users/2/avatar"}},
     messages : messages
   });
});


io.sockets.on('connection', socketioJwt.authorize({
    secret: cfg.jwtSecret,
    timeout: 15000 // 15 seconds to send the authentication message
  })).on('authenticated', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
      });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);

        db.collection("messages").insert({
          "date":Date.now(),
          "user":"",
          "room":"",
          "msg":msg
        }).catch((e) => {
          console.error(e);
        });

    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');

  MongoClient.connect(url).then((db_) => {
    db = db_;
    auth.setDB(db);
  }).catch((e) => {
    console.error(e);
  });

});

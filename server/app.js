"use strict"

import path from 'path';
import http from 'http';
import crypto from 'crypto';

import express from 'express';
import WebSocket from 'ws';

import jwt from 'jsonwebtoken';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import wordgen from "./wordgen.js";
const cfg = require("./config.js");

const app = express();

const server = http.createServer(app);

const wsServer = new WebSocket.Server({server});

//var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/nodechat';
var db=null;


app.use(bodyParser.json());
app.use(cookieParser());
//app.use(auth.initialize());

app.use(express.static(__dirname+"/../dist/"));

/*
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
*/

app.post("/auth", function(req, res) {
  const payload = {name:'user'};
  const secret = 'secret-key';
  const exp = 15 * 24 * 3600 * 1000; // 15 days
  let token = jwt.sign(payload, secret,{
              expiresIn : exp
          })
  res.cookie('auth_token', token, {maxAge: exp, httpOnly:true});
  res.status(200).end();
});

// middleware verifing JWT cookie on secured url
app.use("/secured", function(req, res, next) {
  let token = req.cookies['auth_token'];
  if (!token) {
      res.status(401).end();
  } else {
      jwt.verify(token, 'secret-key', function (err, decoded) {
          if (err) {
            res.status(401).end();
          } else {
            req.user = decoded //[1]
            next();
          }
      })
  }
});


app.get('/secured/channel', function(req, res){
  let channels=[];
  for(let i=0; i<10; i++) {
    channels.push({id:'channel'+i, title:'Channel '+i});
  }
  res.json({
    channels: channels,
  });
});

app.get('/secured/channel/:id', function(req, res) {
  let channelId = req.params.id;
  let nusers=5;
  let users = {};
  let messages = [];
  for(let i=0; i<nusers; i++) {
    let u ={
      id:crypto.randomBytes(16).toString('hex'),
      fullname:wordgen()+"_"+wordgen()
    };
    users[u.id]=u;
  }
  for(let i=0; i<100; i++) {
    let text = "";
    for(let w=0; w<1+Math.random()*20; w++) {
      text += wordgen()+" ";
    }
    messages.push({
       id:crypto.randomBytes(16).toString('hex'),
       date:parseInt(Date.now()-Math.random()*1000*3600*24*7),
       userId:Object.keys(users)[parseInt(Math.random()*nusers)],
       text:text
    });
    messages.sort((a,b)=> {
      return a.date - b.date;
    });
   }
   res.json({
     users: users,
     messages : messages
   });
});

app.get('/secured/users/:id/avatar', function(req, res){
  res.sendFile(path.join(__dirname,'defaultAvatar.png'), {headers: {'Content-Type':'application/png'}});
});


wsServer.on('connection', (ws,req) => {

    let i = req.headers.cookie.indexOf("auth_token=");
    let token = req.headers.cookie.substring(i+"auth_token=".length);
    jwt.verify(token, 'secret-key', function (err, decoded) {
        if (!err) {
          ws.auth=true;
          console.log('user authenticated',token);

          ws.on('disconnect', () => {
              console.log('user disconnected');
            });

          ws.on('message', (msg) => {
            console.log(msg);
            wsServer.clients.forEach(client => {
              if (client != ws) {
                ws.send(msg);
              }
            });
          });
        }
    })

/*
        db.collection("messages").insert({
          "date":Date.now(),
          "user":"",
          "room":"",
          "msg":msg
        }).catch((e) => {
          console.error(e);
        });
*/
  });

  const interval = setInterval(function ping() {
    wsServer.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(()=>{});
    });
  }, 30000);


// return index page for html5 routing
app.get('*', function(req, res){
   res.sendFile(path.resolve('dist/index.html'));
});


server.listen(3000, () => {
  console.log('listening on *:3000');
/*
  MongoClient.connect(url).then((db_) => {
    db = db_;
    auth.setDB(db);
  }).catch((e) => {
    console.error(e);
  });
*/
});

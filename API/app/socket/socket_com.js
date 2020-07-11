var app = require('express')();
var fs = require("fs");
// var https = require('https');
var http = require('http');

var options = {}

var httpsServer = http.createServer(options, app);

var io = require('socket.io')(httpsServer);


var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


var fs = require('fs')

app.use(handler)
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

var DashboardFile = require('../controllers/dashboard.controller');
var middleware = require('../../shared/middleware');

var PORT = process.env.PORT2;

httpsServer.listen(port);
  console.log(`Running on port no : ${PORT}`);

// httpServer.listen(port);

app.all('/*', function(req, res,next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Credentials", "true");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
   res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
   next()
});


//////////////////// CHAT MODELS start ///////////////////////

io.use((socket, next) => {
  let handshake = socket.handshake;
  // console.log(handshake)
  // console.log(handshake.headers.origin)
  var allowedOrigins = ['http://mayank.frikis.xyz', 'http://localhost:4200'];
  var origin = handshake.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    
    let obj = {
      headers : {
        authorization: handshake.query.token
      }
    }

    middleware.authCheck(obj, function(AUTH_CB){
      if(AUTH_CB.error == false){
        next()
      }else{
        next(new Error('Not a doge error'));
      }
    })

  }else{
    next(new Error('Not a doge error'));
  }
});

io.on('connection', function (socket) {
  console.log('socket connected');

  let handshake = socket.handshake;
  // console.log(handshake.headers.origin)
  
  socket.on('room_join', function(msg) {
      console.log('room_join', msg.room_id);
      // console.log(msg.sender_id);
      socket.join(msg.room_id, () => {
        io.to(msg.room_id).emit('room_join',{status:true,room_id:msg.room_id,sender_id:msg.sender_id});
      });
  });
  socket.on('room_leave',(msg)=>{
      console.log('room_leave', msg.room_id);
      socket.leave(msg.room_id, () => {
        io.to(msg.room_id).emit('room_leave',{status:true,room_id:msg.room_id,sender_id:msg.sender_id});
      });
  })
  
  var stockIds = [ 
    { id: '5f0747e48f8c56a8b5984e97', old_value: 10, current_value: null},
    { id: '5f0749608f8c56a8b5984e98', old_value: 8.5, current_value: null},
    { id: '5f0749e28f8c56a8b5984e99', old_value: 25, current_value: null},
    { id: '5f074a688f8c56a8b5984e9a', old_value: 22.55, current_value: null},
  ]

  var signs = [ '+', '-', '-', '+', '+', '+', '-', '+', '-', '-', '+' ]

  socket.on('stock_update',(msg)=>{
    // console.log(".............")
    setInterval(() => {
      for(var i = 0; i < stockIds.length; i++){
        let s = Math.floor(Math.random() * 10) + 1
        let v = Math.floor(Math.random() * 10) + 1
        stockIds[i].old_value = stockIds[i].current_value
        stockIds[i].current_value = eval(stockIds[i].current_value + signs[s] + v)
        DashboardFile.updatingStock( stockIds[i].id, stockIds[i].old_value, stockIds[i].current_value )
        io.to(stockIds[i].id).emit('stock_update', {id: stockIds[i].id, value: stockIds[i].current_value});
      }
    }, 10000); //10 sec
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

function handler (req, res) {
  fs.readFile(__dirname + '/404.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

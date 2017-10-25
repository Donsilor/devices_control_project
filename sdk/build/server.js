var express = require('express')
var app = require('express')()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')
//

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

app.get('/', function(req, res){
  res.sendFile(resolve('example/debug.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('Device.control', function(msg){
    console.log('message: ');
    console.log(typeof msg === 'object' ? JSON.stringify(msg): msg)
    if(msg.callbackName){
        socket.emit(msg.callbackName, Object.assign(msg,{msg:"来自服务器端的消息",code:0}))
    }
  });
});

app.use(express.static(resolve('/example')));
app.use('/dist', express.static(resolve('/dist')));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

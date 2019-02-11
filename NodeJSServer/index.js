const WebSocket = require('ws');
require('messager.js');
import * as bridge from '../Common/JSBridgeCore'
//require('../Common/JSBridgeCore');

let message = new MessagerModule()



let ws = new WebSocket.Server({ port: 8088 })
ws.on('connection', function connection(ws) {
    console.log('connection');
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      ws.send('Hi Client');
    });//当收到消息时，在控制台打印出来，并回复一条信息
});



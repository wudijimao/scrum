"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require('ws');
const messager_1 = require("./messager");
//require('../Common/JSBridgeCore');
let message = new messager_1.MessagerModule();
let ws = new WebSocket.Server({ port: 8088 });
ws.on('connection', function connection(ws) {
    console.log('connection');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        ws.send('Hi Client');
    }); //当收到消息时，在控制台打印出来，并回复一条信息
});
//# sourceMappingURL=index.js.map
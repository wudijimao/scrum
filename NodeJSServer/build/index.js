"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const module_1 = require();
from;
'../../Common/JSBridgeCore';
const messager_1 = require("./messager");
let message = new messager_1.MessagerModule();
let model = new module_1.TestBridgeModule();
let wsServer = new WebSocket.Server({ port: 8088 });
wsServer.on('connection', function (ws) {
    console.log('connection');
    ws.on('message', function (message) {
        console.log('received: %s', message);
        ws.send('Hi Client' + message);
    }); //当收到消息时，在控制台打印出来，并回复一条信息
});
class WebSocketBridgeCore {
    constructor(ws) {
        this.ws = null;
        this.ws = ws;
    }
    call(jsonData) {
        let str = JSON.stringify(jsonData);
        this.ws.send(str);
    }
    register() {
        let self = this;
        this.ws.onmessage = function (mes) {
            let jsonObject = JSON.parse(mes.data);
            self.onRecve(jsonObject);
        };
    }
}
let wsBridge = new module_1.Bridge(new JSBridge.WebSocketBridgeCore(wsServer));
//# sourceMappingURL=index.js.map
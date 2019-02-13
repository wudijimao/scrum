"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const JSBridgeCore_1 = require("../../Common/JSBridgeCore");
const messager_1 = require("./messager");
let message = new messager_1.MessagerModule();
let data = new JSBridgeCore_1.DataSyncModule();
let wsServer = new WebSocket.Server({ port: 8088 });
wsServer.on('connection', function (ws) {
    console.log('connection');
    let model = new JSBridgeCore_1.TestBridgeModule();
    var wsBridge = new JSBridgeCore_1.Bridge(new NodeWebSocketBridgeCore(ws));
    wsBridge.register("test", model);
    wsBridge.register("data", data);
    ws.on('message', function (message) {
        console.log('received: %s', message);
        //ws.send('Hi Client' + message);
    }); //当收到消息时，在控制台打印出来，并回复一条信息
});
class NodeWebSocketBridgeCore {
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
            try {
                let jsonObject = JSON.parse(mes.data);
                self.onRecve(jsonObject);
            }
            catch (error) {
            }
        };
    }
}
//# sourceMappingURL=index.js.map
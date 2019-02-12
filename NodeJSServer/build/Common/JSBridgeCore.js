"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WKWebViewBridgeCore {
    call(jsonData) {
        let str = JSON.stringify(jsonData);
        window.webkit.messageHandlers.default.postMessage(str);
    }
    register() {
        window.sendMsg = function (strMes) {
            let jsonObject = JSON.parse(strMes);
            this.onRecve(jsonObject);
        };
    }
}
exports.WKWebViewBridgeCore = WKWebViewBridgeCore;
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
exports.WebSocketBridgeCore = WebSocketBridgeCore;
class Bridge {
    constructor(core) {
        this.id = 0;
        this.core = null;
        this.core = core;
        core.register();
        core.onRecve = this.onRecveMes;
    }
    genHandleId() {
        return this.id++;
    }
    callNative(moduleName, funcName, args, callback) {
        var id = this.genHandleId();
        if (callback) {
            this.handlers[id] = callback;
        }
        this.core.call({
            module: moduleName,
            func: funcName,
            args: args,
            handlerId: id
        });
    }
    onRecveMes(json) {
        if (json.method === 'callback') {
            var callback = this.handlers[json.handlerId];
            callback && callback(json.args, json.err);
            delete this.handlers[json.handlerId];
        }
        else {
            var event = document.createEvent(json.name);
            event.initEvent(json.data, true, true);
            document.dispatchEvent(event);
        }
    }
    register(moduleName, module) {
        for (part in module) {
        }
        native[moduleName][funcName] = function () {
            var inArguments = arguments;
            return new Promise(function (resolve, reject) {
                var args = {};
                for (var index in inArguments) {
                    args[argsList[index]] = inArguments[index];
                }
                window.bridge.callNative(moduleName, funcName, args, function (data, err) {
                    if (err === undefined) {
                        resolve(data);
                    }
                    else {
                        reject(err);
                    }
                });
            });
        };
    }
}
exports.Bridge = Bridge;
class TestBridgeModule {
    // 被调用异步函数
    getStr() {
        return "aaa";
    }
    // 被调用异步函数
    getStr2Async() {
        return new Promise(function (resolve, reject) {
            resolve("aaa async");
        });
    }
}
exports.TestBridgeModule = TestBridgeModule;
//# sourceMappingURL=JSBridgeCore.js.map
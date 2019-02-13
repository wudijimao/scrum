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
        this.handlers = {};
        this.id = 0;
        this.core = null;
        this._modelMap = {};
        this.core = core;
        core.register();
        let self = this;
        core.onRecve = function (params) {
            self.onRecveMes(params);
        };
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
    callBack(handlerId, args) {
        this.core.call({
            method: "callback",
            handlerId: handlerId,
            args: args
        });
    }
    onRecveMes(json) {
        debugger;
        if (json.method === 'callback') {
            var callback = this.handlers[json.handlerId];
            callback && callback(json.args, json.err);
            delete this.handlers[json.handlerId];
        }
        else if (json.method === 'sendEvent') {
            var event = document.createEvent(json.name);
            event.initEvent(json.data, true, true);
            document.dispatchEvent(event);
        }
        else {
            let module = this._modelMap[json.module];
            if (module != undefined) {
                var funcName = json.func;
                var func = module[funcName];
                if (func != undefined) {
                    func = func.bind(module);
                    let ret = func(json.args);
                    this.callBack(json.handlerId, ret);
                }
                else {
                    funcName = funcName + "Async";
                    func = module[funcName];
                    if (func != undefined) {
                        func = func.bind(module);
                        let self = this;
                        let retPromise = func(json.args);
                        retPromise.then(function (ret) {
                            self.callBack(json.handlerId, ret);
                        }).catch(function (e) {
                            debugger;
                        });
                    }
                    else {
                        console.log("未找到对应的方法");
                    }
                }
            }
        }
    }
    register(moduleName, module) {
        console.log(JSON.stringify(module));
        let self = this;
        this._modelMap[moduleName] = module;
        for (let part in module) {
            if (part.startsWith("call")) {
                let funcName = part[4].toLowerCase() + part.substring(5);
                let argsList = module[part];
                module[part] = function () {
                    var inArguments = arguments;
                    return new Promise(function (resolve, reject) {
                        var args = {};
                        if (argsList != undefined) {
                            for (var index in inArguments) {
                                args[argsList[index]] = inArguments[index];
                            }
                        }
                        else {
                            args = inArguments[0];
                            if (args == undefined) {
                                args = {};
                            }
                        }
                        self.callNative(moduleName, funcName, args, function (data, err) {
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
    }
}
exports.Bridge = Bridge;
class TestBridgeModule {
    constructor() {
        this.testStr = "";
        // 调用另一端, 必须以call开头
        this.callGetStr = null;
        this.callGetStr2 = null;
    }
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
class DataSyncModule {
    constructor() {
        this.onDataSynced = function () { };
        this.msg = "not set";
        this.callSyncData = null;
        this.callSetMsg = null;
    }
    syncData(dataStr) {
        let jsonData = JSON.parse(dataStr);
        for (let part in jsonData) {
            this[part] = jsonData[part];
        }
        this.onDataSynced();
    }
    _syncData(data) {
        let str = JSON.stringify(data);
        this.callSyncData(str);
    }
    setMsg(msg) {
        this.msg = msg;
        this._syncData(this);
    }
}
exports.DataSyncModule = DataSyncModule;
//# sourceMappingURL=JSBridgeCore.js.map

export interface OnRecveFunction {
    (params: object): void
}

export interface BridgeCore {
    call(jsonData: object): void
    register(): void
    onRecve: OnRecveFunction
}


export class WKWebViewBridgeCore implements BridgeCore {
    call(jsonData: object) {
        let str = JSON.stringify(jsonData)
        window.webkit.messageHandlers.default.postMessage(str)
    }
    onRecve: OnRecveFunction
    register() {
        window.sendMsg = function (strMes: string) {
            let jsonObject = JSON.parse(strMes)
            this.onRecve(jsonObject)
        }
    }
}


export class WebSocketBridgeCore implements BridgeCore {
    ws: WebSocket = null;

    constructor(ws: WebSocket) {
        this.ws = ws
    }

    call(jsonData: object) {
        let str = JSON.stringify(jsonData)
        this.ws.send(str)
    }
    onRecve: OnRecveFunction
    register() {
        let self = this
        this.ws.onmessage = function (mes) {
            let jsonObject = JSON.parse(mes.data)
            self.onRecve(jsonObject)
        }
    }
}






export class Bridge {

    constructor(core: BridgeCore) {
        this.core = core
        core.register()
        let self = this
        core.onRecve = function (params: object) {
            self.onRecveMes(params)
        }
    }

    handlers: object = {}
    id: number = 0
    core: BridgeCore = null
    genHandleId() {
        return this.id++
    }
    callNative(moduleName: string, funcName: string, args: object, callback: object) {
        var id = this.genHandleId()
        if (callback) {
            this.handlers[id] = callback
        }
        this.core.call({
            module: moduleName,
            func: funcName,
            args: args,
            handlerId: id
        })
    }
    private callBack(handlerId: number, args: object) {
        this.core.call({
            method: "callback",
            handlerId: handlerId,
            args: args
        })
    }


    onRecveMes(json: object) {
        debugger
        if (json.method === 'callback') {
            
            var callback = this.handlers[json.handlerId]
            callback && callback(json.args, json.err)
            delete this.handlers[json.handlerId]
        } else if (json.method === 'sendEvent') {
            var event = document.createEvent(json.name)
            event.initEvent(json.data, true, true)
            document.dispatchEvent(event)
        } else {
            let module = this._modelMap[json.module]
            if (module != undefined) {
                var funcName = json.func
                var func = module[funcName]
                if (func != undefined) {
                    let ret = func(json.args);
                    this.callBack(json.handlerId, ret)
                } else {
                    funcName = funcName + "Async"
                    func = module[funcName]
                    if (func != undefined) {
                        let self = this
                        let retPromise: Promise<any> = func(json.args);
                        retPromise.then(function(ret){
                            self.callBack(json.handlerId, ret)
                        }).catch(function(e){
                            debugger
                        })
                    } else {
                        console.log("未找到对应的方法")
                    }
                }
            }
        }
    }

    private _modelMap: any = {}

    register(moduleName: string, module: object) {
        console.log(JSON.stringify(module));
        let self = this
        this._modelMap[moduleName] = module
        for (let part in module) {
            if (part.startsWith("call")) {
                let funcName = part[4].toLowerCase() + part.substring(5)
                module[part] = function () {
                    var inArguments = arguments
                    return new Promise(function (resolve, reject) {
                        var args = {}
                        for (var index in inArguments) {
                            args[argsList[index]] = inArguments[index]
                        }
                        self.callNative(moduleName, funcName, args, function (data, err) {
                            if (err === undefined) {
                                resolve(data)
                            } else {
                                reject(err)
                            }
                        })
                    })
                }
            }
        }
    }
}


export interface CallGetStrFunction {
    (): Promise<string>
}

export class TestBridgeModule {

    testStr: string = ""
    // 被调用异步函数
    getStr(): string {
        return "aaa"
    }
    // 被调用异步函数
    getStr2Async(): Promise<string> {
        return new Promise<string>(function (resolve, reject) {
            resolve("aaa async")
        })
    }
    // 调用另一端, 必须以call开头
    callGetStr: CallGetStrFunction = null;
    callGetStr2: CallGetStrFunction = null;
}
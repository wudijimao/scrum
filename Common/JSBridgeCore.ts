
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
        core.onRecve = this.onRecveMes
    }

    handlers: {}
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
    onRecveMes(json: object) {
        if (json.method === 'callback') {
            var callback = this.handlers[json.handlerId]
            callback && callback(json.args, json.err)
            delete this.handlers[json.handlerId]
        } else {
            var event = document.createEvent(json.name)
            event.initEvent(json.data, true, true)
            document.dispatchEvent(event)
        }
    }

    register(moduleName: string, module: object) {
        for part in module {

        }

        native[moduleName][funcName] = function () {
            var inArguments = arguments
            return new Promise(function (resolve, reject) {
                var args = {}
                for (var index in inArguments) {
                    args[argsList[index]] = inArguments[index]
                }
                window.bridge.callNative(moduleName, funcName, args, function (data, err) {
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


export interface CallGetStrFunction {
    (): Promise<string>
}

export class TestBridgeModule {
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
    callGetStr: CallGetStrFunction
    callGetStr2: CallGetStrFunction
}
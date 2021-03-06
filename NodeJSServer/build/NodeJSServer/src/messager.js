"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSBridgeCore_1 = require("../../Common/JSBridgeCore");
class ContextModule extends JSBridgeCore_1.DataSyncModule {
    constructor() {
        super(...arguments);
        this.account = new Account();
        this.callLogin = null;
    }
    login(userName) {
        this.account.isGuest = true;
        this.account.userInfo.nickName = userName;
    }
}
exports.ContextModule = ContextModule;
class UserInfo {
    constructor() {
        this.nickName = "";
        this.id = "";
    }
}
exports.UserInfo = UserInfo;
class Account {
    constructor() {
        this.id = "";
        this.isGuest = false;
        this.userInfo = new UserInfo();
    }
}
exports.Account = Account;
//# sourceMappingURL=messager.js.map
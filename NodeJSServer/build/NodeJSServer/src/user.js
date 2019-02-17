"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSBridgeCore_1 = require("../../Common/JSBridgeCore");
class UserContextModule extends JSBridgeCore_1.DataSyncModule {
    constructor() {
        super(...arguments);
        this.account = new Account();
        this.callLogin = null;
    }
    getAccountListFromsList() {
        this.list = [];
        for (let key in UserContextModule.sList) {
            this.list.push(UserContextModule.sList[key].account);
        }
        this._syncData();
    }
    login(userName) {
        this.account.isGuest = true;
        this.account.userInfo.nickName = userName;
        UserContextModule.sList.push(this);
        for (let acc in UserContextModule.sList) {
            UserContextModule.sList[acc].getAccountListFromsList();
        }
    }
}
UserContextModule.sList = Array();
exports.UserContextModule = UserContextModule;
class UserInfo {
    constructor() {
        this.nickName = "not set nick Name";
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
//# sourceMappingURL=user.js.map
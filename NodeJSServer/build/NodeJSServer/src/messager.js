"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessagerModule {
    constructor() {
        this.account = new Account();
    }
    login() {
    }
    loginWithGuest() {
    }
}
exports.MessagerModule = MessagerModule;
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
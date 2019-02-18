import {DataSyncModule, CallSendStrFunction} from '../../Common/JSBridgeCore'

export class UserContextModule extends DataSyncModule {
    account = new Account()
    list: Array<Account>
    static sList: Array<UserContextModule> = Array<UserContextModule>();

    private getAccountListFromsList() {
        this.list = []
        for (let key in UserContextModule.sList) {
            this.list.push(UserContextModule.sList[key].account);
        }
        this._syncData()
    }

    login(userName: string) {
        this.account.isLogin = true
        this.account.userInfo.nickName = userName
        UserContextModule.sList.push(this)
        for (let acc in UserContextModule.sList) {
            UserContextModule.sList[acc].getAccountListFromsList()
        }
        
    }

    callLogin: CallSendStrFunction = null
}

export class UserInfo {
    nickName = "not set nick Name"
    id = ""
}

export class Account {
    id = "";
    isLogin = false;
    userInfo = new UserInfo() 
}



import {DataSyncModule, CallSendStrFunction} from '../../Common/JSBridgeCore'

export class UserContextModule extends DataSyncModule {
    account = new Account()

    login(userName: string) {
        this.account.isGuest = true
        this.account.userInfo.nickName = userName
        this._syncData()
    }

    callLogin: CallSendStrFunction = null
}

export class UserInfo {
    nickName = ""
    id = ""
}

export class Account {
    id = "";
    isGuest = false;
    userInfo = new UserInfo() 
}



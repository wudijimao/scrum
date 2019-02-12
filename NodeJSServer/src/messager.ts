export class MessagerModule {
    account = new Account()

    login() {
        
    }
    loginWithGuest() {

    }
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



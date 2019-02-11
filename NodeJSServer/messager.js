class MessagerModule {
    account = new Account()

    login() {
        
    }
    loginWithGuest() {

    }
}

class UserInfo {
    nickName = ""
    id = ""
}

class Account {
    id = "";
    isGuest = false;
    userInfo = new UserInfo()
}



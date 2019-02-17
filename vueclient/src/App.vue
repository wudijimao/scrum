<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>状态:{{status}}</h1>
    <h2>数据:{{msg}}</h2>
    <div v-for="(item, i) in items" :key="i">
      <UserCard class="card" :msg=item />
    </div>
    
    <button v-on:click="connect">连接</button>
    <button v-on:click="test">测试</button>
    <button v-on:click="test2">测试2</button>
    <button v-on:click="login">测试设置用户名</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import UserCard from './components/UserCard.vue'
import * as JSBridge from '../../Common/JSBridgeCore';
import { UserContextModule } from '../../NodeJSServer/src/user';

var model = new JSBridge.TestBridgeModule()

@Component({
  components: { 
    HelloWorld,
    UserCard,
  },
})

export default class App extends Vue {
  public status: string = "Not click"
  public msg: string = 'Welcome to Your Vue.js + TypeScript App31'

  private ws: WebSocket
  private model: JSBridge.TestBridgeModule = new JSBridge.TestBridgeModule()
  private data = new JSBridge.DataSyncModule()
  private context = new UserContextModule()

  public items = []

  test() {
    debugger
    this.data.callSetMsg("set msg from client")
  }

  test2() {
    let app = this
    this.model.callGetStr2().then(function (mes) {
      app.msg = mes
    })
  }

  testSetUerName() {
    this.data.callSetTestUserName("wudijimao")
  }

  login() {
    this.context.callLogin("wuximiao")
  }

  connect() {
      let app = this

      this.ws = new WebSocket("ws://127.0.0.1:8088");
      

      let bridge = new JSBridge.Bridge(new JSBridge.WebSocketBridgeCore(this.ws))
      bridge.register("test", this.model)
      bridge.register("data", this.data)
      bridge.register("context", this.context)
      

      this.status = "连接中";
      
      
      this.ws.onopen = function(e) {
        app.status = "已经连接上"
        app.msg = "ceshiceshi"
        app.ws.send("ceshiceshi")
        // model.callGetStr().then(function(str) {
        //   app.msg = "callGetStr\()"
        // })
      }
      this.ws.onerror = function(e) {
        app.status = "连接错误"
      }
      this.ws.onclose = function() {
        app.status = "连接断开"
      }
      
      //this.data.onDataSynced = function() {
      //  app.msg = "onDataSynced:" + app.data.msg
      //}

      this.data.onDataSynced = function() {
        debugger
        app.msg = "onDataSynced:" + this.testUser.username
      }
      this.context.onDataSynced = function() {
        debugger
        if (this.account.isGuest == true) {
          app.items = []
          for (let key in this.list) {
            app.items.push(this.list[key].userInfo.nickName)
          }
        }
        
      }
   }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.card {
  background-color: blue;
  float: left;
  padding: 5em;
}
</style>

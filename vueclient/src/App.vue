<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>状态:{{status}}</h1>
    <HelloWorld :msg="msg"/>
    <button v-on:click="connect">连接</button>
    <button v-on:click="test">测试</button>
    <button v-on:click="test2">测试2</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import * as JSBridge from '../../Common/JSBridgeCore';

var model = new JSBridge.TestBridgeModule()

@Component({
  components: {
    HelloWorld,
  },
})

export default class App extends Vue {
  public status: string = "Not click"
  public msg: string = 'Welcome to Your Vue.js + TypeScript App31'

  private ws: WebSocket
  private model: JSBridge.TestBridgeModule = new JSBridge.TestBridgeModule()
  private data = new JSBridge.DataSyncModule()

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

  connect() {
      this.ws = new WebSocket("ws://127.0.0.1:8088");
      

      let bridge = new JSBridge.Bridge(new JSBridge.WebSocketBridgeCore(this.ws))
      bridge.register("test", this.model)
      bridge.register("data", this.data)

      this.status = "连接中";
      
      let app = this
      this.ws.onopen = function(e) {
        app.status = "已经连接上"
        app.msg = "ceshiceshi"
        app.ws.send("ceshiceshi")
        // model.callGetStr().then(function(str) {
        //   app.msg = "callGetStr\()"
        // })
      }
      // this.ws.onmessage = function(mes) {
      //   app.msg = mes.data
      //   //bridge.onRecveMes(mes.data)
      // }
      this.ws.onerror = function(e) {
        app.status = "连接错误"
      }
      this.ws.onclose = function() {
        app.status = "连接断开"
      }
      
      this.data.onDataSynced = function() {
        app.msg = "onDataSynced:" + app.data.msg
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
</style>

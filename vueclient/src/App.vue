<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld :msg="msg"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import * as JSBridge from '../../Common/JSBridgeCore';

@Component({
  components: {
    HelloWorld,
  },
})

var model = new JSBridge.TestBridgeModule()

export default class App extends Vue {
  public msg: string = 'Welcome to Your Vue.js + TypeScript App321'

  private ws: WebSocket

  public test() {
      let bridge = new JSBridge.Bridge(new JSBridge.WebSocketBridgeCore(this.ws))
      
      bridge.register("test", model)

      this.msg = "连接中";
      this.ws = new WebSocket("ws://127.0.0.1:8088");
      let app = this
      this.ws.onopen = function(e) {
        app.msg = "123321234";
        model.callGetStr().then(function(str) {
          app.msg = "callGetStr\()"
        })
      }
      this.ws.onmessage = function(mes) {
        bridge.onRecveMes(mes.data)
      }
      this.ws.onerror = function(e) {
        app.msg = "error"
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

<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <button v-on:click="reverseMessage">逆转消息</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as JSBridge from '../../Common/JSBridgeCore'

class ViewModule {
  msg: string = ''
}

var abc: ViewModule = new ViewModule()
var ws: WebSocket
var model = new JSBridge.TestBridgeModule()
var data = new JSBridge.DataSyncModule()
var test = function() {
      let bridge = new JSBridge.Bridge(new JSBridge.WebSocketBridgeCore(ws))
      
      bridge.register("test", model)

      abc.msg = "连接中";
      ws = new WebSocket("ws://127.0.0.1:8088");
      ws.onopen = function(e) {
        abc.msg = "123321234";
        model.callGetStr().then(function(str) {
          abc.msg = "callGetStr\()"
        })
      }
      ws.onmessage = function(mes) {
        bridge.onRecveMes(mes.data)
      }
      ws.onerror = function(e) {
        abc.msg = "error"
      }

      data.onDataSynced = function () {
        abc.msg = ""
      }
    }

export default {
  name: 'app',
  data () {
    abc.msg = 'Welcome to Your Vue.js App1';
    return abc;
  },
  methods: {
    reverseMessage: function () {
      abc.msg = '开始';
      test();
    },
    
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

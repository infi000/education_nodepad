/*jshint esversion: 6 */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '@/router';
Vue.use(Vuex);
var qs = require('qs');
var invoke = function(params, sucf, errf) {
  var _params = params || "",
    _sucf = sucf || function(d) {
      console.log(d);
    },
    _errf = errf || function(d) {
      log(d);
    },
    _url = state.HOST_DEV;
  axios.post(_url, qs.stringify(_params)).then(function(result) {
    var data = result.data;
    if (data.res == "success") {
      _sucf(data.data);
    } else {
      _errf(data.data);
    }
  }).catch(function(err) {
    console.log(err);
    _errf(err);
  });
};

const state = {
  HOST: 'http://192.168.58.14',
  HOST_DEV: 'http://192.168.58.14/teachcourse/admin.php?m=Admin&c=Index',
  // HOST_WS: 'ws://172.16.16.16:8880'
  HOST_WS: 'ws://127.0.0.1:8825'
};

const getters = {};

const mutations = {
  test(state,opt){
    console.log("测试陈宫");
  },


  getNote(state,opt) {
    var sucf=opt.sucf,
        errf=opt.errf||function(){},
        id=opt.id;

    //暂时先用原来的数据
    axios.get('./static/ans_92.json').then(
      function(result) {
        var data = result.data;
        if (data.res == "success") {
          sucf(data.data);
        } else {
          errf(data.data);
        }
      }).catch(function(err) {
      console.log(err);
      errf(err);
    });
  },


  /**
   * 建立WS
   *
   */
  wsInit(state) {
    // var socketurl = 'ws://221.228.74.71:8125';
    // var connparms = {};
    // var websocket = io.connect(socketurl, connparms);
    // websocket.on('isConn', function(data) {
    //   //  console.log("socket.on_isConn",data);
    //   websocket.emit('sendMpUser', {"courseid":"test","source": "web"});

    // });
    console.log(state)
     window.ws = new WebSocket(state.HOST_WS);
  }
};

mutations.wsInit(state);
export default new Vuex.Store({
  state,
  getters,
  mutations,
});

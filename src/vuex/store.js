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
      console.log(d);
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
  // HOST_DEV: 'http://192.168.58.14/teachcourse/admin.php?m=Admin&c=Index',
  HOST_DEV: 'http://172.16.16.2/teachcourse/admin.php?m=Admin&c=Index',
  HOST_WS: 'ws://172.16.16.2:8825',
  // HOST_WS: 'ws://172.16.16.2:8825',
  wsLogin: false, //websocket登陆表示
  binderList: [], //绑定的写字板用户{"wid":"用户ID","sticks":"用户签名ID"}
  binderInfo: {
    key: "__",
    pname: '__'
  }, //绑定密码
  writting: false, //循环接受笔记指令
  examid: "", //发起开始接受笔记时候传入的id
  allSignInfo: [], //选定的笔迹的所有轨迹
};

const getters = {};

const mutations = {
  /**
   * 获取笔迹内容信息
   */
  getNote(state, opt) {
    var sucf = opt.sucf,
      errf = opt.errf || function() {},
      id = opt.id,
      wid = opt.wid || '',
      nojudge=opt.nojudge||false;
      if(!state.examid){
        return ;
      }
    if (state.writting||nojudge) {
      var params = {
        a: PARAMS.getNote,
        writepadid: id,
        examid: state.examid,
        writeid: wid
      };

      invoke(params, sucf);
    }
  },
  /**
   * 获取用户签名图片
   */
  getSign(state, opt) {
    var sucf = opt.sucf,
      errf = opt.errf || function() {},
      wid = opt.wid,
      sticks = opt.sticks;
    var params = {
      a: PARAMS.getSign,
      writepadname: wid,
      signticks: sticks,
    };
    invoke(params, sucf);

  },

  /**
   * 建立WS
   */
  wsInit(state) {
    window.WS = new WebSocket(state.HOST_WS);
    WS.onopen = function() {
      // Web Socket 已连接上，使用 send() 方法发送数据
      // alert("链接成功...");
      if (!state.wsLogin) {
        WS.send('{"talk_id":"ice","cmdtype":"login","from":"student' + MAC + '","to":"","data":""}');
      }
    };

    WS.onmessage = function(evt) {
      var res = JSON.parse(evt.data),
        rm = res.data,
        type = res.cmdtype;
      switch (type) {
        case "login":
          //首次登陆成信息
          break;
        case "bind":
          //获取绑定写字板
          //判断新加入成员是否重复
          var arr = state.binderList;
          var repeat = false;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].wid == rm.wid) {
              repeat = true;
              return;
            }
          }
          if (!repeat) {
            state.binderList.push(rm);
          }

          break;
        case "cancel":
          //取消绑定写字板

          var wid=parseInt(rm);
          var arr=state.binderList;
          for(var i=0;i<arr.length;i++){
            var _wid=arr[i].wid;
            if(_wid==wid){
              arr.splice(i,1);
              return;
            }
          }
          break;
        case "password":
          //密码
          state.binderInfo = rm;
          break;
        case "write_start":
          //开始接受笔迹
          state.writting = true;
          state.examid = rm;
          break;
        case "write_end":
          //停止接受笔迹
          state.writting = false;
          // state.examid = rm;
          break;
      }
    };

    WS.onclose = function() {
      // 关闭 websocket
      state.wsLogin = false;
      mutations.wsInit(state);
      // console.log("连接已关闭...尝试重连");
    };
    WS.onerror = function(evt) {
      state.wsLogin = false;
    };
  },
  /**
   * 推送WS信息
   */
  wsSend(state, opt) {
    var from = opt.from || 'student' + MAC,
      to = opt.to || '',
      cmdtype = opt.cmdtype || '',
      data = opt.data || '';
    var o = {
      'talk_id': 'ice',
      'cmdtype': cmdtype,
      'from': from, //student+MAC地址 字符串
      'to': to,
      'data': data
    };
    WS.send(window.JSON.stringify(o));
  }
};

mutations.wsInit(state);
export default new Vuex.Store({
  state,
  getters,
  mutations,
});

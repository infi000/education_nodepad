<template>
  <div class="grid-content bg-purple">
    <!-- 显示笔记区域 -->
    <div class="note-box" ref='noteBox'>
      <!-- <h3>小明 id:{{user.wid}} </h3> -->
      <img :src="imgSign" class="imgSign">
      <el-button icon="el-icon-search" type="info" @click="view" style="position: absolute;bottom:1px ;right: 1px;padding: 6px;z-index: 1"></el-button>
      <note :info='signInfo' :loading="note_loading" :div_width='noteBoxWidth' :div_height='noteBoxHeight' v-if="noteshow" v-on:drawover="getNoteInfo(user.wid,wid)"></note>
    </div>
    <!-- 按钮组 -->
    <div class="note-btn-group">
      <el-button size="small" class="note-btn" @click="goTo(user.wid)">查看</el-button>
      <el-button size="small" class="note-btn" @click="clean(user.wid)">清空</el-button>
      <el-button size="small" class="note-btn" @click="push(user.wid)" v-show="!isPush">推送</el-button>
      <el-button size="small" class="note-btn" @click="undo(user.wid)" v-show="isPush">撤回</el-button>
    </div>
    <el-dialog title="" :visible.sync="dialogVisible" :width="dialogWidth+'px'" :height="dialogHeight+'px'" ref="dialog" @close="dialogshow=false" @open="dialogshow=true">
      <note :info="allSignInfo" :loading="note_loading" notimeout="true" :div_width='dialogWidth' :div_height="dialogHeight" v-if="dialogshow"></note>
      <!-- 123 -->
    </el-dialog>
  </div>
</template>
<script>
/*jshint esversion: 6 */
import note from '@/components/widget/note';
export default {
  props: ['user'],
  data() {
    var id = this.user.wid;
    return {
      dialogWidth: '', //弹窗口宽度
      dialogHeight: '', //弹窗口宽度
      noteBoxWidth: '', //外部容器宽度
      noteBoxHeight: '', //外部容器高度
      isPush: false, //推送中
      imgSign: "", //签名图片
      dialogVisible: false, //DIALOG开关
      signInfo: "", //笔迹信息
      allSignInfo: [], //所有笔迹信息
      wid: "", //最后一条笔迹ID
      id: id, //用户的ID
      note_loading: "", //笔迹组件LOADDING
      noteshow: true,
      dialogshow: false, //弹窗笔记开关
    };
  },
  watch: {
    writting() {
      //如果writting开始 执行过去笔迹函数
      if (this.writting) {
        var that = this;
        this.noteshow = false;
        this.signInfo = [];
        this.allSignInfo = [];
        setTimeout(function() {
          that.noteshow = true;
          that.getNoteInfo(that.id);
        }, 500);

      }
    },
  },
  computed: {
    writting() {
      return this.$store.state.writting;
    },
  },
  methods: {
    goTo(id) {

      this.$router.push({ path: 'view', query: { id: id } });
    },
    //清空
    clean(id) {
      var o = {
        cmdtype: 'remove',
        data: id
      };
      var that = this;
      this.signInfo = [];
      this.allSignInfo = [];
      this.noteshow = false;

      this.$store.commit('wsSend', o);
      setTimeout(function() {
        that.noteshow = true;
      }, 100);
    },
    //推送
    push(id) {
      this.isPush = true;
      var o = {
        cmdtype: 'push',
        data: id
      };
      this.$store.commit('wsSend', o);
    },
    //撤销
    undo(id) {
      this.isPush = false;
      var o = {
        cmdtype: 'undo',
        data: id
      };
      this.$store.commit('wsSend', o);
    },
    //获取签名图片
    getSign() {
      var that = this;
      var opt = this.user;
      opt.sucf = function(d) {
        //执行完后回调
        //获取图片base64编码,传给img
        that.imgSign = d[0].writeimage;
      };

      this.$store.commit('getSign', opt);
    },
    //放大查看
    view() {
      this.$store.state.allSignInfo = this.allSignInfo;
      this.dialogVisible = !this.dialogVisible;


    },
    //获取笔迹信息
    getNoteInfo(id, wid) {
      var that = this;
      var id = id || '';
      var wid = wid || '';
      var opt = {
        id: id,
        wid: wid,
        sucf: function($d) {
          var d=$d.d;
          //获取笔迹信息回调
          //1，处理笔迹CANVAS
          //2，继续获取剩余笔迹
          //2.1 d.length==0; 间隔2000ms重发 ,
          //2.2 d.length>0; writeid取数组最后一位的writeid字段的值

          if (d.length > 0) {
            that.signInfo = d;
            that.note_loading = false;
            var arr = that.allSignInfo.concat(d);
            that.allSignInfo = arr;
            arr = null;
            var lwid = d[d.length - 1]["writeid"];
            that.wid = lwid;
            console.log("最后一个wid", that.wid)
          } else {

            setTimeout(() => {
              that.getNoteInfo(id, that.wid);
            }, 2000);
          }
        }
      };
      this.$store.commit('getNote', opt);
    },
  },
  components: {
    note,
  },
  created() {

  },
  mounted() {
    var n = this.$refs.noteBox;
    var nw = n.offsetWidth;
    var nh = n.offsetHeight;
    var dialogWidth = document.getElementById("app").offsetWidth;
    var dialogHeight = document.getElementById("app").offsetHeight;
    this.dialogWidth = dialogWidth;
    this.dialogHeight = dialogHeight;
    this.noteBoxHeight = nh;
    this.noteBoxWidth = nw;
    this.getSign();
    if (this.writting) {
      this.getNoteInfo(this.id);
    }
  }

};

</script>
<style scoped>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.note-box {
  height: 200px;
  background-color: #fff;
  margin-bottom: 10px;
  box-shadow: 0 0 1px 1px #818181;
  overflow: hidden;
  position: relative;
}

.note-box h3 {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}


.note-btn {
  background-color: #313131;
  color: #fff;
  border-color: #000;
}

.imgSign {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  width: 30%;
  background: #0000006b;
}

</style>

<template>
  <div class="grid-content bg-purple">
    <!-- 显示笔记区域 -->
    <div class="note-box" ref='noteBox'>
      <!-- <h3>小明 id:{{user.wid}} </h3> -->
      <img :src="imgSign" class="imgSign">
      <el-button icon="el-icon-search" type="info" @click="dialogVisible = true"></el-button>
      <note :id=user.wid :div_width='noteBoxWidth' ref="e_note"></note>
    </div>
    <!-- 按钮组 -->
    <div class="note-btn-group">
      <el-button size="small" class="note-btn" @click="goTo(user.wid)">查看</el-button>
      <el-button size="small" class="note-btn" @click="clean(user.wid)">清空</el-button>
      <el-button size="small" class="note-btn" @click="push(user.wid)" v-show="!isPush">推送</el-button>
      <el-button size="small" class="note-btn" @click="undo(user.wid)" v-show="isPush">撤回</el-button>
    </div>
    <el-dialog title="" :visible.sync="dialogVisible" width="80%">
      <note :id=user.wid :div_width='noteBoxWidth' ref="e_note"></note>


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

    return {
      noteBoxWidth: '', //外部容器宽度
      isPush: false, //推送中
      imgSign: "", //签名图片
      dialogVisible: false
    };
  },
  computed: {

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
      this.$store.commit('wsSend', o);
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
    open() {

    }
  },
  components: {
    note,
  },
  created() {

  },
  mounted() {
    var n = this.$refs.noteBox;
    var nw = n.offsetWidth;
    this.noteBoxWidth = nw;
    this.getSign();
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

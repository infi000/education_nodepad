<template>
  <el-main style="padding-top: 0;background-color: #9bc0c9">
    <el-container style="height:100%">
      <!-- 手写板姓名1 -->
      <el-header style="line-height: 60px;background-color: rgba(0,0,0,0);">
        <el-row :gutter="20">
          <el-col :span="10" :offset="8">
            <div class="grid-content bg-purple">
              <h2 style="text-align: right">手写板用户1</h2></div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-button size="small" class="note-btn" @click="goBack">返回</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <!-- 笔记显示区域 -->
      <el-main style="height:100%;position: relative;overflow: hidden;" >
        <getnote :id='id'></getnote>
      </el-main>
    </el-container>
  </el-main>
</template>
<script>
/*jshint esversion: 6 */
import getnote from '@/components/widget/getnote';
export default {
  data() {
    return {
      noteInfo: '',
      id:'',

    };
  },
  computed: {

  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
  components: {
    getnote
  },
  created() {

  },
  mounted() {
    this.id=this.$route.query.id;

  }
};

</script>
<style scoped>
.note-btn {
  background-color: #313131;
  color: #daff0f;
  border-color: #000;
}

</style>

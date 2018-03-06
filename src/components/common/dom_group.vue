<template>
  <el-main style="padding-top: 0;background-color: #9bc0c9">
    <el-container>
      <!-- 分组与密码 -->
      <el-header style="line-height: 60px;background-color: rgba(0,0,0,0);">
        <h2>{{binderInfo.pname}} / 密码：{{binderInfo.key}}</h2>
      </el-header>
      <!-- 手写板分组显示区域 -->
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6" v-for="(user,index) in onlineList" :key="user.wid">
            <!-- 手写板模块 -->
            <binder :user="user"></binder>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-main>
</template>
<script>
import binder from '@/components/widget/binder';
import note from '@/components/widget/note';
export default {
  data() {
    return {
      activeIndex: '1', //默认NAV选项
    };
  },
  components: {
    binder,
  },
  computed: {
    onlineList() {
      var list =this.$store.state.binderList;
         // var list=[1]
      return list;
    },
    binderInfo(){
      var info=this.$store.state.binderInfo;

      return info;
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
}

</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0px;
  }
}

.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}







</style>

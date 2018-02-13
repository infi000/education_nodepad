<template>
  <el-header>
    <el-menu :default-active="activeIndex" class="el-menu-demo"  mode="horizontal" background-color="#000" text-color="#fff" active-text-color="#daff0f">
      <el-menu-item index="1" :style="{float:'right'}">互动</el-menu-item>
    </el-menu>
  </el-header>
</template>
<script>
  export default {
    data() {
      return {
        activeIndex: '1',//默认NAV选项
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style>


</style>

<template>
  <el-container direction="vertical" style="height: 100%">
    <dom-Header></dom-Header>
    <router-view ></router-view>
    <router-view name="view" style="position: absolute;top: 60px;bottom:0;width: 100%;z-index: 100000"></router-view>
  </el-container>
</template>
<script>
import domHeader from '@/components/common/dom_header';
export default {
  components: {
    domHeader,
  }
}

</script>
<style>
.el-header {
  background-color: #000;
}

</style>

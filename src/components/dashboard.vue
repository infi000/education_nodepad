<template>
  <el-container direction="vertical" style="height: 100%">
    <dom-Header></dom-Header>
    <dom-Main></dom-Main>
  </el-container>
</template>
<script>
import domHeader from '@/components/common/dom_header';
import domMain from '@/components/common/dom_main';
export default {
  components: {
    domHeader,
    domMain,
  }
}

</script>
<style>
.el-header {
  background-color: #000;
}

</style>

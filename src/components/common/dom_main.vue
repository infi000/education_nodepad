<template>
  <el-main style="padding-top: 0;background-color: #9bc0c9">
    <el-container>
      <!-- 分组与密码 -->
      <el-header style="line-height: 60px;background-color: rgba(0,0,0,0);">
        <h2>第一组 / 密码：12312321</h2>
      </el-header>
      <!-- 手写板分组显示区域 -->
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6">
            <!-- 手写板模块 -->
            <div class="grid-content bg-purple">
              <!-- 显示笔记区域 -->
              <div class="note-box">
              </div>
              <!-- 按钮组 -->
              <div>
                <el-button size="small" class="note-btn">查看</el-button>
                <el-button size="small" class="note-btn">清空</el-button>
                <el-button size="small" class="note-btn">推送</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-main>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '1', //默认NAV选项
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
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


.bg-purple {
  /*background: #000;*/
}


.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.note-box {
  height: 200px;
  background-color: #fff;
  margin-bottom: 10px;
  box-shadow: 0 0 1px 1px #818181;
}

.note-btn{
  background-color: #313131;
  color: #fff;
  border-color:#000;
}
</style>

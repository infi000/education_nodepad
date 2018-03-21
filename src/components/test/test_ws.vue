<template>
  <el-container direction="vertical" style="width:600px;">
    <h1>教师端推送消息</h1>
    <br>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="用户名/密码">
        <el-col :span="9">
          <el-input v-model="form.pname" placeholder="pname"></el-input>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="9">
          <el-input v-model="form.key" placeholder="key"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="wsSend('password','teacher')">推送</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="绑定">
        <el-col :span="6">
          <el-input v-model="form.binder_wid" placeholder="wid"></el-input>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="6">
          <el-input v-model="form.binder_sticks" placeholder="sticks"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="wsSend('bind','teacher')">绑定</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="笔迹指令">
        <el-col :span="4">
          <el-input v-model="form.write_data" placeholder="data"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="wsSend('write_start','teacher','',form.write_data)">开始</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="wsSend('write_end','teacher','',form.write_data)">结束</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="取消绑定">
        <el-col :span="4">
          <el-input v-model="form.cancel_data" placeholder=""></el-input>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="6">
          <el-input v-model="form.cancel_to" placeholder=""></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="wsSend('cancel','teacher','',form.cancel_data)">确定</el-button>
        </el-col>
      </el-form-item>
      <!-- 分割  -->
      <!-- 分割  -->
      <!-- 分割  -->
      <!-- 分割  -->
      <!-- 分割  -->
      <!-- 分割  -->
      <!-- 分割  -->
      <!--
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
      -->
    </el-form>
    <el-container direction="vertical" style="width:600px;">
      <h1>学生端推送消息</h1>
      <br>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-container>
  </el-container>
</template>
<script>
/*jshint esversion: 6 */
export default {
  props: [],
  data() {
    return {
      form: {
        pname: '第一组',
        key: 'KA',
        binder_wid: '411',
        binder_sticks: '636556017382060457',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        write_data: '96',
        cancel_to: 'student123',
        cancel_data: ""
      }
    }
  },
  computed: {

  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    wsSend(type, from, to, data) {
      var that = this;
      var _type = type || "",
        _from = from || 'teacher',
        _to = to || '',
        _data = data || '';
      var o = {
        'talk_id': 'ice',
        'cmdtype': _type,
        'from': _from, //student+MAC地址 字符串
        'to': _to,
        'data': _data
      };

      switch (_type) {
        case 'password':
          o['data'] = {
            pname: that.form.pname,
            key: that.form.key
          }
          break;
        case 'bind':
          o['data'] = {
            wid: that.form.binder_wid,
            sticks: that.form.binder_sticks
          }
          break;
        case 'cancel':
          break;

        case 'write_start':
          // WS.send(window.JSON.stringify(o));
          break;
        case 'write_end':

          break;
      }
      console.log(o)
      WS.send(window.JSON.stringify(o));

    }
  },
  components: {

  },
  created() {

  },
  mounted() {

  }

};

</script>

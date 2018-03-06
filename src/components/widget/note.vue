<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;height: 100%;position: relative;">
    <div ref="canvas_box" :style=style.box class="can_box">
      <canvas ref="canvas" width="1920" height="1080" :style=style.canvas></canvas>
    </div>
  </div>
</template>
<script>
/*jshint esversion: 6 */
export default {
  props: ['id', 'div_width'],
  data() {

    return {
      info: '',
      ctx: '',
      starttime: '',
      resources: '', //笔迹数据集合
      resources_now: '', //当前解析的笔迹
      loading: true,
      style: {
        box: "",
        canvas: ""
      },
      wid: "",//最后一个请求的writeid
    };
  },
  watch: {
    info() {
      if (this.info) {
        this.starttime = window.JSON.parse(this.info[0].writedata).StartTime;
        this.draw();
      }
    },
    writting() {
      //如果writting开始 执行过去笔迹函数
      if (this.writting) {
        this.getNoteInfo(this.id);
      }

    },
  },
  computed: {
    writting() {
      return this.$store.state.writting;
    },
    box_style_bak() {
      console.log("执行")
      if (this.resources_now) {

        var writedata = window.JSON.parse(this.info.writedata);
        var zoom = this.div_width ? (this.div_width / this.info.PointsRect.Width) : 1;
        return {
          width: this.info.PointsRect.Width + 'px',
          height: this.info.PointsRect.Height + 'px',
          'margin-left': -(this.info.PointsRect.Width) / 2 + 'px',
          background: '#fff',
          zoom: zoom
        };
        //*************************************
        //
        // var writedata = this.resources_now;
        // var zoom = this.div_width ? (this.div_width / 800) : 1;
        // console.log('writedata', writedata.PointsRect.Width);
        // return {
        //   // width: writedata.PointsRect.Width + 'px',
        //   // height: writedata.PointsRect.Height + 'px',
        //   // 'margin-left': -(writedata.PointsRect.Width) / 2 + 'px',
        //   // background: '#fff',
        //   // ***********
        //   width: writedata.PointsRect.Width + 'px',
        //   height: writedata.PointsRect.Height + 'px',
        //   'margin-left': -(writedata.PointsRect.Width) / 2 + 'px',
        //   background: '#fff',
        //   zoom: zoom
        // };

      }
    },
    can_style_bak() {
      if (this.resources_now) {
        // return {
        //   position: 'absolute',
        //   top: -this.info.PointsRect.Y + 'px',
        //   left: -this.info.PointsRect.X + 'px'
        // };
        //*************************************
        //
        var writedata = this.resources_now;
        return {
          position: 'absolute',
          top: -writedata.PointsRect.Y + 'px',
          left: -writedata.PointsRect.X + 'px'
        };
      }
    }
  },
  methods: {
    draw_bak() {
      var starttime = this.starttime;
      var resources = this.resources;
      var ctx = this.ctx;

      function draw(opt) {
        var points = opt.Points,
          time = (opt.StartTime - starttime) / 10000;
        time = parseInt(time);
        for (var i = 1; i < points.length; i++) {
          (function(i) {
            /**
             * es6语法 IE11不识别
             */
            setTimeout(() => {
              var x = points[i - 1].X,
                y = points[i - 1].Y;
              ctx.beginPath();
              ctx.moveTo(x, y);
              x = points[i].X;
              y = points[i].Y;
              ctx.lineTo(x, y);
              ctx.stroke();
            }, time);
          })(i);
        }
      }

      for (var i = 0; i < resources.length; i++) {
        var ls = resources[i].listStrokes;
        for (var j = 0; j < ls.length; j++) {
          draw(ls[j]);
        }
      }
    },
    draw() {
      var starttime = this.starttime;
      var resources = this.info;
      var ctx = this.ctx;

      function draw(opt) {
        var points = opt.Points,
          time = (opt.StartTime - starttime) / 10000;
        time = parseInt(time);
        for (var i = 1; i < points.length; i++) {
          (function(i) {
            /**
             * es6语法 IE11不识别
             */
            setTimeout(() => {
              var x = points[i - 1].X,
                y = points[i - 1].Y;
              ctx.beginPath();
              ctx.moveTo(x, y);
              x = points[i].X;
              y = points[i].Y;
              ctx.lineTo(x, y);
              ctx.stroke();
            }, time);
          })(i);
        }
      }

      for (var i = 0; i < resources.length; i++) {
        var ls = window.JSON.parse(resources[i].writedata);
        //改变背景宽高
        this.resources_now = ls;
        this.changeStyle();
        //绘图
        draw(ls);
      };

    },
    getNoteInfo(id, wid) {
      var that = this;
      var id = id || '';
      var wid = wid || '';
      var opt = {
        id: id,
        wid: wid,
        sucf: function(d) {
          //获取笔迹信息回调
          //1，处理笔迹CANVAS
          //2，继续获取剩余笔迹
          //2.1 d.length==0; 间隔2000ms重发 ,
          //2.2 d.length>0; writeid取数组最后一位的writeid字段的值
          var t = 10;
          if (d.length > 0) {
            that.info = d;
            that.loading = false;
            var lwid = d[d.length - 1]["writeid"];
            that.wid = lwid;
          } else {
            t = 2000;
          }
          setTimeout(() => {
            that.getNoteInfo(id, that.wid);
          }, t);

        }
      };
      this.$store.commit('getNote', opt);
    },
    //改变容器和canvasstyle
    changeStyle() {
      if (this.resources_now) {
        var writedata = this.resources_now;
        var old_width = this.style.box.width || writedata.PointsRect.Width;
        var old_x = this.style.box.x || writedata.PointsRect.X;
        var old_height = this.style.box.height || writedata.PointsRect.Height;
        var old_y = this.style.box.y || writedata.PointsRect.Y;
        var new_width = writedata.PointsRect.Width;
        var new_x = writedata.PointsRect.X;
        var new_height = writedata.PointsRect.Height;
        var new_y = writedata.PointsRect.Y;
        var old_can_x = this.style.canvas.left || writedata.PointsRect.X;
        var old_can_y = this.style.canvas.top || writedata.PointsRect.Y;
        var width = parseInt(old_width),
          height = parseInt(old_height),
          y = Math.abs(parseInt(old_can_y)),
          x = Math.abs(parseInt(old_can_x));
        if ((new_width + new_x) > parseInt(old_width + old_x)) {
          width = new_width + new_x;
        }
        if ((new_height + new_y) > parseInt(old_height + old_y)) {
          height = new_height + new_y;
        }
        if (new_x < x) {
          x = new_x;
        }
        if (new_y < y) {
          y = new_y;
        }
        var zoom = this.div_width ? (this.div_width / width) : 1;
        var box = {
          width: width + 'px',
          height: height + 'px',
          'margin-left': -(width) / 2 + 'px',
          background: '#fff',
          zoom: zoom,
          _x: x,
          _y: y
        };
        var canvas = {
          position: 'absolute',
          top: -y + "px",
          left: -x + "px",
        };
        this.style.box = box;
        this.style.canvas = canvas;
      }
    }

  },
  components: {

  },
  created() {

  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d');
    if(this.writting){
       this.getNoteInfo(this.id);
    }
  }

};

</script>
<style scoped>
.can_box {
  position: absolute;
  /*  width: 700px;
  height: 500px;*/
  margin-left: -350px;
  left: 50%;
  /*background-color: #fff;*/
  overflow: hidden;
}

</style>

<template>
  <div ref="canvas_box" :style=style.box class="can_box">
    <canvas ref="canvas" width="1920" height="1080" :style=style.canvas></canvas>
  </div>
</template>
<script>
/*jshint esversion: 6 */
export default {
  //info:笔记信息,
  // loadding:,
  // div_width:外部容器宽度,
  // notimeout:布尔，是否显示笔迹轨迹
  // bindernote:绑定在binder组件中的，需要从父级组件中props获取笔迹信息
  props: ['info', 'bindernote', 'loading', 'div_width', 'notimeout'],
  data() {
    return {
      ctx: '',
      starttime: '',
      resources: '', //笔迹数据集合
      resources_now: '', //当前解析的笔迹
      style: {
        box: "",
        canvas: ""
      },
      wid: "", //最后一个请求的writeid
    };
  },
  watch: {
    info() {
      if (this.info&&this.bindernote) {
        this.starttime = window.JSON.parse(this.info[0].writedata).StartTime;
        this.draw();
      }
    },
    writting() {
      //如果writting开始 执行过去笔迹函数
      if (this.writting) {}

    },
  },
  computed: {
    writting() {
      return this.$store.state.writting;
    },
  },
  methods: {
    draw() {
      var starttime = this.starttime;
      var resources = this.info;
      var ctx = this.ctx;
      var that = this;

      function draw(opt) {
        var points = opt.Points,
          time = that.notimeout ? 0 : (opt.StartTime - starttime) / 10000;
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
   if (this.info) {
        this.starttime = window.JSON.parse(this.info[0].writedata).StartTime;
        this.draw();
      }
  }

};

</script>
<style scoped>
.can_box {
  position: relative;
  margin-left: -350px;
  left: 50%;
  overflow: hidden;
}

</style>

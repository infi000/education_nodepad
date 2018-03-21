<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;height: 100%;position: relative;" ref='loadingbox'>
    <div ref="canvas_box" :style=style.box class="can_box">
      <canvas ref="canvas" width="1920" height="1080" :style=style.canvas></canvas>
    </div>
  </div>
</template>
<script>
/*jshint esversion: 6 */
export default {
  //info:笔记信息, loadding:,div_width:外部容器宽度,notimeout:布尔，是否显示笔迹轨迹
  props: ['id'],
  data() {
    return {
      ctx: '',
      starttime: '',
      resources: '', //笔迹数据集合
      resources_now: '', //当前解析的笔迹
      coordinate: {}, //坐标信息
      style: {
        box: "",
        canvas: ""
      },
      info: "",
      loading: true,
      wid: "", //最后一个请求的writeid
    };
  },
  watch: {
    info() {
      if (this.info) {
        this.loading = false;
        this.starttime = window.JSON.parse(this.info[0].writedata).StartTime;
        this.draw();
      }
    },
    writting() {
      //如果writting开始 执行过去笔迹函数
      if (this.writting) {

      }

    },
  },
  computed: {
    writting() {
      return this.$store.state.writting;
    }
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
    getNoteInfo(wid) {


      var that = this;
      var id = this.id || '';
      var wid = wid || '';
      console.log("id:", this.id)
      console.log("wid:", wid)
      if (!id) {
        setTimeout(() => {
          that.getNoteInfo(wid);
        }, 2000);
        return;
      }
      var opt = {
        id: id,
        wid: wid,
        nojudge: true,
        sucf: function(d) {
          //获取笔迹信息回调
          //1，处理笔迹CANVAS
          //2，继续获取剩余笔迹
          //2.1 d.length==0; 间隔2000ms重发 ,
          //2.2 d.length>0; writeid取数组最后一位的writeid字段的值
          var t = 10;
          if (d.length > 0) {
            that.info = d;
            var lwid = d[d.length - 1]["writeid"];
            that.wid = lwid;
          } else {
            t = 2000;
          }
          setTimeout(() => {
            that.getNoteInfo(that.wid);
          }, t);

        }
      };
      this.$store.commit('getNote', opt);
    },
    changeStyle() {
      if (this.resources_now) {
        var writedata = this.resources_now;
        var minx = this.coordinate.minx || writedata.PointsRect.X;
        var miny = this.coordinate.miny || writedata.PointsRect.Y;
        var maxx = this.coordinate.maxx || writedata.PointsRect.X + writedata.PointsRect.Width;
        var maxy = this.coordinate.maxy || writedata.PointsRect.Y + writedata.PointsRect.Height;
        var loadingbox_w = this.$refs.loadingbox.offsetWidth;
        var loadingbox_h = this.$refs.loadingbox.offsetHeight;
        minx = (minx < writedata.PointsRect.X) ? minx : writedata.PointsRect.X;
        miny = (miny < writedata.PointsRect.Y) ? miny : writedata.PointsRect.Y;
        maxx = (maxx > writedata.PointsRect.X + writedata.PointsRect.Width) ? maxx : writedata.PointsRect.X + writedata.PointsRect.Width;
        maxy = (maxy > writedata.PointsRect.Y + writedata.PointsRect.Height) ? maxy : writedata.PointsRect.Y + writedata.PointsRect.Height;
        var x = minx;
        var y = miny;
        var w = maxx - minx;
        var h = maxy - miny;
        var margin_left = "",
          margin_top = "",
          left = "",
          top = "";
        var zoom = (loadingbox_w / w > loadingbox_h / h) ? loadingbox_h / h : loadingbox_w / w;
        zoom = (zoom > 2) ? 2 : zoom;
        margin_left = -w / 2;
        left = '50%';
        margin_top = -h / 2;
        top = '50%';


        var box = {
          background: '#fff',
          zoom: zoom,
          width: w + "px",
          height: h + "px",
          'margin-left': margin_left + 'px',
          'margin-top': margin_top + 'px',
          top: top,
          left: left,
        };
        var canvas = {
          position: 'absolute',
          top: -y + "px",
          left: -x + "px",
        };
        this.coordinate = {
          minx: minx,
          maxx: maxx,
          miny: miny,
          maxy: maxy
        }
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
    this.getNoteInfo();
  },
  destroyed() {
    this.getNoteInfo = function() {};
  }
};

</script>
<style scoped>
.can_box {
  position: absolute;
}

</style>

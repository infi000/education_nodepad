<template>
  <div  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;height: 100%;position: relative;">
  <div ref="canvas_box" :style=box_style class="can_box">
    <canvas ref="canvas" width="1920" height="1080" :style=can_style></canvas>
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
      resources: '',
      loading: true
    };
  },
  watch: {
    info() {
      this.starttime = this.info.content[0].listStrokes[0].StartTime;
      this.resources = this.info.content;
      this.draw();
    }
  },
  computed: {
    box_style() {
      if (this.info) {
        var zoom = this.div_width ? (this.div_width / this.info.rect.Width) : 1;
        return {
          width: this.info.rect.Width + 'px',
          height: this.info.rect.Height + 'px',
          'margin-left': -(this.info.rect.Width) / 2 + 'px',
            background: '#fff',
          zoom: zoom
        };
      }
    },
    can_style() {
      if (this.info) {
        return {
          position: 'absolute',
          top: -this.info.rect.Y + 'px',
          left: -this.info.rect.X + 'px'
        };
      }
    }
  },
  methods: {
    draw() {
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
    getNoteInfo(id) {
      var that = this;
      var opt = {
        id: id,
        sucf: function(d) {
          that.info = JSON.parse(d);
          that.loading = false;
        }
      };
      this.$store.commit('getNote', opt);
    },
  },
  components: {

  },
  created() {

  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d');
    this.getNoteInfo(this.id);
  }

};

</script>
<style scopted>
.can_box {
  position: absolute;
  width: 700px;
  height: 500px;
  margin-left: -350px;
  left: 50%;

  overflow: hidden;
}

</style>

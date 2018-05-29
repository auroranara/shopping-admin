<template>
  <div class="dashboard-container">
    <el-card>
      <div id="myChart" :style="{width: '300px', height: '350px'}"></div>
    </el-card>
  </div>
</template>

<script>
import { fetchDashboardData } from '@/api/setting'
import { mapGetters } from 'vuex'
import echarts from 'echarts'
export default {
  name: 'dashboard',
  data() {
    return {
      goodsData: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'roles'])
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getGoodsData()
      await this.initGoodsCharts()
    },
    async getGoodsData() {
      const res = await fetchDashboardData()
      if (res.status && res.status === '0') {
        this.goodsData = res.data.goods
      }
    },
    initGoodsCharts() {
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      const options = {
        title: {
          text: '商品统计图',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['玩具', '喂养', '医疗', '日用品']
        },
        series: [
          {
            name: '商品数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '65%'],
            data: this.goodsData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(options)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

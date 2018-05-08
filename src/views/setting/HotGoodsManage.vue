<template>
  <div class="hot-manage">
    <el-card class="card-container">
      <div slot="header" class="clearfix">
        <span>热卖商品</span>
      </div>
      <el-row>
        <el-col :span="4" v-for="item in hotList" :key="item.id">
          <el-card :body-style="{ padding: '0px' }">
            <img src="item.productImg" class="image">
            <div style="padding: 14px;">
              <div class="clearfix">

              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { fetchSettings } from '@/api/setting'
export default {
  data() {
    return {
      hotList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getHotList()
    },
    async getHotList() {
      const res = await fetchSettings({ type: 'hot' })
      if (res.status && res.status === '0') {
        this.hotList = res.list.map(item => {
          /* return {

          } */
        })
      }
    }
  }
}
</script>

<style lang="scss">
.hot-manage {
  padding: 20px;
  .card-container {
    border-radius: 9px;
    .image {
      width: 100%;
      display: block;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: '';
    }

    .clearfix:after {
      clear: both;
    }
  }
}
</style>

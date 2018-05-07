<template>
  <div class="order-manage">
    <el-row>
      <el-date-picker value-format="timestamp" v-model="listQuery.dateRange" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" @click="handleFilter">搜索</el-button>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col style="border:1px solid #dfe6ec;padding:14px;color:#1f2d3d;">
        <el-row>
          <el-col :span="8">总收入：{{result.income}}</el-col>
          <el-col :span="8">总成本：{{result.cost}}</el-col>
          <el-col :span="8">总利润：{{result.profit}}</el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-card class="card-container">
      <el-table v-loading="tableLoading" element-loading-text="拼命加载中" :data="orderList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="收货人">
                <span>{{ scope.row.name }}</span>
              </el-form-item>
              <el-form-item label="收货人手机号">
                <span>{{ scope.row.phone }}</span>
              </el-form-item>
              <el-form-item label="收货地址">
                <span>{{ scope.row.address }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleViewProducts(scope.row.orderId)">{{scope.row.orderId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="订单日期" align="center">
          <template slot-scope="scope">
            {{scope.row.createDate|timeFilter}}
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="payment" align="center">
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="handleTagType(scope.row.state)">{{scope.row.state|stateFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleViewProducts(scope.row.orderId)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="商品清单" :visible.sync="dialogVisible" :before-close="handleClose" width="700px">
      <el-table :data="productsList" style="height:400px;">
        <el-table-column align="center" label="商品名称" prop="productName"></el-table-column>
        <el-table-column align="center" label="商品数量" prop="productNum"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const stateList = [
  { id: '0', value: '未支付' },
  { id: '1', value: '已支付' },
  { id: '2', value: '已失效' }
]
const tagTypes = [
  { id: '0', value: 'danger' },
  { id: '1', value: '' },
  { id: '2', value: 'info' }
]
import { adminFetchOrders, fetchOrderProducts } from '@/api/bill/order'
import { parseTime } from '@/utils/index'
export default {
  name: 'orderList',
  data() {
    return {
      result: { income: 123, cost: 12, profit: 12 },
      productsList: [],
      dialogVisible: false,
      tableLoading: false,
      orderList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        dateRange: [],
        startTime: null,
        endTime: null
      }
    }
  },
  created() {
    this.init()
  },
  filters: {
    timeFilter(time) {
      return parseTime(time, '{y}-{m}-{d}')
    },
    stateFilter(state) {
      const temp = stateList.find(item => item.id === state)
      return temp ? temp.value : ''
    }
  },
  methods: {
    async init() {
      await this.getOrderList()
    },
    async getOrderList() {
      const res = await adminFetchOrders(this.listQuery)
      if (res.status && res.status === '0') {
        this.orderList = res.list.rows
      }
    },
    async handleViewProducts(orderId) {
      const res = await fetchOrderProducts({ orderId: orderId })
      if (res.status && res.status === '0') {
        this.productsList = res.list
        this.dialogVisible = true
      }
    },
    handleFilter() {
      if (this.listQuery.dateRange.length) {
        const [start, end] = this.listQuery.dateRange
        this.listQuery.startTime = start / 1000
        this.listQuery.endTime = end / 1000
      }
      this.getOrderList()
    },
    handleTagType(state) {
      const result = tagTypes.find(item => item.id === state)
      return result ? result.value : ''
    },
    handleClose() {
      this.dialogVisible = false
      this.productsList = []
    }
  }
}
</script>
<style lang="scss">
.order-manage {
  padding: 20px;
  .card-container {
    margin-top: 20px;
    border-radius: 9px;
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 120px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
}
</style>

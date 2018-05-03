<template>
  <div class="goods-manage">
    <el-row>
      <el-button @click="handleCreate" type="primary">添加</el-button>
      <el-input style="width:200px;" placeholder="名称" v-model="listQuery.productName"></el-input>
      <el-select v-model="listQuery.type" placeholder="请选择">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="getGoodsList" type="primary" plain icon="el-icon-search">搜索</el-button>
      <el-button @click="getGoodsList" type="primary" plain icon="el-icon-search"></el-button>
    </el-row>
    <el-table class="mt20" :data="goodsList" style="width: 100%" border>
      <el-table-column prop="productName" label="商品名称" width="300" align="center">
      </el-table-column>
      <el-table-column prop="productPrice" label="价格(元)" width="150" align="center">
      </el-table-column>
      <el-table-column prop="totalNum" label="库存" width="180" align="center">
      </el-table-column>
      <el-table-column label="种类" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.type}}
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="备注" width="250" align="center">
      </el-table-column>
      <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit">编辑</el-button>
          <el-button type="text" @click="handleDelete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[1, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { adminFetchGoods } from '@/api/goods'
export default {
  name: 'GoodsManage',
  data() {
    return {
      typeOptions: [
        { id: 'toy', value: '玩具' },
        { id: 'food', value: '食物' },
        { id: 'food', value: '喂养' },
        { id: 'medicine', value: '医疗' },
        { id: 'dailyuse', value: '生活用品' }
      ],
      goodsList: [],
      total: 0,
      listQuery: { pageNum: 1, pageSize: 1, productName: null, type: null }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getGoodsList()
    },
    async getGoodsList() {
      const res = await adminFetchGoods(this.listQuery)
      if (res.data.status && res.data.status === '0') {
        this.goodsList = res.data.list.rows
      }
    },
    handleCreate() {},
    handleEdit() {},
    handleDelete() {},
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getGoodsList()
    }
  }
}
</script>

<style lang="scss">
.goods-manage {
  padding: 20px;
  .mt20 {
    margin-top: 20px;
  }
}
</style>

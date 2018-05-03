<template>
  <div class="goods-manage">
    <el-row>
      <el-button @click="handleCreate" type="primary">添加</el-button>
      <el-input placeholder="名称" v-model="listQuery.productName"></el-input>
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
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[1, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'GoodsManage',
  data() {
    return {
      goodsList: [{ productName: '11', productPrice: '22', totalNum: 12 }],
      total: 0,
      listQuery: { pageNum: 1, pageSize: 1 }
    }
  },
  created() {},
  methods: {
    handleCreate() {},
    handleEdit() {},
    handleDelete() {},
    handleSizeChange(val) {
      this.listQuery.pageSize = val
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
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

<template>
  <div class="hot-manage">
    <el-card class="card-container">
      <el-row>
        <el-button @click="handleCreate" type="primary">添加</el-button>
      </el-row>
      <el-table class="mt20" :data="hotList" v-loading="tableLoading" element-loading-text="拼命加载中" border>
        <el-table-column label="商品名称" align="center" prop="productName"></el-table-column>
        <el-table-column label="库存" align="center" prop="totalNum"></el-table-column>
        <el-table-column label="商品价格" align="center" prop="totalNum"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="模块管理" :visible.sync="dialogVisible" :before-close="handleClose">
        <el-input v-show="goodsTableVis" style="width:400px;" placeholder="名称" v-model="listQuery.productName"></el-input>
        <el-button v-show="goodsTableVis" @click="getGoodsList" type="primary" plain icon="el-icon-search">搜索</el-button>
        <el-table v-show="goodsTableVis" :data="goodsList" v-loading="goodsTableLoading">
          <el-table-column label="商品名称" align="center" prop="productName"></el-table-column>
          <el-table-column label="库存" align="center" prop="totalNum"></el-table-column>
          <el-table-column label="商品价格" align="center" prop="totalNum"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleSelect(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form style="margin-left:60px;" v-show="!goodsTableVis" :model="form" label-position="left" label-width="120px">
          <el-form-item label="商品ID：">{{form.productId}}</el-form-item>
          <el-form-item label="商品名称：">{{form.productName}}</el-form-item>
          <el-form-item label="库存：">{{form.totalNum}}</el-form-item>
          <el-form-item label="价格：">{{form.productPrice}}</el-form-item>
        </el-form>
        <el-pagination v-show="goodsTableVis" class="mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-size="listQuery.pageSize" layout="total, prev, pager, next" :total="total">
        </el-pagination>
        <div slot="footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button :disabled="!form.productId" type="primary" @click="doCreateSetting">添加</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  fetchSettings,
  deleteSetting,
  createSetting,
  checkSettingId
} from '@/api/setting'
import { adminFetchGoods } from '@/api/goods'
export default {
  data() {
    return {
      form: {},
      total: 0,
      goodsTableVis: true,
      tableLoading: false,
      goodsTableLoading: false,
      hotList: [],
      goodsList: [],
      dialogVisible: false,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        productName: null
      }
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
      this.tableLoading = true
      const res = await fetchSettings({ type: 'hot' })
      if (res.status && res.status === '0') {
        this.hotList = res.list
        this.tableLoading = false
      }
    },
    async getGoodsList() {
      this.goodsTableLoading = true
      const res = await adminFetchGoods(this.listQuery)
      if (res.status && res.status === '0') {
        this.goodsList = res.list.rows
        this.total = res.list.count
        this.goodsTableLoading = false
      }
    },
    handleCreate() {
      this.goodsTableVis = true
      this.getGoodsList()
      this.resetListQuery()
      this.form = {}
      this.dialogVisible = true
    },
    handleDelete(id) {
      this.$confirm('确认下架该商品吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteSetting({ id: id })
          if (res.status && res.status === '0') {
            this.getHotList()
          }
          this.$message({
            type: res.status === '0' ? 'success' : 'error',
            message: res.msg
          })
        })
        .catch(() => {})
    },
    async doCreateSetting() {
      const res = await createSetting({ productId: this.form.productId })
      if (res.status && res.status === '0') {
        this.getHotList()
        this.dialogVisible = false
      }
      this.$message({
        type: res.status === '0' ? 'success' : 'error',
        message: res.msg
      })
    },
    async handleSelect(row) {
      const res = await checkSettingId({ productId: row.productId })
      if (res.status && res.status === '0') {
        this.goodsTableVis = false
        this.form = { ...row }
      } else {
        this.$message({
          type: 'error',
          message: '该商品已选择！'
        })
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getGoodsList()
    },
    resetListQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 6,
        productName: null
      }
    }
  }
}
</script>

<style lang="scss">
.hot-manage {
  padding: 20px;
  .mt20 {
    margin-top: 20px;
  }
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

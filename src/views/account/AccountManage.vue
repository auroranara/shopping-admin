<template>
  <div class="account-manage">
    <el-row>
      <el-button @click="handleCreate" type="primary">添加</el-button>
      <el-input style="width:200px;" placeholder="账号" v-model="listQuery.account"></el-input>
      <el-input style="width:200px;" placeholder="用户名" v-model="listQuery.name"></el-input>
      <el-button @click="getAccountList" type="primary" plain icon="el-icon-search">搜索</el-button>
      <el-button @click="ResetListQuery" type="primary" plain>重置</el-button>
    </el-row>
    <el-table v-loading="tableLoading" element-loading-text="拼命加载中" class="mt20" :data="accountList" style="width: 100%" border>
      <el-table-column prop="account" label="账号" width="500" align="center">
      </el-table-column>
      <el-table-column prop="name" label="用户名" width="300" align="center">
      </el-table-column>
      <el-table-column prop="role" label="权限" width="300" align="center">
      </el-table-column>
      <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleChangePwd">修改密码</el-button>
          <el-button type="text" @click="handleDelete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { fetchAccounts } from '@/api/account'
export default {
  data() {
    return {
      total: 0,
      accountList: [],
      tableLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        account: null,
        name: null
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getAccountList()
    },
    async getAccountList() {
      this.tableLoading = true
      const res = await fetchAccounts(this.listQuery)
      if (res.status && res.status === '0') {
        this.accountList = res.list.rows
        this.total = res.list.count
        this.tableLoading = false
      }
    },
    handleCreate() {},
    handleChangePwd() {},
    handleDelete() {},
    ResetListQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        account: null,
        name: null
      }
      this.getAccountList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getAccountList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getAccountList()
    }
  }
}
</script>

<style lang="scss">
.account-manage {
  padding: 20px;
  .mt20 {
    margin-top: 20px;
  }
}
</style>

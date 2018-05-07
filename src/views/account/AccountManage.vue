<template>
  <div class="account-manage">
    <el-card class="card-container">
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
        <el-table-column label="权限" width="300" align="center">
          <template slot-scope="scope">
            {{scope.row.role|roleFilter}}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleChangePwd(scope.row.id)">修改密码</el-button>
            <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="商品管理" :visible.sync="dialogVisible" :before-close="handleClose" width="700px">
      <el-form style="margin-left:50px;" ref="tempForm" :model="form" label-position="left" label-width="120px" :rules="rules">
        <el-form-item label="账号：" prop="account">
          <el-input style="width:400px;" v-model.trim="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" style="width:400px;" v-model.trim="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="rePass">
          <el-input type="password" style="width:400px;" v-model.trim="form.rePass"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="name">
          <el-input style="width:400px;" v-model.trim="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="doCreateAccounts">添加</el-button>
      </div>
    </el-dialog>
    <el-dialog title="商品管理" :visible.sync="dialogChangeVisible" :before-close="handleCloseChange" width="700px">
      <el-form style="margin-left:50px;" ref="changeForm" :model="changeForm" label-position="left" label-width="120px" :rules="changeRules">
        <el-form-item label="密码：" prop="password">
          <el-input type="password" style="width:400px;" v-model.trim="changeForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="rePass">
          <el-input type="password" style="width:400px;" v-model.trim="changeForm.rePass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCloseChange">取消</el-button>
        <el-button type="primary" @click="doChangePwd">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const roles = [
  { id: 'admin', value: '管理员' },
  { id: 'superAdmin', value: '超级管理员' },
  { id: 'user', value: '用户' }
]
import {
  fetchAccounts,
  deleteAccount,
  checkAccount,
  createAccount,
  superChangePassword
} from '@/api/account'
export default {
  data() {
    var validateAccount = async (rule, value, callback) => {
      if (value) {
        const res = await checkAccount({ account: this.form.account })
        if (res.status === '0') {
          callback()
        } else callback(new Error('此账号已经存在'))
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次密码不一致!'))
      } else {
        callback()
      }
    }
    var validateChangePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changeForm.password) {
        callback(new Error('两次密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogChangeVisible: false,
      dialogVisible: false,
      total: 0,
      accountList: [],
      tableLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        account: null,
        name: null,
        role: 'admin'
      },
      changeForm: {
        id: null,
        password: null,
        rePass: null
      },
      form: {
        account: null,
        password: null,
        rePass: null,
        name: null
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          },
          { validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 之间', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9_@.*]*$/,
            message: '请输入有效字符',
            trigger: 'blur'
          }
        ],
        rePass: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      changeRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 之间', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9_@.*]*$/,
            message: '请输入有效字符',
            trigger: 'blur'
          }
        ],
        rePass: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateChangePass, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  filters: {
    roleFilter(role) {
      const result = roles.find(item => item.id === role)
      return result ? result.value : ''
    }
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
    handleCreate() {
      this.dialogVisible = true
    },
    handleChangePwd(id) {
      this.changeForm.id = id
      this.dialogChangeVisible = true
    },
    handleDelete(id) {
      this.$confirm('确认删除该账户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteAccount({ id: id })
          if (res.status && res.status === '0') {
            this.getAccountList()
          }
          this.$message({
            type: res.status === '0' ? 'success' : 'error',
            message: res.msg
          })
        })
        .catch(() => {})
    },
    doCreateAccounts() {
      this.$refs.tempForm.validate(async valid => {
        if (valid) {
          const res = await createAccount(this.form)
          if (res.status && res.status === '0') {
            this.getAccountList()
            this.handleClose()
          }
          this.$message({
            type: res.status === '0' ? 'success' : 'error',
            message: res.msg
          })
        }
      })
    },
    doChangePwd() {
      this.$refs.changeForm.validate(async valid => {
        if (valid) {
          const res = await superChangePassword(this.changeForm)
          if (res.status && res.status === '0') {
            this.handleCloseChange()
          }
          this.$message({
            type: res.status === '0' ? 'success' : 'error',
            message: res.msg
          })
        }
      })
    },
    ResetListQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        account: null,
        name: null,
        role: 'admin'
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
    },
    handleClose() {
      this.$refs.tempForm.resetFields()
      this.dialogVisible = false
      this.resetForm()
    },
    handleCloseChange() {
      this.$refs.changeForm.resetFields()
      this.dialogChangeVisible = false
      this.resetChangeForm()
    },
    resetForm() {
      this.form = {
        account: null,
        password: null,
        rePass: null,
        name: null
      }
    },
    resetChangeForm() {
      this.changeForm = {
        id: null,
        password: null,
        rePass: null
      }
    }
  }
}
</script>

<style lang="scss">
.account-manage {
  padding: 20px;
  .card-container {
    border-radius: 9px;
  }
  .mt20 {
    margin-top: 20px;
  }
}
</style>

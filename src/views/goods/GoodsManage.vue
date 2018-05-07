<template>
  <div class="goods-manage">
    <el-card class="card-container">
      <el-row>
        <el-button @click="handleCreate" type="primary">添加</el-button>
        <el-input style="width:200px;" placeholder="名称" v-model="listQuery.productName"></el-input>
        <el-select v-model="listQuery.type" placeholder="请选择">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="getGoodsList" type="primary" plain icon="el-icon-search">搜索</el-button>
        <el-button @click="ResetListQuery" type="primary" plain>重置筛选</el-button>
        <el-switch style="margin-left:20px;" v-model="listQuery.state" @change="handleStateFilter" active-text="已上架" inactive-text="已下架">
        </el-switch>
      </el-row>
      <el-table v-loading="tableLoading" element-loading-text="拼命加载中" class="mt20" :data="goodsList" style="width: 100%" border>
        <el-table-column prop="productName" label="商品名称" width="300" align="center">
        </el-table-column>
        <el-table-column prop="productPrice" label="价格(元)" width="150" align="center">
        </el-table-column>
        <el-table-column prop="totalNum" label="库存" width="180" align="center">
        </el-table-column>
        <el-table-column label="种类" width="180" align="center">
          <template slot-scope="scope">
            {{scope.row.type|typeFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="备注" width="250" align="center">
        </el-table-column>
        <el-table-column label="状态" width="180" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state===1?'success':'info'">{{scope.row.state|stateFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.state" type="text" @click="handleDown(scope.row.productId)">下架</el-button>
            <el-button v-else type="text" @click="handleUp(scope.row.productId)">上架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="商品管理" :visible.sync="dialogVisible" :before-close="handleClose" width="700px">
      <el-form style="margin-left:50px;" ref="tempForm" :model="form" label-position="left" label-width="120px" :rules="rules">
        <el-form-item label="商品名称：" prop="productName">
          <el-input style="width:400px;" v-model.trim="form.productName"></el-input>
        </el-form-item>
        <el-form-item label="商品分类：" prop="type">
          <el-select style="width:400px;" v-model="form.type" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格：" prop="productPrice">
          <el-input style="width:400px;" v-model.number="form.productPrice"></el-input>
        </el-form-item>
        <el-form-item label="库存：" prop="totalNum">
          <el-input-number style="width:400px;" v-model.number="form.totalNum" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input style="width:400px;" type="textarea" v-model.trim="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="展示图片：" prop="imagesList">
          <el-upload style="width:400px;" class="upload-demo" action="/nodeapi/goods/uploadGoodsImg" name="goodsImg" :headers="headers" :on-success="handleUploadSuccess" :on-remove="handleRemove" :before-upload="beforeImgUpload" :file-list="this.form.imagesList" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="form.productId" type="primary" @click="doUpdateGoods">更新</el-button>
        <el-button v-else type="primary" @click="doCreateGoods">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const typeOptions = [
  { value: 'toy', label: '玩具' },
  { value: 'food', label: '喂养' },
  { value: 'medicine', label: '医疗' },
  { value: 'dailyuse', label: '生活用品' }
]
import {
  adminFetchGoods,
  checkGoodsName,
  createGoods,
  updateGoods,
  changeGoodsState
} from '@/api/goods'
import { mapState } from 'vuex'
export default {
  name: 'GoodsManage',
  data() {
    var validateName = async (rule, value, callback) => {
      if (value) {
        if (this.isCreate) {
          const res = await checkGoodsName({ productName: value })
          if (res.status && res.status === '0') {
            callback()
          } else callback(new Error('该商品名称已存在'))
        } else {
          if (this.oldItem.productName !== value) {
            const res = await checkGoodsName({ productName: value })
            if (res.status && res.status === '0') {
              callback()
            } else callback(new Error('该商品名称已存在'))
          } else callback()
        }
      } else callback(new Error('请输入商品名称'))
    }
    return {
      olfItem: {},
      tableLoading: false,
      isCreate: true,
      dialogVisible: false,
      goodsList: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        type: null,
        state: true
      },
      typeOptions: [
        { value: 'toy', label: '玩具' },
        { value: 'food', label: '喂养' },
        { value: 'medicine', label: '医疗' },
        { value: 'dailyuse', label: '生活用品' }
      ],
      form: {
        productName: null,
        productPrice: null,
        productImg: null,
        showImgs: null,
        imagesList: [],
        desc: null,
        totalNum: null,
        type: null
      },
      rules: {
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        productPrice: [
          {
            type: 'number',
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        type: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        totalNum: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        imagesList: [
          {
            type: 'array',
            required: true,
            message: '请上传展示图片',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token
    }),
    headers() {
      const token = this.token
      const item = {}
      item.Authorization = 'Bearer ' + token
      return item
    }
  },
  filters: {
    typeFilter(value) {
      const result = typeOptions.find(item => item.value === value)
      return result ? result.label : ''
    },
    stateFilter(state) {
      const states = [{ id: 1, value: '已上架' }, { id: 0, value: '已下架' }]
      const result = states.find(item => item.id === state)
      return result ? result.value : ''
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
      this.tableLoading = true
      const res = await adminFetchGoods(this.listQuery)
      if (res.status && res.status === '0') {
        this.goodsList = res.list.rows
        this.total = res.list.count
        this.tableLoading = false
      }
    },
    ResetListQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        type: null,
        state: false
      }
      this.getGoodsList()
    },
    handleUploadSuccess(res, file) {
      if (res.status && res.status === '0') {
        this.form.imagesList.push({ name: res.fileName, url: res.url })
      }
    },
    handleRemove(file, fileList) {
      this.form.imagesList = fileList
    },
    beforeImgUpload(file) {
      const isPic = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPic) {
        this.$message.error('只能上传图片！')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      return isLt2M && isPic
    },
    handleCreate() {
      this.isCreate = true
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.oldItem = { ...row }
      this.form = { ...row }
      this.form.imagesList = this.form.showImgs.split(',').map(item => {
        const temp = item.split('/')
        return {
          name: temp[temp.length - 1],
          url: item
        }
      })
      this.isCreate = false
      this.dialogVisible = true
    },
    handleDown(productId) {
      this.$confirm('确认下架该商品吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await changeGoodsState({ productId: productId })
          if (res.status && res.status === '0') {
            this.getGoodsList()
          }
          this.$message({
            type: res.status === '0' ? 'success' : 'error',
            message: res.msg
          })
        })
        .catch(() => {})
    },
    handleUp(productId) {
      this.$confirm('确认上架该商品吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await changeGoodsState({ productId: productId })
          if (res.status && res.status === '0') {
            this.getGoodsList()
          }
          this.$message({
            type: res.status === '0' ? 'success' : 'error',
            message: res.msg
          })
        })
        .catch(() => {})
    },
    doUpdateGoods() {
      this.$refs.tempForm.validate(async valid => {
        if (valid) {
          this.form.productImg = this.form.imagesList[0].url
          const arr = []
          this.form.imagesList.forEach(item => {
            arr.push(item.url)
          })
          this.form.showImgs = arr.join(',')
          const res = await updateGoods(this.form)
          if (res.status && res.status === '0') {
            this.dialogVisible = false
            this.getGoodsList()
            this.resetForm()
          }
          this.$message({
            type: res.status === '0' ? 'success' : 'error',
            message: res.msg
          })
        }
      })
    },
    doCreateGoods() {
      this.$refs.tempForm.validate(async valid => {
        if (valid) {
          this.form.productImg = this.form.imagesList[0].url
          const arr = []
          this.form.imagesList.forEach(item => {
            arr.push(item.url)
          })
          this.form.showImgs = arr.join(',')
          const res = await createGoods(this.form)
          if (res.status && res.status === '0') {
            this.dialogVisible = false
            this.getGoodsList()
            this.resetForm()
          }
          this.$message({
            type: res.status === '0' ? 'success' : 'error',
            message: res.msg
          })
        }
      })
    },
    handleStateFilter() {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      this.getGoodsList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getGoodsList()
    },
    handleClose() {
      this.$refs.tempForm.resetFields()
      this.dialogVisible = false
      this.resetForm()
    },
    resetForm() {
      this.form = {
        productName: null,
        productPrice: null,
        productImg: null,
        showImgs: null,
        imagesList: [],
        desc: null,
        totalNum: null,
        type: null
      }
    }
  }
}
</script>

<style lang="scss">
.goods-manage {
  padding: 20px;
  .card-container {
    border-radius: 9px;
  }
  .mt20 {
    margin-top: 20px;
  }
}
</style>

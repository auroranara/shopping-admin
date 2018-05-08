<template>
  <div class="carousel-manage">
    <el-card class="card-container">
      <el-upload style="width:500px;" action="/nodeapi/setting/uploadCarouselImg" name="carouselImg" :headers="headers" :on-success="handleUploadSuccess" :on-remove="handleRemove" :before-upload="beforeImgUpload" :file-list="carousels" list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchSettings, removeCarouselImg } from '@/api/setting'
export default {
  data() {
    return {
      carousels: []
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
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getCarousels()
    },
    async getCarousels() {
      const res = await fetchSettings({ type: 'carousel' })
      if (res.status && res.status === '0') {
        this.carousels = res.list.map(item => {
          const temp = item.carousel.split('/')
          return {
            name: temp[temp.length - 1],
            url: item.carousel,
            id: item.id
          }
        })
      }
    },
    handleRemove(file, fileList) {
      this.$confirm('确认删除改轮播图吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await removeCarouselImg({
            id: file.id,
            carousel: file.url
          })
          if (res.status && res.status === '0') {
            this.getCarousels()
          }
          this.$message({
            type: res.status === '0' ? 'success' : 'error',
            message: res.msg
          })
        })
        .catch(() => {})
    },
    handleUploadSuccess(res, file) {
      if (res.status && res.status === '0') {
        this.carousels.push({ name: res.fileName, url: res.url, id: res.id })
      }
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
    }
  }
}
</script>

<style lang="scss">
.carousel-manage {
  padding: 20px;
  .card-container {
    border-radius: 9px;
  }
}
</style>

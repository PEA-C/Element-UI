<template>
  <div class="article-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>面经后台</el-breadcrumb-item>
      <el-breadcrumb-item>面经管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" border="false">
      <template #header>
        <div class="header">
          <span>共 {{ total }} 条记录</span>
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            round
            @click="openDrawer('add')"
          >
            添加面经
          </el-button>
        </div>
      </template>

      <el-table stripe :data="list" style="width: 100%">
        <el-table-column prop="stem" label="标题" width="400">
        </el-table-column>
        <el-table-column prop="creator" label="作者"> </el-table-column>
        <el-table-column prop="likeCount" label="点赞"> </el-table-column>
        <el-table-column prop="views" label="浏览数"> </el-table-column>
        <el-table-column prop="createdAt" label="更新时间" width="200">
        </el-table-column>

        <el-table-column label="操作" width="120px">
          <template #default="{ row }">
            <div class="actions">
              <i
                class="el-icon-view"
                @click="openDrawer('preview', row.id)"
              ></i>
              <i
                class="el-icon-edit-outline"
                @click="openDrawer('edit', row.id)"
              ></i>
              <i class="el-icon-delete" @click="del(row.id)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 15, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-drawer
      :visible.sync="isShowDrawer"
      size="45%"
      :title="drawerTitle"
      direction="rtl"
      :before-close="handleClose"
    >
      <div v-if="drawerType === 'preview'" class="article-preview">
        <h5>{{ form.stem }}</h5>
        <div v-html="form.content"></div>
      </div>

      <el-form
        v-else
        ref="form"
        label-width="80px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="标题" prop="stem">
          <el-input v-model="form.stem" placeholder="输入面经标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- 富文本编辑器 -->
          <quill-editor
            v-model="form.content"
            @blur="$refs.form.validateField('content')"
          ></quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  createArticle,
  getArticleDetail,
  getArticleList,
  removeArticle,
  updateArticle
} from '@/api/article'
export default {
  name: 'article-page',
  data () {
    return {
      current: 1,
      pageSize: 10,
      total: 0,
      list: [],
      isShowDrawer: false,
      drawerType: '',
      form: {
        stem: '',
        content: ''
      },
      tableData: [],
      rules: {
        stem: [{ required: true, message: '请输入面经标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入面经标题', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initData()
  },
  computed: {
    drawerTitle () {
      let title = ''
      if (this.drawerType === 'add') title = '添加面经'
      if (this.drawerType === 'preview') title = '面经预览'
      if (this.drawerType === 'edit') title = '修改面经'
      return title
    }
  },
  methods: {
    async initData () {
      const res = await getArticleList({
        current: this.current,
        pageSize: this.pageSize
      })

      this.list = res.data.rows
      this.total = res.data.total
      console.log(res)
    },
    handleCurrentChange (val) {
      this.current = val
      this.initData()
    },
    handleSizeChange (val) {
      console.log('每页几条数据', val)
      this.pageSize = val
      this.initData()
    },
    async openDrawer (type, id) {
      this.drawerType = type
      this.isShowDrawer = true
      // 添加/编辑/预览 => openDrawer，但是只有编辑和预览有id
      if (type !== 'add') {
        console.log(type, id)

        const res = await getArticleDetail(id)
        console.log(res.data)

        this.form = {
          ...res.data
        }
      }
    },
    handleClose () {
      this.form = {
        stem: '',
        content: ''
      }
      if (this.drawerType !== 'preview') {
        this.$refs.form.resetFields() // 重置表单
      }
      this.isShowDrawer = false
    },
    onSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            if (this.drawerType === 'add') {
              await createArticle(this.form)
              this.$message.success('添加成功')
            }
            if (this.drawerType === 'edit') {
              const { id, stem, content } = this.form
              await updateArticle({ id, stem, content })
              this.$message.success('修改成功')
            }
            this.handleClose()
            this.initData()
            this.current = 1
          } catch (e) {
            if (e.response) {
              this.$message.error(e.response.data.message)
            } else {
              if (this.drawerType === 'add') {
                this.$message.error('添加失败')
              }
              if (this.drawerType === 'edit') {
                this.$message.error('修改失败')
              }
            }
          }
        }
      })
    },
    async del (id) {
      try {
        await removeArticle(id)
        this.$message.success('删除成功')
        this.initData()
        if (this.pageSize.length === 1 && this.current > 1) {
          this.current--
        }
      } catch (e) {
        if (e.response) {
          this.$message.error(e.response.data.message)
        } else {
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 25px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
  }

  .actions {
    font-size: 18px;
    display: flex;
    justify-content: space-around;
    color: #666;

    > i:hover {
      color: rgba(114, 124, 245, 1);
      cursor: pointer;
    }
  }
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.el-breadcrumb {
  margin-top: 10px;
}

.el-form {
  padding-right: 40px;
}

.quill-editor {
  ::v-deep .ql-editor {
    height: 300px;
  }
}

.el-rate {
  padding: 10px 0;
}

.article-preview {
  padding: 0 40px 40px 40px;

  > h5 {
    font-size: 20px;
    color: #666;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 30px;
    margin: 0 0 20px 0;
  }
}
</style>

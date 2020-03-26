<template>
  <div class="s_source">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addHandle">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="type" header-align="center" align="center" label="资源类型"></el-table-column>
      <el-table-column prop="title" header-align="center" align="center" label="资源标题"></el-table-column>
      <el-table-column prop="description" header-align="center" align="center" label="资源描述"></el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="浏览量"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status === 0" type="text" size="small" @click="deleteHandle(scope.row)">上架</el-button>
          <el-button v-else type="text" size="small" @click="deleteHandle(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="query.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="query.pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Source',
  data() {},
  methods: {
    deleteHandle(row) {
      this.$api.source.del({sourceId: row.id, status: row.status === 0 ? 1 : 0}).then(resp => {
        if(resp){
          if(resp.code === 0){
            this.$message.success('操作成功')
          }else{
            this.$message.error(resp.msg)
          }
        }
      })
    }
  },
  addHandle() {
    this.$router.push({name: 'source-add'})
  }
}
</script>

<style lang="scss">

</style>

<template>
  <div class="s_source">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="query.title" size='small' style="width:200px;" clearable placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.tagId" placeholder="请选择标签类型" size="small" clearable>
          <el-option v-for="(item, index) in tagList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-form-item>
        <el-select v-model="query.typeId" placeholder="请选择资源类型" size="small" clearable>
          <el-option v-for="(item, index) in sourceTypes" :key="index" :label="item.description" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
        <el-button type="primary" @click="getData" size='small'>查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addHandle" size='small'>新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="type" header-align="center" align="center" label="资源类型" :formatter="sourceTypeFormat"></el-table-column>
      <el-table-column prop="title" header-align="center" align="center" label="资源标题"></el-table-column>
      <el-table-column prop="description" header-align="center" align="center" label="资源描述">
        <template slot-scope="scope">
          <span v-if="scope.row.description.length > 20">{{scope.row.description.substr(0, 20)}}</span>
          <span v-else>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="浏览量"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态" :formatter="statusFormat"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" :formatter="dateFormat"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateHandle(scope.row.id)">修改</el-button>
          <!-- <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button> -->
          <el-button v-if="scope.row.status === 0" type="text" size="small" @click="updateStatus(scope.row)">上架</el-button>
          <el-button v-else type="text" size="small" @click="updateStatus(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="query.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="query.pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import {formartDate} from './../../common/utils/DateUtil'
export default {
  name: "Source",
  data() {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      query: {
        pageSize: 10,
        pageIndex: 1,
        title: ''
      },
      sourceTypes: [],
      tagList: []
    };
  },
  created() {
    this.getSourceTypes()
    this.getTagList()
    this.getData();
  },
  methods: {
    getData() {
      this.$api.source.list(this.query).then(resp => {
        if (resp) {
          if (resp.code === 0) {
            this.dataList = resp.data.records;
            this.total = resp.data.total;
          } else {
            this.$message.error(resp.msg);
          }
        }
      });
    },
    async getTagList() {
      const resp = await this.$api.tag.list();
      if (resp) {
        if (resp.code === 0) {
          this.tagList = resp.data.list;
        } else {
          this.$message.error(resp.msg);
        }
      }
    },
    getSourceTypes() {
      this.$api.source.types().then(resp => {
        if (resp) {
          if (resp.code === 0) {
            this.sourceTypes = resp.data.list;
          } else {
            this.$message.error(resp.msg);
          }
        }
      });
    },
    sourceTypeFormat(row) {
      if (!row.typeId) {
        return ''
      }
      return this.sourceTypes.filter(e => e.id === row.typeId)[0].description
    },
    statusFormat(row) {
      return row.status === 0 ? '未上架' : '已上架'
    },
    dateFormat(row) {
      return formartDate(row.createTime)
    },
    updateStatus(row) {
      this.$api.source
        .updateStatus({ sourceId: row.id, status: row.status === 0 ? 1 : 0 })
        .then(resp => {
          if (resp) {
            if (resp.code === 0) {
              this.$message.success("操作成功");
              this.getData()
            } else {
              this.$message.error(resp.msg);
            }
          }
        });
    },
    updateHandle(sourceId) {
      this.$router.push({ path: "/source-add", query: { sourceId: sourceId } });
    },
    addHandle() {
      this.$router.push({ path: "/source-add" });
    },
    sizeChangeHandle(pageSize) {
      this.query.pageSize = pageSize
      this.getData()
    },
    currentChangeHandle(pageIndex) {
      this.query.pageIndex = pageIndex
      this.getData()
    }
  }
};
</script>

<style lang="scss">
</style>

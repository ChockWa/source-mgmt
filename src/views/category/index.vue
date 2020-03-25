<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addHandle">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="name" header-align="center" align="center" label="类别名称"></el-table-column>
      <el-table-column prop="contact" header-align="center" align="center" label="状态"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="query.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="query.pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination> -->

    <el-dialog title="分类" :visible.sync="dialogVisible" width="800px">
      <el-form label-position="right" label-width="120px" :model="categoryInfo">
        <el-form-item label="类别名称">
          <el-input v-model="categoryInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="logo">
          <el-upload
            class="avatar-uploader"
            action="a"
            :show-file-list="false"
            :on-change="submitUploadLogo1"
            :auto-upload="false"
          >
            <img v-if="categoryInfo.logo" :src="categoryInfo.logo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "./../../common/utils/http";

export default {
  name: "Category",
  data() {
    return {
      uploadUrl: this.$store.getters.getConfig.baseUrl + "/file/upload",
      localUploadUrl: "http://localhost:17989/file/uploadFile",
      baseUrl: this.$store.getters.getConfig.dns,
      dataList: [],
      categoryInfo: {},
      dialogVisible: false,
      dataListLoading: false,
      uploadConfig: {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    };
  },
  created() {
    this.getDataList();
  },
  computed: {},
  methods: {
    getDataList() {
      this.dataListLoading = true;
      this.$api.category.list().then(resp => {
        if (resp && resp.code === 0) {
          this.dataList = resp.data.list;
        } else {
          this.$message.error(resp.msg);
        }
        this.dataListLoading = false;
      });
    },
    addHandle() {
      this.categoryInfo = {}
      this.dialogVisible = true;
    },
    updateHandle(row) {
      this.categoryInfo = {}
      this.categoryInfo.id = row.id
      this.categoryInfo.name = row.name
      this.categoryInfo.logo = row.logo
      this.dialogVisible = true;
    },
    save() {
      if(this.categoryInfo.id){
        this.update()
      }else{
        this.add()
      }
    },
    update() {
      const _this = this;
      _this.$api.category.update(_this.categoryInfo).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("更新成功");
          this.dialogVisible = false;
          _this.getDataList();
        } else {
          _this.$message.error(resp.msg);
        }
      });
    },
    add() {
      const _this = this;
      _this.$api.category.add(_this.categoryInfo).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("新增成功");
          this.dialogVisible = false;
          _this.getDataList();
        } else {
          _this.$message.error(resp.msg);
        }
      });
    },
    deleteHandle(categoryId) {
      const _this = this;
      _this.$api.category.del({ categoryId: categoryId }).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("刪除成功");
          _this.getDataList();
        } else {
          _this.$message.error(resp.msg);
        }
      });
    },
    submitUploadLogo(file, fileList) {
      const _this = this;
      let param = new FormData();
      param.append("file", file.raw);
      axios.post(_this.uploadUrl, param, _this.uploadConfig).then(resp => {
        if (resp && resp.code === 0) {
          _this.categoryInfo.logo = resp.data.path;
          _this.$forceUpdate();
        }
      });
    },
    submitUploadLogo1(file, fileList) {
      const _this = this;
      let param = new FormData();
      param.append("file", file.raw);
      axios.post(_this.localUploadUrl, param, _this.uploadConfig).then(resp => {
        // if (resp && resp.code === 0) {
        //   _this.categoryInfo.logo = resp.data.path;
        //   _this.$forceUpdate();
        // }
        _this.categoryInfo.logo = resp.data.path;
        _this.$forceUpdate();
      });
    },
    // sizeChangeHandle(pageSize) {
    //   this.query.pageSize = pageSize;
    //   this.query.pageIndex = 1;
    //   this.getDataList();
    // },
    // currentChangeHandle(pageIndex) {
    //   this.query.pageIndex = pageIndex;
    //   this.getDataList();
    // }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>



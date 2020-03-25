<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addHandle">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="nameCn" header-align="center" align="center" label="品牌名称(CN)"></el-table-column>
      <el-table-column prop="description" header-align="center" align="center" label="品牌名称(EN)"></el-table-column>
      <el-table-column prop="contact" header-align="center" align="center" label="状态"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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

    <el-dialog title="品牌" :visible.sync="dialogVisible" width="800px">
      <el-form label-position="right" label-width="120px" :model="brandInfo">
        <el-form-item label="品牌名称(中文)">
          <el-input v-model="brandInfo.nameCn"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称(英文)">
          <el-input v-model="brandInfo.nameEn"></el-input>
        </el-form-item>
        <el-form-item label="logo">
          <el-upload
            class="avatar-uploader"
            action="a"
            :show-file-list="false"
            :on-change="submitUploadLogo1"
            :auto-upload="false"
          >
            <img v-if="brandInfo.logo" :src="brandInfo.logo" class="avatar" />
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
  name: "Brand",
  data() {
    return {
      uploadUrl: this.$store.getters.getConfig.baseUrl + "/file/upload",
      localUploadUrl: "http://localhost:17989/file/uploadFile",
      baseUrl: this.$store.getters.getConfig.dns,
      dataList: [],
      brandInfo: {},
      dialogVisible: false,
      dataListLoading: false,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      totalPage: 0,
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
      this.$api.brand.listPage(this.query).then(resp => {
        if (resp && resp.code === 0) {
          this.dataList = resp.data.list.records;
          this.totalPage = resp.data.list.total;
        } else {
          this.$message.error(resp.msg);
        }
        this.dataListLoading = false;
      });
    },
    addHandle() {
      this.brandInfo = {}
      this.dialogVisible = true;
    },
    updateHandle(row) {
      this.brandInfo = {}
      this.brandInfo.id = row.id
      this.brandInfo.nameCn = row.nameCn
      this.brandInfo.nameEn = row.nameEn
      this.brandInfo.logo = row.logo
      this.dialogVisible = true;
    },
    save() {
      if(this.brandInfo.id){
        this.update()
      }else{
        this.add()
      }
    },
    update() {
      const _this = this;
      _this.$api.brand.update(_this.brandInfo).then(resp => {
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
      _this.$api.brand.add(_this.brandInfo).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("新增成功");
          this.dialogVisible = false;
          _this.getDataList();
        } else {
          _this.$message.error(resp.msg);
        }
      });
    },
    deleteHandle(brandId) {
      const _this = this;
      _this.$api.brand.del({ brandId: brandId }).then(resp => {
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
          _this.brandInfo.logo = resp.data.path;
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
        //   _this.brandInfo.logo = resp.data.path;
        //   _this.$forceUpdate();
        // }
        _this.brandInfo.logo = resp.data.path;
        _this.$forceUpdate();
      });
    },
    sizeChangeHandle(pageSize) {
      this.query.pageSize = pageSize;
      this.query.pageIndex = 1;
      this.getDataList();
    },
    currentChangeHandle(pageIndex) {
      this.query.pageIndex = pageIndex;
      this.getDataList();
    }
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



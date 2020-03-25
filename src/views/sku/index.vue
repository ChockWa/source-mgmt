<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addHandle">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="name" header-align="center" align="center" label="sku名称"></el-table-column>
      <el-table-column prop="code" header-align="center" align="center" label="sku编码"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.code)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="sku" :visible.sync="dialogVisible" width="800px">
      <el-form label-position="right" label-width="120px" :model="skuInfo">
        <el-form-item label="sku名称">
          <el-input v-model="skuInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="sku编码">
          <el-input v-model="skuInfo.code"></el-input>
        </el-form-item>
        <el-form-item label="sku属性">
          <el-input v-model="skuInfo.values"></el-input>(多个属性使用逗号分隔)
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="action === 'add'" type="primary" @click="add">保 存</el-button>
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
      baseUrl: this.$store.getters.getConfig.dns,
      dataList: [],
      action: "add",
      skuInfo: {},
      dialogVisible: false,
      dataListLoading: false,
      dataMap: {}
    };
  },
  created() {
    this.getDataList();
  },
  computed: {},
  methods: {
    getDataList() {
      this.dataListLoading = true;
      this.$api.sku.list().then(resp => {
        if (resp && resp.code === 0) {
          if (resp.data.skuMap == null) {
            this.dataMap = {};
            this.dataList = [];
          } else {
            this.dataMap = {};
            this.dataList = [];
            this.dataMap = resp.data.skuMap;
            for (var key in this.dataMap) {
              this.dataList.push({
                name: key,
                code: this.dataMap[key][0].code
              });
            }
          }
        } else {
          this.$message.error(resp.msg);
        }
        this.dataListLoading = false;
      });
    },
    addHandle() {
      this.skuInfo = {};
      this.action = "add";
      this.dialogVisible = true;
    },
    detailHandle(row) {
      let skuList = this.dataMap[row.name];
      this.skuInfo.name = skuList[0].name;
      this.skuInfo.code = skuList[0].code;
      this.skuInfo.values = skuList
        .map(e => {
          return e.value;
        })
        .join(",");
      this.action = "detail";
      this.dialogVisible = true;
    },
    add() {
      const _this = this;
      let skus = [];
      let values = _this.skuInfo.values.split(",");
      for (var index in values) {
        let item = {
          name: _this.skuInfo.name,
          code: _this.skuInfo.code,
          value: values[index]
        };
        skus.push(item);
      }
      _this.$api.sku.add({ skus: skus }).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("新增成功");
          this.dialogVisible = false;
          _this.getDataList();
        } else {
          _this.$message.error(resp.msg);
        }
      });
    },
    deleteHandle(code) {
      const _this = this;
      _this.$api.sku.del({ code: code }).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("刪除成功");
          _this.getDataList();
        } else {
          _this.$message.error(resp.msg);
        }
      });
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



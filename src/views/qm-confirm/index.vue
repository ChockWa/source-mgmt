<template>
  <div>
    <!-- <el-form :inline="true" :model="query" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addHandle">新增</el-button>
      </el-form-item>
    </el-form> -->
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column
        prop="area"
        header-align="center"
        align="center"
        :formatter="areaFormat"
        label="地區"
      ></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="名稱"></el-table-column>
      <el-table-column prop="description" header-align="center" align="center" label="描述"></el-table-column>
      <el-table-column prop="contact" header-align="center" align="center" label="聯繫方式"></el-table-column>
      <el-table-column prop="image" header-align="center" align="center" label="圖片"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="verifyHandle(scope.row.id, 1)">通過</el-button>
          <el-button type="text" size="small" @click="verifyHandle(scope.row.id, -1)">不通過</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">刪除</el-button>
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

    <el-dialog title="審核" :visible.sync="dialogVisible" width="900px">
      <el-form label-position="right" label-width="120px" :model="verifyInfo">
        <el-form-item label="金幣">
          <el-input v-model="verifyInfo.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="verify">通 過</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "./../../common/utils/http";

export default {
  name: 'Qm',
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      dataListLoading: false,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      verifyInfo: {},
      totalPage: 0,
    };
  },
  created() {
    this.getDataList();
  },
  computed: {},
  methods: {
    getDataList() {
      this.dataListLoading = true;
      this.$api.qmC.list(this.query).then(resp => {
        if (resp && resp.code === 0) {
          this.dataList = resp.data.data.records;
          this.totalPage = resp.data.data.total;
        } else {
          this.$message.error(resp.msg);
        }
        this.dataListLoading = false;
      });
    },
    verifyHandle(qmId, status) {
      this.verifyInfo = {}
      this.verifyInfo.qmId = qmId
      this.verifyInfo.status = status
      if(status === -1){
        this.verify()
      }else{
        this.dialogVisible = true
      }
    },
    verify() {
      const _this = this
      _this.$api.qmC.verify(_this.verifyInfo).then(resp => {
        if(resp && resp.code === 0){
          _this.$message.success("審核成功")
          _this.dialogVisible = false
        }else{
          _this.$message.error(resp.msg)
        }
      })
    },
    deleteHandle(qmId) {
      const _this = this
      _this.$api.qmC.delete({qmId: qmId}).then(resp => {
        if(resp && resp.code === 0){
          _this.$message.success("刪除成功")
        }else{
          _this.$message.error(resp.msg)
        }
      })
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



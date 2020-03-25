<template>
  <div>
    <el-form :inline="true" :model="query" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="query.userName" maxlength="64" size="small"></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="uid" header-align="center" align="center" label="UID"></el-table-column>
      <el-table-column prop="userName" header-align="center" align="center" label="用戶名"></el-table-column>
      <el-table-column prop="email" header-align="center" align="center" label="郵箱"></el-table-column>
      <el-table-column prop="coin" header-align="center" align="center" label="金幣"></el-table-column>
      <el-table-column
        prop="vipEndTime"
        header-align="center"
        align="center"
        label="VIP到期時間"
        :formatter="vipEndTimeFormat"
      ></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="狀態"></el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="創建時間"
        :formatter="createTimeFormat"
      ></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addCoinHandle(scope.row)">加幣</el-button>
          <!-- <el-button type="text" size="small" @click="deleteHandle(scope.row.uid)">删除</el-button> -->
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

    <el-dialog title="加幣" :visible.sync="addCoinDialogVisible" width="400">
      <table>
        <tr>
          <td>用戶名：</td>
          <td>{{addCoinInfo.userName}}</td>
        </tr>
        <tr>
          <td>當前金幣：</td>
          <td>{{addCoinInfo.currentCoin}}</td>
        </tr>
        <tr>
          <td>加金幣數：</td>
          <td><el-input v-model="addCoinInfo.coin" maxlength="5"></el-input></td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCoinDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCoin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as dateUtil from "./../../common/utils/DateUtil";
export default {
  name: "User",
  data() {
    return {
      addCoinDialogVisible: false,
      dataListLoading: false,
      dataList: [],
      query: {
        pageIndex: 1,
        pageSize: 10,
        userName: ""
      },
      total: 0,
      addCoinInfo: {}
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      const _this = this;
      _this.dataListLoading = true
      _this.$api.user.users(_this.query).then(resp => {
        if (resp && resp.code === 0) {
          _this.dataList = resp.data.data.records;
          _this.total = resp.data.data.total;
        } else {
          _this.$message.error(resp.msg);
        }
        _this.dataListLoading = false
      });
    },
    addCoinHandle(row) {
      this.addCoinInfo = {}
      this.addCoinInfo.uid = row.uid
      this.addCoinInfo.userName = row.userName
      this.addCoinInfo.currentCoin = row.coin
      this.addCoinDialogVisible = true
    },
    addCoin() {
      const _this = this
      if(!_this.addCoinInfo.coin){
        _this.$message.error("金幣不能為空")
        return
      }
      _this.$api.user.addCoin(_this.addCoinInfo).then(resp => {
        if(resp && resp.code === 0){
            _this.$message.success("增加成功")
            _this.addCoinDialogVisible = false
            _this.getDataList();
        }else{
            _this.$message.error(resp.msg)
        }
      })
    },
    vipEndTimeFormat(row) {
      return dateUtil.formartDate(row.vipEndTime);
    },
    createTimeFormat(row) {
      return dateUtil.formartDate(row.createTime);
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
</style>



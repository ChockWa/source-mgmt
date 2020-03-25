<template>
  <div>
    <el-form :inline="true" :model="query" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="query.cardNo" maxlength="64" size="small"></el-input>
        <el-button type="primary" size="small" @click="addCardHandle">新增卡</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="uid" header-align="center" align="center" label="UID"></el-table-column>
      <el-table-column prop="cardNo" header-align="center" align="center" label="卡密"></el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="類型"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="狀態"></el-table-column>
      <el-table-column
        prop="useTime"
        header-align="center"
        align="center"
        label="使用時間"
        :formatter="useTimeFormat"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="創建時間"
        :formatter="createTimeFormat"
      ></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="addCardHandle(scope.row)">加幣</el-button> -->
          <el-button type="text" size="small" @click="deleteHandle(scope.row.cardNo)">删除</el-button>
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

    <el-dialog title="添加卡" :visible.sync="addCardDialogVisible" width="400">
      <table>
        <tr>
          <td>類型：</td>
          <td>
            <el-select v-model="cardInfo.type" placeholder="请选择" size="small">
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
           </el-select>
          </td>
        </tr>
        <tr>
          <td>卡密：</td>
          <td><el-input v-model="cardInfo.cardNo" maxlength="64"></el-input></td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCard">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as dateUtil from "./../../common/utils/DateUtil";
export default {
  name: "Card",
  data() {
    return {
      addCardDialogVisible: false,
      dataListLoading: false,
      dataList: [],
      query: {
        pageIndex: 1,
        pageSize: 10,
        cardNo: ""
      },
      total: 0,
      cardInfo: {},
      products: [
        {
          id: 1,
          name: "30金幣",
          price: 30
        },
        {
          id: 2,
          name: "50金幣",
          price: 50
        },
        {
          id: 3,
          name: "月VIP",
          price: 68
        },
        {
          id: 4,
          name: "季VIP",
          price: 128
        }
      ]
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      const _this = this;
      _this.dataListLoading = true
      _this.$api.card.cards(_this.query).then(resp => {
        if (resp && resp.code === 0) {
          _this.dataList = resp.data.cards.records;
          _this.total = resp.data.cards.total;
        } else {
          _this.$message.error(resp.msg);
        }
        _this.dataListLoading = false
      });
    },
    addCardHandle() {
      this.cardInfo = {}
      this.addCardDialogVisible = true
    },
    addCard() {
      const _this = this
      _this.$api.card.add(_this.cardInfo).then(resp => {
        if(resp && resp.code === 0){
            _this.$message.success("增加成功")
            _this.addCardDialogVisible = false
            _this.getDataList();
        }else{
            _this.$message.error(resp.msg)
        }
      })
    },
    deleteHandle(cardNo) {
      const _this = this
      _this.dataListLoading = true
      _this.$api.card.delete({cardNo: cardNo}).then(resp => {
        if(resp && resp.code === 0){
            _this.$message.success("刪除成功")
            _this.getDataList();
        }else{
            _this.$message.error(resp.msg)
        }
        _this.dataListLoading = false
      })
    },
    useTimeFormat(row) {
      return dateUtil.formartDate(row.useTime);
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



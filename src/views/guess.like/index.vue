<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addGuessLikeHandle">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="guessLikes" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="categoryName" header-align="center" align="center" label="分类"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="商品名称"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="商品" :visible.sync="dialogVisible" width="800px" v-loading="addLoading">
      <el-table :data="goodsList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column prop="categoryName" header-align="center" align="center" label="分类"></el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="商品名称"></el-table-column>
        <el-table-column prop="status" header-align="center" align="center" label="状态"></el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addGuessLike(scope.row.id)">添加</el-button>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GuessLike",
  data() {
    return {
      goodsList: [],
      guessLikes: [],
      dialogVisible: false,
      dataListLoading: false,
      addLoading: false,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      totalPage: 0
    };
  },
  created() {
    this.getGoodsList()
    this.getGuessLikeList()
  },
  methods: {
    getGoodsList() {
      this.dataListLoading = true;
      this.$api.goods.listPage(this.query).then(resp => {
        if (resp && resp.code === 0) {
          this.goodsList = resp.data.records;
          this.totalPage = resp.data.total;
        } else {
          this.$message.error(resp.msg);
        }
        this.dataListLoading = false;
      });
    },
    getGuessLikeList() {
      this.dataListLoading = true;
      this.$api.guessLike.list().then(resp => {
        if (resp && resp.code === 0) {
          this.guessLikes = resp.data.list;
        } else {
          this.$message.error(resp.msg);
        }
        this.dataListLoading = false;
      });
    },
    addGuessLikeHandle() {
      this.dialogVisible = true
    },
    addGuessLike(goodsId) {
      this.addLoading = true;
      this.$api.guessLike.add({goodsId, goodsId}).then(resp => {
        if (resp && resp.code === 0) {
          this.$message.success("添加成功");
        } else {
          this.$message.error(resp.msg);
        }
        this.addLoading = false;
      });
    },
    deleteHandle(goodsId) {
      this.dataListLoading = true;
      this.$api.guessLike.del({goodsId, goodsId}).then(resp => {
        if (resp && resp.code === 0) {
          this.getGuessLikeList()
          this.$message.success("删除成功");
        } else {
          this.$message.error(resp.msg);
        }
        this.dataListLoading = false;
      });
    },
    close() {
      this.getGuessLikeList()
      this.dialogVisible = false
    },
    sizeChangeHandle(pageSize) {
      this.query.pageSize = pageSize;
      this.query.pageIndex = 1;
      this.getGoodsList();
    },
    currentChangeHandle(pageIndex) {
      this.query.pageIndex = pageIndex;
      this.getGoodsList();
    }
  }
};
</script>
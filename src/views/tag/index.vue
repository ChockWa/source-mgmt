<template>
  <div v-loading="loading">
    <div><el-button size="small" type="primary" @click="addHandle">新增标签</el-button></div>
    <el-table :data="dataList" border style="width: 100%;margin-top:20px;">
      <el-table-column prop="name" header-align="center" align="center" label="标签名称">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.name" @change="updateHandle(scope.row)" style='width:250px;'></el-input>
          </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态" :formatter="statusFormat"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" type="text" size="small" @click="updateStatus(scope.row)">生效</el-button>
          <el-button v-else type="text" size="small" @click="updateStatus(scope.row)">失效</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
  title="新增标签"
  :visible.sync="dialogVisible"
  width="400"
  :before-close="handleClose">
  <div style="text-align:center;">
    标签名：<el-input v-model="tagModel.name" maxlength="10" size="small" style="width:210px;"></el-input>
  </div>
  <div slot="footer" style="text-align:center;">
    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    <el-button type="primary" @click="add" size="small">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: "TagList",
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      tagModel: {},
      loading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      const resp = await this.$api.tag.list();
      if (resp) {
        if (resp.code === 0) {
          this.dataList = resp.data.list;
        } else {
          this.$message.error(resp.msg);
        }
      }
      this.loading = false;
    },
    statusFormat(row) {
      return row.status === 1 ? "生效" : "失效";
    },
    addHandle() {
      this.tagModel = {};
      this.dialogVisible = true;
    },
    async add() {
      if (!this.tagModel.name) {
        this.$message.error("标签名不能不能为空");
        return;
      }
      this.loading = true;
      const resp = await this.$api.tag.add(this.tagModel);
      if (resp) {
        if (resp.code === 0) {
          this.getList();
          this.$message.success("操作成功");
          this.dialogVisible = false;
        } else {
          this.$message.error(resp.msg);
        }
      }
      this.loading = false;
    },
    async updateStatus(row) {
      this.loading = true;
      const resp = await this.$api.tag.updateStatus({
        id: row.id,
        status: row.status === 1 ? 0 : 1
      });
      if (resp) {
        if (resp.code === 0) {
          this.getList();
          this.$message.success("操作成功");
        } else {
          this.$message.error(resp.msg);
        }
      }
      this.loading = false;
    },
    async updateHandle(row) {
      this.loading = true;
      const resp = await this.$api.tag.update(row);
      if (resp) {
        if (resp.code === 0) {
          this.getList();
          this.$message.success("操作成功");
        } else {
          this.$message.error(resp.msg);
        }
      }
      this.loading = false;
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
};
</script>

<style>
</style>

<template>
  <div class="e-goods-detail">
    <el-dialog title="商品详情" :visible.sync="showDetail" v-loading="loading" :before-close="closeDetail" width="800px">
      <el-table :data="goodsDetails">
        <el-table-column property="name" label="商品名称" width="150"></el-table-column>
        <el-table-column property="goodsSkuMap" label="规格">
          <template slot-scope="scope">
            <ul>
              <li v-for="(value,key) in scope.row.goodsSkuMap" :key="key">
                {{key}}：{{value}}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column property="price" label="价格" width="150">
          <template slot-scope="scope">
              <el-input v-model="scope.row.price" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="stock" label="库存" width="150">
          <template slot-scope="scope">
              <el-input v-model="scope.row.stock" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="status" label="状态" width="100"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDetail" size="small">关 闭</el-button>
        <el-button type="primary" @click="save" size="small">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GoodsDetailDialog",
  props: {goodsId: {type: String, require: true},showDetail: {type: Boolean, default: false, require: true}},
  data() {
    return {
      goodsDetails: [],
      loading: false
    };
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      const _this = this
      _this.loading = true
      _this.$api.goodsDetail.list({goodsId: _this.goodsId}).then(resp => {
        if(resp){
          if(resp.code === 0){
            _this.goodsDetails = resp.data.list
          }else{
            _this.$message.error(resp.msg)
          }
        }
        _this.loading = false
      })
    },
    save() {
      const _this = this
      _this.loading = true
      _this.goodsDetails.forEach(e => {
        delete e.goodsSkuMap
        delete e.name
      })
      _this.$api.goodsDetail.updateList({goodsDetails: _this.goodsDetails}).then(resp => {
        if(resp){
          if(resp.code === 0){
            _this.$message.success("保存成功")
            _this.closeDetail()
          }else{
            _this.$message.error(resp.msg)
          }
        }
        _this.loading = false
      })
    },
    closeDetail() {
      this.$emit("closeDetail")
    }
  }
};
</script>

<style lang="scss">
.e-goods-detail {
  ul {
    padding-left: 0px;
  }
  ul li {
    list-style-type: none;
  }
}
</style>



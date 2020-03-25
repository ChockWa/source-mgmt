<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addHandle">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="categoryName" header-align="center" align="center" label="分类"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="商品名称"></el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="价格"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
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

    <el-dialog title="商品" :visible.sync="dialogVisible" width="800px" v-loading="saveLoading">
      <el-form label-position="right" label-width="120px" :model="goodsInfo">
        <el-form-item label="分类">
          <el-select
            v-model="goodsInfo.categoryId"
            placeholder="请选择"
            style="width:200px;"
            size="small"
          >
            <el-option
              v-for="(item, index) in categories"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="goodsInfo.name" style="width:200px;" size="small"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input
            type="textarea"
            rows="3"
            v-model="goodsInfo.description"
            style="width:500px;"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input
            type="textarea"
            rows="3"
            v-model="goodsInfo.price"
            style="width:500px;"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="上/下架">
          <el-switch v-model="goodsInfo.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="商品封面">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="handleCoverChange"
            :on-remove="handleCoverRemove"
            :auto-upload="false"
          >
            <img v-if="goodsInfo.cover" :src="goodsInfo.cover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="imageList"
            :auto-upload="false"
            list-type="picture"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <!-- <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >上传到服务器</el-button> -->
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="设置规格">
          <el-select
            v-model="setSkuInfo.skuType"
            placeholder="请选择sku类型"
            style="width:200px;"
            size="small"
          >
            <el-option
              v-for="(item, index) in skuTypeList"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <el-select
            v-model="setSkuInfo.skuValues"
            multiple
            placeholder="请选择sku值"
            size="small"
            style="width:200px;"
          >
            <el-option
              v-for="(item, index) in skuValueList"
              :key="index"
              :label="item.value"
              :value="item"
            ></el-option>
          </el-select>
          <el-button size="small" type="primary" @click="addGoodsSku">添 加</el-button>
          <table>
            <tr v-for="(item, key) in goodsInfo.skuMap" :key="key">
              <td>{{key}}：</td>
              <td>{{item.map(e => {return e.value}).join(",")}}</td>
              <td>
                <el-button size="mini" @click="deleteGoodsSku(key)">删除</el-button>
              </td>
            </tr>
          </table>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small">保 存</el-button>
      </span>
    </el-dialog>
    <goods-detail
      v-if="showDetail"
      :goodsId="detailGoodsId"
      :showDetail="showDetail"
      v-on:closeDetail="closeDetail"
    ></goods-detail>
  </div>
</template>

<script>
import axios from "./../../common/utils/http";
import GoodsDetail from "./goods.detail";
export default {
  name: "Goods",
  components: { GoodsDetail },
  data() {
    return {
      uploadUrl: this.$store.getters.getConfig.baseUrl + "/file/upload",
      localUploadUrl: "http://localhost:17989/file/uploadFile",
      baseUrl: this.$store.getters.getConfig.dns,
      dataList: [],
      goodsInfo: {
        // skuMap: {},
        status: false
      },
      brands: [],
      categories: [],
      imageList: [],
      // skuMap: {},
      skuTypeList: [],
      skuValueList: [],
      dialogVisible: false,
      dataListLoading: false,
      saveLoading: false,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      setSkuInfo: {
        skuType: null,
        skuValues: []
      },
      totalPage: 0,
      uploadConfig: {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      },
      detailGoodsId: "",
      showDetail: false,
      goodsType: {
        1:"饰品",
        2:"球服"
      }
    };
  },
  created() {
    this.getCategories();
    // this.getSkus();
    this.getDataList();
  },
  watch: {
    // "setSkuInfo.skuType"(skuType) {
    //   this.setSkuInfo.skuValues = [];
    //   if (skuType) {
    //     this.skuValueList = this.skuMap[skuType];
    //   } else {
    //     this.skuValueList = [];
    //   }
    // }
  },
  methods: {
    getDataList() {
      this.dataListLoading = true;
      this.$api.goods.listPage(this.query).then(resp => {
        if (resp && resp.code === 0) {
          this.dataList = resp.data.records;
          this.totalPage = resp.data.total;
        } else {
          this.$message.error(resp.msg);
        }
        this.dataListLoading = false;
      });
    },
    getBrands() {
      this.$api.brand.list().then(resp => {
        if (resp && resp.code === 0) {
          this.brands = resp.data.list;
        } else {
          this.$message.error(resp.msg);
        }
      });
    },
    getCategories() {
      this.$api.category.list().then(resp => {
        if (resp && resp.code === 0) {
          this.categories = resp.data.list;
        } else {
          this.$message.error(resp.msg);
        }
      });
    },
    // getSkus() {
    //   this.$api.sku.list().then(resp => {
    //     if (resp && resp.code === 0) {
    //       this.skuMap = resp.data.skuMap;
    //       for (var key in this.skuMap) {
    //         this.skuTypeList.push({
    //           name: key,
    //           code: this.skuMap[key][0].code
    //         });
    //       }
    //     } else {
    //       this.$message.error(resp.msg);
    //     }
    //   });
    // },
    // addGoodsSku() {
    //   const _this = this;
    //   let tempMap = new Map();
    //   for (let key in _this.goodsInfo.skuMap) {
    //     tempMap.set(key, _this.goodsInfo.skuMap[key]);
    //   }
    //   if (tempMap.has(_this.setSkuInfo.skuType)) {
    //     _this.$message.error("该类型已添加过");
    //   }
    //   tempMap.set(_this.setSkuInfo.skuType, _this.setSkuInfo.skuValues);
    //   _this.goodsInfo.skuMap = {};
    //   tempMap.forEach(function(value, key, map) {
    //     _this.goodsInfo.skuMap[key] = value;
    //   });
    //   _this.setSkuInfo = {
    //     skuType: null,
    //     skuValues: []
    //   };
    // },
    addHandle() {
      this.resetModel();
      this.dialogVisible = true;
    },
    resetModel() {
      this.goodsInfo = {
        // skuMap: {},
        status: false
      };
      this.imageList = [];
      this.setSkuInfo = {
        skuType: null,
        skuValues: []
      };
    },
    save() {
      const _this = this;
      _this.saveLoading = true;
      _this.goodsInfo.images = _this.imageList
        .map(e => {
          return e.url;
        })
        .join(",");
      if (_this.goodsInfo.id) {
        _this.goodsInfo.goodsId = _this.goodsInfo.id;
        delete _this.goodsInfo.id;
      }
      _this.$api.goods.save(_this.goodsInfo).then(resp => {
        if (resp) {
          if (resp.code === 0) {
            _this.$message.success("添加成功");
            this.dialogVisible = false;
            _this.getDataList();
          } else {
            _this.$message.error(resp.msg);
          }
        }
        _this.saveLoading = false;
      });
    },
    // async submitUpload() {
    //   const _this = this;
    //   if (_this.imageList.length < 1) {
    //     _this.$message.success("请选择文件");
    //     return;
    //   }
    //   let paths = [];
    //   for (let i in _this.imageList) {
    //     let file = _this.imageList[i];
    //     let param = new FormData();
    //     param.append("file", file.raw);
    //     await axios
    //       .post(_this.uploadUrl, param, _this.uploadConfig)
    //       .then(resp => {
    //         if (resp) {
    //           if (resp.code === 0) {
    //             paths.push(resp.data.path);
    //           } else {
    //             _this.$message.error(resp.msg);
    //             return;
    //           }
    //         }
    //       });
    //   }
    //   console.log(paths);
    //   _this.goodsInfo.images = paths.join(",");
    //   _this.$message.success("上传成功");
    // },
    // deleteGoodsSku(key) {
    //   delete this.goodsInfo.skuMap[key];
    //   this.$forceUpdate();
    // },
    handleChange(file, fileList) {
      const _this = this;
      let param = new FormData();
      param.append("file", file.raw);
      axios.post(_this.localUploadUrl, param, _this.uploadConfig).then(resp => {
        if (resp) {
          if (resp.code === 0) {
            _this.imageList.push({
              url: resp.data.path
            });
          } else {
            _this.$message.error(resp.msg);
            return;
          }
        }
      });
    },
    handleCoverChange(file, fileList) {
      const _this = this;
      if (this.goodsInfo.cover) {
        let result = this.deleteFile(this.goodsInfo.cover);
        if (!result) {
          return;
        }
      }
      let param = new FormData();
      param.append("file", file.raw);
      axios.post(_this.localUploadUrl, param, _this.uploadConfig).then(resp => {
        if (resp) {
          console.log(resp)
          if (resp.code === 0) {
            _this.goodsInfo.cover = resp.data.path;
            _this.$forceUpdate()
          } else {
            _this.$message.error(resp.msg);
            return;
          }
        }
      });
    },
    handleCoverRemove(file, fileList) {
      let result = this.deleteFile(this.goodsInfo.cover);
      if (result) {
        this.goodsInfo.cover = null;
        this.$message.success("刪除成功");
      }
    },
    async deleteFile(path) {
      const _this = this;
      let result = false;
      await _this.$api.file.delFile({ path: path }).then(resp => {
        if (resp) {
          if (resp.code === 0) {
            result = true;
          } else {
            _this.$message.error(resp.msg);
          }
        }
        return result;
      });
    },
    handleRemove(file, fileList) {
      if (file.url.indexOf(this.baseUrl) !== -1) {
        file.url = file.url.substr(this.baseUrl.length);
      }
      if (this.deleteFile(file.url)) {
        this.imageList = this.imageList
          .filter(e => e.url !== file.url)
          .concat();
        this.$message.success("删除成功");
      }
    },
    detailHandle(row) {
      this.detailGoodsId = row.id;
      this.showDetail = true;
    },
    updateHandle(row) {
      this.resetModel();
      Object.assign(this.goodsInfo, row);
      if (this.goodsInfo.images && this.goodsInfo.images[0] !== " ") {
        let images = this.goodsInfo.images.split(",");
        for (var i in images) {
          this.imageList.push({ url: this.baseUrl + images[i] });
        }
      }
      this.dialogVisible = true;
    },
    closeDetail() {
      this.detailGoodsId = "";
      this.showDetail = false;
    },
    // submitUploadLogo(file, fileList) {
    //   const _this = this;
    //   let param = new FormData();
    //   param.append("file", file.raw);
    //   axios.post(_this.uploadUrl, param, _this.uploadConfig).then(resp => {
    //     if (resp && resp.code === 0) {
    //       _this.brandInfo.logo = resp.data.path;
    //       _this.$forceUpdate();
    //     }
    //   });
    // },
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



<template>
  <div>
    <el-form :inline="true" :model="query" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addHandle">新增</el-button>
        <el-button type="primary" @click="oneUploadHandle">一鍵上傳</el-button>
      </el-form-item>
    </el-form>
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
      <el-table-column prop="price" header-align="center" align="center" label="價格(金幣數)"></el-table-column>
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

    <el-dialog title="QM" :visible.sync="dialogVisible" width="900px">
      <el-form label-position="right" label-width="120px" :model="qmInfo">
        <el-form-item label="地區">
          <el-select v-model="qmInfo.area" placeholder="请选择">
            <el-option v-for="(value, key) in areas" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名稱">
          <el-input v-model="qmInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" rows="3" v-model="qmInfo.description" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="聯繫方式">
          <el-input type="textarea" rows="5" v-model="qmInfo.contact"></el-input>
        </el-form-item>
        <el-form-item label="價格(金幣數)">
          <el-input v-model="qmInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="熱度">
          <el-input v-model="qmInfo.score"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            class="avatar-uploader"
            action="a"
            :show-file-list="false"
            :on-change="submitUploadCover"
            :auto-upload="false"
          >
            <img v-if="qmInfo.cover" :src="baseUrl + qmInfo.cover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="圖片">
          <el-upload
            class="avatar-uploader"
            action="a"
            :show-file-list="false"
            :on-change="submitUpload1"
            :auto-upload="false"
          >
            <img v-if="image1" :src="baseUrl + image1" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action="a"
            :show-file-list="false"
            :on-change="submitUpload2"
            :auto-upload="false"
          >
            <img v-if="image2" :src="baseUrl + image2" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action="a"
            :show-file-list="false"
            :on-change="submitUpload3"
            :auto-upload="false"
          >
            <img v-if="image3" :src="baseUrl + image3" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div>
        <el-input type="textarea" v-model="qmInfoJson" rows="6"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="genJson">生成json</el-button>
        <el-button type="primary" @click="add">新 增</el-button>
        <el-button v-if="qmInfo.id" type="primary" @click="update">更 新</el-button>
      </span>
    </el-dialog>

    <el-dialog title="一鍵上傳" :visible.sync="oneUploadDialogVisible" width="400px">
      <table>
        <tr>
          <td>目標路徑：</td>
          <td><el-input v-model="targetDir" maxlength="16" size="small"></el-input></td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oneUploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="oneUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "./../../common/utils/http";

export default {
  name: "Qm",
  data() {
    return {
      uploadUrl: this.$store.getters.getConfig.baseUrl + "/file/upload",
      baseUrl: this.$store.getters.getConfig.dns,
      qmInfoJson: "",
      loading: false,
      dataList: [],
      qmInfo: {},
      image1: "",
      image2: "",
      image3: "",
      imageList: [],
      dialogVisible: false,
      dataListLoading: false,
      oneUploadDialogVisible: false,
      targetDir: "",
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      areas: {
        "1": "廣州",
        "2": "深圳"
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
      this.$api.qm.qmsMgmt(this.query).then(resp => {
        if (resp && resp.code === 0) {
          this.dataList = resp.data.qms.records;
          this.totalPage = resp.data.qms.total;
        } else {
          this.$message.error(resp.msg);
        }
        this.dataListLoading = false;
      });
    },
    genJson() {
      this.qmInfoJson = JSON.stringify(this.qmInfo);
    },
    addHandle() {
      this.resetData();
      this.dialogVisible = true;
    },
    resetData() {
      this.qmInfo = {};
      this.imageList = [];
      (this.image1 = ""),
        (this.image2 = ""),
        (this.image3 = ""),
        (this.qmInfoJson = "");
    },
    updateHandle(row) {
      this.dialogVisible = true;
      this.qmInfo = row;
      // Object.assign(this.qmInfo, row);
      this.imageList = this.qmInfo.image.split(",");
      switch (this.imageList.length) {
        case 1:
          this.image1 = this.imageList[0];
          break;
        case 2:
          this.image1 = this.imageList[0];
          this.image2 = this.imageList[1];
          break;
        case 3:
          this.image1 = this.imageList[0];
          this.image2 = this.imageList[1];
          this.image3 = this.imageList[2];
          break;
        default:
          break;
      }
    },
    update() {
      const _this = this;
      _this.qmInfo.image = _this.imageList.join(",");
      _this.$api.qm.update(_this.qmInfo).then(resp => {
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
      _this.qmInfo.image = _this.imageList.join(",");
      _this.$api.qm.add(_this.qmInfo).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("新增成功");
          this.dialogVisible = false;
          _this.getDataList();
        } else {
          _this.$message.error(resp.msg);
        }
      });
    },
    deleteHandle(qmId) {
      const _this = this;
      _this.$api.qm.delete({ qmId: qmId }).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("刪除成功");
          _this.getDataList();
        } else {
          _this.$message.error(resp.msg);
        }
      });
    },
    areaFormat(row) {
      return this.areas[row.area];
    },
    submitUploadCover(file, fileList) {
      const _this = this;
      let param = new FormData();
      param.append("file", file.raw);
      axios.post(_this.uploadUrl, param, _this.uploadConfig).then(resp => {
        if (resp && resp.code === 0) {
          _this.qmInfo.cover = resp.data.path;
          _this.$forceUpdate();
        }
      });
    },
    submitUpload1(file, fileList) {
      const _this = this;
      _this.imageList = [];
      let param = new FormData();
      param.append("file", file.raw);
      axios.post(_this.uploadUrl, param, _this.uploadConfig).then(resp => {
        if (resp && resp.code === 0) {
          _this.image1 = resp.data.path;
          _this.imageList.push(resp.data.path);
        }
      });
    },
    submitUpload2(file, fileList) {
      const _this = this;
      let param = new FormData();
      param.append("file", file.raw);
      axios.post(_this.uploadUrl, param, _this.uploadConfig).then(resp => {
        if (resp && resp.code === 0) {
          _this.image2 = resp.data.path;
          _this.imageList.push(resp.data.path);
        }
      });
    },
    submitUpload3(file, fileList) {
      const _this = this;
      let param = new FormData();
      param.append("file", file.raw);
      axios.post(_this.uploadUrl, param, _this.uploadConfig).then(resp => {
        if (resp && resp.code === 0) {
          _this.image3 = resp.data.path;
          _this.imageList.push(resp.data.path);
        }
      });
    },
    oneUploadHandle() {
      this.targetDir = ""
      this.oneUploadDialogVisible = true
    },
    oneUpload() {
      const _this = this
      if(_this.targetDir === ''){
        _this.$message.error("目標目錄不能為空")
        return
      }
      _this.$api.source.oneUploadQm({prepareFilePath: _this.targetDir}).then(resp => {
        if(resp){
          if(resp.code === 0){
            _this.$message.success("上傳成功")
            _this.oneUploadDialogVisible = false
          }else{
            _this.$message.error(resp.msg)
          }
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



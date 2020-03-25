<template>
  <div>
    <el-form :inline="true" :model="query" @keyup.enter.native="getDataList()">
      <!-- <el-form-item>
        <el-input v-model="query.server" placeholder="服务器名称" clearable></el-input>
      </el-form-item> -->
      <el-form-item>
        <!-- <el-button @click="getDataList()">查询</el-button> -->
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" @click="genDescJsonHandle()">生成資源描述JSON</el-button>
        <el-button type="primary" @click="oneUploadHandle()">一鍵上傳</el-button>
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="category" header-align="center" align="center" :formatter="categoryFormat" label="分类"></el-table-column>
      <el-table-column prop="type" header-align="center" align="center" :formatter="sourceTypeFormat" label="类型"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="资源名称"></el-table-column>
      <el-table-column prop="downloadCode" header-align="center" align="center" label="下载码"></el-table-column>
      <el-table-column prop="downloadLink" header-align="center" align="center" label="下载地址"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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

    <el-dialog title="新增/修改" :visible.sync="visible">
      <el-form ref="dataForm" :model="source" label-width="80px" size="mini">
        <el-form-item label="分类">
          <el-select v-model="source.category" placeholder="请选择" clearable>
            <el-option
              v-for="item in categorys"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="source.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in sourceTypes"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" size="small" prop="name">
          <el-input v-model="source.name" placeholder="资源名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" size="small" prop="description">
          <el-input v-model="source.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="封面" size="small" prop="cover">
          <el-upload
            class="avatar-uploader"
            action="a"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="submitUploadAvator"
          >
            <img v-if="cover" :src="cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="下载码" size="small" prop="downloadCode">
          <el-input v-model="source.downloadCode" placeholder="下载码"></el-input>
        </el-form-item>
        <el-form-item label="下载地址" size="small" prop="downloadLink">
          <el-input v-model="source.downloadLink" placeholder="下载地址"></el-input>
        </el-form-item>
        <!-- <el-form-item label="资源列表" size="small" prop="downloadLink">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="a"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="changeFile"
            :file-list="fileList"
            list-type="picture"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
            <span>（一共{{fileListSize}}张，当前上传第{{uploadProcess}}张）</span>&nbsp;&nbsp;
            <span v-if="fileListSize !== 0 &&fileListSize === uploadProcess" style="color:red;">上传完成</span>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="资源文件" size="small">
          <el-upload
            action="a"
            :on-change="previewZipFile"
            :auto-upload="false"
            :file-list="uploadFileList"
            :on-remove="removeFile"
          >
            <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="uploadZip">上传</el-button>
            <span v-if="uploadZipSuccess && !uploadZipfail" style="color:red;">上传完成</span>
            <span v-if="uploadZipfail && !uploadZipSuccess" style="color:red;">上传失败</span>
          </el-upload>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="生成json" :visible.sync="jsonVisible">
      <el-form :model="source" label-width="80px" size="mini">
        <el-form-item label="分类">
          <el-select v-model="source.category" placeholder="请选择" clearable>
            <el-option
              v-for="item in categorys"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="source.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in sourceTypes"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" size="small" prop="name">
          <el-input v-model="source.name" placeholder="资源名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" size="small" prop="description">
          <el-input v-model="source.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="下载码" size="small" prop="downloadCode">
          <el-input v-model="source.downloadCode" placeholder="下载码"></el-input>
        </el-form-item>
        <el-form-item label="下载地址" size="small" prop="downloadLink">
          <el-input v-model="source.downloadLink" placeholder="下载地址"></el-input>
        </el-form-item>
        <el-form-item label="json" size="small" prop="json">
          <el-input type="textarea" rows="5" v-model="source.json"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button @click="genJson">生成</el-button>
          <el-button @click="jsonVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="一鍵上傳" :visible.sync="uploadVisible" v-loading="loading">
      <el-form :model="source" label-width="120px" size="mini">
        <el-form-item label="目標文件夾名稱" size="small" prop="dirName">
          <el-input v-model="dirName"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button @click="oneUpload">上傳</el-button>
          <el-button @click="uploadVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from './../../common/utils/http'

export default {
  name: 'upload',
  data () {
    return {
      loading: false,
      dataList: [],
      dataListLoading: false,
      uploadUrl: this.$store.getters.getConfig.baseUrl + '/file/upload',
      uploadZipUrl: this.$store.getters.getConfig.baseUrl + '/file/uploadZip',
      fileList: [],
      uploadFileList: [],
      file: null,
      source: {},
      cover: '',
      sourceDetailList: [],
      uploadParams: {},
      visible: false,
      jsonVisible: false,
      uploadVisible: false,
      zipFile: null,
      uploadZipSuccess: false,
      uploadZipfail: false,
      dirName: '',
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      totalPage: 0,
      categorys: [
        { dictKey: 1, dictValue: 'Man' },
        { dictKey: 2, dictValue: 'Girl' },
        { dictKey: 3, dictValue: 'Comic' }
      ],
      sourceTypes: [
        { dictKey: 1, dictValue: 'Image' },
        { dictKey: 2, dictValue: 'Vedio' }
      ],
      prepareUploadFiles: [],
      uploadProcess: 0,
      fileListSize: this.getFileListSize,
      uploadConfig: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }
  },
  created () {
    this.getDataList()
  },
  computed: {
    getFileListSize () {
      return this.fileList.length
    }
  },
  methods: {
    previewZipFile (file, fileList) {
      this.uploadFileList = fileList
    },
    removeFile (file, fileList) {
      this.uploadFileList = fileList
    },
    async uploadZip () {
      const _this = this
      _this.fileList = []
      if (_this.uploadFileList.length > 1) {
        _this.$message.error('只能选择一个文件')
        return
      }
      for (var index in _this.uploadFileList) {
        let param = new FormData()
        param.append('file', _this.uploadFileList[index].raw)
        await axios.post(_this.uploadZipUrl, param, _this.uploadConfig).then(resp => {
          if (resp && resp.code === 0) {
            let details = resp.data.data
            if (details && details.length > 0) {
              for (var index in details) {
                const item = {
                  name: details[index].name,
                  url: details[index].url,
                  originUrl: details[index].originUrl,
                  thumbImage: details[index].thumbUrl,
                  originThumbImage: details[index].originThumbUrl
                }
                _this.fileList.push(item)
              }
            }
            _this.uploadZipSuccess = true
            _this.uploadZipfail = false
          } else {
            _this.uploadZipfail = true
            _this.uploadZipSuccess = false
            _this.$message.error(resp.msg)
          }
        })
      }
    },
    categoryFormat (row) {
      for (var index in this.categorys) {
        if (this.categorys[index].dictKey === row.category) {
          return this.categorys[index].dictValue
        }
      }
    },
    sourceTypeFormat (row) {
      for (var index in this.sourceTypes) {
        if (this.sourceTypes[index].dictKey === row.type) {
          return this.sourceTypes[index].dictValue
        }
      }
    },
    getDataList () {
      this.dataListLoading = true
      this.$api.source.getSourceListPage(this.query).then(resp => {
        if (resp && resp.code === 0) {
          this.dataList = resp.data.data.records
          this.totalPage = resp.data.data.total
        } else {
          this.$message.error(resp.msg)
        }
        this.dataListLoading = false
      })
    },
    save () {
      const _this = this
      let fileList = []
      _this.fileList.forEach(e => {
        let obj = {
          picUrl: e.url,
          originUrl: e.originUrl,
          name: e.name,
          thumbImage: e.thumbImage,
          originThumbImage: e.originThumbImage
        }
        fileList.push(obj)
      })
      const params = {
        source: _this.source,
        sourceDetailList: fileList
      }
      _this.$api.source.sourceSave(params).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("保存成功")
          _this.visible = false
          _this.getDataList()
        } else {
          _this.$message.error(resp.msg)
        }
      })
    },
    addOrUpdateHandle (id) {
      this.zipFile = null
      this.uploadZipSuccess = false
      this.fileListSize = 0
      this.uploadProcess = 0
      this.cover = ''
      this.fileList = []
      this.uploadFileList = []
      this.source = {}
      this.sourceDetailList = []
      if (id != null && id !== undefined) {
        this.initUpdateData(id)
      }
      this.visible = true
    },
    initUpdateData (id) {
      const _this = this
      _this.$api.source.getSourceDetailById({sourceId: id}).then(resp => {
        if (resp && resp.code === 0) {
          _this.cover = resp.data.data.source.cover
          _this.source = resp.data.data.source
          _this.sourceDetailList = resp.data.data.sourceDetailList
          for (var index in _this.sourceDetailList) {
            let obj = {
              name: _this.sourceDetailList[index].name,
              url: _this.sourceDetailList[index].picUrl,
              originUrl: _this.sourceDetailList[index].originUrl,
              deleteUrl: _this.sourceDetailList[index].deleteUrl
            }
            _this.fileList.push(obj)
          }
        } else {
          _this.$message.error(resp.msg)
        }
      });
    },
    deleteHandle (id) {
      const _this = this
      _this.$api.source.sourceDelete({sourceId: id}).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("删除成功")
          _this.getDataList()
        } else {
          _this.$message.error(resp.msg)
        }
      })
    },
    submitUploadAvator (file, fileList) {
      const _this = this
      let param = new FormData()
      param.append('file', file.raw)
      axios.post(_this.uploadUrl, param, _this.uploadConfig).then(resp => {
        if (resp && resp.code === 0) {
          _this.cover = resp.data.url
          _this.source.cover = resp.data.url
        }
      })
    },
    handlePreview (file) {},
    handleRemove (file, fileList) {
      // var spliceIndex = null
      // for (var index1 in this.fileList) {
      //   if (this.fileList[index1].url === file.url) {
      //     spliceIndex = index1
      //     break
      //   }
      // }
      // this.fileList.splice(spliceIndex, 1)
      this.fileList = fileList
      this.fileListSize = fileList.length
    },
    changeFile (file, fileList) {
      this.fileList = []
      this.fileList = fileList
      this.fileListSize = fileList.length
    },
    sizeChangeHandle (pageSize) {
      this.query.pageSize = pageSize
      this.query.pageIndex = 1
      this.getDataList()
    },
    currentChangeHandle (pageIndex) {
      this.query.pageIndex = pageIndex
      this.getDataList()
    },
    cancel () {
      this.visible = false
    },
    genDescJsonHandle () {
      this.source = {}
      this.jsonVisible = true
    },
    genJson () {
      this.$set(this.source, 'json', JSON.stringify(this.source))
    },
    oneUploadHandle () {
      this.dirName = ''
      this.uploadVisible = true
    },
    oneUpload () {
      const _this = this
      _this.loading = true
      _this.$api.source.oneUpload({prepareFilePath: _this.dirName}).then(resp => {
        if (resp && resp.code === 0) {
          _this.$message.success("上傳成功")
          this.uploadVisible = false
          _this.loading = false
        } else {
          _this.loading = false
          _this.$message.error(resp.msg)
        }
      })
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



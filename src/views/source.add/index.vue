<template>
  <div class="s_source_add">
    <el-form ref="form" :model="sourceInfo" label-width="80px">
      <el-form-item label="资源类型">
        <el-select v-model="sourceInfo.typeId" placeholder="请选择资源类型" size="small">
          <el-option v-for="(item, index) in sourceTypes" :key="index" :label="item.description" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源标签">
        <el-select
    v-model="sourceInfo.tagIds"
    multiple
    collapse-tags
    size="small"
    placeholder="请选择">
    <el-option
      v-for="item in tagList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
      </el-form-item>
      <el-form-item label="标题" maxlength="35">
        <el-input v-model="sourceInfo.title" size="small"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="sourceInfo.description" rows="8" maxlength="500"></el-input>
      </el-form-item>
       <el-form-item label="封面">
        <el-input v-model="sourceInfo.cover" size="small"></el-input>
      </el-form-item>
      <el-form-item label="下载地址">
        <el-input type="textarea" rows="3" v-model="downloadInfo" placeholder="格式: url|code;url|code"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <div ref='editArea'></div>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="save">保 存</el-button>
        <el-button size="small" @click="clear">清空富文本</el-button>
        <el-button size="small" @click="goBack">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "SourceAdd",
  props: ["catchData", "content"],
  data() {
    return {
      editor: null,
      sourceInfo: {
        typeId: "",
        title: "",
        description: "",
        cover: ""
      },
      sourceTypes: [],
      editorContent: null,
      sourceId: null,
      downloadInfo: "",
      tagList: []
    };
  },
  created() {
    this.getSourceTypes();
    this.getTagList();
    this.initData();
  },
  mounted() {
    this.initEdit();
  },
  methods: {
    save() {
      let source = Object.assign(this.sourceInfo, {
        content: this.editorContent
      });
      this.$api.source
        .save(
          Object.assign({ source: source }, { downloadInfo: this.downloadInfo })
        )
        .then(resp => {
          if (resp) {
            if (resp.code === 0) {
              this.$message.success("保存成功");
              this.$router.push({ path: "/source-list" });
            } else {
              this.$message.error(resp.msg);
            }
          }
        });
    },
    async getTagList() {
      const resp = await this.$api.tag.list({status: 1});
      if (resp) {
        if (resp.code === 0) {
          this.tagList = resp.data.list;
        } else {
          this.$message.error(resp.msg);
        }
      }
    },
    clear() {
      this.editor.txt.html("");
    },
    goBack() {
      this.$router.push({ path: "/source-list" });
    },
    getSourceTypes() {
      this.$api.source.types().then(resp => {
        if (resp) {
          if (resp.code === 0) {
            this.sourceTypes = resp.data.list;
          } else {
            this.$message.error(resp.msg);
          }
        }
      });
    },
    initData() {
      this.sourceId = this.$route.query.sourceId;
      if (this.sourceId) {
        this.getSourceDetail();
      }
    },
    getSourceDetail() {
      this.$api.source.info({ sourceId: this.sourceId }).then(resp => {
        if (resp) {
          if (resp.code === 0) {
            // this.sourceInfo.typeId = resp.data.source.typeId
            // this.sourceInfo.title = resp.data.source.title
            // this.sourceInfo.cover = resp.data.source.cover
            // this.sourceInfo.description = resp.data.source.description
            Object.assign(this.sourceInfo, resp.data.source);
            this.editor.txt.html(resp.data.source.content);
            this.downloadInfo = resp.data.downloadInfo;
          } else {
            this.$message.error(resp.msg);
          }
        }
      });
    },
    initEdit() {
      this.editor = new E(this.$refs.editArea);
      this.editor.customConfig.onchange = html => {
        this.editorContent = html;
        // console.log(this.editorContent)
        // this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
      };
      // this.editor.customConfig.uploadImgServer = "你的上传图片的接口";
      // this.editor.customConfig.uploadFileName = "你自定义的文件名";
      this.editor.customConfig.menus = [
        // 菜单配置
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ];
      // 下面是最重要的的方法
      this.editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function(xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          this.imgUrl = Object.values(result.data).toString();
        },
        fail: function(xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function(xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function(xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function(insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          let url = Object.values(result.data); // result.data就是服务器返回的图片名字和链接
          JSON.stringify(url); // 在这里转成JSON格式
          insertImg(url);
          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };

      this.editor.create(); // 创建富文本实例
      // if (!this.content) {
      //   this.editor.txt.html("请编辑内容1");
      // }
    }
  }
};
</script>

<style lang="scss">
</style>

<template>
  <div class="s_sourc_type">
    <el-form ref="form" :model="typeInfo" label-width="80px">
      <el-form-item label="类型描述">
        <el-input v-model="typeInfo.description" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="save">保 存</el-button>
        <el-button size="small" @click="goBack">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SourceType",
  data() {
    return {
      typeInfo: {
        description: ""
      }
    }
  },
  methods: {
    save() {
      if(!this.typeInfo.description){
        this.$message.error('描述不能为空')
      }
      this.$api.source.saveType({description: this.typeInfo.description}).then(resp => {
        if(resp){
          if(resp.code === 0){
            this.$message.success('保存成功')
            this.$router.push({path: '/source-add'})
          }else{
            this.$message.error(resp.msg)
          }
        }
      })
    },
    goBack() {
      this.$router.push({path: '/source-list'})
    }
  }
}
</script>

<style>

</style>

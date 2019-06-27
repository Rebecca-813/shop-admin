<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col  class="col" :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <el-form ref="form" :model="form" label-width="80px" label-position="top">
        <el-form-item label="用戶名" required>
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密碼" required>
          <el-input v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">登錄</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      formRules: {
        username: [
          { required: true, message: "请输入用戶名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密碼", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>
<style>
.row-bg {
  height: 100%;
  background-color: #2D434C;
}
.col {
  background-color: #FFF;
  border-radius: 10px;
  padding: 30px 10px;
  min-width: 400px;
}

</style>

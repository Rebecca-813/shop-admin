<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col class="col" :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <el-form ref="form" :model="form" label-width="80px" label-position="top" :rules="formRules">
        <el-form-item label="用戶名"  prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密碼" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">登錄</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
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
            min: 6,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios({
            url: "http://localhost:8888/api/private/v1/login",
            method: "post",
            data: this.form
          }).then(res => {
            console.log(res);
            if (res.data.meta.status === 200) {
              console.log(res.data.meta.msg);
            
              localStorage.setItem("token", res.data.data.token);
           
              this.$router.push("/home");
              
            }
          });
        }else{
          return false
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style>
.row-bg {
  height: 100%;
  background-color: #2d434c;
}
.col {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 10px;
  min-width: 400px;
}
</style>

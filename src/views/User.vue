<template>
<!-- 一個template裡面只能有一個 根目錄 -->
  <div>
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="郵箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="電話"></el-table-column>

      <el-table-column label="用戶狀態" width="180">
        <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-delete"></el-button>
        <el-button type="success" size="mini" plain icon="el-icon-check">角色分配</el-button>
      </el-table-column>
    </el-table>
    <!-- 分頁 -->
    <el-pagination background layout="prev, pager, next" :page-size="5" :total="30"></el-pagination>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: []
    };
  },

  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/users",
      type: "get",
      params: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(res => {
      console.log(res);
      this.userList = res.data.data.users;
    });
  }
};
</script>

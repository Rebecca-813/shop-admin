<template>
  <!-- 一個template裡面只能有一個 根目錄 -->
  <div>
    <!-- 麵包屑導航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
      <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框部分-->
    <el-row :span="20" :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="keyword"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="openAddUserDialog">添加用戶</el-button>
      </el-col>
    </el-row>

    <!-- 動態數據table表格 -->
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="郵箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="電話"></el-table-column>

      <!-- 用戶狀態部分 -->
      <el-table-column label="用戶狀態" width="180" v-slot="{row}">
        <el-switch
          active-color="#13ce66"
          inactive-color="#ff4949"
          v-model="row.mg_state"
          @change="toggleState(row)"
          :plain="true"
        ></el-switch>
      </el-table-column>

      <!-- 用戶操作部分 -->
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit"
            @click="openEditUserDialog(row.id)"
          ></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="deluser(row.id)">
            <!-- <el-button type="text"  size="mini"></el-button> -->
          </el-button>
          <el-button type="success" size="mini" plain icon="el-icon-check">角色分配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁部分 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="onPageChange"
    ></el-pagination>

    <!-- 添加用戶模態框 -->
    <el-dialog title="添加用戶" :visible.sync="isAddUserDialogShow">
      <el-form :model="addUserFromData" label-width="100px" :rules="addUserRules" ref="addUserFrom">
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="addUserFromData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input v-model="addUserFromData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="郵箱" prop="email">
          <el-input v-model="addUserFromData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="電話" prop="mobile">
          <el-input v-model="addUserFromData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改模態框 -->
    <el-dialog title="修改用戶信息" :visible.sync="isEditUserDialogShow">
      <el-form
        :model="editUserFromData"
        label-width="100px"
        :rules="editUserRules"
        ref="editUserFrom"
      >
        <el-form-item label="用戶名" prop="username">
          <el-input v-text="editUserFromData.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="郵箱" prop="email">
          <el-input v-model="editUserFromData.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="電話" prop="mobile">
          <el-input v-model="editUserFromData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template> 

<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: [],
      //設置默認值
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keyword: "",
      isAddUserDialogShow: false,
      isEditUserDialogShow: false,
      addUserFromData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密碼",
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      },
      editUserFromData: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      }
    };
  },

  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      axios({
        url: "http://localhost:8888/api/private/v1/users",
        method: "get",
        params: {
          query: this.keyword,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        // console.log(res);
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },

    onPageChange(page) {
      // console.log("頁面發生改幾了");
      this.currentpage = page;
      this.getUserList();
    },
    search() {
      console.log(this.keyword);
      //此時需要從後台那最新的數據，並且通過關鍵字進行返回
      this.getUserList();
    },
    //切換用戶狀態，，需要發送ajax，請求後台的shuju
    async toggleState(user) {
      console.log(user);
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        method: "put",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      console.log("fasong ");
      if (res.data.meta.status == 200) {
        console.log("hahah");
        this.$message({
          type: "success",
          message: res.data.meta.msg
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg
        });
      }
    },
    // // 點擊刪除事件（沒有確認刪除功能）
    // async deluser(id) {
    //   console.log(id);
    //   let res = await axios({
    //   // //此處發送ajax是為了獲取到接口文檔
    //     url: `http://localhost:8888/api/private/v1/users/${id}`,
    //     method: "delete",
    //     headers: {
    //       Authorization: localStorage.getItem("token")
    //     }
    //   });
    //   console.log(res);
    //   if (res.data.meta.status == 200) {
    //     this.$message({
    //       type: "success",
    //       message: res.data.meta.msg
    //     });
    //   }
    //   // //此處調用ajax是為了對請求刪除後的數據，在狀態碼為200的情況下執行
    //   this.getUserList()
    // }

    // // 點擊刪除事件（確認刪除功能）
    async deluser(id) {
      try {
        await this.$confirm("此操作将永久删除该用戶, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${id}`,
          method: "delete",
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });

        if (res.data.meta.status == 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg
          });
          this.getUserList();
        }
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },
    openAddUserDialog() {
      this.isAddUserDialogShow = true;
    },
    // async addUser() {
    //   console.log("haah");
    //   let res = await axios({
    //     url: "http://localhost:8888/api/private/v1/users",
    //     method: "post",
    //     data: this.addUserFromData,
    //     headers: {
    //       Authorization: localStorage.getItem("token")
    //     }
    //   });
    //   console.log(res);
    //   if (res.data.meta.status == 201) {
    //     this.$message({
    //       type: "success",
    //       message: res.data.meta.msg
    //     });
    //     this.getUserList();
    //   }
    // }

    //添加用戶
    async addUser() {
      //先進行表單校驗
      //表單校驗成功之後，發送ajax請求
      try {
        let valid = await this.$refs.addUserFrom.validate();
        console.log("效驗成功了");
        let res = await axios({
          url: "http://localhost:8888/api/private/v1/users",
          method: "post",
          data: this.addUserFromData,
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        if (res.data.meta.status == 201) {
          this.$message({
            type: "success",
            message: res.data.meta.msg
          });
          this.getUserList();
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg
          });
        }
      } catch (err) {}
      this.currentpage = 1;
      this.isAddUserDialogShow = false;
    },

    // 修改用戶功能---打開模態框
    async openEditUserDialog(id) {
      this.isEditUserDialogShow = true;
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "put",
        data: this.editUserFromData,
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      // console.log(res);
      this.editUserFromData = res.data.data;
    },

    //修改之後的信息縣級確定提交
    async editUser(id) {
      try {
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${this.editUserFromData.id}`,
          method: "put",
          data: {
            email: this.editUserFromData.email,
            mobile: this.editUserFromData.mobile
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        console.log(res)
        if(res.data.meta.status==200){
          this.getUserList()
          this.isEditUserDialogShow=false
        }
      } catch (err) {}
    }
  }
};
</script>

<style>
.el-breadcrumb.breadcrumb {
  font-size: 16px;
  height: 50px;
  line-height: 50px;
  background-color: #d4dae0;
}
</style>


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
      isAssginUserDialogShow: false,
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
      },
      assginRoleData: {
        username: "",
        rid: "",
      },
      rolesList: ""
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
      // console.log(this.keyword);
      //此時需要從後台那最新的數據，並且通過關鍵字進行返回
      this.currentpage = 1
      this.getUserList();
    },
    //切換用戶狀態，，需要發送ajax，請求後台的shuju
    async toggleState(user) {
      // console.log(user);
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        method: "put",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      // console.log("fasong ");
      if (res.data.meta.status == 200) {
        // console.log("hahah");
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
        // console.log("效驗成功了");
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
      } catch (err) { }
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
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.getUserList();
          this.isEditUserDialogShow = false;
        }
      } catch (err) { }
    },

    //角色分配
    //1.點擊分配角色按鈕
    async assgin(row) {
      this.isAssginUserDialogShow = true
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${row.id}`,
        method: "get",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
      // console.log(res)
      this.assginRoleData = res.data.data

      let roleResult = await axios({
        url: "http://localhost:8888/api/private/v1/roles",
        method: "get",
        headers: {
          Authorization: localStorage.getItem("token")
        },
      })
      // console.log(roleResult)
      this.rolesList = roleResult.data.data
    },

    //1.2點擊確定按鈕
    async assginUser(){
      let res =await axios({
        url:`http://localhost:8888/api/private/v1/users/${this.assginRoleData.id}/role`,
        method:"put",
        headers: {
          Authorization: localStorage.getItem("token")
        },
        data:{
          rid:this.assginRoleData.rid
        }
      })
      // console.log(res)
      this.$message({
        type:"success",
        message:res.data.meta.msg
      })
      this.isAssginUserDialogShow=false
    }
  }
};
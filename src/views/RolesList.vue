<template>
  <div>
    <!-- 麵包屑導航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 權限列表 -->

    <el-table ref="singleTable" :data="rolesList" highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row v-for="level1 in row.children" :key="level1.id" class="level1" type="flex">
            <!-- 第一列 -->
            <el-col :span="6">
              <!-- tag自帶close事件 -->
              <el-tag closable @close="del(row,level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 第二列 -->
            <el-col>
              <el-row type="flex" class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="6">
                  <el-tag closable type="success" @close="del(row, level2.id)">{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
              <!-- 第三列 -->
                <el-col>
                  <el-tag
                    closable
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    type="warning"
                    @close="(row, level3.id)"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="roleName" label="角色管理" width="120"></el-table-column>
      <el-table-column property="roleDesc" label="描述" width="120"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete">
            <!-- <el-button type="text"  size="mini"></el-button> -->
          </el-button>
          <el-button type="success" size="mini" plain icon="el-icon-check" @click="assign(row)">分配權限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色列表模態框 -->
    <el-dialog title="角色授權" :visible.sync="isAssignShow">
      <el-form label-width="100px">
        <el-tree
          :data="dataList"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-checked-keys="checkedList"
          :props="defaultProps"
          ref="assginTree"
        ></el-tree>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAssignShow=false">取 消</el-button>
        <el-button type="primary" @click="beSureToUpDate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      roleName: "",
      roleDesc: "",
      rolesList: [],
      isAssignShow: false,
      dataList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      //創建一個空的數組，用於存儲獲取到的三個數組的數據
      checkedList: [],
      currentEditRoleId: -1
    };
  },
  async created() {
    // let res = await axios({
    //   url: `http://localhost:8888/api/private/v1/roles`,
    //   method: "get",
    //   headers: {
    //     Authorization: localStorage.getItem("token")
    //   }
    // });

    // this.rolesList = res.data.data;
    this.getList();
  },
  methods: {
    //分裝頁面剛加載的ajax請求
    async getList() {
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/roles`,
        method: "get",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });

      this.rolesList = res.data.data;
    },

    //第一步：模態框打開並且綁定每個角色應有的權限
    async assign(row) {
      this.currentEditRoleId = row.id;
      this.isAssignShow = true;
      //請求模態框裡角色授權的數據
      let res = await axios({
        url: "http://localhost:8888/api/private/v1/rights/tree",
        method: "get",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      //   console.log(res);
      //   綁定信息
      this.dataList = res.data.data;

      //獲取三個數組的數據
      // let level1Ids = [];
      // let level2Ids = [];
      let level3Ids = [];
      row.children.forEach(level1 => {
        // level1Ids.push(level1.id);
        level1.children.forEach(level2 => {
          // level2Ids.push(level2.id);
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id);
          });
        });
      });
      //把獲取到的三個數組的數組合並到剛擦創建的空數組中用於展示
      // this.checkedList = [...level1Ids, ...level2Ids, ...level3Ids];
      this.checkedList = [...level3Ids];
      //   console.log(this.checkedList);
    },

    //第二步：修改完權限之後，點擊確定按鈕，提交修改之後的數據
    async beSureToUpDate() {
      //獲取tree組件中所有被勾選節點的id，綁定ref
      //將id拼接成字符串之後，發送ajax請求，修改角色權限
      let ids = [
        ...this.$refs.assginTree.getCheckedKeys(),
        ...this.$refs.assginTree.getHalfCheckedKeys()
      ].join(",");
      console.log(ids);
      console.log(this.currentEditRoleId);
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/roles/${this.currentEditRoleId}/rights`,
        method: "post",
        data: {
          rids: ids
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      console.log(res);
      //提示用戶登錄成功
      this.$message({
        type: "success",
        message: res.data.meta.msg
      });
      //更新之後，重新獲取數據
      this.getList();
      //關閉模態框
      this.isAssignShow = false;
    },

    //第三步：點擊二級下拉菜單中的刪除，進行刪除
    async del(row, id) {
      // console.log(row,id)
      //把row裡面的children中所有的id拼成一個數組，然後在把數組中對應的id進行刪除，在拼接成字符串ids，進而發送ajax

      //3.1步：獲取三個數組的數據
      let level1Ids = [];
      let level2Ids = [];
      let level3Ids = [];
      row.children.forEach(level1 => {
        level1Ids.push(level1.id);
        level1.children.forEach(level2 => {
          level2Ids.push(level2.id);
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id);
          });
        });
      });
      //3.2把獲取到的三個數組的數組合並到剛擦創建的空數組中用於展示（拼接成一個新數組）
      let result = [...level1Ids, ...level2Ids, ...level3Ids];
      //3.3數組中對應的id進行刪除
      let ids = result.filter(v => v != id).join();
      //3.4發送ajax請求
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/roles/${row.id}/rights`,
        method: "post",
        data: {
          rids: ids
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
      console.log(res)
      this.$message({
          type:"success",
          message:res.data.meta.msg
      })
      this.getList()
    }
  }
};
</script>

<style>
.level1 {
  border-bottom: 1px dashed #ccc;
  padding: 10px 0;
}
.level1:last-child {
  border-bottom: none;
}
.level2 {
  margin: 10px 0;
}
</style>



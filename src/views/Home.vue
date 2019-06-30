<template>
  <el-container class="home-container">
    <!-- 頭部 -->
    <el-header class="home-header">
      <el-row type="flex" align="middle">
        <!-- 頭部左邊部分 -->
        <el-col :span="6">
          <img src="../assets/imgs/logo.png" alt>
        </el-col>
        <!-- 頭部中間部分 -->
        <el-col>
          <h1>電商後台管理系統</h1>
        </el-col>
        <!-- 頭部右邊部分 -->
        <el-col :span="6">
          <div>
            歡迎上海前端31期星耀會員
            <a href="javaScript:;" class="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <!-- 頭部下面的左邊部分 -->
    <el-container>
      <el-aside width="200px" class="home-aside">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用戶管理</span>
            </template>
            <el-menu-item index="/user">
              <i class="el-icon-menu"></i>
              <span>用戶管理</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>權限管理</span>
            </template>

            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span>權限列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>
              <span>分類參數</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>
              <span>商品分類</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>訂單管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-menu"></i>
              <span>訂單列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>數據統計</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>
              <span>數據列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主內容區 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.home-container {
  height: 100%;
  background-color: #eaeef1;
}
.home-header {
  background-color: #b3c1cd;
}
.home-container .home-header {
  padding: 0;
}
.home-container .home-header img {
  width: 200px;
}
.home-header h1 {
  margin: 0;
  text-align: center;
  color: #fff;
  font-size: 28px;
  font-weight: bolder;
}
.home-header div {
  min-width: 235px;
  font-weight: bold;
}
.home-header .logout {
  color: #daa520;
}
.el-menu-vertical-demo{
  height: 100%;
}
</style>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>


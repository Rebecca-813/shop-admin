<template>
  <div>
    <!-- 麵包屑導航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分類</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加商品按鈕 -->
    <el-button type="success" plain @click="$router.push('/addCategory')">添加商品</el-button>

    <!-- 物品列表 -->
    <el-table ref="singleTable" :data=" goodsDataList" style="width: 100%" type="flex">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名稱"></el-table-column>
      <el-table-column property="goods_price" label="商品價格"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column property="add_time" label="創建時間"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁 -->
    <!--page-size:每一頁顯示的數量 ,current-page表示當前的頁數，有個參數是page -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="onPageChange"
    ></el-pagination>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      goodsDataList: [],
      total: 0,
      pagenum: 1,
      pagesize: 5
    };
  },
  created() {
    this.getDataList();
    // axios({
    //   url:"http://localhost:8888/api/private/v1/goods",
    //   method:"get",
    //   headers:{
    //     Authorization:localStorage.getItem("token")
    //   },
    //   params:{
    //     Pnp:"",
    //     pagenum:this.pagenum,
    //     pagesize:this.pagesize
    //   }
    // }).then(res=>{
    //   console.log(res)
    //   this.goodsDataList=res.data.data.goods
    //   this.total=res.data.data.total
    // })
  },
  methods: {
    getDataList() {
      axios({
        url: "http://localhost:8888/api/private/v1/goods",
        method: "get",
        headers: {
          Authorization: localStorage.getItem("token")
        },
        params: {
          Pnp: "",
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        console.log(res);
        this.goodsDataList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    onPageChange(page) {
      this.pagenum = page;
      this.getDataList();
    }
  }
};
</script>
<style>
.el-breadcrumb{
  margin-bottom: 20px;
}
</style>










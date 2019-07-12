<template>
  <div>
    <!-- 麵包屑導航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>權限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 權限表格部分 -->
    <el-table
      ref="singleTable"
      :data="tableDataList"
     
      style="width: 100%"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="authName" label="權限名稱" width="120"></el-table-column>
      <el-table-column property="path" label="路徑" width="120"></el-table-column>
      <el-table-column label="層級">
          <template v-slot="{row}">
              <span>{{row.level | levelfilter}}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data() {
    return {
      tableDataList: [],

    };

  },
  filters:{
      levelfilter(value){
          switch(value){
              case "0":
                  return "一級";
                case "1":
                    return "二級";
                case "2":
                    return "三級";
          }
      }
  },
  async created(){
      let res =await axios({
          url:"http://localhost:8888/api/private/v1/rights/list",
          method:"get",
          headers:{
              Authorization:localStorage.getItem("token")
          }
      })
      console.log(res)
      this.tableDataList=res.data.data
  }

  
};
</script>



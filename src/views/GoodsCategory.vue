<template>
  <div>
    <!-- 麵包屑導航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="openCategoryDiaLog">添加分類</el-button>

    <!-- 物品列表 -->
    <el-table
      ref="singleTable"
      :data=" goodsCategoryDataList"
      props="cat_name"
      style="width: 100%"
      type="flex"
      levelKey
      indentSize="20"
    >
      <el-table-tree-column
        file-icon="el-icon-tickets"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分類名稱"
        width="220"
        treeKey="cat_id"
        parentKey="cat_pid"
        :indent-size="20"
        levelKey="cat_level"
      ></el-table-tree-column>

      <el-table-column property="cat_deleted'" label="是否有效">
        <template v-slot="{row}">{{row.cat_deleted?"否":"是"}}</template>
      </el-table-column>
      <el-table-column property="cat_level" label="層級"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="onPageChange"
    ></el-pagination>

    <!-- 添加分類模態框 -->
    <el-dialog title="添加分类" :visible.sync=" isOpenCategoryDialogShow">
      <el-form label-width="100px" ref="addFromDate" :model="addFromDate">
        <el-form-item label="分类名称">
          <el-input v-model="addFromDate.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            v-model="addFromDate.parentArr"
            :options=" CategoryList"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click=" isOpenCategoryDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="beSureToAddCategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      goodsCategoryDataList: [],
      total: 0,
      pagenum: 1,
      pagesize: 5,
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      },
      isOpenCategoryDialogShow: false,
      addFromDate: {
        cat_name: "",
        parentArr: []
      },
      CategoryList: []
    };
  },
  created() {
    this.getCategoryList();
    // axios({
    //   url: "http://localhost:8888/api/private/v1/categories",
    //   method: "get",
    //   params: {
    //     type: 3,
    //     pagenum: this.pagenum,
    //     pagesize: this.pagesize
    //   },
    //   headers: {
    //     Authorization: localStorage.getItem("token")
    //   }
    // }).then(res => {
    //   console.log(res);
    //   this.goodsCategoryDataList = res.data.data.result;
    //   this.total = res.data.data.total;
    // });
  },
  methods: {
    getCategoryList() {
      axios({
        url: "http://localhost:8888/api/private/v1/categories",
        method: "get",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        // console.log(res);
        this.goodsCategoryDataList = res.data.data.result;
        this.total = res.data.data.total;
      });
    },
    onPageChange(page) {
      this.pagenum = page;
      this.getCategoryList();
    },

    //點擊添加按鈕，打開模態框
    async openCategoryDiaLog() {
      //獲取分類列表數據,猶豫添加分類的時候，最多要添加的是3分類，所以請求回來的的數據，只需要前兩級即可，不需要第三級
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/categories`,
        params: {
          type: 2
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      // console.log(res);
      this.CategoryList = res.data.data;
      //（此時數據已經請求回來了，但是沒有數字和文字的展示在頁面上，需要進項屬性綁定，：props）
      this.isOpenCategoryDialogShow = true;
    },
    //添加模態框的點擊確定事件
     beSureToAddCategory() {
      let cat_name = this.addFromDate.cat_name;
      let cat_level = this.addFromDate.parentArr.length;
      let cat_pid = this.addFromDate.  parentArr.pop();
    axios({
        url: `http://localhost:8888/api/private/v1/categories`,
        method: "post",
        data: {
          cat_name,
          cat_level,
          cat_pid
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res=>{
        // console.log(res)
        if(res.data.meta.status==201){
          this.$message({
            type:"success",
            message:res.data.meta.msg
          })
       this. isOpenCategoryDialogShow= false

        }
      })
    }
  }
};
</script>


<style>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>



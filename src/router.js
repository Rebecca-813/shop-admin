import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import User from './views/User/User.vue';
import RolesList from "./views/RolesList.vue";
import Rights from "./views/Rights.vue";
import Goods from "./views/Goods.vue";
import GoodsCategory from "./views/GoodsCategory.vue";
import AddCategory from "./views/AddCategory.vue";


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path:"/users",
          component:User
        },
        {
          path: "/roles",
          component: RolesList
        },
        {
          path: "/rights",
          component:Rights
        },
        {
          path: "/goods",
          component:Goods
        },
        {
          path: "/addCategory",
          component:AddCategory
        },
        {
          path: "/categories",
          component:GoodsCategory
        },
      ]
    },

   
  ]
});

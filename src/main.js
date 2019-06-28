import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.css';


Vue.use(ElementUI);

Vue.config.productionTip = false;
//註冊一個導航守衛
router.beforeEach((to,from,next)=>{
  console.log(to,from)
  console.log("導航守衛工作啦")
  if(to.path==='/login'){
    next()
    return
  }

  if(localStorage.getItem("token")){
    next()
  }else {
    router.push("/login")
  }

})

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

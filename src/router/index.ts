import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

/**
 * createWebHashHistory  结尾是带#号的
 * createWebHistory   是不带#号的且
 *
 */

const router = createRouter({
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      //路由到的地址(自定义)
      component: () => import("./../views/Home/index.vue"),
      //引入组件，组件Home.vue所在路径
      //Home.vue是需要路由的vue组件
      name: "Home",
      //组件名称
    },
  ],
  history: createWebHashHistory(),
});
export default router;

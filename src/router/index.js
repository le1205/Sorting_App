import { ifNotAuthenticated, ifAuthenticated } from "./helpers";

import Vue from "vue";
import Router from "vue-router";
//import Home from '../components/Home.vue'
import Login from "../components/Login.vue";
import LoginSortingShop from "../components/LoginSortingShop.vue";
import Signup from "../components/Signup.vue";
import Profile from "../components/Profile.vue";
import Dashboard from "../components/Dashboard.vue";
import Orders from "../components/Orders.vue";
import OrderEditor from "../components/OrderEditor.vue";
import Carts from "../components/Carts.vue";
import CartEditor from "../components/CartEditor";
import Settings from "../components/Settings.vue";
import Sorting from "../components/Sorting.vue";
import Users from "../components/Users.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },

    {
      path: "/sorting_shop",
      name: "sorting_shop",
      component: Sorting,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/login_sh",
      name: "login_sh",
      component: LoginSortingShop,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: "/logout",
      name: "logout",
      component: Login,
      beforeEnter: ifAuthenticated,
    },

    {
      path: "/signup",
      name: "signup",
      component: Signup,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      beforeEnter: ifAuthenticated,
    },
    /*
        {
            path: '/home',
            name: 'home',
            component: Home,
            beforeEnter: ifAuthenticated
        },
*/
    {
      path: "/orders",
      name: "orders",
      component: Orders,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/order/:action/:id?",
      name: "order-editor",
      component: OrderEditor,
      props: true,
      beforeEnter: ifAuthenticated,
    },

    {
      path: "/carts",
      name: "carts",
      component: Carts,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/cart/:action/:id?",
      name: "cart-editor",
      component: CartEditor,
      props: true,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/sorting",
      name: "sorting",
      component: Sorting,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/users",
      name: "users",
      component: Users,
      beforeEnter: ifAuthenticated,
    },

  ],
  mode: "history",
});

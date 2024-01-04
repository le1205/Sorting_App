"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = require("./helpers");

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Login = _interopRequireDefault(require("../components/Login.vue"));

var _LoginSortingShop = _interopRequireDefault(require("../components/LoginSortingShop.vue"));

var _Signup = _interopRequireDefault(require("../components/Signup.vue"));

var _Profile = _interopRequireDefault(require("../components/Profile.vue"));

var _Dashboard = _interopRequireDefault(require("../components/Dashboard.vue"));

var _Orders = _interopRequireDefault(require("../components/Orders.vue"));

var _OrderEditor = _interopRequireDefault(require("../components/OrderEditor.vue"));

var _Carts = _interopRequireDefault(require("../components/Carts.vue"));

var _CartEditor = _interopRequireDefault(require("../components/CartEditor"));

var _Settings = _interopRequireDefault(require("../components/Settings.vue"));

var _Sorting = _interopRequireDefault(require("../components/Sorting.vue"));

var _Users = _interopRequireDefault(require("../components/Users.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import Home from '../components/Home.vue'
_vue["default"].use(_vueRouter["default"]);

var _default = new _vueRouter["default"]({
  routes: [{
    path: "/",
    redirect: "/login"
  }, {
    path: "/sorting_shop",
    name: "sorting_shop",
    component: _Sorting["default"],
    beforeEnter: _helpers.ifAuthenticated
  }, {
    path: "/login_sh",
    name: "login_sh",
    component: _LoginSortingShop["default"],
    beforeEnter: _helpers.ifNotAuthenticated
  }, {
    path: "/login",
    name: "login",
    component: _Login["default"],
    beforeEnter: _helpers.ifNotAuthenticated
  }, {
    path: "/logout",
    name: "logout",
    component: _Login["default"],
    beforeEnter: _helpers.ifAuthenticated
  }, {
    path: "/signup",
    name: "signup",
    component: _Signup["default"],
    beforeEnter: _helpers.ifNotAuthenticated
  }, {
    path: "/dashboard",
    name: "dashboard",
    component: _Dashboard["default"],
    beforeEnter: _helpers.ifAuthenticated
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
    component: _Orders["default"],
    beforeEnter: _helpers.ifAuthenticated
  }, {
    path: "/order/:action/:id?",
    name: "order-editor",
    component: _OrderEditor["default"],
    props: true,
    beforeEnter: _helpers.ifAuthenticated
  }, {
    path: "/carts",
    name: "carts",
    component: _Carts["default"],
    beforeEnter: _helpers.ifAuthenticated
  }, {
    path: "/cart/:action/:id?",
    name: "cart-editor",
    component: _CartEditor["default"],
    props: true,
    beforeEnter: _helpers.ifAuthenticated
  }, {
    path: "/sorting",
    name: "sorting",
    component: _Sorting["default"],
    beforeEnter: _helpers.ifAuthenticated
  }, {
    path: "/settings",
    name: "settings",
    component: _Settings["default"],
    beforeEnter: _helpers.ifAuthenticated
  }, {
    path: "/profile",
    name: "profile",
    component: _Profile["default"],
    beforeEnter: _helpers.ifAuthenticated
  }, {
    path: "/users",
    name: "users",
    component: _Users["default"],
    beforeEnter: _helpers.ifAuthenticated
  }],
  mode: "history"
});

exports["default"] = _default;
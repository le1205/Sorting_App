import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import auth from "./modules/auth";
import orders from "./modules/orders";
import parts from "./modules/parts";
import carts from "./modules/carts";
import bins from "./modules/bins";
import storage from "./modules/cache";
import users from "./modules/users";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    orders,
    parts,
    carts,
    bins,
    storage,
    users
  },
  plugins: [new VuexPersistence().plugin],
});

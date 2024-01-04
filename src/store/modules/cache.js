import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../../firebase";

Vue.use(Vuex);

const state = {
  data: {
    carts: [],
    bins:[],
    parts: []
  },
};

const getters = {
getData: (state) => state.data
};

const actions = {

/*
  async getParts({state}){

    //console.log(`cache.getParts: ${state.data.parts.length}`)

    return state.data.parts

  },
  */
};

const mutations = {
  SET_DATA(state, payload) {
    
    state.data = payload;
  },
/*
  CREATE_CART(state, payload) {
    state.data.push(payload);
  },
  UPDATE_CART(state, payload) {
    let cart = state.data.find((item) => item.id === payload.id);

    Object.assign(cart, payload);
  },
  DELETE_CART(state, payload) {
    state.data = state.data.filter((item) => item.id !== payload.id);

  },
*/
  REQUEST_STARTED: (state) => {

    state.isLoading = true;
    state.status = "Started";
  },
  REQUEST_COMPLETED: (state) => {

    state.isLoading = false;
    state.status = "Completed";
  },
  REQUEST_ERROR: (state) => {
    state.isLoading = false;
    state.status = "Error";
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

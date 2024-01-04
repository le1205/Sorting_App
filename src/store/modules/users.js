import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../../firebase";
import * as constants from "@/shared/constants";

Vue.use(Vuex);

const state = {
  data: [],
};

const getters = {};

const actions = {
  async getUser({ commit }, payload) {
    /*
    //console.log("getUser");

    commit("REQUEST_STARTED");

    commit("REQUEST_COMPLETED");

    */
  },

  async getUsers({ commit, dispatch }) {
    
    commit("REQUEST_STARTED");

    var usersList = fb.functions.httpsCallable('usersList');

    const response = await usersList()

    commit("REQUEST_COMPLETED");

    return response;
  },

  async createUser({ commit, dispatch }, payload) {
    commit("REQUEST_STARTED");

    var createUser = fb.functions.httpsCallable('createUser');

    const response = await createUser(payload)

    commit("REQUEST_COMPLETED");
  },
  async updateUser({ commit, dispatch }, payload) {

    commit("REQUEST_STARTED");

    var updateUser = fb.functions.httpsCallable('updateUser');

    const response = await updateUser(payload)

    commit("REQUEST_COMPLETED");
  },
  async deleteUser({ commit, dispatch }, payload) {

    commit("REQUEST_STARTED");

    var deleteUser = fb.functions.httpsCallable('deleteUser');

    const response = await deleteUser(payload)


    commit("REQUEST_COMPLETED");
  },
};

const mutations = {
  SET_USER(state, payload) {
    state.data = payload;
  },

  CREATE_USER(state, payload) {
    state.data.push(payload);
  },
  UPDATE_USER(state, payload) {

    let user = state.data.find((item) => item.id === payload.id);

    Object.assign(user, payload);
  },
  DELETE_USER(state, payload) {

    state.data = state.data.filter((item) => item.id !== payload.id);

  },
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

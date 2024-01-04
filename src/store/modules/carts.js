import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../../firebase";

Vue.use(Vuex);

const state = {
  data: [],
};

const getters = {
getCartsDataFromCache: (state) => state.data
};

const actions = {
  async getCartsWithBinsAndParts({commit,dispatch}){

    //console.log('carts.getCartsWithBinsAndParts')

    commit("REQUEST_STARTED");

    let carts = await dispatch('getCarts');

    let parts = await dispatch('parts/getParts',{}, { root: true });

    let binsCount =0

    for (let cart of carts) {

      cart.bins = await dispatch('bins/getCartBins',{cartId: cart.id}, { root: true });

      binsCount+=cart.bins.length

      for (let bin of cart.bins) {

        //bin.parts = await dispatch('parts/getBinParts',{_bin_uid: bin.id}, { root: true });
        bin.parts = parts.filter(p => p._bin_uid === bin.id)

      }

    }

    commit("REQUEST_COMPLETED");

    //console.log(`carts: ${carts.length}, parts: ${parts.length}, cart.bins: ${binsCount}`)

    commit("SET_DATA", carts);

    return carts    
  },  
  async getCart({commit}, payload) {

    //console.log('carts.getCart')

    commit("REQUEST_STARTED");

    const cart = await fb.cartsCollection.doc(payload.id).get();

    commit("REQUEST_COMPLETED");

    return cart.data();
  },
  async getCarts({commit}) {

    //console.log('carts.getCarts')

    commit("REQUEST_STARTED");

    let response = await fb.cartsCollection.get();

    commit("REQUEST_COMPLETED");

    if (response.empty) {
      //console.log("No data available.");
      return;
    }

    let carts = [];

    response.forEach((doc) => carts.push(doc.data()));

    return carts;
  },

  async createCart({ commit,dispatch }, payload) {

    commit("REQUEST_STARTED");

    payload.data._created = fb.fs.Timestamp.now();

    await fb.cartsCollection.doc(payload.data.id).set(payload.data);

    //commit("CREATE_CART", payload.data);
    
      if (payload.bins) {
        payload.bins.forEach((item) => {
          dispatch("bins/createBin", item, { root: true });
        });
      }
    commit("REQUEST_COMPLETED");
  },
  
  async updateCartAndContent({ commit,dispatch }, payload) {

    commit("REQUEST_STARTED");

    payload.data._updated = fb.fs.Timestamp.now();

    await fb.cartsCollection.doc(payload.data.id).set(payload.data);
    
    if (payload.parts) {

      await dispatch("parts/bulkUpdate", payload.parts, {root: true,});

    }

    if (payload.bins) {

      await dispatch("bins/bulkUpdate", payload.bins, {root: true,});

    }

    commit("REQUEST_COMPLETED");

    //update cache
    //commit("SET_DATA", payload)

},
  async updateCart({ commit,dispatch }, payload) {

      commit("REQUEST_STARTED");

      payload.data._updated = fb.fs.Timestamp.now();

      await fb.cartsCollection.doc(payload.data.id).set(payload.data);

      if (payload.bins) {

        payload.bins.filter((b) => b.deleted).forEach((item) => {
            dispatch("bins/deleteBin", item, {
              root: true,
            });
          });

        payload.bins.filter((b) => b.created).forEach((item) => {

          delete item.created
          delete item.deleted          

            dispatch("bins/createBin", item, {
              root: true,
            });
          });

        payload.bins.filter((b) => b.updated).forEach((item) => {

          delete item.updated
          delete item.deleted

            dispatch("bins/updateBin", item, {
              root: true,
            });
          });
      }
 
      commit("REQUEST_COMPLETED");

  },
  async deleteCart({ commit, dispatch }, payload) {

    commit("REQUEST_STARTED");

    await fb.cartsCollection.doc(payload.id).delete()


    await dispatch("bins/deleteCartBins", payload.id, { root: true });

    
    commit("REQUEST_COMPLETED");
  },
};

const mutations = {
  SET_DATA(state, payload) {
    
    state.data = payload;
  },

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

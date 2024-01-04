import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../../firebase";

Vue.use(Vuex);

const state = {
  isLoading: false,
  data: [],
};

const getters = {
  //getBinsAll: (state) => state.data,
};

const actions = {
  async getBin({ commit }, payload) {
    //console.log("bins.getBin");

    commit("REQUEST_STARTED");

    const bin = await fb.binsCollection.doc(payload.id).get();

    commit("REQUEST_COMPLETED");

    return bin.data();
  },

  async getCartBins({ commit, state }, payload) {
    //console.log("carts.getCartBins");

    let bins = [];

    //try to use cache
    bins = state.data.filter((p) => p.cartId === payload.cartId);

    if (bins.length > 0) {
      //bins = state.data.filter( p => p.cartId === payload.cartId)

      if (bins.length > 0) //console.log(`getCartBins.state: ${bins.length}`);

      return bins;
    }

    //othwerwise request fb
    commit("REQUEST_STARTED");

    let response = await fb.binsCollection
      .where("cartId", "==", payload.cartId)
      .orderBy("order")
      .get();

    commit("REQUEST_COMPLETED");

    if (response.empty) {
      //console.log("No data available");
      return [];
    }

    response.forEach((doc) => bins.push(doc.data()));

    commit("SET_DATA", bins);

    //console.log(`getCartBins.firestore: ${bins.length}`);

    return bins;
  },

  async createBin({ commit }, payload) {
    commit("REQUEST_STARTED");

    //convert to number
    //payload.order = +payload.order

    payload._created = fb.fs.Timestamp.now();

    await fb.binsCollection.doc(payload.id).set(payload);

    commit("REQUEST_COMPLETED");
  },

  async bulkUpdate({ commit }, bins) {

    //console.log('bins.bulkUpdate')

    //create/update/delete in cache
    commit("SET_DATA", bins);

    //update firestore
    commit("REQUEST_STARTED");

    const batch = fb.db.batch();

    bins
      .filter((b) => b.created)
      .forEach((item) => {
        delete item.created;
        delete item.deleted;

        const bins = fb.binsCollection.doc(item.id);
        item._created = fb.fs.Timestamp.now();
        batch.set(bins, item);
      });

    bins
      .filter((b) => b.updated)
      .forEach((item) => {
        const bin = fb.binsCollection.doc(item.id);

        delete item.updated;
        delete item.deleted;

        batch.update(bin, item);
      });

    bins
      .filter((b) => b.deleted)
      .forEach((item) => {
        const bin = fb.binsCollection.doc(item.id);
        batch.delete(bin);
      });

    // Commit the batch
    await batch.commit();

    commit("REQUEST_COMPLETED");


  },

  async updateBin({ commit }, payload) {
    //    //console.log('updateBin',payload)

    commit("REQUEST_STARTED");

    //convert to number
    payload.order = +payload.order;

    payload._updated = fb.fs.Timestamp.now();

    await fb.binsCollection.doc(payload.id).set(payload);

    commit("REQUEST_COMPLETED");
  },
  async deleteBin({ commit }, payload) {
    commit("REQUEST_STARTED");

    await fb.binsCollection.doc(payload.id).delete();

    commit("REQUEST_COMPLETED");
  },
  async deleteCartBins({ commit }, cartId) {
    commit("REQUEST_STARTED");

    let response = await fb.binsCollection.where("cartId", "==", cartId).get();

    if (response.empty) {
      //console.log("no data");
      return true;
    }

    response.forEach(async (doc) => {
      let bin = doc.data();

      await fb.binsCollection.doc(bin.id).delete();
    });

    commit("REQUEST_COMPLETED");
  },
};

const mutations = {
  SET_DATA(state, payload) {

    const old = state.data.length;

    //remove existing in payload items
    state.data = state.data.filter(
      (bin) => !payload.find((p) => p.id === bin.id)
    );

    //merge all except deleted
    state.data = [...state.data, ...payload.filter( bin => !bin.deleted)];

    //console.log(`bins.SET_DATA ${old}/${state.data.length}`);
  },
  /*
  CREATE_BIN(state, payload) {

//console.object('CREATE_BIN',payload)

    let bin =     {
      id: payload.id,
      cartId: payload.cartId,
      width: payload.width,
      height: payload.height,
      length: payload.length,
      description: payload.description,
      deleted: false
    }

    state.data.push(bin);
  },
  UPDATE_BIN(state, payload) {

//console.object('UPDATE_BIN',payload)

    let bin = state.data.find((item) => item.id === payload.id);

    Object.assign(bin, payload);
  },
  DELETE_BIN(state, payload) {

//console.object('DELETE_BIN',payload)

    state.data = state.data.filter((item) => item.id !== payload.id);

  },

  SET_BINS(state, payload) {
    state.data = payload;
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

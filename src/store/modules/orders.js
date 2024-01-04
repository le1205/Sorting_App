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
  async getOrder({ commit }, payload) {
    //console.log("getOrder");

    commit("REQUEST_STARTED");

    const Order = await fb.ordersCollection.doc(payload.id).get();

    commit("REQUEST_COMPLETED");

    return Order.data();
  },
  async getOrders({ commit, dispatch }) {
    
    commit("REQUEST_STARTED");

    let response = await fb.ordersCollection.get();

    commit("REQUEST_COMPLETED");

    if (response.empty) {
      //console.log("No data available.");
      return;
    }

    let orders = [];

    response.forEach((doc) => orders.push(doc.data()));

    //console.log("getOrders.firebase", orders.length);

    //count orders parts
    for (let order of orders) {
      let parts = await dispatch(
        "parts/getOrderParts",
        { _order_uid: order.id },
        { root: true }
      );

      //can't access global constants ?!
      const PART_STATE = {
        OK: 1,
        DAMAGED: 2,
        MISSING: 3,
      };

      const sorted = parts.filter((p) => p._state === PART_STATE.OK).length;
      const not_sorted = parts.filter(
        (p) => p._state !== PART_STATE.OK && p._state !== PART_STATE.DAMAGED
      ).length;
      const damaged = parts.filter((p) => p._state === PART_STATE.DAMAGED)
        .length;

      if (sorted === 0 && damaged === 0) order.status = "New";
      if (sorted > 0 && sorted === parts.length) order.status = "Sorted";
      if (sorted >= 0 && damaged > 0) order.status = "In Progress / Damaged";
      if (sorted > 0 && sorted < parts.length && damaged === 0)
        order.status = "In Progress";

      order.parts = `${sorted}/${parts.length}`;
    }

    return orders;
  },

  async createOrder({ commit, dispatch }, payload) {
    commit("REQUEST_STARTED");

    await fb.ordersCollection.doc(payload.data.id).set(payload.data);

    if (payload.parts) {
      await dispatch("parts/bulkUpdate", payload.parts, { root: true });
    }
    /*    
      if (payload.parts) {
        payload.parts.forEach((item) => {
          dispatch("parts/createPart", item, { root: true });
        });
      }
*/

    commit("REQUEST_COMPLETED");
  },
  async updateOrder({ commit, dispatch }, payload) {
    //console.object("updateOrder", payload.length);

    commit("REQUEST_STARTED");

    await fb.ordersCollection.doc(payload.data.id).set(payload.data);

    if (payload.parts) {
      await dispatch("parts/bulkUpdate", payload.parts, { root: true });
    }

    /*      
      if (payload.parts.length) {

        payload.parts.forEach((item) => {

            dispatch("parts/createPart", item, {
              root: true,
            });
          });
 
      } else {

        await dispatch("parts/deleteOrderParts", payload.data.id, { root: true });

      }
*/

    commit("REQUEST_COMPLETED");
  },
  async deleteOrder({ commit, dispatch }, payload) {
    commit("REQUEST_STARTED");

    await fb.ordersCollection.doc(payload.id).delete();

    await dispatch("parts/deleteOrderParts", payload.id, { root: true });

    commit("REQUEST_COMPLETED");
  },
};

const mutations = {
  SET_ORDER(state, payload) {
    state.data = payload;
  },

  CREATE_ORDER(state, payload) {
    state.data.push(payload);
  },
  UPDATE_ORDER(state, payload) {
    let order = state.data.find((item) => item.id === payload.id);

    Object.assign(order, payload);
  },
  DELETE_ORDER(state, payload) {
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

import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../../firebase";

Vue.use(Vuex);

const state = {
  isLoading: false,
  data: [],
};

const getters = {
  getPartsDataFromCache: (state) => state.data,
};

const actions = {
  //fix
  async deletePartsWithoutOrders({state,commit}) {
    let order_col = await fb.ordersCollection.get();

    let orders = [];

    order_col.forEach((doc) => orders.push(doc.data()));

    orders = orders.map((o) => o.id);

    const batchArray = [];

    batchArray.push(fb.db.batch());

    let operationCounter = 0;
    let batchIndex = 0;

    //const batch = fb.db.batch();

    let parts = [];

    let part_col = await fb.partsCollection.get();

    part_col.forEach((doc) => parts.push(doc.data()));

    ////console.log("deletePartsWithoutOrders.parts.length", parts.length);

    let no_order = parts.filter((b) => !orders.includes(b._order_uid));

    ////console.log("deletePartsWithoutOrders.no_order.length", no_order.length);

    no_order.forEach((item) => {
      ////console.log('deletePartsWithoutOrders.no.order',item._uid);

      const part = fb.partsCollection.doc(item._uid);

      batchArray[batchIndex].delete(part);
      operationCounter++;
      if (operationCounter === 499) {
        batchArray.push(fb.db.batch());
        batchIndex++;
        operationCounter = 0;
      }
    });

    batchArray.forEach(async (batch) => await batch.commit());

    //delete not existing orders parts from state
    let no_order_parts = state.data.filter((b) => !orders.includes(b._order_uid));
    let notExistingOrders = [...new Set(no_order_parts.map( p => p._order_uid))]

    //console.log('notExistingOrders:',notExistingOrders)
    notExistingOrders.forEach( _order_uid => {
      commit("DELETE_DATA", { _order_uid: _order_uid });
    })
    
  },

  async synchronize({ commit, state, dispatch }) {

    //await dispatch("deletePartsWithoutOrders");
    ////console.object('state.data',state.data)

    let maxUTCSeconds = Number.NEGATIVE_INFINITY;

    try {
      if (state.data.length > 0) {
        //console.log("state.data.length>0");
        maxUTCSeconds = Math.max(
          ...state.data.map((part) => new Date(part._updated.seconds))
        );
      } else {
        //console.log("!state.data.length");
        maxUTCSeconds = 0;
      }
    } catch (err) {}
    //console.log("maxUTCSeconds1", maxUTCSeconds);
    if (maxUTCSeconds === Number.NEGATIVE_INFINITY)
      maxUTCSeconds = Date.now() - 1 * 60 * 60 * 1000;
    //console.log("maxUTCSeconds2", maxUTCSeconds);

    let maxDate = new Date(0);

    maxDate.setUTCSeconds(maxUTCSeconds + 30);
    //moment(1454521239279).format("DD MMM YYYY hh:mm a") //parse integer

    //console.log("Parts cache updated:", maxDate);

    //commit("REQUEST_STARTED");

    //const updatedPartsCollection = fb.partsCollection.where("_order_uid","==",'I9Ku8WibTPSHF_uWLLPht').where("_updated",">",maxDate);
    const updatedPartsCollection = fb.partsCollection.where(
      "_updated",
      ">",
      maxDate
    );

    //listen for updated parts and update cache
    updatedPartsCollection.onSnapshot(
      (snapshot) => {
        //console.log(`Received UPDATED parts snapshot: ${snapshot.size}`);

        let updatedParts = [];

        snapshot.forEach((doc) => updatedParts.push(doc.data()));

        //console.log("parts.synchronize.UPDATED:", updatedParts);

        commit("SET_DATA", updatedParts);
      },
      (err) => {
        //console.log(`parts.synchronize.onSnapshot.Encountered error: ${err}`);
      }
    );
    
    //TODO listen for deleted parts [split by orders]
    //{}
  },

  async getParts({ state, dispatch, commit }) {


    await dispatch("synchronize");


    let parts = [];

    //try to use cache
    if (state.data.length) {
      //console.log(`getParts.state: ${state.data.length}`);

      //!!!!!!!!!
      /*
      state.data.forEach(p => {

        //if (!p._created) p._created = fb.fs.Timestamp.now();
        //if (!p._updated && p._created) p._updated = p._created;
        //if (!p._updated) p._updated = fb.fs.Timestamp.now();

        delete p.created

        p.updated = true
      })
*/

      return state.data;
    }

    //othwerwise request fb

    commit("REQUEST_STARTED");

    //temp debug limitation
    //let response = await fb.partsCollection.where("_order_uid","==",'I9Ku8WibTPSHF_uWLLPht').get();

    let response = await fb.partsCollection.get();

    commit("REQUEST_COMPLETED");

    if (response.empty) {
      //console.log(" in firestore");
      return [];
    }

    response.forEach((doc) => parts.push(doc.data()));

    commit("SET_DATA", parts);

    //console.log(`getParts.firestore: ${parts.length}`);

    return parts;
  },
  async getPart({ commit }, payload) {
    //console.log("getPart");

    commit("REQUEST_STARTED");

    const part = await fb.partsCollection.doc(payload._uid).get();

    commit("REQUEST_COMPLETED");

    return part.data();
  },

  async getOrderParts({ state, commit }, payload) {
    let parts = [];

    //try to use cache
    if (state.data.length) {
      parts = state.data.filter((p) => p._order_uid === payload._order_uid);

      //console.log(`getOrderParts.state: ${parts.length}`);

      //return parts.filter(p=>p["ID"] === '16392')
      return parts;
    }

    //othwerwise request fb
    commit("REQUEST_STARTED");

    let response = await fb.partsCollection
      .where("_order_uid", "==", payload._order_uid)
      .get();

    /*
.onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        //console.log('New part: ', change.doc.data());
      }
      if (change.type === 'modified') {
        //console.log('Modified part: ', change.doc.data());
      }
      if (change.type === 'removed') {
        //console.log('Removed part: ', change.doc.data());
      }
    });
  });    
    */

    commit("REQUEST_COMPLETED");

    if (response.empty) {
      //console.log("No data available in firestore");
      return [];
    }

    response.forEach((doc) => parts.push(doc.data()));

    //console.log(`getOrderParts.firestore: ${parts.length}`);

    commit("SET_DATA", parts);

    return parts;
  },

  async getBinParts({ state, commit }, payload) {
    let parts = [];

    //try to use cache
    if (state.data.length) {
      parts = state.data.filter((p) => p._bin_uid === payload._bin_uid);

      if (parts.length > 0) //console.log(`getBinParts.state: ${parts.length}`);

      return parts;
    }

    //othwerwise request fb
    commit("REQUEST_STARTED");

    let response = await fb.partsCollection
      .where("_bin_uid", "==", payload._bin_uid)
      .get();

    commit("REQUEST_COMPLETED");

    if (response.empty) {
      //console.log("No data available in firestore");
      return [];
    }

    response.forEach((doc) => parts.push(doc.data()));

    commit("SET_DATA", parts);

    //console.log(`getBinParts.firestore: ${parts.length}`);

    return parts;
  },
  async getCartParts({ state, commit }, payload) {
    let parts = [];

    //use cache
    parts = state.data.filter((p) => p._cart_uid === payload._cart_uid);

    if (parts.length > 0) {
      // parts = state.data.filter( p => p._cart_uid === payload._cart_uid)

      if (parts.length > 0) //console.log(`getCartParts.state: ${parts.length}`);

      return parts;
    }
    /*

    //othwerwise request fb
    commit("REQUEST_STARTED");

    let response = await fb.partsCollection
      .where("_cart_uid", "==", payload._cart_uid)
      .get();

    commit("REQUEST_COMPLETED");

    if (response.empty) {
      //console.log("No data available in firestore");
      return [];
    }

    response.forEach((doc) => parts.push(doc.data()));

    commit("SET_DATA", parts);

    //console.log(`getCartParts.firestore: ${parts.length}`);
*/
    return parts;
  },
  async bulkUpdate({ commit }, parts) {
    //console.log("parts.bulkUpdate");

    const batchArray = [];
    batchArray.push(fb.db.batch());

    let operationCounter = 0;
    let batchIndex = 0;

    commit("REQUEST_STARTED");

    const c = parts.find((b) => b.created)
      ? parts.filter((b) => b.created).length
      : 0;
    const u = parts.find((b) => b.updated)
      ? parts.filter((b) => b.updated).length
      : 0;
    const d = parts.find((b) => b.deleted)
      ? parts.filter((b) => b.deleted).length
      : 0;

    //console.log(`parts.BulkUpdate: created: ${c}; updated: ${u}; deleted: ${d}`);

    const batch = fb.db.batch();

    parts
      .filter((b) => b.created)
      .forEach((item) => {
        const part = fb.partsCollection.doc(item._uid);

        delete item.created;

        item._created = fb.fs.Timestamp.now();
        item._updated = fb.fs.Timestamp.now();

        //batch.set(part,item);

        batchArray[batchIndex].set(part, item);
        operationCounter++;
        if (operationCounter === 499) {
          batchArray.push(fb.db.batch());
          batchIndex++;
          operationCounter = 0;
        }
      });

    parts
      .filter((b) => b.updated)
      .forEach((item) => {
        const part = fb.partsCollection.doc(item._uid);
        //delete item.created

        //item.updated1 = null
        //item.updated1 = true

        item.updated = false;
        item._updated = fb.fs.Timestamp.now();

        /*
        delete item._binObject;
        delete item._bin_state;
        delete item._loading;
        */
       item._binObject = null;
       item._bin_state = null;
       item._loading = null;
       item._additionalMessage = null;

        //item.updated1 = fb.fs.FieldValue.delete()

        //batch.update(part,item);
        batchArray[batchIndex].update(part, item);
        operationCounter++;
        if (operationCounter === 499) {
          batchArray.push(fb.db.batch());
          batchIndex++;
          operationCounter = 0;
        }
      });

    parts
      .filter((b) => b.deleted)
      .forEach((item) => {
        const part = fb.partsCollection.doc(item._uid);

        batchArray[batchIndex].delete(part);
        operationCounter++;
        if (operationCounter === 499) {
          batchArray.push(fb.db.batch());
          batchIndex++;
          operationCounter = 0;
        }
      });

    batchArray.forEach(async (batch) => await batch.commit());

    commit("REQUEST_COMPLETED");

    commit("SET_DATA", parts);
  },
  async createPart({ commit }, payload) {
    commit("REQUEST_STARTED");

    payload._created = fb.fs.Timestamp.now();

    await fb.partsCollection.doc(payload._uid).set(payload);

    commit("REQUEST_COMPLETED");

    commit("SET_DATA", [payload]);
  },
  async updatePartState({ commit, dispatch }, payload) {
    payload.part._state = payload.state;

    await dispatch("updatePart", payload.part);
  },
  async updatePart({ commit }, payload) {
    //console.log("updatePart", payload._uid);

    commit("REQUEST_STARTED");
    ////console.object('payload',payload)
    //let payload = JSON.parse(JSON.stringify(payload))// Object.assign({},)
    payload = Object.assign({}, payload);

    /*
    delete payload._binObject;
    delete payload._bin_state;
    delete payload._loading;
    */
   payload._binObject = null;
   payload._bin_state = null;
   payload._loading = null;
   payload._additionalMessage = null;


    payload._updated = fb.fs.Timestamp.now();

    await fb.partsCollection.doc(payload._uid).set(payload);

    commit("REQUEST_COMPLETED");

    commit("SET_DATA", [payload]);
  },
  async deletePart({ commit }, payload) {
    commit("REQUEST_STARTED");

    await fb.partsCollection.doc(payload._uid).delete();

    commit("REQUEST_COMPLETED");
  },
  /*
  async deleteOrderParts({ commit }, _order_uid) {
    ////console.log('deleteOrderParts',_order_uid)

    commit("REQUEST_STARTED");

    let response = await fb.partsCollection
      .where("_order_uid", "==", _order_uid)
      .get();

    if (response.empty) {
      //console.log("No data available in firestore");
      return true;
    }

    commit("DELETE_DATA", { _order_uid: _order_uid });

    response.forEach(async (doc) => {
      let part = doc.data();

      await fb.partsCollection.doc(part._uid).delete();
    });

    commit("REQUEST_COMPLETED");
  },
  */
  async deleteOrderParts({ commit }, _order_uid) {
    commit("REQUEST_STARTED");

    let response = await fb.partsCollection
      .where("_order_uid", "==", _order_uid)
      .get();

    if (response.empty) {
      //console.log("No data available in firestore");
      return true;
    }

    const batchArray = [];

    batchArray.push(fb.db.batch());

    let operationCounter = 0;
    let batchIndex = 0;

    let parts = [];

    let part_col = await fb.partsCollection.where("_order_uid", "==", _order_uid).get();

    part_col.forEach((doc) => parts.push(doc.data()));

    //console.log("deleteOrderParts.parts.length", parts.length);

    parts.forEach((item) => {
      
      const part = fb.partsCollection.doc(item._uid);

      batchArray[batchIndex].delete(part);
      operationCounter++;
      if (operationCounter === 499) {
        batchArray.push(fb.db.batch());
        batchIndex++;
        operationCounter = 0;
      }
    });

    batchArray.forEach(async (batch) => await batch.commit());

    commit("DELETE_DATA", { _order_uid: _order_uid });

    commit("REQUEST_COMPLETED");
  },
  cleanPartsCache({ commit }) {
    commit("DELETE_DATA");
  },
};

const mutations = {
  SET_DATA(state, payload) {
    const old = state.data.length;

    //remove existing in payload items
    state.data = state.data.filter(
      (part) => !payload.find((p) => p._uid === part._uid)
    );

    //merge except deleted
    state.data = [...state.data, ...payload.filter((p) => !p.deleted)];

    //console.log(`parts.SET_DATA ${old}/${state.data.length}`);
  },
  DELETE_DATA(state, payload) {

    if (!payload) {
      state.data = [];
    } else {
      //console.log(`parts.DELETE_DATA.before: ${state.data.length}`);

      state.data = state.data.filter(
        (part) => part._order_uid !== payload._order_uid
      );
    }

    //console.log(`parts.DELETE_DATA.after: ${state.data.length}`);
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

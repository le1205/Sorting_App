import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import to from 'await-to-js';


const state = {
  isLoading: false,
  status: "",
  //isAuthenticated: false,
  uid: undefined,
  admin: undefined,
  gaAccount: false,
};

const getters = {
  isAuthenticated: (state) => state.uid !== undefined,
  isAdmin: (state) => state.admin,
  isAccountConnected: (state) => state.gaAccount,
  uid: (state) => state.uid,
};

const actions = {
  signUp: ({ commit }, payload) => {

    return new Promise((resolve, reject) => {
      commit("REQUEST_STARTED");

      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit("SET_UID", response.user);

          commit("REQUEST_COMPLETED");

          resolve(response);
        })
        .catch((error) => {
          commit("REMOVE_UID");

          commit("REQUEST_ERROR", error.message);

          reject(error);
        });
    });
  },
  async isAdmin(){

    let [err, res] = await to(firebase.auth().currentUser.getIdTokenResult())

    if (res.claims.admin) return true

    return false

  },
  async signInSortingShop({ commit,dispatch }, { email, password }) {

    
  commit("REQUEST_STARTED");

  let error = 'Provided password is invalid'
  let user = undefined
  
  //get users list
  let users = await dispatch("users/getUsers",{ },{ root: true });
  
  users = users.data.filter( u => u.admin === false)
  
  //console.log(users)
  
  //try to login
  for (let i=0;i<users.length;i++){

  let [err, response] = await to(firebase.auth().signInWithEmailAndPassword(users[i].email, password))
  
  //console.log(err,usr)

  if(response) {user = response.user; break}

  }
  
  if (!user) {

    commit("REMOVE_UID");

    commit("REQUEST_ERROR", error);

    throw error

    return error
  }

  commit("SET_UID", user);

  commit("REQUEST_COMPLETED");

  return user
  
  },
  signIn({ commit, dispatch }, { email, password }) {

    return new Promise(function(resolve, reject) {
      commit("REQUEST_STARTED");

      firebase.auth().signInWithEmailAndPassword(email, password).then(async (response) => {
        
          let admin = await dispatch("auth/isAdmin",{ },{ root: true });
          if (admin) response.user.admin = admin

          commit("SET_UID", response.user);
          commit("REQUEST_COMPLETED");
          resolve(response.user);
        })
        .catch((error) => {
          commit("REMOVE_UID");
          commit("REQUEST_ERROR", error);
          reject(error);
        });
    });
  },
  signInWithPopup({ commit }, { provider }) {
    return new Promise(function(resolve, reject) {
      commit("REQUEST_STARTED");

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((response) => {
          commit("SET_UID", response.user);
          commit("REQUEST_COMPLETED");
          resolve(response.user);
        })
        .catch((error) => {
          commit("REMOVE_UID");
          commit("REQUEST_ERROR", error);
          reject(error);
        });
    });
  },
  signOut({ commit }) {
    commit("REQUEST_STARTED");

    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("REMOVE_UID");
          commit("REQUEST_COMPLETED");
          resolve();
        })
        .catch((error) => {
          commit("REQUEST_ERROR", error);
          reject(error);
        });
    });
  },
  checkUserStatus({ commit }) {

    return new Promise((resolve, reject) => {
      commit("REQUEST_STARTED");

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          commit("REQUEST_COMPLETED");
          commit("SET_UID", user);
          resolve(user.uid);
        } else {
          const error = "User is not logged in.";
          commit("REMOVE_UID");
          commit("REQUEST_ERROR", error);
          reject(error);
        }
      });
    });
  },


};

const mutations = {
  CONNECT_ACCOUNT(state) {
    state.gaAccount = true;
  },
  DISCONNECT_ACCOUNT(state) {
    state.gaAccount = false;
  },
  SET_UID(state, payload) {
 
    state.uid = payload.uid;
    state.admin = payload.admin;
  },
  REMOVE_UID(state) {
    state.uid = undefined;
    state.admin = undefined;
  },
  REQUEST_STARTED: (state) => {
      
    state.isLoading = true;
    state.status = "Started";
  },
  REQUEST_COMPLETED: (state) => {
    state.isLoading = false;
    state.status = "Completed";
  },
  REQUEST_ERROR: (state, payload) => {
    state.isLoading = false;
    state.status = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

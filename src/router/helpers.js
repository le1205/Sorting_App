import store from "../store";

export const ifNotAuthenticated = (to, from, next) => {

//console.log('ifNotAuthenticated',store.getters['auth/isAuthenticated'],to.name)

  if (!store.getters["auth/isAuthenticated"]) {
    next();

    return;
  }

//  next("/orders");

  if (store.getters["auth/isAuthenticated"] && store.getters["auth/isAdmin"]) {
    next("/orders");
  }

  if (store.getters["auth/isAuthenticated"] && !store.getters["auth/isAdmin"]) {
    next("/sorting_shop");
  }


};

export const ifAuthenticated = async (to, from, next) => {

  //console.log('ifAuthenticated', store.getters["auth/isAuthenticated"], store.getters["auth/isAdmin"])

  if (store.getters["auth/isAuthenticated"]) {

    next();

    return;
  } 

  next("/login");

};

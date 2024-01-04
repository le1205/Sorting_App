"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _app = _interopRequireDefault(require("firebase/app"));

require("firebase/auth");

require("firebase/database");

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var state = {
  isLoading: false,
  status: "",
  //isAuthenticated: false,
  uid: undefined,
  admin: undefined,
  gaAccount: false
};
var getters = {
  isAuthenticated: function isAuthenticated(state) {
    return state.uid !== undefined;
  },
  isAdmin: function isAdmin(state) {
    return state.admin;
  },
  isAccountConnected: function isAccountConnected(state) {
    return state.gaAccount;
  },
  uid: function uid(state) {
    return state.uid;
  }
};
var actions = {
  signUp: function signUp(_ref, payload) {
    var commit = _ref.commit;
    return new Promise(function (resolve, reject) {
      commit("REQUEST_STARTED");

      _app["default"].auth().createUserWithEmailAndPassword(payload.email, payload.password).then(function (response) {
        commit("SET_UID", response.user);
        commit("REQUEST_COMPLETED");
        resolve(response);
      })["catch"](function (error) {
        commit("REMOVE_UID");
        commit("REQUEST_ERROR", error.message);
        reject(error);
      });
    });
  },
  isAdmin: function isAdmin() {
    var _ref2, _ref3, err, res;

    return regeneratorRuntime.async(function isAdmin$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap((0, _awaitToJs["default"])(_app["default"].auth().currentUser.getIdTokenResult()));

          case 2:
            _ref2 = _context.sent;
            _ref3 = _slicedToArray(_ref2, 2);
            err = _ref3[0];
            res = _ref3[1];

            if (!res.claims.admin) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", true);

          case 8:
            return _context.abrupt("return", false);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  signInSortingShop: function signInSortingShop(_ref4, _ref5) {
    var commit, dispatch, email, password, error, user, users, i, _ref6, _ref7, err, response;

    return regeneratorRuntime.async(function signInSortingShop$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            commit = _ref4.commit, dispatch = _ref4.dispatch;
            email = _ref5.email, password = _ref5.password;
            commit("REQUEST_STARTED");
            error = 'Provided password is invalid';
            user = undefined; //get users list

            _context2.next = 7;
            return regeneratorRuntime.awrap(dispatch("users/getUsers", {}, {
              root: true
            }));

          case 7:
            users = _context2.sent;
            users = users.data.filter(function (u) {
              return u.admin === false;
            }); //console.log(users)
            //try to login

            i = 0;

          case 10:
            if (!(i < users.length)) {
              _context2.next = 23;
              break;
            }

            _context2.next = 13;
            return regeneratorRuntime.awrap((0, _awaitToJs["default"])(_app["default"].auth().signInWithEmailAndPassword(users[i].email, password)));

          case 13:
            _ref6 = _context2.sent;
            _ref7 = _slicedToArray(_ref6, 2);
            err = _ref7[0];
            response = _ref7[1];

            if (!response) {
              _context2.next = 20;
              break;
            }

            user = response.user;
            return _context2.abrupt("break", 23);

          case 20:
            i++;
            _context2.next = 10;
            break;

          case 23:
            if (user) {
              _context2.next = 28;
              break;
            }

            commit("REMOVE_UID");
            commit("REQUEST_ERROR", error);
            throw error;

          case 28:
            commit("SET_UID", user);
            commit("REQUEST_COMPLETED");
            return _context2.abrupt("return", user);

          case 31:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  signIn: function signIn(_ref8, _ref9) {
    var commit = _ref8.commit,
        dispatch = _ref8.dispatch;
    var email = _ref9.email,
        password = _ref9.password;
    return new Promise(function (resolve, reject) {
      commit("REQUEST_STARTED");

      _app["default"].auth().signInWithEmailAndPassword(email, password).then(function _callee(response) {
        var admin;
        return regeneratorRuntime.async(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return regeneratorRuntime.awrap(dispatch("auth/isAdmin", {}, {
                  root: true
                }));

              case 2:
                admin = _context3.sent;
                if (admin) response.user.admin = admin;
                commit("SET_UID", response.user);
                commit("REQUEST_COMPLETED");
                resolve(response.user);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        });
      })["catch"](function (error) {
        commit("REMOVE_UID");
        commit("REQUEST_ERROR", error);
        reject(error);
      });
    });
  },
  signInWithPopup: function signInWithPopup(_ref10, _ref11) {
    var commit = _ref10.commit;
    var provider = _ref11.provider;
    return new Promise(function (resolve, reject) {
      commit("REQUEST_STARTED");

      _app["default"].auth().signInWithPopup(provider).then(function (response) {
        commit("SET_UID", response.user);
        commit("REQUEST_COMPLETED");
        resolve(response.user);
      })["catch"](function (error) {
        commit("REMOVE_UID");
        commit("REQUEST_ERROR", error);
        reject(error);
      });
    });
  },
  signOut: function signOut(_ref12) {
    var commit = _ref12.commit;
    commit("REQUEST_STARTED");
    return new Promise(function (resolve, reject) {
      _app["default"].auth().signOut().then(function () {
        commit("REMOVE_UID");
        commit("REQUEST_COMPLETED");
        resolve();
      })["catch"](function (error) {
        commit("REQUEST_ERROR", error);
        reject(error);
      });
    });
  },
  checkUserStatus: function checkUserStatus(_ref13) {
    var commit = _ref13.commit;
    return new Promise(function (resolve, reject) {
      commit("REQUEST_STARTED");

      _app["default"].auth().onAuthStateChanged(function (user) {
        if (user) {
          commit("REQUEST_COMPLETED");
          commit("SET_UID", user);
          resolve(user.uid);
        } else {
          var error = "User is not logged in.";
          commit("REMOVE_UID");
          commit("REQUEST_ERROR", error);
          reject(error);
        }
      });
    });
  }
};
var mutations = {
  CONNECT_ACCOUNT: function CONNECT_ACCOUNT(state) {
    state.gaAccount = true;
  },
  DISCONNECT_ACCOUNT: function DISCONNECT_ACCOUNT(state) {
    state.gaAccount = false;
  },
  SET_UID: function SET_UID(state, payload) {
    state.uid = payload.uid;
    state.admin = payload.admin;
  },
  REMOVE_UID: function REMOVE_UID(state) {
    state.uid = undefined;
    state.admin = undefined;
  },
  REQUEST_STARTED: function REQUEST_STARTED(state) {
    state.isLoading = true;
    state.status = "Started";
  },
  REQUEST_COMPLETED: function REQUEST_COMPLETED(state) {
    state.isLoading = false;
    state.status = "Completed";
  },
  REQUEST_ERROR: function REQUEST_ERROR(state, payload) {
    state.isLoading = false;
    state.status = payload;
  }
};
var _default = {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
};
exports["default"] = _default;
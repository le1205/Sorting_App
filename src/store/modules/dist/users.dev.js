"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

var fb = _interopRequireWildcard(require("../../firebase"));

var constants = _interopRequireWildcard(require("@/shared/constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vuex["default"]);

var state = {
  data: []
};
var getters = {};
var actions = {
  getUser: function getUser(_ref, payload) {
    var commit;
    return regeneratorRuntime.async(function getUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            commit = _ref.commit;

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  getUsers: function getUsers(_ref2) {
    var commit, dispatch, usersList, response;
    return regeneratorRuntime.async(function getUsers$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            commit = _ref2.commit, dispatch = _ref2.dispatch;
            commit("REQUEST_STARTED");
            usersList = fb.functions.httpsCallable('usersList');
            _context2.next = 5;
            return regeneratorRuntime.awrap(usersList());

          case 5:
            response = _context2.sent;
            commit("REQUEST_COMPLETED");
            return _context2.abrupt("return", response);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  createUser: function createUser(_ref3, payload) {
    var commit, dispatch, createUser, response;
    return regeneratorRuntime.async(function createUser$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            commit = _ref3.commit, dispatch = _ref3.dispatch;
            commit("REQUEST_STARTED");
            createUser = fb.functions.httpsCallable('createUser');
            _context3.next = 5;
            return regeneratorRuntime.awrap(createUser(payload));

          case 5:
            response = _context3.sent;
            commit("REQUEST_COMPLETED");

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  updateUser: function updateUser(_ref4, payload) {
    var commit, dispatch, updateUser, response;
    return regeneratorRuntime.async(function updateUser$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            commit = _ref4.commit, dispatch = _ref4.dispatch;
            commit("REQUEST_STARTED");
            updateUser = fb.functions.httpsCallable('updateUser');
            _context4.next = 5;
            return regeneratorRuntime.awrap(updateUser(payload));

          case 5:
            response = _context4.sent;
            commit("REQUEST_COMPLETED");

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  deleteUser: function deleteUser(_ref5, payload) {
    var commit, dispatch, deleteUser, response;
    return regeneratorRuntime.async(function deleteUser$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            commit = _ref5.commit, dispatch = _ref5.dispatch;
            commit("REQUEST_STARTED");
            deleteUser = fb.functions.httpsCallable('deleteUser');
            _context5.next = 5;
            return regeneratorRuntime.awrap(deleteUser(payload));

          case 5:
            response = _context5.sent;
            commit("REQUEST_COMPLETED");

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    });
  }
};
var mutations = {
  SET_USER: function SET_USER(state, payload) {
    state.data = payload;
  },
  CREATE_USER: function CREATE_USER(state, payload) {
    state.data.push(payload);
  },
  UPDATE_USER: function UPDATE_USER(state, payload) {
    var user = state.data.find(function (item) {
      return item.id === payload.id;
    });
    Object.assign(user, payload);
  },
  DELETE_USER: function DELETE_USER(state, payload) {
    state.data = state.data.filter(function (item) {
      return item.id !== payload.id;
    });
  },
  REQUEST_STARTED: function REQUEST_STARTED(state) {
    state.isLoading = true;
    state.status = "Started";
  },
  REQUEST_COMPLETED: function REQUEST_COMPLETED(state) {
    state.isLoading = false;
    state.status = "Completed";
  },
  REQUEST_ERROR: function REQUEST_ERROR(state) {
    state.isLoading = false;
    state.status = "Error";
  }
};
var _default = {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};
exports["default"] = _default;
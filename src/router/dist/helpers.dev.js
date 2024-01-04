"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ifAuthenticated = exports.ifNotAuthenticated = void 0;

var _store = _interopRequireDefault(require("../store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ifNotAuthenticated = function ifNotAuthenticated(to, from, next) {
  //console.log('ifNotAuthenticated',store.getters['auth/isAuthenticated'],to.name)
  if (!_store["default"].getters["auth/isAuthenticated"]) {
    next();
    return;
  } //  next("/orders");


  if (_store["default"].getters["auth/isAuthenticated"] && _store["default"].getters["auth/isAdmin"]) {
    next("/orders");
  }

  if (_store["default"].getters["auth/isAuthenticated"] && !_store["default"].getters["auth/isAdmin"]) {
    next("/sorting_shop");
  }
};

exports.ifNotAuthenticated = ifNotAuthenticated;

var ifAuthenticated = function ifAuthenticated(to, from, next) {
  return regeneratorRuntime.async(function ifAuthenticated$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!_store["default"].getters["auth/isAuthenticated"]) {
            _context.next = 3;
            break;
          }

          next();
          return _context.abrupt("return");

        case 3:
          next("/login");

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.ifAuthenticated = ifAuthenticated;
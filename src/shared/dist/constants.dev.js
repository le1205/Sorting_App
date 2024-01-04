"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var CREATE = 0;
var EDIT = 1;
var VIEW = 2;
var READONLY = 3;
var FORM_MODE = {
  CREATE: CREATE,
  EDIT: EDIT,
  VIEW: VIEW,
  READONLY: READONLY
};
var PART_STATE = {
  OK: 1,
  DAMAGED: 2,
  MISSING: 3
};
var STORAGE_TYPE = {
  CART: 0,
  RACK: 1
};
var CART_TYPE = {
  ANY: 0,
  FACE_FRAME_PARTS: 1,
  MULTI_5_PIECE_FRONTS_PARTS: 2,
  DRAWER_BOX_PARTS: 3
};
var CART_STATUS = {
  DISABLED: 0,
  ACTIVE: 1
};
var FILTERS = {
  ALL_PARTS: 0,
  CARCASS_PARTS: 1,
  CARCASS_PARTS_CHILDS: 10,
  DRAWER_BOX_PARTS: 2,
  DOOR_DRAWER_FRONTS_PARENTS: 11,
  DOOR_DRAWER_FRONTS_SINGLE: 3,
  FACE_FRAME_PARTS: 4,
  CARCASS_NOP_MULTI_AND_DRAWER_BOX_MULTI: 5,
  CARCASS_NOP_MULTI_AND_DRAWER_BOX_SINGLE: 6,
  TOE_KICK: 7,
  MULTI_5_PIECE_FRONTS_PARTS: 8,
  MULTI_PARTS: 9
};
var PART_TYPES = {
  CARCASS_PARTS: [14, 5, 4, 1, 13, 6, 12, 3, 34],
  CARCASS_PARTS_CHILDS: [14, 5, 4, 1, 13, 6, 12, 3, 34],
  DRAWER_BOX_PARTS: [21, 22],
  DOOR_DRAWER_FRONTS_PARENTS: [23, 8, 9, 10],
  DOOR_DRAWER_FRONTS_SINGLE: [23, 8, 9, 10],
  FACE_FRAME_PARTS: [36],
  CARCASS_NOP_MULTI_AND_DRAWER_BOX_MULTI: [14, 5, 4, 1, 13, 6, 12, 3, 34, 21, 22],

  get CARCASS_NOP_MULTI_AND_DRAWER_BOX_SINGLE() {
    return [].concat(_toConsumableArray(PART_TYPES.CARCASS_NOP_MULTI_AND_DRAWER_BOX_MULTI), _toConsumableArray(PART_TYPES.DOOR_DRAWER_FRONTS_SINGLE));
  },

  TOE_KICK: [27],
  MULTI_5_PIECE_FRONTS_PARTS: [8, 9, 10, 23],
  MULTI_PARTS_EXCLUDE: [8, 9, 10, 23, 27]
};
var _default = {
  FORM_MODE: FORM_MODE,
  PART_STATE: PART_STATE,
  STORAGE_TYPE: STORAGE_TYPE,
  CART_TYPE: CART_TYPE,
  FILTERS: FILTERS,
  CART_STATUS: CART_STATUS,
  PART_TYPES: PART_TYPES
};
exports["default"] = _default;
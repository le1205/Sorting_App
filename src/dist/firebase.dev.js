"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partsCollection = exports.ordersCollection = exports.binsCollection = exports.cartsCollection = exports.auth = exports.db = exports.fs = exports.functions = void 0;

var firebase = _interopRequireWildcard(require("firebase/app"));

require("firebase/auth");

require("firebase/firestore");

require("firebase/functions");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// firebase init - add your own config here
//import firebase from 'firebase/app';
var firebaseConfig = {
  apiKey: "AIzaSyAh5lwi4HMwnfjnaw-xwYfu5g3unZFjPXc",
  authDomain: "sorting-parts.firebaseapp.com",
  databaseURL: "https://sorting-parts.firebaseio.com",
  projectId: "sorting-parts",
  storageBucket: "sorting-parts.appspot.com",
  messagingSenderId: "428324764369",
  appId: "1:428324764369:web:41c734e2ae67435d0ae3f0"
};
firebase.initializeApp(firebaseConfig); // utils

var functions = firebase.functions();
exports.functions = functions;
var fs = firebase.firestore;
exports.fs = fs;
var db = firebase.firestore();
exports.db = db;
var auth = firebase.auth(); // collection references

exports.auth = auth;
var cartsCollection = db.collection('carts');
exports.cartsCollection = cartsCollection;
var binsCollection = db.collection('bins');
exports.binsCollection = binsCollection;
var ordersCollection = db.collection('orders');
exports.ordersCollection = ordersCollection;
var partsCollection = db.collection('parts'); //functions.useFunctionsEmulator('http://localhost:5001');
// export utils/refs

exports.partsCollection = partsCollection;
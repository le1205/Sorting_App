"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

var fb = _interopRequireWildcard(require("../../firebase"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

_vue["default"].use(_vuex["default"]);

var state = {
  isLoading: false,
  data: []
};
var getters = {
  getPartsDataFromCache: function getPartsDataFromCache(state) {
    return state.data;
  }
};
var actions = {
  //fix
  deletePartsWithoutOrders: function deletePartsWithoutOrders(_ref) {
    var state, commit, order_col, orders, batchArray, operationCounter, batchIndex, parts, part_col, no_order, no_order_parts, notExistingOrders;
    return regeneratorRuntime.async(function deletePartsWithoutOrders$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            state = _ref.state, commit = _ref.commit;
            _context2.next = 3;
            return regeneratorRuntime.awrap(fb.ordersCollection.get());

          case 3:
            order_col = _context2.sent;
            orders = [];
            order_col.forEach(function (doc) {
              return orders.push(doc.data());
            });
            orders = orders.map(function (o) {
              return o.id;
            });
            batchArray = [];
            batchArray.push(fb.db.batch());
            operationCounter = 0;
            batchIndex = 0; //const batch = fb.db.batch();

            parts = [];
            _context2.next = 14;
            return regeneratorRuntime.awrap(fb.partsCollection.get());

          case 14:
            part_col = _context2.sent;
            part_col.forEach(function (doc) {
              return parts.push(doc.data());
            }); ////console.log("deletePartsWithoutOrders.parts.length", parts.length);

            no_order = parts.filter(function (b) {
              return !orders.includes(b._order_uid);
            }); ////console.log("deletePartsWithoutOrders.no_order.length", no_order.length);

            no_order.forEach(function (item) {
              ////console.log('deletePartsWithoutOrders.no.order',item._uid);
              var part = fb.partsCollection.doc(item._uid);
              batchArray[batchIndex]["delete"](part);
              operationCounter++;

              if (operationCounter === 499) {
                batchArray.push(fb.db.batch());
                batchIndex++;
                operationCounter = 0;
              }
            });
            batchArray.forEach(function _callee(batch) {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return regeneratorRuntime.awrap(batch.commit());

                    case 2:
                      return _context.abrupt("return", _context.sent);

                    case 3:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            }); //delete not existing orders parts from state

            no_order_parts = state.data.filter(function (b) {
              return !orders.includes(b._order_uid);
            });
            notExistingOrders = _toConsumableArray(new Set(no_order_parts.map(function (p) {
              return p._order_uid;
            }))); //console.log('notExistingOrders:',notExistingOrders)

            notExistingOrders.forEach(function (_order_uid) {
              commit("DELETE_DATA", {
                _order_uid: _order_uid
              });
            });

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  synchronize: function synchronize(_ref2) {
    var commit, state, dispatch, maxUTCSeconds, maxDate, updatedPartsCollection;
    return regeneratorRuntime.async(function synchronize$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            commit = _ref2.commit, state = _ref2.state, dispatch = _ref2.dispatch;
            //await dispatch("deletePartsWithoutOrders");
            ////console.object('state.data',state.data)
            maxUTCSeconds = Number.NEGATIVE_INFINITY;

            try {
              if (state.data.length > 0) {
                //console.log("state.data.length>0");
                maxUTCSeconds = Math.max.apply(Math, _toConsumableArray(state.data.map(function (part) {
                  return new Date(part._updated.seconds);
                })));
              } else {
                //console.log("!state.data.length");
                maxUTCSeconds = 0;
              }
            } catch (err) {} //console.log("maxUTCSeconds1", maxUTCSeconds);


            if (maxUTCSeconds === Number.NEGATIVE_INFINITY) maxUTCSeconds = Date.now() - 1 * 60 * 60 * 1000; //console.log("maxUTCSeconds2", maxUTCSeconds);

            maxDate = new Date(0);
            maxDate.setUTCSeconds(maxUTCSeconds + 30); //moment(1454521239279).format("DD MMM YYYY hh:mm a") //parse integer
            //console.log("Parts cache updated:", maxDate);
            //commit("REQUEST_STARTED");
            //const updatedPartsCollection = fb.partsCollection.where("_order_uid","==",'I9Ku8WibTPSHF_uWLLPht').where("_updated",">",maxDate);

            updatedPartsCollection = fb.partsCollection.where("_updated", ">", maxDate); //listen for updated parts and update cache

            updatedPartsCollection.onSnapshot(function (snapshot) {
              //console.log(`Received UPDATED parts snapshot: ${snapshot.size}`);
              var updatedParts = [];
              snapshot.forEach(function (doc) {
                return updatedParts.push(doc.data());
              }); //console.log("parts.synchronize.UPDATED:", updatedParts);

              commit("SET_DATA", updatedParts);
            }, function (err) {//console.log(`parts.synchronize.onSnapshot.Encountered error: ${err}`);
            }); //TODO listen for deleted parts [split by orders]
            //{}

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  getParts: function getParts(_ref3) {
    var state, dispatch, commit, parts, response;
    return regeneratorRuntime.async(function getParts$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            state = _ref3.state, dispatch = _ref3.dispatch, commit = _ref3.commit;
            _context4.next = 3;
            return regeneratorRuntime.awrap(dispatch("synchronize"));

          case 3:
            parts = []; //try to use cache

            if (!state.data.length) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", state.data);

          case 6:
            //othwerwise request fb
            commit("REQUEST_STARTED"); //temp debug limitation
            //let response = await fb.partsCollection.where("_order_uid","==",'I9Ku8WibTPSHF_uWLLPht').get();

            _context4.next = 9;
            return regeneratorRuntime.awrap(fb.partsCollection.get());

          case 9:
            response = _context4.sent;
            commit("REQUEST_COMPLETED");

            if (!response.empty) {
              _context4.next = 13;
              break;
            }

            return _context4.abrupt("return", []);

          case 13:
            response.forEach(function (doc) {
              return parts.push(doc.data());
            });
            commit("SET_DATA", parts); //console.log(`getParts.firestore: ${parts.length}`);

            return _context4.abrupt("return", parts);

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  getPart: function getPart(_ref4, payload) {
    var commit, part;
    return regeneratorRuntime.async(function getPart$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            commit = _ref4.commit;
            //console.log("getPart");
            commit("REQUEST_STARTED");
            _context5.next = 4;
            return regeneratorRuntime.awrap(fb.partsCollection.doc(payload._uid).get());

          case 4:
            part = _context5.sent;
            commit("REQUEST_COMPLETED");
            return _context5.abrupt("return", part.data());

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  getOrderParts: function getOrderParts(_ref5, payload) {
    var state, commit, parts, response;
    return regeneratorRuntime.async(function getOrderParts$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            state = _ref5.state, commit = _ref5.commit;
            parts = []; //try to use cache

            if (!state.data.length) {
              _context6.next = 5;
              break;
            }

            parts = state.data.filter(function (p) {
              return p._order_uid === payload._order_uid;
            }); //console.log(`getOrderParts.state: ${parts.length}`);
            //return parts.filter(p=>p["ID"] === '16392')

            return _context6.abrupt("return", parts);

          case 5:
            //othwerwise request fb
            commit("REQUEST_STARTED");
            _context6.next = 8;
            return regeneratorRuntime.awrap(fb.partsCollection.where("_order_uid", "==", payload._order_uid).get());

          case 8:
            response = _context6.sent;

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

            if (!response.empty) {
              _context6.next = 12;
              break;
            }

            return _context6.abrupt("return", []);

          case 12:
            response.forEach(function (doc) {
              return parts.push(doc.data());
            }); //console.log(`getOrderParts.firestore: ${parts.length}`);

            commit("SET_DATA", parts);
            return _context6.abrupt("return", parts);

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  getBinParts: function getBinParts(_ref6, payload) {
    var state, commit, parts, response;
    return regeneratorRuntime.async(function getBinParts$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            state = _ref6.state, commit = _ref6.commit;
            parts = []; //try to use cache

            if (!state.data.length) {
              _context7.next = 6;
              break;
            }

            parts = state.data.filter(function (p) {
              return p._bin_uid === payload._bin_uid;
            });

            if (!(parts.length > 0)) {
              _context7.next = 6;
              break;
            }

            return _context7.abrupt("return", parts);

          case 6:
            //othwerwise request fb
            commit("REQUEST_STARTED");
            _context7.next = 9;
            return regeneratorRuntime.awrap(fb.partsCollection.where("_bin_uid", "==", payload._bin_uid).get());

          case 9:
            response = _context7.sent;
            commit("REQUEST_COMPLETED");

            if (!response.empty) {
              _context7.next = 13;
              break;
            }

            return _context7.abrupt("return", []);

          case 13:
            response.forEach(function (doc) {
              return parts.push(doc.data());
            });
            commit("SET_DATA", parts); //console.log(`getBinParts.firestore: ${parts.length}`);

            return _context7.abrupt("return", parts);

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  getCartParts: function getCartParts(_ref7, payload) {
    var state, commit, parts;
    return regeneratorRuntime.async(function getCartParts$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            state = _ref7.state, commit = _ref7.commit;
            parts = []; //use cache

            parts = state.data.filter(function (p) {
              return p._cart_uid === payload._cart_uid;
            });

            if (!(parts.length > 0)) {
              _context8.next = 6;
              break;
            }

            if (!(parts.length > 0)) {
              _context8.next = 6;
              break;
            }

            return _context8.abrupt("return", parts);

          case 6:
            return _context8.abrupt("return", parts);

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  bulkUpdate: function bulkUpdate(_ref8, parts) {
    var commit, batchArray, operationCounter, batchIndex, c, u, d, batch;
    return regeneratorRuntime.async(function bulkUpdate$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            commit = _ref8.commit;
            //console.log("parts.bulkUpdate");
            batchArray = [];
            batchArray.push(fb.db.batch());
            operationCounter = 0;
            batchIndex = 0;
            commit("REQUEST_STARTED");
            c = parts.find(function (b) {
              return b.created;
            }) ? parts.filter(function (b) {
              return b.created;
            }).length : 0;
            u = parts.find(function (b) {
              return b.updated;
            }) ? parts.filter(function (b) {
              return b.updated;
            }).length : 0;
            d = parts.find(function (b) {
              return b.deleted;
            }) ? parts.filter(function (b) {
              return b.deleted;
            }).length : 0; //console.log(`parts.BulkUpdate: created: ${c}; updated: ${u}; deleted: ${d}`);

            batch = fb.db.batch();
            parts.filter(function (b) {
              return b.created;
            }).forEach(function (item) {
              var part = fb.partsCollection.doc(item._uid);
              delete item.created;
              item._created = fb.fs.Timestamp.now();
              item._updated = fb.fs.Timestamp.now(); //batch.set(part,item);

              batchArray[batchIndex].set(part, item);
              operationCounter++;

              if (operationCounter === 499) {
                batchArray.push(fb.db.batch());
                batchIndex++;
                operationCounter = 0;
              }
            });
            parts.filter(function (b) {
              return b.updated;
            }).forEach(function (item) {
              var part = fb.partsCollection.doc(item._uid); //delete item.created
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
              item._additionalMessage = null; //item.updated1 = fb.fs.FieldValue.delete()
              //batch.update(part,item);

              batchArray[batchIndex].update(part, item);
              operationCounter++;

              if (operationCounter === 499) {
                batchArray.push(fb.db.batch());
                batchIndex++;
                operationCounter = 0;
              }
            });
            parts.filter(function (b) {
              return b.deleted;
            }).forEach(function (item) {
              var part = fb.partsCollection.doc(item._uid);
              batchArray[batchIndex]["delete"](part);
              operationCounter++;

              if (operationCounter === 499) {
                batchArray.push(fb.db.batch());
                batchIndex++;
                operationCounter = 0;
              }
            });
            batchArray.forEach(function _callee2(batch) {
              return regeneratorRuntime.async(function _callee2$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      _context9.next = 2;
                      return regeneratorRuntime.awrap(batch.commit());

                    case 2:
                      return _context9.abrupt("return", _context9.sent);

                    case 3:
                    case "end":
                      return _context9.stop();
                  }
                }
              });
            });
            commit("REQUEST_COMPLETED");
            commit("SET_DATA", parts);

          case 16:
          case "end":
            return _context10.stop();
        }
      }
    });
  },
  createPart: function createPart(_ref9, payload) {
    var commit;
    return regeneratorRuntime.async(function createPart$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            commit = _ref9.commit;
            commit("REQUEST_STARTED");
            payload._created = fb.fs.Timestamp.now();
            _context11.next = 5;
            return regeneratorRuntime.awrap(fb.partsCollection.doc(payload._uid).set(payload));

          case 5:
            commit("REQUEST_COMPLETED");
            commit("SET_DATA", [payload]);

          case 7:
          case "end":
            return _context11.stop();
        }
      }
    });
  },
  updatePartState: function updatePartState(_ref10, payload) {
    var commit, dispatch;
    return regeneratorRuntime.async(function updatePartState$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            commit = _ref10.commit, dispatch = _ref10.dispatch;
            payload.part._state = payload.state;
            _context12.next = 4;
            return regeneratorRuntime.awrap(dispatch("updatePart", payload.part));

          case 4:
          case "end":
            return _context12.stop();
        }
      }
    });
  },
  updatePart: function updatePart(_ref11, payload) {
    var commit;
    return regeneratorRuntime.async(function updatePart$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            commit = _ref11.commit;
            //console.log("updatePart", payload._uid);
            commit("REQUEST_STARTED"); ////console.object('payload',payload)
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
            _context13.next = 10;
            return regeneratorRuntime.awrap(fb.partsCollection.doc(payload._uid).set(payload));

          case 10:
            commit("REQUEST_COMPLETED");
            commit("SET_DATA", [payload]);

          case 12:
          case "end":
            return _context13.stop();
        }
      }
    });
  },
  deletePart: function deletePart(_ref12, payload) {
    var commit;
    return regeneratorRuntime.async(function deletePart$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            commit = _ref12.commit;
            commit("REQUEST_STARTED");
            _context14.next = 4;
            return regeneratorRuntime.awrap(fb.partsCollection.doc(payload._uid)["delete"]());

          case 4:
            commit("REQUEST_COMPLETED");

          case 5:
          case "end":
            return _context14.stop();
        }
      }
    });
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
  deleteOrderParts: function deleteOrderParts(_ref13, _order_uid) {
    var commit, response, batchArray, operationCounter, batchIndex, parts, part_col;
    return regeneratorRuntime.async(function deleteOrderParts$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            commit = _ref13.commit;
            commit("REQUEST_STARTED");
            _context16.next = 4;
            return regeneratorRuntime.awrap(fb.partsCollection.where("_order_uid", "==", _order_uid).get());

          case 4:
            response = _context16.sent;

            if (!response.empty) {
              _context16.next = 7;
              break;
            }

            return _context16.abrupt("return", true);

          case 7:
            batchArray = [];
            batchArray.push(fb.db.batch());
            operationCounter = 0;
            batchIndex = 0;
            parts = [];
            _context16.next = 14;
            return regeneratorRuntime.awrap(fb.partsCollection.where("_order_uid", "==", _order_uid).get());

          case 14:
            part_col = _context16.sent;
            part_col.forEach(function (doc) {
              return parts.push(doc.data());
            }); //console.log("deleteOrderParts.parts.length", parts.length);

            parts.forEach(function (item) {
              var part = fb.partsCollection.doc(item._uid);
              batchArray[batchIndex]["delete"](part);
              operationCounter++;

              if (operationCounter === 499) {
                batchArray.push(fb.db.batch());
                batchIndex++;
                operationCounter = 0;
              }
            });
            batchArray.forEach(function _callee3(batch) {
              return regeneratorRuntime.async(function _callee3$(_context15) {
                while (1) {
                  switch (_context15.prev = _context15.next) {
                    case 0:
                      _context15.next = 2;
                      return regeneratorRuntime.awrap(batch.commit());

                    case 2:
                      return _context15.abrupt("return", _context15.sent);

                    case 3:
                    case "end":
                      return _context15.stop();
                  }
                }
              });
            });
            commit("DELETE_DATA", {
              _order_uid: _order_uid
            });
            commit("REQUEST_COMPLETED");

          case 20:
          case "end":
            return _context16.stop();
        }
      }
    });
  },
  cleanPartsCache: function cleanPartsCache(_ref14) {
    var commit = _ref14.commit;
    commit("DELETE_DATA");
  }
};
var mutations = {
  SET_DATA: function SET_DATA(state, payload) {
    var old = state.data.length; //remove existing in payload items

    state.data = state.data.filter(function (part) {
      return !payload.find(function (p) {
        return p._uid === part._uid;
      });
    }); //merge except deleted

    state.data = [].concat(_toConsumableArray(state.data), _toConsumableArray(payload.filter(function (p) {
      return !p.deleted;
    }))); //console.log(`parts.SET_DATA ${old}/${state.data.length}`);
  },
  DELETE_DATA: function DELETE_DATA(state, payload) {
    if (!payload) {
      state.data = [];
    } else {
      //console.log(`parts.DELETE_DATA.before: ${state.data.length}`);
      state.data = state.data.filter(function (part) {
        return part._order_uid !== payload._order_uid;
      });
    } //console.log(`parts.DELETE_DATA.after: ${state.data.length}`);

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
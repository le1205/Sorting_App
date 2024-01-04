"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = require("vuex");

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread({}, (0, _vuex.mapActions)("carts", ["getCart", "createCart", "updateCart", "updateCartAndContent", "deleteCart"]), {}, (0, _vuex.mapActions)("bins", ["getCartBins"]), {}, (0, _vuex.mapActions)("parts", ["getParts", "getBinParts", "getCartParts", "updatePart", "updatePartState"]), {
  initialize: function initialize() {
    var _this = this;

    var that, _ref, _ref2, _error, _response, _ref3, _ref4, error, response, binsCopy, cartParts, _ref5, _ref6;

    return regeneratorRuntime.async(function initialize$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //console.log("cart editor initialize");
            that = this;

            if (this.id) {
              _context2.next = 10;
              break;
            }

            this.mode = this.$constants.FORM_MODE.CREATE;
            this.data.id = this.$nanoid();
            this.data.alias = "";
            this.data.description = "";
            this.bins = [];
            _context2.next = 38;
            break;

          case 10:
            _context2.next = 12;
            return regeneratorRuntime.awrap((0, _awaitToJs["default"])(that.getCart({
              id: this.id
            })));

          case 12:
            _ref = _context2.sent;
            _ref2 = _slicedToArray(_ref, 2);
            _error = _ref2[0];
            _response = _ref2[1];

            if (_response) {
              _context2.next = 19;
              break;
            }

            this.$refs.dialog.open("getCart", _error.message, {
              OK: "OK"
            });
            return _context2.abrupt("return");

          case 19:
            Object.assign(that.data, _response);
            _context2.next = 22;
            return regeneratorRuntime.awrap((0, _awaitToJs["default"])(this.getCartBins({
              cartId: this.id
            })));

          case 22:
            _ref3 = _context2.sent;
            _ref4 = _slicedToArray(_ref3, 2);
            error = _ref4[0];
            response = _ref4[1];

            if (response) {
              _context2.next = 29;
              break;
            }

            this.$refs.dialog.open("getCartBins", error.message, {
              OK: "OK"
            });
            return _context2.abrupt("return");

          case 29:
            binsCopy = JSON.parse(JSON.stringify(response));
            this.bins = []; //const binids = response.map((i) => i.id);

            _context2.next = 33;
            return regeneratorRuntime.awrap((0, _awaitToJs["default"])(this.getCartParts({
              _cart_uid: this.id
            })));

          case 33:
            _ref5 = _context2.sent;
            _ref6 = _slicedToArray(_ref5, 2);
            error = _ref6[0];
            cartParts = _ref6[1];
            binsCopy.forEach(function _callee(bin) {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      bin.i = bin.id;
                      bin.x = bin.x || 0;
                      bin.y = bin.y || 0;
                      bin.w = bin.w || 1;
                      bin.h = bin.h || 1;
                      bin.isLoading = false;
                      bin.selected = false;
                      bin.parts = cartParts.filter(function (p) {
                        return p._bin_uid === bin.id;
                      }); //bin.parts = []

                      _this.bins.push(bin);

                    case 9:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });

          case 38:
            // this.$forceUpdate()
            this.$emit('initialized');

          case 39:
          case "end":
            return _context2.stop();
        }
      }
    }, null, this);
  },
  getBinColor: function getBinColor(bin) {
    if (bin.selected) return "selected";
    if (!bin.parts || bin.partsTotal === 0) return "";
    if (bin.partsTotal > 0 && bin.partsDM) return "purple accent-1";
    if (bin.partsOK < bin.partsTotal) return "yellow accent-1";
    if (bin.partsTotal > 0 && bin.partsOK === bin.partsTotal) return "green accent-1";
  },
  save: function save() {
    var parts;
    return regeneratorRuntime.async(function save$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (this.$refs.form.validate()) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return");

          case 2:
            if (!(this.mode === this.$constants.FORM_MODE.CREATE)) {
              _context3.next = 5;
              break;
            }

            _context3.next = 5;
            return regeneratorRuntime.awrap(this.createCart({
              data: this.data,
              bins: this.bins
            }));

          case 5:
            if (!(this.mode === this.$constants.FORM_MODE.EDIT)) {
              _context3.next = 10;
              break;
            }

            parts = [];
            this.bins.filter(function (bin) {
              return bin.parts && bin.parts.length > 0;
            }).forEach(function (bin) {
              parts = [].concat(_toConsumableArray(parts), _toConsumableArray(bin.parts));
            });
            _context3.next = 10;
            return regeneratorRuntime.awrap(this.updateCartAndContent({
              data: this.data,
              bins: this.bins,
              parts: parts
            }));

          case 10:
            this.isModified = false;
            /*
            this.$router.push({
              name: "carts",
            });
            */

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, null, this);
  },
  close: function close() {
    var result;
    return regeneratorRuntime.async(function close$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!this.isModified) {
              _context4.next = 6;
              break;
            }

            _context4.next = 3;
            return regeneratorRuntime.awrap(this.$refs.dialog.open("Warning", "Cart has unsaved changes! Do you want to proceed?", {
              OK: "YES",
              CANCEL: "NO"
            }));

          case 3:
            result = _context4.sent;

            if (result) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return");

          case 6:
            this.isModified = false;
            this.$router.push({
              name: "carts"
            });

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, null, this);
  },
  addBin: function addBin() {
    var maxRow = this.bins && this.bins.length > 0 ? this.bins.reduce(function (a, b) {
      return a.y > b.y ? a : b;
    }).y : 0;
    var uid = this.$nanoid();
    var bin = {
      cartId: this.data.id,
      id: uid,
      order: 1,
      description: "",
      width: 2,
      height: 2,
      depth: 2,
      maxPartsCount: 10,
      partsOK: 0,
      partsDM: 0,
      i: uid,
      x: 0,
      //this.bins.length % (this.data.colNum || 12),
      y: maxRow + 1,
      //this.bins.length + (this.data.colNum || 12), // puts it at the bottom
      w: 1,
      h: 1,
      isLoading: false,
      created: true
    };
    this.bins.push(bin);
  },
  onBinClick: function onBinClick(item) {
    //enable single selection in view mode
    this.bins.forEach(function (bin) {
      if (bin.id !== item.id) bin.selected = false;
    });
    item.selected = !item.selected;
    this.$emit("bin-selected", item.selected ? item : undefined);
    this.isModified = true; ////console.log(item.selected)
  },
  selectAllBins: function selectAllBins() {
    this.bins.forEach(function (bin) {
      bin.selected = true;
    });
  },
  deSelectAllBins: function deSelectAllBins() {
    this.bins.forEach(function (bin) {
      bin.selected = false;
    });
  },
  openBulkBinEditor: function openBulkBinEditor() {
    this.$refs["bin-editor-bulk"].open();
  },
  onBulkBinUpdate: function onBulkBinUpdate(payload) {
    var _this2 = this;

    var binUpdated = false;
    this.bins.filter(function (b) {
      return b.selected;
    }).forEach(function (bin) {
      if (payload.maxPartsCount) {
        bin.maxPartsCount = payload.maxPartsCount;
        binUpdated = true;
      }

      if (payload.width) {
        bin.width = payload.width;
        binUpdated = true;
      }

      if (payload.height) {
        bin.height = payload.height;
        binUpdated = true;
      }

      if (payload.depth) {
        bin.depth = payload.depth;
        binUpdated = true;
      }

      bin.updated = binUpdated;
      if (binUpdated) _this2.isModified = true;
    });
  },
  editBin: function editBin(item) {
    this.$refs["bin-editor"].open({
      bin: item
    });
  },
  onSearchResultDetails: function onSearchResultDetails(part) {
    //console.log('onSearchResultDetails');
    this.showPartInBin(part);
  },
  closeSearchResults: function closeSearchResults() {
    this.$refs["search-results-modal"].close();
  },
  showPartLocation: function showPartLocation(part) {
    var _this3 = this;

    var bin = this.bins.find(function (b) {
      return b.id === part._bin_uid;
    });
    this.onBinUpdate(bin);
    var storage = Object.keys(this.$constants.STORAGE_TYPE).find(function (p) {
      return _this3.$constants.STORAGE_TYPE[p] === _this3.data.storage_type;
    });
    this.$refs["search-results-modal"].open(part, {
      top: part["BARCODE"],
      middle: "".concat(storage, " ").concat(this.data.alias),
      bottom: "BIN ".concat(bin.order)
    });
  },
  showPartInBin: function showPartInBin(part) {
    var bin = this.bins.find(function (b) {
      return b.id === part._bin_uid;
    });
    this.$refs["bin-editor"].open({
      bin: bin,
      part: part
    });
  },
  deleteBin: function deleteBin(payload) {
    var result, binIdx;
    return regeneratorRuntime.async(function deleteBin$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(this.$refs.dialog.open("Warning", "Bin #".concat(payload.id, " will be deleted! Do you want to proceed?"), {
              OK: "YES",
              CANCEL: "NO"
            }));

          case 2:
            result = _context5.sent;

            if (result) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt("return");

          case 5:
            binIdx = this.bins.findIndex(function (item) {
              return item.id === payload.id;
            });
            payload.deleted = true;

            _vue["default"].set(this.bins, binIdx, payload);

            this.isModified = true;

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, null, this);
  },
  onBinCreate: function onBinCreate(payload) {
    this.bins.push(payload);
    this.isModified = true;
  },
  updateBinPartsTotals: function updateBinPartsTotals(payload) {
    var that = this;

    if (payload.parts && payload.parts.length) {
      payload.partsOK = payload.parts.filter(function (p) {
        return p._bin_uid === payload.id;
      }).reduce(function (a, b) {
        return b._state === that.$constants.PART_STATE.OK && a + 1 || a;
      }, 0);
      payload.partsDM = payload.parts.filter(function (p) {
        return p._bin_uid === payload.id;
      }).reduce(function (a, b) {
        return (b._state === that.$constants.PART_STATE.MISSING || b._state === that.$constants.PART_STATE.DAMAGED) && a + 1 || a;
      }, 0);
      payload.partsTotal = payload.parts.filter(function (p) {
        return p._bin_uid === payload.id;
      }).length;
    } else {
      payload.partsOK = 0;
      payload.partsDM = 0;
      payload.partsTotal = 0;
    } ////console.log('updateBinPartsTotals.payload',payload)


    return payload;
  },
  onBinUpdate: function onBinUpdate(payload) {
    payload = this.updateBinPartsTotals(payload);
    var binIdx = this.bins.findIndex(function (item) {
      return item.id === payload.id;
    });

    _vue["default"].set(this.bins, binIdx, payload);

    this.isModified = true;
  },
  layoutUpdatedEvent: function layoutUpdatedEvent(newLayout) {
    var _this4 = this;

    //const current = JSON.stringify(this.bins)
    var temp = JSON.parse(JSON.stringify(newLayout)); //sort by y

    temp.sort(function (a, b) {
      return a.y > b.y ? 1 : -1;
    }); //get unique y values

    var uy = _toConsumableArray(new Set(temp.map(function (i) {
      return i.y;
    }))); //sort by x in a row


    uy.forEach(function (y) {
      var row = temp.filter(function (i) {
        return i.y === y;
      });
      row.sort(function (a, b) {
        return a.x < b.x ? -1 : 1;
      });
      var other = temp.filter(function (i) {
        return i.y !== y;
      });
      temp = [].concat(_toConsumableArray(other), _toConsumableArray(row));
    }); //update order property

    var _loop = function _loop(i) {
      var bin = _this4.bins.find(function (b) {
        return b.id === temp[i].id;
      });

      bin = _this4.updateBinPartsTotals(bin);
      bin.order = i + 1;
      bin.updated = true;
      bin.selected = false;
    };

    for (var i = 0; i < temp.length; i++) {
      _loop(i);
    } //this.bins = w
    //this.isModified = true;

    /*
    newLayout.forEach( bin => {
      bin.updated = true
    })
    */

  },
  cleanupSelectedBins: function cleanupSelectedBins() {
    var result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, bin, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, part;

    return regeneratorRuntime.async(function cleanupSelectedBins$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap(this.$refs.dialog.open("Warning", "Selected bins will be emptied! Do you want to proceed?", {
              OK: "YES",
              CANCEL: "NO"
            }));

          case 2:
            result = _context6.sent;

            if (result) {
              _context6.next = 5;
              break;
            }

            return _context6.abrupt("return");

          case 5:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context6.prev = 8;
            _iterator = this.bins.filter(function (bin) {
              return bin.parts.length > 0 && bin.selected;
            })[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context6.next = 37;
              break;
            }

            bin = _step.value;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context6.prev = 15;

            for (_iterator2 = bin.parts[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              part = _step2.value;
              //unlink part from the bin and cart
              part._cart_uid = null;
              part._bin_uid = null;
              part._cart_alias = null;
              part._bin_order = null;
              part._state = null;
              part.updated = true; //update storage and cache
              //20201115
              //await this.updatePart(part);
            }

            _context6.next = 23;
            break;

          case 19:
            _context6.prev = 19;
            _context6.t0 = _context6["catch"](15);
            _didIteratorError2 = true;
            _iteratorError2 = _context6.t0;

          case 23:
            _context6.prev = 23;
            _context6.prev = 24;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 26:
            _context6.prev = 26;

            if (!_didIteratorError2) {
              _context6.next = 29;
              break;
            }

            throw _iteratorError2;

          case 29:
            return _context6.finish(26);

          case 30:
            return _context6.finish(23);

          case 31:
            //console.log("cleanupSelectedBins ".concat(bin.id, " parts updated")); //20201115
            //bin.parts = [];
            //update bin totals

            this.onBinUpdate(bin);
            this.isModified = true;

          case 34:
            _iteratorNormalCompletion = true;
            _context6.next = 10;
            break;

          case 37:
            _context6.next = 43;
            break;

          case 39:
            _context6.prev = 39;
            _context6.t1 = _context6["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context6.t1;

          case 43:
            _context6.prev = 43;
            _context6.prev = 44;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 46:
            _context6.prev = 46;

            if (!_didIteratorError) {
              _context6.next = 49;
              break;
            }

            throw _iteratorError;

          case 49:
            return _context6.finish(46);

          case 50:
            return _context6.finish(43);

          case 51:
            /*
                await this.$refs.dialog.open(
                  "Info",
                  `Clean up completed!`,
                  {
                    OK: "OK",
                  }
                );
                */
            //console.log("cleanupSelectedBins completed");

          case 52:
          case "end":
            return _context6.stop();
        }
      }
    }, null, this, [[8, 39, 43, 51], [15, 19, 23, 31], [24,, 26, 30], [44,, 46, 50]]);
  }
});

exports["default"] = _default;
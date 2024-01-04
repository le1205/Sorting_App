"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var filters = {
  sortByParentsWithChilds_old: function sortByParentsWithChilds_old(parts) {
    var parents = [],
        childs = [],
        other = [],
        result = []; //get parent parts

    parents = parts.filter(function (p) {
      return +p["MPE TYPE"] === 1;
    }); //insert parent+childs

    parents.forEach(function (parent) {
      //insert parent
      result = [].concat(_toConsumableArray(result), [parent]);
      childs = parts.filter(function (p) {
        return +p["PARENT ID"] === +parent["ID"];
      }); //insert childs

      result = [].concat(_toConsumableArray(result), _toConsumableArray(childs));
    }); //insert remaining

    other = parts.filter(function (p) {
      return !result.map(function (p) {
        return +p["ID"];
      }).includes(+p["ID"]);
    });
    result = [].concat(_toConsumableArray(result), _toConsumableArray(other));
    return result;
  },

  /*max Article size & Part side  */
  calculateMS: function calculateMS(_parts) {
    _parts.forEach(function (part, index, partsArray) {
      var articleParts = partsArray.filter(function (p) {
        return p['ART ID'] === part["ART ID"];
      });
      var articleMaxWidth = Math.max.apply(Math, _toConsumableArray(articleParts.map(function (p) {
        return p._width_decimal;
      })));
      var articleMaxLength = Math.max.apply(Math, _toConsumableArray(articleParts.map(function (p) {
        return p._length_decimal;
      })));
      var articleMaxSize = Math.max(articleMaxWidth, articleMaxLength);
      partsArray[index].articleMaxSize = articleMaxSize;
      partsArray[index].partMaxSide = Math.max(part._length_decimal, part._width_decimal);
    });

    return _parts;
  },
  sortByParentsWithChilds: function sortByParentsWithChilds(parts) {
    /*
    1. Set max article size for each part
    2. Sort by max article size descending
    3. Select parents, collect childs
    4. Add rest of parts
    */
    var parents = [],
        childs = [],
        other = [],
        result = []; //sort my AMS descending

    parts.sort(function (a, b) {
      return a.articleMaxSize < b.articleMaxSize ? 1 : -1;
    }); //sort by part max side descending

    parts.sort(function (a, b) {
      if (a["ART ID"] === b["ART ID"]) {
        return a.partMaxSide < b.partMaxSide ? 1 : -1;
      }

      return 1;
    }); //
    //const ppp = parts.map( p => (`${p["ID"]}, AMS=${p.articleMaxSize}, MS=${Math.max(p._length_decimal,p._width_decimal)}`))
    // debugger
    //get parent parts

    parents = parts.filter(function (p) {
      return +p["MPE TYPE"] === 1;
    }); //insert parent+childs

    parents.forEach(function (parent) {
      //insert parent
      result = [].concat(_toConsumableArray(result), [parent]);
      childs = parts.filter(function (p) {
        return +p["PARENT ID"] === +parent["ID"];
      }); //insert childs

      result = [].concat(_toConsumableArray(result), _toConsumableArray(childs));
    }); //insert remaining

    other = parts.filter(function (p) {
      return !result.map(function (p) {
        return +p["ID"];
      }).includes(+p["ID"]);
    });
    result = [].concat(_toConsumableArray(result), _toConsumableArray(other));
    return result;
  },
  getParentsWithChilds: function getParentsWithChilds(parts, conditions) {
    var parents = [],
        childs = [],
        result = []; //get parent parts

    if (conditions.typ && conditions.typ.length) {
      parents = parts.filter(function (p) {
        return +p["MPE TYPE"] === 1 && conditions.typ.includes(+p["TYP"]);
      });
    } //Multi Parts All parts with a MPE TYPE value of 1 ( except TYP 8,23)
    else if (conditions.typ_exclude && conditions.typ_exclude.length) {
        parents = parts.filter(function (p) {
          return +p["MPE TYPE"] === 1 && !conditions.typ_exclude.includes(+p["TYP"]);
        });
      }

    result = [].concat(_toConsumableArray(result), _toConsumableArray(parents)); //get childs

    parents.forEach(function (parent) {
      childs = parts.filter(function (p) {
        return +p["PARENT ID"] === +parent["ID"];
      });
      result = [].concat(_toConsumableArray(result), _toConsumableArray(childs));
    });
    return result;
  },
  getParentsWithoutChilds: function getParentsWithoutChilds(parts, conditions) {
    var parents = [],
        childs = [],
        result = []; //get parent parts

    if (conditions.typ && conditions.typ.length) {
      parents = parts.filter(function (p) {
        return +p["MPE TYPE"] === 1 && conditions.typ.includes(+p["TYP"]);
      });
    } //Multi Parts All parts with a MPE TYPE value of 1 ( except TYP 8,23)
    else if (conditions.typ_exclude && conditions.typ_exclude.length) {
        parents = parts.filter(function (p) {
          return +p["MPE TYPE"] === 1 && !conditions.typ_exclude.includes(+p["TYP"]);
        });
      }

    return parents;
  },
  getChildsWithoutParents: function getChildsWithoutParents(parts, conditions) {
    var parents = [],
        childs = [],
        result = []; //get parent parts

    if (conditions.typ && conditions.typ.length) {
      parents = parts.filter(function (p) {
        return +p["MPE TYPE"] === 1 && conditions.typ.includes(+p["TYP"]);
      });
    } //Multi Parts All parts with a MPE TYPE value of 1 ( except TYP 8,23)
    else if (conditions.typ_exclude && conditions.typ_exclude.length) {
        parents = parts.filter(function (p) {
          return +p["MPE TYPE"] === 1 && !conditions.typ_exclude.includes(+p["TYP"]);
        });
      } //get childs


    parents.forEach(function (parent) {
      childs = parts.filter(function (p) {
        return +p["PARENT ID"] === +parent["ID"];
      });
      result = [].concat(_toConsumableArray(result), _toConsumableArray(childs));
    });
    return result;
  },
  getSingleParts: function getSingleParts(parts, conditions) {
    var parents = [],
        childs = [],
        parentChild = [],
        result = []; //get parent parts

    if (conditions.typ && conditions.typ.length) {
      parents = parts.filter(function (p) {
        return +p["MPE TYPE"] === 1 && conditions.typ.includes(+p["TYP"]);
      });
    }

    parentChild = [].concat(_toConsumableArray(parentChild), _toConsumableArray(parents)); //get childs

    parents.forEach(function (parent) {
      childs = parts.filter(function (p) {
        return +p["PARENT ID"] === +parent["ID"];
      });
      parentChild = [].concat(_toConsumableArray(parentChild), _toConsumableArray(childs));
    });
    result = parts.filter(function (p) {
      return conditions.typ.includes(+p["TYP"]) && !parentChild.map(function (pc) {
        return +pc["ID"];
      }).includes(+p["ID"]);
    });
    return result;
  }
};
var _default = filters;
exports["default"] = _default;
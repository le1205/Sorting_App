const filters = {
  sortByParentsWithChilds_old(parts) {
    let parents = [],
      childs = [],
      other = [],
      result = [];

    //get parent parts
    parents = parts.filter((p) => +p["MPE TYPE"] === 1);

    //insert parent+childs
    parents.forEach((parent) => {
      //insert parent
      result = [...result, ...[parent]];

      childs = parts.filter((p) => +p["PARENT ID"] === +parent["ID"]);
      //insert childs
      result = [...result, ...childs];
    });

    //insert remaining
    other = parts.filter(
      (p) => !result.map((p) => +p["ID"]).includes(+p["ID"])
    );

    result = [...result, ...other];

    return result;
  },
  /*max Article size & Part side  */
  calculateMS(_parts) {
    _parts.forEach(function (part, index, partsArray) {
      const articleParts = partsArray.filter(
        (p) => p["ART ID"] === part["ART ID"]
      );

      const articleMaxWidth = Math.max(
        ...articleParts.map((p) => p._width_decimal)
      );
      const articleMaxLength = Math.max(
        ...articleParts.map((p) => p._length_decimal)
      );

      const articleMaxSize = Math.max(articleMaxWidth, articleMaxLength);

      partsArray[index].articleMaxSize = articleMaxSize;

      partsArray[index].partMaxSide = Math.max(
        part._length_decimal,
        part._width_decimal
      );
    });

    return _parts;
  },
  sortByParentsWithChilds(parts) {
    /*
    1. Set max article size for each part
    2. Sort by max article size descending
    3. Select parents, collect childs
    4. Add rest of parts
    */

    let parents = [],
      childs = [],
      other = [],
      result = [];

    //sort my AMS descending
    parts.sort((a, b) => (a.articleMaxSize < b.articleMaxSize ? 1 : -1));

    //sort by part max side descending
    parts.sort(function (a, b) {
      if (a["ART ID"] === b["ART ID"]) {
        return a.partMaxSide < b.partMaxSide ? 1 : -1;
      }

      return 1;
    });

    //
    //const ppp = parts.map( p => (`${p["ID"]}, AMS=${p.articleMaxSize}, MS=${Math.max(p._length_decimal,p._width_decimal)}`))

    // debugger
    //get parent parts
    parents = parts.filter((p) => +p["MPE TYPE"] === 1);

    //insert parent+childs
    parents.forEach((parent) => {
      //insert parent
      result = [...result, ...[parent]];

      childs = parts.filter((p) => +p["PARENT ID"] === +parent["ID"]);
      //insert childs
      result = [...result, ...childs];
    });

    //insert remaining
    other = parts.filter(
      (p) => !result.map((p) => +p["ID"]).includes(+p["ID"])
    );

    result = [...result, ...other];

    return result;
  },

  getParentsWithChilds(parts, conditions) {
    let parents = [],
      childs = [],
      result = [];

    //get parent parts
    if (conditions.typ && conditions.typ.length) {
      parents = parts.filter(
        (p) => +p["MPE TYPE"] === 1 && conditions.typ.includes(+p["TYP"])
      );
    } //Multi Parts All parts with a MPE TYPE value of 1 ( except TYP 8,23)
    else if (conditions.typ_exclude && conditions.typ_exclude.length) {
      parents = parts.filter(
        (p) =>
          +p["MPE TYPE"] === 1 && !conditions.typ_exclude.includes(+p["TYP"])
      );
    }

    result = [...result, ...parents];

    //get childs
    parents.forEach((parent) => {
      childs = parts.filter((p) => +p["PARENT ID"] === +parent["ID"]);

      result = [...result, ...childs];
    });

    return result;
  },

  getParentsWithoutChilds(parts, conditions) {
    let parents = [],
      childs = [],
      result = [];
    //get parent parts
    if (conditions.typ && conditions.typ.length) {
      parents = parts.filter(
        (p) => +p["MPE TYPE"] === 1 && conditions.typ.includes(+p["TYP"])
      );
    } //Multi Parts All parts with a MPE TYPE value of 1 ( except TYP 8,23)
    else if (conditions.typ_exclude && conditions.typ_exclude.length) {
      parents = parts.filter(
        (p) =>
          +p["MPE TYPE"] === 1 && !conditions.typ_exclude.includes(+p["TYP"])
      );
    }

    return parents;
  },

  getParentsWithoutChildsNew(parts, conditions) {
    let parents = [],
      childs = [],
      result = [];
    //get parent parts
    if (conditions.typ && conditions.typ.length) {
      parents = parts.filter(
        (p) => +p["MPE TYPE"] === 0 && conditions.typ.includes(+p["TYP"])
      );
    } //Multi Parts All parts with a MPE TYPE value of 1 ( except TYP 8,23)
    else if (conditions.typ_exclude && conditions.typ_exclude.length) {
      parents = parts.filter(
        (p) =>
          +p["MPE TYPE"] === 0 && !conditions.typ_exclude.includes(+p["TYP"])
      );
    }

    return parents;
  },

  getChildsWithoutParents(parts, conditions) {
    let parents = [],
      childs = [],
      result = [];

    //get parent parts
    if (conditions.typ && conditions.typ.length) {
      parents = parts.filter(
        (p) => +p["MPE TYPE"] === 1 && conditions.typ.includes(+p["TYP"])
      );
    } //Multi Parts All parts with a MPE TYPE value of 1 ( except TYP 8,23)
    else if (conditions.typ_exclude && conditions.typ_exclude.length) {
      parents = parts.filter(
        (p) =>
          +p["MPE TYPE"] === 1 && !conditions.typ_exclude.includes(+p["TYP"])
      );
    }

    //get childs
    parents.forEach((parent) => {
      childs = parts.filter((p) => +p["PARENT ID"] === +parent["ID"]);

      result = [...result, ...childs];
    });

    return result;
  },

  getSingleParts(parts, conditions) {
    let parents = [],
      childs = [],
      parentChild = [],
      result = [];

    //get parent parts
    if (conditions.typ && conditions.typ.length) {
      parents = parts.filter(
        (p) => +p["MPE TYPE"] === 1 && conditions.typ.includes(+p["TYP"])
      );
    }

    parentChild = [...parentChild, ...parents];

    //get childs
    parents.forEach((parent) => {
      childs = parts.filter((p) => +p["PARENT ID"] === +parent["ID"]);

      parentChild = [...parentChild, ...childs];
    });

    result = parts.filter(
      (p) =>
        conditions.typ.includes(+p["TYP"]) &&
        !parentChild.map((pc) => +pc["ID"]).includes(+p["ID"])
    );

    return result;
  },
};

export default filters;

import Vue from "vue";

import { mapActions } from "vuex";

import to from "await-to-js";

export default {
  ...mapActions("carts", ["getCart", "createCart", "updateCart","updateCartAndContent", "deleteCart"]),
  ...mapActions("bins", ["getCartBins"]),
  ...mapActions("parts", ["getParts", "getBinParts", "getCartParts","updatePart","updatePartState"]),

  async initialize() {
    //console.log("cart editor initialize");
    let that = this;



    if (!this.id) {
      this.mode = this.$constants.FORM_MODE.CREATE;

      this.data.id = this.$nanoid();
      this.data.alias = "";
      this.data.description = "";
      this.bins = [];
    } else {
      
      //that.mode = this.$constants.FORM_MODE.EDIT

      {
        let [error, response] = await to(
          that.getCart({
            id: this.id,
          })
        );

        if (!response) {
          this.$refs.dialog.open("getCart", error.message, {
            OK: "OK",
          });
          return;
        }
        Object.assign(that.data, response);
      }

      let [error, response] = await to(
        this.getCartBins({
          cartId: this.id,
        })
      );

      if (!response) {
        this.$refs.dialog.open("getCartBins", error.message, {
          OK: "OK",
        });
        return;
      }

      const binsCopy = JSON.parse(JSON.stringify(response))

      this.bins = [];

      //const binids = response.map((i) => i.id);

      let cartParts;

      [error, cartParts] = await to(
        this.getCartParts({
          _cart_uid: this.id,
        })
      );

      binsCopy.forEach(async (bin) => {
        bin.i = bin.id;
        bin.x = bin.x || 0;
        bin.y = bin.y || 0;
        bin.w = bin.w || 1;
        bin.h = bin.h || 1;
        bin.isLoading = false;
        bin.selected = false;

        bin.parts = cartParts.filter((p) => p._bin_uid === bin.id);
        //bin.parts = []

        this.bins.push(bin);
      });
    }
    // this.$forceUpdate()


    this.$emit('initialized')
  },

  getBinColor(bin) {
    if (bin.selected) return "selected";

    if (!bin.parts || bin.partsTotal === 0) return "";

    if (bin.partsTotal > 0 && bin.partsDM) return "purple accent-1";

    if (bin.partsOK < bin.partsTotal) return "yellow accent-1";

    if (bin.partsTotal > 0 && bin.partsOK === bin.partsTotal)
      return "green accent-1";
  },
  async save() {
    if (!this.$refs.form.validate()) return;

    if (this.mode === this.$constants.FORM_MODE.CREATE) {
      await this.createCart({
        data: this.data,
        bins: this.bins,
      });
    }

    if (this.mode === this.$constants.FORM_MODE.EDIT) {

      let parts = []


      this.bins.filter(bin => bin.parts && bin.parts.length > 0).forEach( bin => {
        parts = [...parts,...bin.parts]
      })

      await this.updateCartAndContent({
        data: this.data,
        bins: this.bins,
        parts: parts,
      });
    }

    this.isModified = false;
    /*
    this.$router.push({
      name: "carts",
    });
    */
  },
  async close() {
    if (this.isModified) {
      let result = await this.$refs.dialog.open(
        "Warning",
        `Cart has unsaved changes! Do you want to proceed?`,
        {
          OK: "YES",
          CANCEL: "NO",
        }
      );

      if (!result) return;
    }

    this.isModified = false;

    this.$router.push({
      name: "carts",
    });
  },

  addBin() {
    const maxRow =
      this.bins && this.bins.length > 0
        ? this.bins.reduce((a, b) => (a.y > b.y ? a : b)).y
        : 0;

    const uid = this.$nanoid();
    let bin = {
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
      x: 0, //this.bins.length % (this.data.colNum || 12),
      y: maxRow + 1, //this.bins.length + (this.data.colNum || 12), // puts it at the bottom

      w: 1,
      h: 1,
      isLoading: false,
      created: true,
    };

    this.bins.push(bin);
  },
  onBinClick(item) {
    //enable single selection in view mode
    this.bins.forEach((bin) => {
      if (bin.id !== item.id) bin.selected = false;
    });

    item.selected = !item.selected;

    this.$emit("bin-selected", item.selected ? item : undefined);

    this.isModified = true

    ////console.log(item.selected)
  },
  selectAllBins() {
    this.bins.forEach((bin) => {
      bin.selected = true;
    });
  },
  deSelectAllBins() {
    this.bins.forEach((bin) => {
      bin.selected = false;
    });
  },
  openBulkBinEditor() {
    this.$refs["bin-editor-bulk"].open();
  },
  onBulkBinUpdate(payload) {

    let binUpdated = false

    this.bins
      .filter((b) => b.selected)
      .forEach((bin) => {

        if (payload.maxPartsCount) { bin.maxPartsCount = payload.maxPartsCount; binUpdated = true;}
        if (payload.width) {bin.width = payload.width; binUpdated = true;}
        if (payload.height) {bin.height = payload.height; binUpdated = true;}
        if (payload.depth) {bin.depth = payload.depth; binUpdated = true;}
        
        bin.updated = binUpdated

        if (binUpdated) this.isModified = true;
    
      });

  },

  editBin(item) {

    this.$refs["bin-editor"].open({bin: item});

  },
  onSearchResultDetails(part){

    //console.log('onSearchResultDetails')

    this.showPartInBin( part );

},  
closeSearchResults(){
  this.$refs["search-results-modal"].close()
},
  showPartLocation(part) {

    //can be empty or "Part already scanned"
    let additionalMessage = part._additionalMessage;

    let bin = this.bins.find(b => b.id === part._bin_uid)

    bin = this.updateBinPartsTotals(bin)

//console.log(bin.partsOK,bin.partsTotal, bin.parts.length )
    if (bin.partsOK === bin.partsTotal){
      additionalMessage = 'All parts in bin!'
    }

    this.onBinUpdate(bin)

    const storage = Object.keys(this.$constants.STORAGE_TYPE).find( p => this.$constants.STORAGE_TYPE[p] === this.data.storage_type)

    //this.$refs["search-results-modal"].open(part,{top: additionalMessage, middle: `${storage} ${this.data.alias}`, bottom: `BIN ${bin.order}`});
    this.$refs["search-results-modal"].open(part,{top: additionalMessage, middle: `${this.data.alias}`, bottom: `BIN ${bin.order}`});

    

  },

  showPartInBin(part) {

    const bin = this.bins.find(b => b.id === part._bin_uid)
    
    this.$refs["bin-editor"].open({bin: bin, part: part});

  },

  async deleteBin(payload) {
    let result = await this.$refs.dialog.open(
      "Warning",
      `Bin #${payload.id} will be deleted! Do you want to proceed?`,
      {
        OK: "YES",
        CANCEL: "NO",
      }
    );

    if (!result) return;

    let binIdx = this.bins.findIndex((item) => item.id === payload.id);

    payload.deleted = true;

    Vue.set(this.bins, binIdx, payload);

    this.isModified = true;
  },

  onBinCreate(payload) {
    this.bins.push(payload);

    this.isModified = true;
  },
  updateBinPartsTotals(payload) {
    const that = this;

    if (payload.parts && payload.parts.length) {

      payload.partsOK = payload.parts.filter( p => p._bin_uid === payload.id).reduce(function(a, b) {
        return (b._state === that.$constants.PART_STATE.OK && a + 1) || a;
      }, 0);

      payload.partsDM = payload.parts.filter( p => p._bin_uid === payload.id).reduce(function(a, b) {
        return (
          ((b._state === that.$constants.PART_STATE.MISSING ||
            b._state === that.$constants.PART_STATE.DAMAGED) &&
            a + 1) ||
          a
        );
      }, 0);

      payload.partsTotal = payload.parts.filter( p => p._bin_uid === payload.id).length;

    } else {
      payload.partsOK = 0;
      payload.partsDM = 0;
      payload.partsTotal = 0;
    }

    ////console.log('updateBinPartsTotals.payload',payload)

    return payload;
  },
  onBinUpdate(payload) {

    payload = this.updateBinPartsTotals(payload);

    let binIdx = this.bins.findIndex((item) => item.id === payload.id);

    Vue.set(this.bins, binIdx, payload);

    this.isModified = true;
  },
  layoutUpdatedEvent(newLayout) {
    //const current = JSON.stringify(this.bins)
    let temp = JSON.parse(JSON.stringify(newLayout));

    //sort by y
    temp.sort((a, b) => (a.y > b.y ? 1 : -1));

    //get unique y values
    let uy = [...new Set(temp.map((i) => i.y))];

    //sort by x in a row
    uy.forEach((y) => {
      let row = temp.filter((i) => i.y === y);

      row.sort((a, b) => (a.x < b.x ? -1 : 1));

      let other = temp.filter((i) => i.y !== y);

      temp = [...other, ...row];
    });

    //update order property
    for (let i = 0; i < temp.length; i++) {
      let bin = this.bins.find((b) => b.id === temp[i].id);

      bin = this.updateBinPartsTotals(bin);

      bin.order = i + 1;
      bin.updated = true;
      bin.selected = false;
    }

    //this.bins = w

    //this.isModified = true;
    /*
    newLayout.forEach( bin => {
      bin.updated = true
    })
*/
  },
  async cleanupSelectedBins() {
    let result = await this.$refs.dialog.open(
      "Warning",
      `Selected bins will be emptied! Do you want to proceed?`,
      {
        OK: "YES",
        CANCEL: "NO",
      }
    );

    if (!result) return;

    for (let bin of this.bins.filter(
      (bin) => bin.parts.length > 0 && bin.selected
    )) {


      for (let part of bin.parts) {
        //unlink part from the bin and cart
        part._cart_uid = null;
        part._bin_uid = null;
        part._cart_alias = null;
        part._bin_order = null;
        part._state = null; 

        part.updated = true;

        //update storage and cache
        //20201115
        //await this.updatePart(part);
      }

      //console.log(`cleanupSelectedBins ${bin.id} parts updated`);
      //20201115
      //bin.parts = [];

      //update bin totals
      this.onBinUpdate(bin);

      this.isModified = true;
    }
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
  },
};

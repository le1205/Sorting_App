<template>
  <v-container fluid>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-card height="80vh">
      <!--  <v-card-title></v-card-title> -->
      <v-form ref="form">
        <v-container class="ma-0 pb-0" fluid>
          <v-row class="pb-0">
            <!--
                    <v-col cols="4" md="4">
                        <v-text-field v-model="data.id" label="Order #" :rules="rules" :disabled="true"></v-text-field>
                    </v-col>
                    -->
            <v-col cols="auto" class="pb-0">
              <v-text-field
                dense
                v-model="data.name"
                label="Name"
                :rules="rules"
                @change="isModified = true"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <v-container class="ma-0" fluid>
        <v-row no-gutters>
          <v-col cols="auto">
            <v-btn class="ma-2" fab @click="close">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>

            <v-btn
              :color="isModified ? 'primary' : ''"
              :disabled="!isModified"
              class="ma-2"
              fab
              @click="save"
            >
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn
              class="ma-2"
              fab
              :disabled="!parts.items.length"
              @click="deletePartsFromOrder()"
            >
              <v-icon dark>mdi-trash-can-outline</v-icon>
            </v-btn>

            <v-btn
              color="primary"
              class="ma-2"
              fab
              :disabled="parts.items.length > 0"
              :loading="isSelecting"
              @click="onFileUpload"
            >
              <v-icon dark>mdi-cloud-upload</v-icon>
            </v-btn>

            <v-btn
              class="ma-2"
              fab
              @click="showFilteringDialog"
              :disabled="!parts.items.length"
            >
              <v-icon dark>mdi-filter-outline</v-icon>
            </v-btn>
            <v-btn
              class="ma-2"
              fab
              @click="undoPartsSelection"
              :disabled="!selectedParts.length"
            >
              <v-icon dark>mdi-filter-off-outline</v-icon>
            </v-btn>

            <v-btn
              color="warning"
              class="ma-2"
              fab
              @click="distributeParts"
              :disabled="!selectedParts.length || !selectedCarts.length"
            >
              <v-icon dark>mdi-card-plus</v-icon>
            </v-btn>

            <v-btn
              color="danger"
              class="ma-2"
              fab
              @click="undoPartsDistribution"
              :disabled="!selectedParts.length"
            >
              <v-icon dark>mdi-card-remove-outline</v-icon>
            </v-btn>

            <v-badge
              light
              top
              overlap
              :content="logsData.length"
              :value="logsData.length"
            >
              <v-btn class="ma-2" fab @click="showLogsDialog">
                <v-icon dark>mdi-file-document-multiple-outline</v-icon>
              </v-btn>
            </v-badge>

            <input
              ref="uploader"
              class="d-none"
              type="file"
              accept="xlsx/*"
              @change="onFileChanged"
            />
            <!--<v-file-input v-model="file" show-size label="Select file..."></v-file-input>-->
          </v-col>
          <v-col sm="12" md="12" lg="4" class="m-4" v-if="selectedParts.length">
            <v-select
              v-model="selectedCarts"
              :items="availableCarts"
              chips
              :deletable-chips="true"
              label="Carts for distribution"
              multiple
              outlined
            ></v-select>
          </v-col>
        </v-row>

        <xlsx-read :file="selectedFile" @loading="onFileLoading">
          <xlsx-json ref="xlsx"> </xlsx-json>
        </xlsx-read>
      </v-container>

      <!-- <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>-->

      <v-data-table
        fixed-header
        dense
        height="65vh"
        ref="dataTable"
        v-model="selectedParts"
        :headers="headers"
        :items="parts.items.filter((part) => !part.deleted)"
        :search="search"
        :items-per-page="50"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100, 200, -1],
        }"
        show-select
        :single-select="false"
        item-key="_uid"
        class="elevation-1"
      >
        <template v-slot:header="{ props: { headers } }">
          <tr>
            <td
              class="pl-1"
              v-for="(h, index) in headers.filter((h) => h.value !== 'action')"
              :key="`column-filter-${index}`"
            >
              <v-select
                v-if="index === 0"
                :items="[
                  { text: 'All', value: 0 },
                  { text: 'Yes', value: 1 },
                  { text: 'No', value: 2 },
                ]"
                v-model="columnFilters.selected"
                label=""
              ></v-select>
              <v-text-field
                v-if="index !== 0"
                v-model="columnFilters[h.value]"
                type="text"
                label=""
                clear-icon="mdi-close-circle"
                clearable
              ></v-text-field>
            </td>
          </tr>
        </template>

        <template v-slot:item="{ item, isSelected, select }">
          <tr
            :class="isSelected ? 'yellow' : ''"
            v-if="
              (columnFilters.selected === 1 && isSelected) ||
              (columnFilters.selected === 2 && !isSelected) ||
              !columnFilters.selected
            "
          >
            <td @click="toggle(isSelected, select, $event)">
              <v-icon class="px-1" v-if="isSelected"
                >mdi-checkbox-marked</v-icon
              >
              <v-icon class="px-1" v-if="!isSelected"
                >mdi-checkbox-blank-outline</v-icon
              >
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('ORDERNAME')"
            >
              {{ item["ORDERNAME"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('ART ID')"
            >
              {{ item["ART ID"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('ID')"
            >
              {{ item["ID"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('TYP')"
            >
              {{ item["TYP"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('NAME1')"
            >
              {{ item["NAME1"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('MPE TYPE')"
            >
              {{ item["MPE TYPE"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('PARENT ID')"
            >
              {{ item["PARENT ID"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('ART POSSTR')"
            >
              {{ item["ART POSSTR"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('PARTPOSSTR')"
            >
              {{ item["PARTPOSSTR"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('NCNO')"
            >
              {{ item["NCNO"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('_width_decimal')"
            >
              {{ item["_width_decimal"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('_length_decimal')"
            >
              {{ item["_length_decimal"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('_thickness_decimal')"
            >
              {{ item["_thickness_decimal"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('MATNAME')"
            >
              {{ item["MATNAME"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('BARCODE')"
            >
              {{ item["BARCODE"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('_cart_alias')"
            >
              {{ item["_cart_alias"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('_bin_order')"
            >
              {{ item["_bin_order"] }}
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('_bin_state')"
            >
              <v-progress-circular
                indeterminate
                color="primary"
                :size="25"
                v-if="item._loading"
              ></v-progress-circular>
              <span v-if="!item._loading">{{ item["_bin_state"] }}</span>
            </td>
            <td
              @click="toggle(isSelected, select, $event)"
              v-if="isHeaderVisible('_state')"
            >
              {{ getPartStateAlias(item["_state"]) }}
            </td>

            <td>
              <v-btn-toggle>
                <v-btn
                  text
                  icon
                  @click="selectBinForPart(item)"
                  :disabled="
                    (selectedParts && selectedCarts.length === 0) ||
                    (item.hasOwnProperty('_bin_uid') && item._bin_uid !== null)
                  "
                >
                  <v-icon> mdi-card-plus </v-icon>
                </v-btn>

                <v-btn
                  text
                  icon
                  @click="findBinForPart(item)"
                  :disabled="
                    (selectedParts && selectedCarts.length === 0) ||
                    (item.hasOwnProperty('_bin_uid') && item._bin_uid !== null)
                  "
                >
                  <v-icon> mdi-card-search-outline </v-icon>
                </v-btn>
                <v-btn
                  text
                  icon
                  @click="removePartFromBin(item)"
                  :disabled="!item._bin_uid"
                >
                  <v-icon> mdi-card-remove-outline </v-icon>
                </v-btn>
              </v-btn-toggle>
            </td>
          </tr>
        </template>

        <template v-slot:footer="">
          <v-row class="pa-0">
            <v-chip class="ml-3" label dark v-if="selectedParts.length > 0"
              >Selected {{ selectedParts.length }} parts
            </v-chip>
            <v-chip class="ml-3" label dark v-if="selectedFilter">
              Selected filter: {{ selectedFilter.name }} [{{
                selectedFilter.description
              }}]</v-chip
            >
          </v-row>
        </template>
      </v-data-table>

      <!--

        <v-card-actions>
            <v-btn color="blue darken-1" text @click="close()"> Close </v-btn>

            <v-btn color="blue darken-1" text @click="save()"> Save </v-btn>
        </v-card-actions>

          <v-row class="pa-2">
                <v-chip class="ml-3" dark v-if="this.selectedParts.length>0">Selected {{this.selectedParts.length}} parts </v-chip>
                <v-chip class="ml-3" dark v-if="this.selectedFilter"> Selected filter: {{this.selectedFilter.name}} [{{this.selectedFilter.description}}]</v-chip>
            </v-row>

-->
    </v-card>

    <filtering-dialog
      ref="filtering-dialog"
      @save="onFilteringDialogApply"
      @close="onFilteringDialogClose"
    >
    </filtering-dialog>
    <logs-dialog ref="logs-dialog" @clear="onLogsDialogClear"> </logs-dialog>
    <distribution-dialog
      ref="distribution-dialog"
      :carts="availableCarts"
      @run="onDistributionDialogRun"
      @clear="onDistributionDialogClear"
    >
    </distribution-dialog>
    <bin-selector-dialog
      ref="bin-selector-dialog"
      @save="onBinSelectorDialogApply"
      @close="onBinSelectorDialogClose"
    >
    </bin-selector-dialog>
    <dialog-wrapper ref="dialog"> </dialog-wrapper>
  </v-container>
</template>

<script>
import Vue from "vue";
import moment from "moment";
//import PartEditor from './PartEditor';
import DialogWrapper from "./DialogWrapper";
import FilteringDialog from "./FilteringDialog";
import BinSelectorDialog from "./BinSelectorDialog";
import LogsDialog from "./LogsDialog";
import DistributionDialog from "./DistributionDialog";

import {
  XlsxRead,
  XlsxJson,
} from "../../node_modules/vue-xlsx/dist/vue-xlsx.es.js";

import { mapGetters, mapState, mapActions } from "vuex";
import to from "await-to-js";

export default {
  name: "OrderEditor",
  props: {
    id: {
      type: String,
      default: undefined,
    },
    action: {
      type: String,
      default: "",
    },
  },
  components: {
    //BinEditor,
    DialogWrapper,
    FilteringDialog,
    BinSelectorDialog,
    XlsxRead,
    XlsxJson,
    LogsDialog,
    DistributionDialog,
  },
  data: function () {
    return {
      //enableCache: true,
      enableCache: false,
      isSelecting: false,
      search: "",
      selectedFile: null,
      availableCarts: [],
      selectedCarts: [],
      selectedParts: [],
      selectedFilter: 0,
      columnFilters: {
        id: "",
        orderName: "",
      },
      data: {
        id: "",
        name: "",
        status: "",
      },

      logsData: [],
      fullDataSet: [],
      parts: {
        headers: [
          {
            text: "ORDERNAME",
            value: "ORDERNAME",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "ORDERNAME"),
          },
          {
            text: "ART ID",
            value: "ART ID",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "ART ID"),
          },
          {
            text: "ID",
            value: "ID",
            showMobile: true,
            filter: (value) => this.filterByColumn(value, "ID"),
          },
          {
            text: "TYP",
            value: "TYP",
            showMobile: true,
            filter: (value) => this.filterByColumn(value, "TYP"),
          },
          {
            text: "NAME1",
            value: "NAME1",
            showMobile: true,
            filter: (value) => this.filterByColumn(value, "NAME1"),
          },
          {
            text: "MPE TYPE",
            value: "MPE TYPE",
            showMobile: true,
            filter: (value) => this.filterByColumn(value, "MPE TYPE"),
          },
          {
            text: "PARENT ID",
            value: "PARENT ID",
            showMobile: true,
            filter: (value) => this.filterByColumn(value, "PARENT ID"),
          },
          {
            text: "ART POSSTR",
            value: "ART POSSTR",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "ART POSSTR"),
          },
          {
            text: "PARTPOSSTR",
            value: "PARTPOSSTR",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "PARTPOSSTR"),
          },
          {
            text: "NCNO",
            value: "NCNO",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "NCNO"),
          },
          {
            text: "Width",
            value: "_width_decimal",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "_width_decimal"),
          },
          {
            text: "Length",
            value: "_length_decimal",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "_length_decimal"),
          },
          {
            text: "Thickness",
            value: "_thickness_decimal",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "_thickness_decimal"),
          },
          {
            text: "MATNAME",
            value: "MATNAME",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "MATNAME"),
          },
          {
            text: "BARCODE",
            value: "BARCODE",
            showMobile: true,
            filter: (value) => this.filterByColumn(value, "BARCODE"),
          },
          {
            text: "CART",
            value: "_cart_alias",
            showMobile: true,
            filter: (value) => this.filterByColumn(value, "_cart_alias"),
          },
          {
            text: "BIN",
            value: "_bin_order",
            showMobile: true,
            filter: (value) => this.filterByColumn(value, "_bin_order"),
          },
          {
            text: "BIN STATE",
            value: "_bin_state",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "_bin_state"),
          },
          {
            text: "STATE",
            value: "_state",
            showMobile: false,
            filter: (value) => this.filterByColumn(value, "_state"),
          },

          {
            text: "ACTIONS",
            value: "action",
            showMobile: true,
            sortable: false,
          },
        ],
        items: [],
      },
      isModified: false,
      mode: undefined,
      show: false,
      rules: [(id) => !!id || "Required.", (name) => !!name || "Required."],
    };
  },
  computed: {
    ...mapState("orders", ["isLoading"]),
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    headers() {
      return this.$vuetify.breakpoint.mdAndDown
        ? this.parts.headers.filter((h) => h.showMobile)
        : this.parts.headers;
    },
    activeCarts() {
      return this.fullDataSet
        .filter((c) => c.status === this.$constants.CART_STATUS.ACTIVE)
        .map((c) => ({
          text: c.alias,
          value: c.id,
        }));
    },
  },

  created() {
    if (this.action === "create") {
      this.mode = this.$constants.FORM_MODE.CREATE;
    }

    if (this.action === "edit") {
      this.mode = this.$constants.FORM_MODE.EDIT;
    }
    console.log("+before");
    // this.data.id = this.id;
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav);

    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.preventNav);
    });
  },

  async beforeRouteLeave(to, from, next) {
    if (this.isModified) {
      let result = await this.$refs.dialog.open(
        "Warning",
        `Order has unsaved changes! Do you want to proceed?`,
        {
          OK: "YES",
          CANCEL: "NO",
        }
      );

      if (!result) return;
    }

    this.isModified = false;

    next();
  },

  async mounted() {
    //console.log('order editor mounted')
    let that = this;

    if (!this.id) {
      this.mode = this.$constants.FORM_MODE.CREATE;

      this.data.id = this.$nanoid();
      this.data.name = "";
      this.data.status = "";
      this.parts.items = [];
    } else {
      that.mode = this.$constants.FORM_MODE.EDIT;

      this.data.id = this.id;

      let [error, response] = await to(this.getCartsWithBinsAndParts());

      if (!response) {
        this.$refs.dialog.open("getCartsWithBinsAndParts", error.message, {
          OK: "OK",
        });
        return;
      }

      this.fullDataSet = JSON.parse(JSON.stringify(response));

      {
        let [error, response] = await to(
          that.getOrder({
            id: this.id,
          })
        );

        if (!response) {
          this.$refs.dialog.open(`getOrder ${this.id}`, error.message, {
            OK: "OK",
          });
          return;
        }

        Object.assign(that.data, response);
      }

      {
        console.log("4444");
        let [error, response] = await to(
          this.getOrderParts({
            _order_uid: this.id,
          })
        );

        if (!response) {
          this.$refs.dialog.open(`getOrderParts ${this.id}`, error.message, {
            OK: "OK",
          });
          return;
        }

        //that.parts.items = response;
        console.log("response=======", response);
        that.parts.items = JSON.parse(JSON.stringify(response));
      }

      this.parts.items = this.$filters.calculateMS(this.parts.items);

      this.updateBinStateColumn();
    }
  },
  methods: {
    ...mapGetters("carts", ["getCartsDataFromCache"]),
    ...mapGetters("parts", ["getPartsDataFromCache"]),
    ...mapActions("orders", [
      "getOrder",
      "createOrder",
      "updateOrder",
      "deleteOrder",
    ]),
    ...mapActions("parts", ["getOrderParts", "updatePart"]),
    ...mapActions("carts", ["getCartsWithBinsAndParts"]),
    isHeaderVisible(h) {
      return this.headers.find((i) => i.value === h) ? true : false;
    },

    preventNav(event) {
      if (!this.isModified) return;
      event.preventDefault();
      event.returnValue = "";
    },
    filterByColumn(value, column) {
      let search = this.columnFilters[column]
        ? this.columnFilters[column].toString().toLowerCase()
        : null;

      if (!search) return true;

      if (!value) return false;

      return value.toString().toLowerCase().includes(search);
    },
    getPartStateAlias(_state) {
      if (_state === 0) return "";
      if (_state === this.$constants.PART_STATE.OK) return "OK";
      if (_state === this.$constants.PART_STATE.DAMAGED) return "DAMAGED";
      if (_state === this.$constants.PART_STATE.MISSED) return "MISSED";
    },
    toggle(isSelected, select, e) {
      select(!isSelected);
    },
    updateBinStateColumn() {
      if (!this.parts.items) {
        debugger;
      }
      //update bin state column
      this.parts.items.forEach((part) => {
        let bin = this.findBinLocal(part._bin_uid);

        part._bin_state = bin
          ? `${bin.parts.length} / ${bin.maxPartsCount}`
          : "";
      });
    },
    findBinLocal(_id) {
      //let bin = this.fullDataSet.map(c => c.bins.filter(b => b.id === _id)).reduce((last, now) => last.concat(now)).reduce((last, now) => now);
      //return bin

      for (let i = 0; i < this.fullDataSet.length; i++) {
        for (let j = 0; j < this.fullDataSet[i].bins.length; j++) {
          if (this.fullDataSet[i].bins[j].id === _id)
            return this.fullDataSet[i].bins[j];
        }
      }
      return false;
    },
    async distributeParts() {
      if (!this.selectedFilter) {
        let result = await this.$refs.dialog.open(
          "Warning",
          `Please select filter at first`,
          {
            OK: "OK",
          }
        );

        return;
      }

      if (!this.selectedParts.length) {
        let result = await this.$refs.dialog.open(
          "Warning",
          `Please select parts for distribution at first`,
          {
            OK: "OK",
          }
        );

        return;
      }

      let result = await this.$refs.dialog.open(
        "Warning",
        `Selected parts will be distributed by bins! Do you want to proceed?`,
        {
          OK: "YES",
          CANCEL: "NO",
        }
      );

      if (!result) return;

      if (!this.fullDataSet) {
        await this.$refs.dialog.open(
          "Error",
          `Error occurred during fetching carts data`,
          {
            OK: "OK",
          }
        );

        return;
      }

      /*
            1. Group by parent and childs
            2. Sort groups by max article size descending
            3. Find suitable bins starting from biggest article size
            */

      //get available parts
      const availableParts = this.selectedParts.filter((p) => !p._bin_uid);
      console.log("11111111111111111", this.selectedParts);

      if (!availableParts.length) {
        //let result = await this.$refs.dialog.open(
        let result = this.$refs.dialog.open(
          "Error",
          `No available parts for distribution.`,
          {
            OK: "OK",
          }
        );

        return;
      }

      //set articleMaxSize, sort desc, group by parent-childs, add parts without parents
      const sortedParts = this.$filters.sortByParentsWithChilds(availableParts);
      /*
            console.object('sorted parts', sortedParts.map(p => ({
                id: p["ID"],
                articleMaxSize: p.articleMaxSize
            })))
*/
      //go through not linked parts
      for (let part of sortedParts.filter((p) => !p._bin_uid)) {
        let [cart, bin, result] = this.findSuitableBin(
          part,
          this.selectedCarts
        );

        if (!cart || !bin) {
          //update view
          this.updateColumn(part, "_state", result);

          this.addLogRecord(part, result);

          continue;
        }

        //update view, local dataset and firestore
        this.putPartToBin({
          cart: cart,
          bin: bin,
          part: part,
        });
      }
      /*
                        await this.$refs.dialog.open("Info", `Distribution completed. Please check logs for results`, {
                            OK: "OK"
                        });
            */
    },
    updateColumn(part, property, value) {
      part[property] = value;
      let partIdx = this.parts.items.findIndex(
        (item) => item._uid === part._uid
      );
      Vue.set(this.parts.items, partIdx, part);
    },
    findBinForPart(part) {
      let [cart, bin, result] = this.findSuitableBin(part, this.selectedCarts);

      if (!cart || !bin) {
        this.updateColumn(part, "_state", result);

        this.addLogRecord(part, result);

        return;
      }

      this.putPartToBin({
        cart: cart,
        bin: bin,
        part: part,
      });

      this.updateBinStateColumn();
    },
    async putPartToBin(payload) {
      let that = this;

      let part = payload.part;

      //link part to the bin and cart
      part._cart_uid = payload.cart.id;
      part._bin_uid = payload.bin.id;
      part._cart_alias = payload.cart.alias;
      part._bin_order = payload.bin.order;
      part.updated = true;

      //update local dataset
      let bin = this.findBinLocal(part._bin_uid);
      bin.parts.push(part);

      this.updateColumn(
        part,
        "_bin_state",
        `${bin.parts.length} / ${bin.maxPartsCount}`
      );

      this.isModified = true;

      // this.updateBinStateColumn()
      /*
                        part._loading = true
                        //update fb storage
                        this.updatePart(part).then(() => {

                            part._loading = false
                            //update parts table

                            this.updateColumn(part, '_bin_state', `${bin.parts.length} / ${bin.maxPartsCount}`)

                            this.updateColumn(part, '_state', 'Bin linked')

                        }).catch(() => {
                            part._loading = false
                        })
            */
    },
    async removePartFromBin(part) {
      //find bin
      //let bin = this.fullDataSet.map(c => c.bins.filter(b => b.id === part._bin_uid)).reduce((last, now) => last.concat(now)).reduce((last, now) => now);

      let bin = this.findBinLocal(part._bin_uid);
      if (bin) {
        bin.parts = bin.parts.filter((p) => p._uid !== part._uid);
      }

      //unlink part from the bin and cart
      part._cart_uid = null;
      part._bin_uid = null;
      part._cart_alias = null;
      part._bin_order = null;
      part._state = null;

      part.updated = true;

      this.updateColumn(part, "_state", "");

      this.updateBinStateColumn();

      //update storage
      /*
            part._loading = true
            let result = await this.updatePart(part)
            part._loading = false
            */

      //update view
      let partIdx = this.parts.items.findIndex(
        (item) => item._uid === part._uid
      );
      Vue.set(this.parts.items, partIdx, part);

      this.addLogRecord(part, `Part unlinked from bin`);

      this.isModified = true;
    },
    findSuitableBin(part, selectedCarts = undefined) {
      //if selectedCarts undefined use all active carts otherwise just selected carts

      let dataSet = [];

      //dataSet = this.fullDataSet.filter(cart => cart.status === this.$constants.CART_STATUS.ACTIVE && this.partTypeAllowed(cart, part))

      if (!selectedCarts) {
        dataSet = this.fullDataSet.filter(
          (cart) =>
            cart.status === this.$constants.CART_STATUS.ACTIVE &&
            this.partTypeAllowed(cart, part)
        );
      } else {
        dataSet = this.fullDataSet.filter(
          (cart) =>
            cart.status === this.$constants.CART_STATUS.ACTIVE &&
            this.partTypeAllowed(cart, part) &&
            selectedCarts.includes(cart.id)
        );
      }

      if (!dataSet.length) {
        return [false, false, `No available carts`];
      }

      //loop by carts
      for (let ic = 0; ic < dataSet.length; ic++) {
        let cart = dataSet[ic];

        /*
                                //find suitable bins
                                let potentialBins = cart.bins.filter( b => (
                                            //empty AND it is a parent part
                                            ((b.parts.length === 0) || +part["MPE TYPE"] === 1) ||
                                            //empty AND part has no parent AND it is not a parent part
                                            ((b.parts.length === 0) &&  +part["MPE TYPE"] === 0 && +part["PARENT ID"] === 0) ||
                                            //not empty AND fit by Article AND OrderName AND has no parent AND not a parent
                                            (b.parts.length > 0 && b.parts[0]["ART ID"] === part["ART ID"] && b.parts[0]["ORDERNAME"] === part["ORDERNAME"] && +part["PARENT ID"] === 0 && +part["MPE TYPE"] === 0) || 
                                            //not empty AND fit by Article AND OrderName AND bin already contains Parent part AND has parent
                                            (b.parts.length > 0 && b.parts[0]["ART ID"] === part["ART ID"] && b.parts[0]["ORDERNAME"] === part["ORDERNAME"] && +part["MPE TYPE"] === 0 && +part["PARENT ID"] > 0 &&
                                                b.parts.filter( i => i["PARENT ID"] === part["PARENT ID"]).length > 0)
                                        ) &&
                                        //AND fits by Size
                                        (b.width > part.articleMaxSize || b.height > part.articleMaxSize || b.depth > part.articleMaxSize)
                                    )
                */
        //find suitable bins
        let potentialBins = [];
        let condition = "";

        //it is a parent part
        if (+part["MPE TYPE"] === 1) {
          condition = 1;

          potentialBins = cart.bins.filter(
            (b) =>
              //empty bin
              (b.parts.length === 0 ||
                //not empty AND fit by Article AND OrderName
                (b.parts.length > 0 &&
                  b.parts[0]["ART ID"] === part["ART ID"] &&
                  b.parts[0]["ORDERNAME"] === part["ORDERNAME"])) &&
              //AND fits by Size
              (b.width > part.articleMaxSize ||
                b.height > part.articleMaxSize ||
                b.depth > part.articleMaxSize)
          );
        }
        //part has no parent AND it is not a parent part
        else if (+part["MPE TYPE"] === 0 && +part["PARENT ID"] === 0) {
          condition = 2;
          /*
                        if (part["ART ID"] === 49196){

                        debugger

                        }
                        */
          //try to find existing
          potentialBins = cart.bins.filter(
            (b) =>
              //not empty AND fit by Article AND OrderName
              b.parts.length > 0 &&
              b.parts[0]["ART ID"] === part["ART ID"] &&
              b.parts[0]["ORDERNAME"] === part["ORDERNAME"] &&
              // no parent parts in the bin
              b.parts.filter((i) => +i["MPE TYPE"] === 1).length === 0 &&
              //AND fits by Size
              (b.width > part.articleMaxSize ||
                b.height > part.articleMaxSize ||
                b.depth > part.articleMaxSize)
          );

          //OR try to find empty
          if (potentialBins.length === 0) {
            potentialBins = cart.bins.filter(
              (b) =>
                //empty
                b.parts.length === 0 &&
                //AND fits by Size
                (b.width > part.articleMaxSize ||
                  b.height > part.articleMaxSize ||
                  b.depth > part.articleMaxSize)
            );
          }
        }
        //the part has parent
        else if (+part["MPE TYPE"] === 0 && +part["PARENT ID"] > 0) {
          condition = 3;

          potentialBins = cart.bins.filter(
            (b) =>
              //empty bin
              (b.parts.length === 0 ||
                //not empty AND fit by Article AND OrderName
                (b.parts.length > 0 &&
                  b.parts[0]["ART ID"] === part["ART ID"] &&
                  b.parts[0]["ORDERNAME"] === part["ORDERNAME"] &&
                  //other parts with the same parent already in the bin
                  b.parts.filter((i) => i["PARENT ID"] === part["PARENT ID"])
                    .length > 0)) &&
              //AND fits by Size
              (b.width > part.articleMaxSize ||
                b.height > part.articleMaxSize ||
                b.depth > part.articleMaxSize)
          );
        }

        //if empty try next cart
        if (!potentialBins.length) continue;

        //20210109
        //find max bin side
        for (let ib = 0; ib < potentialBins.length; ib++) {
          let bin = potentialBins[ib];
          bin.maxSideSize = Math.max(bin.depth, bin.width, bin.height);
        }
        //20210109
        //sort potential bins by max side ascending
        potentialBins.sort((a, b) => (a.maxSideSize > b.maxSideSize ? 1 : -1));

        ////console.log('potential bins', potentialBins.map( b => b.maxSideSize))

        //loop by bins
        for (let ib = 0; ib < potentialBins.length; ib++) {
          let bin = potentialBins[ib];

          //get current parts thickness
          if (bin.parts.length)
            bin.totalPartsThickness = bin.parts
              .map((o) => o._thickness_decimal)
              .reduce((a, c) => +a + +c);
          else bin.totalPartsThickness = 0;

          //check max parts count
          if (bin.parts.length < bin.maxPartsCount) {
            //check thickness
            //&& (bin.totalPartsThickness + p._thickness_decimal < p.height_decimal)

            let axis = undefined;

            //by axes
            if (
              part._length_decimal < bin.width &&
              part._width_decimal < bin.depth
            )
              axis = "X";
            //X-90
            else if (
              part._length_decimal < bin.depth &&
              part._width_decimal < bin.width
            )
              axis = "X-90";
            //Y axis
            else if (
              part._length_decimal < bin.height &&
              part._width_decimal < bin.depth
            )
              axis = "Y";
            //Y-90 axis
            else if (
              part._length_decimal < bin.depth &&
              part._width_decimal < bin.height
            )
              axis = "Y-90";

            if (axis !== undefined) {
              this.addLogRecord(
                part,
                `CART: ${cart.alias}, BIN: ${bin.order}, Axis ${axis}, AMS: ${part.articleMaxSize}, PMS: ${part.partMaxSide}, Condition: ${condition}`
              );

              return [cart, bin, `OK`];
            }
          }
        }
      }

      return [
        false,
        false,
        `Bin not found, AMS: ${part.articleMaxSize}, PMS: ${part.partMaxSide}`,
      ];
    },

    findSuitableBin_old(part, selectedCarts = undefined) {
      //if selectedCarts undefined use all active carts otherwise just selected carts

      let dataSet = [];

      //dataSet = this.fullDataSet.filter(cart => cart.status === this.$constants.CART_STATUS.ACTIVE && this.partTypeAllowed(cart, part))

      if (!selectedCarts) {
        dataSet = this.fullDataSet.filter(
          (cart) =>
            cart.status === this.$constants.CART_STATUS.ACTIVE &&
            this.partTypeAllowed(cart, part)
        );
      } else {
        dataSet = this.fullDataSet.filter(
          (cart) =>
            cart.status === this.$constants.CART_STATUS.ACTIVE &&
            this.partTypeAllowed(cart, part) &&
            selectedCarts.includes(cart.id)
        );
      }

      if (!dataSet.length) {
        return [false, false, `No available carts`];
      }

      //carts loop
      for (let ic = 0; ic < dataSet.length; ic++) {
        let cart = dataSet[ic];

        //bins loop
        for (let ib = 0; ib < cart.bins.length; ib++) {
          let bin = cart.bins[ib];

          if (bin.parts.length)
            bin.totalPartsThickness = bin.parts
              .map((o) => o._thickness_decimal)
              .reduce((a, c) => +a + +c);
          else bin.totalPartsThickness = 0;

          //const currentArticleID = bin.parts.length ? bin.parts[0]["ART ID"] : undefined
          //const currentOrderName = bin.parts.length ? bin.parts[0]["ORDERNAME"] : undefined

          //check if the part fits the bin
          if (
            bin.parts.length < bin.maxPartsCount &&
            part._width_decimal < bin.width &&
            //&& (bin.totalPartsThickness + p._thickness_decimal < p.height_decimal)
            (bin.parts.length === 0 ||
              (bin.parts[0]["ART ID"] === part["ART ID"] &&
                bin.parts[0]["ORDERNAME"] === part["ORDERNAME"]))
          ) {
            this.addLogRecord(part, `CART: ${cart.alias}, BIN: ${bin.order}`);

            return [cart, bin, "OK"];
          }
        }
      }

      return [false, false, "Bin not found"];
    },
    partTypeAllowed(cart, part) {
      if (cart.type === this.$constants.CART_TYPE.ANY) return true;

      if (
        cart.type === this.$constants.CART_TYPE.FACE_FRAME_PARTS &&
        this.$constants.PART_TYPES.FACE_FRAME_PARTS.includes(+part["TYP"])
      )
        return true;

      if (
        cart.type === this.$constants.CART_TYPE.MULTI_5_PIECE_FRONTS_PARTS &&
        this.$constants.PART_TYPES.MULTI_5_PIECE_FRONTS_PARTS.includes(
          +part["TYP"]
        )
      )
        return true;

      if (
        cart.type === this.$constants.CART_TYPE.DRAWER_BOX_PARTS &&
        this.$constants.PART_TYPES.DRAWER_BOX_PARTS.includes(+part["TYP"])
      )
        return true;

      return false;
    },
    async undoPartsDistribution() {
      let result = await this.$refs.dialog.open(
        "Warning",
        `Selected parts will be unlinked from bins! Do you want to proceed?`,
        {
          OK: "YES",
          CANCEL: "NO",
        }
      );

      if (!result) return;

      //this.parts.items.filter(p => p._bin_uid ).forEach(p => {
      this.selectedParts
        .filter((p) => p._bin_uid)
        .forEach((p) => {
          this.removePartFromBin(p);
        });

      //this.updateBinStateColumn()
    },
    addLogRecord(part, result) {
      let logItem = {
        timestamp: moment().format("YYYY-MM-DD hh:mm:ss A"),
        part: `ORDER: ${part["ORDERNAME"]}, ID: ${part["ID"]}, NAME: ${part["NAME1"]}, TYP: ${part["TYP"]}`,
        result: result,
      };

      this.logsData.unshift(logItem);

      // this.$forceUpdate()
    },
    /*
        async showDistributionDialog() {

            if (!this.selectedFilter) {
                let result = await this.$refs.dialog.open(
                    "Warning",
                    `Please select filter at first`, {
                        OK: "OK",
                    }
                );

                return
            }

            if (!this.selectedParts.length) {

                let result = await this.$refs.dialog.open(
                    "Warning",
                    `Please select parts for distribution at first`, {
                        OK: "OK",
                    }
                );

                return
            }

            if (this.selectedFilter.id === this.$constants.FILTERS.FACE_FRAME_PARTS) {
                //select carts FACE_FRAME_PARTS
                this.selectedCarts = this.fullDataSet.filter(cart => cart.status === this.$constants.CART_STATUS.ACTIVE && cart.type === this.$constants.CART_TYPE.FACE_FRAME_PARTS).map(c => ({
                    text: c.alias,
                    value: c.id
                }))

            } else if (this.selectedFilter.id === this.$constants.FILTERS.MULTI_5_PIECE_FRONTS_PARTS) {
                //select carts MULTI_5_PIECE_FRONTS_PARTS
                this.selectedCarts = this.fullDataSet.filter(cart => cart.status === this.$constants.CART_STATUS.ACTIVE && cart.type === this.$constants.CART_TYPE.MULTI_5_PIECE_FRONTS_PARTS).map(c => ({
                    text: c.alias,
                    value: c.id
                }))

            } else if (this.selectedFilter.id === this.$constants.FILTERS.DRAWER_BOX_PARTS) {
                //select carts DRAWER_BOX_PARTS
                this.selectedCarts = this.fullDataSet.filter(cart => cart.status === this.$constants.CART_STATUS.ACTIVE && cart.type === this.$constants.CART_TYPE.DRAWER_BOX_PARTS).map(c => ({
                    text: c.alias,
                    value: c.id
                }))
            } else {
                this.selectedCarts = this.fullDataSet.filter(cart => cart.status === this.$constants.CART_STATUS.ACTIVE).map(c => ({
                    text: c.alias,
                    value: c.id
                }))
            }

                        this.$refs['distribution-dialog'].open({
                            //logsItems: this.logsData,
                            selectedCarts: selectedCarts.map( c=> c.value),
                            selectedParts: selectedParts

                        })

        },
        */
    onDistributionDialogRun(selectedCarts) {},
    onDistributionDialogClear() {
      this.logsData = [];
    },

    showLogsDialog() {
      this.$refs["logs-dialog"].open(this.logsData);
    },
    onLogsDialogClear() {
      this.logsData = [];
    },
    async save() {
      if (!this.$refs.form.validate()) return;

      if (this.mode === this.$constants.FORM_MODE.CREATE) {
        await this.createOrder({
          data: this.data,
          parts: this.parts.items,
        });
      }

      if (this.mode === this.$constants.FORM_MODE.EDIT) {
        await this.updateOrder({
          data: this.data,
          parts: this.parts.items,
        });
      }

      this.isModified = false;
      /*
                        this.$router.push({
                            name: "orders",
                        });
                        */
    },
    async close() {
      if (this.isModified) {
        let result = await this.$refs.dialog.open(
          "Warning",
          `Order has unsaved changes! Do you want to proceed?`,
          {
            OK: "YES",
            CANCEL: "NO",
          }
        );

        if (!result) return;
      }

      this.isModified = false;

      this.$router.push({
        name: "orders",
      });
    },
    onFileUpload() {
      this.isSelecting = true;

      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        {
          once: true,
        }
      );

      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];

      // do something
    },
    onFileLoading(isLoading) {
      if (!isLoading) {
        ////console.log(this.$refs.xlsx.collection)

        this.parts.items = this.$refs.xlsx.collection;

        this.parts.items.forEach((i) => {
          i._order_uid = this.data.id;
          i._uid = this.$nanoid();
          i._width_decimal = this.$helpers.fraction2decimal(
            i["Width"].replace("in", "")
          );
          i._length_decimal = this.$helpers.fraction2decimal(
            i["Length"].replace("in", "")
          );
          i._thickness_decimal = this.$helpers.fraction2decimal(
            i["Thickness"].replace("in", "")
          );
          i._state = 0;
          i.created = true;
        });

        this.isModified = true;
      }
    },
    async deletePartsFromOrder() {
      let result = await this.$refs.dialog.open(
        "Warning",
        `All parts will be deleted from the order and all bins will be emptied! Do you want to proceed?`,
        {
          OK: "YES",
          CANCEL: "NO",
        }
      );

      if (!result) return;

      let that = this;

      that.parts.items.forEach((part) => {
        part.deleted = true;
      });

      this.isModified = true;
    },
    selectBinForPart(payload) {
      this.selectedPart = payload;

      this.$refs["bin-selector-dialog"].open();
    },
    onBinSelectorDialogApply(payload) {
      this.putPartToBin({
        cart: payload.cart,
        bin: payload.bin,
        part: this.selectedPart,
      });
    },
    onBinSelectorDialogClose() {},
    showFilteringDialog() {
      this.$refs["filtering-dialog"].open();
    },
    undoPartsSelection() {
      this.selectedParts = [];
      this.selectedFilter = undefined;
    },
    onFilteringDialogApply(data) {
      const filter = data[0];

      this.selectedParts = [];

      this.selectedFilter = filter;

      if (filter.id === this.$constants.FILTERS.CARCASS_PARTS) {
        /*TYP: 14,5,4,1,13,6,12,3,34 */

        const result = this.$filters.getParentsWithoutChilds(this.parts.items, {
          typ: this.$constants.PART_TYPES.CARCASS_PARTS,
        });

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result,
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.CARCASS_PARTS_NEW) {
        //*TYP: 14,5,4,1,13,6,12,34,8,23,9,10 */
        const result = this.$filters.getParentsWithoutChildsNew(
          this.parts.items,
          {
            typ: this.$constants.PART_TYPES.CARCASS_PARTS_NEW,
          }
        );

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result,
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.CARCASS_PARTS_CHILDS) {
        /*TYP: 14,5,4,1,13,6,12,3,34 */

        // const result = this.$filters.getChildsWithoutParents(this.parts.items, {
        const result = this.$filters.getSingleParts(this.parts.items, {
          typ: this.$constants.PART_TYPES.CARCASS_PARTS_CHILDS,
        });

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result,
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.DRAWER_BOX_PARTS) {
        /*TYP: 21,22 */

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          this.parts.items.filter((p) =>
            this.$constants.PART_TYPES.DRAWER_BOX_PARTS.includes(+p["TYP"])
          ),
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.DOOR_DRAWER_FRONTS_PARENTS) {
        //const result = this.$filters.getParentsWithChilds(this.parts.items, {
        const result = this.$filters.getParentsWithoutChilds(this.parts.items, {
          typ: this.$constants.PART_TYPES.DOOR_DRAWER_FRONTS_PARENTS,
        });

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result,
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.DOOR_DRAWER_FRONTS_SINGLE) {
        /* TYP: 23,8,9,10 Non multiparts */

        const result = this.$filters.getSingleParts(this.parts.items, {
          typ: this.$constants.PART_TYPES.DOOR_DRAWER_FRONTS_SINGLE,
        });

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result,
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.FACE_FRAME_PARTS) {
        /*TYP: 36*/

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          this.parts.items.filter((p) =>
            this.$constants.PART_TYPES.FACE_FRAME_PARTS.includes(+p["TYP"])
          ),
          "_uid"
        );
      }
      if (
        filter.id ===
        this.$constants.FILTERS.CARCASS_NOP_MULTI_AND_DRAWER_BOX_MULTI
      ) {
        /*TYP: 14, 5,4,1,13,6,12,3,34, 21,22. Exclude parents */

        //const result = this.$filters.getChildsWithoutParents(this.parts.items, {
        const result = this.$filters.getParentsWithoutChilds(this.parts.items, {
          typ: this.$constants.PART_TYPES
            .CARCASS_NOP_MULTI_AND_DRAWER_BOX_MULTI,
        });

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result,
          "_uid"
        );
      }

      if (
        filter.id ===
        this.$constants.FILTERS.CARCASS_NOP_MULTI_AND_DRAWER_BOX_SINGLE
      ) {
        /*TYP: 14, 5,4,1,13,6,12,3,34, 21,22, 23,8,9,10 */

        //const result1 = this.$filters.getChildsWithoutParents(this.parts.items, {
        const result1 = this.$filters.getParentsWithoutChilds(
          this.parts.items,
          {
            typ: this.$constants.PART_TYPES
              .CARCASS_NOP_MULTI_AND_DRAWER_BOX_MULTI,
          }
        );

        const result2 = this.$filters.getSingleParts(this.parts.items, {
          typ: this.$constants.PART_TYPES.DOOR_DRAWER_FRONTS_SINGLE,
        });

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result1,
          "_uid"
        );
        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result2,
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.ALL_PARTS) {
        /* All parts of the same ART ID in one Bin */

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          this.parts.items,
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.TOE_KICK) {
        /*All TYP: 27 from the same ART ID - TYP 27 parts where MPE TYPE is 1 */

        const result = this.$filters.getParentsWithChilds(this.parts.items, {
          typ: this.$constants.PART_TYPES.TOE_KICK,
        });

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result,
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.ART_ID) {
        /*All TYP: 3 from the same ART ID - TYP 27 parts where MPE TYPE is 1 && 0 */
        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          this.parts.items.filter((p) =>
            this.$constants.PART_TYPES.ART_ID.includes(+p["TYP"])
          ),
          "_uid"
        );

        console.log("=====", this.selectedParts);
        // const result = this.$filters.getParentsWithChildsAdj(this.parts.items, {
        //   typ: this.$constants.PART_TYPES.ART_ID,
        // });

        // this.selectedParts = this.$helpers.mergeObjectArrays(
        //   this.selectedParts,
        //   result,
        //   "_uid"
        // );
      }

      if (filter.id === this.$constants.FILTERS.MULTI_5_PIECE_FRONTS_PARTS) {
        //const result = this.$filters.getParentsWithChilds(this.parts.items, {
        const result = this.$filters.getChildsWithoutParents(this.parts.items, {
          typ: this.$constants.PART_TYPES.MULTI_5_PIECE_FRONTS_PARTS,
        });

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result,
          "_uid"
        );
      }

      if (filter.id === this.$constants.FILTERS.MULTI_PARTS) {
        /*
                Multi Parts
                --All parts with a MPE TYPE value of 1 ( except TYP 8,9,10,23,27)
                -- go in one bin with all parts what the PARENT ID is the same as the Multi Parts ID
                18122020
                ++ All child parts (except TYP 8,9,10,23,27) go in one bin with other child parts with the same PARENT ID
                */

        //const result = this.$filters.getParentsWithChilds(this.parts.items, {
        const result = this.$filters.getChildsWithoutParents(this.parts.items, {
          typ: [],
          typ_exclude: this.$constants.PART_TYPES.MULTI_PARTS_EXCLUDE,
        });

        this.selectedParts = this.$helpers.mergeObjectArrays(
          this.selectedParts,
          result,
          "_uid"
        );
      }
    },
    onFilteringDialogClose() {},
  },

  watch: {
    selectedParts(newValue) {
      this.availableCarts = this.activeCarts;

      if (
        this.selectedFilter &&
        this.selectedFilter.id === this.$constants.FILTERS.FACE_FRAME_PARTS
      ) {
        //select carts FACE_FRAME_PARTS
        this.selectedCarts = this.fullDataSet
          .filter(
            (cart) =>
              cart.status === this.$constants.CART_STATUS.ACTIVE &&
              cart.type === this.$constants.CART_TYPE.FACE_FRAME_PARTS
          )
          .map((c) => c.id);
      } else if (
        this.selectedFilter &&
        this.selectedFilter.id ===
          this.$constants.FILTERS.MULTI_5_PIECE_FRONTS_PARTS
      ) {
        //select carts MULTI_5_PIECE_FRONTS_PARTS
        this.selectedCarts = this.fullDataSet
          .filter(
            (cart) =>
              cart.status === this.$constants.CART_STATUS.ACTIVE &&
              cart.type === this.$constants.CART_TYPE.MULTI_5_PIECE_FRONTS_PARTS
          )
          .map((c) => c.id);
      } else if (
        this.selectedFilter &&
        this.selectedFilter.id === this.$constants.FILTERS.DRAWER_BOX_PARTS
      ) {
        //select carts DRAWER_BOX_PARTS
        this.selectedCarts = this.fullDataSet
          .filter(
            (cart) =>
              cart.status === this.$constants.CART_STATUS.ACTIVE &&
              cart.type === this.$constants.CART_TYPE.DRAWER_BOX_PARTS
          )
          .map((c) => c.id);
      } else {
        //this.selectedCarts = this.fullDataSet.filter(cart => cart.status === this.$constants.CART_STATUS.ACTIVE).map(c => c.id)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.items {
  column-count: 4;
  column-gap: 10px;
  padding: 0 5px;
}

.item {
  display: inline-block;
  width: 100%;
  margin: 5px 0;
}

/* Make it responsive */
@media only screen and (max-width: 1200px) {
  .items {
    column-count: 3;
  }
}
</style>

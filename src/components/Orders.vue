<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" fab dark @click="addItem()">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-linear>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="orders.headers"
        :items="orders.items"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item="{ item }">
          <tr>
            <!--  <td @click="editItem(item)">{{item["id"]}}</td>-->
            <td @click="editItem(item)">{{ item["name"] }}</td>
            <td @click="editItem(item)">{{ item["status"] }}</td>
            <td @click="editItem(item)">{{ item["parts"] }}</td>
            <td>
              <v-btn text icon @click="editItem(item)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
              <v-btn text icon @click="deleteItem(item)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <dialog-wrapper ref="dialog"> </dialog-wrapper>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import to from "await-to-js";

import DialogWrapper from "./DialogWrapper";

export default {
  components: {
    DialogWrapper,
  },
  data: function () {
    return {
      search: "",
      orders: {
        headers: [
          /*{
                        text: "ID",
                        value: "id"
                    },*/
          {
            text: "Name",
            value: "name",
          },
          {
            text: "Status",
            value: "status",
          },
          {
            text: "Parts",
            value: "parts",
          },

          {
            text: "Actions",
            value: "action",
            sortable: false,
          },
        ],
        items: [],
      },
    };
  },
  computed: {
    ...mapState("orders", ["isLoading"]),
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions("orders", [
      "getOrders",
      "createOrder",
      "updateOrder",
      "deleteOrder",
    ]),
    async fetchData() {
      let that = this;

      const [error, response] = await to(that.getOrders());

      if (!response) {
        this.$refs.dialog.open("getOrders", error.message, {
          OK: "OK",
        });
        return;
      }

      that.orders.items = response;
    },

    addItem() {
      this.$router.push({
        name: "order-editor",
        params: {
          action: "create",
        },
      });
    },
    editItem(item) {
      this.$router.push({
        name: "order-editor",
        params: {
          action: "edit",
          id: item.id,
        },
      });
    },
    async deleteItem(item) {
      let result = await this.$refs.dialog.open(
        "Warning",
        `Order #${item.name} will be deleted! Do you want to proceed?`,
        {
          OK: "YES",
          CANCEL: "NO",
        }
      );

      if (!result) return;

      result = await this.deleteOrder(item);

      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped></style>

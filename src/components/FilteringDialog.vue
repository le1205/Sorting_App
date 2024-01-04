<template>
  <div>
    <v-dialog
      persistent
      v-model="display"
      :width="$vuetify.breakpoint.mdAndDown ? '' : '50vw'"
      @keydown.esc="close"
    >
      <v-card>
        <v-card-title class="headline">Select filter</v-card-title>

        <v-card-text>
          <v-data-table
            v-model="selectedFilters"
            dense
            :headers="filters.headers"
            :items="filters.items"
            :search="search"
            :items-per-page="-1"
            show-select
            :single-select="true"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:item="{ item, isSelected, select }">
              <tr
                :class="isSelected ? 'yellow' : ''"
                @click="toggle(isSelected, select, $event)"
              >
                <td class="d-flex align-center">
                  <v-icon class="px-1" v-if="isSelected"
                    >mdi-checkbox-marked</v-icon
                  >
                  <v-icon class="px-1" v-if="!isSelected"
                    >mdi-checkbox-blank-outline</v-icon
                  >
                </td>
                <td>{{ item["name"] }}</td>
                <td>{{ item["description"] }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            text
            @click="save"
            :disabled="!this.selectedFilters.length"
          >
            Apply
          </v-btn>
          <v-btn color="primary" text @click="close"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "FilteringDialog",
  data: function () {
    return {
      display: false,
      search: "",
      selectedFilters: [],
      filters: {
        headers: [
          {
            text: "Filter",
            value: "name",
          },
          {
            text: "Description",
            value: "description",
          },
        ],
        items: [
          {
            id: this.$constants.FILTERS.CARCASS_PARTS,
            name: "Carcass Parts [Parent parts]",
            description: "TYP: 14, 5,4,1,13,6,12,3,34",
          },
          {
            id: this.$constants.FILTERS.CARCASS_PARTS_NEW,
            name: "Euro Carcase & Euro Fronts [Parent parts]",
            description: "TYP: 14, 5,4,1,13,6,12,34,8,23,9,10",
          },
          {
            id: this.$constants.FILTERS.CARCASS_PARTS_CHILDS,
            name: "Carcass Parts [Single parts]",
            description: "TYP: 14, 5,4,1,13,6,12,3,34",
          },
          {
            id: this.$constants.FILTERS.DRAWER_BOX_PARTS,
            name: "Drawer Box Parts",
            description: "TYP: 21,22",
          },
          {
            id: this.$constants.FILTERS.DOOR_DRAWER_FRONTS_PARENTS,
            name: "Door / Drawer Fronts [Parent parts]",
            description: "TYP: 8,23,9,10. ",
          },

          {
            id: this.$constants.FILTERS.DOOR_DRAWER_FRONTS_SINGLE,
            name: "Door / Drawer Fronts [Single parts]",
            description: "TYP: 8,23,9,10.",
          },
          {
            id: this.$constants.FILTERS.FACE_FRAME_PARTS,
            name: "Face Frame Parts",
            description: "TYP: 36",
          },
          {
            id: this.$constants.FILTERS.CARCASS_NOP_MULTI_AND_DRAWER_BOX_MULTI,
            name: "Carcass + Drawer Box Parts",
            description: "TYP: 14,5,4,1,13,6,12,3,34,21,22 [Only parents]",
          },
          {
            id: this.$constants.FILTERS.CARCASS_NOP_MULTI_AND_DRAWER_BOX_SINGLE,
            name: "Carcass + Drawer Box Parts + Door / Drawer Fronts",
            description:
              "TYP: 14,5,4,1,13,6,12,3,34,21,22 [Only parent] + 23,8,9,10 [Single parts]",
          },
          {
            id: this.$constants.FILTERS.ART_ID,
            name: "ADJ Shelves Only",
            description: "All TYP: 3",
          },
          {
            id: this.$constants.FILTERS.TOE_KICK,
            name: "Toe Kick",
            description:
              "All TYP: 27 from the same ART ID - TYP 27 parts where MPE TYPE is 1",
          },
          {
            id: this.$constants.FILTERS.MULTI_5_PIECE_FRONTS_PARTS,
            name: "5 Piece Door/Drawer Fronts",
            description:
              "All TYP: 8,9,10,23 from the same MPE [Childs without parents]",
          },
          {
            id: this.$constants.FILTERS.MULTI_PARTS,
            name: "Multi Parts",
            //description: 'All parts with a MPE TYPE value of 1 ( except TYP 8,9,10,23,27) go in one bin with all parts what the PARENT ID is the same as the Multi Parts ID'
            description:
              "All child parts (except TYP 8,9,10,23,27) go in one bin with other child parts with the same PARENT ID",
            /* sort childs without parents  */
          },

          {
            /*
                        All Parts
                        All parts of the same ART ID in one Bin
                        */
            id: this.$constants.FILTERS.ALL_PARTS,
            name: "All Parts",
            description: "All Available Parts",
          },
        ],
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    toggle(isSelected, select, e) {
      select(!isSelected);
    },
    open() {
      this.display = true;
    },

    save() {
      this.display = false;

      this.$emit("save", this.selectedFilters);
    },
    close() {
      this.display = false;

      this.$emit("close");
    },
  },
};
</script>

<template>
<div>

    <v-dialog persistent v-model="display" :width="$vuetify.breakpoint.mdAndDown ? '' : '50vw'" @keydown.esc="close">
        <v-card>
            <v-card-title class="headline">Parts distribution logs</v-card-title>

            <v-card-text>
<v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
                <v-data-table :headers="data.headers" dense :items="data.items" :search="search" height="35vh" :items-per-page="50" item-key="id" class="elevation-1">

                </v-data-table>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="primary" text @click="clear" :disabled="!this.data.items.length">
                    Clear
                </v-btn>
                <v-btn color="primary" text @click="close">
                    Close
                </v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>

</div>
</template>

<script>
export default {
    name: "LogsDialog",
    data: function () {
        return {

            display: false,
            search: "",
            data: {
                headers: [{
                        text: "Timestamp",
                        value: "timestamp",
                    },
                    {
                        text: "Part",
                        value: "part",
                    },
                    {
                        text: "Result",
                        value: "result",
                    },

                ],
                items: [
                ]
            }
        }
    },
    computed: {

    },
    created() {

    },
    methods: {
        open(payload) {

            this.data.items = payload

            this.display = true;

        },

        clear() {
            
            this.data.items = []

            this.$emit('clear')
            
        },
        close() {

            this.display = false

            this.$emit('close')
        },

    },

};
</script>

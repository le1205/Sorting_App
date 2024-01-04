<template>
<div>

    <v-dialog persistent v-model="display" width="65vw" @keydown.esc="close">
        <v-card>
            <v-card-title class="headline">Parts distribution</v-card-title>

            <v-card-text>
                <v-container>
                    <v-row no-gutters>
                        <v-col cols="4">

                            <v-btn color="success" class="ma-2" fab @click="onDistributeClick" :disabled="!data.selectedCarts.length">
                                <v-icon dark>mdi-play</v-icon>
                            </v-btn>
                            <!--
                            <v-btn class="ma-2" fab @click="onUndoClick">
                                <v-icon dark>mdi-undo</v-icon>
                            </v-btn>
-->
<!--
                            <v-btn class="ma-2" fab @click="clear" :disabled="!this.data.logs.items.length">
                                <v-icon dark>mdi-delete-empty</v-icon>
                            </v-btn>
-->                            
                        </v-col>
                        <v-col cols="8">
                            <v-select v-model="data.selectedCarts" :items="carts" chips :deletable-chips="true" label="Carts" multiple outlined></v-select>
                           
                        </v-col>

                    </v-row>
                    <v-row>
                    </v-row>

                    <v-row no-gutters>
                        <v-col>

                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                            <v-data-table height="35vh" :headers="data.logs.headers" :items="data.logs.items" :search="search" :items-per-page="15" item-key="id" class="elevation-1">
                            </v-data-table>


                        </v-col>
                    </v-row>

                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

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
    name: "DistributionDialog",
    props:{
        carts:{
            type: Array
        }
    },
    data: function () {
        return {

            display: false,
            search: "",
            cartItems: ['foo', 'bar', 'fizz', 'buzz'],
            data: {
                selectedCarts: [],
                logs: {
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
                    items: []
                }
            }
        }
    },
    computed: {

    },
    created() {

    },
    methods: {
        onUndoClick(){

        },
        onDistributeClick(){

            this.$emit('run',this.data.selectedCarts)

        },
        open(payload) {

            this.data.logs.items = payload.logsItems
            this.data.selectedCarts = payload.selectedCarts

            this.display = true;

        },

        clear() {

            this.data.logs.items = []

            this.$emit('clear')

        },
        close() {

            this.display = false

            this.$emit('close')
        },

    },

};
</script>

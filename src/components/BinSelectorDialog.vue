<template>
<div>

    <v-dialog persistent v-model="display" :width="$vuetify.breakpoint.mdAndDown ? '' : '50vw'" @keydown.esc="close">
        <v-card>
            <v-card-title class="headline">Select bin</v-card-title>

            <v-carousel ref='car' v-model="selectedCartIndex" height="65vh" @change="onSelectedCartChange">
                <v-carousel-item eager v-for="(cart,index) in carts" :key="`ci-${index}`">
                   <v-chip label class="ml-3">  {{cart.alias}} [{{cart.type}}]</v-chip>
                    <v-sheet color="white" tile >

                        <cart-editor :ref="`cart-editor-${index}`" :id="cart.id" action="view" @bin-selected="onBinSelected"></cart-editor>

                    </v-sheet>
                </v-carousel-item>
            </v-carousel>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="primary" text @click="save" :disabled="this.selectedBin === undefined">
                    Select
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
import CartEditor from "./CartEditor";

import {
    mapGetters,
    mapState,
    mapActions
} from "vuex";
import to from 'await-to-js';

export default {
    name: "BinSelectorDialog",
    components: {
        CartEditor
    },
    data: function () {
        return {
            display: false,
            search: "",
            selectedCartIndex: 0,
            selectedBin: undefined,
            carts: [],

        }
    },
    computed: {

    },
    created() {

    },
    async mounted() {

        let [error, response] = await to(this.getCarts())

        if (!response) {

            this.$refs.dialog.open("getCarts", error.message, {
                OK: "OK",
            });
            return
        }

        this.carts = response

    },
    methods: {
        ...mapActions("carts", ["getCarts"]),
        onBinSelected(payload){


            this.selectedBin = payload

        },
        open() {


            if (this.$refs['cart-editor-'+ this.selectedCartIndex]){

                this.$refs['cart-editor-'+ this.selectedCartIndex][0].initialize()

                

            }            

            this.display = true;

        },

        save() {
            this.display = false

            this.$emit('save', {cart: this.carts[this.selectedCartIndex], bin: this.selectedBin})
        },
        close() {
            this.display = false

            this.$emit('close')
        },
        onSelectedCartChange(){
            //console.log('onSelectedCartChange')
        }

    },
    watch:{
        'selectedCartIndex'(newVal){

            if (this.$refs['cart-editor-'+newVal]){

             this.$refs['cart-editor-'+newVal][0].initialize()

            }

        }

    }

};
</script>

<template>
<v-card height="90vh">
    <!--<v-card-title class="headline">Select bin</v-card-title>-->

    <v-container>
        <v-row>
            <v-col cols="3">
                <v-text-field ref="searchInput" v-model="searchValue" @focus="onSearchInputFocus" @blur="onSearchInputBlur" label="Search" single-line hide-details></v-text-field>
            </v-col>
            <v-col cols="1">
                <v-btn ref="searchBtn" tile color="primary" class="mt-2" @click="onPartSearchClick" :disabled="!this.scanner.active">
                    <v-icon left> mdi-magnify </v-icon>
                    Search
                </v-btn>
            </v-col>
            <v-col class="text-right" cols="8">
                <v-btn ref="logoutBtn" tile color="" class="mt-2" @click="logOut" v-if="!isAdmin" >
                    <v-icon left> mdi-logout </v-icon>
                    Logout
                </v-btn>
            </v-col>

        </v-row>
    </v-container>

    <v-carousel ref="car" v-model="selectedCartIndex" height="83vh" @change="onSelectedCartChange">
        <v-carousel-item v-for="(cart, index) in carts" :key="`ci-${index}`">
            <v-sheet color="white" tile>
                <cart-editor :ref="`cart-editor-${index}`" :id="cart.id" action="view" @bin-selected="onBinSelected" @initialized="onCartEditorInitialized(cart, index)"></cart-editor>
            </v-sheet>
        </v-carousel-item>
    </v-carousel>

    <v-card-actions> </v-card-actions>

    <dialog-wrapper ref="dialog"> </dialog-wrapper>
    <search-results-modal ref="search-results-modal"> </search-results-modal>

</v-card>
</template>

<script>
import CartEditor from "./CartEditor";
import DialogWrapper from "./DialogWrapper";
import SearchResultsModal from "./SearchResultsModal";

import {
    mapGetters,
    mapState,
    mapActions
} from "vuex";
import to from "await-to-js";

export default {
    name: "Sorting",
    components: {
        CartEditor,
        DialogWrapper,
        SearchResultsModal
    },
    data: function () {
        return {
            loading: false,
            display: false,
            searchValue: "",
            selectedCartIndex: 0,
            selectedBin: undefined,
            partWaitingForCartInit: undefined,
            carts: [],
            parts: [],
            scanner: {
                disabled: false,
                active: true,
                timerId: undefined,
                sensitivity: 200,
                buffer: [],
                scannedSequence: [],
            },
        };
    },
    computed: {
        ...mapState("auth", ["isLoading", "status"]),
        ...mapGetters("auth", ["isAdmin"]),
    },
    created() {

        window.addEventListener("focus", this.onWindowFocus);

        window.addEventListener("blur", this.onWindowBlur);

        window.addEventListener("keydown", this.onKeyDown);
    },
    destroyed() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("focus", this.onWindowFocus);
        window.removeEventListener("blur", this.onWindowBlur);
    },

    async mounted() {
        {

        
            let [error, response] = await to(this.getCarts());

            if (!response) {
                this.$refs.dialog.open("getCarts", error.message, {
                    OK: "OK",
                });

                //return;

                response = []
            }

            this.carts = response;
        }
  
        {
            let [error, response] = await to(this.getParts());

            if (!response) {
                this.$refs.dialog.open("getParts", error.message, {
                    OK: "OK",
                });
                return;
            }

            this.parts = response;
        }

        
    },
    methods: {
        //  this.$refs['cart-editor-'+ this.selectedCartIndex][0].initialize()

        ...mapActions("carts", ["getCarts"]),
        ...mapActions("parts", ["getParts", "updatePart", "updatePartState"]),
        ...mapActions("auth", ["signOut"]),
        logOut() {

            this.signOut().then(() => {
                this.$router.push('/login_sh')
            })

        },        
        onSearchInputFocus() {
            this.scanner.disabled = true;
        },
        onSearchInputBlur() {
            this.scanner.disabled = false;
        },
        onWindowFocus(e) {
            //console.log("window.focus");
            this.scanner.active = true;
        },
        onWindowBlur(e) {
            //console.log("window.blur");
            this.scanner.active = false;
        },

        onKeyDown(e) {
            if (this.scanner.disabled) return;

            if (e.keyCode === 13 || e.keyCode === 9) {
                this.onBarcodeScanned();
            } else {

                let regex = /^[0-9A-Za-z_-]$/g;

                let isValidKey = regex.test(e.key)

                //console.log(`regex.test(${e.key}):`, isValidKey)

                if (isValidKey) {

                    this.scanner.buffer.push(e.key);

                    ////console.log(this.scanner.buffer.join(""));
                }

                clearTimeout(this.scanner.timerId);

                this.scanner.timerId = setTimeout(
                    this.onBarcodeScanned,
                    this.scanner.sensitivity
                );
            }

            //this.$refs.searchInput.$el.focus()

            ////console.log(e.key)
        },
        onBarcodeScanned() {

            clearTimeout(this.scanner.timerId);

            if (this.scanner.buffer.length === 0) {
                //console.log('onBarcodeScanned: empty value, return')
                return
            }

            ////console.log(this.scanner.buffer.join(''));

            this.scanner.scannedSequence = this.scanner.buffer.join("");

            //console.log("scannedSequence:", this.scanner.scannedSequence);

            this.scanner.buffer = [];

            //this.searchValue = this.scanner.scannedSequence.replace('-','_').toUpperCase()
/*
            if (this.scanner.scannedSequence === 'all-typ-1021') this.scanner.scannedSequence = 'euro_base-1031'
            if (this.scanner.scannedSequence === 'all-typ-1022') this.scanner.scannedSequence = 'Sorting_FF-1035'
            if (this.scanner.scannedSequence === 'all-typ-1038') this.scanner.scannedSequence = 'ALL_TYP-1072_000000000000'
            if (this.scanner.scannedSequence === 'all-typ-1072') this.scanner.scannedSequence = 'euro_base-1003'

            if (this.scanner.scannedSequence === 'all-typ-1021') this.scanner.scannedSequence = 'euro_base-1101'
            if (this.scanner.scannedSequence === 'all-typ-1022') this.scanner.scannedSequence = 'euro_base-1107'
            if (this.scanner.scannedSequence === 'all-typ-1038') this.scanner.scannedSequence = 'ALL_TYP-1072_000000000000'
            if (this.scanner.scannedSequence === 'all-typ-1072') this.scanner.scannedSequence = 'euro_base-1095'
*/

            this.searchValue = this.scanner.scannedSequence;

            this.onPartSearchClick();
        },

        async onPartSearchClick() {
            const value = this.searchValue;

            const parts = this.parts.filter(
                (part) => part["BARCODE"] === value
            );

            if (parts.length > 1) {
                this.$refs.dialog.open(
                    "Error",
                    "Multiple orders detected: " +
                    JSON.stringify(
                        parts.map((p) => ({
                            _order_uid: p._order_uid,
                            name: p["ORDERNAME"],
                        }))
                    ) +
                    ". Value of BARCODE must be unique!", {
                        OK: "OK",
                    }
                );

                return;
            }

            //console.log("onPartSearchClick.VALUE:", value);
            //console.log("onPartSearchClick.VALUE.length:", value.length);

            let part = this.parts.find((part) => part["BARCODE"] === value);

            //console.log("onPartSearchClick.RESULT.part:", part);

            if (!part || !part._cart_uid) {

                //close results modal if it was open before
                this.$refs[`cart-editor-${this.selectedCartIndex}`][0].closeSearchResults();
                
                //show no results
                this.$refs['search-results-modal'].open(undefined, {top: value,middle: 'PART',bottom: `NOT FOUND`})

            } else {
                
                //close results modal if it was open before
                this.$refs['search-results-modal'].close()

                //console.log("cartId", part._cart_uid);



                const cartIndex = this.carts.findIndex((c) => c.id === part._cart_uid);

                this.selectedCartIndex = cartIndex;

                //if cart editor initialized then show location 
                if (this.$refs[`cart-editor-${cartIndex}`]) {

                    this.$refs[`cart-editor-${this.selectedCartIndex}`][0].closeSearchResults();
                    
                    if (part._state !== this.$constants.PART_STATE.OK)
                    await this.updatePartState({part: part, state: this.$constants.PART_STATE.OK} )
                    else part._additionalMessage = 'Part already scanned!'

                    this.$refs[`cart-editor-${this.selectedCartIndex}`][0].showPartLocation(part);

                    //otherwise wait for init event
                } else {
                    this.partWaitingForCartInit = part;
                }

            }

        },

        async onCartEditorInitialized(cart, index) {

            //console.log("onCartEditorInitialized", cart.alias, index);

            if (!this.partWaitingForCartInit) return;

            //postponed search
            if (this.$refs[`cart-editor-${this.selectedCartIndex}`]) {

                this.$refs[`cart-editor-${this.selectedCartIndex}`][0].closeSearchResults();

                if (this.partWaitingForCartInit._state !== this.$constants.PART_STATE.OK)
                  await this.updatePartState({part: this.partWaitingForCartInit, state: this.$constants.PART_STATE.OK} )
                else this.partWaitingForCartInit._additionalMessage = 'Part already scanned!'

                this.$refs[`cart-editor-${this.selectedCartIndex}`][0].showPartLocation(this.partWaitingForCartInit);

                this.partWaitingForCartInit = undefined;
            }

        },
        onBinSelected(payload) {
            this.selectedBin = payload;
        },
        onSelectedCartChange() {
            //console.log("onSelectedCartChange");
        },
    },
    watch: {
        selectedCartIndex(newVal, oldVal) {

            console.log("selectedCartIndex", newVal);

            //close search results if it was open before
            if (this.$refs["cart-editor-" + oldVal]) {
                this.$refs[`cart-editor-${oldVal}`][0].closeSearchResults();
            }

            if (this.$refs["cart-editor-" + newVal]) {

                this.$refs["cart-editor-" + newVal][0].initialize();
            }
        },
    },
};
</script>

<template>
<v-row justify="center">
    <v-dialog v-model="show" persistent  :max-width="$vuetify.breakpoint.mdAndDown ? '100vw' : '70vw'">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title>{{this.cartAlias}}, Bin {{this.data.order}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="toggleSettings">
                    <v-icon v-if="!showSettings">mdi-dots-vertical</v-icon>
                    <v-icon v-if="showSettings">mdi-backburger</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container v-if="showSettings">
                <v-form ref="form">

                    <v-row class="mb-4">
                        <v-col cols="12">
                            <v-slider label="Max Parts Count" v-model="data.maxPartsCount" always-dirty min="1" max="70">
                                <template v-slot:append v-on="on">
                                    <v-text-field v-model.number="data.maxPartsCount" class="mt-0 pt-0" style="width: 60px"></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>

                    <v-row class="mb-4">
                        <v-col cols="12">
                            <v-slider label="Width (In)" v-model="data.width" always-dirty :min="minSize" :max="maxSize">
                                <template v-slot:append v-on="on">
                                    <v-text-field v-model.number="data.width" class="mt-0 pt-0" style="width: 60px"></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row class="mb-4">
                        <v-col cols="12">
                            <v-slider label="Height (In)" v-model="data.height" always-dirty :min="minSize" :max="maxSize">
                                <template v-slot:append v-on="on">
                                    <v-text-field v-model.number="data.height" class="mt-0 pt-0" style="width: 60px"></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row class="mb-4">
                        <v-col cols="12">
                            <v-slider label="Depth (In)" v-model="data.depth" always-dirty :min="minSize" :max="maxSize">
                                <template v-slot:append v-on="on">
                                    <v-text-field v-model.number="data.depth" class="mt-0 pt-0" style="width: 60px"></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>

                </v-form>
            </v-container>
            <v-container v-if="!showSettings">
                <v-data-table dense height="40vh" :headers="headers" :items="binParts" :items-per-page="10" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr :class="item['_uid'] === selectedPart ? 'yellow':''">

                            <td v-if='isHeaderVisible("ORDERNAME")'>{{item["ORDERNAME"]}}</td>
                            <td v-if='isHeaderVisible("ART ID")'>{{item["ART ID"]}}</td>
                            <td v-if='isHeaderVisible("PARENT ID")'>{{item["PARENT ID"]}}</td>
                            <td v-if='isHeaderVisible("MPE TYPE")'>{{item["MPE TYPE"]}}</td>
                            <td v-if='isHeaderVisible("ID")'>{{item["ID"]}}</td>
                            <td v-if='isHeaderVisible("BARCODE")'>{{item["BARCODE"]}}</td>
                            <td v-if='isHeaderVisible("NAME1")'>{{item["NAME1"]}}</td>
                            <td v-if='isHeaderVisible("NCNO")'>{{item["NCNO"]}}</td>
                            <td v-if='isHeaderVisible("_width_decimal")'>{{item["_width_decimal"]}}</td>
                            <td v-if='isHeaderVisible("_length_decimal")'>{{item["_length_decimal"]}}</td>
                            <td v-if='isHeaderVisible("_thickness_decimal")'>{{item["_thickness_decimal"]}}</td>

                            <td>
                                <!--  tile -->
                                <v-btn-toggle dense borderless v-model="item._state">
                                    <v-btn :elevation="0" :color="item._state === PART_STATE.OK ? 'green accent-1' : ''" :value="PART_STATE.OK" @click="onPartStateClick(item, PART_STATE.OK)">
                                        <span class="hidden-sm-and-down">OK</span>
                                    </v-btn>

                                    <v-btn :color="item._state === PART_STATE.DAMAGED ? 'red accent-1' : ''" :value="PART_STATE.DAMAGED" @click="onPartStateClick(item, PART_STATE.DAMAGED)">
                                        <span class="hidden-sm-and-down">DAMAGED</span>
                                    </v-btn>

                                    <v-btn :color="item._state === PART_STATE.MISSING ? 'purple accent-1' : ''" :value="PART_STATE.MISSING" @click="onPartStateClick(item, PART_STATE.MISSING)">
                                        <span class="hidden-sm-and-down">MISSING</span>
                                    </v-btn>

                                </v-btn-toggle>

                            </td>
                            <!--
                            <td>
                                <v-btn text icon @click="removePartFromBin(item)">
                                    <v-icon> mdi-delete </v-icon>
                                </v-btn>

                            </td>
-->
                        </tr>
                    </template>

                </v-data-table>

            </v-container>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="blue darken-1" text @click="close()">
                    Close
                </v-btn>

                <v-btn color="blue darken-1" text @click="save()">
                    Save
                </v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>
</v-row>
</template>

<script>
// @ is an alias to /src
import to from 'await-to-js';

import {
    mapState,
    mapActions,
} from "vuex";
export default {
    name: 'bin',
    components: {

    },
    data: function () {
        return {
            PART_STATE: this.$constants.PART_STATE,
            showSettings: false,
            selectedPart: undefined,
            cartAlias: '',
            data: {},
            parts: {
                headers: [{
                        text: "ORDER",
                        value: "ORDERNAME",
                        showMobile: true,
                    },
                    {
                        text: "ART ID",
                        value: "ART ID",
                        showMobile: true,
                    },
                    {
                        text: "PARENT ID",
                        value: "PARENT ID",
                        showMobile: false,
                    },
                    {
                        text: "MPE TYPE",
                        value: "MPE TYPE",
                        showMobile: false,
                    },
                    {
                        text: "ID",
                        value: "ID",
                        showMobile: true,
                    },
                    {
                        text: "BARCODE",
                        value: "BARCODE",
                        showMobile: true,
                    },

                    {
                        text: "NAME",
                        value: "NAME1",
                        showMobile: true,
                    },

                    {
                        text: "NCNO",
                        value: "NCNO",
                        showMobile: false,
                    },
                    {
                        text: "Width",
                        value: "_width_decimal",
                        showMobile: false,
                    },
                    {
                        text: "Length",
                        value: "_length_decimal",
                        showMobile: false,
                    },
                    {
                        text: "Thickness",
                        value: "_thickness_decimal",
                        showMobile: false,
                    },

                    {
                        text: "State",
                        value: "state",
                        sortable: false,
                        showMobile: false,
                    },
                ],
                items: [],
            },
            minSize: 2,
            maxSize: 120,
            mode: undefined,
            show: false,
            rules: [
                id => !!id || 'Required.',
                //value => (value && value.length >= 3) || 'Min 3 characters',
            ],

        }
    },
    computed: {
        headers() {

            return this.isMobile ? this.parts.headers.filter(h => h.showMobile) : this.parts.headers

        },
        isMobile(){

            return this.$vuetify.breakpoint.mdAndDown

        },
        binParts() {
            return this.data.parts ? this.data.parts.filter(p => p._bin_uid === this.data.id) : []
        }

    },
    mounted() {
        ////console.log('binEditor mounted')
    },
    methods: {
        ...mapActions("carts", ["getCarts"]),
        ...mapActions("parts", ["getBinParts", "updatePart"]),
        // ...mapGetters('orders', ['getOrders']),
        isHeaderVisible(h) {

            return this.headers.find( i => i.value === h) ? true : false

        },        

        initialize() {

            this.data = {
                cartId: '',
                id: '',
                order: undefined,
                description: '',
                width: 2,
                height: 2,
                depth: 2,
                maxPartsCount: 70,
                parts: [{}],
            }

        },
        toggleSettings() {

            this.showSettings = !this.showSettings

        },
        async onPartStateClick(part, state) {

            if (state === part._state) {
                part._state = null
            } else {
                part._state = state
            }

            //update storage
            part._loading = true
            let result = await this.updatePart(part)
            part._loading = false

        },
        async removePartFromBin(part) {

            this.data.parts = this.data.parts.filter(p => p._uid !== part._uid)

            //unlink part from the bin and cart
            part._cart_uid = null
            part._bin_uid = null
            part._cart_alias = null
            part._bin_order = null
part._state = null

            //update storage
            part._loading = true
            let result = await this.updatePart(part)
            part._loading = false

        },
        async open(payload) {

            let that = this

            const carts = await that.getCarts()

            this.showSettings = false

            if (!payload.bin.id) {

                this.mode = this.$constants.FORM_MODE.CREATE
                this.initialize()

                this.data.cartId = payload.bin.cartId
                this.data.id = this.$nanoid()
                this.data.created = true

            } else {

                that.mode = this.$constants.FORM_MODE.EDIT

                that.data = JSON.parse(JSON.stringify(payload.bin));

                that.cartAlias = carts.find(c => c.id === that.data.cartId).alias

                if (payload.part) {

                    this.selectedPart = payload.part._uid

                }

                //that.data = payload;
                /*
                                let [error, parts] = await to(this.getBinParts({
                                    _bin_uid: this.data.id
                                }))

                                //this.parts.items = parts
                                //this.data.parts = parts
                */
                ////console.object('parts',parts)
            }

            this.show = true

        },
        save() {

            // if (!this.$refs.form.validate()) return

            if (this.mode === this.$constants.FORM_MODE.CREATE) {
                this.$emit('create', this.data)
            }

            if (this.mode === this.$constants.FORM_MODE.EDIT) {

                this.data.updated = true

                this.$emit('update', this.data)

            }

            this.show = false

        },

        close() {
            this.show = false
        },
    },
    watch: {

    }

}
</script>

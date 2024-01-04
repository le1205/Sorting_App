<template>
<v-row justify="center">
    <v-dialog v-model="show" persistent max-width="600px">

        <v-card>
            <v-card-title>
                <span class="headline">Bin</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-container>
                        <v-row>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field label="Cart #" v-model="data.cartId" :disabled="true"></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field label="Bin #" v-model="data.id" :disabled="true" hint=""></v-text-field>
                            </v-col>

                        </v-row>
                        <v-row>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field label="Order" v-model.number="data.order" hint=""></v-text-field>
                            </v-col>

                            <v-col cols="9" sm="9" md="9">
                                <v-text-field label="Description" v-model="data.description" hint=""></v-text-field>
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-row class="mb-4">
                                    <v-col cols="12">
                                        <!-- <v-subheader>Parts</v-subheader> -->
                                        <v-slider label="Max Parts Count" v-model="data.maxPartsCount" always-dirty min="1" max="10">
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

                            </v-col>

                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
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

export default {
    name: 'bin',
    components: {

    },
    data: function () {
        return {
            data: {},
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
    mounted() {
        ////console.log('binEditor mounted')
    },
    methods: {
        // ...mapGetters('orders', ['getOrders']),
        initialize() {

            this.data = {
                cartId: '',
                id: '',
                order: 1,
                description: '',
                /*min/max 2-120 */
                width: 2,
                height: 2,
                depth: 2,
                maxPartsCount: 10,
            }

        },
        open(payload) {

            let that = this

            if (!payload.id) {

                this.mode = this.$constants.FORM_MODE.CREATE
                this.initialize()

                this.data.cartId = payload.cartId
                this.data.id = this.$nanoid()
                this.data.created = true

            } else {

                that.mode = this.$constants.FORM_MODE.EDIT

                that.data = JSON.parse(JSON.stringify(payload));

            }

            this.show = true

        },
        save() {

            if (!this.$refs.form.validate()) return
            

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

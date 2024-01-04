<template>
<v-row justify="center">
    <v-dialog v-model="show" persistent :max-width="$vuetify.breakpoint.mdAndDown ? '100vw' : '60vw'">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title>Selected bins editing</v-toolbar-title>
            </v-toolbar>
            <v-container>
                <v-form ref="form">

                    <v-row class="mb-4">
                        <v-col cols="12">
                            <v-slider label="Max Parts Count" v-model="data.maxPartsCount.value" always-dirty min="1" max="70" :track-color="getColor(data.maxPartsCount)" :color="getColor(data.maxPartsCount)" @click="data.maxPartsCount.updated = true">
                                <template v-slot:append v-on="on">
                                    <v-text-field v-model.number="data.maxPartsCount.value" class="mt-0 pt-0" style="width: 60px" @input="data.maxPartsCount.updated = true"></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>

                    <v-row class="mb-4">
                        <v-col cols="12">
                            <v-slider label="Width (In)" v-model="data.width.value" always-dirty :min="minSize" :max="maxSize" :track-color="getColor(data.width)" :color="getColor(data.width)" @click="data.width.updated = true">
                                <template v-slot:append v-on="on">
                                    <v-text-field v-model.number="data.width.value" class="mt-0 pt-0" style="width: 60px" @input="data.width.updated = true"></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row class="mb-4">
                        <v-col cols="12">
                            <v-slider label="Height (In)" v-model="data.height.value" always-dirty :min="minSize" :max="maxSize" :track-color="getColor(data.height)" :color="getColor(data.height)" @click="data.height.updated = true">
                                <template v-slot:append v-on="on">
                                    <v-text-field v-model.number="data.height.value" class="mt-0 pt-0" style="width: 60px" @input="data.height.updated = true"></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row class="mb-4">
                        <v-col cols="12">
                            <v-slider label="Depth (In)" v-model="data.depth.value" always-dirty :min="minSize" :max="maxSize" :track-color="getColor(data.depth)" :color="getColor(data.depth)" @click="data.depth.updated = true">
                                <template v-slot:append v-on="on">
                                    <v-text-field v-model.number="data.depth.value" class="mt-0 pt-0" style="width: 60px" @input="data.depth.updated = true"></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>

                </v-form>
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

export default {
    name: 'groupBinEditor',
    components: {

    },
    data: function () {
        return {
            data: {
                maxPartsCount: {
                    value: 0,
                    updated: false
                },
                width: {
                    value: 0,
                    updated: false
                },
                height: {
                    value: 0,
                    updated: false
                },
                depth: {
                    value: 0,
                    updated: false
                },

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
    mounted() {},
    methods: {
        getColor(item) {

            return item.updated ? '' : 'grey lighten-4'

        },

        open() {

            this.show = true

        },
        save() {

            if (!this.$refs.form.validate()) return

            let payload = {
                updated: true
            }
            
            if (this.data.maxPartsCount.updated) payload.maxPartsCount = this.data.maxPartsCount.value
            if (this.data.width.updated) payload.width = this.data.width.value
            if (this.data.height.updated) payload.height = this.data.height.value
            if (this.data.depth.updated) payload.depth = this.data.depth.value

            this.$emit('update', payload)

            this.show = false

        },

        close() {

            this.show = false

        },
    },
    watch: {
        /*
        'data.maxPartsCount'(newValue,oldValue){
            if (newValue !== oldValue)
            this.updated.maxPartsCount = true
        },
        'data.width'(newValue,oldValue){
            if (newValue !== oldValue)
            this.updated.width = true
        },
        'data.height'(newValue,oldValue){
            if (newValue !== oldValue)
            this.updated.height = true
        },
        'data.depth'(newValue,oldValue){
            if (newValue !== oldValue)
            this.updated.depth = true
        },
        */

    }

}
</script>

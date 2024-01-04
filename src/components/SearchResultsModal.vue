<template>
<div>

    <v-dialog persistent width="70vw" v-model="display" @keydown.esc="close">
        <v-card :color="color">
            <v-card-title class="headline"></v-card-title>

            <v-card-text style="height:700px;text-align: center;font-size:6em;line-height: 1.5em;font-weight: 900 ">

                <v-container fill-height fluid>
                    <v-row align="center" justify="center">
                        <v-col>
                             <div v-if="text.top" v-text="text.top"/>
                            <div v-text="text.middle" />
                            <div v-text="text.bottom" />

                        </v-col>
                    </v-row>

                </v-container>

            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="result" class="ma-2" fab @click="onWrenchClick">
                    <v-icon size="3em">mdi-wrench-outline</v-icon>
                </v-btn>

                <v-btn class="ma-2" fab @click="close">
                    <v-icon size="3em">mdi-close</v-icon>
                </v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>

</div>
</template>

<script>
export default {
    name: "SearchResultsModal",
    data: function () {
        return {
            result: false,
            display: false,
            search: "",
            part: undefined,
            text: {
                top: '',
                middle: '',
                bottom: ''
            }

        }
    },
    computed: {
        color() {
            return this.result ? 'green' : 'red'
        },

    },
    created() {

    },
    methods: {

        open(_part, _text) {

            this.part = _part
            this.text = _text

            this.result = this.part !== undefined ? true : false

            this.display = true;

        },
        clear() {

            this.$emit('clear')

        },
        close() {

            this.part = undefined
            this.text = {
                top: '',
                middle: '',
                bottom: ''
            }

            this.display = false

            this.$emit('close')
        },
        onWrenchClick() {

            //console.log('onWrenchClick')

            this.$emit('details', this.part)
            

            //this.close()
        }
    },
};
</script>

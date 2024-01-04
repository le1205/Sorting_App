<template>
<div>

    <v-dialog persistent v-model="dialog" max-width="290">
        <v-card>
            <v-card-title class="headline">{{options.title}}</v-card-title>

            <v-card-text>
               <div class="mb-4"> {{options.body}} </div>
               
                <v-text-field v-if="options.inputRequired" v-model="input" :type="!options.password ? 'text' : 'password'"  light required outlined dense></v-text-field>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn v-show="OK" color="primary" text @click="onClickOK" :disabled="options.inputRequired && !input">
                    {{options.buttons.OK}}
                </v-btn>
                <v-btn v-show="CANCEL" color="primary" text @click="onClickCancel">
                    {{options.buttons.CANCEL}}
                </v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
export default {
    name: "DialogWrapper",
    data: function () {
        return {

            dialog: false,
            input: '',
            options: {
                title: '',
                body: '',
                inputRequred: false,
                buttons: {},
                width: 400,
                zIndex: 200
            },
            resolve: null,
            reject: null
        }
    },
    computed: {
        OK() {
            return (this.options.buttons.OK !== undefined)
        },
        CANCEL() {
            return (this.options.buttons.CANCEL !== undefined)
        }

    },
    created(){
        this.input = ''
    },
    methods: {
        open(_title, _body, _buttons, _options) {

            this.dialog = true;

            let options = {
                title: _title,
                body: _body,
                inputRequired: (_options && _options.input) ,
                password: (_options && _options.password),
                buttons: _buttons
            }
            this.options = Object.assign(this.options, options);

            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        },
        onClickOK() {
            
            if (this.options.inputRequired)
                this.resolve(this.input);
            else
                this.resolve(true);
            this.dialog = false;
        },
        onClickCancel() {
            this.resolve(false);
            this.dialog = false;
        }
    },

    provide: function () {
        return {
            agree: this.agree,
            cancel: this.cancel
        };
    }
};
</script>

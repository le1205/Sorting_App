<template>
<div>

    <v-dialog v-if="display" persistent v-model="display" :width="$vuetify.breakpoint.mdAndDown ? '' : '30em'" @keydown.esc="close">
        <v-card>
            <v-card-title class="headline">{{title}}</v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="validForm">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="data.name" label="User name"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="data.email"  label="E-mail" required></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="data.password" autocomplete="new-password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 6 characters" counter @click:append="showPassword = !showPassword" required></v-text-field>
                            </v-col>

                        </v-row>
                         <v-row>
                            <v-col cols="6">
                                <v-switch v-model="data.admin" inset label="Admin"></v-switch>
                            </v-col>                             
                            <v-col cols="6">
                                <v-switch v-model="data.disabled" inset label="Disabled"></v-switch>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="primary" text @click="save">
                    Save
                </v-btn>
                <v-btn color="primary" text @click="close">
                    Close
                </v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>
     <dialog-wrapper ref="dialog"> </dialog-wrapper>

</div>
</template>

<script>
import DialogWrapper from './DialogWrapper';

import {
    mapState,
    mapActions,

} from "vuex";

export default {
    name: "UserEditorDialog",
    components: {
        DialogWrapper
    },
    data: function () {
        return {
            display: false,
            validForm: true,
            showPassword: false,
            mode: undefined,
            title: '',
            data: {
                uid: '',
                name: '',
                email: '',
                password: '',
                disabled: false,
                admin: false,
            },
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 6 || 'Min 6 characters',
                //min: v => v || 'Min 6 characters',
                emailMatch: () => (`The email and password you entered don't match`),
            },
        }
    },
    computed: {

    },
    created() {
//console.log('created')
    },
    mounted(){
//console.log('mounted')
    },
    methods: {
        ...mapActions('users', ['createUser', 'updateUser']),
        open(payload) {

            this.display = true;
            
            ////console.log('open.payload',JSON.stringify(payload))

            if (this.$refs.form) this.$refs.form.reset();

            if (!payload) {

                this.mode = 'create'

                this.title = "Add user"
/*
                this.data = {
                    uid: '',
                    name: 'test',
                    email: 'test@test.com',
                    password: 'test12',
                     disabled: false
                }
*/               
                this.data = {
                    uid: '',
                    name: '',
                    email: '',
                    password: '',
                     disabled: false,
                     admin: false,
                } 
            } else {

                this.mode = 'update'

                this.title = "Edit user"

               // payload.password = ''

                this.data = payload

                
            }

            this.$forceUpdate()
        },
        save() {

            let self = this

            this.$refs.form.validate();

            if (!this.validForm) return

            if (this.mode === 'create'){

                this.createUsr()

            }
            else{
                this.updateUsr()
            }


        },
        close() {

            this.display = false

            this.$emit('close')
        },
        createUsr(){

            const self = this

            this.createUser(this.data).then(response => {

                this.display = false

                 this.$emit('close')

            }).catch(async function (error) {

                await self.$refs.dialog.open("Error", error.message, {
                    OK: 'CLOSE'
                })

                return false
            })

        },
        updateUsr(){

            const self = this
            
            this.updateUser(this.data).then(response => {

                this.display = false

                 this.$emit('close')

            }).catch(async function (error) {

                await self.$refs.dialog.open("Error", error.message, {
                    OK: 'CLOSE'
                })

                return false
            })

        },


    },
    watch:{
        'data'(newVal, oldVal){

            ////console.log('new/old',JSON.stringify(newVal), JSON.stringify(oldVal))
        }
    }

};
</script>

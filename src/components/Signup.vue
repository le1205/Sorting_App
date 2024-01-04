<template>
<v-container class="fill-height" fluid>
    <v-row align="center" justify="center" no-gutters>
        <v-col cols="12" sm="8" md="4">

            <v-card class="elevation-5 m-0">
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Signup</v-toolbar-title>
                    <v-spacer></v-spacer>

                </v-toolbar>
                <v-card-text no-gutters>

                    <v-form>
                        <v-container fluid>
                            <v-row align="center" justify="center" no-gutters>
                                <v-col cols="10">

                                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" autocomplete="new" light required></v-text-field>
                                    <v-text-field v-model="password" :rules="[passwordRules.required, passwordRules.min]" hint="At least 8 characters" label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword=!showPassword" name="password" required autocomplete="new-password"></v-text-field>
                                    <v-text-field v-model="rePassword" :rules="[passwordRules.required, passwordRules.min,passwordConfirmationRule]" hint="At least 8 characters" label="Confirm password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword=!showPassword" name="rePassword" required autocomplete="new-password"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-container fluid no-gutters>
                            <v-row align="center" justify="center" no-gutters>
                                <v-col cols="10">
                                    <v-container fluid>
                                        <v-row>
                                            <v-col>
                                                <v-btn block class="ma-2 ml-0" color="primary" @click="onSignUp" :disabled="!isValidForm" :loading="isLoading">Sign Up</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-container>

                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>

                </v-card-actions>
            </v-card>
            <dialog-wrapper ref="dialog"> </dialog-wrapper>
        </v-col>
    </v-row>
</v-container>
</template>

<script>

import DialogWrapper from './DialogWrapper';

import {
    mapState,
    mapActions,
    //mapMutations
    //mapGetters,
} from "vuex";

export default {
    name: "Signup",
    components: {
        DialogWrapper
    },
    data() {
        return {
            isValidForm: true,
            checkboxTerms: false,
            email: undefined,
            password: undefined,
            rePassword: undefined,
            invite: undefined,
            showPassword: false,
            dialogVisible: false,
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            passwordRules: {
                required: value => !!value || 'Required.',
                min: value => value && value.length >= 8 || 'Min 8 characters',
            },
            inviteRules: {
                required: value => !!value || 'Required.',
            },

        }
    },
    computed: {
        ...mapState("auth", ["isLoading"]),
        passwordConfirmationRule() {
            return () => (this.password === this.rePassword) || 'Passwords must match'
        },
    },
    mounted() {

    },
    methods: {
        ...mapActions("auth", ["signUp"]),

        onSignUp: async function () {

            let self = this

            let payload = {
                email: this.email,
                password: this.password,
            }
            this.signUp(payload).then(

                async function () {

                        self.$router.push('/')

                    },
                    async function (error) {

                        await self.$refs.dialog.open("Error!", error.message, {
                            OK: 'CLOSE'
                        })
                    }
            )
        }
    }
};
</script>

<style scoped>
</style>

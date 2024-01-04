<template>
<v-container class="fill-height" fluid>
    <v-row align="center" justify="center" no-gutters>
        <v-col cols="12" sm="8" md="4">

            <v-card class="elevation-5 m-0">
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Login</v-toolbar-title>
                    <v-spacer></v-spacer>

                </v-toolbar>
                <v-card-text no-gutters>

                    <v-form>
                        <v-container fluid>
                            <v-row align="center" justify="center" no-gutters>
                                <v-col cols="10">

                                    <v-text-field prepend-icon="mdi-account" v-model="email" label="Login" light required autocomplete="login"></v-text-field>
                                    <v-text-field prepend-icon="mdi-lock" v-model="password" label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" name="password" @click:append="showPassword = !showPassword" autocomplete="current-password"></v-text-field>
                                </v-col>
                            </v-row>

                        </v-container>
                        <v-container fluid no-gutters>
                            <v-row align="center" justify="center" no-gutters>
                                <v-col cols="10">
                                    <v-container fluid>
                                        <v-row>
                                            <v-col>
                                                <v-btn color="primary" @click="onLogin" block :loading="isLoading">Login</v-btn>
                                            </v-col>
                                        </v-row>
                                        <!--
                                        <v-row>
                                            <v-col>
                                                <v-btn class="white--text" color="#DF5252" block @click="onGoogleLogin">Login with Google</v-btn>
                                            </v-col>
                                        </v-row>
                                        -->
                                        <!--
                                        <v-row>
                                            <v-col class="text-right">
                                                No account yet?
                                                <v-btn color="primary" to="/signup">Sign up</v-btn>
                                            </v-col>
                                        </v-row>
                                        -->
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
//import Vue from "vue";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

/*
import * as firebaseui from "firebaseui"
import "firebaseui/dist/firebaseui.css"
*/

import DialogWrapper from './DialogWrapper';

import {
    mapGetters,
    mapState,
    mapActions,
    //mapMutations
} from "vuex";

export default {
    name: "Login",
    components: {
        DialogWrapper
    },
    data: () => ({
        isInit: false,
        isSignIn: false,
        showPassword: false,
        email: "",
        password: "",
    }),
    computed: {
        ...mapState("auth", ["isLoading"]),
        ...mapGetters("auth", ["isAuthenticated","isAdmin"]),
    },
    created() {},
    mounted() {},
    methods: {
        ...mapActions("auth", ["signIn","signInWithPopup", "checkUserStatus" ]),
        onLogin() {

            let self = this

            let payload = {
                email: this.email,
                password: this.password
            }
            this.signIn(payload).then(async function () {

                    //self.$router.replace('/')
                    if (self.isAdmin) {
                        self.$router.push('/orders')
                    } else{
                        self.$router.push('/sorting_shop')
                    }

                })
                .catch(async function (error) {

                    await self.$refs.dialog.open("Error!", error.message, {
                        OK: 'CLOSE'
                    })
                })
        },
        onGoogleLogin() {

            let self = this
            let provider = new firebase.auth.GoogleAuthProvider();

            this.signInWithPopup({provider:provider}).then(() => {

                //self.$router.replace('/')
                self.$router.push('/orders')

                return true

            }).catch(error => {

                self.$refs.dialog.open("Error!", error.message, {
                    OK: 'CLOSE'
                })

            })
        },
     
    },
};
</script>

<style scoped></style>

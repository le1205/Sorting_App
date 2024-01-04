<template>
<v-container class="fill-height" fluid>
    <v-row align="center" justify="center" style="height:20vh">
        <v-col cols=6>
            <v-form>
            <v-text-field prepend-icon="mdi-lock" v-model="password" label="PIN CODE" type="password" name="password"></v-text-field>
            </v-form>
        </v-col>
    </v-row>
    <v-row align="start" no-glutters style="height:65vh">
      
            <v-container class="fill-height" fluid>
                <v-row  style="height:25%">
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn class="btn-100" block outlined plain text @click="onButtonClick(1)">1</v-btn>
                    </v-col>
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn class="btn-100" block outlined plain text @click="onButtonClick(2)">2</v-btn>
                    </v-col>
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn class="btn-100" block outlined plain text @click="onButtonClick(3)">3</v-btn>
                    </v-col>
                </v-row>
                <v-row style="height:25%">
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn block outlined plain text @click="onButtonClick(4)">4</v-btn>
                    </v-col>
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn block outlined plain text @click="onButtonClick(5)">5</v-btn>
                    </v-col>
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn block outlined plain text @click="onButtonClick(6)">6</v-btn>
                    </v-col>
                </v-row>
                <v-row style="height:25%">
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn block outlined plain text @click="onButtonClick(7)">7</v-btn>
                    </v-col>
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn block outlined plain text @click="onButtonClick(8)">8</v-btn>
                    </v-col>
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn block outlined plain text @click="onButtonClick(9)">9</v-btn>
                    </v-col>
                </v-row>
                <v-row style="height:25%">
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn block outlined plain text @click="onButtonClick(0)">0</v-btn>
                    </v-col>
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn block outlined plain text @click="onBackspaceClick()">
                            <v-icon>mdi-backspace</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols=4 class="ma-0 pa-1">
                        <v-btn block outlined plain text :loading="isLoading" @click="onEnterClick()">OK</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        
    </v-row>
    <dialog-wrapper ref="dialog"> </dialog-wrapper>
</v-container>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import Vue from 'vue'

import numkeyboard from 'vue-numkeyboard';
import 'vue-numkeyboard/style.css';

Vue.use(numkeyboard);

import DialogWrapper from "./DialogWrapper";

import {
    mapGetters,
    mapState,
    mapActions,
    //mapMutations
} from "vuex";

export default {
    name: "Login2",
    components: {
        DialogWrapper,

    },
    data: () => ({
        isInit: false,
        isSignIn: false,
        showPassword: false,
        email: "",
        password: "",
    }),
    computed: {
        ...mapState("auth", ["isLoading", "status"]),
        ...mapGetters("auth", ["isAuthenticated"]),
    },
    created() {},
    mounted() {},
    methods: {
        ...mapActions("auth", ["signInSortingShop"]),
        onButtonClick(e) {
            this.password += e
        },
        onBackspaceClick(e) {

            this.password = this.password.slice(0, -1)
        },

        onEnterClick() {
            let self = this;

            let payload = {
                //email: this.email,
                password: this.password,
            };
            this.signInSortingShop(payload).then(async function (response) {

                    console.log('signInSortingShop.response', response)
                    self.$router.push("/sorting_shop");

                })
                .catch(async function (error) {
                    await self.$refs.dialog.open("Error", error, {
                        OK: "CLOSE",
                    });
                });
        },

    },
};
</script>

<style scoped>
.v-btn {
    font-size: 1.5em;
    font-weight: bold;
    height: 100%  !important;
}

.v-input {
    font-size: 1em;
    font-weight: bold;
}
</style>

<template>
<div>
    <v-navigation-drawer app absolute v-model="drawer" v-if="isAuthenticated && isAdmin">
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    Sorter
                </v-list-item-title>
                <v-list-item-subtitle>
                    subtext
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list>
            <v-list-item v-for="(item,i) in menu.leftMenuItems" :key="`navDrawer${i}`" :to="item.route">
                <v-list-item-action>
                    <v-icon v-html="item.icon"></v-icon>
                </v-list-item-action>
                <v-list-item-action-text>
                    {{item.title}}
                </v-list-item-action-text>
                <router-link :to="item.route"></router-link>

            </v-list-item>
        </v-list>

    </v-navigation-drawer>

    <v-app-bar app v-if="isAuthenticated && isAdmin" class="elevation-0">

        <v-app-bar-nav-icon @click.stop="drawer=!drawer"></v-app-bar-nav-icon>

        <v-toolbar-title></v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-if="!$vuetify.breakpoint.xsOnly">
            <v-btn class="ma-2" v-for="(item, index) in menu.topMenuItems" :key="index" :to="item.route">
                <v-icon>{{ item.icon }}</v-icon>
                {{ item.title }}
            </v-btn>
        </template>

        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" text>
                    <v-icon v-html="'mdi-dots-vertical'"></v-icon>

                </v-btn>
            </template>
            <v-list>
                <v-list-item @click="logOut">
                    <v-list-item-title>
                        <v-icon v-html="'mdi-logout'"></v-icon>
                        Logout
                    </v-list-item-title>
                </v-list-item>

            </v-list>
        </v-menu>

    </v-app-bar>

</div>
</template>

<script>
import menu from '@/menu'

import {
    mapGetters,
    mapState,
    mapActions,
    //mapMutations
} from "vuex";

export default {
    data() {
        return {
            drawer: false,
            menu: menu
        }

    },
    computed: {
        ...mapState("auth", ["isLoading"]),
        ...mapGetters("auth", ["isAuthenticated","isAdmin"]),
    },
    methods: {
        ...mapActions("auth", ["signOut"]),
        logOut() {

            this.signOut().then(() => {
                this.$router.push('/login')
            })

        },

    }

}
</script>

<style lang="scss" scoped>

</style>

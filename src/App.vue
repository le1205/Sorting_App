<template>
<v-app>
    <app-header />

    <v-main>
        <router-view />
    </v-main>

    <app-footer v-if="isAuthenticated" />

</v-app>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'

import {
    mapGetters,
    mapActions
} from 'vuex'

export default {
    name: 'App',

    components: {
        AppHeader,
        AppFooter
    },

    data: () => ({
        //
    }),
    computed: {
        ...mapGetters("auth", ["isAuthenticated","isAdmin"]),
    },
    mounted() {

        //console.log('App mounted')

       // this.cleanPartsCache()

       // this.getParts()

    },
    methods: {
        ...mapActions("cache", ["deleteCache"]),
        ...mapActions("parts", ["getParts","cleanPartsCache"]),
    }
};
</script>

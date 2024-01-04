<template>
<div>
    <v-footer :fixed="true" app class="footer">
        <v-icon style="color: #ccc;" v-html="'mdi-information-outline'"></v-icon>
        <span >[AIV]Version: {version}[/AIV] </span> <span class="ml-2" ref="build_date">Date: [AIV] {date} [/AIV] </span>
        <span class="ml-2" ref="build_age"> [ {{buildAge}} ]</span>
    </v-footer>
</div>
</template>

<script>
import moment from 'moment'

export default {
    data() {
        return {
            buildAge: undefined

        }
    },
    computed: {},
    mounted() {

        var b = moment(this.$refs.build_date.innerHTML.trim(), 'YYYY-MM-DD hh:mm:ss hA');

        this.buildAge = moment().diff(b, 'minutes') + ' min ago'

    }
}
</script>

<style scoped>
.footer{
    font-size: 10px;
    color: #ccc !important;
}

</style>

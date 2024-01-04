<template>
<v-container>

    <v-row>
        <v-col>
            <v-btn color="primary" fab dark @click="addItem()">
                <v-icon dark>
                    mdi-plus
                </v-icon>

            </v-btn>
        </v-col>
    </v-row>
    <v-row>

        <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>

        <!-- <v-col class="d-flex" v-if='carts'> -->

            <v-card v-for="(item,index) in carts" :key="`${index}}`" class="ma-6"  width="20em" :hover="true" outlined :color="item.status === 0 ? 'grey lighten-2' : ''" >
                <v-card-title class="headline">
                    {{item.alias}}
                </v-card-title>

                <v-card-subtitle>{{item.description}}</v-card-subtitle>
                <v-card-text>
                    <!--
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title> {{item.description}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    -->
                </v-card-text>

                <v-card-actions>

                    <v-spacer></v-spacer>

                    <v-btn icon @click="editItem(item)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn icon @click="deleteItem(item)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>

                </v-card-actions>
            </v-card>
    </v-row>
    <dialog-wrapper ref="dialog"> </dialog-wrapper>

</v-container>
</template>

<script>
import {
    mapState,
    mapActions,
} from "vuex";
import to from 'await-to-js';

import DialogWrapper from './DialogWrapper';

export default {
    components: {

        DialogWrapper

    },
    data: function () {
        return {

            carts: [],
            dialog: false,
        }

    },
    computed: {
        ...mapState('carts', ['isLoading']),

    },
    created() {

    },
    mounted() {

        this.fetchData()

    },
    methods: {
        ...mapActions('carts', ['getCarts', 'createCart', 'updateCart', 'deleteCart']),
        async fetchData() {

            let that = this

            const [error, response] = await to(that.getCarts({
                id: this.id
            }))

            if (!response) {

                this.$refs.dialog.open("getCarts", error.message, {
                    OK: "OK",
                });
                return
            }

            that.carts = response

        },

        addItem() {

            this.$router.push({
                name: "cart-editor",
                params: {
                    action: "create"
                }
            });

        },
        editItem(item) {

            this.$router.push({
                name: "cart-editor",
                params: {
                    action: "edit",
                    id: item.id
                }
            });

        },
        async deleteItem(item) {

            let result = await this.$refs.dialog.open("Warning", `Cart #${item.id} will be deleted! Do you want to proceed?`, {
                OK: 'YES',
                CANCEL: 'NO',
            })

            if (!result) return

            result = await this.deleteCart(item)

            this.fetchData()
        }
    }

}
</script>

<style lang="scss" scoped>

</style>

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

    <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>

    <v-card>
        <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="users.headers" :items="users.items" :sort-by="['email']" :search="search" :items-per-page="10" class="elevation-1">

            <template v-slot:item="{ item }">
                <tr>

                    <td >{{item["name"]}}</td>
                    <td >{{item["email"]}}</td>
                    <td >{{item["lastSignInTime"]}}</td>
                    <td ><v-simple-checkbox v-model="item.admin" disabled></v-simple-checkbox></td>  
                    <td ><v-simple-checkbox v-model="item.disabled" disabled></v-simple-checkbox></td>  
                    <td>
                        <v-btn text icon @click="editItem(item)">
                            <v-icon> mdi-pencil </v-icon>
                        </v-btn>

                        <v-btn text icon @click="deleteItem(item)">
                            <v-icon> mdi-delete </v-icon>
                        </v-btn>

                    </td>

                </tr>
            </template>

        </v-data-table>
    </v-card>
    <user-editor-dialog ref="user-editor-dialog" @close="onUserEditorClose"> </user-editor-dialog>
    <dialog-wrapper ref="dialog"> </dialog-wrapper>

</v-container>
</template>

<script>
import {
    mapState,
    mapActions,
    mapGetters,

} from "vuex";

import to from 'await-to-js';

import DialogWrapper from './DialogWrapper';
import UserEditorDialog from "./UserEditorDialog";

export default {
    components: {
        DialogWrapper,
        UserEditorDialog
    },
    data: function () {
        return {
            search: '',
            users: {
                headers: [{
                        text: "Name",
                        value: "name"
                    },
                    {
                        text: "Email",
                        value: "email"
                    },
                    {
                        text: "Last Sign In",
                        value: "lastSignInTime"
                    },
                    {
                        text: "Admin",
                        value: "admin"
                    },

                    {
                        text: "Disabled",
                        value: "disabled"
                    },

                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    },
                ],
                items: [],
            },
        }
    },
    computed: {
        ...mapState('users', ['isLoading']),
         ...mapGetters("auth", ["uid"]),
    },
    mounted() {

        this.fetchData()

    },
    methods: {
        ...mapActions('users', ['getUsers', 'createUser', 'updateUser', 'deleteUser']),

        async fetchData() {

            let that = this

            const [error, response] = await to(that.getUsers())

            if (!response) {

                this.$refs.dialog.open("getUsers", error.message, {
                    OK: "OK",
                });
                return
            }

            that.users.items = response.data.filter( i => i.uid !== this.uid ).map( i => ({
                //that.users.items = response.data.map( i => ({
                uid: i.uid,
                name: i.displayName,
                email: i.email,
                password: '',
                lastSignInTime: i.lastSignInTime,
                disabled: i.disabled,
                admin: i.admin
            }))

            ////console.log(that.users.items)
        },

        addItem() {

             this.$refs['user-editor-dialog'].open()

        },
        editItem(item) {

            ////console.log('editItem.item',JSON.stringify(item))

            this.$refs['user-editor-dialog'].open(item)

        },
        async deleteItem(item) {

            let result = await this.$refs.dialog.open("Warning", `${item.name} will be deleted! Do you want to proceed?`, {
                OK: 'YES',
                CANCEL: 'NO',
            })

            if (!result) return

            result = await this.deleteUser(item)

            this.fetchData()
        },
        onUserEditorClose(){
            
            this.fetchData()            

        }
    }

}
</script>

<style lang="scss" scoped>

</style>

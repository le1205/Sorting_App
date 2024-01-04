<template>
<v-container>

    <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>
    <v-card color="white">

        <v-container v-if="isEditMode">
            <v-form ref="form">
                <v-row>
<!--
                    <v-col cols="2" md="2">
                        <v-text-field v-model="data.id" label="Cart #" :rules="rules" :disabled="true"></v-text-field>
                    </v-col>
-->                    
                    <v-col cols="2" md="2">
                        <v-text-field v-model="data.alias" label="Alias" @change="isModified = true"></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2">
                        <v-select :items="storageTypeItems" v-model="data.storage_type" label="Type" @change="isModified = true"></v-select>
                    </v-col>

                    <v-col cols="2" md="2">
                        <v-select :items="cartTypeItems" v-model="data.type" label="Type" @change="isModified = true"></v-select>
                    </v-col>
                    <v-col cols="2" md="2">
                        <v-select :items="cartStatusItems" v-model="data.status" label="Status" @change="isModified = true"></v-select>
                    </v-col>

                    <v-col cols="4" md="4">
                        <v-text-field v-model="data.description" label="Description" @change="isModified = true"></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
            <v-row>
                <v-col>
                    <v-btn class="ma-2" title="Go back" fab @click="close">
                        <v-icon>mdi-arrow-left-circle</v-icon>
                    </v-btn>
                    <v-btn :color="isModified ? 'success' : ''" title="Save" :disabled="!isModified" class="ma-2" fab @click="save">
                        <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                    <v-btn color="primary" title="Add bin" class="ma-2" fab dark @click="addBin()">
                        <v-icon dark>
                            mdi-plus
                        </v-icon>
                    </v-btn>
                    <v-btn class="ma-2" title="Select all bins" fab @click="selectAllBins()">
                        <v-icon dark>
                            mdi-selection
                        </v-icon>
                    </v-btn>
                    <v-btn class="ma-2" title="Remove selection" fab :disabled="!selectedBins.length" @click="deSelectAllBins()">
                        <v-icon dark>
                            mdi-select-off
                        </v-icon>
                    </v-btn>
                    <v-btn class="ma-2" title="Resize selected bins" fab :disabled="!selectedBins.length" @click="openBulkBinEditor()">
                        <v-icon dark>
                            mdi-move-resize
                        </v-icon>
                    </v-btn>
                    <v-btn class="ma-2" title="Clean up selected bins" fab :disabled="!selectedBins.length" @click="cleanupSelectedBins()">
                        <v-icon> mdi-card-remove-outline </v-icon>
                    </v-btn>

                </v-col>
            </v-row>
        </v-container>
        <v-container>
            <v-chip v-if="!isEditMode" label class="ml-3"> {{data.alias}}</v-chip>
            
            <grid-layout style="height:65vh" :auto-size="false" :layout="bins" :col-num="12" :row-height="60" :is-draggable="isEditMode" :is-resizable="isEditMode" :vertical-compact="false" :preventCollision="true" :use-css-transforms="true" @layout-updated="layoutUpdatedEvent">
                <grid-item :class="getBinColor(item)" v-for="item in binsComputed" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.i" @click.native="onBinClick(item)" @dblclick.native="editBin(item)">
                    <v-badge light left overlap :content="item.order" style="display:block;">
                    </v-badge>

                    <v-container class="fill-height pa-0" fluid>
                        <v-row no-gutters>
                            <v-col class="d-flex align-end flex-column">

                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn v-if="isEditMode" x-small icon @click="deleteBin(item)" v-bind="attrs" v-on="on">
                                            <v-icon x-small>mdi-close</v-icon>
                                        </v-btn>

                                    </template>
                                    
                                    <span>
                                        Delete
                                        <!-- 
                                      {{item.width}} x {{item.height}} x {{item.depth}} 
                                       {{item}} 
                                       -->
                                    </span>
                                    
                                </v-tooltip>
                            </v-col>
                        </v-row>

                        <v-row no-gutters align="center" justify="center" class="mb-0" style="height:45%;">

                            <span v-if="item.partsTotal>0" :class="['font-weight-bold black--text']">
                                {{item.partsOK}} / {{item.partsTotal}}

                            </span>

                        </v-row>

                    </v-container>

                </grid-item>

            </grid-layout>
        </v-container>

        <v-divider></v-divider>
        <v-container>
            <div class="text-center">
                <v-chip class="ma-2" color="grey accent-1" label>
                    Empty Bin
                </v-chip>

                <v-chip class="ma-2" label text-color="black" color="green accent-1">
                    All Parts in Bin
                </v-chip>

                <v-chip class="ma-2" label text-color="black" color="yellow accent-1">
                    Sorting in Progress

                </v-chip>

                <v-chip class="ma-2" label color="red accent-1" text-color="white">
                    Place Part in Bin

                </v-chip>

                <v-chip class="ma-2" label color="purple accent-1" text-color="p">
                    Part(s) Missing/Damaged
                </v-chip>
            </div>
        </v-container>
        <v-card-actions>
            <v-spacer></v-spacer>
            <!--
            <v-btn color="blue darken-1" text @click="close()">
                Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="save()">
                Save
            </v-btn>
-->
        </v-card-actions>
    </v-card>
    <bin-editor ref="bin-editor" @create="onBinCreate" @update="onBinUpdate"> </bin-editor>
    <bin-editor-bulk ref="bin-editor-bulk" @update="onBulkBinUpdate"> </bin-editor-bulk>

    <dialog-wrapper ref="dialog"> </dialog-wrapper>

    <search-results-modal ref="search-results-modal"  @details="onSearchResultDetails"> </search-results-modal>
    
</v-container>
</template>

<script>
import Vue from 'vue'
import VueGridLayout from "vue-grid-layout";

import BinEditor from '../BinEditor';
import BinEditorBulk from '../BinEditorBulk';
import DialogWrapper from '../DialogWrapper';
import SearchResultsModal from "../SearchResultsModal";
import to from 'await-to-js';

import {
    mapState,
    mapActions,
} from "vuex";
import methods from './methods'

export default {
    name: 'CartEditor2',
    props: {
        id: {
            type: String,
            default: undefined
        },
        action: {
            type: String,
            default: ''
        }
    },
    components: {
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        BinEditor,
        BinEditorBulk,
        DialogWrapper,
        SearchResultsModal        
    },
    data: function () {
        return {

            data: {
                id: '',
                alias: '',
                storage_type: 0,
                type: 0,
                status: 0,
                description: '',
                colNum: 12,
            },
            storageTypeItems: [{
                    text: 'CART',
                    value: this.$constants.STORAGE_TYPE.CART
                },
                {
                    text: 'RACK',
                    value: this.$constants.STORAGE_TYPE.RACK
                },                
            ],            
            cartTypeItems: [{
                    text: 'Any',
                    value: this.$constants.CART_TYPE.ANY
                },
                {
                    text: 'Face Frame Parts [TYP: 36]',
                    value: this.$constants.CART_TYPE.FACE_FRAME_PARTS
                },
                {
                    text: '5 Piece Door/Drawer Fronts [TYP: 8,9,10,23]',
                    value: this.$constants.CART_TYPE.MULTI_5_PIECE_FRONTS_PARTS
                },
                {
                    text: 'Drawer Box Parts [TYP: 22,21]',
                    value: this.$constants.CART_TYPE.DRAWER_BOX_PARTS
                }
            ],
            cartStatusItems: [{
                    text: 'Disabled',
                    value: this.$constants.CART_STATUS.DISABLED
                },
                {
                    text: 'Active',
                    value: this.$constants.CART_STATUS.ACTIVE
                },
            ],            
            isModified: false,
            isDragging: false,
            bins: [],
            mode: undefined,
            show: false,
            rules: [
                id => !!id || 'Required.',
            ],
        }

    },
    computed: {
        ...mapState('bins', ['isLoading']),
        selectedBins() {
            return this.bins.filter(bin => bin.selected)
        },
        isEditMode() {
            return this.mode !== this.$constants.FORM_MODE.VIEW
        },
        binsComputed(){
            console.log("====================", this.bins ? this.bins.filter(bin => !bin.deleted ) : []);
            return this.bins ? this.bins.filter(bin => !bin.deleted ) : []
        }

    },

    created() {
        //console.log('cart editor created')
        if (this.action === "create") {
            this.mode = this.$constants.FORM_MODE.CREATE;
        }

        if (this.action === "edit") {
            this.mode = this.$constants.FORM_MODE.EDIT;
        }

        if (this.action === "view") {
            this.mode = this.$constants.FORM_MODE.VIEW;
        }

        this.data.id = this.id;

    },
    mounted() {

        this.initialize()

    },
    updated() {

        //console.log('cart editor updated')

    },
    beforeDestroy(){

        //console.log('cartEditor.beforeDestroy')
     
    },
    beforeUnmount() {
        
        //console.log('cartEditor.beforeUnmount')
     
    },

    methods: methods,
    watch: {
        'data.colNum'(newVal, oldVal) {

        },
        'isLoading'(newVal) {

            //console.log('isLoading', newVal)

            this.$forceUpdate()

        }
    }

}
</script>

<style scoped>
.vue-grid-layout {
    background: #fff;
}

.vue-grid-item:not(.vue-grid-placeholder) {
    background: #f9f9f2cc;
    border: 1px solid #ccc;
}

.vue-grid-item:not(.vue-grid-placeholder).selected {
    background: #A0C5E8;
    border: 1px solid #ccc;
}

.vue-grid-item .resizing {
    opacity: 0.9;
}

.vue-grid-item .static {
    background: #fff;
}

.vue-grid-item .text {
    font-size: 16px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}

.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}

.vue-grid-item .minMax {
    font-size: 12px;
}

.vue-grid-item .add {
    cursor: pointer;
}

.vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
}
</style><style lang="scss" scoped>
/*
.vue-grid-item {
    border-radius: 5px;
    background: lightgray;
    min-height: 10rem;
    min-width: 10rem;
}

.vue-grid-item.vue-grid-placeholder {
    border-radius: 5px;
    background: red;
    opacity: 0.1;
    min-height: 10rem;
    min-width: 10rem;
}
*/
</style>

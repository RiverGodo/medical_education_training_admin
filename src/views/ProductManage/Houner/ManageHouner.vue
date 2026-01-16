<template>
    <div class="manage-production-view">
        <!-- selectType1   @selectChange1="selectChange1" -->
        <screen :types="3" size-title1="证书总数" :size-num1="courseNums1" size-title2="已关联" :size-num2="courseNums2"
                btn-name="添加证书" placehodle="搜索证书名称或证书描述"
                @inputChange="inputChange" @handleClick="addOfflineSemesterHandler" :btn-type="btnType"/>
        <div class="card-houner" ref="box">
            <div v-if="!cardList1.length" class="hint-none">暂无内容</div>
            <Card class="card-houner-col" v-for="(item, index) in cardList1" :key="index">
                <div class="card-houner-img">
                    <img class="houner-image" :src="item.image_url" alt="">
                    <div class="houner-image-title" v-if="item.state">已关联</div>
                </div>
                <div class="card-houner-desc">
                    <Row class="houner-row-title">
                        <div class="houner-title">{{item.name}}</div>
                    </Row>
                    <Row class="houner-row-content">
                        <div>关联产品 {{item.connect_count}} <span style="margin: 0 4px;">|</span> 已颁发 {{item.issue_count}}
                        </div>
                    </Row>
                    <Row v-if="btnType" class="houner-row-btn" style="display: flex;">
                        <div><a @click="unrelation(item)" v-if="item.state">取消关联</a><a @click="relation(item)" v-else>关联</a></div>
                        <div class="ml10"><a @click="hadleChange(item)">编辑</a></div>
                        <!-- <div v-if="item == 2" class="ml10"><a>统计</a></div> -->
                        <div v-if="item.state" class="ml10"><a @click="sendOfflineCourseHandler(item)">发证</a></div>
                    </Row>
                </div>
            </Card>
        </div>
        <div v-if="cardList1&&cardList1.length === 0">
            暂无证书
        </div>
    </div>
</template>
<script>
    import {MPop} from "../../../components/MessagePop";
    import api from "../../../api/modules/config";
    import {Dialog} from "../../dialogs";
    import {ADD_PRODUCTION} from "../../dialogs/types";
    import {Config} from "../../../config/base";
    import {doDateFormat, doTimeFormat, reunitPrice} from "../../../components/Util";
    import screen from "../../../components/ScreenFrame";
    import * as types from '../../dialogs/types';
    import postData from '../../../api/postData'
    import setAuthMixins from '../setAuthMixins'

    import {mapState} from 'vuex'

    export default {
        mixins: [Dialog, MPop, setAuthMixins],
        components: {screen},
        data() {
            return {
                model1: "",
                model2: "",
                loadingInstance: null,
                formInline: {
                    searchData: ""
                },
                cityList: "",
                cardList1: {},
                courseNums1: null,
                courseNums2: null,
                organizationId: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).organization_id,
                keyword: ''
            };
        },
        computed: {
            ...mapState(['hounerState'])
        },
        watch: {
            hounerState(_new) {
                if (_new) this.getList()
            }
        },
        beforeDestroy() {
            this.handleJump = null;
            this.setRelation = null;
            this.addOfflineSemesterHandler = null;
            this.sendOfflineCourseHandler = null;
            this.hadleChange = null;
            this.getList = null;
            this.clearModal = true
        },
        methods: {
            selectChange1(val) {
                this.organizationId = val;
                this.getList()
            },
            inputChange(val) {
                this.keyword = val;
                this.getList();
            },
            handleClick() {
                console.log("open modal");
            },
            addOfflineSemesterHandler() {
                this.handleSelModal(types.ADD_HOUNER, {type: 1})
            },
            hadleChange(row) {
                this.handleSelModal(types.ADD_HOUNER, {type: 2, row})
            },
            sendOfflineCourseHandler(row) {
                this.handleSelModal(types.SEND_HOUNER, {row: row});
            },
            handleJump() {
                let routeData = this.$router.resolve({
                    query: "",
                    params: "",
                    name: "open-product"
                });
                window.open(routeData.href, "_blank");
            },
            setRelation(item, type) {
                let d = {product_id: +JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id, honour_ids: [item.id]}
                let d1 = {id: item.ph_id}
                let url = type ? '/product/remove_product_honour' : '/product/set_honour_to_product'
                postData(url, type ? d1 : d).then((res) => {
                    this.getList()
                })
            },
            relation(item) {
                this.setRelation(item)
            },
            unrelation(item) {
                this.setRelation(item, 1)
            },
            getList() {
                let d = {
                    organization_id: this.organizationId,
                    product_id: +JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id
                }
                this.$store.commit('set_houner_state', false)
                postData('/product/get_honour_certificates', {keyword: this.keyword, ...d}).then((res) => {
                    this.cardList1 = res.data
                    this.cardList1.forEach(item => {
                        item.image_url = JSON.parse(item.img_url)[0]
                    })
                    this.courseNums1 = res.data.length
                    this.courseNums2 = res.is_contact
                })
            }
        },
        mounted() {
            // this.organizationId = JSON.parse(sessionStorage.getItem('PRODUCTINFO')).organization_id
            this.getList()
            this.$refs.box.style.height = window.innerHeight - 130 + 'px'
        }
    };
</script>
<style lang="less" scoped>
    .card-houner {
        display: flex;
        flex-wrap: wrap;
        /*justify-content: space-around;*/
        padding: 20px;
        overflow: hidden;
        overflow-y: auto;
        align-content: start;
        min-width: 950px;
    }

    .card-houner-col {
        width: 442px;
        height: 130px;
        margin: 15px 5px 0 5px;
        display: flex;
    }

    .houner-title {
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #474C63;
        letter-spacing: 0;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
    }

    .ml10 {
        margin-left: 10px;
    }

    .houner-image {
        width: 160px;
        height: 100px;
    }

    .card-houner-img {
        overflow: hidden;
        position: relative;
    }

    .houner-image-title {
        position: absolute;
        top: 12px;
        background: #2EBF07;
        color: #fff;
        transform: rotate(45deg);
        width: 100px;
        right: -30px;
    }

    .card-houner-desc {
        margin-left: 10px;
        width: 60%;
    }

    .houner-row-content {
        margin-top: 10px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #686F92;
        letter-spacing: 0;
        text-align: left;
    }

    .houner-row-btn {
        margin-top: 14px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
    }

    /deep/ .ivu-card-body {
        padding: 15px;
        width: 100%;
        display: flex;
    }
    .hint-none{
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px
    }
</style>

<template>
    <div class='manage-production-view'>
        <screen @resetPage="resetPage" :btn-type='true' :select-type1="true" :select-type2="true" :types="16" size-title1="培训总数"
                :size-num1="total" btn-name="添加培训" :isButton2="true" btnName2="签到地点" @handleClick2="handleClick2"
                :select2="selectList2" :select5="select5" @selectChange5="selectChange5" placehodle="搜索产品名称"
                @selectChange1="selectChange1" @selectChange2="selectChange2" @inputChange="inputChange"
                @handleClick="handleClick"/>
        <div class="lecturer-list">
            <Row :gutter="20">
                <Col span="6" :class="handleCardClass(t.state)" v-for="(t, index) in cardList" :key="index">
                    <div class="manage-production-col cards" @click="handleJump(t)">
                        <Row>
                            <Col span="2" class="al-left cad-top-left">
                                <p>ID:</p>
                            </Col>
                            <Col span="9" class="al-left cad-top-left">
                                <p>{{t.id}}</p>
                            </Col>
                            <Col span="13" class="al-right">
                                <div class="cad-top-right" :class="'card-state-color' + t.state">{{t.stateText}}</div>
                            </Col>
                        </Row>
                        <Row>
                            <h2 class="product-title">{{t.title}}</h2>
                        </Row>
                        <div class="product-de">
                            <span class="al-left cad-btm-price">¥{{t.price}}</span>
                            <span class="al-left cad-btn-relprice">¥{{t.original_price}}</span>
                            <span class="al-right cad-btn-people">{{t.join_number}}人报名</span>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    import screen from '../../../components/ScreenFrame'
    import postData from '../../../api/postData'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import {Dialog} from "../../dialogs";
    import {ADD_PRODUCTION} from "../../dialogs/types";
    import {mapState} from 'vuex'
    import {classification} from './consts'
    import tables from '../../../components/tables'

    export default {
        mixins: [pageMixin, Dialog],
        components: {screen, pageList, tables},
        data() {
            return {
                curPage: 1,
                cardList: [],
                search: '',
                select5: [{id: 'all', title: '全部状态'}, {id: 3, title: '推荐'}, {id: 2, title: '上架'}, {id: 1, title: '测试'}, { id: -1, title: '下架' }],
                courseNums: 12,
                selectList2: classification,
                organization_id: sessionStorage.getItem('organization_id'),
                state: '',
                category_id: 'all',
            }
        },
        watch: {
            productState(_new) {
                if (_new) this.getList()
            },
            editProductState(_new) {
                if (_new) this.getList()
            }
        },
        computed: {
            ...mapState({
                productState: state => state.production.add_product_state,
                editProductState: state => state.production.edit_product_state
            }),
            modalPageCount() {
                return {
                    current: this.modalCurrent,
                    pageSize: this.modalPageSize,
                    isSerial: true
                }
            }
        },
        beforeDestroy() {
            this.getList = null;
            this.handleJump = null;
            this.handleClick = null;
            this.selectChange1 = null;
            this.selectChange2 = null;
            this.cardList = null;
        },
        methods: {
            handleCardClass(t) {
                return (t === 2 || t === 3) ? 'card-main-list1' : 'card-main-list0'
            },
            selectChange1(val) {
                this.organization_id = val;
                this.getList()
            },
            selectChange5(val) {
                this.state = val
                this.getList()
            },
            selectChange2(val) {
                this.category_id = val
                this.getList()
            },
            inputChange(val) {
                this.search = val;
                this.getList()
            },
            handleClick() {
                // this.handleSelModal(ADD_PRODUCTION);
                this.$router.push('/dashboard/creat-production')
            },
            handleClick2() {
                this.$router.push('/dashboard/map-sign')
                // this.isShow = true
            },
            handleJump(t) {
                sessionStorage.setItem('PRODUCTINFO', JSON.stringify(t))
                // let routeData = this.$router.resolve({
                //   query: '',
                //   params: '',
                //   name: "open-product",
                // });
                sessionStorage.setItem('onlinePane', 'product1')
                // window.open(routeData.href, "_blank")
                this.$router.push({name: "open-product"})
            },
            getList() {
                // let organization_id = this.organization_id !== 1 ? this.organization_id : ''
                // category_id
                let d = {
                    organization_id: this.organization_id,
                    state: this.$config.setSelVal(this.state),
                    search: this.search,
                    page_size: this.pageSize,
                    page_num: this.current,
                    category_id: this.category_id
                }
                if (this.category_id == 'all') delete d.category_id
                postData('product/product/get_list', d).then((res) => {
                    this.cardList = res.data.data
                    this.cardList.map((t) => {
                        t.stateText = this.$config.setProductState(t.state)
                    })
                    this.total = res.data.count
                    this.$store.commit('add_product_states', false)
                })
            }
        },
        mounted() {
            this.getList()
        }
    };
</script>
<style lang="less" scoped>
    .product-de {
        text-align: left;
        position: relative;

        .cad-btn-relprice {
            margin-left: 10px;
        }

        .cad-btn-people {
            position: absolute;
            right: 0;
        }
    }

    .lecturer-list {
        padding: 20px;
        height: calc(100% - 120px);
        overflow: hidden;
        overflow-y: auto;
    }

    .cards:hover {
        box-shadow: 0 0 2px 2px rgba(117, 124, 157, 0.15)
    }

    .manage-production-col {
        background: #fff;
        margin-bottom: 20px;
        padding: 15px;
    }

    .card-main-list0 {
        color: #9397AD;
    }

    .card-main-list1 {
        color: #474C63;
    }

    .card-state-color3 {
        background: #FF9600;
    }

    .card-state-color4{
        background: #4098FF;
    }

    .card-state-color2 {
        background: #74C818;
    }

    .card-state-color1 {
        background: #4098FF;
    }

    .card-state-color0 {
        background: #9397AD;
    }

    .card-state-color-1 {
        background: #9397AD;
    }

    .manage-production-view {
        background: #f0f0f7;
        height: 100%;
        position: relative;

        .base-list-container {
            .base-list-row {
                height: 60px;
            }
        }

        .find-by-term {
            padding-top: 22px;
            text-align: left;
            margin-left: 20px;

            /deep/ .ivu-input {
                width: 200px;
            }

            button {
                background: #3DAAFF;
                border: 1px solid #3DAAFF;
                border-radius: 4px;
                width: 100px;
                height: 36px;
            }
        }

        .data-container {
            background-color: #ffffff;
            margin: 0 20px 20px;

            .list {
                .data-header {
                    height: 50px;

                    .Col {
                        line-height: 50px;
                    }
                }

                .data-item {
                    height: 40px;
                    border-top: 1px solid #cecece;

                    &.bg-gray {
                        background-color: #fbfbfb;
                    }

                    .Col {
                        line-height: 40px;

                        p {
                            margin: 0;
                            display: -webkit-box;
                            white-space: normal;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            -webkit-line-clamp: 1;
                        }
                    }
                }

                .pager {
                    margin: 30px 0;
                    padding-right: 40px;
                }
            }
        }

        .al-left {
            text-align: left;
        }

        .al-right {
            text-align: right;
        }

        .cad-top-left {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            letter-spacing: 0;
        }

        .cad-top-right {
            width: 50px;
            height: 20px;
            float: right;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            text-align: center;
            border-radius: 20px;
        }

        .cad-btm-price {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #F54802;
            letter-spacing: 0;
        }

        .cad-btn-relprice {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            letter-spacing: 0;
            text-decoration: line-through;
        }

        .cad-btn-people {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            letter-spacing: 0;
        }
    }

    .product-title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        letter-spacing: 0;
        text-align: left;
        margin: 15px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /deep/ .ivu-page {
        position: absolute;
        bottom: 0px;
        left: 0;
        right: 0;
        margin: 0 auto;
    }
    /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-modal-body{
        padding: 0;
    }
    .modal-screen{
        display: flex;
        align-items: center;
        height: 46px;
        background-color:#f0f0f7;

        /deep/ .ivu-select-selection{
            border-radius: 400px;
            padding-left: 10px;
        }
        .modal-screen-type{
            font-size: 16px;
            margin-left: 40px;
            font-family: PingFangSC-Regular
        }
        .modal-screen-num{
            font-size: 16px;
            margin-left: 20px;
            font-family: PingFangSC-Regular
        }
    }
</style>

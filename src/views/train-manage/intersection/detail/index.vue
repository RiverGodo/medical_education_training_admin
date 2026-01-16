<template>
    <div class="manage-production-view">
        <screen @resetPage="resetPage" :types="17" :select2="select2" :selectType2="true" sizeTitle1="培训总数" :sizeNum1="total"
                :btnType="true" btnName="添加培训"
                @selectChange2="selectChange2" @handleClick="handleClick"></screen>
        <detailModal :isShow="isShow" @handleClose="handleClose" @submit="submitModal"/>
        <div class="lecturer-list">
            <Row :gutter="20">
                <Col span="6" :class="handleCardClass(t.state)" v-for="(t, index) in cardList" :key="index">
                    <div class="manage-production-col cards" @click="handleJump(t)">
                        <Row>
                            <Col span="2" class="al-left cad-top-left">
                                <p>ID:</p>
                            </Col>
                            <Col span="9" class="al-left cad-top-left">
                                <p style="margin-left: 2px;">{{t.id}}</p>
                            </Col>
                            <Col span="13" class="al-right">
                                <div style="display: flex;justify-content: flex-end">
                                    <div class="cad-top-right cad-top-right-model" :style="`minWidth: ${t.model == 3 ? '78px' : ''}`">{{t.model == 1 ? '单品' : t.model == 2 ? '合集' : '单品合集'}}</div>
                                    <div class="cad-top-right" :class="'card-state-color' + t.state">{{t.state == -1 ? '下架' : t.state == 2 ? '上架' : t.state == 1 ? '测试' : t.state == 3 ? '推荐' : '删除'}}</div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <h2 class="product-title">{{t.title}}</h2>
                        </Row>
                        <div class="product-de">
                            <span class="al-left cad-btm-price">¥{{t.price}}</span>
                            <span class="al-left cad-btn-relprice">¥{{t.original_price}}</span>
                        </div>
                        <img src="../../../../assets/img/delete-icon.png" alt="" @click.stop="deleteDetail(t)" class="delete-img">
                    </div>
                </Col>
            </Row>
        </div>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../../components/ScreenFrame'
    import detailModal from './detaile-modal'
    import pageList from '../../../../components/Page'
    import pageMixin from '../../../mixins/pageMixins'
    import postData from '../../../../api/postData'
    import {mapActions} from 'vuex'

    export default {
        components: {screen, detailModal, pageList},
        mixins: [pageMixin],
        data() {
            return {
                select2: [
                    {id: 'all', title:'全部'},
                    {id: -1, title:'下架'},
                    {id: 2, title:'上架'},
                    {id: 1, title:'测试'},
                    {id: 3, title:'推荐'},
                ],
                sizeNum1: 10,
                cardList: [],
                isShow: false,
                state: '',
            }
        },
        methods: {
            ...mapActions(['update_intersection']),
            selectChange2(val) {
                this.state = val == 'all' ? '' : val
                this.getList()
            },
            handleClick() {
                this.isShow = true
            },
            handleCardClass(t) {
                return (t === 2 || t === 3) ? 'card-main-list1' : 'card-main-list0'
            },
            handleClose() {
                this.isShow = false
            },
            getList() {
                let data = {
                    collection_id: JSON.parse(sessionStorage.getItem('INTERSECTION')).collection_id,
                    page_size: this.pageSize,
                    page_num: this.current,
                    state: this.state
                }
                postData('/product/collection/getCollectionDetail', data).then(res => {
                    this.total = res.data.count
                    this.cardList = res.data.products
                })
            },
            submitModal() {
                this.update_intersection()
                this.getList()
            },
            handleJump(val) {
                sessionStorage.setItem('PRODUCTINFO', JSON.stringify(val))
                sessionStorage.setItem('onlinePane', 'product1')
                this.$router.push({name: "open-product", query: {detail: 1}})
            },
            deleteDetail(t) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该产品</p>',
                    onOk: () => {
                        postData('product/collection/deleteProductFromCollection', {product_id: t.id, collection_id: JSON.parse(sessionStorage.getItem('INTERSECTION')).collection_id}).then(res => {
                            if(res.res_code == 1) this.getList()
                        })
                    },
                });
            }
        },
        mounted() {
            this.getList()
        }
    }
</script>

<style scoped lang="less">
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
        cursor: pointer;

        &:hover{
            .delete-img{
                display: inline-block;
            }
        }
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
            padding: 0 10px;
            width: auto;
            height: 20px;
            float: right;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            text-align: center;
            border-radius: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            min-width: 50px;
            line-height: 20px;
        }

        .cad-top-right-model{
            color: #686F92;
            border: 1px solid #686F92;
            margin-right: 8px;
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
    .delete-img{
        position: absolute;
        right:24px;
        bottom:28px;
        display: none;
    }
</style>

<template>
    <div class='side-menu-for-project'>
        <form-modal :show-modal='show' :detail-data="tableRow" :form-list="formList" :rule-validate='rules' @from-submit="handleSubmit" @close="closeModal" :title="modalTitle" ></form-modal>
        <Row class='logo' type='flex' justify='center' align='middle'>
            <img :class="$logo.learn ? 'logo-img2' : 'logo-img'" :src='$logo.img'>
            <div v-if="!$logo.learn" class="logo-title">九划医教</div>
        </Row>
        <div class="elRow">
            <div class='head-img'>
                <img class="" v-if="detailImg" :src='detailImg'>
                <video v-if="detailVideo" :src="detailVideo"></video>
            </div>
            <div class="head-title">{{detail.title}}</div>
            <div class="head-list" v-if="showData">
                <div>
                    <span class="w60">实际售价:</span><span>{{detail.price}}</span>
                </div>
                <div>
                    <span class="w60"><span>原</span><span>价:</span></span><span>{{detail.original_price}}</span>
                </div>
                <div>
                    <span class="w60">解锁方式:</span><span>{{$config.setLockType(detail.unlock_type)}}</span>
                </div>
                <div class="category_item">
                    <span class="w60">产品分类:</span><span class="category_id">{{handleCategory(detail.category_id)}}</span>
                </div>
                <!-- <div>
                    <span class="w60">阅读人数:</span><span>{{detail.view_num}}</span>
                </div> -->
                <div>
                    <span class="w60">购买人数:</span><span>{{detail.pay_number}}</span>
                </div>
                <div>
                    <span class="w60">结业人数:</span><span>{{detail.honour}}</span>
                </div>
                <div style="margin-top: 30px;">
                    <span class="w73">创建用户ID:</span><span>{{detail.username}}</span>
                </div>
                <div>
                    <span class="w60">创建时间:</span><span>{{detail.create_time}}</span>
                </div>
            </div>
            <div class="head-list" v-else>
                <div>
                    <span class="w60">实际售价:</span><span>{{detail.price}}</span>
                </div>
                <div>
                    <span class="w60"><span>原</span><span>价:</span></span><span>{{detail.original_price}}</span>
                </div>
                <div>
                    <span class="w60">报名人数:</span><span>{{detail.student_num}}</span>
                </div>
                <div>
                    <span class="w60"><span>状</span><span>态:</span></span><span>{{detail.state == -1 ? '下架' : detail.state == 2 ? '上架' : detail.state == 1 ? '测试' : detail.state == 3 ? '推荐' : '删除'}}</span>
                </div>
                <div style="margin-top: 30px;">
                    <span class="w73">创建用户ID:</span><span>{{detail.username}}</span>
                </div>
                <div>
                    <span class="w60">创建时间:</span><span>{{detail.create_time}}</span>
                </div>
            </div>
            <div class="head-btn">
                <Button type="default" @click="handleCourse" ghost class="btn-content" style="top: 20%;" v-if="$route.name == 'open-product'">
                    课程统计
                </Button>
                <Button type="default" @click="handleGrade" ghost class="btn-content" style="top: 20%;" v-if="$route.name == 'open-product'&&detail.evaluate_state">
                    培训评价
                </Button>
                <Button type="default" @click="goBack" ghost class="btn-content" style="top: 20%;" v-else>
                    <Icon class="btn-i" :size="22" type="ios-undo"/>
                    返回上一页
                </Button>
                <div class="btn-list">
                    <Button v-if="!showDelete" type="default" @click="handleDelete" ghost class="btn-content2" style="top: 20%;">删除</Button>
                    <Button type="default" @click="edit" ghost class="btn-content3" :style="showDelete ? 'width: 190px; margin: 0' : 'width: 120px'">
                        编辑
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../api/modules/config'
    import defaultHeader from '../assets/img/side-menu/default-header.jpg'
    import postData from '../api/postData.js'
    import {Dialog} from "../views/dialogs";
    import {ADD_PRODUCTION} from "../views/dialogs/types";
    import {mapState} from 'vuex'
    import {classification2} from '../views/ProductManage/production/consts'
    import formModal from './FormModal'

    export default {
        components: {formModal},
        mixins: [Dialog],
        data() {
            return {
                use_router: true,
                activeIndex: '',
                detail: '',
                detailImg: '',
                detailVideo: '',
                showData: true,
                show: false,
                tableRow: {},
                formList: [
                    { type: 'input', name: '产品名称',  field: 'title'},
                    { type: 'select', name: '所属机构',  field: 'organization_id',
                        selectList: [], selectField: [ 'id','title' ]},
                    { type: 'select', name: '状态', field: 'state', selectField: [ 'id','title' ],
                        selectList: [{id: -1, title: '下架'}, {id: 1, title: '测试'}, {id: 2, title: '上架'}] },
                    { type: 'input-number', name: '产品原价', field: 'original_price', disable: true},
                    { type: 'input-number', name: '实际售价', field: 'price'},
                    { type: 'textarea', name: '产品介绍',  field: 'short_description' },
                    { type: 'uploadBtn', name: '展示封面' ,field: 'img_url'},
                ],
                rules: {
                    title: [{ required: true, message: '请输入产品名称', trigger: 'blur' } ],
                    organization_id: [{ required: true, message: '请输入所属机构' } ],
                    state: [{ required: true, message: '请选择产品状态'} ],
                    original_price: [{ required: true, message: '请输入产品原价' } ],
                    price: [{ required: true, message: '请输入产品实际售价' } ],
                    short_description: [{ required: true, message: '请输入产品介绍', trigger: 'blur' } ],
                },
                modalTitle: '编辑合集',
                showDelete: false
            }
        },
        methods: {
            goBack() {
                // if (this.$route.path == '/product/intersection-detail') {
                //     this.$router.push({name: 'production-intersection'})
                // } else {
                //     this.$router.push({name: 'product-manage'})
                // }
                this.$router.go(-1)
            },
            handleCategory(num) {
                let text = ''
                classification2.forEach((t) => {
                    if (t.id == num) text = t.title
                })
                return text
            },
            getList() {
                if(this.showData) {
                    postData('/product/product/get_detail', {product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id}).then((res) => {
                        this.detail = res.data[0]
                        sessionStorage.setItem('PRODUCTINFO', JSON.stringify(res.data[0]))
                        let d = JSON.parse(this.detail.url_arr);
                        this.detailImg = d.default[0]
                        if (d.default && !this.detailImg) this.detailVideo = d.video
                    })
                }else{
                    this.detailVideo = ''
                    let data = {
                        collection_id: JSON.parse(sessionStorage.getItem('INTERSECTION')).collection_id,
                        page_num: 1,
                        page_size: 8
                    }
                    postData('/product/collection/getCollectionDetail', data).then(res => {
                        this.detail = res.data.collection_detail
                        this.detail.img_default = this.detail.img_url
                        this.detailImg = res.data.collection_detail.img_url
                    })
                }
            },
            edit() {
                if(this.showData) {
                    // this.handleSelModal(ADD_PRODUCTION, {type: 2, row: this.detail})
                    this.$router.push({name: 'edit-production'})
                }else{
                    this.show = true
                    this.tableRow = this.detail
                }
            },
            openChange(name) {

            },
            selectItem(index) {
                this.$router.push({name: index});
            },
            initMenu() {
                this.activeIndex = this.$route.name;
            },
            handleDelete() {
                if(this.showData) {
                    this.$config.deleteModal(() => {
                        postData('product/product/change_state', {product_id: this.detail.id, state: -2}).then(res => {
                            if (res.res_code == 1) {
                                this.$Message.info('删除产品');
                                this.$router.push({name: 'product-manage'})
                            }
                            // if (res.res_code == -1) this.$Message.info(res.msg);
                        })
                    });
                }else{
                    this.$config.deleteModal(() => {
                        postData('/product/collection/deleteCollection', {collection_id: JSON.parse(sessionStorage.getItem('INTERSECTION')).collection_id}).then(res => {
                            if(res.res_code == 1){
                                this.$Message.info('删除合集');
                                this.$router.push({name: 'production-intersection'})
                            }
                        })
                    });
                }
            },
            handleClose() {
                this.isShow = false
            },
            handleCourse(){
                let d = JSON.parse(sessionStorage.getItem('PRODUCTINFO'))
                window.open(`/product/course-data?id=${d.id}&&organization_id=${d.organization_id}`,'_blank')
            },
            handleGrade() {
                const onlineList = this.$store.state.online_curriculum.online_curriculum_list
                if(onlineList.length>0){
                    let d = JSON.parse(sessionStorage.getItem('PRODUCTINFO'))
                    window.open(`/product/evaluation-statistics?id=${d.id}&organization_id=${d.organization_id}&curriculum_id=${onlineList[0].id}&curriculum_name=${onlineList[0].title}`,'_blank')
                }
                // evaluation-statistics
                // window.open(`/product/product-grade?id=${JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id}&&title=${JSON.parse(sessionStorage.getItem('PRODUCTINFO')).title}`,'_blank')
                // this.$router.replace('/product/product-grade')
            },
            handleSubmit(val) {
                postData('/product/collection/change', val).then(res => {
                    if(res.res_code == 1) {
                        this.$Message.success(res.msg)
                        this.getList()
                    }
                    else this.$Message.info(res.msg)
                })
            },
            closeModal() {
                this.show = false
            }
        },
        watch: {
            $route() {
                if(this.$route.name == 'intersection-detail') this.showData = false
                else this.showData = true
                this.initMenu();
                this.getList();
                this.showDelete = this.$route.query.detail
                this.$forceUpdate()
            },
            productState(_new) {
                if (_new) this.getList()
            },
            updateStates(val) {
                if(val) this.getList()
            }
        },
        mounted() {
            if(this.$route.name == 'intersection-detail') this.showData = false
            else this.showData = true
            this.getList();
            this.initMenu();
            postData('components/getOrganization').then(res => {
                this.formList[1].selectList = res.data
            })
        },
        computed: {
            ...mapState({productState: state => state.production.edit_product_state, updateStates: state => state.production.update_product_state}),
            userInfo() {
                return this.$store.state.auth.userInfo;
            },
            userHeader() {
                if (!this.userInfo) return defaultHeader;
                if (this.userInfo.head_img_url) return this.userInfo.head_img_url;
                else return defaultHeader;
            }
        }
    }
</script>
<style lang="less" scoped>
    .hide {
        display: -webkit-box;
        white-space: normal;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
    }

    /deep/ .ivu-menu {
        background-color: #333;
        width: 100% !important;
    }

    /deep/ .ivu-menu-item, .ivu-menu-item:hover {
        text-align: left;
        color: #3DAAFF !important;
    }

    /deep/ .ivu-menu-vertical.ivu-menu-light:after {
        content: none !important
    }

    /deep/ .ivu-menu-item-active {
        background-color: #333 !important;
    }

    /deep/ .ivu-menu-item-active:not(.ivu-menu-submenu):after {
        background-color: #333 !important;
    }

    .side-menu-for-project {
        padding: 27px 0;
        /*height: 100%;*/

        .logo {
            margin-bottom: 40px;

            img {
                width: 120px;
            }
        }

        .head-img {
            height: 100px;
            margin-bottom: 18px;

            img, video {
                width: 190px;
                height: 100px;
            }
        }

        .setting {
            position: absolute;
            top: 74px;
            right: 50px;
            width: 26px;
            height: 26px;
            padding: 0;
            border-radius: 50%;
            border-color: #3DAAFF;
            background-color: #3DAAFF;
            color: #ffffff;
            text-align: center;
            line-height: 26px;
            cursor: pointer;

            .hover-glow {
                width: 34px;
                height: 34px;
                position: absolute;
                top: -4px;
                left: -4px;
                background-color: rgba(252, 118, 67, 0.2);
                border-radius: 50%;
                border: 0;
                display: none;
            }

            &:hover {
                .hover-glow {
                    display: block;
                }
            }
        }

        .user-name {
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            white-space: nowrap;
            padding: 0 35px;

            i {
                color: #3DAAFF;
                margin-right: 10px;
            }

            p {
                .hide;
            }

            margin-bottom: 50px;
        }
    }

    .logo {
        margin-bottom: 40px;
    }

    .elRow {
        display: flex;
        flex-direction: column;
        padding: 35px;
        height: calc(100% - 100px);

        .head-title {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            text-align: justify;
            line-height: 26px;
        }

        .head-list {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            margin-top: 30px;
            width: 100%;

            div {
                margin-bottom: 10px;
                display: flex;
            }
        }
    }

    .w73, .w60 {
        display: flex;
        justify-content: space-between;
        margin-right: 6px;
    }

    .w60 {
        width: 60px;
    }

    .w73 {
        width: 76px;
    }

    .head-btn {
        position: relative;
        flex: 1;
        width: 190px;
        padding-bottom: 40px;

        .btn-content {
            margin-top: 40px;
            background-color: #424242;
            color: #fff;

            .btn-i {
                position: relative;
                top: -2px;
            }

            &:hover {
                background-color: #fff;
                color: #5194f8
            }
        }

        .btn-list {
            display: inline-flex;
            margin-top: 40px;

            .btn-content2 {
                width: 60px;
                background: #653522;
                color: #fff;

                &:hover {
                    background-color: #e55114;
                }
            }

            .btn-content3 {
                width: 120px;
                background: #364d6a;
                color: #fff;
                top: 40%;
                margin-left:10px;

                &:hover {
                    background-color: #5099fa;
                }
            }
        }
    }

    /deep/ .ivu-btn {
        width: 190px;
        height: 40px;
        border: none;

        &:hover {
            border: none
        }
    }

    .category_item {
        display: inline-flex;
        flex-wrap: nowrap;
    }

    .category_id {
        width: calc(100% - 70px);
        .hide;
    }
</style>

<template>
    <div class="manage-production-view">
        <screen @resetPage="resetPage" :types="4" :selectType2="true" :select2="select2" @selectChange2="selectChange2" :btnType="true" @handleClick="handleClick" btnName="新建课程"
            :placehodle="select2Placeholder" sizeTitle1="课程总数" :sizeNum1="total" @inputChange="inputChange"></screen>
        <form-modal :show-modal='show' :detail-data="tableRow" :form-list="formList" :rule-validate='rules' @from-submit="handleSubmit" @close="closeModal"
                    :title="modalTitle" @change-list="changeList" :handleFloor="handleFloor" @multiple-change="multipleChange" @handle-next="handleNext"
                    @handle-last="handleLast" @showContent="showContent" :modal-false="true" @modal-close="modalClose" @change-list2="changeList2" :multipleList="multipleList">
            <template slot="multiple" style="display: flex;">
                <div v-for="(item, index) in multipleList" :key="index" style="display: inline-block;position: relative; background: #F0F0F7;border-radius: 4px;margin-right: 10px;margin-top: 8px;padding: 0 10px;">
                    <Icon type="md-close" style="width: 10px;height: 10px;position: absolute;right: -3px;top: -5px;" @click="deleteMiltiple(index)"></Icon>
                    {{item.title}}
                </div>
            </template>
        </form-modal>
        <div class="box">
            <Row :gutter="20" style="min-width: 1100px">
                <Col :span="8" v-for="(item, index) in dataList" :key="index" style="padding: 0 10px;margin-bottom: 20px;">
                    <Card class="card">
<!--                        <Icon type="md-close" class="card-icon" @click="deleteLive(item)" size="18"/>-->
                        <div class="card-type">
                            <div class="card-type-name">{{item.state == -1 ? '下架' : item.state == 0 ? '未上架' : item.state == 1 ? '测试' : item.state == 2 ? '上架' : item.state == 3 ? '推荐' : '删除'}}</div>
                            <div class="card-type-num">共{{item.catalog_num}}节课 | 已播<span style="color: #4098ff;">{{item.catalog_finish_num}}</span>节</div>
                        </div>
                        <div class="card-title">{{item.title}}</div>
                        <div class="card-content">{{item.short_description}}</div>
                        <div class="card-message">
                            <div v-if="item.model == 2 || item.model == 3" class="card-message-price">
                                <span style="color: #F54802">¥{{item.price}}</span><span style="color: #686F92;margin-left: 10px;">¥{{item.original_price}}</span>
                            </div>
                            <div v-if="item.model == 1" class="card-message-product">
                                产品：<div style="color: #4098ff;cursor: pointer;overflow: hidden;text-overflow: ellipsis;white-space: nowrap">
                                <span v-for="(item1, index1) in item.products" :key="index1">{{index1 > 0 ? '、' : ''}}{{item1.product_title}}</span>
                            </div>
                            </div>
                        </div>
                        <div class="card-handle">
                            <div class="card-handle-left">
                                <span class="card-handle-left" v-if="item.model == 2 || item.model == 3" style="margin-right: 20px;">
                                    <img style="width: 16px;" class="card-handle-img" src="../../../assets/img/live_num.png" alt="">
                                    <span>{{item.student_num}}人报名</span>
                                </span>
                                <span class="card-handle-left" v-if="item.model == 1 || item.model == 3">
                                    <img class="card-handle-img" src="../../../assets/img/live_editor.jpg" alt="">
                                    <span>{{item.product_num}}个关联</span>
                                </span>
                            </div>
                            <div class="card-handle-right">
                                <span style="cursor: pointer" @click="check(item)">查看</span>
                                <span style="margin-left: 15px; cursor: pointer" @click="editor(item)">编辑</span>
                                <span style="margin-left: 15px; cursor: pointer" @click="deleteLive(item)">删除</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import formModal from '../../../components/FormModal'
    import postData from '../../../api/postData'

    export default {
        components: {screen, pageList, formModal},
        mixins: [pageMixin],
        data() {
            return {
                select2: [
                    {id: 'all', title: '全部'},
                    {id: 2, title: '上架'},
                    {id: -1, title: '下架'},
                    // {id: 0, title: '未上架'},
                    {id: 1, title: '测试'},
                ],
                select2Placeholder: '搜索课程名称',
                sizeNum1: 10,
                dataList: [],
                show: false,
                tableRow: {},
                formList: [
                    {type: 'input', name: '名称', field: 'title', double: true, isShow: 1},
                    {type: 'select', name: '机构', field: 'organization_id', double: true, selectChange: true, changeNum: 2,
                        selectList: [], selectField: ['id', 'title'], isShow: 1},
                    {type: 'select', name: '销售形式', field: 'model', selectChange: true, clas: 'local-left', disable: false,
                        selectList: [{id: 1, title: '产品销售'},{id: 2, title: '单品销售'},{id: 3, title: '双重销售'}], selectField: ['id', 'title'], isShow: 1},
                    {type: 'select', name: '状态', field: 'state', double: true, clas: 'local-right',
                        selectList: [{id: -1, title: '下架'},{id: 1, title: '测试'},{id: 2, title: '上架'}], selectField: ['id', 'title'], isShow: 1},
                    {type: 'input-number', name: '原价', field: 'original_price', double: true, class: 'local-left', isShow: 1},
                    {type: 'input-number', name: '实际售价', field: 'price', class: 'local-right', isShow: 1},
                    {type: 'multiple', name: '绑定产品', field: 'product_ids', isShow: 1,
                        selectList: [], selectField: ['id', 'title']},
                    {type: 'textarea', name: '介绍', field: 'short_description', maxlength: 100, double: true, isShow: 1},
                    {type: 'uploadBtn', name: '封面', field: 'img_url', double: true, isShow: 1},
                    {type: 'upload',  field: 'uploading', isShow: 2, showAll: 0, isUploadVideo: false}
                ],
                rules: {
                    title: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
                    organization_id: [{ required: true, message: '请选择产品机构' }],
                    model: [{ required: true, message: '请选择产品模式' }],
                    state: [{ required: true, message: '请选择产品状态' }],
                    product_ids: [{ required: true, message: '请选择培训产品' }],
                    original_price: [{ required: true, message: '请选择产品原价' }],
                    price: [{ required: true, message: '请选择实际售价' }],
                    short_description: [{ required: true, message: '请输入产品介绍', trigger: 'blur'  }],
                },
                modalTitle: '',
                handleFloor: 1,
                search: '',
                state: '',
                multipleList: [],
                loadingInstance: null,
                organization_id: +sessionStorage.getItem('organizationId'),
            }
        },
        methods: {
            selectChange2(val) {
                this.state = val == 'all' ? '' : val
                this.getList()
            },
            inputChange(val) {
                this.search = val
                this.getList()
            },
            handleClick() {
                this.modalTitle = '新建课程'
                let items = this.formList[2]
                items.disable = false
                this.formList.splice(2, 1, items)
                this.show = true
                this.tableRow = {
                    title: '',
                    organization_id: this.organization_id,
                    model:'',
                    state: '',
                    product_ids: [],
                    original_price: 0,
                    price: 0,
                    short_description: '',
                }
            },
            handleSubmit(val) {
                if(val.model == 1) {
                    delete val.original_price
                    delete val.price
                }else if(val.model == 2) {
                    delete val.product_ids
                }
                val.description = val.uploading
                if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id !== 1) {
                    val.organization_id = this.organization_id
                }
                if(val.isEditor) {
                    postData('live/change', val).then(res => {
                        if(res.res_code == 1) this.getList()
                    })
                }else{
                    postData('live/add', val).then(res => {
                        if(res.res_code == 1) this.getList()
                    })
                }
                this.show = false
            },
            changeList(val) {
                let n
                if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1) n = 4
                else n = 4
                switch (val) {
                    case 1:
                        this.formList[n].type = ''
                        this.formList[n + 1].type = ''
                        this.formList[n + 2].type = 'multiple'
                        this.handleFloor = 0
                        break
                    case 2:
                        this.formList[n].type = 'input-number'
                        this.formList[n + 1].type = 'input-number'
                        this.formList[n + 2].type = ''
                        this.handleFloor = 1
                        break
                    case 3:
                        this.formList[n].type = 'input-number'
                        this.formList[n + 1].type = 'input-number'
                        this.formList[n + 2].type = 'multiple'
                        this.handleFloor = 1
                        break
                }
            },
            changeList2(val) {
                if(val) {
                    postData('components/getProductsByOrganization', {organization_id: val}).then(res => {
                        if(res.res_code == 1) {
                            this.formList[6].selectList = res.data
                        }
                    })
                }
            },
            multipleChange(val) {
                this.multipleList = []
                this.formList[6].selectList.forEach(item => {
                    val.forEach(item1 => {
                        if(item.id == item1) {
                            this.multipleList.push(item)
                        }
                    })
                })
            },
            setShow() {
                this.formList.forEach(item => {
                    item.isShow == 1 ? item.isShow = 2 : item.isShow = 1
                })
            },
            isShow() {
                this.$nextTick(() => {
                    if(document.querySelector('.w-e-text').clientHeight < 500) {
                        this.formList[9].showAll = 0
                    }else if(document.querySelector('.w-e-text').clientHeight > 500 && this.formList[9].showAll == 0){
                        this.formList[9].showAll = 2
                    }
                })
            },
            handleNext() {
                this.isShow()
                this.setShow()
                this.handleFloor = 2
            },
            handleLast() {
                this.setShow()
                this.handleFloor = 1
            },
            showContent(val) {
                this.formList[9].showAll = val == 1 ? 2 : 1
            },
            closeModal() {
                this.tableRow = {}
                // if(this.formList[0].isShow == 2) this.setShow()
                // this.handleFloor = 1
                // this.show = false
                // console.log(this.handleFloor)
            },
            modalClose() {
                if(this.formList[0].isShow == 2) this.setShow()
                this.handleFloor = 1
                this.show = false
            },
            editor(val) {
                this.changeList2(val.organization_id)
                this.changeList(val.model)
                this.tableRow = val
                this.tableRow.original_price = 0
                this.tableRow.price = 0
                this.tableRow.uploading = this.tableRow.description
                this.tableRow.isEditor = true
                this.modalTitle = '编辑课程'
                let items = this.formList[2]
                items.disable = true
                this.formList.splice(2, 1, items)
                this.show = true
            },
            check(val) {
                this.$router.push({path: 'live-check', query: {id: val.live_id, organization_id: val.organization_id, title: val.title}})
            },
            deleteLive(val) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该直播课</p>',
                    onOk: () => {
                        postData('live/delete', {live_id: val.live_id}).then(res => {
                            if(res.res_code == 1) {
                                this.$Message.success(res.msg)
                                this.getList()
                            }
                        })
                    },
                });
            },
            deleteMiltiple(val) {
                this.multipleList.splice(val, 1)
            },
            getList() {
                this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
                var data = {
                    page_num: this.current,
                    page_size: this.pageSize,
                    search: this.search,
                    state:  this.state,
                    organization_id: this.organization_id
                }
                postData('live/get_list', data).then(res => {
                    this.loadingInstance.close()
                    if(res.res_code == 1){
                        this.dataList = res.data.data
                        this.total = res.data.count
                        this.dataList.uploading = this.dataList.description
                        this.dataList.forEach(item => {
                            item.product_ids = []
                            if(item.products && item.products.length) {
                                item.products.forEach(item1 => {
                                    item.product_ids.push(item1.product_id)
                                })
                            }
                        })
                    }
                })
            },
        },
        mounted() {
            if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1) {
                this.organization_id = ''
                postData('components/getOrganization').then(res => {
                    if(res.res_code == 1) {
                        this.formList[1].selectList = res.data
                    }
                })
            }else{
                this.formList[1].type = ''
                postData('components/getProductsByOrganization', {organization_id: this.organization_id}).then(res => {
                    if(res.res_code == 1) {
                        this.formList[6].selectList = res.data
                    }
                })
            }
            this.pageSize = 9
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-page{
        z-index: 1;
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
    }
    .manage-production-view{
        background-color: #f0f0f7;
        height: 100%;
        /*overflow-x: auto;*/
    }
    .box{
        padding: 20px;
        height: calc(100% - 66px);
        overflow: hidden;
        overflow-y: auto;
        /*min-width: 1100px;*/
        overflow-x: auto;
    }
    .card{
        height: 247px;
        text-align: left;

        .card-icon{
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            display: inline-block;
        }

        &:hover{
            .card-icon{
                display: inline-block;
            }
        }

        .card-type{
            display: flex;

            .card-type-name{
                border-radius: 20px;
                background-color:#4098ff;
                color: #fff;
                width: 50px;
                line-height: 22px;
                height: 22px;
                text-align: center;
            }

            .card-type-num{
                margin-left: 20px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #686F92;
                letter-spacing: 0.25px;
            }
        }

        .card-title{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-family: PingFangSC-Medium;
            font-size: 20px;
            color: #474C63;
            letter-spacing: 0;
            margin-top: 20px;
        }
        .card-content{
            height: 50px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #686F92;
            letter-spacing: 1px;
            line-height: 25px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-top: 10px;
        }
        .card-message{
            margin-top: 20px;

            .card-message-price{
                font-family: PingFangSC-Medium;
                font-size: 16px;
                letter-spacing: 0.17px;
            }
            .card-message-product{
                display: flex;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #686F92;
                letter-spacing: 0.22px;
                line-height: 20px;
                white-space: nowrap;
            }
        }
        .card-handle{
            display: flex;
            margin-top: 15px;
            justify-content: space-between;

            .card-handle-left{
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #686F92;
                letter-spacing: 0.15px;
                display: flex;
                align-items: center;

                .card-handle-img{
                    height: 15px;
                    width: 15px;
                    margin-right: 7px;
                }
            }

            .card-handle-right{
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #4098FF;
                letter-spacing: 0;
            }
        }
    }
</style>

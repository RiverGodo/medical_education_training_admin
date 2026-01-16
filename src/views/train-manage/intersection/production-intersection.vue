<template>
    <div class="manage-production-view">
        <screen @resetPage="resetPage" :types="4" :selectType2="true" :select2="select2" :selectType1="true" :btnType="true" btnName="创建合集" sizeTitle1="合集总数" :sizeNum1="total"
            @selectChange1="selectChange1" @selectChange2="selectChange2" @inputChange="inputChange" @handleClick="handleClick" placehodle="搜索名称"></screen>
        <form-modal :show-modal='show' :detail-data="tableRow" :form-list="formList" :rule-validate='rules' @from-submit="handleSubmit" @close="closeModal" :title="modalTitle" ></form-modal>
        <div class="content" :style="`height: ${boxHeight}px`">
            <Card class="intersection" v-for="(item, index) in list" :key="index" @click.native="handleJump(item)">
                <div class="intersection-card">
                    <img class="intersection-card-img" :src="item.img_url" alt="">
                    <div class="intersection-card-name" :style="productState(item.state)">{{item.state == -1 ? '下架' : item.state == 1 ? '测试' : item.state == 2 ? '上架' : item.state == 3 ? '推荐' : '删除'}}</div>
                    <div class="intersection-card-num">
                        <div class="card-num">{{item.product_num}}</div>
                        <div class="card-title">课程</div>
                    </div>
                </div>
                <div class="intersection-content">
                    <div class="intersection-content-title">{{item.title}}</div>
                    <div class="intersection-content-course">
                        <div class="intersection-content-course-money"><div class="original_price">¥{{item.price}}</div> <div class="price"><span>¥{{item.original_price ? item.original_price : '0'}}<span class="line"></span></span> </div></div>
                        <div class="intersection-content-course-num">{{item.student_num}}人报名</div>
                    </div>
                </div>
            </Card>
        </div>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import formModal from '../../../components/FormModal'
    import pageList from '../../../components/Page'
    import postData from '../../../api/postData'
    import pageMixin from '../../mixins/pageMixins'

    export default {
        components: {screen, formModal, pageList},
        mixins: [pageMixin],
        data() {
            return {
                select2:[
                    {id: 'all', title:'全部状态'},
                    {id: 2, title:'上架'},
                    {id: -1, title:'下架'},
                    {id: 1, title:'测试'},
                    // {id: 3, title:'推荐'},
                ],
                list: [],
                show: false,
                tableRow: {},
                modalTitle: '创建合集',
                formList: [
                    { type: 'input', name: '产品名称',  field: 'title'},
                    { type: 'select', name: '所属机构',  field: 'organization_id',
                        selectList: [], selectField: [ 'id','title' ]},
                    { type: 'textarea', name: '产品介绍', field: 'short_description', maxlength: 100 },
                    { type: 'uploadBtn', name: '展示封面', field: 'img_url'},
                ],
                rules: {
                    title: [{ required: true, message: '请输入产品名称', trigger: 'blur' } ],
                    organization_id: [{ required: true, message: '请输入所属机构'} ],
                    short_description: [{ required: true, message: '请输入产品介绍', trigger: 'blur' } ],
                },
                boxHeight: null,
                organization_id: +sessionStorage.getItem('organizationId'),
                state: '',
                search: ''
            }
        },
        methods: {
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            selectChange2(val) {
                this.state = val == 'all' ? '' : val
                this.getList()
            },
            inputChange(val) {
                this.search = val
                this.getList()
            },
            handleClick() {
                this.show = true
            },
            handleSubmit(val) {
                if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id !== 1) {
                    val.organization_id = this.organization_id
                }
                postData('/product/collection/add',val).then(res => {
                    if(res.res_code == 1) this.getList()
                    else this.$Message.info(res.msg)
                })
            },
            closeModal() {
                this.show = false
            },
            handleJump(item) {
                sessionStorage.setItem('INTERSECTION', JSON.stringify(item))
                this.$router.push('/product/intersection-detail')
            },
            getList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: this.organization_id,
                    state: this.state,
                    search: this.search,
                }
                postData('/product/collection/getCollectionList',data).then(res => {
                    this.list = res.data.data
                    this.total = res.data.count
                })
            },
            productState(val) {
                switch (val) {
                    case -1:
                        return `background: #888CA3`;
                        break
                    case 1:
                        return `background: #4098FF`;
                        break
                    case 2:
                        return `background: #69C017`;
                        break
                    case 3:
                        return `background: #FF7B3A`;
                        break
                }
            }
        },
        mounted() {
            if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1) {
                this.organization_id = ''
                postData('components/getOrganization').then(res => {
                    this.formList[1].selectList = res.data
                })
            }else{

            }
            this.boxHeight = this.total>this.pageSize ? window.innerHeight - 130 : window.innerHeight - 66
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-card-body{
        padding: 0;
    }
    .content{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        overflow-y: auto;
    }
    .intersection{
        height: 273px;
        margin: 15px;
        background-color: #fff;

        .intersection-card{
            height: 180px;
            width: 320px;
            position: relative;

            .intersection-card-img{
                height: 180px;
                width: 100%;
            }

            .intersection-card-name{
                position: absolute;
                text-align: center;
                right: 10px;
                top: 10px;
                color: #fff;
                width: 50px;
                height: 20px;
                border-radius: 14.5px;
            }

            .intersection-card-num{
                position: absolute;
                bottom: 10px;
                left: 10px;
                width: 50px;
                height: 47px;
                background: rgba(51,51,51,.5);
                border-radius: 2px;
                color: #fff;

                .card-num{
                    font-family: PingFangSC-Medium;
                    font-size: 20px;
                    line-height: 28px;
                }

                .card-title{
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    line-height: 20px;
                }
            }
        }

        .intersection-content{
            margin-top: 15px;

            .intersection-content-title{
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-family: PingFangSC-Medium;
                font-size: 18px;
                color: #474C63;
                letter-spacing: 0.19px;
                line-height: 26px;
                text-align: start;
                margin: 0 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .intersection-content-course{
                display: flex;
                justify-content: space-between;
                margin: 16px 14px 0 14px;

                .intersection-content-course-money{
                    font-family: PingFangSC-Medium;
                    font-size: 16px;
                    letter-spacing: 0.17px;
                    display: flex;

                    .original_price{
                        color: #F54802;
                    }
                    .price{
                        color: #686F92;
                        margin-left: 10px;
                    }
                    .line{
                        border-bottom: 1px solid #686F92;
                        width: 100%;
                        display: inline-block;
                        position: relative;
                        top: -60%;
                    }
                }

                .intersection-content-course-num{
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #686F92;
                    letter-spacing: 0.15px;
                }
            }
        }
    }
    /deep/ .md-cloud-upload{
        margin-top: 100px !important;
    }
    .manage-production-view{
        background-color: #f0f0f7;
    }
</style>

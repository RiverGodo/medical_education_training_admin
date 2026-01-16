<template>
    <Modal v-model="showModal" title="查看信息" :width="960" @on-cancel="closeModal" :mask-closable=false
           :footer-hide="true" :styles="{top: '6%'}">
        <div class="detail-data1">
            <img class="detail-data1-img" :src="details.img_url" />
            <div class="detail-item">
                <p class="detail-title">{{details.name}}</p>
                <p class="detail-title2">{{details.organization_name}}</p>
                <div class="detail-course">
                   <p class="detail-course-num">{{details.curriculum_count}}</p>
                   <p class="detail-course-text"> 绑定课程</p>
                </div>
                <p class="item2-title">讲师介绍：</p>
                <p class="item2-description" :style="descriptionStyl">{{details.description}}</p>
                <div v-if="showDescription">
                    <img @click="description" class="description-img" v-if="descriptionIcon" :src="open" />
                    <img @click="description" class="description-img" v-if="!descriptionIcon" :src="close" />
                </div>
            </div>
        </div>
        <Tables :is-serial="pageDataCount" :column="columns1" :table-data="list" :tabel-height="tabelHeight" @row-click="rowClick"></Tables>
        <Page :current="current" :total="total" :page-size="pageSize" @page-list="pageList"></Page>
    </Modal>
</template>

<script>
    import Tables from '../../../components/tables'
    import postData from '../../../api/postData'
    import Page from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import open from '../../../assets/img/open.png'
    import close from '../../../assets/img/close.png'
    export default {
        components: {Tables, Page},
        props: {
            show: {
                type: Boolean,
                default: false
            },
            details: {
                type: Object,
                default: {}
            }
        },
        mixins: [pageMixin],
        data() {
            return {
                open, close,
                showModal: false,
                showDescription: false,
                descriptionIcon: false,
                list:[],
                tabelHeight: 530,
                descriptionStyles: {
                    height: '78px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    'boxOrient': 'vertical',
                    'lineClamp': 3,
                    'textOverflow': 'ellipsis',
                    'textAlign': 'justify'
                },
                descriptionStyl: {},
                columns1:[
                    {
                        title: '类型',
                        key: 'online_name',
                        minWidth: 100
                    },
                    {
                        title: '课程名称',
                        key: 'title',
                        minWidth: 200
                    },
                    {
                        title:'培训项目',
                        key:'product_name',
                        minWidth: 160
                    },
                    // {
                    //     title:'报名人数',
                    //     key:'num',
                    //     minWidth: 100
                    // }
                ],
            }
        },
        watch: {
            show(_new) {
                this.showModal = _new
                if(_new) this.getList()
            },
            details(_new){
               this.$nextTick(() => {
                    let clientHeight = document.querySelector('.item2-description').clientHeight;  
                    let scrollHeight = document.querySelector('.item2-description').scrollHeight;  
                    let bool = clientHeight<scrollHeight ? true : false
                    this.showDescription = bool 
                    this.descriptionIcon = bool
                    if(!bool) this.descriptionStyl = this.descriptionStyles
               })
            }
        },
        methods: {
            rowClick(row){
                // window.open('http://'+row.link_url);
            },
            description(){
                this.descriptionIcon = !this.descriptionIcon
                this.descriptionStyl = this.descriptionIcon ? this.descriptionStyles : {}
            },
            closeModal() {
                this.showModal = false
                this.$emit('close-modal')
            },
            getList() {
                var data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    teacher_id: this.details.id
                }
                postData('user/getTeacherCurriculums', data).then(res => {
                    this.total = res.data.count
                    this.list = res.data.list
                    if(this.list.length>0){
                        this.list.map((t) => {
                            t.online_name = t.online == 'offline' ? '线下培训' : t.online == 'online' ?  '线上课程' : '在线直播'
                        })
                    }
                })
            }
        },
        mounted() {
            this.pageSize = 10
            this.descriptionStyl = this.descriptionStyles
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ivu-table:before, /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-table-wrapper{
        border: none
    }
    /deep/ .ivu-modal-content{
        padding: 10px 30px;
    }
    /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-table:before{
        display: none;
    }
    // /deep/ .ivu-table-wrapper{
    //     border: none;
    // }
    // /deep/ .ivu-table th, /deep/.ivu-table td{
    //     border: none
    // }
    /deep/ .ivu-modal-body{
        padding: 0;
        padding-bottom: 50px;
    }
    .size{
        font-family: PingFangSC-Medium;
        color: #474C63;
    }
    .font{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
    }
    .detail-data1 { 
        display: flex; flex-wrap: nowrap;padding: 40px; 
        position: relative;
        background: #f7f7f7;
        .detail-data1-img{
            width: 180px;
            height: 180px;
            border-radius: 100px;
            margin-top: 3px;
        }
        .detail-item{
            margin-left: 40px;
            .detail-title{
                .size;
                font-size: 18px;
                height: 25px;
            }
            .detail-title2{
                .font;
                margin-top: 13px;
                height: 22px;
            }
            .description-img{
                margin-top: 10px;
                position: absolute;
                right: 40px;
                img{
                    width: 12px;
                    height: 7px;
                }
            }
            .detail-course{
                position: absolute;
                right: 40px;
                top: 43px;
                .detail-course-num{
                    font-family: PingFangSC-Regular;
                    font-size: 38px;
                    color: #4098FF;
                    letter-spacing: 0;
                    text-align: center;
                }
                .detail-course-text{
                    .font;
                    letter-spacing: 0;
                }
            }
            .item2-title{
                 .size;
                 font-size: 16px;
                 margin-top: 13px;
                 height: 22px;
            }
            .item2-description{
                .font;
                margin-top: 13px;
                font-size: 14px;
                letter-spacing: 0;
                line-height: 25px;
                width: 602px;
            }
        }
    }
</style>

<template>
    <Modal v-model="showModal" :title="'预约学员（'+total+'）'" :width="960" @on-cancel="closeModal" :mask-closable=false
           :footer-hide="true" :styles="{top: '6%'}">
        <div class="title-bg grey-medium1">{{details.title}}</div>
        <Tables class="tables" :is-serial="pageDataCount" :column="columns1" :table-data="list" :tabel-height="tabelHeight" @recall="recall"></Tables>
    </Modal>
</template>

<script>
    import Tables from '../../../components/tables'
    import postData from '../../../api/postData'
    export default {
        components: {Tables},
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
        data() {
            return {
                showModal: false,
                list:[],
                pageDataCount: {},
                total: '',
                tabelHeight: 480,
                columns1:[
                    {
                        title: '用户ID',
                        key: 'id',
                        width: 100
                    },
                    {
                        title: '真实姓名',
                        key: 'realname',
                        width: 100
                    },
                    {
                        title:'性别',
                        key:'sex',
                        width: 100
                    },
                    {
                        title:'学科',
                        key:'department_name',
                        width: 100
                    },
                    {
                        title:'年级',
                        key:'grade_name',
                        width: 100
                    },
                    {
                        title:'预约时间',
                        key:'reserve_time',
                        width: 200
                    },
                    {
                        title: '操作',
                        render: (h, param) => {
                            return h('Button', {
                                props:{
                                    type: 'text',
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: 'Title',
                                            content: '<p>确认取消该学员预约</p>',
                                            onOk: () => {
                                                postData('product/curriculum_offline/termChangeState', {enroll_state: 0, student_term_id: param.row.id}).then(res => {
                                                    if(res.res_code == 1) this.getList()
                                                })
                                            },
                                        });
                                    }
                                },
                            }, '取消预约')
                        }
                    }
                ],
            }
        },
        watch: {
            show(_new) {
                this.showModal = _new
                if(_new) {
                    this.getList()
                }
            }
        },
        methods: {
            closeModal() {
                this.showModal = false
                this.$emit('close-modal')
                this.formList = [this.clearItem]
            },
            recall(val) {
                console.log(val);
            },
            getList() {
                var data = {
                    product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
                    term_id: this.details.id
                }
                postData('/product/curriculum_offline/subject_reserve_student_get_list', data).then(res => {
                    res.data.data.forEach(item => {
                        item.sex = item.sex == 1 ? '男' : '女'
                    })
                    this.total = res.data.count
                    this.list = res.data.data
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ivu-modal-header-inner{
        font-family: PingFangSC-Medium;
    }
    /deep/ .ivu-modal-header{
        border: none;
    }
    /deep/ .ivu-modal-body{
        padding: 0;
        padding-bottom: 20px;
        img{
            margin-left: 25px;
            padding-top: 14px;
        }
    }
    .title-bg{
        background: #F7F7F7;
        height: 48px;
        width: 100%;
        padding-left: 20px;
        line-height: 48px;
    }
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
    /deep/ .ivu-table-wrapper{
        border: none;
    }
    .tables{
        margin-top: 20px;
    }
</style>

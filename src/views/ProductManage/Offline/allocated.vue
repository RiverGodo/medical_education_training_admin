<template>
    <Modal v-model="showModal" title="分配学员" :width="960" @on-cancel="closeModal" :mask-closable=false
           :footer-hide="true" :styles="{top: '6%'}">
        <div class="title-bg grey-medium1">{{details.title}} 
            <span >预约{{termData.student_num}}人</span>
        </div>
        <Tables class="tables" :is-serial="pageDataCount" :column="columns1" :table-data="list" @expand="expand" :tabel-height="576"></Tables>
    </Modal>
</template>

<script>
    import Tables from '../../../components/tables'
    import postData from '../../../api/postData'
    import allocatedForm from './allocatedForm.vue'
    export default {
        components: { Tables, allocatedForm },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            details: {
                type: Object,
                default: {}
            },
        },
        data() {
            return {
                showModal: false,
                list:[],
                pageDataCount: {

                },
                states: false,
                total: '',
                termData: {},
                columns1:[
                    {
                        title: '课程名称',
                        key: 'title',
                        minWidth: 100
                    },
                    {
                        title: '类型',
                        key: '',
                        minWidth: 100,
                        render: (h, params) => {
                            let d = params.row.type == 1 ? '讲座' : '实践'
                            return h('span', d)
                        }
                    },
                    {
                        title:'地址',
                        key:'class_address',
                        minWidth: 100
                    },
                    {
                        title:'已分配',
                        key:'divide_count',
                        minWidth: 100
                    },
                    {
                        title:'操作',
                        key:'',
                        minWidth: 100,
                        slot: 'listExpand',
                        type: 'expand',
                        render: (h, params) => {
                              let d = params.row;
                              let term = JSON.parse(sessionStorage.getItem('termData'))
                              this.termData = term;
                              d.term_id = term.term_id
                              d.student_num = term.student_num
                              return  h(allocatedForm, { props: { details: d, } })
                        }
                    },
                ],
            }
        },
        watch: {
            show(_new) {
                this.showModal = _new
                if(_new) {
                    this.list = this.details.offlineCurriculums
                    this.termData = JSON.parse(sessionStorage.getItem('termData'))
                }
            },
            details(_new){
               if(this.show) this.list = this.details.offlineCurriculums
            }
        },
        methods: {
            expand(row,states){
                // if(states) this.list = this.details.offlineCurriculums
            },
            closeModal() {
                this.showModal = false
                this.$emit('close-modal')
                this.formList = [this.clearItem]
            }
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ivu-table-cell-expand{
        transition: none;
        .ivu-icon-ios-arrow-forward:before{
           content: "分配学员"
        }
    }
    /deep/ .ivu-table-body{
        overflow: hidden;
        overflow-y: auto;
    }
    /deep/ .ivu-modal-header-inner{
        font-family: PingFangSC-Medium;
    }
    /deep/ .ivu-modal-header{
        border: none;
    }
    /deep/ .ivu-table-cell-expand i{
        color: #4098FF;
        font-size: 16px;
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
        position: relative;
        text-align: left;
        span{
            position: absolute;
            right: 20px;
        }
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

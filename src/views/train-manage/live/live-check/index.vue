<template>
    <div>
        <screen :types="18" :title="title" btn-name="创建直播" btn-name2="直播平台" :btnType="true" @handleBack="handleBack" @handleClick="handleClick"
            @handleClick2="handleClick2"/>
        <form-modal  :detail-data="tableRow" @from-submit="formSubmit" :show-modal='show' :form-list="formList"
                     @close="closeModal" :title="modalTitle" :rule-validate="rules" modalPadding="modal-class4"/>
        <live-modal :is-show="isShow" @close-modal="closeLiveModal" :title="liveTitle" :live-list="liveList"></live-modal>
        <tables :tabel-height="tableHeight" :column="columns1" :table-data="list" :is-serial="pageDataCount" @operation1="operation1" @operation2="operation2"
                @operation3="operation3" @operation4="operation4" @operation5="operation5"></tables>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../../components/ScreenFrame'
    import tables from '../../../../components/tables'
    import pageList from '../../../../components/Page'
    import pageMixin from '../../../mixins/pageMixins'
    import formModal from '../../../../components/FormModal'
    import liveModal from './live-check-modal'
    import postData from '../../../../api/postData'
    import moment from 'moment'

    export default {
        components: {screen, tables, pageList, formModal, liveModal},
        mixins:  [pageMixin],
        data() {
            return {
                columns1: [
                    {
                        title: '名称',
                        key: 'title',
                        minWidth: 180,
                        align: 'left'
                    },
                    {
                        title: '状态',
                        key: 'type',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('span', params.row.type == 1 ? '直播中' : params.row.type == 2 ? '预告' : params.row.type == 3 ? '回放' : params.row.type == 4 ? '转播' : '已下课')
                        }
                    },
                    {
                        title: '直播时长',
                        key: 'duration',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('span', params.row.duration + '分钟')
                        }
                    },
                    {
                        title: '上课时间',
                        key: 'start_time',
                        minWidth: 180,
                    },
                    {
                        title: '累计在线',
                        key: 'total_online_num',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('span', (!params.row.total_online_num || params.row.total_online_num  == '-') ? 0  + '人' : params.row.total_online_num + '人')
                        }
                    },
                    {
                        title: '操作',
                        minWidth: 300,
                        slot: 'operation',
                        // operation_btn_hide: true,
                        operation: [['直播间','operation1',true], ['编辑','operation2'], ['上移 ','operation3'], ['下移 ','operation4'], ['删除','operation5']],
                    },
                ],
                list: [],
                tableHeight: null,
                tableRow: {},
                show: false,
                modalTitle: '',
                formList: [
                    {type: 'input', name: '名称', field: 'title', double: true},
                    {type: 'textarea', name: '介绍', field: 'short_description', double: true, maxlength:  100},
                    {type: 'datetime',  name: '上课时间', field: 'start_time', clas: 'local-left'},
                    {type: 'input-number', name: '课程时长', field: 'duration', clas: 'local-right', isMin: true},
                    {type: 'select', name: '讲师', field: 'teacher_id', selectChange: true, clas: 'local-left', double: true,
                        selectList: [], selectField: ['id', 'name']},
                    {type: 'select', name: '导师', field: 'instructor_id', selectChange: true, clas: 'local-right', double: true,
                        selectList: [], selectField: ['id', 'realname']},
                    {type: 'localLive', name: '直播布局', field: 'layout'}
                ],
                rules: {
                    title: [{required: true, message: '请输入课程名称', trigger: 'blur'}],
                    short_description: [{required: true, message: '请输入课程介绍', trigger: 'blur'}],
                    start_time: [{required: true, message: '请选择上课时间'}],
                    duration: [{required: true, message: '请选择课程时长'}],
                    teacher_id: [{required: true, message: '请选择讲师'}],
                },
                isShow: false,
                liveTitle: '',
                liveList: [],
                title: '',
                loadingInstance: null
            }
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            handleClick() {
                this.modalTitle = '新建课程'
                this.tableRow = {
                    title: '',
                    short_description: '',
                    start_time: '',
                    duration: 0,
                    teacher_id: '',
                    instructor_id: '',
                    layout: 3
                }
                this.show = true
            },
            formSubmit(val) {
                val.live_id = parseInt(this.$route.query.id)
                let routerUrl = val.isEditor ? 'live/catalog/change' : 'live/catalog/add'
                postData(routerUrl, val).then(res => {
                    if(res.res_code == 1) {
                        this.$Message.success(res.msg)
                        this.getList()
                    }
                })
            },
            closeModal() {
                this.show = false
                this.tableRow = {}
            },
            handleClick2() {
                this.liveTitle = '直播平台'
                postData('live/catalog/get_acc').then(res => {
                    this.liveList = [
                        {title: '直播平台', a: res.data.add}, {title: '登录账号',  content: res.data.acc}, {title: '登录密码',  content: res.data.pwd}
                    ]
                })
                this.isShow = true
            },
            closeLiveModal() {
                this.isShow = false
            },
            operation1(val) {
                postData('live/catalog/get_pwd', {live_catalog_id: val.live_catalog_id}).then(res => {
                    this.liveList = [
                        {title: '直播地址', a: res.data.view_url},
                        {title: '学员口令',  content: res.data.student_pwd},
                        {title: '讲师口令',  content: res.data.teacher_pwd},
                        {title: '嘉宾口令',  content: res.data.guest_pwd},
                        {title: '助理口令',  content: res.data.assistant_pwd},
                    ]
                })
                this.isShow = true
                this.liveTitle = '直播间'
            },
            operation2(val) {
                this.modalTitle = '编辑课程'
                this.tableRow = val
                this.tableRow.isEditor = true
                this.show = true
            },
            operation3(val) {
                let data = {
                    live_catalog_id: val.live_catalog_id,
                    direction: 0
                }
                postData('live/catalog/move', data).then(res => {
                    if(res.res_code == 1) {
                        this.$Message.success(res.msg)
                        this.getList()
                    }
                })
            },
            operation4(val) {
                let data = {
                    live_catalog_id: val.live_catalog_id,
                    direction: 1
                }
                postData('live/catalog/move', data).then(res => {
                    if(res.res_code == 1) {
                        this.$Message.success(res.msg)
                        this.getList()
                    }
                })
            },
            operation5(val) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该直播</p>',
                    onOk: () => {
                        postData('live/catalog/delete', {live_catalog_id: val.live_catalog_id}).then(res => {
                            if(res.res_code == 1) {
                                this.$Message.success(res.msg)
                                this.getList()
                            }
                        })
                    },
                });
            },
            getDataList() {
                postData('components/getTeachers', {organization_id: parseInt(this.$route.query.organization_id)}).then(res => {
                    if(res.res_code == 1) this.formList[4].selectList = res.data
                })
                postData('components/getInstructors', {organization_id: parseInt(this.$route.query.organization_id)}).then(res => {
                    if(res.res_code == 1) this.formList[5].selectList = res.data
                })
            },
            getList() {
                this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
                let data = {
                    page_num: this.current,
                    page_size: this.pageSize,
                    live_id: parseInt(this.$route.query.id)
                }
                postData('live/catalog/get_list', data).then(res => {
                    this.loadingInstance.close()
                    if(res.res_code == 1) {
                        this.list = res.data.data
                        this.total = res.data.count
                        res.data.data.map(item => {
                            item.class_time = moment(item.start_time).format('MM月DD日 hh:mm:ss')

                        })
                    }
                })
            }
        },
        mounted() {
            this.tableHeight = window.innerHeight - 130
            this.getList()
            this.getDataList()
            this.title = this.$route.query.title
        }
    }
</script>

<style scoped>

</style>

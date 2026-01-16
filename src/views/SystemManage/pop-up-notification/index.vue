<template>
    <div class='manage-notification'>
        <check-modal :title="checkTile" :is-show="checkShow" :message="checkMessage" @handleClose="checkClose"></check-modal>
        <FormModal modal-body :detail-data="tableRow" @from-submit="handleSubmit" :show-modal='show'
            editBtnText="保存" :isEditBtnType="isEditBtnType" :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules"
            :btnName="btnName" :flowY="true"></FormModal>
        <screen @resetPage="resetPage" :types="10" title="弹窗通知" btnType btnName="添加通知" @handleClick="createNotificationHandler"
                style="background:#ffffff"/>
        <Tables :tabel-height="tableHeight" :is-serial="pageDataCount" @operation2="editHandler"
                @operation3="deleteHandler"
                :column="columns1" :table-data="list" @operation0="checkHandler"/>
        <page-list class="pages" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import FormModal from '../../../components/FormModal'
    import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
    import screen from '../../../components/ScreenFrame'
    import Tables from '../../../components/tables.vue'
    import postData from 'src/api/postData'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import checkModal from './inform-modal'
    import system from '../mixins/system'
    export default {
        mixins: [FormModalMixin, pageMixin, system],
        components: {screen, FormModal, Tables, pageList, checkModal},
        data() {
            return {
                isEditBtnType: '',
                btnName:'',
                messageContent: '',
                activeName: 'notification',
                noSelect: true,
                tabName: 'notification',
                tableRow: {},
                modalTitle: '',
                show: false,
                tableHeight: null,
                list: [],
                formList: [
                    {type: 'input', name: '通知标题', field: 'title'},
                    {type: 'datetimerange', name: '通知时间', field: 'datetimeranges'},
                    {
                        type: 'notification-object', name: '通知对象', field: 'organization_id', disable: false,
                        selectList: [], selectField: ['id', 'title'], placeholder: '机构',
                        selectList2: [{id: 2, title: '全部'}, {id: 1, title: '已认证'}, {id: 0, title: '未认证'}], field2: 'certify_state', placeholder2: '认证状态',
                        selectList3: [{id: 2, title: '全部'}, {id: 1, title: '学员'}, {id: 0, title: '游客'}], field3: 'identity_state', placeholder3: '用户身份'
                    },
                    {type: 'upload', name: '通知内容', field: 'content', isUploadVideo: false}
                ],
                rules: {
                    title: [{required: true, message: '请输入通知标题'}],
                    datetimeranges: [{required: true, message: '请选择通知时间范围'}],
                },
                columns1: [
                    {
                        key: 'title',
                        title: '通知标题',
                        slot: 'content-html',
                        minWidth: 200,
                        align: 'left'
                    },
                    {
                        key: 'create_time',
                        title: '创建时间',
                        minWidth: 150,
                        align: 'left'
                    },
                    {
                        key: 'realname',
                        title: '创建人',
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        key: 'organization_name',
                        title: '机构',
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        key: '',
                        title: '时限',
                        width: 190,
                        align: 'left',
                        render: (h, params) => {
                            return h('span', null, params.row.start_time+ '—' + params.row.end_time)
                        },
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        align: 'left',
                        operation: [['查看', 'operation0'], ['编辑', 'operation2'], ['删除', 'operation3']],
                    }],
                checkTile: '通知详情',
                checkShow: false,
                checkMessage: {}
            }
        },
        beforeDestroy() {
            this.updateWrapper = null;
            this.createNotificationHandler = null;
            this.handleSubmit = null;
            this.editHandler = null;
            this.getList = null;
            this.list = null;
        },
        methods: {
            updateWrapper() {
                var vm = this;
                setTimeout(function () {
                    var wrapper = vm.$refs.mwrapper;
                    if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
                }, 100)
            },
            createNotificationHandler() {
                this.modalTitle = '添加通知'
                this.tableRow = {}
                this.show = true
                this.btnName = '确认发送'
                this.isEditBtnType = ''
            },
            handleSubmit(d, types) {
                d.type = types === 'editPreservation' ? 'MODIFY' : 'RESEND'
                d.content = d.uploading
                d.start_time = this.$config.formatTimeHM(d.datetimeranges[0])
                d.end_time = this.$config.formatTimeHM(d.datetimeranges[1])
                let url = this.modalTitle === '添加通知' ? 'platform/message/addAndSendPopMsg' : 'platform/message/modifyPopMsg'
                postData(url, d).then((res) => {
                    if (res.res_code == 1) {
                        this.$Message.success(res.msg)
                        this.getList()
                    }
                })
            },
            deleteHandler(row, index) {
                this.$config.deleteModal(() => {
                    postData('platform/message/delPopMsg', {id: row.id}).then((res) => {
                        if (res.res_code == 1) this.getList()
                    })
                })
            },
            editHandler(row, index) {
                this.tableRow = row
                this.tableRow.uploading = row.content
                this.tableRow.datetimeranges = [row.start_time, row.end_time]
                this.show = true
                this.modalTitle = '编辑通知'
                this.btnName = '再次发送'
                this.isEditBtnType="pop-up-notification"
            },
            checkHandler(row, index) {
                console.log(row,'LKL')
                this.checkMessage = row
                this.checkShow = true
            },
            checkClose() {
                this.checkShow = false
            },
            getList() {
                let d = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: this.isSuper ? null : +sessionStorage.getItem('organizationId')
                }
                postData('platform/message/getPopMsgList', d).then((res) => {
                    this.list = res.data.data
                    this.total = res.data.count
                })
            }
        },
        mounted() {
            this.getList()
            this.tableHeight = window.innerHeight - 130
            document.querySelector('.wang-editor-show').style.display = 'none'
        }
    }
</script>
<style scoped lang="less">
    /deep/ .form-message {
        width: 580px;
        height: 500px;
    }

    /deep/ .select-list {
        display: none;
    }

    /deep/ .pages {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 10px;
        margin: 0 auto;
    }

    /deep/ .w-e-text-container {
        overflow-y: auto !important;
    }

    /deep/ .ivu-modal-body {
        padding: 30px;
    }
</style>

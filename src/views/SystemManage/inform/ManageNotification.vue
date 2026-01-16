<template>
    <div class='manage-notification'>
        <check-modal :title="checkTile" :is-show="checkShow" :message="checkMessage" @handleClose="checkClose"></check-modal>
        <FormModal modal-body :detail-data="tableRow" @from-submit="handleSubmit" :show-modal='show'
                   :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules"
                   btnName="确认发送" :flowY="true"></FormModal>
        <screen @resetPage="resetPage" :types="10" title="全站通知" btnType btnName="添加通知" @handleClick="createNotificationHandler"
                style="background:#ffffff"/>
        <Tables :tabel-height="tableHeight" :is-serial="pageDataCount" @operation1="recallHandler" @operation2="editHandler"
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
                    {
                        type: 'notification-object', name: '通知对象', field: 'organization_id', disable: false,
                        selectList: [], selectField: ['id', 'title'], placeholder: '机构',
                        selectList2: [{id: 2, title: '全部'}, {id: 1, title: '已认证'}, {id: 0, title: '未认证'}], field2: 'cert_state', placeholder2: '认证状态',
                        selectList3: [{id: 2, title: '全部'}, {id: 1, title: '学员'}, {id: 0, title: '游客'}], field3: 'identity', placeholder3: '用户身份'
                    },
                    {type: 'upload', name: '通知内容', field: 'content', isUploadVideo: false}
                ],
                rules: {
                    title: [{required: true, message: '请输入通知标题'}],
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
                        key: 'stateInform',
                        title: '状态',
                        minWidth: 100
                    },
                    {
                        key: 'send_time',
                        title: '发送时间',
                        minWidth: 150
                    },
                    {
                        key: 'realname',
                        title: '创建人',
                        minWidth: 120
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        align: 'left',
                        operationLast: false,
                        isInform: true,
                        operation: [['查看', 'operation0'], ['撤回', 'operation1'], ['编辑', 'operation2'], ['删除', 'operation3']],
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
            this.recallHandler = null;
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
            },
            handleSubmit(d) {
                d.content = d.uploading
                let url = this.modalTitle === '添加通知' ? 'platform/message/addAndSendMessage' : 'platform/message/modifyAndSendMessage'
                postData(url, d).then((res) => {
                    if (res.res_code == 1) {
                        this.$Message.success(res.msg)
                        this.getList()
                    }
                })
            },
            recallHandler(row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: `确定要撤回该通知吗!`,
                    onOk: () => {
                        postData('platform/message/dropMessage', {message_id: row.id}).then(res => {
                            if (res.res_code == 1) this.getList()
                        })
                    },
                });
            },
            deleteHandler(row, index) {
                this.$config.deleteModal(() => {
                    postData('platform/message/removeMessage', {message_id: row.id}).then((res) => {
                        if (res.res_code == 1) this.getList()
                    })
                })
            },
            editHandler(row, index) {
                this.tableRow = row
                this.tableRow.uploading = row.content
                this.show = true
                this.modalTitle = '编辑通知'
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
                postData('platform/message/getMessageList', d).then((res) => {
                    res.data.list.forEach(item => {
                        item.stateInform = item.state == 1 ? '已发送' : '已撤回'
                    })
                    this.list = res.data.list
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

<template>
    <div>
        <SendCode title="发送兑换码" :show-modal="codeShow" :list="codeList" @close="codeClose"
                  @selectChecked="codeChecked"/>
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close"/>
        <screen @resetPage="resetPage" :types="8" size-title1="兑换码总数" code-name="" placehodle="搜索兑换码" :size-num1="total"
                :select1="selectList"
                size-title2="已使用" :size-num2="use_count" @handleBack="handleBack" @selectChange1="selectChange1"
                @inputChange="inputChange"/>
        <Tables :tabel-height="tabelHeight" :is-serial="pageDataCount" :column="columns1" :table-data="list"
                @table-swtich="tableSwtich" @operation1="operation1" :select-list="record"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    import Tables from '../../../../components/tables.vue'
    import screen from '../../../../components/ScreenFrame'
    import see from '../../../../components/SeeInfo'
    import SendCode from './SendCode'
    import pageMixin from '../../../mixins/pageMixins.js'
    import pageList from '../../../../components/Page'
    import postData from '../../../../api/postData'
    import seeMixin from '../../../UserManage/Mixins/seeMixin'

    export default {
        name: "UsageRecord",
        components: {Tables, screen, SendCode, pageList, see},
        mixins: [pageMixin, seeMixin],
        data() {
            return {
                codeName: '',
                codeShow: false,
                codeList: [],
                tabelHeight: null,
                use_count: null,
                keyword: '',
                selectList: [],
                columns1: [
                    {
                        title: '兑换码',
                        minWidth: 360,
                        key: 'code',
                        align: 'left'
                    },
                    {
                        title: '使用状态',
                        key: 'use_text',
                        slot: 'state-item',
                        stateKey: 'use_state',
                        stateOther: true,
                        minWidth: 100,
                    },
                    {
                        title: '用户姓名',
                        key: 'realname',
                        minWidth: 100
                    },
                    {
                        title: '用户ID',
                        key: 'username',
                        minWidth: 130
                    },
                    // {
                    //     title: '发送时间',
                    //     key: 'create_time',
                    //     align: 'left',
                    // },
                    {
                        title: '状态',
                        key: 'state_name',
                        minWidth: 100,
                    },
                    {
                        title: '操作',
                        minWidth: 160,
                        slot: 'operation',
                        align: 'center',
                        isSwitch: true, // true --> 启用 false --> 禁用
                        switchKey: 'state',
                        isShowBtn: true,
                        operation: [['查看', 'operation1']],
                        switchList: ['生效', '失效'],
                        isShow: true,
                        isCard: false
                    }],
                list: [],
                tableRowData: {},
                detailShow: false
            }
        },
        beforeDestroy() {
            this.getList = null;
            this.tableSwtich = null;
            this.list = null;
        },
        methods: {
            codeClose() {
                this.codeShow = false;
            },
            codeChecked(val) {
                console.log(val);
            },
            see(row, rowIndex) {
                if (!row.use_state) this.codeShow = true
            },
            immediateFailure(row, rowIndex) {
                console.log(row, rowIndex, 'immediateFailure');
            },
            selectChange1(val) {
                console.log(val)
            },
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            handleClick() {
                this.modalTitle = '添加学员'
                this.show = true
                this.tableRow = {}
            },
            handleBack() {
                this.$router.replace({path: `/dashboard/exchange-code`})
            },
            tableSwtich(val) {
                let d = {
                    state: val.state == true ? 1 : -1,
                    code_id: val.id
                }
                postData('code/modifyCodeDetail', d).then(res => {
                    if (res.res_code == 1) this.getList()
                })
            },
            operation1(row, index) {
                this.tableRowData = row
                this.detailShow = true
            },
            getList() {
                let d = {
                    code_id: JSON.parse(sessionStorage.getItem('useRecords')).id,
                    page_size: this.pageSize,
                    page_num: this.current,
                    keyword: this.keyword,
                }
                postData('code/getCodeHistory', d).then(res => {
                    res.data.list.forEach(item => {
                        item.use_text = item.use_state == 0 ? '未使用' : '已使用'
                        item.state_name = item.state == -1 ? '已失效' : '生效中'
                        item.state = item.state == 1 ? true : false
                    })
                    if (res.res_code == 1) {
                        this.total = res.data.count
                        this.list = res.data.list
                        this.use_count = res.data.use_count
                    }
                })
            }
        },
        mounted() {
            this.getList()
            if (sessionStorage.getItem('useRecords')) {
                this.codeName = JSON.parse(sessionStorage.getItem('useRecords')).realname
            }
            this.tabelHeight = window.innerHeight - 130
        }
    }
</script>


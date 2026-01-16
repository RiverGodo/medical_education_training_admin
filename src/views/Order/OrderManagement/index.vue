<template>
    <div class="user-manage-main">
        <screen @resetPage="resetPage" select-type1 selectType2 :types="19" :select2="select2" placehodle="搜索产品名称"
            @selectChange1="selectChange1" @selectChange2="selectChange2" @inputChange="inputChange"
                sizeTitle1="支付订单" :sizeNum1="payOrder" sizeTitle0="兑换订单" :sizeNum0="orderNum" sizeTitle2="支付总额" :sizeNum2='price'
                @dataPickerChange="dataPickerChange" @dataPickerOk="dataPickerOk" @dataPickerClear="dataPickerClear"/>
        <Tables :tabel-height="tableHeight" :is-serial="pageDataCount" :column="columns1" :table-data="list" @tableSelect="tableSelect"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    import Tables from '../../../components/tables.vue'
    import screen from '../../../components/ScreenFrame'
    import UserMixins from '../../UserManage/Mixins/UserMixins'
    import postData from 'src/api/postData'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'

    export default {
        name: "ManagementList",
        components: {Tables, screen, pageList},
        mixins: [UserMixins, pageMixin],
        data() {
            return {
                keyword: '',
                organization_id: '',
                tableHeight: 0,
                list: [],
                select2: [
                    {id: 'all', title: '全部订单'},
                    {id: 1, title: '已支付'},
                    {id: 0, title: '未支付'},
                ],
                pay_type: '',
                pay_state: '',
                data_picker: ['',''],
                method: '',
                orderNum: null,
                payOrder: null,
                price: null
            }
        },
        computed: {
            columns1() {
                return [
                    {
                        title: '产品名称',
                        key: 'title',
                        align: 'left',
                        minWidth: 200
                    },
                    {
                        title: '产品类型',
                        key: 'type',
                        align: 'center',
                        minWidth: 160,
                        render: (h, params) => {
                            let d = params.row.pay_type == 1 ? '产品' : params.row.pay_type == 2 ? '产品合集' : '直播课'
                            return h('span', d)
                        },
                        filters: [
                            {
                                label: '产品',
                                value: 1
                            },
                            {
                                label: '产品合集',
                                value: 2
                            },
                            {
                                label: '直播课',
                                value: 3
                            }
                        ],
                        filterRemote (value) {
                            this.$emit('tableSelect', 'pay_type', value)
                        },
                        filterMultiple: false,
                    },
                    {
                        title: '所属机构',
                        key: 'organization_title',
                        align: 'left',
                        minWidth: 200
                    },
                    {
                        title: '产品金额',
                        key: 'price',
                        minWidth: 100
                    },
                    {
                        title: '实付金额',
                        key: 'pay_amount',
                        minWidth: 100
                    },
                    {
                        key: '',
                        title: '支付方式',
                        minWidth: 140,
                        render: (h, params) => {
                            // 0无  1微信 2支付宝 3免费 4兑换码 7ios
                            const obj = {0: '', 1: '微信', 2: '支付宝', 3: '免费', 4: '兑换码', 7: 'IOS'}
                            return h('span', obj[params.row.pay_method])
                        },
                        filters: [
                            {
                                label: '微信',
                                value: 1
                            },
                            {
                                label: '支付宝',
                                value: 2
                            },
                            {
                                label: '免费',
                                value: 3
                            },
                            {
                                label: '兑换码',
                                value: 4
                            },
                            {
                                label: 'IOS',
                                value: 7
                            },
                        ],
                        filterRemote (value) {
                            this.$emit('tableSelect', 'method', value)
                        },
                        filterMultiple: false,
                    },
                    {
                        key: 'state',
                        title: '订单状态',
                        minWidth: 140,
                        render: (h, params) => {
                            let d = params.row.state == -1 ? '支付失败' : params.row.state == 1 ? '已支付' : '未支付'
                            return h('span', {style: {color: params.row.state == -1 ? '#F54802' : params.row.state == 1 ? '#2EBF07' : '#474c63'}}, d)
                        },
                        filters: [
                            {
                                label: '等待支付',
                                value: 0
                            },
                            {
                                label: '支付成功',
                                value: 1
                            },
                            {
                                label: '支付失败',
                                value: -1
                            },
                            {
                                label: '用户取消',
                                value: -3
                            },
                        ],
                        filterRemote (value) {
                            this.$emit('tableSelect', 'pay_state', value)
                        },
                        filterMultiple: false,
                    },
                    {
                        title: '用户姓名',
                        key: 'realname',
                        align: 'left',
                        minWidth: 120
                    },
                    {
                        title: '用户账号',
                        key: 'username',
                        align: 'left',
                        minWidth: 140
                    },
                    {
                        title: '支付时间',
                        key: 'update_time',
                        align: 'left',
                        minWidth: 180
                    }]
            }
        },
        beforeDestroy() {
            this.getList = null;
        },
        methods: {
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            selectChange2(val) {
                // this.pay_state = val
                // this.getList()
            },
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            getList() {
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    pay_type: this.pay_type == null ? '' : this.pay_type,
                    method: this.method == null ? '' : this.method,
                    pay_state: this.pay_state == null ? '' : this.pay_state,
                    organization_id: this.$config.setSelVal(this.organization_id),
                    data_picker: this.data_picker[0] == '' ? '' : this.data_picker
                }
                postData('order/getOrderListAdmin', d).then((res) => {
                    if (res.res_code == 1) {
                        this.list = res.data.list
                        this.total = res.data.count
                        this.orderNum = res.data.redeem_code_length
                        this.payOrder = res.data.pay_order_length + '/' + res.data.order_length
                        this.price = res.data.amount
                    }
                })
            },
            tableSelect(type, val) {
                this[type] = val[0]
                this.getList()
            },
            dataPickerChange(val) {
                this.data_picker  = val
            },
            dataPickerClear() {
                this.data_picker  = ['', '']
                this.getList()
            },
            dataPickerOk() {
                this.getList()
            }
        },
        mounted() {
            if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id !== 1) this.organization_id = +JSON.parse(sessionStorage.getItem('organizationId'))
            this.tableHeight = window.innerHeight - 116
            this.getList()
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .screen {
        background: #fff;
    }
</style>


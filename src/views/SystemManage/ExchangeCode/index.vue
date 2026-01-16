<template>
    <div>
        <FormModal :label-widths="95" :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal"
                   :title="modalTitle" :rule-validate='rules' @from-submit="fromSubmit" @change-list="changeList"/>
        <screen @resetPage="resetPage" btnType :types="4" size-title1="兑换码总数" placehodle="搜索兑换码名称" :size-num1="total" btn-name="添加兑换码"
                :select1="selectList" :selectType1="true" select2Placeholder="选择状态" :select2="selectList2"
                size-title2="付费学员" :size-num2="14" @selectChange1="selectChange1" @inputChange="inputChange"
                @handleClick="handleClick" @selectChange2="selectChange2" :selectType2="true"/>
        <Tables :tabel-height="tabelHeight" :is-serial="pageDataCount" @operation1="useRecords" @operation2="edit"
                @downTable="batchDownload" @table-swtich="swtichChange" :column="columns1"
                :table-data="list"  @operation4="deleteCode"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    import Tables from '../../../components/tables.vue'
    import FormModal from '../../../components/FormModal.vue'
    import screen from '../../../components/ScreenFrame'
    import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
    import postData from '../../../api/postData'
    import pageMixin from '../../mixins/pageMixins.js'
    import pageList from '../../../components/Page'

    export default {
        name: "ManagementList",
        components: {Tables, FormModal, screen, pageList},
        mixins: [FormModalMixin, pageMixin],
        data() {
            return {
                show: false,
                // tabelHeight: null,
                modalTitle: '',
                tableRow: {},
                keyword:'',
                state: '',
                organization_id: '',
                tableRow1: {
                    realname: '',
                    content: '',
                    num: 0,
                    jurisdiction: '',
                    isswitch: false,
                    effective_time: []
                },
                selectList: [],
                columns1: [
                    {
                        title: '兑换码名称',
                        key: 'title',
                        align: 'left',
                        minWidth: 140
                    },
                    // {
                    //     title: '类型',
                    //     key: 'type',
                    //     minWidth: 100
                    // },
                    {
                        title: '兑换产品',
                        key: 'product_name',
                        align: 'left',
                        minWidth: 140
                    },
                    {
                        title: '所属机构',
                        key: 'organization_name',
                        align: 'left',
                        minWidth: 140
                    },
                    {
                        title: '生成数量',
                        key: 'code_count',
                        minWidth: 100
                    },
                    {
                        title: '已兑换',
                        key: 'surplus_count',
                        minWidth: 120
                    },
                    {
                        title: '生效时间',
                        key: 'effect_time',
                        align: 'left',
                        minWidth: 130
                    },
                    {
                        title: '失效时间',
                        key: 'invalid_time',
                        align: 'left',
                        minWidth: 130
                    },
                    {
                        title: '创建ID',
                        key: 'username',
                        align: 'left',
                        minWidth: 130
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        align: 'left',
                        minWidth: 130
                    },
                    {
                        title: '状态',
                        key: 'stateName',
                        slot: 'state-item',
                        stateKey: 'state',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        align: 'left',
                        slot: 'operation',
                        operation_state: true,
                        operation: [['查看', 'operation1'], ['编辑', 'operation2'], ['下载', 'downTable'], ['删除', 'operation4']]
                    }],
                list: [],
                formList: [
                    {type: 'input', name: '兑换码名称', field: 'realname'},
                    {
                        type: 'select', name: '选择机构', field: 'jurisdiction', select_change: true, disable: false,
                        selectList: [], selectField: ['id', 'title'], selectChange: true, mechanisms: true
                    },
                    {
                        type: 'select', name: '兑换内容', field: 'content', new_exchange_content: true, disable: false,
                        selectList: [], selectField: ['id', 'title']
                    },
                    {type: 'input-number', name: '兑换数量', field: 'num', disable: false},
                    {
                        type: 'switch-datetimerange',
                        name: '有效时间',
                        field: ['isswitch', 'effective_time'],
                        disable: false,
                        switchList: ['永久', '有效']
                    }
                ],
                rules: {
                    realname: [{required: true, message: '请输入兑换姓名', trigger: 'blur'}],
                    jurisdiction: [{required: true, message: '请选择兑换类型'}],
                    content: [{required: true, message: '请选择兑换内容'}],
                    num: [{required: true, message: '请输入兑换数量'}],
                    effective_time: []
                },
                selectList2: [
                    {id: 'all', title: '全部'},
                    {id: 0, title: '未生效'},
                    {id: 2, title: '已生效'},
                    {id: -1, title: '已失效'},
                ]
            }
        },
        beforeDestroy() {
            this.batchDownload = null;
            this.edit = null;
            this.handleClick = null;
            this.getList = null;
            this.fromSubmit = null;
            this.getProducts = null;
            this.getOrganization = null;
            this.list = null;
        },
        computed: {
            tabelHeight() {
                return window.innerHeight - 116
            }
        },
        methods: {
            batchDownload(row, rowIndex) {
                // postData('code/getCodeHistory', {code_id: row.id, page_size: 20, page_num: 1}).then(res => {
                //     res.data.list.forEach(item => {
                //         item.product_name = row.product_name
                //         item.organization_name = row.organization_name
                //         item.is_state = item.use_state == 0 ? '未使用' : '已使用'
                //     })
                //     let titleList = [
                //         {title: '兑换码', key: 'code'},
                //         {title: '兑换产品', key: 'product_name'},
                //         {title: '所属机构', key: 'organization_name'},
                //         {title: '使用状态', key: 'is_state'},
                //         {title: '用户姓名', key: 'realname'},
                //         {title: '用户ID', key: 'user_id'},
                //         {title: '有效状态', key: 'state_name'},
                //     ]
                //     this.$config.downExcel(titleList, res.data.list, row.title)
                // })
            },
            useRecords(row, rowIndex) {
                this.$router.replace({path: `/dashboard/${row.id}/usage-record/`})
                sessionStorage.setItem('useRecords', JSON.stringify(row))
            },
            immediateFailure(row, rowIndex) {
                console.log(row, rowIndex, 'immediateFailure');
            },
            edit(row, rowIndex) {
                postData('code/getCodeDetail', {code_id: row.id}).then(reslove => {
                    let val, id = reslove.data[0].type == 0 ? reslove.data[0].product_id : reslove.data[0].type == 1 ? reslove.data[0].collection_id : reslove.data[0].live_id

                    postData('components/getProductsCollection', {organization_id: reslove.data[0].organization_id}).then(res => {
                        if (res.res_code == 1) {
                            this.formList[2].selectList = res.data.length ? res.data : [{}]
                            this.formList[2].selectList.forEach((item, index) => {
                                if(id == item.id && reslove.data[0].type == this.editType(item.type)) {
                                    val = index
                                }
                            })
                            reslove.value = val
                            return reslove
                        }
                    }).then(res => {
                        if(res.res_code == 1) {
                            this.modalTitle = '修改兑换码'
                            this.formList[1].disable = true
                            this.formList[2].disable = true
                            this.formList[3].disable = true
                            this.show = true
                            let effct = this.$config.formatTime(new Date(res.data[0].effect_time))
                            let invalid = this.$config.formatTime(new Date(res.data[0].invalid_time))
                            this.getProducts(res.data[0].organization_id)
                            this.tableRow = {
                                id: res.data[0].id,
                                realname: res.data[0].title,
                                num: res.data[0].code_count,
                                jurisdiction: res.data[0].organization_id,
                                // content: res.data[0].product_id,
                                content: res.value,
                                state: res.data[0].state ,
                                effect_time: res.data[0].effect_time,
                                invalid_time: res.data[0].invalid_time,
                                effective_time: res.data[0].state == 1 ? [this.$config.formatTime(new Date(res.data[0].effect_time)), this.$config.formatTime(new Date(res.data[0].invalid_time))] : ['',''],
                                isswitch: res.data[0].effect_time ? false : true,
                                isEdit: true
                            }
                        }
                    })
                })
            },
            editContent(content) {
                let val, id = content.type == 0 ? content.product_id : content.type == 1 ? content.collection_id : content.live_id

                postData('components/getProductsCollection', {organization_id: content.organization_id}).then(res => {
                    if (res.res_code == 1) {
                        this.formList[2].selectList = res.data.length ? res.data : [{}]
                    }
                }).then(() => {
                    this.formList[2].selectList.forEach((item, index) => {
                        if(id == item.id && content.type == this.editType(item.type)) {
                            val = index
                        }
                    })
                })
            },
            editType(type) {
                return type == 'product' ? 0 : type == 'collection' ? 1 : 2
            },
            check(){

            },
            deletes(row, rowIndex) {
                console.log(row, rowIndex);
            },
            swtichChange(row) {
                console.log(row);
            },
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            selectChange2(val) {
                this.state = val == 'all' ? '' : val
                this.getList()
            },
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            handleClick() {
                this.modalTitle = '添加兑换码'
                this.show = true
                this.formList[1].disable = false
                this.formList[2].disable = false
                this.formList[3].disable = false
                this.tableRow = this.tableRow1
            },
            fromSubmit(val) {
                let d = {
                    product_id: this.getContentId(this.formList[2].selectList, val.content, 'id'),
                    collection_id: this.getContentId(this.formList[2].selectList, val.content, 'id'),
                    live_id : this.getContentId(this.formList[2].selectList, val.content, 'id'),
                    title: val.realname,
                    code_count: val.num,
                    organization_id: val.jurisdiction,
                    state: val.isswitch ? 2 : 1,
                    type: this.getContentId(this.formList[2].selectList, val.content, 'type') == "collection" ? 1 : this.getContentId(this.formList[2].selectList, val.content, 'type') == "product" ? 0 : 2 ,
                    effect_time: this.$config.formatTime(val.effective_time[0]),
                    invalid_time: this.$config.formatTime(val.effective_time[1])
                }
                console.log(val, 'KK')
                if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id !== 1) d.organization_id = this.organization_id
                if(val.isEdit) {
                    postData('code/modifyCode', {...d, ...{id: val.id}}).then(res => {
                        if(res.res_code == 1) {
                            this.getList()
                            this.show = false
                        }
                    })
                }else{
                    postData('code/addCode', d).then(res => {
                        if(res.res_code == 1) {
                            this.getList()
                            this.show = false
                        }
                    })
                }
            },
            getContentId(list, id, type) {
                var data
                list.forEach((item, index) => {
                    if(index == id) {
                        data = item[type]
                    }
                })
                return data
            },
            closeModal() {
                this.show = false
            },
            getOrganization() {
                postData('components/getOrganization').then(res => {
                    if (res.res_code == 1 && JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1) this.formList[1].selectList = res.data
                })
            },
            getProducts(val) {
                if (val) {
                    postData('components/getProductsCollection', {organization_id: val}).then(res => {
                        if (res.res_code == 1) {
                            this.formList[2].selectList = res.data.length ? res.data : [{}]
                        }
                    })
                } else {
                    postData('components/getProductsCollection').then(res => {
                        if (res.res_code == 1) {
                            this.formList[2].selectList = res.data.length ? res.data : [{}]
                        }
                    })
                }
            },
            changeList(val) {
                this.getProducts(val)
            },
            deleteCode(val) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该兑换码</p>',
                    onOk: () => {
                        postData('code/removeCode', {redeem_code_id: val.id}).then(res => {
                            if(res.res_code == 1) {
                                this.$Message.success(res.msg)
                                this.getList()
                            }
                        })
                    },
                });
            },
            getList() {
                let d = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    keyword: this.keyword,
                    state: this.state,
                    organization_id: this.organization_id
                }
                postData('code/getCodeList', d).then(res => {
                    res.data.list.forEach(item => {
                        item.stateName = item.state == -1 ? '已失效' : item.state == 0 ? '未生效' : '已生效'
                        item.state = item.state == -1 ? 0 : item.state == 0 ? 2 : 1
                    })
                    this.list = res.data.list
                    this.total = res.data.count
                })
            }
        },
        mounted() {
            this.getOrganization()
            if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1)  this.getProducts()
            else {
                this.organization_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).organization_id
                this.getProducts(this.organization_id)
                this.formList[1].type = ''
            }
            this.getList()
            this.tableRow = this.tableRow1
            // this.tabelHeight = window.innerHeight - 116
        }
    }
</script>

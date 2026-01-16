<template>
    <div class="user-manage-main">
        <FormModal :studentUserId="studentUserId" :labelWidths="100" :modal-false="true" :detail-data="tableRow" :show-modal='show' @from-submit="handleSubmit"
        :form-list="formList"  @close="closeModal" title="实名认证" :rule-validate="rules"/>
        <distribution @batchStudents="batchStudents" :organizationId="organizationIds" :list="selDate" :show="isShow" @closeDistribution="closeDistribution" />
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close"/>
        <screen @resetPage="resetPage" :paying-student="payingStudent" :radio-type="radioType" :select-type1="selectType1"
                isButton2 @handleClick2="batchAllocation" btnName="导出"
                isButton3 @handleClick3="allExports" btnName3="全部导出"
                btnName2="批量分配" :types="5" :size-title1="title1" :size-num1="allNum+ (titleTotal ? '/'+titleTotal : '')"
                @moneyStudent="moneyStudent" @selectChange1="selectChange1" @inputChange="inputChange" :dataPlaceholder="dataPlaceholder"
                @handleClick="handleClick" @dataPickerChange="dataPickerChange" @dataPickerOk="dataPickerOk" @dataPickerClear="dataPickerClear"/>
        <Tables @on-selection-change="onSelectionChange" :isSelection="true" :tabel-height="tableHeight" :is-serial="pageDataCount" @row-click="see"
            @operation5="realnameAuth"  @operation4="changeTest" @select-cancel="selectCancel"    @radio-change="radioChange" @table-swtich="swtichChange" :column="columns1" :table-data="list" @operation2="deleteInfo"
            @all-select-cancel="allSelectCancel"    @operation3="distribution" @operation1="clearInfo" :select-list="student" @tableSelect="tableSelect" :pageDataCount="pageDataCount"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import Tables from '../../../components/tables.vue'
    import screen from '../../../components/ScreenFrame'
    import see from '../../../components/SeeInfo.vue'
    import seeMixin from '../Mixins/seeMixin'
    import UserMixins from '../Mixins/UserMixins'
    import postData from 'src/api/postData'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import distribution from './distribution.vue'
    import titleList from './titleList'
    import FormModal from '../../../components/FormModal.vue'
    import FormModalMixin from '../Mixins/FormModalMixin'
    const validateId = (rule, value, callback) => {
        if (value == ''||value == undefined) callback(new Error('请输入身份证号'));
        else {
            let regs = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
            if(regs.test(value)) callback();
            else callback(new Error('请输入正确的身份证号'));
        }
    };
    export default {
        components: {Tables, screen, see, pageList, distribution, FormModal},
        mixins: [seeMixin, UserMixins, pageMixin, FormModalMixin],
        props: {
            permissionItem4: {
                type: Object,
                default: null
            }
        },
        watch: {
            permissionItem4(_new) {
                this.handleAuth(_new)
            }
        },
        data() {
            return {
                studentUserId: '',
                formList: [
                    {type: 'input', name: '姓名', field: 'realname'},
                    {type: 'input', name: '身份证号', field: 'id_card_number'},
                ],
                rules: {
                    realname: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    id_card_number: [{required: true, validator: validateId}],
                },
                tableRow: null,
                seniority_id: '',
                batch_id: '',
                organizationIds: '',
                isShow: false,
                allNum: null,
                tableRowData: {},
                selectType1: false,
                selectType2: true,
                radioType: false,
                titleTotal: null,
                department_id: null,
                dataPlaceholder: '请选择注册时间范围',
                certify_state: '',
                pay_state: '',
                payingStudent: sessionStorage.getItem('organizationId') == 1,
                sex: '',
                data_picker: ['',''],
                columns1: [
                    {
                        title: '用户ID',
                        key: 'username',
                        align: 'left',
                        minWidth: 100
                    }, {
                        title: '真实姓名',
                        key: 'realname',
                        minWidth: 100
                    }, {
                        title: '性别',
                        slot: 'sex',
                        minWidth: 100,
                        filters: [
                            {
                                label: '男',
                                value: 1
                            },
                            {
                                label: '女',
                                value: 0
                            },
                            {
                                label: '未知',
                                value: 2
                            },
                        ],
                        filterRemote (value) {
                            this.$emit('tableSelect', 'sex', value)
                        },
                        filterMultiple: false,
                        render: (h, params) => {
                            let arr = ['女', '男', '未知']
                            let d = params.row.sex === -1 ? '-' : arr[params.row.sex]
                            return h('span', d)
                        },
                    },
                    {
                        title: '学科',
                        key: 'department_name',
                        align: 'left',
                        minWidth: 100,
                        filters: [],
                        filterRemote (value) {
                            this.$emit('tableSelect' ,'department_id' , value)
                        },
                        filterMultiple: false,
                    },
                    {
                        title: '职称',
                        key: 'profession_name',
                        align: 'left',
                        minWidth: 100,
                        filters: [],
                        filterRemote (value) {
                            this.$emit('tableSelect' ,'profession_id' , value)
                        },
                        filterMultiple: false,
                    },
                    {
                        title: '任职年限',
                        key: 'seniority_id',
                        align: 'left',
                        minWidth: 130,
                        render: (h, params) => {
                            return h('span', params.row.seniority_id != '-' ? params.row.seniority_id + ' 年' : '-')
                        },
                    },
                    {
                        title: '年级',
                        key: 'grade_name',
                        minWidth: 100,
                        filters: [
                            {
                                value: 1,
                                label: '一年级'
                            }, {
                                value: 2,
                                label: '二年级'
                            }, {
                                value: 3,
                                label: '三年级'
                            },
                        ],
                        filterRemote (value) {
                            this.$emit('tableSelect', 'grade_id', value)
                        },
                        filterMultiple: false,
                        // render: (h, params) => {
                        //     let d = params.row.profession_id === 4 ? params.row.grade_name : '-'
                        //     return h('span', d)
                        // },
                    },
                    {
                        title: '批次',
                        key: 'batchs',
                        minWidth: 120,
                        render: (h, params) => {
                            let batchsName = '-'
                            if(params.row.batchs){
                                batchsName = params.row.batchs.split(',')[0]
                            }
                            return h('span', batchsName)
                        },
                        filters: [],
                        filterMultiple: false,
                        filterRemote (value) {
                            this.$emit('tableSelect', 'batch_id', value)
                        },
                    },
                    {
                        key: '',
                        title: '身份',
                        minWidth: 100,
                        render: (h, params) => {
                            let d = params.row.pay_state ? '学员' : '游客'
                            // {style: {color: params.row.pay_state ? '#2EBF07' :'#F54802'}},
                            return h('span', d)
                        },
                        filters: [
                            {
                                label: '游客',
                                value: 0
                            },
                            {
                                label: '学员',
                                value: 1
                            }
                        ],
                        filterRemote (value) {
                            this.$emit('tableSelect' , 'pay_state', value)
                        },
                        filterMultiple: false,
                    },
                    {
                        title: '账号状态',
                        render:(h, params) => {
                            let d = params.row.account_state == -2 ? '已注销' : '正常'
                            return h('span', {style: {color: params.row.account_state == -2 ? 'red' : '#474C63'}}, d)
                        },
                        minWidth: 100,
                    },
                    {
                        title: '是否测试',
                        render:(h, params) => {
                            let d = params.row.is_test_account == 1 ? '是' : '否'
                            return h('span', {style: {color: params.row.is_test_account == 1 ? '#2EBF07' : '#474C63'}}, d)
                        },
                        minWidth: 100,
                    },
                    {
                        title: '状态',
                        render:(h, params) => {
                            let d = params.row.certify_state == 1 ? '已认证' : '未认证'
                            return h('span', {style: {color: params.row.certify_state == 1 ? '#2EBF07' : '#474C63'}}, d)
                        },
                        minWidth: 100,
                        filters: [
                            {
                                label: '未认证',
                                value: 0
                            },
                            {
                                label: '已认证',
                                value: 1
                            }
                        ],
                        filterRemote (value) {
                            this.$emit('tableSelect', 'certify_state', value)
                        },
                        filterMultiple: false,
                    },
                    {
                        title: '注册时间',
                        key: 'create_time',
                        align: 'left',
                        minWidth: 150
                    },
                    {
                        title: '操作',
                        minWidth: 420,
                        slot: 'operation',
                        operation_state: true,
                        operation_is_test_account: true,
                        operation_btn_hide: false,
                        align: 'left',
                        operation: [
                            ['分配批次', 'operation3'],
                            [['清除认证',''],'operation1'],
                            ['删除', 'operation2'],
                            ['【测】', 'operation4'],
                            ['realNameAuthBtn', 'operation5']
                        ]
                    }
                ],
                // operationList: [['统计', 'operation1']],
                title2: '付费学员',
                title1: '学员总数',
                list: [],
                selDate: []
            }
        },
        methods: {
            realnameAuth({id_card_number = '', id, username, organization_id}){
                this.tableRow = {id_card_number, realname: '', id, organization_id}
                this.studentUserId = username
                this.show = true
            },
            handleSubmit({id_card_number, realname, id, organization_id}, index){
                const d = { id_card_number, realname, id, face_state: 0, organization_id}
                PostData('user/manualCertification', d).then((r) => {
                    if(r.res_code == 1) {
                        this.$Message.info('保存成功')
                        this.show = false
                        this.getList()
                    }
                })
            },
            changeTest(row, index){
                const TEXT = row.is_test_account ? '是否取消测试账号？' : '是否设置为测试账号？'
                this.$config.deleteModal(() => {
                    row.is_test_account = row.is_test_account ? 0 : 1
                    PostData('user/updateStudent', {id: row.id, is_test_account: row.is_test_account}).then((r) => {
                        if(r.res_code == 1) this.list.splice(index, 1, row)
                    })
                }, TEXT)
            },
            selList(){
                return sessionStorage.getItem('StudentListSelection') ? JSON.parse(sessionStorage.getItem('StudentListSelection')) : []
            },
            cancelStudentListSelection(da){
                let list = this.selList()
                if(list.length>0){
                    list.map((t, i) => {
                        da.forEach(it => {
                            if(t === it.id) list.splice(i, 1)
                        })
                    })
                    sessionStorage.setItem('StudentListSelection', JSON.stringify(list))
                }
            },
            allSelectCancel(sel, row){
                this.cancelStudentListSelection(this.list)
            },
            selectCancel(sel, row){
                this.cancelStudentListSelection([row])
            },
            batchStudents(){
                this.closeDistribution()
                this.getList()
            },
            getBatchList(organization_id){
                let d = {
                    organization_id,
                    batch: '', 
                    page_size: 9999,
                    page_num: 1,
                }
                PostData('user/getBatchList', d).then((r) => {
                    if(r.res_code == 1){
                        let da = r.data.data
                        if(da&&da.length>0){
                            da.map((t) => {
                                t.label = t.batch
                                t.value = t.id
                            })
                            let d1 = this.columns1[9];
                            d1.filters = da;
                            this.columns1.splice(9, 1, d1)
                        }
                    }
                })
            },
            closeDistribution(){
                this.isShow = false
            },
            openModal(type = false){
                this.organizationIds = type ? +sessionStorage.getItem('organizationId') : this.organization_id;
                this.isShow = true
            },
            batchAllocation(){
                if(this.$config.getRoleId() == 1){
                    if(this.organization_id&&this.organization_id != 'all' ) {
                          if(this.selDate.length>0) this.openModal()
                          else this.$Message.info('请选择学员！');
                    }else this.$Message.info('请选择机构！');
                }else{
                    if(this.selDate.length>0) this.openModal(true)
                    else this.$Message.info('请选择学员！');
                }
            },
            distribution(row){
                if(this.$config.getRoleId() == 1){
                    if(this.organization_id&&this.organization_id != 'all' ) { 
                        this.openModal()
                        this.selDate = [row]
                    }else this.$Message.info('请选择机构！');
                }else this.openModal(true)
            },
            setStudentListSelection(){
                let list = this.selList()
                if(this.selDate.length>0){
                    this.selDate.map(t => {
                        if(!list.includes(t.id)) list.push(t.id)
                    })
                }
                sessionStorage.setItem('StudentListSelection', JSON.stringify(list))
            },
            onSelectionChange(val) {
                this.selDate = val;
            },
            clearInfo(row){
                this.$config.deleteModal(() => {
                    postData('user/removeCertifyInfo',{id: row.id}).then((r) => {
                        if(r.res_code==1) {
                            this.$Message.success({
                                title: '提示',
                                content: '认证信息清除成功!'
                            });
                            this.getList()
                        }
                    })
                },'是否清除认证信息？');
            },
            deleteInfo(item) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该学员</p>',
                    onOk: () => {
                        postData('user/removeStudent', {id: item.id}).then(res => {
                            if(res.res_code == 1) this.getList()
                        })
                    },
                });
            },
            see(row) {
                // this.detailShow = true;
                // this.tableRowData = row;
                this.$router.push({name: 'see-student', query: {id: row.id}})
            },
            selectChange3(v) {
                this.department_id = v;
                this.getList()
            },
            swtichChange(row) {
                console.log(row);
            },
            selectChange1(val) {
                this.organization_id = val
                this.getBatchList(val)
                this.getList(val)
                this.title2 = val ? '' : '付费学员'
                this.title1 = val ? '付费学员' : '学员总数'
                this.payingStudent = val ? false : true
            },
            selectChange2(val) {
                this.grade_id = val
                this.getList()
            },
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            exportStudent(list){
                list.map((t,i)=> {
                    t.index = i+1 
                    t.sex_name = ['-', '女', '男', '未知'][t.sex + 1]
                    t.pay_state_name = ['游客', '学员'][t.pay_state]
                    t.certify_state_name = ['未认证','已认证'][t.certify_state]
                    t.is_have_certification_name = t.is_have_certification ? '是' : '否'
                    t.product_arr_name = t.hasOwnProperty('product_arr')&&t.product_arr.length>0 ? t.product_arr.join(',') : '-'
                })
                this.$config.downExcel(titleList, list, '学员信息')
                sessionStorage.removeItem('StudentListSelection')
            },
            allExports(){
                let d = {
                    organization_id: this.$config.setSelVal(this.organization_id) == null ? '' : this.$config.setSelVal(this.organization_id),
                    page_size: this.total,
                    page_num: 1,
                    data_picker: this.data_picker[0] == '' ? '' :this.data_picker,
                    keyword: this.keyword,
                    department_id: this.$config.setSelVal(this.department_id) == null ? '' : this.$config.setSelVal(this.department_id),
                    grade_id: this.$config.setSelVal(this.grade_id) == null ? '' : this.$config.setSelVal(this.grade_id),
                    pay_state: this.pay_state == null ? '' : this.pay_state,
                    certify_state: this.certify_state == null ? '' : this.certify_state,
                    sex: this.sex == null ? '' : this.sex,
                    data_picker: this.data_picker[0] == '' ? '' :this.data_picker,
                    batch_id: this.batch_id,
                    profession_id: this.profession_id
                }
                postData('user/getStudentList', d).then((res) => {
                    if(res.res_code == 1) this.exportStudent(this.$config.setDataInit(res.data.list))
                })
            },
            handleClick() {
                this.setStudentListSelection()
                let da = this.selList()
                if(da.length>0) {
                    let d = {
                        organization_id: this.$config.setSelVal(this.organization_id) == null ? '' : this.$config.setSelVal(this.organization_id),
                        student_ids: da,
                        page_size: this.pageSize,
                        page_num: this.current,
                        data_picker: ''
                    }
                    postData('user/getStudentList', d).then((res) => {
                        if(res.res_code == 1) this.exportStudent(this.$config.setDataInit(res.data.list))
                    })
                }else this.$Message.info('请选择学员 ！')
            },
            radioChange(_new) {
                console.log(_new)
            },
            moneyStudent(val) {
                this.pay_state = val == "NO" ? '' : val
                this.getList()
            },
            getList() {
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: this.$config.setSelVal(this.organization_id) == null ? '' : this.$config.setSelVal(this.organization_id),
                    department_id: this.$config.setSelVal(this.department_id) == null ? '' : this.$config.setSelVal(this.department_id),
                    grade_id: this.$config.setSelVal(this.grade_id) == null ? '' : this.$config.setSelVal(this.grade_id),
                    pay_state: this.pay_state == null ? '' : this.pay_state,
                    certify_state: this.certify_state == null ? '' : this.certify_state,
                    sex: this.sex == null ? '' : this.sex,
                    data_picker: this.data_picker[0] == '' ? '' :this.data_picker,
                    batch_id: this.batch_id,
                    profession_id: this.profession_id
                }
                postData('user/getStudentList', d).then((res) => {
                    if(res.res_code == 1) {
                        this.list = res.data.list
                        this.total = res.data.all_student
                        this.titleTotal = res.data.all_student
                        this.allNum = res.data.count
                        let selList = this.selList()
                        if (this.list.length > 0) {
                            this.list.map((t) => {
                                t.account_state = t.state
                                t.state = t.certify_state
                                t.realNameAuthState = t.account_state != -2&&t.certify_state == 0
                                t.states = t.pay_state
                                t._checked = false
                                t.department_name = t.department_name_2
                                if (!t.department_id) t.department_name = null
                                if (!t.grade_id) t.grade_name = null
                                if(selList.length>0){
                                    selList.forEach(it => {
                                        if(t.id === it) t._checked = true
                                    })
                                }
                            })
                        }
                    }
                })
            },
            selectChange5(val) {
                this.certify_state = val == 'all' ? '' : val
                this.getList()
            },
            selectChange6(val) {
                this.pay_state = val == 'all' ? '' : val
                this.getList()
            },
            tableSelect(type, val) {
                this[type] = val[0];
                this.getList()
            },
            dataPickerChange(val) {
                this.data_picker  = val
            },
            dataPickerOk(){
                this.getList()
            },
            dataPickerClear() {
                this.data_picker  = ['', '']
                this.getList()
            },
            getSelData(url, i){
                postData(url).then(res => {
                    let list = []
                    res.data.forEach(item => {
                        list.push({value: item.id, label: item.name || item.title})
                    })
                    this.columns1[i].filters = list
                })
            }
        },
        mounted() {
            this.getList()
            this.getSelData('components/getDepts', 5)
            this.getSelData('components/getUserProfession', 6)
            // this.getSelData('components/getUserSeniority', 7)
            if (this.permissionItem4) this.handleAuth(this.permissionItem4)
        }
    }
</script>
<style scoped lang="less">

</style>

<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <FormModal :modal-false="true"  :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal" @from-submit="handleSubmit"
                   :title="modalTitle" :rule-validate='rules'/>
        <screen @resetPage="resetPage" :btn-type="btnType" :select-type1="selectType1" :types="2" :size-title1="scholarTitle+'总数'" :size-num1="total" :btn-name="'添加'+scholarTitle"
               @selectChange1="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :tabel-height="tableHeight" :is-serial="pageDataCount" @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" :select-list="mentor"/>
       <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
  import Tables from '../../../components/tables.vue'
  import FormModal from '../../../components/FormModal.vue'
  import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
  import seeMixin from '../Mixins/seeMixin'
  import FormModalMixin from '../Mixins/FormModalMixin'
  import jurisdictionList from '../jurisdictionList'
  import UserMixins from '../Mixins/UserMixins'
  import postData from 'src/api/postData'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import  { validatePass } from '../validate'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, see, pageList },
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
    props: {
        permissionItemAll: {
            type: Object,
            default: null
        },
        scholarTitle: {
            type: String,
            default: ''
        },
        role: {
            type: Number,
            default: null
        }
    },
    watch: {
        permissionItemAll(_new){
            this.handleAuth(_new)
        }
    },
    data (){
        const validateUsername3 = (rule, value, callback) => {
            if (value == ''||value == undefined) callback(new Error(`请输入${this.scholarTitle}账号`));
            else {
                var filter=/^[a-zA-Z0-9]{1,12}$/; 
                if(filter.test(value)) callback();
                else callback(new Error('请输入至少1位最多12位的字母或数字'));
            }
        };
        return{
            modalTitle: '',
            // modalText:'获得所属机构后台批阅作业、课程评分、回答问题等权限',
            tableRow: {},
            tableRowData: {},
            selectType1: false,
            keyword: '',
            organization_id:'',
            list: [],
            operationList: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
            formList: [
                { type: 'input', name: '真实姓名',  field: 'realname'},
                { type: 'select', name: '所属机构', field: 'organization_id' ,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'input', name: this.scholarTitle+'账号',  field: 'username' },
                { type: 'password', name: '账号密码',  field: 'password' },
            ],
            rules:{
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                organization_id: [{ required: true, message: '请选择机构' } ],
                username: [{ required: true, validator: validateUsername3 }],
                password: [{ required: true, validator: validatePass }],
            }
        }
    },
    computed: {
         columns1(){
            let role = this.$config.getRoleId() !== 2
            let d = role ? [{ title: '所属机构', key: 'title', align: 'left', minWidth: 100 }] : []
            let arr = [
            {  title: '绑定课程', key: 'curr_count', minWidth: 100 },
            {  title: '批阅作业', key: 'homework_rate', minWidth: 100 },
            // {  title: '课程评分', key: 'state', minWidth: 100 },
            // {  title: '回答问题', key: 'state', minWidth: 100 }
            ]
            let d2 = this.role !== 3 ? arr : []
            return [
            {
                title: '用户ID',
                key: 'username',
                align: 'left',
                minWidth: 100
            },{
                title: '真实姓名',
                key: 'realname',
                align: 'left',
                minWidth: 100
              },
            {
                key: '',
                title: '身份',
                minWidth: 100,
                render: (h, params) => {
                    return h('span', this.scholarTitle)
                }
            },
            ...d,
            ...d2,
            {
            title: '最近登录时间',
            key: 'last_time',
            align: 'left',
            minWidth: 150
            },
            {
                title: '操作',
                minWidth: 260,
                slot: 'operation',
                align: 'left',
                operation: [],
            }]
         }
    },
    methods: {
        see(row,rowIndex){
            this.detailShow = true;
            this.tableRowData = row;
        },
        edit(row,rowIndex){
            this.modalTitle = '编辑' + this.scholarTitle
            this.show = true
            this.tableRow = {
              realname: row.realname,
              username: row.username,
              password: row.password,
              id: row.id,
              organization_id: row.organization_id
            }
            this.setOrganization()
        },
        deletes(row,rowIndex){
            this.$config.deleteModal(() => {
                this.fromAddAndEdit('user/removeDeptTeacher', {id:  row.id})
            })
        },
        selectChange1(val){
          this.organization_id = val
          this.getList()
        },
        inputChange(val){
          this.keyword = val
          this.getList()
        },
        setOrganization(){
             if(this.organizationList){
                if(this.role_id == 1){
                    this.getOrganization(2)
                }else if(this.formList[1].field == 'organization_id') this.formList.splice(1,1);
            }
        },
        handleClick(){
            this.modalTitle = '添加' + this.scholarTitle
            this.show = true
            this.tableRow = {}
            this.setOrganization()
        },
        getList(){
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current,
              organization_id: this.organization_id,
              role_id:  this.role
            }
            postData('user/getDeptTeacherList', d).then((res) => {
                 if(res.res_code == 1){
                    this.list = res.data.list
                    this.total = res.data.count
                 }
            })
        },
        handleSubmit(val){
          let d = val
          d.role_id = this.role
          if(this.role_id != 1) d.organization_id = +sessionStorage.getItem('organizationId')
          if(this.modalTitle == ('添加'+this.scholarTitle)) this.fromAddAndEdit('/user/addDeptTeacher',d)
          else this.fromAddAndEdit('/user/modifyDeptTeacher',d)
        }
    },
    mounted() {
        this.getList()
        if(this.permissionItemAll) this.handleAuth(this.permissionItemAll)
        this.organizationList = null
        if(this.role_id == 1)  this.getOrganization()
    }
  }
</script>

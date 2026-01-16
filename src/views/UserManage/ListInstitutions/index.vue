<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <FormModal :modal-false="true" :detail-data="tableRow" :uploadFlie=true :show-modal='show' :form-list="formList" @from-submit="handleSubmit"
                   @close="closeModal" :title="modalTitle" :rule-validate="rules" :maxFileSize="2"/>
        <screen @resetPage="resetPage" :btn-type="btnType" :types="1" size-title1="机构总数" :size-num1="total" btn-name="添加机构" placehodle="搜索机构姓名"  @inputChange="inputChange"
                @handleClick="handleClick" />
        <Tables :tabel-height="tableHeight" :is-serial="pageDataCount" @operation1="see" @operation2="edit" :column="columns1" :table-data="list"
        @table-swtich="tableSwtich" @table-swtich-auth="swtichAuth"  see-url='user/getDeptDetail'  :select-list="institution"/>
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
  import postData from 'src/api/postData'
  import { mapState } from 'vuex'
  import UserMixins from '../Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import  { validatePass, validateUsername2 } from '../validate'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, see, pageList },
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
    props: {
        permissionItem2: {
            type: Object,
            default: null
        }
    },
    data (){
        return{
            modalTitle: '',
            tableRow: {},
            tableRowData: {},
            keyword: '',
            // modalText: '获得所属机构所有权限',
            columns1: [
            {
                title: '机构名称',
                key: 'title',
                align: 'left',
                minWidth: 100
            },
            {
                title: '学管总数',
                key: 'tutor_study_count',
                minWidth: 100
            },
            {
                title: '导师总数',
                key: 'tutor_count',
                minWidth: 100
            },
            {
                title: '学员总数',
                key: 'student_count',
                minWidth: 100
            },
             {
                title: '用户ID',
                key: 'username',
                align: 'left',
                minWidth: 120
            },
            {
                key: '',
                title: '身份',
                minWidth: 120,
                render: (h, params) => {
                    return h('span', '机构管理员')
                }
            },
            {
                title: '状态',
                key: 'state_name',
                minWidth: 80
            },
            {
                title: '认证功能',
                key: 'auth_name',
                minWidth: 100
            },
            {
                title: '最近登录时间',
                key: 'last_time',
                align: 'left',
                minWidth: 140
            },
            {
                title: '操作',
                minWidth: 280,
                slot: 'operation',
                align: 'left',
                isSwitch: false, // true --> 启用 false --> 禁用
                isShowAuth: false,
                switchKey: 'states',
                switchKeyAuth: 'is_open_auth',
                switchList: ['启用', '停用'],
                switchListAuth: ['认证', '免认'],
                operation: [],
            }],
            list: [],
            formList: [
                { type: 'input', name: '机构名称',  field: 'title'},
                { type: 'textarea', name: '机构介绍',  field: 'description' },
                { type: 'input', name: '机构账号',  field: 'username' },
                { type: 'password', name: '账号密码',  field: 'password' },
                // { type: 'inputTab', name: '管理权限',  field: 'jurisdiction', content:'机构管理员'}
            ],
            rules:{
                title: [{ required: true, message: '请输入机构名称', trigger: 'blur' } ],
                description: [{ required: true, message: '请输入机构介绍', trigger: 'blur' } ],
                username: [{ required: true, validator: validateUsername2 }],
                password: [{ required: true, validator: validatePass }],
                // jurisdiction: [],
            },
            operationList: [['查看','operation1'], ['编辑','operation2']]
        }
    },
    watch: {
        permissionItem2(_new){
            this.handleAuth(_new)
        }
    },
    methods: {
        see(row,rowIndex){
            sessionStorage.setItem('institution', JSON.stringify(row))
            this.$router.push('check-institution')
        },
        edit(row,rowIndex){
            sessionStorage.setItem('institution', JSON.stringify(row))
            this.$router.push({path: 'check-institution', query: {state: 1}})
             // postData('user/getDeptDetail', {id: row.organization_id}).then((res) => {
             //    this.show = true
             //    this.modalTitle = '编辑机构'
             //    let username = res.data[0].admin[0].username
             //    let password = res.data[0].admin[0].password
             //    let organization_id = row.organization_id
             //    this.tableRow = {...res.data[0],username ,password, organization_id}
             // })
        },
        deletes(row,rowIndex){
            this.$config.deleteModal(() => {
                this.fromAddAndEdit('user/removeDept', {id: row.organization_id})
            })
        },
        inputChange(val){
           this.keyword = val;
           this.getList()
        },
        handleClick(){
            this.$router.push('creat-institution')
            // this.modalTitle = '添加机构'
            // this.show = true
            // this.tableRow = {}
        },
        getList(){
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current
            }
            postData('user/getDeptAdminList', d).then((res) => {
              this.list = res.data.list
              this.total = res.data.count
              this.list.map((t) => {
                t.state_name = t.state == -1 ? '停用' : '启用'
                t.states = t.state == -1 ? false : true
                t.auth_name = t.is_open_auth ? '认证' : '免认证'
              })
            })
        },
        handleSubmit(val) {
          val.role_id = 2
          if(this.modalTitle === '添加机构') this.fromAddAndEdit('user/addDeptAdmin', val)
          else this.fromAddAndEdit('user/modifyDept', val)
        },
        tableSwtich(r){ 
          let d = { id: r.id, state:  r.states ? 0 : -1, organization_id: r.organization_id}
          this.fromAddAndEdit('user/removeDept', d)
        },
        swtichAuth({organization_id, is_open_auth}){
            console.log(is_open_auth,'r.is_open_auth');
            this.fromAddAndEdit('user/modifyDept', { id: organization_id, is_open_auth })
        }
    },
    mounted() {
        this.getList()
        if(this.permissionItem2) this.handleAuth(this.permissionItem2)
    }
  }
</script>
<style scoped>
</style>

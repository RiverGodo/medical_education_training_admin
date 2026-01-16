<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <FormModal :modal-false="true" :detail-data="tableRow" :show-modal='show' :form-list="formList" @from-submit="handleSubmit" @close="closeModal" :title="modalTitle" :rule-validate='rules'/>
        <screen @resetPage="resetPage" :btn-type="btnType" :types="1" size-title1="管理总数" :size-num1="total" btn-name="添加管理"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :tabel-height="tableHeight" :is-serial="pageDataCount" @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" :select-list="management"/>
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
  import UserMixins from '../Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import  { validatePass, validateUsername } from '../validate'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, see, pageList },
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
    props: {
        permissionItem1: {
            type: Object,
            default: null
        }
    },
    data (){
        return{
          modalTitle: '',
            tableRow: {},
            tableRowData: {},
            // modalText: '获得九划医教后台所有操作权限',
            columns1: [
            {
                title: '用户ID',
                key: 'username',
                align: 'left',
                minWidth: 100
            },{
                title: '真实姓名',
                key: 'realname',
                minWidth: 100
              },
            //   {
            //     title: '性别',
            //     slot: 'sex',
            // },
            {
                title: '手机号',
                key: 'phone',
                align: 'left',
                minWidth: 100
            },
            {
                title: '身份',
                key: 'role_name',
                minWidth: 100
            },
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
            }],
            list:[],
            formList: [
                { type: 'input', name: '真实姓名',  field: 'realname'},
                { type: 'input', name: '管理账号',  field: 'username' },
                { type: 'password', name: '账号密码',  field: 'password' },
                // { type: 'inputTab', name: '管理权限',  field: 'jurisdiction', content:'总管理员'}
            ],
            rules:{
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                username: [{ required: true, validator: validateUsername }],
                password: [{ required: true, validator: validatePass }],
                // jurisdiction: [],
            },
            data1: null,
            keyword: '',
            operationList: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
        }
    },
    watch: {
        permissionItem1(_new){
            this.handleAuth(_new)
        }
    },
    methods: {
        see(row,rowIndex){
            this.detailShow = true;
            this.tableRowData = row;
        },
        edit(row,rowIndex){
            this.modalTitle = '编辑管理'
            this.show = true
            this.tableRow = row
        },
        handleSubmit(val){
           val.role_id = 1
           if(this.modalTitle == '添加管理') this.fromAddAndEdit('user/addSuperAdmin',val)
           else this.fromAddAndEdit('user/modifySuperAdmin',val)
        },
        deletes(row,rowIndex){
            this.$config.deleteModal(() => {
                this.fromAddAndEdit('user/removeSuperAdmin',{id: row.id})
            })
        },
        inputChange(val){
            this.keyword = val;
            this.getList()
        },
        handleClick(){
            this.modalTitle = '添加管理'
            this.show = true
            this.tableRow = { realname: '', username: '',  password: '', jurisdiction: '' }
        },
        getList(){
            let d = {
                keyword: this.keyword,
                page_size: this.pageSize,
                page_num: this.current
            }
            postData('user/getSuperAdminList', d).then((res) => {
                  this.list = res.data.list
                  this.total = res.data.count
                  if(this.list.length>0){
                      this.list.map((t) => {
                          t.role_name = t.role_id == 1 ? '总管理员' : ''
                      })
                  }
            })
        }
    },
    mounted() {
        this.getList()
        if(this.permissionItem1) this.handleAuth(this.permissionItem1)
    }
  }
</script>

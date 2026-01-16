<template>
   <div>
        <div class="open-head grey-regular1">首页公开课<Button class="head-btn" type="primary" @click="handleClick">添加课程</Button></div>
        <FormModal :modal-false="true" :detail-data="tableRow" :show-modal='show' :form-list="formList" @from-submit="handleSubmit" @close="closeModal" :title="modalTitle" :rule-validate='rules'/>
        <div class="sel-list">
            <Select @on-change="selChange" v-if="isSuper" class="select-list" v-model="valueSelect1">
                <Option v-for="t in select" :value="t.id" :key="t.id">{{t.title}}</Option>
            </Select>
            <Select @on-change="selChange" class="select-list" v-model="states">
                <Option v-for="t in select2" :value="t.id" :key="t.id">{{t.title}}</Option>
            </Select>
        </div>
        <Tables :tabel-height="tableHeight" :is-serial="pageDataCounts" @operation1="edit" @operation2="moveUpward" @operation3="MoveDown" @operation4="deletes"  :column="columns1" :table-data="list" />
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
  import Tables from '../../../components/tables.vue'
  import FormModal from '../../../components/FormModal.vue'
  import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
  import postData from 'src/api/postData'
  import UserMixins from '../../UserManage/Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins.js'
  import system from '../mixins/system'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, pageList },
    mixins: [FormModalMixin, UserMixins, pageMixin, system],
    data (){
        return{
            modalTitle: '',
            tableRow: {},
            tableHeight: 0,
            list:[],
            formList: [
                { type: 'input', name: '课程名称',  field: 'title'},
                {
                    type: 'select',
                    name: '所属机构',
                    field: 'organization_id',
                    selectList: [],
                    selectField: ['id', 'title'],
                    selectChange: true,
                    disable: false
                },
                { type: 'select', name: '课程状态', disable: false, field: 'state',
                    selectList: [{id: -1,title:'下架'},{id: 1,title:'上架'}],
                    selectField: ['id', 'title'], selectChange: false
                },
                { type: 'uploadVideo', name: '上传视频',  field: 'video_url' },
            ],
            rules:{
                title: [{ required: true, message: '请输入课程名称', trigger: 'blur' } ],
                organization_id: [{required: true, message: '请输入所属机构'}],
                state: [{ required: true, message: '请选择课程状态'}],
            },
            data1: null,
        }
    },
    beforeDestroy() {
        this.setMove = null;
        this.getList = null;
        this.deletes = null;
        this.handleSubmit = null;
    },
    computed: {
        columns1(){
            const ITEM = [['上移', 'operation2'], ['下移', 'operation3']]
            const operations = this.isSuper ? ((this.valueSelect1 == 'all') ? [] : ITEM) : ITEM
            const TIEM1 = { title: '课程名称', key: 'title', align: 'left', minWidth: 200 }
            const OR_ITME = this.isSuper ? [TIEM1, { title: '所属机构',  key: 'organization_name', align: 'left', minWidth: 150 }] : [ TIEM1 ]
            return [
                {
                    title: '序号', key: '', minWidth: 70,
                    render: (h, params) => {
                        return h('span', (params.index + 1 + (this.current - 1)*this.pageSize))
                    }
                },
                ...OR_ITME,
                {
                    title: '播放量',
                    key: 'views',
                    minWidth: 100
                },
                {
                    title: '状态',
                    key: '',
                    align: 'left',
                    minWidth: 100,
                    render: (h, params) => {
                        let d = params.row.state == -1 ? '下架' : params.row.state == 1 ? '上架' : '测试'
                        return h('span', d)
                    }
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    minWidth: 150
                },
                {
                    title: '创建人',
                    key: 'author_username',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '创建机构',
                    key: 'create_organization',
                    align: 'left',
                    minWidth: 150
                },
                {
                    title: '操作',
                    minWidth: 260,
                    slot: 'operation',
                    align: 'left',
                    operationLower: true,
                    operation: [['编辑','operation1'], ...operations, ['删除','operation4']],
                }
            ]
        }
    },
    methods: {
        setMove(row, type){
            let d = {
               curriculum_open_id: row.id,
               direction: type,
               organization_id: row.organization_id
            }
            postData('product/curriculum_open/move', d).then(res => {
              if(res.res_code == 1){
                  this.$Message.info(res.msg);
                  this.getList()
              }
            })
        },
        moveUpward(row,rowIndex){
            if(rowIndex === 0) this.$Message.info('已经是第一条， 无法上移！')
            else this.setMove(row, 0)
        },
        MoveDown(row,rowIndex){
            if(rowIndex === (this.total - 1)) this.$Message.info('已经是最后一条， 无法下移！')
            else this.setMove(row, 1)
        },
        edit(row,rowIndex){
            this.modalTitle = '编辑课程'
            this.show = true
            this.tableRow = row
        },
        handleSubmit(val){
            if(val.video_url){
                val.role_id = +JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
                if(this.modalTitle == '添加课程') this.fromAddAndEdit('product/curriculum_open/add',val)
                else{
                    val.curriculum_open_id = this.tableRow.id
                    this.fromAddAndEdit('product/curriculum_open/change',val)
                }
            }else this.$Message.info('请上传视频！')
        },
        deletes(row,rowIndex){
            this.$config.deleteModal(() => {
                postData('product/curriculum_open/delete',{curriculum_open_id: row.id}).then(res => {
                    if(res.res_code == 1) this.getList()
                })
            });
        },
        handleClick(){
            this.modalTitle = '添加课程'
            this.show = true
            this.tableRow = { realname: '', username: '',  password: '', jurisdiction: '', organization_id: this.$config.isRoleSuper() ? '' :  +sessionStorage.getItem('organizationId')}
        },
        getList(){
            let d = {
                page_size: this.pageSize,
                page_num: this.current,
                organization_id: this.getOrganizationId,
                state: this.states == 'all' ? '' : this.states 
            }
            postData('product/curriculum_open/get_list', d).then((res) => {
                if(res.res_code==1){
                  this.list = res.data.data
                  this.total = res.data.count
                }
            })
        }
    },
    mounted() {
        this.tableHeight = window.innerHeight - 196
        this.getList()
    }
  }
</script>
<style lang="less" scoped>
@import '../system.less';
</style>


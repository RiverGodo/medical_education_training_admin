<template>
   <div class="user-manage-main">
        <ViewHonour :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <screen @resetPage="resetPage" select-type1 selectType2 :types="15" :select5="invoiceSelect" :select6="select6" :select2="select2" placehodle="搜索产品名称" @selectChange1="selectChange1" 
        @selectChange2="selectChange2" @selectChange5="selectChange5" @selectChange6="selectChange6" @inputChange="inputChange" />
        <div class="batch">
            <div class="batch-title">选项</div>
            <Button class="batch-read" type="primary" @click="batchDownload" ghost>批量下载</Button>
        </div>
        <Tables :tabel-height="tableHeight" @operation1="see"   @select-tables="selectTables" @on-select-all="selectTablesAll" :is-selection=true :is-serial="pageDataCount" :column="columns1" :table-data="list" />
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
  import ViewHonour from './ViewHonour.vue'
  import invoiceSelectInfo from './const.js'
  export default {
    name: "ManagementList",
    components: { Tables, screen, pageList, ViewHonour },
    mixins: [UserMixins, pageMixin],
    data (){
        return{
            keyword: '',
            organization_id:'',
            tableHeight: 0,
            tableRowData: {},
            list: [],
            detailShow: false,
            product_id: 'all',
            types: 'all',
            invoiceSelectInfo,
            invoice_state: '',
            select2: [ {id: 'all', title: '全部产品'} ],
            invoiceSelect: [{id: 'all', title: '全部证书'}],
            select6: [
                {id: 'all', title: '全部状态'},
                {id: 0, title: '未下载'},
                {id: 1, title: '已下载'},
            ],
            selectionList: []
        }
    },
    computed: {
         columns1(){
            return [
            {
                title: '用户ID',
                key: 'username',
                align: 'left',
                minWidth: 140
            },
            {
                title: '真实姓名',
                key: 'realname',
                align: 'left',
                minWidth: 100
            },
            {
                title: '获得证书',
                align: 'left',
                key: 'honour_name',
                minWidth: 150
            },
            {
                title: '所属课程',
                key: 'product_title',
                minWidth: 100
            },
            {
              title: '提交时间',
              key: 'time',
              align: 'left',
              minWidth: 150
            },
            {
                key: 'state',
                title: '状态',
                minWidth: 100,
                render: (h, params) => {
                    let d = params.row.state == 1 ? '已下载' :'未下载'
                    return h('span', {style: {color: params.row.state == -1 ? '#F54802' : params.row.state == 1 ? '#2EBF07' :'#474c63'}}, d)
                }
            },
            {
                title: '操作',
                minWidth: 260,
                slot: 'operation',
                align: 'left',
                operation: [['查看','operation1']],
            }]
         }
    },
    beforeDestroy() {
      this.getList = null;
    },
    methods: {
        close(){
            this.detailShow = false;
        },
        download(){
            let arr = []
            this.selectionList.forEach((m)=>{ arr.push(m.id) })
            let d1 = { ids: JSON.stringify(arr) }
            postData('product/changeDownloadState',d1).then((res)=>{
                if(res.res_code==1){
                    this.getList()
                    let d = this.$config.copy(this.invoiceSelectInfo,[])
                    d.map((t)=>{
                        t.key = t.title
                        t.title = t.name
                    })
                    let titleList = d
                    this.selectionList.map((t,i)=> t.index=( i+1 ) )
                    this.$config.downExcel(titleList, this.selectionList, '证书信息')
                }
            })
        },
        batchDownload(){
            if(this.selectionList.length>0) this.download()
            else this.$Message.warning('请选择发票')
        },
        selectTables(selection, row) {
            this.selectionList = selection
        },
        selectTablesAll(selection, row) {
            this.selectionList = selection
        },
        see(row,rowIndex){
            postData('product/user_honour_get_detail',{id: row.id}).then((res) => {
                if(res.res_code==1){
                  this.detailShow = true;
                  this.tableRowData = this.$config.setDataInit([res.data])[0];
                }
            })
        },
        selectChange1(val){
          this.organization_id = val
          this.getList()
        },
        selectChange2(val){
          this.product_id = val
          this.getList()
        },
        selectChange5(val){
          this.types = val
          this.getList()
        },
        selectChange6(val){
          this.invoice_state = val
          this.getList()
        },
        inputChange(val){
          this.keyword = val
          this.getList()
        },
        getList(){
            let d = {
              search: this.keyword,
              page_size: this.pageSize,
              page_num: this.current,
              organization_id: this.$config.setSelVal(this.organization_id),
              product_id: this.$config.setSelVal(this.product_id),
              honour_id: this.$config.setSelVal(this.types),
              state: this.$config.setSelVal(this.invoice_state)
            }
            postData('product/getHonourList', d).then((res) => {
                 if(res.res_code == 1){
                    this.list = res.data.data
                    this.total = res.data.count
                 }
            })
        },
        getProd(){
            let d = { organization_id: this.$config.setSelVal(this.organization_id) }
            postData('components/getProducts',d).then((res)=>{
                if(res.res_code == 1){
                    this.select2 = [...this.select2,...res.data]
                }
            })
        },
        getHonour(){
            let d = { organization_id: this.$config.setSelVal(this.organization_id) }
            postData('product/honour_pull_down_get_list',d).then((res)=>{
                if(res.res_code == 1){
                    if(res.data.length>0){
                        res.data.map(t => t.title = t.name)
                    }
                    this.invoiceSelect = [{id: 'all', title: '全部证书'},...res.data]
                }
            })
        }
    },
    mounted() {
        this.tableHeight = window.innerHeight - 176
        this.getProd()
        this.getList()
        this.getHonour()
    }
  }
</script>
<style lang="less" scoped>
    .size{
        width: 100px;
        height: 30px;
    }
    /deep/.screen{
      background: #fff;
    }
    .batch {
        text-align: left;
        display: flex;
        border-top: 1px solid #F0F0F7;
        background-color: #fff;
        height: 60px;
        align-items: center;
        &-title {
            margin-left: 26px;
            font-size: 16px
        }
        &-read {
            margin-left: 20px;
            .size;
        }
        &-read2 {
            margin-left: 10px;
            .size;
        }
    }
</style>


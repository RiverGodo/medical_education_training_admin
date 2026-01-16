<template>
   <div class="user-manage-main">
        <ViewInvoice :detail-data="tableRowData" title="查看发票" :show-modal='detailShow' @close="close" />
        <screen @resetPage="resetPage" select-type1 selectType2 :types="15" :select5="invoiceSelect" :select6="select6" :select2="select2" placehodle="搜索产品名称" @selectChange1="selectChange1"
        @selectChange2="selectChange2" @selectChange5="selectChange5" @selectChange6="selectChange6" @inputChange="inputChange" />
        <div class="batch">
            <div class="batch-title">选项</div>
            <Button class="batch-read" type="primary" @click="batchDownload" ghost>批量下载</Button>
        </div>
        <Tables :tabel-height="tableHeight" @operation1="see"   @select-tables="selectTables" @on-select-all="selectTablesAll" :is-selection=true :is-serial="pageDataCount" :column="columns1" :table-data="list" :select-list="invoiceSelectInfo" />
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
  import ViewInvoice from './ViewInvoice.vue'
  import invoiceSelectInfo from './const.js'
  export default {
    name: "ManagementList",
    components: { Tables, screen, pageList, ViewInvoice },
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
            invoiceSelect:  [
                {id: 'all', title: '全部发票'},
                {id: 0, title: '电子发票'},
                {id: 1, title: '纸质发票'},
            ],
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
                key: 'user_username',
                align: 'left',
                minWidth: 140
            },
            {
                title: '开票用户',
                key: 'user_realname',
                minWidth: 100
            },
            {
                title: '发票类型',
                key: 'prop_name',
                align: 'left',
                minWidth: 100
            },
            {
                title: '发票抬头',
                align: 'left',
                key: 'title',
                minWidth: 150
            },
            {
                title: '发票金额',
                key: 'amount',
                minWidth: 100
            },
            {
                title: '购买产品',
                key: 'product_title',
                align: 'left',
                minWidth: 150
            },
            {
              title: '申请时间',
              key: 'create_time',
              align: 'left',
              minWidth: 150
            },
            {
                key: 'state',
                title: '发票状态',
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
            let d1 = { invoice_ids: arr, state: 1 }
            postData('order/invoice/change',d1).then((res)=>{
                if(res.res_code==1){
                    this.getList()
                    let d = this.$config.copy(this.invoiceSelectInfo,[])
                    d.map((t)=>{
                        t.key = t.title
                        t.title = t.name
                    })
                    let titleList = d
                    this.$config.downExcel(titleList, this.selectionList, '发票信息')
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
            this.detailShow = true;
            this.tableRowData = row;
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
              page_size: 9999,
            //   page_size: this.pageSize,
              page_num: this.current,
              organization_id: this.$config.setSelVal(this.organization_id),
              product_id: this.$config.setSelVal(this.product_id),
              prop: this.$config.setSelVal(this.types),
              state: this.$config.setSelVal(this.invoice_state)
            }
            postData('order/invoice/get_list', d).then((res) => {
                 if(res.res_code == 1){
                    this.list = res.data.list
                    this.total = res.data.count
                    this.list.map((t)=>{
                        t.prop_name = t.prop ? '纸质发票' : '电子发票'
                        t.type_name = t.type ? '公司' : '个人'
                    })
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
        }
    },
    mounted() {
        if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id !== 1) this.organization_id = +JSON.parse(sessionStorage.getItem('organizationId'))
        this.tableHeight = window.innerHeight - 176
        this.getProd()
        this.getList()
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


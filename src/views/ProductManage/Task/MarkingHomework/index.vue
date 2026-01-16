<template>
   <div>
        <screen :types="9"  @handleBack="handleBack" :title="screenTitle"/>
        <screen @resetPage="resetPage" :types="11" size-title1="提交作业人数" :size-num1="total" btn-name="上传批阅" :select2="selectList" :select-type2="true"
                    @selectChange2="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :is-serial="pageDataCount" @operation1="see" @operation2="edit" @operation3="deletes" :column="columns1" :table-data="list" :tabel-height="tabelHeight"/>
       <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>

<script>
  import Tables from '../../../../components/tables.vue';
  import screen from '../../../../components/ScreenFrame';
  import * as types from '../../../dialogs/types';
  import { Dialog } from '../../../dialogs';
  import postData from '../../../../api/postData'
  import pageMixin from '../../../mixins/pageMixins'
  import pageList from '../../../../components/Page'
  import {mapState} from 'vuex'

  export default {
    mixins: [Dialog, pageMixin],
    name: "MarkingHomework",
    components: { Tables, screen, pageList },
    data (){
        return{
            selectList: [
              {title: '全部', id: ''},
              {title: '未批阅', id:'0'},
              {title: '已批阅', id:'1'},
            ],
            mark_state: '',
            screenTitle: '',
            search: '',
            count: null,
            columns1: [
            {
                title: '用户名',
                key: 'username',
                align: 'left',
                minWidth: 200
            },{
                title: '真实姓名',
                key: 'realname',
                minWidth: 100
            },{
                title: '科室',
                key: 'department_name',
                minWidth: 100
            },
            {
                title: '年级',
                key: 'grade_name',
                align: 'left',
                minWidth: 100
            },
            {
                title: '状态',
                key: 'isState',
                minWidth: 100
                // slot: 'state-item',
                // stateKey: 'state'
            },
                {
                title: '提交作业时间',
                key: 'create_time',
                align: 'left',
                minWidth: 200
            },
            {
                title: '操作',
                minWidth: 260,
                slot: 'operation',
                operation_btn_hide: true,
                operation: [['查看','operation1',true], ['批阅','operation2']],
            }],
            list: [],
            listStyle: {}
        }
    },
    computed:{
      ...mapState(['taskState']),
      tabelHeight() {
        return window.innerHeight - 60 - 50 - 70;
      }
    },
    watch: {
      taskState() {
        this.initData()
      }
    },
    beforeDestroy() {
      this.list = null;
      this.initData = null;
    },
    methods: {
        selectChange1(val){
          this.mark_state = val;
          this.initData()
        },
        see(row,rowIndex){
           this.handleSelModal(types.READ_OVER, { type: 2, row })
        },
        edit(row,rowIndex){
            this.handleSelModal(types.READ_OVER, { type: 1, row })
        },
        deletes(row,rowIndex){
            console.log(row,rowIndex);
        },
        inputChange(val){
            this.search = val
            this.initData()
        },
        handleClick(){
            console.log('open modal')
        },
        handleBack(){
            this.$router.replace({path:'/product/open-product'})
            // this.$router.replace({name: 'open-product'});
        },
        initData(){
            postData('product/homework/student_homework_get_list',{
                homework_id: parseInt(this.$route.params.id),
                search: this.search,
                page_size: this.pageSize,
                page_num: this.current,
                mark_state: this.mark_state
            }).then(res =>  {
              res.data.data.forEach(item => {
                item.isState = item.mark_state == 1 ? '已批阅' : '未批阅'
              })
              res.data.data.forEach(item => {
                if(item.mark_state == 0) item.cellClassName =  {isState: 'demo-table-info-column'}
              })
                this.list = res.data.data
                this.total = res.data.count
            })
        }
    },
    mounted() {
        if(sessionStorage.getItem('MarkingHomework')){
            this.screenTitle = JSON.parse(sessionStorage.getItem('MarkingHomework')).title
        }
       this.initData()
    }
  }
</script>

<style lang="less" scoped>
    /deep/ .all-size{
        height: 100%;
        display: flex;
        align-items: center;
    }
</style>

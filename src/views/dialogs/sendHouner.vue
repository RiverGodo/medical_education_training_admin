<template>
    <Modal title="颁发证书" :transfer=false :width=700 :show-close="false" v-model="sendOfflineCourse"
           @on-cancel="handleRemoveModal(remove)" :mask-closable="false" :footer-hide="true">
        <base-input @closedialog="handleClose">
            <Row  slot="header" class='search-bar' type='flex' align='middle'>
                <Select @on-change="searchType" v-model="complete_state" placeholder="请选择" style="width: 165px;margin-left: 20px;">
                    <Option label="全部" :value="'all'"></Option>
                    <Option label="已完成培训" :value="1"></Option>
                    <Option label="未完成培训" :value="0"></Option>
                </Select>
                <Input @on-change="search"  placeholder="请输入用户名" v-model="keyword"> <Icon type="ios-search" slot="prefix" /> </Input>
            </Row>
           <Row slot="body">
                <Table class="table" ref="table" :data="list" @on-select-all="handleSelectedAll"
                       :columns="courseColumns" style="width: 100%" @on-selection-change="handleSelectionChange">
                </Table>
                <Row class="course-page">
                    <Page @on-change="handleCurrentChange" :current="current"
                       size="small" :page-size="pageSize" :total="total"></Page>
                </Row>
                <Row class="btns">
                    <Button class="send-btn" @click="handleSendTask">发送</Button>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>
<script>

  import BaseInput from '../../components/BaseInput'
  import UploadPanel from '../../components/UploadPanel'
  import {RemoveModal} from './mixins'
  import {send_student_offline_curriculum} from '../../api/modules/tools_student'
  import postData from 'src/api/postData'

  let tooltips = {ellipsis: true, tooltip: true}

  export default {
    mixins: [RemoveModal],
    props: {
      remove: {
        type: String
      },
      payload: {}
    },
    components: {'base-input': BaseInput, 'upload-panel': UploadPanel},
    data() {
      return {
        sendOfflineCourse: true,
        multipleSelection: [],
        searchData: '',
        curPage: 1,
        checked: false,
        current: 1,
        total: null,
        pageSize: 12,
        list: [],
        complete_state: 'all',
        keyword: '',
        courseColumns: [
          {
            title: '用户名',
            key: 'username',
             ...tooltips
          },
          {
            title: '姓名',
            key: 'realname',
            ...tooltips
          },
          {
            title: '手机号',
            key: 'phone',
            ...tooltips
          },
          {
            title: '科室',
            key: 'department_name'
          },
          {
            title: '班级',
            key: 'grade_name',
          },
          {
            title: '完成率',
            key: 'complete_rate',
            align: 'center',
          },
          {
            type: 'selection'
          }
        ]
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList(){
        let d = {
          product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
          page_size: this.pageSize,
          page_num: this.current,
          keyword: this.keyword,
          honour_id: this.payload.row.id,
          complete_state: this.complete_state == 'all' ? '' : this.complete_state
        };
        let loadingInstance = null
        loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
        postData('product/get_product_students',d).then((res) => {
         if(res.res_code == 1){
            this.list = res.data.list
            this.list.map((t) => {
              t._disabled = t.state&&(parseInt(t.complete_rate) == 100) ? true : (parseInt(t.complete_rate) != 100) ? true : false
              t._checked = t.state&&(parseInt(t.complete_rate) == 100) ? true : false
            })
            if(loadingInstance) loadingInstance.close()
            this.total = res.data.count
         }
        })
      },
      search(){
        this.current = 1
        this.getList()
      },
      searchType(v){
        this.current = 1
        this.complete_state = v;
        this.getList()
      },
      handleSelectedAll(val) {
        this.multipleSelection = val
      },
      handleClose() {
        this.sendOfflineCourse = false;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleCurrentChange(val) {
        this.current = val;
        this.getList()
      },
      handleSendTask() {
        var list = [];
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          this.multipleSelection.map(item => {
           if(item.hasOwnProperty('_disabled')&&!item._disabled&&(parseInt(item.complete_rate) === 100))  list.push(item.id)
          });
        }
        if (list.length > 0) {
          let d = {
            product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
            honour_id: this.payload.row.id,
            user_ids: list
          }
          postData('/product/issue_honour_to_user',d).then((res) => {
            if (res) {
              this.multipleSelection = []
              this.$Modal.info({
                title: '提示',
                content: '证书颁发成功!',
              });
              this.getList()
              this.$store.commit('set_houner_state', true)
            }
          })
        } else {
          this.$Message.warning('请选择完成率是100%的学员!');
        }
      }
    }
  }
</script>
<style lang="less" scoped>
    /deep/ .ivu-select-selected-value{padding-left: 15px;}
    /deep/ .ivu-input-wrapper{
      margin-left: 15px;
    }
    /deep/ .ivu-input{
       border-radius: 18px !important
    }
    /deep/ .ivu-select-selection{
        border-radius: 18px
    }
    .search-bar{
      height: 60px;
      background: #F0F0F7;
    }
    /deep/ th, /deep/ .ivu-table-cell > span {
        font-size: 14px !important
    }
    /deep/ .ivu-table th {
        height: 50px;
    }
    /deep/ .ivu-tooltip-rel > span {
        font-size: 14px !important
    }
    /deep/ .send-btn {
        background: #3DAAFF;
        border: 1px solid #3DAAFF;
        border-radius: 4px;
        width: 200px;
        height: 36px;
        border: none;
        outline: none;
        color: #fff;
    }
    /deep/.ivu-select {
       width: 160px;
       height: 36px;
       border-radius: 18px;
    }
    /deep/ .ivu-input-wrapper{
       width: 480px;
    }
    /deep/.ivu-modal-header{background-color: #ffffff !important;padding: 22px 16px;}
    /deep/.ivu-modal-header-inner{
    font-family: PingFangSC-Regular;
    font-size: 20px !important;
    color: #474C63 !important;
    letter-spacing: 0;
    }
    /deep/ .ivu-modal-close .ivu-icon-ios-close { color:#9397AD !important;font-size: 42px !important;}
    /deep/ .ivu-form-item{margin-bottom: 15px;}
    .btns {
        padding-top: 20px;
        padding-bottom: 20px;
        display: flex;
        justify-content: center;
        .send-btn {
            background: #3DAAFF;
            border: 1px solid #3DAAFF;
            border-radius: 4px;
            width: 200px;
            height: 36px;
            border: none;
            outline: none;
            color: #fff;
        }
    }
    .course-page, .table {
        margin-top: 20px;
    }
    /deep/ .ivu-modal-body {
        padding: 0;
    }
</style>

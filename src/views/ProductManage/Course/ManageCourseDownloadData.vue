<template>
    <div class='manage-course-download-data'>
        <screen @resetPage="resetPage" :types="2" sizeTitle1="资料总数" :sizeNum1="pageTotal" btnName="添加资料" @inputChange="manageEdit"
             placehodle="搜索资料名称"   @handleClick="addClickHandler" :btn-type="btnType"/>
        <data-list class='data-list light-header' @delete='deleteHandler' @download='downloadMsg'
                   @edit='addClickHandler2' :isStripe='false' :table-data='dataList'
                   :header-data='dataHeader' :columnComboData='columnComboData' :comboModelList='comboDataList'
                   :table-height='listHeight'></data-list>
        <page-list :current="current" :total="pageTotal" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
  import BaseList from '../../../components/BaseList'
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {Dialog} from '../../dialogs'
  import {ADD_DOWNLOAD_DATA} from '../../dialogs/types'
  import {doTimeFormat} from '../../../components/Util'
  import {Config} from '../../../config/base'
  import screen from '../../../components/ScreenFrame'
  import pageMixin from '../../mixins/pageMixins'
  import pageList from '../../../components/Page'
  import setAuthMixins from '../setAuthMixins'

  export default {
    mixins: [Dialog, pageMixin, setAuthMixins],
    components: {'data-list': BaseList, screen, pageList},
    data() {
      return {
        searchData: '',
        loadingInstance: null,
        showPopper: false,
        searchResult: {
          code_name: '',
          user_id: 0,
          nickname: '',
          realname: '',
          phone: '',
          use_time: null,
          state: 1
        },
        projectId: 1,
        courseNums: 12
      }
    },
    computed: {
      ...mapState({
        dataList: state => state.download_data.course_download_data_list,
        query_online_course_list: state => state.online_curriculum.online_curriculum_list,
      }),
      pageTotal() {
        return this.$store.state.download_data.total;
      },
      listHeight() {
        return window.innerHeight - 60 - 50 - 70;
      },
      comboDataList() {

      },
      columnComboData() {
        return [this.query_online_course_list];
      },
      dataHeader() {
        let d = [ { text: '编辑', param: 'edit' }, { text: '删除', param: 'delete', }]
        let btnList = this.btnType ? d : []
        return [
          {
            sort: true,
            label: '序号',
            width: 100
          },
          {
            prop: 'title',
            label: '资料名称',
            align: 'left',
            width: 400,
          },
          {
            label: '绑定课程',
            prop: 'curriculum_title',
            width: 300,
            align: 'left'
          },
          {
            label: '操作',
            minwidth: 300,
            groupBtn: [
              {
                text: '下载',
                prop: 'attachment_url',
                param: 'download',
              },
              ...btnList
            ]
          }
        ]
      }
    },
    beforeDestroy(){
      this.addClickHandler = null;
      this.addClickHandler2 = null;
      this.deleteHandler = null;
      this.initData = null;
      this.downloadMsg = null;
      this.searchResult = null;
    },
    methods: {
      ...mapActions(['get_online_curriculum_list', 'get_curriculum_donwload_data_list', 'delete_download_data']),
      addClickHandler() {
        this.handleSelModal(ADD_DOWNLOAD_DATA, {state: 1,project_id: this.projectId, page: {page_size: this.pageSize, page_num: this.current}});
      },
      addClickHandler2(index, row) {
        this.handleSelModal(ADD_DOWNLOAD_DATA, {state: 0,project_id: this.projectId, page: {page_size: this.pageSize, page_num: this.current}, form: row});
      },
      manageEdit(val) {
        this.keyword = val
        this.initData()
      },
      deleteHandler(index, row) {
        this.$config.deleteModal(() => {
            this.delete_download_data(row.id);
        });
      },
      downloadMsg(index, item) {
        this.$config.downloadFlie(item.attachment_url, item.attachment_name)
      },
      initData() {
        this.get_curriculum_donwload_data_list({
          project_id: this.projectId,
          page: {page_size: this.pageSize, page_num: this.current},
          keyword: this.keyword
        });
      }
    },
    mounted() {
      this.initData()
    }
  }
</script>
<style scope lang="less">
    .manage-course-download-data {
        .data-list {
            .base-list-row {
                height: 60px;

                &.invalid-row {
                    background-color: #FBFBFB;
                }
            }
        }
    }

</style>

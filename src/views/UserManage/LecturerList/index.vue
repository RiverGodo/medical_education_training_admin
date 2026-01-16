<template>
    <div class="user-manage-main">
        <SeeModal :show="detailShow" :details="detailData" @close-modal="closeModal2" />
        <FormModal :modal-false="true" :detail-data="tableRow" :uploadFlie=true :show-modal='show' :form-list="formList" :maxFileSize="2"
                   @close="closeModal" @from-submit="handleSubmit" :title="modalTitle" :rule-validate="rules"/>
        <screen @resetPage="resetPage" :btn-type="btnType" :types="1" size-title1="讲师总数" :size-num1="total" btn-name="添加讲师" placehodle="搜索讲师姓名"
                @inputChange="inputChange" @handleClick="handleClick"/>
        <div class="lecturer-list" :style="heights">
            <Row :gutter="20">
                <Col span="6" v-for="(t,i) in list" :key="i">
                    <div class="lecturer-list-item">
                        <img class="lecturer-item-img" :src="t.img_url"/>
                        <div class="lecturer-item-content">
                            <h2>{{t.name}}</h2>
                            <p>绑定课程：{{t.curriculum_count}}个</p>
                        </div>
                        <div class="lecturer-item-btn">
                            <img @click="see(t)" class="lecturer-btn-icon" src="../../../assets/img/see-icon.png"/>
                            <img v-if="lectureesItem2" @click="edit(t)" class="lecturer-btn-icon" src="../../../assets/img/edit-icon.png"/>
                            <img v-if="lectureesItem3" @click="deletes(t)" class="lecturer-btn-icon" src="../../../assets/img/delete-icon.png"/>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
  import screen from '../../../components/ScreenFrame'
  import seeMixin from '../Mixins/seeMixin'
  import FormModal from '../../../components/FormModal.vue'
  import FormModalMixin from '../Mixins/FormModalMixin'
  import postData from 'src/api/postData'
  import UserMixins from '../Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import SeeModal from "./see-modal.vue";

  export default {
    name: "LecturerList",
    components: {FormModal, screen, pageList, SeeModal},
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
    props: {
      permissionItem5: {
        type: Object,
        default: null
      }
    },
    watch: {
      permissionItem5(_new) {
        this.handleAuth(_new)
      }
    },
    computed:{
      heights(){
        return window.innerHeight < 720 ? {height:`${window.innerHeight - 180}px`} : {}
      }
    },
    data() {
      return {
        modalTitle: '',
        tableRow: {},
        tableRowData: {},
        detailShow: false,
        detailData: {},
        lectureesItem2: false,
        lectureesItem3: false,
        keyword: '',
        formList: [
          {type: 'input', name: '讲师姓名', field: 'name'},
          {
            type: 'select', name: '所属机构', field: 'organization_id',
            selectList: [], selectField: ['id', 'title']
          },
          {type: 'textarea', name: '讲师介绍', field: 'description'}
        ],
        rules: {
          name: [{required: true, message: '请输入讲师姓名', trigger: 'blur'}],
          description: [{required: true, message: '请输入讲师介绍', trigger: 'blur'}],
          organization_id: [{required: true, message: '请选择所属机构'}],
        },
        operationList: null,
        list: []
      }
    },
    methods: {
      see(t){
        this.detailShow = true;
        this.detailData = t
      },
      closeModal2(){
        this.detailShow = false;
      },
      edit(t) {
        this.modalTitle = '编辑讲师'
        this.show = true
        this.tableRow = t
        this.setOrganization()
      },
      deletes(t) {
        this.$config.deleteModal(() => {
            postData('user/removeTeacher', {id: t.id}).then((res) => { this.getList() })
        })
      },
      inputChange(val) {
        this.keyword = val;
        this.getList()
      },
      setOrganization() {
        if (this.organizationList) {
          if (this.role_id == 1) {
            this.getOrganization()
            this.$nextTick(() => {
              this.formList[1].selectList = this.organizationList
            })
          } else if (this.formList[1].field == 'organization_id') this.formList.splice(1, 1);
        }
      },
      handleClick() {
        this.modalTitle = '添加讲师'
        this.show = true
        this.tableRow = {}
        this.setOrganization()
      },
      handleSubmit(val) {
        let d = val
        if (this.role_id != 1) d.organization_id = +sessionStorage.getItem('organizationId')
        if (this.modalTitle === '添加讲师') this.fromAddAndEdit('user/addTeacher', d)
        else this.fromAddAndEdit('user/modifyTeacher', d)
      },
      getList() {
        let d = {
          keyword: this.keyword,
          page_size: this.pageSize,
          page_num: this.current
        }
        postData('user/getTeacherList', d).then((res) => {
          this.list = res.data.list
          this.total = res.data.count
        })
      }
    },
    mounted() {
      this.getList()
      if (this.permissionItem5) this.handleAuth(this.permissionItem5)
      this.organizationList = null
      if (this.role_id == 1) this.getOrganization()
    }
  }
</script>
<style lang="less" scoped>
    .lecturer-list-item {
        background: #FFFFFF;
        border: 1px solid #F0F0F7;
        border-radius: 8px;
        height: 110px;
        padding-left: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        position: relative;
        width: 100%;
        .lecturer-item-img {
            width: 59px;
            height: 60px;
            border-radius: 30px;
        }
        .lecturer-item-content {
            margin-left: 15.5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: calc(100% - 120px);
            h2, p {
                text-align: left;
                color: #474C63;
            }
            h2 {
                font-family: PingFangSC-Medium;
                font-size: 18px;
                margin-bottom: 15px;
                width: 98%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            p {
                font-family: PingFangSC-Regular;
                font-size: 14px;
            }
        }
        .lecturer-item-btn {
            position: absolute;
            right: 0;
            width: 35px;
            height: 108px;
            background-color: #fff;
            // background: #9397AD;
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            display: none;
            .lecturer-btn-icon {
                margin-top: 11px;
            }
            img {
                width: 18px;
                height: 18px;
            }
        }
    }
    .lecturer-list-item:hover .lecturer-item-btn {
        display: block;
    }
    .lecturer-list {
        overflow: hidden;
        overflow-y: auto;
        padding: 20px;
    }
    /deep/ .ivu-col-span-6 {
        margin-bottom: 20px;
    }
</style>

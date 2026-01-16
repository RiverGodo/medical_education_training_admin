<template>
    <Modal :transfer=false :title="payload.type == 1 ? '批阅作业' : '查看批阅'" :footer-hide="true"
           v-model="addCourseDialogVisible" @on-cancel="handleRemoveModal(remove)" size="auto" width="654"
           :mask-closable="false" >
        <base-input  @closedialog="handleClose">
            <Row  slot="body">
                <Row class="body-top" v-if="payload.type==1">
                    <Form  class="add-course-form" :label-position="labelPosition" :label-width="100">
                        <Col class="head-form">
                            <img :src="studata.stuimg" alt="">
                            <p>{{payload.row.realname}}</p>
                        </Col>
                        <Col class="body-form">
                            <p>{{payload.row.answer}}</p>
                            <down-loading :formData="downList"/>
                        </Col>
                        <Col class="input-form">
                            <Input v-model="readInput" type="textarea" size="small" placeholder="请输入批阅内容"/>
                        </Col>
                        <FormItem class="number-from" label="评分" :label-width="40">
                            <InputNumber v-model="numInput" style="width:150px" :max="100" :min="0"  placeholder="满分100分"></InputNumber>
                        </FormItem>
                        <Button type="primary" class="save-from" @click="saveSubmit">保存</Button>
                    </Form>
                </Row>
                <Row class="body-top" v-if="payload.type==2">
                    <Form class="add-course-form" :label-position="labelPosition" :label-width="100">
                        <Col class="head-form">
                            <img :src="studata.stuimg" alt="">
                            <p>{{payload.row.realname}}</p>
                        </Col>
                        <Col class="body-form">
                            <p>{{payload.row.answer}}</p>
                            <down-loading :formData="downList"/>
                        </Col>
                        <Col class="show-from" v-for="(item, index) in studata.teacherTail" :key="index">
                            <Row class="show-from-line1">
                                <p class="tail-title">导师评语：</p>
                                <p class="tail-number">{{item.score}}分</p>
                            </Row>
                            <Row class="show-from-line2">
                                <p class="tail-detail">{{item.comment}}</p>
                            </Row>
                            <Row class="show-from-line3">
                                <p class="tail-time">{{item.update_time}}</p>
                            </Row>
                        </Col>
                    </Form>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
  import BaseInput from '../../components/BaseInput'
  import {RemoveModal} from './mixins'
  import UploadPanel from '../../components/UploadPanel'
  import { mapActions, mapState } from 'vuex';
  import { cleanHtmlLabel } from '../../components/Util'
  import { Config } from '../../config/base'
  import { doTimeFormat } from '../../components/Util'
  import { MPop } from '../../components/MessagePop'
  import downLoading from '../../components/DownLoading'
  import postData from '../../api/postData'

  export default {
    mixins: [RemoveModal, MPop],
    props: {
      remove: {type: String},
      payload: {}
    },
    data() {
      return {
        readInput: '',
        numInput: null,
        addCourseDialogVisible: true,
        videoManageDialog: true,
        downList: [],
        form: {
          title: '',
          teacher_id: '',
          start_time: new Date(),
          end_time: new Date(),
          subject_id: 0,
          grade_id: 0,
          state: 0,
          img_default: '',
          img_3_8: '',
          img_url_arr: null,
          description: '',
          orderby: 0,
          curriculum_roles: [0],
          pre_curriculum_ids: [],
          data_center_id: 0,
        },
        newData: {
          show: false,
          name: '',
          download_url: '',
          type: 1,
          project_id: 1
        },
        dialogIndex: 1,
        labelPosition: 'left',
        panelOptions: {
          panelHeight: 158
        },
        value3: [],
        unchecked_top_courses: [],
        checked_top_courses: [],
        top_course_list: [],
        loadingInstance: null,
        // type: 1 -- 图片， 2 -- 视频
        uploadConfig: {
          bucket: 'jhyl-static-file',
          dir: 'user_task',
          type: 1
        },
        resourse1: '',
        resourse2: '',
        studata:{}
      }
    },
    mounted() {
      this.$store.commit('get_task_state', false)
      postData('product/homework/mark_get_list',{
            student_homework_id: this.payload.row.id
        }).then(res => {
            this.studata.teacherTail = res.data
        })
        this.downList = JSON.parse(this.payload.row.attachment_url)
        this.downList.forEach(item => {
          item.name = item.attachment_name
          item.url = item.attachment_url
        })
    },
    computed: {
      ...mapState({
        query_state_list: state => state.online_curriculum.stateList,
        query_teacher_list: state => state.teacher.teacher_list,
        query_online_course_list: state => state.online_curriculum.online_curriculum_list,
        result_msg1: state => state.offline_curriculum.result_msg,
        curriculum_data_list: state => state.download_data.course_download_data_list
      }),
      dataFilters() {
        var str = ['doc', 'pdf', 'zip'];
        return str;
      },
      query_replace_online_course_list() {
        this.query_online_course_list.map((item, index) => {
          item._index = index < 9 ? '0' + (index + 1) : '' + ( index + 1 )
        });
        return this.query_online_course_list
      },
      selectDateRange: {
        get: function () {
          return [this.form.start_time, this.form.end_time];
        },
        set: function (newVal) {
          this.form.start_time = newVal[0];
          this.form.end_time = newVal[1];
        }
      }
    },
    components: {
      'base-input': BaseInput,
      'upload-panel': UploadPanel,
      'down-loading': downLoading
    },
    methods: {
      ...mapActions([
        'get_role_list',
        'get_online_curriculum_list',
        'edit_online_curriculum',
        'add_course_download_data',
        'get_curriculum_donwload_data_list'
      ]),
        saveSubmit(){
            postData('product/homework/mark_add',{
              student_homework_id: this.payload.row.id,
              score: this.numInput,
              comment: this.readInput,
          }).then(res => {
              if(res.res_code == 1) {
                this.addCourseDialogVisible = false
                // this.$emit('addTure', res.res_code)
                this.$store.commit('get_task_state', true)
                this.$Message.info('批阅成功');
              }
          })
        },
      getDir() {
        return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
      },
      selectCurriculumData(id) {
        this.form.data_center_id = id;
        this.cancelAddData();
      },
      cancelAddData() {
        this.newData.show = false;
      },
      saveData() {
        var vm = this;
        this.newData._fn = function (id) {
          vm.selectCurriculumData(id);
        }
        this.add_course_download_data(this.newData)
      },
      uploadComplete(id, result) {
        this.newData.download_url = result.url;
      },
      handleClose() {
        this.addCourseDialogVisible = false;
      },
      handleRemove(file, fileList) {},
      handlePreview(file) {},
      CheckedMap(d) {
        let d2 = []
        this.query_replace_online_course_list.map((it) => {
          d.map((t) => {
            if (it._index == t) d2.push(it)
          })
        })
        return d2
      },
      handleCheckedCitiesChange(value) {
        this.top_course_list = this.CheckedMap(value)
        this.checked_top_courses = value
        // this.$forceUpdate()
      },
      handleUnCheckedCitiesChange(value) {
        // this.top_course_list = value;
        this.top_course_list = this.CheckedMap(value)
        //取消已制定状态
        // this.unchecked_top_courses = _.difference(this.query_replace_online_course_list, value);
        //取消未指定选定状态
        this.unchecked_top_courses = value
        //取消全选状态
        // this.checkAll = [];
      },
      handleCheckAllChange(event) {
        // this.checked_top_courses = event.target.checked ? this.top_course_list : [];
      },
      handleClearTop() {
        this.top_course_list = _.difference(this.top_course_list, this.checked_top_courses);
        //取消已制定状态
        this.checked_top_courses = [];
        //取消未指定选定状态
        this.unchecked_top_courses = [];
        //取消全选状态
        this.checkAll = [];
      },
      handleDefaultUploadComplete(url) {
        this.form.img_default = url;
      },
      handle38UploadComplete(url) {
        this.form.img_3_8 = url;
      }
    }
  }
</script>
<style scoped lang="less">
/deep/.ivu-modal-header{background-color: #ffffff !important;padding: 22px 16px;}
/deep/.ivu-modal-header-inner{
font-family: PingFangSC-Regular;
font-size: 20px !important;
color: #474C63 !important;
letter-spacing: 0;
}
/deep/ .ivu-modal-close .ivu-icon-ios-close { color:#9397AD !important;font-size: 42px !important;}
/deep/ .ivu-form-item{margin-bottom: 15px;}
/deeep/.upload-panel .upload-space{
  height: 250px !important;
}
/deep/ textarea.ivu-input{
    min-height: 200px !important;
    border-radius: 4px !important;
}
/deep/ .ivu-form-item-content{
    position: relative;
    line-height: 32px;
    font-size: 14px;
    float: left;
    margin-left: 0px !important;
}
    .btns {
        text-align: center;

        .next-btn {
            width: 200px;
        }
    }
    .upload-field {
        border: none;

        /deep/ .file-name-field {
            margin-bottom: 10px;
        }
    }
    .course-list {
        height: 640px;
        overflow-y: auto;
        text-align: left;
    }
    .course-item {
        display: flex;
        flex-direction: column;
    }
    .course-option {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        line-height: 28px;
    }
    .btns {
        margin-top: 30px;
        position: relative;
    }
    .pre-btn {
        position: absolute;
        left: 0;
    }
    .public-btn {
        width: 170px;
    }
    .head-form{
        display: flex;
        padding-left: 15px;
        padding-bottom: 20px;
        p{
            line-height: 49px;
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474C63;
            letter-spacing: 0;
            padding-left: 15px;
        }
        img{
            width: 49px;
            height: 49px;
            border-radius: 50%;
        }
    }
    .body-form{
        // width: 594px;
        /*height: 147px;*/
        background: #F0F0F7;
        border-radius: 4px;
        margin: 0 auto;
        padding: 20px;
        p{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
            line-height: 28px;
            padding-bottom: 11px;
            text-align: left;
        }
        .download-from{
            width: 350px;
            height: 40px;
            background: #FFFFFF;
            border: 1px solid #C8CCDD;
            border-radius: 4px;
            .file-icon{
                float: left;
                padding-top: 10px;
                padding-left: 21px;
            }
            .download-icon{
                float: right;
                padding-top: 10px;
                padding-right: 21px;
            }
            a{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #474C63;
                letter-spacing: 0;
                padding-top: 10px;
                float: left;
                padding-left: 15px;
            }
        }
    }
    .input-form{
        padding-top: 30px;
    }
    .number-from{
        padding-top: 21px;
    }
    .add-course-form{
        padding-left: 30px;
        padding-right: 30px;
    }
    .save-from{
        background: #4098FF;
        border-radius: 4px;
        width: 200px;
        margin: 0 auto;
        margin-top: 30px;
        margin-bottom: 40px;
    }
    .tail-title{
        float: left;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }
    .tail-number{
        float: right;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #F54802;
        letter-spacing: 0;
    }
    .tail-detail{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        text-align: left;
    }
    .tail-time{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9397AD;
        letter-spacing: 0;
        text-align: left;
    }
    .show-from{
        padding: 30px;
        border-bottom: 1px solid #E4E7F5;
        .show-from-line2{
            padding-top: 15px;
            padding-bottom: 10px;
        }
    }
</style>

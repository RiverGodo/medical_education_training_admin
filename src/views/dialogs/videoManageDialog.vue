<template>
    <Modal :transfer=false v-model="videoManageDialog" @on-cancel="handleRemoveModal(remove)" size="auto"
           :mask-closable="false" :footer-hide="true" width="600" :title="video_edit?'编辑视频':'添加视频'">
        <div style="position: relative;">
        <base-input :baseInputWidth="560" @closedialog="handleClose">
            <Row slot="body">
                <Form ref="form" :model="form" :label-width="80" :rules="ruleValidate">
                    <FormItem label="小节名称" prop="group_name">
                        <Input v-model="form.group_name" placeholder="请输入小节名称"></Input>
                    </FormItem>
                    <!--<FormItem label="视频时长（分）">-->
                        <!--<Input v-model="form.duration" placeholder="请输入视频时长"></Input>-->
                    <!--</FormItem>-->
                    <FormItem label="上传视频" class="upload-form" required>
                        <upload-panel :resourse='form.video_url' @uploadcomplete='uploadCompleteHandler' @vedioTime="vedioTime"
                               @deleteVideo="deleteVideo" @open-load="openLoad"  isType="video"  :upload-config='uploaderConfig' :maxFileSize="1000" types="video/mp4">
                            <span slot="file-require">只能上传 MP4 文件，且不超过1000M，视频自动转码三种清晰度，转码预计30分钟，请稍候查看</span>
                        </upload-panel>
                    </FormItem>
                    <FormItem v-if="payload.video_id" label="视频展示" class="video-form">
                           <Tabs value="name1">
                              <TabPane label="1280P" name="name1">
                                <video style="width:480px" controls :src="'https://vfile.9mededu.com/met_video/1280P/'+realFileName"></video>
                              </TabPane>
                              <TabPane label="720P" name="name2">
                                <video style="width:480px" controls :src="'https://vfile.9mededu.com/met_video/720P/'+realFileName"></video>
                              </TabPane>
                              <TabPane label="480P" name="name3">
                                <video style="width:480px" controls :src="'https://vfile.9mededu.com/met_video/480P/'+realFileName"></video>
                              </TabPane>
                          </Tabs>
                    </FormItem>
                    <FormItem label="解锁条件">
                    <Row>
                        <Checkbox v-model="timeUnlockState" @on-change="changeUnlockState">时间解锁</Checkbox>
                    </Row>
                    <Row v-if="timeUnlockState">
                        <Col span="5">选择解锁时间</Col>
                        <Col span="19">
                            <DatePicker
                                :value="form.unlock_time"
                                @on-change="handleChangeUnlockTime"
                                format="yyyy-MM-dd HH:mm"
                                type="datetime"
                                placeholder="请选择解锁时间"
                                style="width: 200px"
                            />
                        </Col>
                    </Row>
                </FormItem>
                    <div class="btns">
                        <Button type="primary" class="sub-btn" @click="handleSubmit">发布</Button>
                    </div>
                </Form>
            </Row>
        </base-input>
          <div class="load-container" v-if="videoShow">
            <div class="loadSpinner">
              <Icon type="ios-loading" size=24 class="loadingIcon demo-spin-icon-load"></Icon>
              <p class="loadText">{{videoMsg}}</p>
            </div>
          </div>
        </div>
    </Modal>
</template>

<script>
  import LoadingPane from '../../components/loading'
  import BaseInput from '../../components/BaseInput'
  import UploadButton from '../../components/UploadButton'
  import {RemoveModal} from './mixins'
  import UploadPanel from '../../components/UploadPanel'
  import {get_list} from '../../api/modules/tools_curriculum'
  import {get_catalog} from '../../api/modules/tools_curriculum_catalog'
  import {doSortFormatCatalogList} from '../../components/Util'
  import {Config} from '../../config/base'
  import {MPop} from '../../components/MessagePop'
  export default {
    mixins: [RemoveModal, MPop],
    props: {
      remove: {type: String},
      payload: {}
    },
    components: {
      'base-input': BaseInput,
      'upload-button': UploadButton,
      'upload-panel': UploadPanel,
      'loading-panes': LoadingPane,
    },
    data() {
      return {
        videoMsg: '',
        videoShow: false,
        videoManageDialog: true,
        timeUnlockState:false, // 时间解锁状态
        form: {
          video_id: 0,
          title: '',
          duration: '',
          video_roles: [0],
          dir: null,
          filename: null,
          video_url: null,
          format: null,
          curriculum_id: '',
          group_orderby: 0,
          group_name: '',
          orderby: 0,
          _fn: null,
          unlock_time:'', // 解锁时间
          unlock_type:0 // 解锁类型
        },
        projectId: 0,
        curriculumList: [],
        realFileName:'',
        uploaderConfig: {
          bucket: 'jhyl-static-file',
          dir: 'met_video/origin',
          time: true,
          type: 2
        },
        selectedVideo: null,
        video_edit: false,
        loading: null,
        ruleValidate: {
          group_name: [{required: true, message: '请输入小节名称', trigger: 'blur'}]
        }
      }
    },
    watch: {
      projectId(val) {

      }
    },
    methods: {
      changeVideoSelect(item) {
        var i, j;
        if (item.isSelected)
          this.selectedVideo = item;
        else
          this.selectedVideo = null;
        for (i = 0; i < this.curriculumList.length; i++) {
          for (j = 0; j < this.curriculumList[i].chapterList.length; j++) {
            if (item.video_id !== this.curriculumList[i].chapterList[j].video_id)
              this.curriculumList[i].chapterList[j].isSelected = false;
          }
        }
      },
      toggleCurriculum(index) {
        if (!index) return;
        var item = this.curriculumList[index];
        var i, j;
        for (i = 0; i < this.curriculumList.length; i++) {
          if (this.curriculumList[i].chapterList) {
            for (j = 0; j < this.curriculumList[i].chapterList.length; j++) {
              this.curriculumList[i].chapterList[j].isSelected = false;
            }
          }
        }
        if (item.chapterList.length === 0) {
          this.loading = this.$LoadingY({message: "加载中，请稍后", show: true})
          setTimeout(() => {
            this.loading.close();
          }, Config.base_timeout);
          get_catalog(item.curriculum_id).then(res => {
            if (res.data.res_code === 1) {
              var catalogList = doSortFormatCatalogList(res.data.msg);
              for (i = 0; i < catalogList.length; i++) {
                for (j = 0; j < catalogList[i].classList.length; j++) {
                  catalogList[i].classList[j].chapterIndex = i;
                  catalogList[i].classList[j].orderIndex = j;
                  catalogList[i].classList[j].isSelected = false;
                }
                item.chapterList = item.chapterList.concat(catalogList[i].classList);
              }
              if (this.loading) this.loading.close();
            }
          })
        }
      },
      handleClose() {
        this.videoManageDialog = false;
      },
      send(){
        this.form._fn =  () =>{
          $OnLine.$emit('OnLine',this.payload.i)
          this.handleClose();
          this.showPop('保存成功！', 1000);
        }
        let d = this.form.duration
        this.form.duration = +(parseFloat(d)).toFixed(2)
        if(this.form.filename) this.form.video_url = "http://vfile.9mededu.com/met_video/480P/" + this.form.filename
        if (this.payload.video_id) {
          this.form.curriculum_online_id = this.payload.curriculum_online_id
          this.$store.dispatch('edit_online_curriculum_video', this.form);
          // this.handleRemoveModal(this.remove)
        } else {
          this.form.parent_id = this.payload.parent_id
          this.form.curriculum_online_id = this.payload.curriculum_online_id
          // this.form.parent_id = this.payload
          this.$store.dispatch('add_online_curriculum_video', this.form);
          this.handleRemoveModal(this.remove)
        }
      },
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if(valid) {
            if(this.form.video_url&&this.form.duration){

                // 检测解锁时间
                if(this.form.unlock_type === 1){
                  if(new Date().getTime() > new Date(this.form.unlock_time).getTime()){
                    this.$Message.error("解锁时间不得早于当前时间")
                    return
                  }
                }
                this.send()
            }else{
              this.$Message.info('请上传视频')
            }
          }
        })
      },
      deleteVideo(){
        this.form.video_url = ''
        this.form.filename = ''
      },
      uploadCompleteHandler(url) {
        this.form.video_url = url;
        var l = url.split('/');
        this.form.filename = l[l.length - 1];
        this.form.dir = this.uploaderConfig.dir;
        this.form.format = 720;
      },
      vedioTime(val) {
        this.form.duration = val
      },
      openLoad(d){
          this.videoShow = d.show
          this.videoMsg = d.message
      },
      // 改变时间解锁状态
      changeUnlockState(val){
          this.form.unlock_type = val ? 1 : 0
      },
      // 改变解锁时间
      handleChangeUnlockTime(val){
          this.form.unlock_time = val;
      }
    },
    mounted() {
      this.form.curriculum_id = this.payload.curriculum_id;
      this.form.group_orderby = this.payload.group_orderby;
      this.form.orderby = this.payload.orderby;
      // 时间解锁
      this.form.unlock_type = this.payload.unlock_type || 0
      this.form.unlock_time = this.payload.unlock_time
      this.timeUnlockState = this.payload.unlock_type === 1 ? true : false
      
      if(this.payload.hasOwnProperty('video_edit')&&this.payload.video_edit){
       this.$nextTick(() => {
        this.form = this.payload
        let dss = this.form.video_url.split('/')
        this.realFileName = dss[dss.length-1]
        this.video_edit = true
       })
      }
    }
  }
</script>
<style scoped lang="less">
  @import './upload-progress.less';
  /deep/ .upload-panel .img img { width: 160px;height: 148px; }
    .btns{
        display: flex;
        justify-content: center;
    }
    .sub-btn {
        width: 170px;
        margin-bottom: 10px;
    }
    #video-manage-container {
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .close-dialog-panel {
            position: absolute;
            top: 10px;
            right: 13.5px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;

            &:before {
                // color: #fff;
                color: #757575;
            }
        }
    }
    /deep/ .ivu-modal-close .ivu-icon-ios-close, /deep/ .ivu-modal-close .ivu-icon-ios-close:hover {
        color: #999 !important;
    }
</style>

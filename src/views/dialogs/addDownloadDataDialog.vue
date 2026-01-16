<template>
<Modal :transfer=false :title="payload.state === 0?'编辑资料':'添加资料'" v-model="addDownloadDataDialog" @on-cancel="handleRemoveModal(remove)" :mask-closable="false"
       :footer-hide="true" :styles="{top: '17.3%'}" width="645">
    <div style="position: relative;">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top" v-if="true">
                    <Form ref="formData" :model="form" :rules="rules" :label-width="80" class="add-teacher-form">
                        <FormItem label="资料名称" prop="name">
                            <Input v-model="form.name" placeholder="请输入资料名称"></Input>
                    </FormItem>
                        <FormItem label="资料类型" prop="type">
                            <Select v-model="form.type" placeholder="请选择资料类型" @on-change="typeChange" :disabled="payload.state === 0 ? true : false">
                                <Option v-for="item in typeList" :key="item.state" :label="item.title" :value="item.state"></Option>
                            </Select>
                        </FormItem>
                    <FormItem label="绑定课程" prop="item_id" >
                            <Select v-model="form.item_id" placeholder="请选择绑定课程" :disabled="payload.state === 0 ? true : false">
                                <Option v-for="item in curricumList" :key="item.id" :label="item.title" :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="上传附件" v-if="isupdata" required>
                                <upload-btn @open-load="openLoad" :isShowProgress="true" bucket="jhyl-static-file" @uploadcomplete="uploadComplete" type="doc/pdf/zip" :maxFileSize="300"/>
                            <span class="font-hint">* 附件可上传任意格式，附件大小不超过300M</span>
                        </FormItem>
                    <FormItem  label="上传附件" required v-else>
                        <div style="display:flex">
                            <p style="text-align:left">{{this.form.url_name}}</p>
                            <!--<Button style="margin:0 auto" type="error" @click="delUrl">删除</Button>-->
                            <Icon style="margin-left:60px;" size="24" color="#ff5c33" type="ios-trash-outline"  @click="delUrl"/>
                        </div>
                    </FormItem>
                        <FormItem class="btn-content" :label-width='0'>
                            <Button type="primary" class="sub-btn" @click="saveHandler('formData')">完成</Button>
                    </FormItem>
                    </Form>
                </Row>
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
import BaseInput from '../../components/BaseInput'
import { RemoveModal } from './mixins'
import uploadPanel from '../../components/UploadPanel'
import { doTimeFormat } from '../../components/Util'
import { mapState, mapActions } from 'vuex'
import { MPop } from '../../components/MessagePop'
import UploadImgs  from '../../components/UploadButton'
import UploadBtn from '../../components/UploadButton'
import postData from '../../api/postData'

export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    components: {
        'base-input': BaseInput,
        uploadPanel,
        UploadImgs,
        'upload-btn': UploadBtn
    },
    computed:{
         ...mapState({
            course_download_data_list: state => state.download_data,
            }),
        dataFilters(){
            var str = ['doc','pdf','zip'];
            return str;
        },
    },
    data() {
        return {
            videoMsg: '',
            videoShow: false,
            addDownloadDataDialog: true,
            curricumList: [],
            form: {
                name:'',
                item_id:null,
                grade_id: null,
                download_url:'',
                url_name:'',
                type:0
            },
            loadingInstance: null,
            isupdata:true,
            rules: {
                name: { required: true, message: '请输入资料名称', trigger: 'blur'},
                item_id: { required: true, message: '请选择绑定课程'},
                type: {required: true, message: '请选择资料类型'}
            },
            typeList: [
              {state: 'online', title: '线上资料'},
              {state: 'underline', title: '线下资料'},
            ],
            canRun: true
        }
    },
    methods: {
        ...mapActions([ 'add_course_download_data',  'get_curriculum_donwload_data_list']),
        getDir() {
            if(this.payload.state === 0) return 'datacenter/public/' + doTimeFormat(new Date().toString());
            return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
         },
        uploadComplete(val) {
            if (val.url) {
                this.form.download_url = val.url;
                this.form.url_name = val.name
                this.isupdata = false
            }
        },
        openLoad(d){
            this.videoShow = d.show
            this.videoMsg = d.message
        },
        handleSubmit(){
            this.form._fn = () => {
                this.addDownloadDataDialog = false
                 this.$Message.success('添加成功');
            }
            if(this.payload.state === 0) {
             postData('product/data/change', {
               data_id: this.form.id,
               title: this.form.name,
               item_id: this.form.item_id,
               attachment_url: this.form.download_url,
               attachment_name: this.form.url_name,
               type: this.form.type
             }).then(res => {
                 if(res.res_code == 1){
                    this.get_curriculum_donwload_data_list({
                        project_id: this.payload.projectId,
                        page: this.payload.page
                    })
                    this.addDownloadDataDialog = false
                 }
             })
           }else {
                this.form.project_id = this.payload.projectId
                this.form.page = this.payload.page
                this.add_course_download_data(this.form);
           }
        },
        saveHandler(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.form.url_name) {
                        if(this.canRun) {
                            this.canRun = false
                            this.handleSubmit()
                            setTimeout(() => {
                                this.canRun = true
                            },500)
                        }
                        // this.handleSubmit()
                    }
                    else  this.$Message.warning('请上传附件');
                }
            })
        },
        handleClose() {
            this.addDownloadDataDialog = false;
        },
        delUrl(){
            this.form.download_url = '';
            this.form.url_name = '';
            this.isupdata = true;
        },
        typeChange(val){
            if(val == 'online') {
              postData('product/curriculum_online/pulldown_get_list',{product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id}).then((res) => {
                if(res.res_code == 1) this.curricumList = res.data
              })
            }else{
              postData('product/curriculum_online/pulldown_get_offline_list',{product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id}).then((res) => {
                if(res.res_code == 1) this.curricumList = res.data
              })
            }
        }
    },
    mounted() {
        var vm = this;
        this.form._fn = function() {
            vm.handleClose();
            vm.showPop('添加成功！',1000);
        };
        if(this.form.state === 0){
            this.form.grade_id = 0;
            this.form.item_id = 0;
        }
        if(this.payload.state == 0) {
          this.typeChange(this.payload.form.type)
          this.form.item_id = this.payload.form.item_id
          this.form.curriculum_id = this.payload.form.curriculum_id
          this.form.name = this.payload.form.title
          this.form.id = this.payload.form.id
          this.form.type = this.payload.form.type
          if(this.payload.form.attachment_url){
            this.form.download_url = this.payload.form.attachment_url;
            this.form.url_name = this.payload.form.attachment_name
            this.isupdata = false
          }
        }
    }
}
</script>
<style lang="less" scoped>
    @import './upload-progress.less';
    #add-download-data-container {
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .close-dialog-panel {
            position: absolute;
            top: -70px;
            right: -13.5px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;
            &:before {
                // color: #fff;
                color: #757575;
            }
        }
    }
    .btn-content{
        text-align: center;
        display: flex;
        justify-content: center;
    }
    .sub-btn{
        width: 170px;
    }
    /deep/ .ivu-modal-body{
        padding: 40px 50px;
    }
    .font-hint{
        color: #F54802;
        width: 100%;
        text-align: left;
        float: left;
        margin-top: 10px;
        font-size: 12px;
    }
</style>

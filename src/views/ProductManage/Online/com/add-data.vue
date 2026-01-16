<template>
<Modal :transfer=false :title="isEdit ? '编辑资料' : '添加资料'" v-model="show" @on-cancel="handleClose" :mask-closable="false"
       :footer-hide="true" :styles="{top: '17.3%'}" width="645">
    <Row>
        <Row class="body-top" v-if="true">
            <Form ref="formData" :model="form" :rules="rules" :label-width="80" class="add-teacher-form">
                <FormItem label="资料名称" prop="name">
                    <Input :maxlength="15" show-word-limit v-model="form.name" placeholder="请输入资料名称"></Input>
                </FormItem>
                <FormItem label="上传附件" v-if="isupdata" required>
                        <upload-btn bucket="jhyl-static-file" @uploadcomplete="uploadComplete" type="doc/pdf/zip" :maxFileSize="300"/>
                    <span class="font-hint">* 附件可上传任意格式，附件大小不超过300M</span>
                </FormItem>
                <FormItem  label="上传附件" required v-else>
                    <div style="display:flex">
                        <p class="file-texts">{{form.url_name}}</p>
                        <Icon style="margin-left:60px;" size="24" color="#ff5c33" type="ios-trash-outline"  @click="delUrl"/>
                    </div>
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
                <FormItem class="btn-content" :label-width='0'>
                    <Button type="primary" class="sub-btn" @click="saveHandler('formData')">发布</Button>
                </FormItem>
            </Form>
        </Row>
    </Row>
</Modal>
</template>
<script>
import UploadBtn from '../../../../components/UploadButton'
import postData from '../../../../api/postData'

export default {
    props: {
        isShow: {},
        payload: {},
        isEdit: {}
    },
    components: { 'upload-btn': UploadBtn },
    computed:{
        dataFilters(){
            var str = ['doc','pdf','zip'];
            return str;
        },
    },
    watch: {
        isShow(_new){
            this.show = _new
            this.setInit()
        }
    },
    data() {
        return {
            show: false,
            curricumList: [],
            form: {
                name:'',
                download_url:'',
                url_name:'',
                unlock_time:'',
                unlock_type:0
            },
            loadingInstance: null,
            isupdata:true,
            rules: {
                name: { required: true, message: '请输入资料名称'},
            },
            timeUnlockState:false, // 时间解锁状态
        }
    },
    methods: {
        uploadComplete(val) {
            if (val.url) {
                this.form.download_url = val.url;
                this.form.url_name = val.name
                this.isupdata = false
            }
        },
        handleSubmit(){
            const url = this.isEdit ? 'curriculum_online_catalog/update_data' : 'curriculum_online_catalog/add_data'
            let d = {
                group_name: this.form.name,
                attachment_name: this.form.url_name,
                attachment_url: this.form.download_url,
                unlock_time: this.form.unlock_time,
                unlock_type: this.form.unlock_type,
            }
            let da = {}
            if(this.isEdit){
                da = {
                    ...d,
                    id: this.payload.id,
                    related_id: this.payload.related_id,
                }
            }else{
                da = {
                    ...d,
                    online_catalog_id: this.payload.id,
                    group_orderby: this.payload.id,
                    curriculum_id: this.payload.curriculum_id,
                }
            }
            if(this.form.unlock_type === 1){
              if(new Date().getTime() > new Date(this.form.unlock_time).getTime()){
                this.$Message.error("解锁时间不得早于当前时间")
                return
              }
            }
            PostData(url, da).then(r => {
                console.log(r,'rrr');
                if(r.res_code == 1) {
                    this.handleClose()
                    this.$emit('add-data-success')
                }
            })
        },
        saveHandler(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.form.download_url) this.handleSubmit()
                    else this.$Message.warning('请上传附件');
                }
            })
        },
        handleClose() {
            console.log("关闭")
            this.form = {
                name:'',
                download_url:'',
                url_name:'',
                unlock_time:'',
                unlock_type:0
            }
            this.isupdata = true
            this.$refs.formData.resetFields()
            this.show = false
            this.$emit('data-cancel')
        },
        delUrl(){
            this.form.download_url = '';
            this.form.url_name = '';
            this.isupdata = true;
        },
        setInit(){
            if(this.isEdit) {
                this.form = {
                    name: this.payload.group_name,
                    download_url: this.payload.attachment_url,
                    url_name: this.payload.attachment_name,
                    unlock_type: this.payload.unlock_type,
                    unlock_time: this.payload.unlock_time,
                }
                this.timeUnlockState = this.payload.unlock_type === 1 ? true : false
                if(this.payload.attachment_url) this.isupdata = false
            }else{
                this.timeUnlockState = false
                this.isupdata = true
                this.form = {
                    name:'',
                    download_url:'',
                    url_name:'',
                    unlock_time:'',
                    unlock_type:0
                }
            }
        },
        // 改变时间解锁状态
        changeUnlockState(val){
            this.form.unlock_type = val ? 1 : 0
        },
        // 改变解锁时间
        handleChangeUnlockTime(val){
            this.form.unlock_time = val;
        }
    }
}
</script>
<style lang="less" scoped>
    .file-texts{
        text-align: left;
        line-height: 24px;
        white-space: pre-wrap;
        flex: 1;
        overflow: hidden;
        word-break: break-all;
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
        font-size: 14px;
    }
</style>

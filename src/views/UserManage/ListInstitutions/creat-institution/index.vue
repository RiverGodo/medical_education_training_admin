<template>
    <div style="height: 100%;">
        <screen :types="7" title="创建机构" @handleBack="handleBack" style="background-color:#fff;"/>
        <div class="box">
            <div class="box-title">用户管理 > 机构列表 > 创建机构</div>
            <div class="content">
                <div style="display: flex; justify-content: center">
                    <div class="content-title" v-for="(item, index) in stepList" :key="index">
                        <div class="title-num" :style="{backgroundColor: step == index + 1 ? '#4098FF' : '#fff', borderColor: step > index ? '#4098FF' : '#C0C4DA'}">
                            <span v-if="step <= index + 1" :style="{color: step == index + 1 ? '#fff' : '#C0C4DA'}">{{index + 1}}</span>
                            <Icon v-else type="md-checkmark" color="#4098ff"/>
                        </div>
                        <div class="title-word">{{item}}</div>
                        <div v-if="index != 2" class="title-line"></div>
                    </div>
                </div>
                <div v-if="step == 1" class="content-detail">
                    <div class="detail-title">账号信息</div>
                    <Form ref="form1" :model="formItem1" :label-width="80" :rules="ruleItem1" class="detail-form">
                        <FormItem label="机构名称" style="width: 400px;" prop="title">
                            <Input v-model="formItem1.title" placeholder="请输入机构名称"></Input>
                        </FormItem>
                        <FormItem label="机构账号" style="width: 400px;" prop="username">
                            <Input v-model="formItem1.username" placeholder="请输入机构账号"></Input>
                        </FormItem>
                        <FormItem label="账号密码" style="width: 400px;" prop="password">
                            <Input v-model="formItem1.password" placeholder="请输入账号密码" type="password"></Input>
                        </FormItem>
                        <FormItem style="margin-top: 40px;">
                            <Button type="primary" @click="handleNext" style="width: 150px;">下一步</Button>
                        </FormItem>
                    </Form>
                </div>
                <div v-else-if="step == 2" class="content-detail">
                    <div class="detail-title">机构信息</div>
                    <div style="display: flex;justify-content: center">
                        <Form ref="form2" :model="formItem2" :label-width="80" :rules="ruleItem2" class="detail-form">
                            <FormItem label="平台名称" style="width: 400px;">
                                <Input v-model="formItem2.platform_name" placeholder="请输入平台名称"></Input>
                            </FormItem>
                            <FormItem label="平台域名" style="width: 400px;" prop="terraceUrl">
                                <Input show-word-limit :maxlength="10" v-model="formItem2.domain" placeholder="请输入平台域名"></Input>
                                <p style="text-align: left">
                                    <span>示例：</span>
                                    <span v-if="formItem2.domain" >{{formItem2.domain}}.{{PlatformUrl}}</span>
                                    <span v-else>{{PlatformUrl}}</span>
                                </p>
                            </FormItem>
                            <FormItem label="机构电话" style="width: 400px;" >
                                <Input v-model="formItem2.phone" placeholder="请输入机构电话"></Input>
                            </FormItem>
                            <FormItem label="机构地址" style="width: 400px;">
                                <Input v-model="formItem2.address" placeholder="请输入机构地址"></Input>
                            </FormItem>
                            <FormItem label="机构简介" style="width: 400px;">
                                <Input class="descriptions" show-word-limit v-model="formItem2.description" placeholder="请输入机构简介" type="textarea" :maxlength="200" :autosize="true"></Input>
                            </FormItem>
                            <FormItem style="margin-top: 40px;">
                                <div style="display: flex">
                                    <Button @click="handleLast" style="width: 150px;background-color:#fff;margin-right: 30px;">上一步</Button>
                                    <Button type="primary" @click="handleSubmit" style="width: 150px;">下一步</Button>
                                </div>
                            </FormItem>
                        </Form>
                        <div style="margin-left: 80px;margin-top: 60px;">
                            <Upload ref="upload" :show-upload-list="false" action="http://dscj-app.oss-cn-qingdao.aliyuncs.com"
                                    :format="['jpg','jpeg','png']" :data="uploadData"
                                    accept="image/jpeg,image/png,image/jpg,image/bmp"
                                    :before-upload="handleBeforeUpload" :on-format-error="handleFormatError">
                                <div v-if="!img_url" class="modal-upload-flie">
                                    <!--                                <img class="upload-flie-img" src="../../../../assets/icons/icon/upload.png"/>-->
                                    <Icon type="ios-add" size="80"/>
                                    <p>上传图片</p>
                                </div>
                                <img v-if="img_url" class="upload-flie-img-2" :src="img_url"/>
                            </Upload>
                            <div style="font-size: 16px;color: #474C63;margin-top: 15px;text-align: center;">机构图标</div>
                        </div>
                    </div>
                </div>
                <div style="display: flex;flex-direction:column;align-items:center;" v-else>
                    <img class="content-img" :src="successImg" alt="">
                    <div class="img-cont">创建成功</div>
                    <div class="content-btn">
                        <Button type="primary" @click="handleBack" style="width: 150px;">返回</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import screen from '../../../../components/ScreenFrame'
    import uploadBtn from '../../../../components/UploadButton'
    import {get_sign} from '../../../../api/modules/ali_oss'
    import axios from 'axios'
    import successImg from '../../../../assets/img/user/insititution_success.png'
    const ossHost = 'http://sfile.9mededu.com';

    export default {
        components: {screen, uploadBtn},
        data() {
            return {
                PlatformUrl,
                successImg,
                stepList: ['创建账号', '完善信息', '创建成功'],
                step: 1,
                formItem1: {
                    title: '',
                    username: '',
                    password: '',
                },
                ruleItem1: {
                    title: [
                        { required: true, message: '请输入机构名称', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入机构账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入账号密码', trigger: 'blur' }
                    ],
                },
                formItem2: {
                    platform_name: '',
                    domain: '',
                    phone: '',
                    address: '',
                    description: ''
                },
                ruleItem2: {
                    domain: [
                        { required: true, message: '请输入平台域名', trigger: 'blur' }
                    ],
                },
                img_url: '',
                uploadData: {},
                fileSize: null,
                maxFileSize: 5,
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
            }
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            handleLast() {
                this.step -= 1
            },
            handleNext() {
                this.$refs.form1.validate(valid => {
                    if(valid) this.step += 1
                })
            },
            handleSubmit() {
                this.$refs.form2.validate(valid => {
                    if(valid) {
                        let data = {...this.formItem1, ...this.formItem2}
                        data.img_url = this.img_url
                        PostData('user/addDeptAdmin', data).then(res => {
                            if(res.res_code == 1) this.step += 1
                        })
                    }
                })
            },
            handleBeforeUpload(file) {
                this.fileSize = file.size / (1024 * 1024);
                if (this.maxFileSize > 0 && this.fileSize > this.maxFileSize) {
                    this.$Modal.info({
                        title: '提示',
                        content: '文件过大',
                        onOk: () => {
                        }
                    });
                    return;
                }
                this.handleGetassignKey(file);
                return false
            },
            handleGetassignKey(file_item, insert) {
                var date = new Date(); //dscj-app,user_task
                date = date.toGMTString();
                get_sign(file_item.type, date, this.uploadConfig.bucket, this.uploadConfig.dir, file_item.name, 'POST')
                    .then(res => {
                        if (res.data.res_code == 1) {
                            const formData = new FormData();
                            this.resourse_url = res.data.data.filename;
                            formData.append('key', res.data.data.filename);
                            formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
                            formData.append('success_action_status', '200');
                            formData.append('signature', res.data.data.sign);
                            formData.append('policy', res.data.data.policyBase64);
                            formData.append('file', file_item);
                            this.handleUploadFile(formData, encodeURI(ossHost));
                        }
                    })
            },
            // 上传到oss上
            handleUploadFile(form_data, url) {
                var vm = this;
                axios({
                    method: 'POST',
                    url: url,
                    data: form_data,
                    onUploadProgress: function (progressEvent) {
                        var progress = Math.round(progressEvent.lengthComputable ? progressEvent.loaded *
                            100 / progressEvent.total : 0);
                        vm.percentage = progress;
                    },
                }).then(res => {
                    this.img_url = url + '/' + this.resourse_url;
                });
            },
            handleFormatError() {
                this.$Message.warning('请上传图片');
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .descriptions{
        /deep/ .ivu-input-word-count{
            bottom: 7.5px !important
        }
    }
    .box{
        height: calc(100% - 66px);
        background-color:#f0f0f7;

        .box-title{
            text-align: left;
            padding-top: 10px;
            padding-left: 37px;
            font-size: 14px;
            color: #474C63;
        }
        .content{
            height: calc(100% - 41px);
            margin: 10px 20px;
            background-color: #fff;
            overflow-y: auto;

            .content-title{
                margin-top: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .title-num{
                height: 50px;
                width: 50px;
                border: 1px solid #4098ff;
                border-radius: 100%;
                text-align: center;
                line-height: 50px;
                font-size: 26px;
            }
            .title-word{
                font-size: 18px;
                margin-left: 10px;
            }
            .title-line{
                width: 120px;
                border-top: 1px solid #D4D7E3;
                margin: 0 10px;
            }
            .content-detail{
                margin-top: 60px;

                .detail-title{
                    text-align: center;
                    font-size: 26px;
                    color: #474C63;
                }
            }
            .detail-form{
                margin-top: 50px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .content-img{
                height: 280px;
                margin-top: 60px;
            }
            .img-cont{
                margin-top: 26px;
                font-size: 26px;
                color: #474C63;
            }
            .content-btn{
                margin-top: 50px;
                display: flex;
                justify-content: center
            }
        }
    }
    .modal-upload-flie {
        width: 150px;
        height: 150px;
        background: #F0F0F7;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .upload-flie-img {
        width: 40px;
        height: 35px;
    }
    .upload-flie-img-2 {
        width: 150px;
        height: 150px;
        border-radius: 100px
    }
</style>

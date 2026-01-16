<template>
    <Tabs value="name1" class="person-tabs">
        <TabPane label="个人资料" name="name1">
            <div class="personal">
                <div class="personal-main">
                    <upload-panel class="upload-head-img" :resourse="formValidate.head_img_url"
                        :upload-config="uploadConfig" @uploadcomplete="uploadcomplete" :maxFileSize="2"
                        :panelOptions="panelOptions">
                    </upload-panel>
                    <Form ref="formValidate" class="personal-form" :model="formValidate" :rules="ruleValidate"
                          :label-width="80">
                        <FormItem prop="realname">
                            <template slot="label">真实姓名</template>
                            <Input v-model="formValidate.realname" placeholder="请输入真实姓名"></Input>
                        </FormItem>
                        <FormItem>
                            <template slot="label"><span class="form-label">性别</span></template>
                            <Select v-model="formValidate.sex" placeholder="请选择性别">
                                <Option :value="0">女</Option>
                                <Option :value="1">男</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <template slot="label"><span class="form-label2">手机号</span></template>
                            <Input v-model="formValidate.phone" placeholder="请输入手机号"></Input>
                        </FormItem>
                        <FormItem class="form-labels">
                            <template slot="label"><span class="form-label">身份</span></template>
                            <Input disabled v-model="formValidate.role_name"></Input>
                        </FormItem>
                        <FormItem label="登录账号">
                            <Input disabled v-model="formValidate.username"></Input>
                        </FormItem>
                        <FormItem label="账号密码" prop="password">
                            <Input type="password" v-model="formValidate.password" placeholder="请输入账号密码"></Input>
                        </FormItem>
                    </Form>
                    <Button class="btn-orange" type="primary" @click="handleSubmit('formValidate')">保存</Button>
                </div>
            </div>
        </TabPane>
        <TabPane v-if="mechanismShow" label="机构信息" name="name2">
            <div class="personal">
                <div class="personal-main">
                    <upload-panel class="upload-head-img2" :resourse="formValidate2.img_url"
                                  :upload-config="uploadConfig" @uploadcomplete="uploadcomplete2" :maxFileSize="2"
                                  :panelOptions="panelOptions">
                    </upload-panel>
                    <Form ref="formValidate2" class="personal-form" :model="formValidate2" :rules="ruleValidate2"
                          :label-width="80">
                        <FormItem label="机构名称">
                            <Input disabled v-model="formValidate2.title"></Input>
                        </FormItem>
                        <FormItem label="机构介绍" prop="description">
                            <Input type="textarea" :rows="6" v-model="formValidate2.description"
                                   placeholder="请输入机构介绍"></Input>
                        </FormItem>
                    </Form>
                    <Button class="btn-orange" type="primary" @click="handleSubmit2('formValidate2')">保存</Button>
                </div>
            </div>
        </TabPane>
    </Tabs>
</template>
<script>
    import {validatePass, phone} from '../UserManage/jurisdictionList.js'
    import UploadPanel from '../../components/UploadPanel.vue'
    import {Config} from '../../config/base.js'
    import postData from 'src/api/postData'
    import {user_info} from '../../api/modules/auth';

    export default {
        components: {UploadPanel},
        data() {
            return {
                formValidate: {},
                host: Config.ossHost,
                formValidate2: {},
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'production',
                    type: 1
                },
                pass: '',
                ruleValidate: {
                    realname: {required: true, message: '请输入真实姓名', trigger: 'blur'},
                    sex: {required: true, message: '请选择性别'},
                    phone: {required: true, message: '请输入手机号'},
                    password: {required: true, message: '请输入密码'}
                },
                ruleValidate2: {
                    description: {required: true, message: '请输入机构介绍', trigger: 'blur'}
                },
                panelOptions: {
                    panelWidth: 150,
                    panelHeight: 150
                }
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.userInfo
            },
            mechanismShow() {
                return this.user.role_id == 2
            }
        },
        beforeDestroy() {
            this.handleSubmit = null;
            this.preservation = null;
            this.handleFormData = null;
            this.handleUser = null;
            this.getMechanismData = null;
        },
        methods: {
            handleSubmit(name) {
                let fn = () => {
                    let d = {...this.formValidate, from: 'web'}
                    if (d.password == this.pass) delete d.password
                    this.preservation(name, d, 'user/modifyUser')
                }
                if(this.formValidate.phone){
                    if(!(/^1[3456789]\d{9}$/.test(this.formValidate.phone))){
                        this.$Message.info('手机号格式不正确')
                    }else fn()
                }else fn()
            },
            preservation(name, d, url) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        postData(url, d).then((res) => {
                            if (res.res_code == 1) {
                                this.$Message.success(res.msg);
                                if (name == 'formValidate') this.$store.dispatch('set_user_info', this.formValidate);
                            }
                        })
                    }
                })
            },
            handleSubmit2(name) {
                this.preservation(name, this.formValidate2, 'user/modifyDept')
            },
            uploadcomplete(res) {
                this.formValidate.head_img_url = res
            },
            uploadcomplete2(res) {
                this.formValidate2.img_url = res
            },
            getMechanismData() {
                postData('user/getDeptDetail', {id: this.user.organization_id}).then((res) => {
                    if (res.res_code == 1) this.formValidate2 = res.data[0]
                    if (res.data[0].admin.length > 0) this.handleFormData(res.data[0].admin[0])
                })
            },
            handleFormData(d) {
                d.role_name = this.$config.status(d.role_id)
                d.password = d.password.slice(0, 6)
                this.pass = d.password
                this.formValidate = d
            },
            handleUser() {
                let d = this.$config.copy(this.user, {})
                this.handleFormData(d)
            }
        },
        mounted() {
            this.handleUser()
            if (this.mechanismShow) this.getMechanismData()
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .upload-img{
        border: none !important;
    }
    /deep/ .ivu-tabs-tabpane {
        box-shadow: 0 0 15px 0 rgba(117, 124, 157, 0.10);
    }

    .personal-form {
        margin-top: 20px;
    }

    .form-label2 {
        letter-spacing: 4px;
    }

    /deep/ .upload-panel .img {
        border: none
    }

    /deep/ .upload-head-img .upload-panel .img img, /deep/ .upload-head-img input {
        width: 151px;
        height: 151px;
        border-radius: 100px;
    }

    .upload-head-img, .upload-head-img2{
        width: 150px;
        height: 150px;
        border-radius: 100%;
        overflow: hidden;
    }

    /deep/ .upload-head-img2.upload-panel .img img, /deep/ .upload-head-img2 input {
        width: 100px;
        height: 100px;
        border-radius: 100px;
        overflow: hidden;
    }

    /deep/ .ivu-form {
        width: 100%
    }

    /deep/ .ivu-select-single .ivu-select-selection {
        height: 40px;
    }

    /deep/ .ivu-input[disabled], fieldset[disabled] {
        color: #8A8A8A;
    }

    /deep/ .ivu-select-selection > div > .ivu-select-selected-value {
        height: 40px;
        padding-left: 15px;
        line-height: 40px;
    }

    /deep/ .ivu-input {
        height: 40px;
        padding: 9px 15px;
    }

    /deep/ textarea.ivu-input {
        height: 250px;
    }

    .personal {
        margin-top: 14%;
        margin: 0 auto;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        /*height: 941px;*/
        overflow: hidden;
        overflow-y: scroll;
        min-height: 660px;

        .personal-main {
            width: 450px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 30px;

            .item-title {
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #8A8A8A;
                margin-top: 20px;
                text-align: left;
                margin-bottom: 15px;
            }
        }
    }

    .btn-orange {
        width: 110px;
        margin-bottom: 34px;
    }
    .person-tabs{
        height: 100%;

        /deep/.ivu-tabs-content-animated{
            height: calc(100% - 59px);

            /deep/ .ivu-tabs-tabpane{
                height: 100%;
                overflow-y: auto;
            }
        }
    }
</style>

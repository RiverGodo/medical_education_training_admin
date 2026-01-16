<template>
    <div style="height: 100%;">
        <screen :types="7" title="创建机构" @handleBack="handleBack" style="background-color:#fff;"/>
        <div class="box">
            <div class="box-title">用户管理 > 机构列表 > 机构信息</div>
            <div class="main-view">
            <div class="content">
                <div class="content-left">
                    <div class="left-title">
                        <div class="left-title-content">基本信息</div>
                        <div @click="handleEdit('leftEdit')" style="display: flex;align-items: center;cursor: pointer">
                            <img :src="leftEdit ? save_img : edit_img" alt="" style="margin-right: 5px;">
                            <div>{{leftEdit ?  '保存' : '编辑'}}</div>
                        </div>
                    </div>
                    <div class="c-views">
                    <div class="left-name">
                        <div class="left-name-title">
                            <div class="left-name-title-font">{{formData.title}}</div>
                            <a v-if="formData.domain" target="_blank" :href="`http://${formData.domain}.${PlatformUrl}`" class="left-name-title-url">{{formData.domain}}.{{PlatformUrl}}</a>
                        </div>
                        <img v-if="!leftEdit" class="institution-upload-img" :src="formData.img_url || loading_img" alt="">
                        <upload-picture v-else @upload="upload" :imgStyle="imgStyle">
                            <div slot="picture" class="modal-upload-flie">
                                <img v-if="formData.img_url" :src="formData.img_url" alt="" class="institution-img">
                                <div v-else>
                                    <Icon type="ios-add" size="60"/>
                                    <p>上传图片</p>
                                </div>
                            </div>
                        </upload-picture>
                    </div>
                    <div v-if="!leftEdit" class="left-content">
                        <div>机构账号: <span>{{formData.username}}</span></div>
                        <div>账号密码: <span>******</span></div>
                        <div>管理权限: <span>机构管理员</span></div>
                        <div style="margin-top: 30px;">平台名称: <span>{{formData.platform_name}}</span></div>
                        <div>机构电话: <span>{{formData.phone}}</span></div>
                        <div>机构地址: <span>{{formData.address}}</span></div>
                        <div style="margin-top: 30px;">机构简介: <span>{{formData.description}}</span></div>
                        <div style="margin-top: 30px;">注册时间: <span>{{formData.create_time}}</span></div>
                        <br/>
                    </div>
                    <Form v-else :model="formItem" :rules="ruleInline" style="margin-top: 20px;">
                        <FormItem label="机构名称" prop="title">
                            <Input v-model="formItem.title" placeholder="请输入机构名称"></Input>
                        </FormItem>
                        <FormItem label="机构账号" prop="username">
                            <Input v-model="formItem.username" placeholder="请输入机构账号"></Input>
                        </FormItem>
                        <FormItem label="账号密码" prop="password">
                            <Input v-model="formItem.password" placeholder="请输入账号密码" @on-change="changeWord" type="password"></Input>
                        </FormItem>
                        <FormItem label="平台名称" prop="platform_name">
                            <Input v-model="formItem.platform_name" placeholder="请输入平台名称"></Input>
                        </FormItem>
                        <FormItem label="机构电话" prop="phone">
                            <Input v-model="formItem.phone" placeholder="请输入机构电话"></Input>
                        </FormItem>
                        <FormItem label="机构地址" prop="address">
                            <Input v-model="formItem.address" placeholder="请输入机构地址"></Input>
                        </FormItem>
                        <FormItem label="机构简介" prop="description">
                            <Input v-model="formItem.description" placeholder="请输入机构简介" type="textarea" :maxlength="200" :rows="5"></Input>
                        </FormItem>
                    </Form>
                    </div>
                </div>
                <div class="content-right">
                    <div class="left-title">
                        <div class="left-title-content">关于平台</div>
                        <div @click="handleEdit('rightEdit')" style="display: flex;align-items: center;cursor: pointer">
                            <img :src="rightEdit ? save_img : edit_img" alt="" style="margin-right: 5px;">
                            <div>{{rightEdit ?  '保存' : '编辑'}}</div>
                        </div>
                    </div>
                    <div style="height: calc(100% - 100px); margin-top: 20px;">
                        <div v-if="!rightEdit" style="text-align: left; height: 100%;">
                            <div class="about-view" v-if="formData.about">
                                <div class="about-html" v-html="formData.about"></div>
                            </div>
                            <div v-else style="height: 100%;display: flex;flex-direction: column;align-items: center;justify-content: center">
                                <img :src="noneContent" alt="">
                                <div style="font-size: 16px;color: #8489A1;margin-top: 30px;">暂无内容</div>
                            </div>
                        </div>
                       <div v-else style="height: 100%" >
                            <NewEditor :isUploadVideo="true" :editor-id="abouts" @get-content="getContent" class="new-editor" :content="formItem.about"/>
                       </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    import screen from '../../../../components/ScreenFrame'
    import uploadPicture from '../../../../components/UploadPicture'
    import save_img from '../../../../assets/img/institution/save.png'
    import edit_img from '../../../../assets/img/institution/edit.png'
    import loading_img from '../../../../assets/img/institution/loadingUp.png'
    import noneContent from '../../../../assets/img/institution/noneContent.jpg'
    import NewEditor from '../../../../components/NewEditor'
    export default {
        components: {screen, uploadPicture, NewEditor},
        data() {
            return {
                PlatformUrl,
                save_img, edit_img, loading_img, noneContent,
                imgStyle: {
                    height: '100px',
                    width: '100px',
                    borderRadius: '100%',
                    marginRight: '60px'
                },
                abouts: 'form-item-new-editer-check-institution' + Math.floor(Math.random() * 10000 + 1),
                leftEdit: false,
                rightEdit: false,
                formData: {},
                formItem: {
                    title: '',
                    username: '',
                    password: '',
                    platform_name: '',
                    phone: '',
                    address: '',
                    description: '',
                    about: '',
                },
                ruleInline: {
                    title: [
                        { required: true, message: '请输入机构名称', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入机构账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入账号密码', trigger: 'blur' }
                    ],
                    platform_name: [
                        { required: true, message: '请输入平台名称', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入机构电话', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入机构地址', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入机构简介', trigger: 'blur' }
                    ],
                },
                changePassword: false
            }
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            upload(val) {
                this.formItem.img_url = val
            },
            initialData(val) {
                if(val) this.rightEdit = this.leftEdit = true
                this.formItem = this.formData
                this.formItem.password = '******'
                this.changePassword = false
            },
            handleEdit(val) {
                if(!this[val]) this.initialData()
                else {
                    if(!this.changePassword) delete this.formItem.password
                        this.handleSubmit()
                }
                this[val] = !this[val]
            },
            handleSubmit() {
                PostData('user/modifyDept', this.formItem).then(res  => {
                    if(res.res_code == 1) sessionStorage.setItem('institution', JSON.stringify(this.formItem))
                    else {
                        this.formData = JSON.parse(sessionStorage.getItem('institution'))
                        if(this.$route.query && this.$route.query.state) this.initialData(true)
                    }
                })
            },
            getContent(val){
                this.formItem.about = val
            },
            changeWord() {
                this.changePassword = true
            }
        },
        mounted() {
            this.formData = JSON.parse(sessionStorage.getItem('institution'))
            if(this.$route.query && this.$route.query.state) this.initialData(true)
        }
    }
</script>

<style scoped lang="less">
    .about-view{
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
    }
    .c-views{
        height: calc(100% - 55px);
        overflow: hidden;
        overflow-y: auto;
    }
    .box{
        height: calc(100% - 66px);
        background-color: #f0f0f7;
        .box-title{
            text-align: left;
            padding-top: 10px;
            padding-left: 37px;
            font-size: 14px;
            color: #474C63;
        }
        .main-view{
            height: calc(100% - 41px);
            padding: 10px 20px;
            overflow-y: auto;
        }
        .content{
            display: flex;
            background-color: #fff;
            height: 100%;
            .content-left{
                height: 100%;
                width: 40%;
                background-color: #fff;
                border-right: 10px solid #f0f0f7;
                padding: 0 20px;
                .left-name{
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;

                    .left-name-title{
                        text-align: left;
                        max-width: 274px;
                    }
                    .left-name-title-font{
                        font-size: 22px;
                        color: #474C63;
                    }
                    .left-name-title-url{
                        font-family: Helvetica;
                        font-size: 14px;
                        color: #4098FF;
                        width: 100%;
                        overflow-wrap: break-word;
                    }
                    .institution-img{
                        height: 100px;
                        width: 100px;
                        border-radius: 100%;
                    }
                    .institution-upload-img{
                        .institution-img;
                        margin-right: 40px;
                    }
                }
                .left-content{
                    font-family: PingFangSC-Regular;
                    text-align: left;
                    font-size: 14px;
                    color: #474C63;

                    div{
                        margin-top: 10px;
                    }
                }
            }
            .content-right{
                height: 100%;
                width: 60%;
                background-color: #fff;
                padding: 0 20px;

                .box{
                    background-color: #fff;
                    height: 100%;
                }
            }
            .left-title{
                display: flex;
                height: 55px;
                border-bottom: 1px solid #F0F0F7;
                align-items: center;
                justify-content: space-between;

                .left-title-content{
                    font-size: 18px;
                    color: #474C63;
                }
            }
        }
    }
    .modal-upload-flie {
        width: 100px;
        height: 100px;
        background: #F0F0F7;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 12px;
        margin-right: 60px;
    }
    /deep/ .ivu-input-wrapper{
        width: calc(100% - 80px);
    }
</style>

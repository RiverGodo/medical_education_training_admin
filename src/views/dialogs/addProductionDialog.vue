<template>
    <div>
        <Modal :transfer=false :title="!payload? '添加培训' : '编辑培训'" :footer-hide=true :width="740" :mask-closable="false"
               v-model="addProductionDialog" @on-cancel="handleRemoveModal(remove)" :class="nextStep == 2 ? 'modal-class1' : 'modal-class2'">
            <base-input @closedialog="handleClose">
                <Row slot="body">
                    <Row class="body-top">
                        <Form ref="form" :model="form" :rules="rules" :label-width="fromLabelWidth"
                              class="add-task-form" :class="nextStep == 0 ? 'add-task-form-type': ''">
                            <FormItem v-show="nextStep == 0" prop="title" label="产品名称">
                                <template slot="label"><span class="form-label">名称</span></template>
                                <Input v-model="form.title" placeholder="请输入产品名称"></Input>
                            </FormItem>
                            <FormItem  v-if="organizationList" v-show="nextStep == 0" prop="organization_id" label="所属机构">
                                <template slot="label"><span class="form-label">机构</span></template>
                                <Select v-model="form.organization_id" placeholder="请选择所属机构">
                                    <Option v-for="item in organizationList" :value="item.id" :key="item.id">
                                        {{item.title}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem v-show="nextStep == 0" prop="category_id" label="分类" class="local-left">
                                <template slot="label"><span class="form-label">分类</span></template>
                                <Select v-model="form.category_id" placeholder="请选择产品分类">
                                    <Option v-for="item in selectList3" :value="item.id" :key="item.id">{{item.title}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem v-show="nextStep == 0" prop="unlock_type" label="解锁方式" class="local-right">
                                <Select v-model="form.unlock_type" placeholder="请选择解锁方式">
                                    <Option v-for="item in selectList1" :value="item.id" :key="item.id">{{item.title}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem v-show="nextStep == 0" prop="model" class="local-left">
                                <template slot="label"><span class="form-label">模式</span></template>
                                <Select v-model="form.model" placeholder="请选择展示模式">
                                    <Option v-for="item in selectList4" :value="item.id" :key="item.id">{{item.title}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <!-- organizationList -->
                            <FormItem v-show="nextStep == 0" prop="state" label="产品状态" class="local-right">
                                <template slot="label"><span style="letter-spacing: 26px">状</span>态</template>
                                <Select v-model="form.state" placeholder="请选择产品状态" @on-change="changeState">
                                    <Option v-for="item in selectList2" :value="item.id" :key="item.id">{{item.title}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem v-show="nextStep == 0" prop="original_price" class="local-left">
                                <template slot="label"><span class="form-label">原价</span></template>
                                <InputNumber placeholder="售价必须小于等于定价" v-model="form.original_price"></InputNumber>
                            </FormItem>
                            <FormItem v-show="nextStep == 0" prop="price" label="实际售价" class="local-right">
                                <InputNumber placeholder="0为免费，单位默认（元）" v-model="form.price"></InputNumber>
                            </FormItem>
                            <FormItem v-show="nextStep == 0" prop="short_description" label="产品介绍">
                                <template slot="label"><span class="form-label">介绍</span></template>
                                <Input type="textarea" :rows="6" placeholder="请输入产品介绍" v-model="form.short_description"
                                       :maxlength="100"></Input>
                                <div class="font-num">{{form.short_description.length}}/100</div>
                            </FormItem>
                            <FormItem label="图片视频" v-if="nextStep == 0" required>
                                <template slot="label"><span class="form-label">封面</span></template>
                                <div class="demo-file">
                                    <div v-if="form.imgList.length>0">
                                        <div v-if="form.imgList.length>1">
                                            <Carousel autoplay v-model="fileValue">
                                                <CarouselItem v-for="(t,i) in form.imgList" :key="i">
                                                    <div class="demo-carousel">
                                                        <img @click="deleteImgList(i)"
                                                             src="../../assets/img/close-icon.png"
                                                             class="upload-img-main-icon"/>
                                                        <!-- <Icon @click="deleteImgList(i)" class="upload-img-main-icon" type="ios-close-circle" /> -->
                                                        <img class="upload-img-item" :src="t"/>
                                                    </div>
                                                </CarouselItem>
                                            </Carousel>
                                        </div>
                                        <div v-if="form.imgList.length===1" class="demo-carousel">
                                            <img @click="deleteImgList(0)" src="../../assets/img/close-icon.png"
                                                 class="upload-img-main-icon"/>
                                            <!-- <Icon @click="deleteImgList(0)" class="upload-img-main-icon" type="ios-close-circle" /> -->
                                            <img class="upload-img-item" :src="form.imgList[0]"/>
                                        </div>
                                    </div>
                                    <div v-if="form.video_url">
                                        <Icon @click="deleteImgList('video')" class="upload-img-main-icon2"
                                              type="ios-close-circle"/>
                                        <video ref="uploadVideo" width="458" height="260" v-if="form.video_url" :src="form.video_url"
                                               controls="controls" @loadeddata='loadVideo' crossOrigin='Anonymous'/>
                                    </div>
                                    <div class="demo-file-key" v-if="form.imgList.length == 0 && !form.video_url">
                                        <img src="../../assets/img/img-video.png"/>
                                        <p>展示图片或视频</p>
                                    </div>
                                </div>
                                <div class="upload-btn-flex">
                                    <p class="upload-img-text">*可上传1～5张图片或1个视频；图片支持jpg/png格式，建议尺寸768*432px，且大小不超过2M；视频支持mp4格式，且大小不超过300M</p>
                                    <UploadBtn text="上传" :imgtypes="imgType" bucket="jhyl-static-file"
                                               @handle-close="handleFileClose" @uploadcomplete="uploadcomplete"
                                               :type="fileType" :maxFileSize="[2, 300]"/>
                                </div>
                            </FormItem>
                            <!--可插入输入框-->
                            <FormItem v-show="nextStep == 2" label="" class="upload">
                                <new-editor :style="showAll == 1 ? 'height: auto;' : 'height: 600px;'"
                                            @get-content="getContent" @editor-change="editorChange"
                                            :editor-id="editorId" :content="content" class="new-editor"/>
                                <div style="height: 32px;">
                                    <div v-if="showAll" @click="showContent" class="show-content">{{showAll == 1 ? '收起↑' : '展开全文↓'}}</div>
                                </div>
                            </FormItem>
                            <div v-if="nextStep == 2" class="btns">
                                <Button type='text' class='btn-pre' @click='handlePreStep'>上一步</Button>
                                <Button class="btn-orange" @click="handleSubmit('form')">提交</Button>
                            </div>
                            <Button v-if="nextStep == 0 || nextStep == 1" class="btn-orange btn-center"
                                    @click="handleNextStep('form')">下一步
                            </Button>
                        </Form>
                    </Row>
                </Row>
            </base-input>
        </Modal>
    </div>
</template>
<script>
    import BaseInput from '../../components/BaseInput'
    import UploadPanel from '../../components/UploadPanel'
    import BaseList from '../../components/BaseList'
    import {RemoveModal} from './mixins'
    import {mapActions, mapState, mapGetters} from 'vuex'
    import {MPop} from '../../components/MessagePop'
    import UploadBtn from '../../components/UploadButton'
    import iconFont from '../../assets/icons/icon/font.png'
    import iconColor from '../../assets/icons/icon/color.png'
    import iconCopy from '../../assets/icons/icon/photo.png'
    import postData from '../../api/postData';
    import NewEditor from '../../components/NewEditor'
    import {classification2} from '../ProductManage/production/consts'

    export default {
        mixins: [RemoveModal, MPop],
        components: {'base-input': BaseInput, 'upload-panel': UploadPanel, 'data-list': BaseList, UploadBtn, NewEditor},
        props: {
            remove: {
                type: String
            },
            payload: {}
        },
        data() {
            return {
                iconFont, iconColor, iconCopy,
                content: '',
                addProductionDialog: true,
                unlock_type: '',
                states: '',
                fileValue: null,
                imgType: 1,
                fileType: 'image/png,image/jpg,video/mp4',
                selectList1: [{id: 0, title: '不限'}, {id: 1, title: '按课程'}, {id: 2, title: '按章节'}, {
                    id: 3,
                    title: '按视频'
                }],
                selectList3: classification2,
                show: false,
                editorId: 'form-item-new-editer' + Math.floor(Math.random() * 10000 + 1),
                selectList2: [{id: -1, title: '下架'}, {id: 1, title: '测试'}, {id: 2, title: '上架'}],
                selectList4: [{id: 1, title: '展示单品'}, {id: 2, title: '展示合集'}, {id: 3, title: '单品合集同时展示'}],
                form: {
                    unlock_type: '',
                    product_id: '',
                    state: null,
                    title: '',
                    price: 0,
                    original_price: 0,
                    short_description: '',
                    description: '',
                    url_arr: '',
                    redirectType: false,
                    curriculum_id: null,
                    imgList: [],
                    video_url: '',
                    organization_id: null,
                    _fn: null,
                    duration: 0,
                    model: '',
                    category_id: ''
                },
                descriptionHtml: '',
                nextStep: 0,
                isInited: false,
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'production',
                    type: 1
                },
                uploaderConfig2: {
                    bucket: 'jhyl-static-file',
                    dir: 'video/production',
                    type: 4
                },
                loadingInstance: null,
                fromLabelWidth: 86,
                // certificate: [],
                description: '',
                fontList: [
                    {
                        name: '标题',
                        size: 32,
                        weight: true
                    },
                    {
                        name: '小标题',
                        size: 24
                    },
                    {
                        name: '正文',
                        size: 16
                    },
                ],
                colorList: [
                    {
                        name: '红色',
                        color: '#f00'
                    },
                    {
                        name: '绿色',
                        color: '#0f0'
                    },
                    {
                        name: '蓝色',
                        color: '#00f'
                    },
                ],
                color: '',
                organizationList: null,
                formState: null,
                formCategory: null,
                organizationId: null,
                rules: {
                    organization_id: {required: true, message: '请选择所属机构'},
                    title: {required: true, message: '请选择产品名称', trigger: 'blur'},
                    original_price: {required: true, message: '请输入原价'},
                    price: {required: true, message: '请输入实际售价'},
                    unlock_type: {required: true, message: '请选择解锁方式'},
                    model: {required: true, message: '请选择产品模式'},
                    state: {required: true, message: '请选择产品状态'},
                    short_description: {required: true, message: '请输入产品介绍', trigger: 'blur'},
                    category_id: {required: true, message: '请选择产品分类'},
                },
                showAll: 2,
                video_img: ''
            }
        },
        mounted() {
            console.log(this.payload, 'this.payloadthis.payloadthis.payload');
            console.log(JSON.parse(sessionStorage.getItem('PRODUCTINFO')), 'jsonjson')
            if(this.payload) {
                if(JSON.parse(this.payload.row.url_arr).default.length) this.fileType = 'image/png,image/jpg'
                else this.fileType = 'video/mp4'
            }
            this.organizationList = null
            if (JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1) {
                this.getOrganization()
            }
            if (this.payload && this.payload.hasOwnProperty('type') && this.payload.type == 2) {
                let d = this.payload.row
                this.form.title = d.title;
                this.form.original_price = d.original_price;
                this.form.price = d.price;
                this.form.short_description = d.short_description;
                this.form.unlock_type = d.unlock_type;
                this.form.state = d.state;
                this.form.model = d.model
                let arrObj = JSON.parse(d.url_arr);
                this.form.imgList = [...this.form.imgList, ...arrObj.default]
                this.form.video_url = arrObj.video
                this.form.product_id = d.id
                this.form.organization_id = d.organization_id
                this.form.category_id = d.category_id
                this.content = d.description
                // this.descriptionHtml = d.description.replace('class="form-message"','')
                // this.form.organization_id = this.organization_id
            }
            var vm = this;
            this.form._fn = function () {
                vm.handleClose();
                vm.showPop('保存成功！');
            }
        },
        computed: {
            ...mapState({
                examineTypeList: state => state.production.examineTypeList,
                // certificate:state => state.production.certificate_list
            }),
            selectSubject() {
                return this.form.subject_id;
            },
            selectGrade() {
                return this.form.grade_id;
            }
        },
        methods: {
            ...mapActions(['add_production', 'update_production', 'change_certificate_list']),
            getContent(val) {
                this.content = val
            },
            changeState(v) {
                this.form.state = v
            },
            getOrganization() {
                postData('/components/getOrganization').then((res) => {
                    this.organizationList = res.data
                })
            },
            openUpload() {
                this.imgType = 1
                this.fileType = 'image/png,image/jpg,video/mp4'
            },
            handleFileClose() {
                this.$Message.warning('最多上传5张图片或1个视频');
            },
            deleteImgList(i) {
                if (Number.isInteger(i)) {
                    this.form.imgList.splice(i, 1)
                    this.fileValue = i == 0 ? 0 : i - 1
                    this.$forceUpdate()
                } else if (i === 'video') this.form.video_url = ''
                if (!this.form.video_url && this.form.imgList.length == 0) {
                    this.openUpload()
                }
            },
            addImg(val) {
                var img = new Image()
                img.src = val.url
                img.style.width = '100%'
                img.style.display = 'block'
                this.$refs.inputStyl.appendChild(img)
            },
            handleDrop(val) {
                this.$refs.inputStyl.style.fontSize = val + 'px'
                if (val == 32) this.$refs.inputStyl.style.fontWeight = 'bold'
                else this.$refs.inputStyl.style.fontWeight = 'normal'
            },
            handleDrop1(val) {
                this.$refs.inputStyl.style.color = val
            },
            unloadWarn() {
                if (this.form.imgList.length == 5) this.$Message.warning('最多上传5张图片或1个视频');
            },
            uploadcomplete(v) {
                if (this.form.imgList.length < 5 || !this.form.video_url) {
                    if (v.maxSizes == 'img') {
                        this.fileType = 'image/png,image/jpg'
                        this.unloadWarn()
                        if (this.form.imgList.length < 5) this.form.imgList.push(v.url)
                        this.imgType = 1
                    } else if (v.maxSizes == 'video') {
                        if (!this.form.video_url) this.form.video_url = v.url
                        this.imgType = 'close'
                    }
                    //    this.$forceUpdate()
                } else {
                    this.imgType = 'close'
                    this.$Message.warning('最多上传5张图片或1个视频');
                }
            },
            loadVideo() {
                this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
                setTimeout(() => {
                    var v = this.$refs.uploadVideo;
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    canvas.width = '320';
                    canvas.height = '320';
                    ctx.drawImage(v, 0, 0, '320', '320');
                    this.video_img = canvas.toDataURL("image/jpeg", 1);
                    this.loadingInstance.close()
                },800)
            },
            handleClose() {
                this.form.description = '';
                this.addProductionDialog = false;
            },
            handleNextStep(name) {
                this.$refs[name].validate((valid) => {
                    if (Number(this.form.price) > Number(this.form.original_price)) {
                        this.$Modal.info({
                            title: '提示',
                            content: '实际售价不能高于原价！'
                        });
                    } else {
                        if (this.form.imgList.length > 0 || this.form.video_url) {
                            this.formState = this.form.state
                            this.formCategory = this.form.category_id
                            this.organizationId = this.form.organization_id
                            this.fromLabelWidth = 0;
                            this.nextStep = 2
                            this.editorChange()
                        } else this.$Message.warning('请上传展示图片或展示视频');
                    }
                })
            },
            handlePreStep() {
                this.fromLabelWidth = 86
                this.nextStep = 0
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let arrObj = {
                            default: this.form.imgList,
                            video: this.form.video_url,
                            video_img: this.video_img
                        }
                        if (this.form.imgList.length > 0 || this.form.video_url) {
                            this.form.state = this.formState;
                            this.form.category_id = this.formCategory;
                            this.form.organization_id = this.organizationId;
                            this.form.url_arr = JSON.stringify(arrObj);
                            if (this.content) this.form.description = this.content
                            this.form.price = Number.isInteger(this.form.price) ? this.form.price : +(Number(this.form.price).toFixed(2))
                            this.form.original_price = Number.isInteger(this.form.original_price) ? this.form.original_price : +(Number(this.form.original_price).toFixed(2))
                            if (this.payload) {
                                this.update_production(this.form);
                            } else this.add_production(this.form);
                        } else this.$Message.warning('请上传展示图片或展示视频');
                    }
                })
            },
            showContent() {
                this.showAll = this.showAll == 1 ? 2 : 1
            },
            editorChange() {
                this.$nextTick(() => {
                    if(document.querySelector('.w-e-text').clientHeight < 556) {
                        this.showAll = 0
                    }else if(document.querySelector('.w-e-text').clientHeight > 556 && this.showAll == 0){
                        this.showAll = 2
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ivu-modal-body {
        padding: 30px 25px 15px 25px
    }

    /deep/ .ivu-select-selected-value, /deep/ .ivu-select-item {
        letter-spacing: normal;
    }

    /deep/ .ivu-btn {
        display: inline-block !important;
    }

    /deep/ .ivu-switch-large {
        width: 75px
    }

    /deep/ .ivu-switch-large.ivu-switch-checked:after {
        left: 55px;
    }

    /deep/ .ivu-modal {
        /*width: 654px !important*/
    }

    /deep/ .upload-panel .img img {
        width: 160px;
        height: 148px;
    }

    /deep/ .ivu-modal-header {
        background-color: #ffffff !important;
        padding: 21px 16px;
        font-family: PingFangSC-Regular;
        font-size: 20px !important;
        color: #474C63 !important;
        letter-spacing: 0 !important;
        border-radius: 10px
    }

    /deep/ .ivu-modal-header-inner {
        color: #474C63 !important;
    }

    /deep/ .ivu-modal-close .ivu-icon-ios-close {
        color: #9397AD !important;
        font-size: 42px !important;
    }

    /deep/ .ivu-modal-content {
        border-radius: 6px !important;
    }

    // /deep/ .ivu-form-item {margin-bottom: 15px;}
    /deep/ .ivu-input {
        border-radius: 4px !important;
    }

    .upload-img-col {
        height: 130px;
        margin-bottom: 10px;
    }

    .upload-img-row {
        margin: 10px 0px 0px 0px !important;
    }

    .upload {
        text-align: left;
    }

    .upload-btn-flex {
        display: flex;

        .upload-img-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #9397AD;
            letter-spacing: 0.18px;
            line-height: 20px;
            text-align: left;
            margin-right: 35px;
        }
    }

    .upload-img-main {
        width: 100%;
        height: 100%;
        border: 1px solid #C8CCDD;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .icons {
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 20;
        font-size: 20px;
        z-index: 9999;
    }

    .upload-img-main-icon {
        color: #fff;
        .icons;
    }

    /deep/ .ivu-carousel-item {
        position: relative;
    }

    .upload-img-main-icon2 {
        color: #ddd;
        .icons;
    }

    .upload-img-item {
        width: 100%;
        height: 100%;
    }

    .add-task-form {
        width: 100% !important;
    }

    .add-task-form-type {
        padding: 0px 25px;
    }

    .btn-next {
        margin-left: 20%;
    }

    .btn-orange:hover, .btn-next:hover {
        background: #3DAAFF;
        color: #fff;
    }

    .btn-center {
        margin: 0 auto
    }

    .btn-orange {
        background: #3DAAFF;
        border: 1px solid #3DAAFF;
        border-radius: 4px;
        color: #fff;
        width: 200px;
        height: 36px;
    }

    #add-production-container {
        input,
        textarea {
            resize: none;
            outline: none;
        }

        .close-dialog-panel {
            position: absolute;
            top: -40px;
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

    .btn-pre {
        color: #474C63;
        width: 150px;
        height: 36px;
        background: #FFFFFF;
        border: 1px solid #9397AD;
        border-radius: 4px;
    }

    .upload-img {
        margin-left: 260px;
    }

    .form-message {
        padding: 0 15px;
        width: 604px;
        height: 648px;
        border: 1px solid #d7dde4;
        outline: none;
        overflow: hidden;
        overflow-y: auto;
        font-size: 16px;
        margin-left: 10px;
        text-align: left;
    }

    .up-img {
        margin-right: 10px;
    }

    .upload-video-main {
        position: relative;
    }

    /deep/ .w-e-text-container {
        height: calc(100% - 44px) !important;
        position: relative;
    }

    .demo-carousel {
        width: 554px;
        height: 310px;
    }

    .demo-file {
        width: 554px;
        height: 310px;
        margin-bottom: 20px;
        border: 1px solid #d7dde4;

        p {
            color: #d6dbe2;
        }
    }

    .demo-file-key {
        width: 554px;
        height: 310px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    /deep/ .ivu-carousel-item {
        width: 458px
    }

    /deep/ .uploadImg {
        width: 40px;
        height: 40px;
    }

    .font-num {
        display: inline-block;
        position: absolute;
        top: 102px;
        right: 18px;
    }

    /deep/ .w-e-text {
        overflow-y: auto;
        overflow: hidden;
        padding: 0 30px;
        height: auto !important;
        min-height: 100%;
    }

    .show-content {
        cursor: pointer;
        text-align: right;
        float: right;
        width: 80px;
        margin-right: 10px;

        &:hover {
            color: rgb(57, 76, 93);
        }
    }

    .new-editor {
        width: 604px;
        min-height: 600px !important;
    }
    .local-left{
        width: 310px;
        display: inline-block
    }
    .local-right{
        width: 310px;
        display: inline-block;
        margin-left: 10px;
    }
    .modal-class1{
        /deep/ .ivu-modal-body {
            padding: 0 0 30px 0;
        }
        /deep/ .w-e-text-container{
            /*padding: 0 30px;*/
            overflow-y: auto;
            position: relative
        }
        /deep/ .w-e-toolbar{
            padding: 0 30px;
        }
        /deep/ .new-editor{
            width: 100% !important;
        }
        /deep/ .w-e-toolbar{
            border: none !important;
        }
    }
    .modal-class2{

    }
</style>

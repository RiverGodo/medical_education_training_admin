<template>
    <div style="height: 100%;">
        <NewLayout :layout-nav="layoutNav">
            <div slot="header">
                <screen :types="6" @handleBack="handleBack" :btnName="btnName" :title="title" @handleClick="handleClick" :btnType="true"/>
            </div>
            <div slot="left" style="padding: 0 20px;">
                <div style="border-bottom: 1px solid #F0F0F7;line-height: 55px;text-align: left;font-size: 18px;color: #474C63;overflow-y: auto">基本信息</div>
                <Form ref="form" :model="form" :rules="rules" :label-width="fromLabelWidth"
                      class="add-task-form" style="margin-top: 15px;overflow-y: auto;">
                    <FormItem  prop="title" label="产品名称">
                        <template slot="label"><span class="form-label">名称</span></template>
                        <Input v-model="form.title" placeholder="请输入产品名称"></Input>
                    </FormItem>
                    <FormItem  v-if="organizationList" prop="organization_id" label="所属机构">
                        <template slot="label"><span class="form-label">机构</span></template>
                        <Select :disabled="isEdit" v-model="form.organization_id" placeholder="请选择所属机构">
                            <Option v-for="item in organizationList" :value="item.id" :key="item.id">
                                {{item.title}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="category_id" label="分类">
                        <template slot="label"><span class="form-label">分类</span></template>
                        <Select v-model="form.category_id" placeholder="请选择产品分类">
                            <Option v-for="item in selectList3" :value="item.id" :key="item.id">{{item.title}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="unlock_type" label="解锁方式">
                        <Select v-model="form.unlock_type" placeholder="请选择解锁方式">
                            <Option v-for="item in selectList1" :value="item.id" :key="item.id">{{item.title}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="model">
                        <template slot="label"><span class="form-label">模式</span></template>
                        <Select v-model="form.model" placeholder="请选择展示模式">
                            <Option v-for="item in selectList4" :value="item.id" :key="item.id">{{item.title}}
                            </Option>
                        </Select>
                    </FormItem>
                    <!-- organizationList -->
                    <FormItem prop="state" label="产品状态">
                        <template slot="label"><span class="form-label">状态</span></template>
                        <div style="display: flex">
                            <Select style="width: 50%" v-model="form.state" placeholder="请选择产品状态" @on-change="changeState">
                                <Option v-for="item in selectList2" :value="item.id" :key="item.id">{{item.title}}
                                </Option>
                            </Select>
                            <div class="validity" v-if="form.state == 4" style="cursor: pointer;justify-content:center;" @click="informationSale">
                                <img style="width: 16px;height: 16px;margin-right: 5px;" src="../../../assets/img/institution/save.png" alt="">
                                <div style="font-size: 14px;color: #4098ff">编辑产品待售信息</div>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem prop="original_price" class="local-left">
                        <template slot="label"><span class="form-label">原价</span></template>
                        <InputNumber placeholder="售价必须小于等于定价" v-model="form.original_price"></InputNumber>
                    </FormItem>
                    <FormItem prop="price" label="实际售价" class="local-right">
                        <InputNumber placeholder="0为免费，单位默认（元）" v-model="form.price"></InputNumber>
                    </FormItem>
                    <FormItem class="item-radio" required label="有效期限">
                        <div class="validity-term">
                        <RadioGroup class="item-radio-groups" v-model="form.validity_term_state" style="min-width: 145px;">
                            <Radio :label="0">
                                <span>永久有效</span>
                            </Radio>
                            <Radio :label="1">
                                <span>限时</span>
                            </Radio>
                        </RadioGroup>
                        <div  v-if="form.validity_term_state">
                            <div style="display:flex">
                                 <RadioGroup v-model="form.validity_term_type" :label="0" style="width: 90px;">
                                    <Radio :label="0"><span>单独失效</span></Radio>
                                    <Radio :label="1"><span>统一失效</span></Radio>
                                </RadioGroup>
                               <div style="display: flex;flex-direction: column;">
                                <div style="display:flex;margin-bottom: 3px;">
                                    <InputNumber v-model="form.validity_term_value"/>
                                    <Select v-model="form.validity_term_unit">
                                        <Option v-for="item in selectList5" :value="item.title" :key="item.id">{{item.title}}</Option>
                                    </Select>
                                </div>
                                <DatePicker @on-change="changeValidityTerm" v-model="form.all_validity_term_value" format="yyyy/MM/dd HH:mm" type="datetime" placeholder="选择失效时间"></DatePicker>
                               </div>
                            </div>
                        </div>
                        </div>
                    </FormItem>
                    <FormItem class="item-radio" required label="学习次数">
                        <RadioGroup class="item-radio-groups" v-model="form.study_mode" style="min-width: 150px; width: 60%">
                            <Radio :label="0"><span>不限制</span></Radio>
                            <Radio :label="1"><span>限制</span></Radio>
                        </RadioGroup>
                        <div v-if="form.study_mode">
                            <InputNumber :min="0" v-model="form.study_count"/>
                        </div>
                    </FormItem>
                    <FormItem class="item-radio" required label="报名条件">
                        <RadioGroup class="item-radio-groups" v-model="form.enroll_condition_state" style="min-width: 150px; width: 60%">
                            <Radio :label="0"><span>无</span></Radio>
                            <Radio :label="1"><span>有</span></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem class="item-radio" required label="培训提醒" >
                        <RadioGroup class="item-radio-groups" v-model="form.warn_state" style="min-width: 150px; width: 60%">
                            <Radio :label="0">
                                <span>无</span>
                            </Radio>
                            <Radio :label="1">
                                <span>有</span>
                            </Radio>
                        </RadioGroup>
                        <div class="validity" v-if="form.warn_state" style="cursor: pointer" @click="trainingReminder">
                            <img style="width: 16px;height: 16px;margin-right: 5px;" src="../../../assets/img/institution/save.png" alt="">
                            <div style="font-size: 14px;color: #4098ff">编辑培训提醒</div>
                        </div>
                    </FormItem>
                    <FormItem class="item-radio" required label="产品评价" >
                        <RadioGroup class="item-radio-groups" v-model="form.evaluate_state" style="min-width: 150px; width: 60%">
                            <Radio :label="0">
                                <span>不评价</span>
                            </Radio>
                            <Radio :label="1">
                                <span>评价</span>
                            </Radio>
                        </RadioGroup>
                        <div class="validity" v-if="form.evaluate_state" style="cursor: pointer" @click="editEvaluate">
                            <img style="width: 16px;height: 16px;margin-right: 5px;" src="../../../assets/img/institution/save.png" alt="">
                            <div style="font-size: 14px;color: #4098ff">编辑评价模版</div>
                        </div>
                    </FormItem>
                    <FormItem required label="课程问答">
                        <div style="display: flex;align-items: center">
                            <Switch v-model="form.qa_state" @on-change="changeQa"/>
                            <div style="margin-left: 10px;">{{form.qa_state ? '开启' : '关闭'}}</div>
                        </div>
                    </FormItem>
                     <FormItem required>
                        <template slot="label"><span class="form-label">弹幕</span></template>
                        <div style="display: flex;align-items: center">
                            <Switch :true-value="1" :false-value="0" v-model="form.barrage_state"/>
                            <div style="margin-left: 10px;">{{form.barrage_state ? '开启' : '关闭'}}</div>
                        </div>
                    </FormItem>
                    <FormItem required label="播放页模板">
                        <RadioGroup v-model="form.play_page_template">
                            <Radio label="white">
                                <span>新版播放页（白底）</span>
                            </Radio>
                            <Radio label="black">
                                <span>旧版播放页（黑底）</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem prop="short_description" label="产品介绍">
                        <template slot="label"><span class="form-label">介绍</span></template>
                        <Input type="textarea" :rows="6" placeholder="请输入产品介绍" v-model="form.short_description"
                               :maxlength="100"></Input>
                        <div class="font-num">{{form.short_description.length}}/100</div>
                    </FormItem>
                    <FormItem label="图片视频" required>
                        <template slot="label"><span class="form-label">封面</span></template>
                        <div class="demo-file">
                            <div v-if="form.imgList.length>0">
                                <div v-if="form.imgList.length>1">
                                    <Carousel autoplay v-model="fileValue">
                                        <CarouselItem v-for="(t,i) in form.imgList" :key="i">
                                            <div class="demo-carousel">
                                                <img @click="deleteImgList(i)"
                                                     src="../../../assets/img/close-icon.png"
                                                     class="upload-img-main-icon"/>
                                                <!-- <Icon @click="deleteImgList(i)" class="upload-img-main-icon" type="ios-close-circle" /> -->
                                                <img class="upload-img-item" :src="t"/>
                                            </div>
                                        </CarouselItem>
                                    </Carousel>
                                </div>
                                <div v-if="form.imgList.length===1" class="demo-carousel">
                                    <img @click="deleteImgList(0)" src="../../../assets/img/close-icon.png"
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
                                <img src="../../../assets/img/img-video.png"/>
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
                </Form>
            </div>
            <div slot="right" style="height: 100%;">
                <Tabs class="tab-produce" v-model="panes">
                    <TabPane label="产品详情" name="name1">
                        <new-editor v-if="panes == 'name1'" style="height: calc(100% - 10px);margin-top: 10px" @get-content="getContent" @editor-change="editorChange"
                        :editor-id="editorId" :content="content" class="new-editor"/>
                    </TabPane>
                    <TabPane label="培训须知" name="name2">
                        <new-editor v-if="panes == 'name2'" style="height: calc(100% - 10px);margin-top: 10px" @get-content="getContent2" @editor-change="editorChange"
                        :editor-id="enrollmentAgreement" :content="enroll_agreement" class="new-editor"/>
                    </TabPane>
                    <TabPane v-if="form.enroll_condition_state" label="报名条件" name="name3">
                        <new-editor v-if="panes == 'name3'" style="height: calc(100% - 10px);margin-top: 10px" @get-content="getContent3" @editor-change="editorChange"
                        :editor-id="enrollCondition" :content="enroll_condition" class="new-editor"/>
                    </TabPane>
                </Tabs>
            </div>
        </NewLayout>
        <evaluateModal @handle-cancel="evaluateClose" :isShow="isShow" @evaluateSave="evaluateSave" :product_evaluate="form.product_evaluate" />
        <FormModal :modal-false="true" :detail-data="tableRow" @from-submit="handleSubmitWarn" :show-modal='show'
              :labelWidths="110"  :form-list="formList"   @close="closeModal" title="培训提醒编辑" :rule-validate="trainingReminderRules"/>
        <Modal v-model="saleShow" title="产品待售信息编辑" footer-hide @on-cancel="cancelSale">
            <Input type="textarea" :rows="6" v-model="willSaleInfo" placeholder="请输入产品待售信息"></Input>
            <Button style="width: 130px;margin-top: 16px;margin-left: calc(50% - 65px)" @click="saleSave" type="primary">保存</Button>
        </Modal>
    </div>
</template>

<script>
    import NewLayout from '../../../components/NewLayout'
    import screen from '../../../components/ScreenFrame'
    import BaseInput from '../../../components/BaseInput'
    import UploadPanel from '../../../components/UploadPanel'
    import BaseList from '../../../components/BaseList'
    import {RemoveModal} from '../../dialogs/mixins'
    import {mapActions, mapState, mapGetters} from 'vuex'
    import {MPop} from '../../../components/MessagePop'
    import UploadBtn from '../../../components/UploadButton'
    import iconFont from '../../../assets/icons/icon/font.png'
    import iconColor from '../../../assets/icons/icon/color.png'
    import iconCopy from '../../../assets/icons/icon/photo.png'
    import postData from '../../../api/postData';
    import NewEditor from '../../../components/NewEditor'
    import {classification2} from '../../ProductManage/production/consts'
    import evaluateModal from './com/evaluateModal'
    import uploadImg from '../../mixins/uploadImg'
    import FormModal from '../../../components/FormModal'
    import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'

    export default {
        mixins: [RemoveModal, MPop, uploadImg, FormModalMixin],
        components: {FormModal, NewLayout, screen, 'base-input': BaseInput, 'upload-panel': UploadPanel, 'data-list': BaseList, UploadBtn, NewEditor, evaluateModal},
        props: {
            remove: {
                type: String
            },
            payload: {}
        },
        data() {
            return {
                willSaleInfo: '',
                saleShow: false,
                tableRow: {},
                formList: [
                    { type: 'input', name: '培训提醒标题',  field: 'title', maxlength: 40},
                    { type: 'textarea', name: '培训提醒内容',  field: 'description', maxlength: 400 },
                ],
                trainingReminderRules:{
                    title: [{ required: true, message: '请输入培训提醒标题', trigger: 'blur' } ],
                    description: [{ required: true, message: '请输入培训提醒内容', trigger: 'blur' } ],
                },
                panes: 'name1',
                enroll_condition: '',
                enroll_agreement: '',
                fileValue: 0,
                iconFont, iconColor, iconCopy,
                layoutNav: '培训管理 > 产品列表 > 添加培训',
                title: '添加培训',
                btnName: '保存',
                form: {
                    play_page_template: 'white',
                    will_sale_info: '',
                    barrage_state: 1,
                    study_count: 0,
                    study_mode: 0,
                    enroll_condition_state: 0,
                    edit_state: 0,
                    unlock_type: '',
                    product_id: '',
                    state: null,
                    title: '',
                    price: 0,
                    original_price: 0,
                    short_description: '',
                    description: '',
                    enroll_agreement: '',
                    enroll_condition: '',
                    url_arr: '',
                    redirectType: false,
                    curriculum_id: null,
                    imgList: [],
                    video_url: '',
                    organization_id: null,
                    _fn: null,
                    duration: 0,
                    model: '',
                    validity_term_state: 0,
                    validity_term_type: 0,
                    all_validity_term_value: '',
                    evaluate_state : 0,
                    warn_state: 0,
                    warn_content: '',
                    validity_term_unit: '年',
                    qa_state: 0,
                    validity_term_value: 0,
                    product_evaluate: [],
                },
                rules: {
                    organization_id: {required: true, message: '请选择所属机构'},
                    title: {required: true, message: '请选择产品名称', trigger: 'blur'},
                    original_price: {required: true, message: '请输入原价'},
                    price: {required: true, message: '请输入实际售价'},
                    unlock_type: {required: true, message: '请选择解锁方式'},
                    model: {required: true, message: '请选择展示模式'},
                    state: {required: true, message: '请选择产品状态'},
                    short_description: {required: true, message: '请输入产品介绍', trigger: 'blur'},
                    category_id: {required: true, message: '请选择产品分类'},
                },
                fromLabelWidth: 96,
                organizationList: null,
                selectList3: classification2,
                selectList1: [{id: 0, title: '不限'}, {id: 1, title: '按课程'}, {id: 2, title: '按章节'}, {
                    id: 3,
                    title: '按视频'
                }],
                selectList4: [{id: 1, title: '展示单品'}, {id: 2, title: '展示合集'}, {id: 3, title: '单品合集同时展示'}],
                selectList2: [{id: 2, title: '上架'}, {id: -1, title: '下架'}, {id: 1, title: '测试'}, {id: 4, title: '待售'}],
                selectList5: [{id: 1, title: '年'},{id: 2, title: '月'},{id: 3, title: '日'}],
                imgType: 1,
                fileType: 'image/png,image/jpg,video/mp4',
                showAll: 2,
                editorId: 'form-item-new-editer' + Math.floor(Math.random() * 10000 + 1),
                enrollmentAgreement: 'form-item-new-editer-enrollment-agreement' + Math.floor(Math.random() * 10000 + 1),
                enrollCondition: 'form-item-new-editer-enroll-condition' + Math.floor(Math.random() * 10000 + 1),
                content: '',
                isShow: false,
                organizationId: '',
                formCategory: '',
                formState: '',
                product_evaluate: [],
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
            },
            isEdit(){
                return this.$route.name === 'edit-production'
            }
        },
        methods: {
            ...mapActions(['add_production', 'update_production', 'change_certificate_list']),
             informationSale(){
                this.willSaleInfo = this.form.will_sale_info
                this.saleShow = true
            },
            saleSave(){
                this.form.will_sale_info = this.willSaleInfo
                this.willSaleInfo = ''
                this.saleShow = false
            },
            cancelSale(){
                this.saleShow = false
            },
            changeValidityTerm(val){
                this.form.all_validity_term_value = val
            },
            trainingReminder(){
                this.show = true
                if(this.form.warn_content && typeof this.form.warn_content == 'string'){
                    this.tableRow = JSON.parse(this.form.warn_content)
                }
            },
            handleSubmitWarn(val){
                this.form.warn_content = JSON.stringify(val)
                this.show = false
            },
            handleBack() {
                this.$router.go(-1)
            },
            setMsg(filed, text){
                let bool = false
                if(this.form[filed] && this.form[filed] != '<p><br></p>') bool = true
                else this.$Message.info('请输入' + text + '！')
                return bool
            },
            isValid(){
                let bool = false
                // if(this.isStateValid('validity_term_type', 0, 'validity_term_value', '请选择单独失效时间')){
                //     if(this.isStateValid('validity_term_type', 1, 'all_validity_term_value', '请选择统一失效时间')){
                        if(this.isStateValid('warn_state', 1, 'warn_content', '请编辑培训提醒')){
                            if(this.isStateValid('evaluate_state', 1, 'product_evaluate', '请编辑评价模板')){
                                if(this.setMsg('description', '产品详情')){
                                    if(this.setMsg('enroll_agreement', '培训须知')){
                                        if(this.form.enroll_condition_state) {
                                            if(this.setMsg('enroll_condition', '报名条件')) bool = true
                                        }else bool = true
                                    }
                                }
                            }
                        }
                //     }
                // }
                return bool
            },
            isStateValid(state, stateValue, val, text){
                if(this.form[state] == stateValue){
                    if(this.form[val]) {
                        if(val == 'product_evaluate'){
                            if(this.form.product_evaluate.length>0&&this.form.product_evaluate[0].evaluate_content){
                                return true
                            }else this.$Message.info(text)
                        }else return true
                    }else {
                        this.$Message.info(text)
                        return false
                    }
                }else return true
            },
            handleClick() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let arrObj = {
                            default: this.form.imgList,
                            video: this.form.video_url,
                            video_img: this.video_img
                        }
                        // if(this.$config.isRoleSuper())  this.form.organization_id = this.organizationId;
                        if(this.form.imgList.length>0 || this.form.video_url){
                            this.form.url_arr = JSON.stringify(arrObj);
                            this.form.description = this.content
                            this.form.enroll_agreement = this.enroll_agreement
                            if(this.form.all_validity_term_value){
                                this.form.all_validity_term_value = this.$config.formatTimeHM(this.form.all_validity_term_value)
                            }
                            if(this.form.enroll_condition_state) this.form.enroll_condition = this.enroll_condition
                            if(this.$route.name == 'creat-production') {
                                console.log(this.form,'this.form');
                                if(this.isValid()) this.add_production(this.form)
                            } else {
                                if(this.isValid()){
                                    console.log(this.form, 'LKL');
                                    this.form.product_id = this.form.id;
                                    this.update_production(this.form)
                                }
                            }
                        }else this.$Message.info('请上传封面!')
                    }
                })
            },
            evaluateClose() {
                this.isShow = false
            },
            evaluateSave(trainList) {
                trainList.map(t => t.product_id = this.form.id)
                this.form.product_evaluate = trainList
                this.isShow = false
            },
            editEvaluate() {
                this.isShow = true
            },
            getContent(val) {
                this.content = val
            },
            getContent2(val) {
                this.enroll_agreement = val
            },
            getContent3(val) {
                this.enroll_condition = val
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
                    let d = i == 0 ? 0 : i - 1
                    this.fileValue = d
                    this.form.imgList.splice(i, 1)
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
                        this.imgType = 1
                        if (this.form.imgList.length < 5) {
                            this.form.imgList.push(v.url)
                            this.$forceUpdate()
                        }
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
                    // const FILE1 = canvas.toDataURL("image/jpeg", 1);
                    // console.log(FILE1,'FILE1')
                    // this.handleGetassignKey(FILE1)
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
            changeQa() {},
            handlePreStep() {
                this.fromLabelWidth = 96
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
        },
        created() {
            console.log(this.payload,'this.payload');
            if(this.payload) {
                if(JSON.parse(this.payload.row.url_arr).default.length) this.fileType = 'image/png,image/jpg'
                else this.fileType = 'video/mp4'
            }
            if(this.$route.name == 'edit-production') {
                this.form = JSON.parse(sessionStorage.getItem('PRODUCTINFO'))
                this.form.qa_state = Boolean(+this.form.qa_state)
                this.content = this.form.description
                this.enroll_agreement = this.form.enroll_agreement
                this.enroll_condition = this.form.enroll_condition_state ? this.form.enroll_condition : ''
                let arrObj = JSON.parse(this.form.url_arr);
                this.form.imgList = [ ...arrObj.default]
                this.form.video_url = arrObj.video
                console.log(this.form, 'DAD')
                PostData('product/getEvaluateByProduct', {product_id: this.form.id}).then(res => {
                    if(res.res_code == 1) {
                        this.form.edit_state = res.data.product_evaluate.length>0 ? 1 : 0
                        this.form.product_evaluate = res.data.product_evaluate
                    }
                })
            }
            this.organizationList = null
            if (JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1) {
                this.getOrganization()
            }
            // if (this.payload && this.payload.hasOwnProperty('type') && this.payload.type == 2) {
            //     let d = this.payload.row
            //     this.form.title = d.title;
            //     this.form.original_price = d.original_price;
            //     this.form.price = d.price;
            //     this.form.short_description = d.short_description;
            //     this.form.unlock_type = d.unlock_type;
            //     this.form.state = d.state;
            //     this.form.model = d.model
            //     let arrObj = JSON.parse(d.url_arr);
            //     this.form.imgList = [...this.form.imgList, ...arrObj.default]
            //     this.form.video_url = arrObj.video
            //     this.form.product_id = d.id
            //     this.form.organization_id = d.organization_id
            //     this.form.category_id = d.category_id
            //     this.content = d.description
            //     // this.descriptionHtml = d.description.replace('class="form-message"','')
            //     // this.form.organization_id = this.organization_id
            // }
            let vm = this
            this.form._fn = function () {
                vm.$Message.success('保存成功')
                vm.$router.go(-1)
            }
        },
    }
</script>

<style scoped lang="less">
    .validity-term{
        display: flex;
        flex-direction: column;
    }
    .item-radio{
        /deep/ .ivu-form-item-content, .item-radio-groups{
            display: flex;
            justify-content: flex-start;
        }
    }
    .tab-produce{
       height: 100%;
       /deep/ .ivu-tabs-content{
           height: calc(100% - 60px);
       }
    }
    .screen{
        background-color: #fff;
        height: 50px;
    }
    .demo-carousel{
        position: relative;
    }
    .demo-file-key{
        height: 206px;
        border: 1px solid #D4D7E3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        p{
            font-size: 12px;
            color: #C0C4DA;
        }
    }
    .upload-img-item{
        width: 100%;
    }
    .icons {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 20px;
        z-index: 1001;
        cursor: pointer;
    }

    .upload-img-main-icon {
        color: #fff;
        .icons;
    }
    .upload-img-text{
        font-family: PingFangSC-Regular;
        font-size: 10px;
        color: rgb(164,166,183);
        letter-spacing: 0;
        text-align: justify;
        line-height: 16px;
    }
    .local-left{
        width: 47%;
        display: inline-block
    }
    .local-right{
        width: 48%;
        display: inline-block;
        margin-left: 10px;
    }
    .validity{
        display: flex;
        flex: 1;
        align-items: center;
        min-width: 151px;
        /deep/ .ivu-input-number{
            border-radius: 4px 0 0 4px;
            border-right: none;
        }
        /deep/ .ivu-select-selection{
            border-radius: 0 4px 4px 0;
        }
    }
    .font-num{
        position: absolute;
        bottom: 0;
        right: 6px;
    }
    /deep/ .imgtypes-btn{
        margin: 0 0 0 auto;
    }
</style>

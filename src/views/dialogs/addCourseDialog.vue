<template>
    <Modal :transfer=false :title="stateName == 1 ? '添加课程' : '编辑课程'" :footer-hide="true" 
           v-model="addCourseDialogVisible" @on-cancel="handleRemoveModal(remove)" size="auto" width="654"
           :mask-closable="false">
        <!-- 评价弹窗 @on-cancel="handleCancel" -->
         <Modal title="课程评价" v-model="show" width="654" :footer-hide="true">
            <div style="width: 520px;height: 472px;overflowY:auto">
                <div style="height:30px">
                    <span style="float:right;color:#2d8cf0;cursor:pointer" @click="addOneEvaluate">添加评价</span>
                </div>
                <div style="display: flex;flex-direction: column;align-items: center">
                    <div v-for="(item, index) in courseList" :key="index" style="margin-top: 20px;">
                        <span style="width: 22px;font-size: 15px;margin-right: 5px;display: inline-block">{{index + 1}}、</span>
                        <Input v-model="item.evaluate_content" style="width: 410px;"/>
                        <span v-if="index!=0" style="color:#2d8cf0;cursor:pointer" @click="deleteOneEvaluate(index)">删除</span>
                        <span v-else style="color:#fff;">删除</span>
                    </div>
                </div> 
            </div>
            <div style="display: flex;justify-content: center">
                <Button type="primary" style="width: 130px;margin-top: 30px;" @click="handleSubmitEvaluate">保存</Button>
            </div>
        </Modal>
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top" v-if="dialogIndex==1">
                    <Form class="add-course-form" :label-position="labelPosition" :label-width="120"
                          :rules="ruleValidate" ref="form" :model="form">
                        <FormItem label="课程前端样式" prop="catalog_show_type">
                            <Select v-model="form.catalog_show_type" placeholder="请选择课程前端样式">
                                <Option v-for="item in catalogTypeList" :key="item.id" :label="item.name" :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="课程名称" prop="title">
                            <Input v-model="form.title" placeholder="请输入课程名称"></Input>
                        </FormItem>
                        <FormItem label="课程讲师" prop="teacher_id" class="local-left">
                            <Select v-model="form.teacher_id" placeholder="请选择讲师">
                                <Option v-for="item in teacherList" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem class="local-right">
                            <template slot="label"><span class="form-label-taech">导师</span></template>
                            <Select v-model="form.instructor_id" placeholder="请选择导师">
                                <Option v-for="item in tutorList" :key="item.id" :label="item.realname"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem class="local-left">
                            <template slot="label"><span class="form-label-taech">科室</span></template>
                            <Select v-model="form.department_id" placeholder="请选择科室">
                                <Option v-for="item in detpysList" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem class="local-right">
                            <template slot="label"><span class="form-label-taech">年级</span></template>
                            <Select v-model="form.grade_id" placeholder="请选择年级">
                                <Option v-for="item in gradesList" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="解锁方式" prop="unlock_type" class="local-left">
                            <Select v-model="form.unlock_type" placeholder="请选择解锁方式">
                                <Option v-for="item in clearList" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        
                        <FormItem label="课程状态" prop="state" class="local-right">
                            <Select v-model="form.state" placeholder="请选择课程状态">
                                <Option v-for="item in query_state_list" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="课程评价" prop="evaluate_state" >
                            <div style="display:flex">
                            <RadioGroup v-model="form.evaluate_state" class="item-radio-groups"  style="min-width: 150px; width: 60%">
                                <Radio :label="0">
                                    <span>不评价</span>
                                </Radio>
                                <Radio :label="1">
                                    <span>评价</span>
                                </Radio>
                            </RadioGroup>
                            <div v-if="form.evaluate_state" class="validity" style="display:flex;align-items:center;cursor: pointer" @click="editEvaluate">
                                <img style="width: 16px;height: 16px;margin-right: 5px;" src="../../assets/img/institution/save.png" alt="">
                                <div style="font-size: 14px;color: #4098ff">编辑评价模版</div>
                            </div>
                            </div>
                        </FormItem>
                        <FormItem label="课程介绍" prop="description">
                            <Input type="textarea" :rows="7" placeholder="请输入课程介绍" :maxlength="100" v-model="form.description"></Input>
                            <div class="font-num">{{form.description.length}}/100</div>
                        </FormItem>
                        
                        <FormItem ref="upload" label="展示封面" required>
                            <upload-panel ref="upload_panel" :resourse="form.img_default" :upload-config="uploadConfig"
                                            @uploadcomplete="handleDefaultUploadComplete" :maxFileSize="2" types="image/jpg, image/jpeg, image/png">
                                <span slot="file-require" class="font-hint">*只能上传 jpg/png 文件，且图片比例为16:9，建议尺寸768*432px</span>
                            </upload-panel>
                        </FormItem>
                        <FormItem class="btns">
                            <Button type="primary" class="next-btn" @click="handleSubmit">保存</Button>
                        </FormItem>
                    </Form>
                </Row>
                <Row v-if="dialogIndex==2">
                    <Row class="primary-course">
                        <Col :span="12">
                            <Row class="course-list-container">
                                <Row class="un-top-course">
                                    <Col :span="12">可选课程</Col>
                                </Row>
                                <Row class="course-list">
                                    <CheckboxGroup v-model="unchecked_top_courses"
                                                   @on-change="handleCheckedCitiesChange" class="course-item">
                                        <Checkbox class="course-option"
                                                  v-for="(item, index) in query_replace_online_course_list"
                                                  :key="item.id" :label="item._index">
                                            <span class="course-num">{{item._index}}</span>{{item.title}}
                                        </Checkbox>
                                    </CheckboxGroup>
                                </Row>
                            </Row>
                        </Col>
                        <Col :span="12">
                            <Row class="course-list-container">
                                <Row class="top-course">
                                    <Col :span="12">已选课程</Col>
                                </Row>
                                <Row class="course-list">
                                    <CheckboxGroup v-model="checked_top_courses"
                                                   @on-change="handleUnCheckedCitiesChange" class="course-item">
                                        <Checkbox class="course-option" v-for="(item, index) in top_course_list"
                                                  :key="item.id" :label="item._index">
                                            <span class="course-num">{{item._index}}</span>{{item.title}}
                                        </Checkbox>
                                    </CheckboxGroup>
                                </Row>
                            </Row>
                        </Col>
                    </Row>
                    <Row class="btns">
                        <!-- {{this.result_msg1}}
                        <Button type="text" @click="dialogIndex = 1" class="pre-btn">上一步</Button> -->
                        <Button type="primary" class="public-btn" @click="handleSubmit">保存</Button>
                    </Row>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
    import BaseInput from '../../components/BaseInput'
    import {RemoveModal} from './mixins'
    import UploadPanel from '../../components/UploadPanel'
    import {mapActions, mapState} from 'vuex';
    import {doTimeFormat} from '../../components/Util'
    import {MPop} from '../../components/MessagePop'
    import postData from '../../api/postData'
    const validateState = (rule, value, callback) => {
        if(value) callback()
        else callback(new Error('请选择课程状态'))
    };
    export default {
        mixins: [RemoveModal, MPop],
        props: {
            remove: {type: String},
            payload: {}
        },
        data() {
            return {
                show: false,
                courseList: [
                    {evaluate_content: ''},
                ],
                courseRadioList: [
                    {title: '优秀', id: 1},
                    {title: '良好', id: 2},
                    {title: '一般', id: 3},
                    {title: '差', id: 4},
                ],
                courseRadio: '',
                trainRadio: '',
                addTestContentDialog:true,
                addCourseDialogVisible: true,
                videoManageDialog: true,
                stateName: 1,
                catalogTypeList: [{id: 1, name : '仅视频课程'}, {id: 2, name : '仅链接课程'}, {id: 3, name : '视频+链接课程'}],
                form: {
                    evaluate_state: 0,
                    curriculum_evaluate: [],
                    title: '',
                    catalog_show_type: '',
                    teacher_id: '',
                    start_time: new Date(),
                    end_time: new Date(),
                    subject_id: 0,
                    grade_id: 0,
                    state: this.payload.hasOwnProperty('row') && this.payload.row.state || 0,
                    img_default: '',
                    img_3_8: '',
                    img_url_arr: null,
                    description: '',
                    orderby: 0,
                    curriculum_roles: [0],
                    pre_curriculum_ids: [],
                    data_center_id: 0,
                    unlock_type: this.payload.hasOwnProperty('row') && this.payload.row.unlock_type || JSON.parse(sessionStorage.getItem('PRODUCTINFO')).unlock_type
                },
                newData: {
                    show: false,
                    name: '',
                    download_url: '',
                    type: 1,
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
                teacherList: [],
                detpysList: [],
                gradesList: [],
                tutorList: [],
                clearList: [
                    {
                        id: 0,
                        name: '不限'
                    },
                    {
                        id: 2,
                        name: '按章节解锁'
                    },
                    {
                        id: 3,
                        name: '按视频解锁'
                    }
                ],
                ruleValidate: {
                    title: [
                        {required: true, message: '请输入课程名称', trigger: 'blur'}
                    ],
                    teacher_id: [
                        {required: true, message: '请选择课程讲师'}
                    ],
                    catalog_show_type: [{required: true, message: '请选择课程前端样式'}],
                    // instructor_id: [
                    //     {required: true, message: '请选择导师'}
                    // ],
                    // department_id: [
                    //     {required: true, message: '请选择科室'}
                    // ],
                    // grade_id: [
                    //     {required: true, message: '请选择年级'}
                    // ],
                    unlock_type: [
                        {required: true, message: '请选择解锁方式'}
                    ],
                    state: [
                        {required: true, validator: validateState}
                    ],
                    description: [
                        {required: true, message: '请输入课程介绍', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            if(JSON.parse(sessionStorage.getItem('PRODUCTINFO')).unlock_type == 2) this.clearList = this.clearList.slice(1,3)
            else if(JSON.parse(sessionStorage.getItem('PRODUCTINFO')).unlock_type == 3) this.clearList = this.clearList.slice(2,3)
            this.stateName = this.payload.state
            this.getListTeacher()
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
                    item._index = index < 9 ? '0' + (index + 1) : '' + (index + 1)
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
        },
        methods: {
            ...mapActions([
                'get_role_list',
                'get_online_curriculum_list',
                'add_online_curriculum',
                'edit_online_curriculum',
                'add_course_download_data',
                'get_curriculum_donwload_data_list'
            ]),
            addOneEvaluate(){},
            deleteEvaluate(){},
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
            isValid(){
                if(this.form.evaluate_state == 1){
                    console.log(this.form,'KM')
                    if(this.form.curriculum_evaluate.length>0&&this.form.curriculum_evaluate[0].evaluate_content){
                        return true
                    }else {
                        this.$Message.info('请编辑评价模板')
                        return false
                    }
                }else return true
            },
            handleSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if(this.isValid()){
                            if (this.form.img_default) {
                                var vm = this;
                                this.form._fn = function () {
                                    vm.handleClose();
                                    vm.showPop('保存成功！', 1000);
                                };
                                this.getName([{
                                    list: this.teacherList,
                                    id: this.form.teacher_id,
                                    name: 'teacher_name'
                                }, {
                                    list: this.detpysList,
                                    id: this.form.department_id,
                                    name: 'department_name'
                                }, {list: this.gradesList, id: this.form.grade_id, name: 'grade_name'}])
                                this.form.page = this.payload.page
                                this.form.product_id = this.payload.product_id
                                if(this.form.instructor_id == 'all')  this.form.instructor_id = ''
                                if (this.stateName == 1) {
                                    this.add_online_curriculum(this.form)
                                } else {
                                    this.edit_online_curriculum({data: this.form});
                                    this.addCourseDialogVisible = false
                                }
                            } else this.$Message.info('请上传展示封面')
                        }
                    }
                })
            },
            handleRemove(file, fileList) {
            },
            handlePreview(file) {
            },
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
            },
            getListTeacher() {
                postData('components/getTeachers', {organization_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).organization_id}).then((res) => {
                    this.teacherList = res.data
                })
                postData('components/getDepts').then((res) => {
                    this.detpysList = res.data
                })
                postData('components/getGrades').then((res) => {
                    this.gradesList = res.data
                })
                postData('components/getInstructors', {organization_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).organization_id}).then(res => {
                    if(res.res_code==1){
                            this.tutorList = res.data
                    }
                    if (this.payload.modify === 0) {
                        let d = this.payload.row
                        this.form = d
                        this.form.img_default = d.img_url
                        if(!d.hasOwnProperty('curriculum_evaluate')){
                            this.form.curriculum_evaluate = []
                        }
                        this.form.edit_state = this.form.curriculum_evaluate.length>0 ? 1 : 0
                        console.log(this.form,'this.form')
                    }else{
                        this.form.edit_state = 0
                    }
                })
            },
            getName(arr) {
                arr.forEach((item, index) => {
                    item.list.forEach(it => {
                        if (item.id == it.id) {
                            this.form[item.name] = it.name
                        }
                    })
                })
            },
            // 课程评价
            editEvaluate(){
                this.show = !this.show
                if(this.form.curriculum_evaluate.length>0) this.courseList = this.form.curriculum_evaluate
            },
            addOneEvaluate(){
                this.courseList.push({
                    evaluate_content:""
                })
            },
            deleteOneEvaluate(index){
                this.courseList.splice(index,1)
            },
            handleSubmitEvaluate(){
                this.courseList.map((item, index) => {
                    item.evaluate_index = index + 1
                    item.type = 2
                    item.product_id = this.payload.product_id
                })
                this.form.curriculum_evaluate = this.courseList
                this.show = false
            }
        }
    }
</script>
<style scoped lang="less">
    /deep/ .ivu-form-item-error-tip {
        padding: 0;
    }

    /deep/ .upload-panel .img img {
        height: 250px;
    }

    /deep/ .ivu-modal-header {
        background-color: #ffffff !important;
        padding: 22px 16px;
    }

    /deep/ .ivu-modal-header-inner {
        font-family: PingFangSC-Regular;
        font-size: 20px !important;
        color: #474C63 !important;
        letter-spacing: 0;
    }

    /deep/ .ivu-modal-close .ivu-icon-ios-close {
        color: #9397AD !important;
        font-size: 42px !important;
    }

    /deep/ .ivu-form-item {
        margin-bottom: 15px;
    }

    /deeep/ .upload-panel .upload-space {
        height: 250px !important;
    }

    /deep/ .ivu-modal-body {
        padding: 30px 50px;
    }

    .btns {
        text-align: center;

        /deep/ .ivu-form-item-content {
            display: flex;
            justify-content: center;
            margin: 0 !important;
        }

        .next-btn {
            width: 170px;
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
    .font-hint{
        color: #F54802;
    }
    .form-label-taech{
        margin-left: 11px;
        letter-spacing: 14px;
    }
    .font-num {
        display: inline-block;
        position: absolute;
        top: 122px;
        right: 18px;
    }
    .local-left{
        width: 269px;
        display: inline-block
    }
    .local-right{
        width: 269px;
        display: inline-block;
        margin-left: 10px;
    }
</style>

<template>
    <Modal :transfer=false v-model="addOfflineSemesterDialog" :title="payload.type == 2 ? '编辑学期' : '添加学期'"
           @on-cancel="removeModalActive" size="auto"
           :footer-hide="true" :mask-closable="false" :styles="{width: '860px'}" style="border-radius:6px !important"
           :closable="true">
        <base-input :baseInputWidth="860" @closedialog="handleClose">
            <Row slot="body">
                <Form ref="myForm1" class="top-nav" label-position="left" :rules="rules1" :model="form1"
                      :label-width="80">
                    <FormItem label="学期名称" prop="title">
                        <Input v-model="form1.title" placeholder="请输入学期名称"></Input>
                    </FormItem>
                    <FormItem label="学期描述" class="semester-description" prop="description">
                        <Input type="textarea" :rows="8" placeholder="请输入学期描述内容" v-model="form1.description"
                         :maxlength="100"></Input>
                        <div class="font-num">{{form1.description.length}}/100</div>
                    </FormItem>
                    <div class="form-item-semester">
                        <FormItem class="item-semester" prop="tutor_id">
                            <template slot="label"><span class="form-label-taech">导师</span></template>
                            <Select v-model="form1.tutor_id" placeholder="请选择导师">
                                <Option v-for="(m,i) in teacherList" :key="i" :value="m.id">{{m.realname}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem class="item-semester item-semester2" label="开课日期" prop="stage1">
                            <DatePicker v-model="form1.stage1" type="daterange" format="yyyy/MM/dd"
                            placeholder="请选择时间范围" transfer></DatePicker>
                        </FormItem>
                    </div>
                    <div class="form-item-semester">
                        <FormItem class="item-semester" label="报名上限" prop="sign_limit">
                            <InputNumber :min="0" v-model="form1.sign_limit"></InputNumber>
                        </FormItem>
                        <FormItem class="item-semester item-semester2" label="报名截止" prop="register_end_time">
                            <DatePicker v-model="form1.register_end_time" type="date" format="yyyy/MM/dd"
                                placeholder="请选择报名截止" :picker-options="pickerOptions"
                                @on-change='changeDeadlineHandler' transfer></DatePicker>
                        </FormItem>
                    </div>
                    <div class="form-item-course" v-for="(t,index) in form1.offlineCurriculums" :key="index" >
                        <div class="item-course">
                            <span class="item-course-left"><span
                                    class="item-course-title">课程{{$config.addZero(index+1)}}</span>{{t.title}}</span>
                            <span class="item-course-rigth">{{t.type == 1 ? '讲座' : t.type == 2 ? '实践' : '考试'}} | {{t.teacher_name}}</span>
                        </div>
                        <div class="item-course2">
                            <FormItem class="item-course2-time" label="上课时间" :prop="'offlineCurriculums.' + index + '.class_start_time'" 
                            :rules="{required: true, message: '请选择上课时间'}">
                                <DatePicker class="class-time" v-model="class_start_times" type="datetime"
                                @on-change="changeStartDay(index)" transfer format="yyyy-MM-dd HH:mm" placeholder="请选择上课时间"></DatePicker>
                            </FormItem>
                            <FormItem class="item-course2-address" label="上课地点" :prop="'offlineCurriculums.' + index + '.class_address'" 
                            :rules="{required: true, message: '请输入上课地点'}">
                                <Input v-model="t.class_address" placeholder="请输入上课地点"></Input>
                            </FormItem>
                        </div>
                        <div class="item-course2">
                            <FormItem class="item-course2-time" label="签到方式" :prop="'offlineCurriculums.' + index + '.class_sign_way'" 
                            :rules="{required: true, message: '请选择签到方式'}">
                                <Select class="class-time" v-model="t.class_sign_way" >
                                    <Option v-for="item in wayList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem class="item-course2-address" label="签到地点" :prop="'offlineCurriculums.' + index + '.class_sign_local'" 
                            :rules="{required: true, message: '请选择签到地点'}">
                                <Select class="class-time" v-model="t.class_sign_local">
                                    <Option v-for="item in localList" :value="item.id" :key="item.id">{{ item.location_name }}</Option>
                                </Select>
                            </FormItem>
                        </div>
                    </div>
                    <div style="text-align: center">
                        <Button style="margin: 40px 227px" type="primary" class="sub-btn"
                                @click="handleSubmit('myForm1')">保存
                        </Button>
                    </div>
                </Form>
            </Row>
        </base-input>
    </Modal>
</template>
<script>
    import BaseInput from '../../components/BaseInput'
    import {RemoveModal} from './mixins'
    import UploadPanel from '../../components/UploadPanel'
    import {mapActions, mapState} from 'vuex'
    import dateFormat from '../../config/dateFormat'
    import {MPop} from '../../components/MessagePop'
    import postData from '../../api/postData.js'
    export default {
        mixins: [RemoveModal, MPop],
        props: {
            remove: {
                type: String
            },
            payload: {}
        },
        components: {'base-input': BaseInput, 'upload-panel': UploadPanel},
        data() {
            return {
                class_start_times: "",
                addOfflineSemesterDialog: true,
                form1: {
                    title: this.payload.row && this.payload.row.title || '',
                    stage1: this.payload.row && [this.payload.row.start_time, this.payload.row.end_time] || [],
                    description: this.payload.row && this.payload.row.description || '',
                    register_end_time: this.payload.row && this.payload.row.register_end_time || null,
                    state: this.payload.row && this.payload.row.state || 0,
                    tutor_id: this.payload.row && this.payload.row.tutor_id,
                    offlineCurriculums: this.payload.offlineCurriculums,
                    sign_limit: this.payload.row && this.payload.row.sign_limit || 500
                },
                teacherList: [],
                rules1: {
                    title: [{required: true, message: '请输入学期名称', trigger: 'blur'}],
                    tutor_id: [{required: true, message: '请选择辅导老师'}],
                    stage1: [{
                        type: 'array',
                        required: true,
                        fields: {
                            0: {type: 'date', required: true, message: '请选择开课日期'},
                            1: {type: 'date', required: true, message: '请选择结课日期'}
                        }
                    }],
                    description: [{required: true, message: '请输入学期描述内容', trigger: 'blur'}],
                    register_end_time: [{type: 'date', required: true, message: '请选择报名截止'}],
                    sign_limit: [{type: 'number', required: true, message: '请输入报名上限'}],
                    offlineCurriculums: []
                },
                wayList: [
                    {title: '一键签到', id: 1},
                    {title: '人脸识别签到', id: 2},
                ],
                localList: []
            }
        },
        computed: {
            ...mapState({
                result_msg1: state => state.offline_curriculum.result_msg,
                offline_term_list1: state => state.offline_curriculum.offline_term_list
            }),
            pickerOptions() {
                var vm = this;
                if (this.form1.stage1 && this.form1.stage1.length > 0) {
                    return {
                        disabledDate(time) {
                            return time.getTime() >= new Date(vm.form1.stage1[0]).getTime();
                        }
                    }
                }
                return {}
            }
        },
        methods: {
            ...mapActions(['get_offline_term_list']),
            clearOfflineCurriculums(){
                this.form1.offlineCurriculums.map((t, i) => {
                    t.class_start_time = ""
                    t.class_sign_way = ""
                    t.class_sign_local = ""
                })
            },
            removeModalActive(){
                this.clearOfflineCurriculums()
                this.handleRemoveModal(this.remove)
            },
            handleClose() {
                this.addOfflineSemesterDialog = false;
            },
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let obj = this.payload.type == 1 ? {subject_id: JSON.parse(sessionStorage.getItem('OffLineClassTheme')).id} : {id: this.payload.row.id}
                        let url = this.payload.type == 1 ? 'product/curriculum_offline_term/addTermAndCurriculums' : 'product/curriculum_offline_term/operateTermAndCurriculums'
                        let course = this.form1.offlineCurriculums || []
                        if(course.length>0){
                            course.map((t) => {
                                t.class_start_time = this.$config.formatTime(t.class_start_time)
                            })
                        }
                        let d = {
                            ...obj,
                            tutor_id: this.form1.tutor_id,
                            title: this.form1.title,
                            description: this.form1.description,
                            start_time: dateFormat(this.form1.stage1[0]),
                            end_time: dateFormat(this.form1.stage1[1]),
                            register_end_time: dateFormat(this.form1.register_end_time),
                            offlineCurriculums: course,
                            sign_limit: this.form1.sign_limit
                        }
                        postData(url, d).then((res) => {
                            if (res.res_code == 1) {
                                this.$Message.success(res.msg);
                                this.addOfflineSemesterDialog = false;
                                let d = {
                                    subject_id: JSON.parse(sessionStorage.getItem('OffLineClassTheme')).id,
                                    page_size: this.payload.page_size,
                                    page_num: this.payload.page_num
                                }
                                this.$store.dispatch('get_offline_term_list', d);
                                this.clearOfflineCurriculums()
                            }
                        })
                    }
                });
            },
            changeStartDay(index){
                if(this.form1.stage1 && this.form1.stage1.length > 0&&this.class_start_times){
                    const [start, end] = this.form1.stage1
                    const start2 = new Date(start).getTime()
                    const end2 = new Date(end).getTime()
                    const active = new Date(this.class_start_times).getTime()
                    if(start2 <= active&&active<=end2){
                        let it = this.form1.offlineCurriculums[index]
                        it.class_start_time = this.class_start_times
                        this.form1.offlineCurriculums.splice(index, 1, it)
                        this.$forceUpdate()
                    }else{
                        this.$Message.warning('上课时间应该在开课日期之间 ！');
                        // this.$Modal.warning({
                        //     title: '提示',
                        //     content: '上课时间应该在开课日期之间 ！'
                        // });
                        this.class_start_times = ""
                    }
                }
            },
            changeDeadlineHandler() {
                if (this.form1.stage1 && this.form1.stage1.length > 0 && this.form1.register_end_time) {
                    if (new Date(this.form1.register_end_time.getTime() - this.form1.stage1[0]).getTime() > (0)) {
                        this.$Modal.warning({
                            title: '提示',
                            content: '截止日期需小于开课日期！'
                        });
                        this.form1.register_end_time = this.payload.row && this.payload.row.register_end_time || null
                    }
                }
            },
            getTeacherList() {
                postData('/components/getInstructors', {organization_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).organization_id}).then((res) => {
                    if (res.res_code == 1) this.teacherList = res.data
                })
            },
        },
        mounted() {
            console.log(this.form1.offlineCurriculums, this.payload.offlineCurriculums);
            this.getTeacherList()
            postData('product/getLocations', {
                organization_id: parseInt(JSON.parse(sessionStorage.getItem('PRODUCTINFO')).organization_id),
                page_num: 1,
                page_size: 9999
            }).then(res => {
                if (res.res_code == 1) this.localList = res.data.data
            })
        }
    }
</script>
<style scoped lang="less">
    .form-label-taech {
        letter-spacing: 14px;
    }

    /deep/ .ivu-modal-body {
        padding: 16px 0;
    }

    .top-nav {
        max-height: 726px;
        padding: 0 40px;
        overflow: hidden;
        overflow-y: auto;
    }

    /deep/ .ivu-btn {
        display: inline-block !important;
    }

    .form-item-semester {
        display: flex;

        .item-semester {
            flex: 1;
        }

        .item-semester2 {
            margin-left: 10px;
        }
    }

    .form-item-course {
        margin-top: 15px;
        background: #F7F7F7;
        border-radius: 4px;
        padding: 10px 15px 0 15px;

        .item-course {
            height: 22px;
            margin-bottom: 20px;
            display: flex;
            position: relative;
            font-size: 16px;
            font-family: PingFangSC-Regular;

            .item-course-left {
                .item-course-title {
                    font-family: PingFangSC-Medium;
                    margin-right: 20px;
                }
            }

            .item-course-rigth {
                position: absolute;
                right: 0;
            }
        }

        .item-course2 {
            display: flex;

            .item-course2-time {
                flex: 1;
            }

            .item-course2-address {
                margin-left: 10px;
                flex: 2;
                margin-bottom: 15px;
            }
        }
    }

    .sub-btn {
        width: 170px;
    }

    .ivu-modal-close .ivu-icon-ios-close, .ivu-modal-close .ivu-icon-ios-close:hover {
        color: #999 !important;
    }

    /deep/ .ivu-modal-close .ivu-icon-ios-close, /deep/ .ivu-modal-close .ivu-icon-ios-close:hover {
        color: #999 !important;
    }

    /deep/ .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: #3DAAFF
    }

    /deep/ .ivu-form-item-content {
        text-align: left;
    }

    /deep/ textarea.ivu-input {
        resize: none;
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
        margin-bottom: 22px;
    }

    #add-offline-semester-container {
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

    .font-num {
        display: inline-block;
        position: absolute;
        top: 142px;
        right: 18px;
    }
</style>

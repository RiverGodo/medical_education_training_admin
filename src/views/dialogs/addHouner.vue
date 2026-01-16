<template>
    <Modal :transfer=false :title="payload.type == 1 ? '添加证书' : '编辑证书'" :footer-hide="true"
           v-model="addCourseDialogVisible" @on-cancel="handleRemoveModal(remove)" size="auto" width="654"
           :mask-closable="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top">
                    <Form ref="formHouner" class="add-course-form" :model="form" :rules="rules"
                          :label-position="labelPosition" :label-width="80">
                        <Col>
                            <FormItem label="证书名称" prop="name">
                                <Input v-model="form.name" placeholder="请输入证书名称"></Input>
                            </FormItem>
                            <FormItem v-show="organizationList&&organizationList.length>0" label="所属机构"
                                      prop="organization_id">
                                <Select v-model="form.organization_id" placeholder="请选择所属机构" disabled>
                                    <Option v-for="item in organizationList" :value="item.id" :key="item.id">
                                        {{item.title}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem class="form-labels" label="证书描述">
                                <Input type="textarea" :rows="9" placeholder="请输入内容" v-model="form.detail"></Input>
                            </FormItem>
                            <FormItem label="证书照片" required>
                                <div v-if="!form.img_url.length" class="demo-file-key">
                                    <img src="../../assets/img/img-video.png"/>
                                    <p>展示图片</p>
                                </div>
                                <Carousel v-else autoplay v-model="fileValue">
                                    <CarouselItem v-for="(item, index) in form.img_url" :key="index" style="position: relative">
                                        <img @click="deleteImgList(index)" src="../../assets/img/close-icon.png" class="upload-img-main-icon"/>
                                        <img style="width: 474px;height: 260px;" :src="item" alt="">
                                    </CarouselItem>
                                </Carousel>
                                <div class="upload-btn-flex">
                                    <div class="upload-img-text">*可上传1～5张图片；图片支持jpg/png格式，建议尺寸768*432px，且大小不超过2M；</div>
                                    <upload-button text="上传" :imgtypes="imgType" bucket="jhyl-static-file"
                                                   @handle-close="handleFileClose" class="upload-img-button"
                                                   @uploadcomplete="uploadcompleteButton" :type="fileType"
                                                   :maxFileSize="[2, 300]"></upload-button>
                                </div>
                            </FormItem>
                            <FormItem class="btns">
                                <Button v-if="payload.type==2" type="error" class="next-btn" style="width: 120px;"
                                        @click="handleDelete">删除证书
                                </Button>
                                <Button type="primary" class="next-btn" :style="payload.type==2 ? btnStyl : ''"
                                        @click="handleSubmit('formHouner')">保存
                                </Button>
                            </FormItem>
                        </Col>
                    </Form>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>
<script>
    import BaseInput from '../../components/BaseInput'
    import {RemoveModal} from './mixins'
    import UploadPanel from '../../components/UploadPanel'
    import UploadButton from '../../components/UploadButton'
    import {mapActions, mapState} from 'vuex';
    import {cleanHtmlLabel} from '../../components/Util'
    import {Config} from '../../config/base'
    import {doTimeFormat} from '../../components/Util'
    import {MPop} from '../../components/MessagePop'
    import postData from 'src/api/postData';

    export default {
        mixins: [RemoveModal, MPop],
        props: {
            remove: {type: String},
            payload: {}
        },
        data() {
            return {
                addCourseDialogVisible: true,
                videoManageDialog: true,
                form: {
                    organization_id: '',
                    detail: '',
                    name: '',
                    img_url: []
                },
                newData: {
                    show: false,
                    name: '',
                    download_url: '',
                    type: 1,
                    project_id: 1
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
                organizationList: null,
                btnStyl: 'margin-left: 40px;',
                rules: {
                    name: {required: true, message: '请输入证书名称'},
                    organization_id: {required: true, message: '请选择所属机构'}
                },
                fileType: 'image/png,image/jpg',
                imgType: 1,
                fileValue: null
            }
        },
        mounted() {
            if (JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1) this.getOrganization()
            this.$store.commit('set_houner_state', false)
            if (this.payload.hasOwnProperty('row')) {
                this.form = this.payload.row
                this.form.img_url = JSON.parse(this.form.img_url)
            }
            this.form.organization_id = JSON.parse(sessionStorage.getItem('PRODUCTINFO')).organization_id
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
            'upload-button': UploadButton
        },
        methods: {
            ...mapActions([
                'get_role_list',
                'get_online_curriculum_list',
                'add_course_download_data',
                'get_curriculum_donwload_data_list'
            ]),
            getDir() {
                return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
            },
            getOrganization() {
                postData('/components/getOrganization').then((res) => {
                    this.organizationList = res.data
                })
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
            handleNextStep(idx) {
                this.dialogIndex = idx
                if (this.query_online_course_list.length === 0) this.get_online_curriculum_list(this.project_id);
            },
            handleDelete() {
                let d = this.payload.row;
                if (d.state) this.$Message.info('证书使用中，请先解除关联。')
                else {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>删除证书后所有统计数据不可查看，是否确认删除</p>',
                        onOk: () => {
                            postData('/product/remove_honour_certificate', {id: d.id}).then((res) => {
                                this.addCourseDialogVisible = false;
                                this.$store.commit('set_houner_state', true)
                            })
                        },
                        onCancel: () => {
                        }
                    });
                }
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.form.img_url&&this.form.img_url.length>0) {
                            let url = this.payload.hasOwnProperty('row') ? '/product/modify_honour_certificate' : '/product/add_new_honour_certificate';
                            this.form.img_url = JSON.stringify(this.form.img_url)
                            postData(url, this.form).then((res) => {
                                this.addCourseDialogVisible = false;
                                this.$store.commit('set_houner_state', true)
                            })
                        } else this.$Message.warning('请上传证书照片');
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
                this.form.img_url = url;
            },
            handleFileClose() {
                this.$Message.warning('最多上传5张图片');
            },
            uploadcompleteButton(val) {
                this.form.img_url.push(val.url)
            },
            deleteImgList(index) {
                this.form.img_url.splice(index, 1)
                this.fileValue = index == 0 ? 0 : index - 1
                this.$forceUpdate()
            }
        }
    }
</script>
<style scoped lang="less">
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
        margin-bottom: 20px;
    }

    /deeep/ .upload-panel .upload-space {
        height: 250px !important;
    }

    /deep/ .ivu-modal-body {
        padding: 30px 50px;
    }

    .btns {
        text-align: center;

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

        /deep/ .ivu-form-item-content {
            display: flex;
            justify-content: center;
        }
    }

    .pre-btn {
        position: absolute;
        left: 0;
    }

    .public-btn {
        width: 170px;
    }

    .font-hint {
        color: #F54802;
    }
    .demo-file-key {
        width: 474px;
        height: 260px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #d7dde4;
        margin-bottom: 20px;
    }
    .upload-img-main-icon{
        cursor: pointer;
        color: #fff;
        .icons;
    }

    .icons {
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 20;
        font-size: 20px;
        z-index: 9999;
    }
    .upload-btn-flex{
        display: flex;

        .upload-img-text{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #9397AD;
            letter-spacing: 0.18px;
            text-align: justify;
            line-height: 20px;
            margin-right: 50px;
        }
        .upload-img-button{

        }
    }
    /deep/ .ivu-select-disabled .ivu-select-selection{
        color: #657180 !important;
    }
</style>

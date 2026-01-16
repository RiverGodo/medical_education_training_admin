<template>
    <div :style="`height: ${windowHight}px`" class="box">
        <div class="content">
            <Card v-if="btnType" class="card" @click.native="handleTabAdd">
                <img class="card-img" src="../../../assets/icons/icon/addIcon.png" alt="">
                <div class="card-add">添加主题</div>
            </Card>
            <Card class="card" v-for="(t ,index) in list" :key="index">
                <div class="card-row">
                    <div class="card-title-state">开课中</div>
                    <div class="card-title-num">已开课<span style="color: #4098FF;margin: 0 5px;">{{t.term_num}}</span>期
                    </div>
                </div>
                <div class="mt14">
                    <div class="card-content-title">{{t.title}}</div>
                    <div class="card-content-details">
                        {{t.description}}
                    </div>
                </div>
                <div class="card-row mt20">
                    <div class="card-end-time">共{{t.curriculum_count}}节课</div>
                    <Button v-if="btnType" class="card-end-btn r0" type="text" ghost @click="handleEdit(t)">编辑</Button>
                    <Button class="card-end-btn" :class="btnType ? 'r48' : 'r0'" type="text" ghost
                            @click="handleSee(t)">查看
                    </Button>
                    <Button v-if="btnType" class="card-end-btn r58" type="text" ghost @click="handleDelete(t)">删除
                    </Button>
                </div>
            </Card>
        </div>
        <form-modal :detail-data="tableRow" :show-modal='show' :form-list="formList" :detailData="detailData" :styleRule="styleRule" @delete-list="deleteList" :modalWidth="860" :isAdd="true"
                    @close="closeModal" :title="modalTitle" :rule-validate="rules" @from-submit="handleSubmit" @add-course="addCourse" :modalBody="true"/>
    </div>
</template>

<script>
    import formModal from '../../../components/FormModal'
    import postData from '../../../api/postData'
    import postMixins from '../../mixins/postMixins.js'
    import setAuthMixins from '../setAuthMixins'

    export default {
        name: "ManageOfflineList",
        mixins: [postMixins, setAuthMixins],
        data() {
            return {
                list: [],
                tableRow: {},
                courseList: [
                    {type: 'input', name: '课程名称', index: 0, field: 'title'},
                    {type: 'select', name: '课程类型', index: 0, field: 'type', selectList: [{id: 1, name: '讲座'}, {id: 2, name: '实践'},{id: 3, name: '考试'}], selectField:['id', 'name']},
                    {type: 'input', name: '上课地点', index: 0, field: 'class_address'},
                    {type: 'select', name: '课程讲师', index: 0, field: 'teacher_id', selectList: [], selectField: ['id', 'name']},
                ],
                courseRule: [],
                formList: [
                    {type: 'input', name: '主题名称', field: 'title'},
                    {type: 'textarea', name: '主题描述', field: 'description', maxlength: 200},
                    {type: 'select', name: '预约限制', field: 'model', selectList: [{title: '只能预约一期', id: 0}, {title: '可同时预约多期', id: 1}], selectField: ['id', 'title']},
                    {type: 'array', list: []}
                ],
                modalTitle: '',
                rules: {
                    title: [{required: true, message: '请输入主题名称'}],
                    description: [{required: true, message: '请输入主题描述'}],
                    model: [{required: true, message: '请选择预约限制', }]
                },
                show: false,
                detailData: {},
                product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
                windowHight: '',
                role: JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id,
                styleRule:"height: 500px; overflow-y: auto;",
            }
        },
        components: {formModal},
        watch: {
            show(val) {
                if(!val) {
                    this.formList[3].list = []
                    this.formList[3].list.push(this.courseList)
                }
            }
        },
        beforeDestroy(){
            this.handleEdit = null;
            this.handleSubmit = null;
            this.getList = null;
            this.deleteList = null;
            this.handleDelete = null;
            this.setCourseList = null;
            this.addCourse = null;
            this.getTeachers = null;
            this.list = null;
        },
        methods: {
            handleTabAdd() {
                this.modalTitle = '添加主题'
                this.show = true
            },
            handleEdit(item) {
                postData('product/curriculum_offline/getSubjectCurriculumList', {subject_id: item.id}).then(res => {
                    this.modalTitle = '编辑主题'
                    this.detailData = {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        model: item.model
                    }
                    res.data.forEach((item, index) => {
                        item.code = item.parent_code
                        for(let it in item) {
                            this.detailData[it + index] = item[it]
                        }
                        if(index > 0) this.addCourse(index)
                    })
                    this.show = true
                })
            },
            handleSee(item) {
                this.$router.push('open-product/offline-course')
                sessionStorage.setItem('OffLineClassTheme', JSON.stringify(item))
            },
            handleSubmit(v) {
                let d = {title: v.title, product_id: this.product_id,offlineCurriculums: v.offlineCurriculums, description: v.description, model: v.model}
                if (this.modalTitle === '添加主题'){
                    postData('product/curriculum_offline/addSubjectAndOfflineCurriculums', d).then(res => {
                        if(res.res_code == 1) {
                            this.$Message.success('保存成功')
                            this.getList()
                        }else{
                            this.$Message.info(res.msg)
                        }
                    })
                }else{
                    postData('product/curriculum_offline/operateSubjectAndOfflineCurriculums', {...d,id: v.id}).then(res => {
                        if(res.res_code == 1) {
                            this.$Message.success('保存成功')
                            this.getList()
                        }else{
                            this.$Message.info(res.msg)
                        }
                    })
                }
            },
            closeModal() {
                this.detailData = {}
                this.show = false
            },
            getList() {
                let d = {
                    product_id: this.product_id
                }
                postData('product/curriculum_offline/subject_get_list', d).then((res) => {
                    this.list = res.data;
                })
            },
            handleDelete(t) {
                this.$config.deleteModal(() => {
                    postData('/product/curriculum_offline_subject/delete', {subject_id: t.id}).then((res) => {
                        if (res.res_code == 1) {
                            this.getList()
                        }
                    })
                })
            },
            setCourseList(list) {
                this.formList[3].list.push(list)
                let arr = this.$config.copy(this.formList[3].list, [])
                arr.forEach(item => {
                    item.forEach(it => {
                        this.courseRule[it.field + it.index] = [{required: true, message: `请输入${it.name}`}]
                    })
                })
                this.rules = {...this.rules, ...this.courseRule}
            },
            addCourse(val) {
                let arr = this.$config.copy(this.courseList, [])
                arr.forEach(item => {
                    if(val) item.index = val - 1
                    item.index += 1
                })
                this.setCourseList(arr)
            },
            deleteList(val) {
                if(this.formList[3].list.length == 1) this.$Message.info('只剩一组，不能继续删除')
                else this.formList[3].list.splice(val, 1)
            },
            getTeachers(){
                postData('components/getTeachers', {organization_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).organization_id}).then(res => {
                    if(res.res_code == 1) {
                        this.courseList[3].selectList = res.data
                        this.setCourseList(this.courseList)
                    }
                })
            }
        },
        mounted() {
            this.getList()
            this.windowHight = window.innerHeight - 60
            this.getTeachers()
        },
    }
</script>

<style scoped lang="less">
    /deep/ .card-content-details {
        height: 65px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        text-overflow: ellipsis;
    }

    .content {
        display: flex;
        flex-wrap: wrap;
        padding: 15px;
        height: 100%;
        overflow-y: auto;
        align-content: start;

        .card {
            width: 440px;
            height: 230px;
            margin-right: 10px;
            margin-bottom: 10px;

            .card-img {
                margin-top: 32px;
            }

            .card-add {
                margin: 25px auto 0 auto;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #4098FF;
                letter-spacing: 1.2px;
                cursor: pointer;
                width: 140px;
            }
        }

        /deep/ .ivu-btn-text {
            color: #4098ff;
        }

        .card-row {
            display: flex;
            align-items: center;

            .card-title-state {
                width: 60px;
                height: 20px;
                background: #74C818;
                border-radius: 100px;
                color: #fff;
                text-align: center;
            }

            .card-title-num {
                margin-left: 20px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
                letter-spacing: 0;
                text-align: justify;
            }

            .card-end-time {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #686F92;
                letter-spacing: 0;
            }

            .card-end-btn {
                position: absolute;
                font-family: PingFangSC-Medium;
                font-size: 14px !important;
                color: #4098FF;
                letter-spacing: 0;
            }

            .r0 {
                right: 0;
            }

            .r48 {
                right: 98px;
            }

            .r58 {
                right: 48px;
            }
        }

        .mt14 {
            margin-top: 14px;

            .card-content-title {
                font-family: PingFangSC-Medium;
                font-size: 20px;
                color: #474C63;
                letter-spacing: 0;
                text-align: justify;
                overflow: hidden;
                word-break: keep-all;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .card-content-details {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #686F92;
                letter-spacing: 0;
                text-align: justify;
                line-height: 22px;
                margin-top: 10px;
            }
        }
    }

    .mt20 {
        margin-top: 20px;
    }

    .box {
        overflow: hidden;
        overflow-y: auto;
    }
</style>

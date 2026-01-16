<template>
    <div class='manage-task'>
        <FormModal :detail-data="tableRow" @from-submit="saveHomework" :show-modal='show' :form-list="formList"
            :isShowProgress="true"   @close="closeModal" :title="modalTitle" :rule-validate="rules" @change-list="changeList" uploadBtn>
        </FormModal>
        <screen @resetPage="resetPage" selectType2 :select2="selectList" :types="4" sizeTitle1="作业总数" :sizeNum1="pageTotal" btnName="添加作业" @inputChange="manageEdit"
            placehodle="搜索作业名称"  @selectChange2="selectChange"  @handleClick="addTaskCategory" :btn-type="btnType"/>
        <data-list @edit='editHandler' @delete='deleteHandler'
                class='data-list light-header' :table-data='dataList' :table-height='listHeight'
                @marking="marking" :header-data='dataHeader' :column-formatter='listColumnFormatter'
                @statistics="statistics" :column-formatter-data='listColumnFormatterData'></data-list>
        <page-list :current="current" :total="pageTotal" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import BaseList from '../../../components/BaseList'
    import {Dialog} from '../../dialogs'
    import {doTimeFormat} from '../../../components/Util'
    import {mapActions, mapState} from 'vuex'
    import screen from '../../../components/ScreenFrame'
    import FormModal from '../../../components/FormModal'
    import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
    import Editor from '../../../components/Editor'
    import pageMixin from '../../mixins/pageMixins'
    import pageList from '../../../components/Page'
    import postData from '../../../api/postData'
    import setAuthMixins from '../setAuthMixins'

    export default {
        mixins: [Dialog, FormModalMixin, pageMixin, setAuthMixins],
        components: { 'data-list': BaseList,  screen, FormModal, 'text-editor': Editor, pageList },
        data() {
            return {
                curricumList: [],
                dirty: false,
                selectList: [
                    {id: '', title:'全部作业'},
                    {id: 'online', title:'线上作业'},
                    {id: 'underline', title:'线下作业'}
                ],
                loadingInstance: null,
                selectCategory: 12,
                selectedType: 1,
                isInited: false,
                showClose: false,
                courseNums: 12,
                show: false,
                modalTitle: '',
                tableRow: {},
                tableRowData: {},
                type: '',
                formList: [
                    {type: 'input', name: '作业名称', field: 'realname'},
                    {
                        type: 'select',
                        name: '作业类型',
                        disable: false,
                        field: 'jurisdiction',
                        selectList: [{id: 'online', name: '线上作业'}, {id: 'underline', name: '线下作业'}],
                        selectField: ['id', 'name'], selectChange: true
                    },
                    {
                        type: 'select', name: '绑定课程', field: 'binding_course', disable: false,
                        selectList: [], selectField: ['id', 'title'], change: true, line: 1
                    },
                    {type: 'describe', name: '作业描述', field: 'uploading', small: true}
                ],
                rules: {
                    realname: [{required: true, message: '请输入作业名称', trigger: 'blur'}],
                    jurisdiction: [{required: true, message: '请选择作业类型'}],
                    binding_course: [{required: true, message: '请绑定已分配导师的课程'}],
                    // uploading: [{ required: true, message: '请输入课程介绍'} ],
                },
                contentData: ''
            }
        },
        computed: {
            listHeight() {
                return window.innerHeight - 60 - 50 - 70;
            },
            pageTotal() {
                return this.$store.state.task.total;
            },
            dataHeader() {
                let btnList = this.btnType ? [{ text: '编辑',  param: 'edit' }, { text: '删除',  param: 'delete' }] : []
                let arr = [
                        { sort:true,  label: '序号', minWidth: 50, },
                        { prop: 'title', label: '作业名称', minWidth:200, align: 'left' },
                        { prop: 'curriculum_title', label: '绑定课程', minWidth:200,  align: 'left' },
                        { prop: 'course', label: '类型', minWidth: 100 },
                        { label: '操作', minWidth: 260, align:"center",
                            // {  text: '批阅', param: 'marking' }
                            groupBtn: [...btnList]
                        }]
                return arr
            },
            listColumnFormatter() {
                return [{
                    columnName: 'create_time',
                    doFormat: doTimeFormat
                }, {
                    columnName: 'grade_id',
                    dataIndex: 0,
                    dataProp: 'id',
                    dataValue: 'name'
                }, {
                    columnName: 'item_id',
                    dataIndex: 1,
                    dataProp: 'id',
                    dataValue: 'name'
                }, {
                    columnName: 'activity_type',
                    dataIndex: 2,
                    dataProp: 'id',
                    dataValue: 'name'
                },
                ]
            },
            listColumnFormatterData() {
                return [[], [], this.$store.state.task.activityTypeList, this.stateList];
            },
            ...mapState({ dataList: state => state.task.task_category_list })
        },
        beforeDestroy() {
            this.addTaskCategory = null;
            this.manageEdit = null;
            this.marking = null;
            this.editHandler = null;
            this.deleteHandler = null;
            this.saveHomework = null;
            this.initData = null;
            this.getListLine = null;
        },
        methods: {
            ...mapActions(['delete_task']),
            addTaskCategory() {
                this.getListLine()
                this.tableRow = {}
                this.show = true
                this.formList[1].disable = false
                this.formList[2].disable = false
                this.modalTitle = "添加作业"
                let v = JSON.parse(sessionStorage.getItem("PRODUCTINFO")).id
                this.$store.dispatch('get_curriculumlist_list', {product_id: v})
                this.formList[2].selectList = this.curricumList
            },
            manageEdit(v) {
                // this.showClose = v;
              this.keyword = v
              this.initData()
            },
            statistics(index, row) {
                console.log(row, '统计');
            },
            marking(index, row) {
                this.$router.push({
                  path: `open-product/${row.id}/marking-homework`
                })
                sessionStorage.setItem('MarkingHomework', JSON.stringify(row))
            },
            editHandler(index, row) {
                this.show = true;
                if(row.type == "underline") this.formList[2].line = 0
                else this.formList[2].line = 1
                this.formList[1].disable = true
                this.formList[2].disable = true
                this.modalTitle = '编辑作业';
                let v = JSON.parse(sessionStorage.getItem("PRODUCTINFO")).id
                this.$store.dispatch('get_curriculumlist_list', {product_id: v})
                this.formList[2].selectList = this.curricumList
                this.tableRow.realname = row.title
                this.tableRow.uploading = row.description
                this.tableRow.jurisdiction = row.type
                this.tableRow.binding_course = row.item_id
                this.tableRow.upload = row.attachment_url ? JSON.parse(row.attachment_url) : row.attachment_url
                this.$store.dispatch("change_homework_id", row.id)
            },
            deleteHandler(index, row) {
                var vm = this;
                this.$config.deleteModal(() => {
                        this.delete_task(row.id)
                });
            },
            deleteCourseHandler(index, row) {
            },
            uploadComplete(id, result) {
                this.form.download_url = result.url;
            },
            getDir() {
                if (this.payload === 0) return 'datacenter/public/' + doTimeFormat(new Date().toString());
                return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
            },
            saveHomework(val) {
                val.page = {page_size: this.pageSize, page_num: this.current}
                val.keyword = this.keyword;
                val.description = val.uploading
                val._fn = () => {
                    this.show = false;
                    this.$Message.success(this.modalTitle.slice(0,2)+'成功');
                }
                console.log(val,'val');
                if (this.modalTitle == "添加作业") {
                   this.$store.dispatch('add_task_category', val);
                } else {
                   this.$store.dispatch('edit_task_category', val);
                }
            },
            initData() {
              this.$store.dispatch('get_task_category_list', {
                    page: {page_size: this.pageSize, page_num: this.current},
                    keyword: this.keyword,
                    type: this.type
                })
            },
            selectChange(v){
                this.type = v;
                this.initData()
            },
            getListLine(){
              postData('product/curriculum_online/pulldown_get_list', {
                product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
              }).then(res => {
                  res.data.forEach(item => {
                      item.disabled = !item.instructor_id
                  })
                this.curricumList[0] = res.data
              })
              postData('product/curriculum_online/pulldown_get_offline_list', {
                product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
              }).then(res => {
                this.curricumList[1] = res.data
              })
            },
            changeList(val) {
                if(val == 'online') this.formList[2].line = 1
                else this.formList[2].line = 0
            }
        },
        mounted() {
            this.initData()
            this.getListLine()
        }
    }
</script>
<style scoped lang="less">
    /deep/ .ivu-btn-text {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
    }

    .category-list {
        display: flex;
        flex-wrap: wrap
    }

    .task-category-item {
        margin-bottom: 10px;
    }

    .manage-task {
        .category-list {
            padding-top: 20px;
            padding-bottom: 20px;
            background-color: #FBFBFB;
        }
        .create-panel {
            padding-top: 10px;
            padding-bottom: 10px;
            text-align: right;
            button {
                margin-right: 30px;
                background: #3DAAFF;
                border-radius: 2px;
                padding: 3px 15px;
                font-size: 14px;
                color: #FFFFFF;
                letter-spacing: 0;
                border: none;
                outline: none;
                line-height: 20px;
            }
        }
    }

</style>

<template>
    <div class='manage-online-course'>
        <screen @resetPage="resetPage" :types="33" sizeTitle1="线上课总数" placehodle="搜索课程名称" :sizeNum1="pageTotal" btnName="添加课程"
            @changeMode="changeMode"  @inputChange="inputChange" @handleClick="handleClick" :btn-type="btnType"/>
        <data-list @editChapter='editChapterHandler' @editCourse='editCourseHandler' @moveUp='moveUpHandler'
                   @moveDown='moveDownHandler'
                   @deleteCourse='deleteCourseHandler' class='data-list light-header' :table-data='dataList'
                   :header-data='dataHeader'
                   :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'
                   :table-height='listHeight'>
        </data-list>
        <page-list :current="current" :total="pageTotal" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import BaseList from '../../../components/BaseList'
    import SaveOrder from '../../../components/SaveOrder'
    import {doTimeFormat} from '../../../components/Util'
    import {Dialog} from '../../dialogs';
    import {ADD_COURSE} from '../../dialogs/types'
    import screen from '../../../components/ScreenFrame'
    import pageMixin from '../../mixins/pageMixins'
    import pageList from '../../../components/Page'
    import setAuthMixins from '../setAuthMixins'
    import postData from '../../../api/postData'

    export default {
        mixins: [Dialog, pageMixin, setAuthMixins],
        data() {
            return {
                dirty: false,
                loadingInstance: null,
                keyword: ''
            }
        },
        computed: {
            dataHeader() {
                let auth = this.btnType
                let d = [
                    {text: '上移',param: 'moveUp'},{text: '下移', param:  'moveDown'},
                    {text: '查看章节', param: 'editChapter'}, {text: '编辑课程', param: 'editCourse'}, {text: '删除', param: 'deleteCourse'}]
                let btnList = auth ? d : [{text: '查看章节', param: 'editChapter'}]
                return [
                    {
                    sort: true,
                    label: '序号',
                    minWidth: 90
                }, 
                {
                    prop: 'title',
                    label: '课程名称',
                    minWidth: 300,
                    align: 'left',
                    render: (h, params) => {
                        return h('Tooltip', {props: {content: params.row.title,maxWidth: 300}},[h('span', {style: {fontWeight: 700}}, params.row.title)])
                    }
                }, {
                    prop: 'teacher_name',
                    label: '讲师',
                    minWidth: 100
                }, {
                    prop: 'department_name',
                    label: '科室',
                    minWidth: 80
                }, {
                    prop: 'grade_name',
                    label: '年级',
                    minWidth: 120
                }, {
                    prop: 'state',
                    label: '状态',
                    minWidth: 120
                }, {
                    prop: 'create_time',
                    label: '创建时间',
                    minWidth: 120
                }, {
                    label: '操作',
                    minWidth: 380,
                    align: 'center',
                    groupBtn: btnList
                }]
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
                    columnName: 'subject_id',
                    dataIndex: 1,
                    dataProp: 'id',
                    dataValue: 'name'
                }, {
                    columnName: 'state',
                    dataIndex: 2,
                    dataProp: 'id',
                    dataValue: 'name'
                }]
            },
            listColumnFormatterData() {
                return [[], [], this.stateList];
            },
            dataList() {
                return this.$store.state.online_curriculum.online_curriculum_list;
            },
            pageTotal() {
                return this.$store.state.online_curriculum.total;
            },
            stateList() {
                return this.$store.state.online_curriculum.stateList;
            },
            listHeight() {
                return window.innerHeight - 60 - 50 - 70;
            },
            productState() {
                return this.$store.state.production.edit_product_state
            }
        },
        watch: {
            productState(val) {
                if(val) this.initData()
            }
        },
        beforeDestroy() {
            this.handleClick = null;
            this.editChapterHandler = null;
            this.editCourseHandler = null;
            this.moveUpHandler = null;
            this.moveDownHandler = null;
            this.deleteCourseHandler = null;
            this.showDeleteConfirm = null;
            this.resetCurriculumOrder = null;
            this.initData = null;
            this.addCourseHandler = null;
        },
        methods: {
            submit() {
                this.initData()
            },
            inputChange(val) {
                this.keyword = val
                this.initData()
            },
            changeMode(val){
                const da = JSON.parse(sessionStorage.getItem('PRODUCTINFO'))
                const product_id = da.id
                const text = ['封面标题显示', '目录显示'][val]
                postData('product/product/change', {product_id , online_show_mode: val}).then((res) => {
                    if(res.res_code == 1) { 
                        this.$Message.info('课程显示形式已改为' + text + '!')
                        da.online_show_mode = val
                        sessionStorage.setItem('PRODUCTINFO', JSON.stringify(da))
                    }
                })
            },
            handleClick(val) {
                const da = JSON.parse(sessionStorage.getItem('PRODUCTINFO'))
                const product_id = da.id
                this.handleSelModal(ADD_COURSE, {
                    page: {page_size: this.pageSize, page_num: this.current},
                    keyword: this.keyword,
                    state: 1,
                    modify: 1,
                    product_id
                });
            },
            editChapterHandler(index) {
                this.$router.push({
                    name: 'online-course-chapter',
                    params: {
                        id: this.dataList[index].id,
                        title: this.dataList[index].title,
                    },
                    query: {
                        title: this.dataList[index].title,
                        catalog_show_type: this.dataList[index].catalog_show_type
                    }
                });
            },
            editCourseHandler(index, row) {
                const da = JSON.parse(sessionStorage.getItem('PRODUCTINFO'))
                const product_id = da.id
                const DETAIL = this.$config.copy(row, {})
                console.log(DETAIL,'DETAIL')
                PostData('product/getEvaluateByProduct', {product_id, curriculum_id: DETAIL.id}).then(res => {
                    if(res.res_code == 1) {
                        this.handleSelModal(ADD_COURSE, {
                            page: {page_size: this.pageSize, page_num: this.current},
                            keyword: this.keyword,
                            state: 0,
                            index,
                            row: {...DETAIL, curriculum_evaluate: res.data.curriculum_evaluate || []},
                            modify: 0,
                            product_id
                        });
                    }
                })
            },
            moveUpHandler(index, item) {
                let data = {
                    curriculum_online_id: item.id,
                    direction: 0
                }
                if(index == 0) this.$Message.info('无法上移')
                else{
                    postData('/product/curriculum_online/move', data).then(res => {
                        if(res.res_code == 1) this.$store.dispatch('change_online_curriculum_orderby', {index, dir: 0});

                    })
                }
            },
            moveDownHandler(index, item) {
                let data = {
                    curriculum_online_id: item.id,
                    direction: 1
                }
                if(index == this.dataList.length - 1) this.$Message.info('无法下移')
                else{
                    postData('/product/curriculum_online/move', data).then(res => {
                        if(res.res_code == 1) this.$store.dispatch('change_online_curriculum_orderby', {index, dir: 1});

                    })
                }
            },
            resetCurriculumOrder() {
                this.$store.dispatch('reset_online_curriculum_orderby');
                this.dirty = false;
            },
            deleteCourseHandler(index, item) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否确定删除该课程？</p>',
                    onOk: () => {
                        this.$store.dispatch('delete_online_curriculum', {
                            id: this.dataList[index].id
                        })
                    },
                });
            },
            showDeleteConfirm(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否确定删除该课程？</p>',
                    onOk: () => {
                        this.$store.dispatch('delete_online_curriculum', {
                            id: id
                        })
                    },
                });
            },
            addCourseHandler() {
                if (this.dirty) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>您已修改课程排序，是否放弃保存</p>',
                        onOk: () => {
                            this.resetCurriculumOrder();
                            this.handleSelModal(ADD_COURSE);
                        },
                    });
                } else this.handleSelModal(ADD_COURSE);
            },
            initData() {
                var vm = this;
                vm.$store.dispatch('get_online_curriculum_list', {
                    // project_id: v,
                    page: {page_size: this.pageSize, page_num: this.current},
                    keyword: this.keyword
                }).then(res => {});
            },
        },
        mounted() {
            this.initData();
            this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: parseInt(this.$route.params.id)})
        },
        components: {
            'data-list': BaseList,
            'save-order': SaveOrder,
            screen, pageList
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

    .manage-online-course {
        overflow: hidden;
        overflow-y: auto;
    }
</style>

<template>
    <div class='manage-online-course-chapter'>
        <AddData @add-data-success="getLists" @data-cancel="dataCancel" :isEdit="isEdit" :isShow="showData" :payload="dataDetails"/>
        <AddLink @add-data-success="getLists" ref="addLinkRef" :isEditLink="isEditLink" :payload="dataDetails" />
        <ScoreTable :scoreId="scoreId" :catalogId="catalog_ids" :show="showScore" @close="closes"/>
        <div class="hide-chapter">
            <Switch :value="showMode" @on-change="changeModal">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </Switch>
            <p>隐藏章节</p>
        </div>
        <screen :types="6" btn-name="添加章节" @handleClick="handleClick" @handleBack="handleBack" :title="screenTitle"
                :btn-type="btnType"/>
        <div class='chapter-container'>
            <div class='scroll-wrap'>
                <div class='chapter-list'>
                    <div class='chapter-item' v-for='(item,index) in chapterList' :key="index">
                        <div>
                            <Row class='chapter-title' type='flex' justify='space-between' align='middle'>
                                <div style="display: flex;align-items: center;position: relative;flex: 1;">
                                    <!-- <span class="row-title">第{{setIndex(index + 1)}}章</span> -->
                                    <Input v-model="item.group_name" @on-change="editorNote(item, index)"
                                           @on-blur="outInput(index)" @on-focus="showDataState(index)" class="textInput"
                                           style="flex: 1;"/>
                                </div>
                                <div style="margin-right: 25px;z-index: 1;">
                                    <Button class="chap-btn" v-if='showListState[index] == 0' type="text" @click="toggleListShow(index,item)">展开
                                    </Button>
                                    <Button class="chap-btn" v-else-if='showListState[index] == 1' type="text" @click="toggleListShow(index)">收起
                                    </Button>
                                    <Button class="chap-btn" v-if="btnType" type='text' @click="addEditDataItem(item, false)">添加资料</Button>
                                    <Button class="chap-btn" v-if="btnType" type='text' @click="addLinkDataItem(item, false)">添加链接</Button>
                                    <Button class="chap-btn" v-if="btnType" type='text' @click="addVideo(item,index)">添加视频</Button>
                                    <Button class="chap-btn" v-if="btnType" type='text' @click="addTest(item, index)">添加测验</Button>
                                    <Button class="chap-btn" v-if="btnType" type='text' @click="addCase(item, index)">添加案例</Button>
                                    <Button class="chap-btn" v-if="btnType" type='text' @click="addScore(item, index)">评分表</Button>
                                    <Button class="chap-btn" v-if="btnType" type='text' @click="moveUpList(item, index)">上移</Button>
                                    <Button class="chap-btn" v-if="btnType" type='text' @click="moveDownList(item, index)">下移</Button>
                                    <Button class="chap-btn" v-if="btnType" type="text" @click="deleteText(item, index)">删除</Button>
                                </div>
                            </Row>
                            <Row v-if="isShowScore(item)" class='chapter-title' type='flex' justify='space-between' align='middle'>
                                <div style="display: flex;align-items: center;">
                                    <span class="row-title" style="margin-right: 15px">考官评分表</span>
                                    <span style="font-size: 14px; color: #515a6e">{{item.score_table_list[0].group_name}}</span>
                                </div>
                                <div style="margin-right: 25px;">
                                    <Switch :true-value="1" :false-value="0" v-model="item.score_table_state" @on-change="switchs($event, item)" size="large">
                                        <span class="switch0-text" slot="open">启用</span>
                                        <span class="switch0-text" slot="close">禁用</span>
                                    </Switch>
                                </div>
                            </Row>
                        </div>
                        <data-list @edit='editHandler' @moveUp='moveUpHandler' @moveDown='moveDownHandler'
                                   @delete='deleteHandler' class='data-list light-header' :order-num="index"
                                   :table-data='item.children' :header-data='dataHeader' :is-stripe='false'
                                   v-if='showListState[index] == 1 && item.hasOwnProperty("children") && item.children.length > 0'></data-list>
                    </div>
                    <div class='chapter-item' v-if='newChapterData.showAddChapter'>
                        <Row class='chapter-title' type='flex' justify='space-between' align='middle'>
                            <div style="display: flex;align-items: center;position: relative;">
                                <!-- <span class="row-title">第{{setIndex(chapterList.length + 1)}}章</span> -->
                                <Input v-model="newChapterData.group_name"
                                       @on-enter.stop="saveChapter(newChapterData,true,1)"
                                       @on-blur.stop="saveChapter(newChapterData,true)" placeholder="请输入章节名称"
                                       @on-focus="showDataState(chapterList.length)" class="textInput"
                                       style="width: 300px;"/>
                            </div>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import screen from '../../../components/ScreenFrame'
    import BaseList from '../../../components/BaseList'
    import postData from '../../../api/postData'
    import {doTimeFormat} from '../../../components/Util'
    import {Dialog} from '../../dialogs'
    import {VIDEO_MANAGE, ADD_QUESTION} from '../../dialogs/types'
    import {Config} from '../../../config/base'
    import {doSortFormatCatalogList} from '../../../components/Util'
    import updateVideoGroupName from '../../../api/modules/onlineCourseChapter'
    import setAuthMixins from '../setAuthMixins'
    import ScoreTable from './com/score-table'
    import AddData from './com/add-data'
    import AddLink from './com/add-link'
    import axios from 'axios';

    export default {
        mixins: [Dialog, setAuthMixins],
        components: {'data-list': BaseList, screen, ScoreTable, AddData, AddLink },
        data() {
            return {
                itemTypes: ['视频', '测验', '案例', '资料','','链接'],
                scoreId: 0,
                isEdit: false,
                isEditLink: false,
                showData: false,
                dataDetails: null,
                showScore: false,
                dirty: false,
                showListState: {},
                newChapterData: {
                    showAddChapter: false,
                    group_name: '',
                    group_orderby: -1
                },
                isInited: false,
                isChapterInited: false,
                curriculumItem: {},
                screenTitle: '',
                isTrue: true,
                catalog_ids: null,
                showMode:0
            }
        },
        computed: {
            dataHeader() {
                let d = {
                    label: '操作', width: 450, groupBtn: [
                        {text: '编辑', param: 'edit'},
                        {text: '上移', param: 'moveUp'},
                        {text: '下移', param: 'moveDown'},
                        {text: '删除', param: 'delete'}]
                };
                let da = [
                    {label: '顺序', width: 65},
                    {prop: 'group_type_title', label: '小节名称', align: 'left'},
                ]
                if (this.btnType) da.push(d)
                return da
            },
            listColumnFormatter() {
                return [
                    {columnName: 'create_time', doFormat: doTimeFormat},
                    {
                        columnName: 'mix_role',
                        dataIndex: 0,
                        dataProp: 'id',
                        dataValue: 'name'
                    },
                ]
            },
            isLoading() {
                return this.$store.state.online_curriculum.showChapterLoading;
            },
            curriculumName() {
                var curriculumList = this.$config.copy(this.$store.state.online_curriculum.online_curriculum_list, []);
                if (Array.isArray(curriculumList) && curriculumList.length > 0) {
                    var curriculumId = this.$route.params.id;
                    for (var i = 0; i < curriculumList.length; i++) {
                        if (curriculumList[i].curriculum_id == curriculumId) return curriculumList[i].title;
                    }
                }
                return '';
            },
            chapterList() {
                var curriculumList = this.$config.copy(this.$store.state.online_curriculum.online_curriculum_list, []);
                if (Array.isArray(curriculumList) && curriculumList.length > 0) {
                    var curriculumId = this.$route.params.id;
                    curriculumList.map((t, i) => {
                        if (t.children && t.children.length > 0) {
                            t.children.map((m, k) => {
                                m.node_number = '第' + (k + 1) + '节'
                                m.group_type_title = m.group_name + `（${this.itemTypes[m.type]}）` 
                            })
                        }
                    })
                }
                return curriculumList || [];
            },
            curriculumList() {
                return this.$store.state.online_curriculum.online_curriculum_list;
            }
        },
        watch: {
            isLoading(val) {
                this.$config.IsLoading(val);
            },
            chapterList(list) {
                if (Array.isArray(list)) {
                    if (list.length === 0) {
                        this.newChapterData.showAddChapter = true;
                        this.newChapterData.group_orderby = 1;
                    } else {
                        this.newChapterData.showAddChapter = false;
                        this.newChapterData.group_orderby = list[list.length - 1].group_orderby + 1;
                        this.newChapterData.group_name = '';
                    }
                    this.setChapterShowState();
                }
            },
            curriculumList(val) {
                if (!this.isInited) this.initChapter();
            },
            $route(to, from) {
                if (this.$route.name == "online-course-chapter") this.getLists()
            }
        },
        beforeDestroy() {
            this.setChapter = null;
            this.saveChapter = null;
            this.showDataState = null;
            this.editorNote = null;
            this.openModal = null;
            this.moveHandler = null;
            this.moveUpHandler = null;
            this.moveDownHandler = null;
            this.deleteHandler = null;
            this.initChapter = null;
            this.setChapterShowState = null;
            this.addVideo = null;
            this.addTest = null;
            this.deleteHandler = null;
            this.editHandler = null;
        },
        methods: {
            isShowScore(item){
                return item.score_table_list&&item.score_table_list.length > 0
            },
            dataCancel(){
                this.showData = false
            },
            addEditDataItem(t, bool){
                if(this.checkButtonPermissionFailed([1,3],'添加资料')) return
                this.dataDetails = t
                this.showData = true
                this.isEdit = bool
                
            },
            switchs(val, t){
                PostData('product/curriculum_online_catalog/modifyScoreTableState', {catalog_id: t.id, score_table_state: val}).then(r => {
                    if(r.res_code == 1) {
                        this.$Message.info(r.msg);
                    }
                })
            },
            closes(bool){
                if(bool) this.getLists()
                this.showScore = false
            },
            // 添加评分表
            addScore(it ,i) {
                if(this.checkButtonPermissionFailed([1,3],'添加评分表')) return
                this.catalog_ids = it.id
                this.showScore = true
                if(it.score_table_list.length>0){
                    this.scoreId = it.score_table_list[0].related_id
                }
            },
            saveChapter2(t, i) {
            },
            setIndex(n) {
                return this.$config.ArabiaToSimplifiedChinese(n)
            },
            setChapter(t, i) {
                let d = {}
                d.curriculum_id = +this.$route.params.id
                d.curriculum_online_id = +this.$route.params.id
                if (i === true) {
                    d.group_name = t.group_name
                } else {
                    d = t
                    delete d.duration
                    delete d.video_url
                }
                if (d.group_name) this.$store.dispatch('add_online_curriculum_chapter', d)
                else this.$Message.warning('请输入章节的名称');
            },
            saveChapter(t, i, type) {
                if (this.isTrue) this.setChapter(t, i);
                if (type) {
                    this.isTrue = false
                    setTimeout(() => {
                        this.isTrue = true;
                    }, 500)
                }
            },
            handleClick(val) {
                this.newChapterData.showAddChapter = true;
            },
            handleBack() {
                // if (this.dirty) this.resetOrder();
                this.$router.replace({name: 'open-product'});
            },
            showDataState(i) {
                // this.showListState[i] = 0
                document.querySelectorAll('.ivu-input')[i].style.backgroundColor = '#fff'
                this.$set(this.showListState, i, 0);
            },
            outInput(index) {
                document.querySelectorAll('.ivu-input')[index].style.backgroundColor = '#FBFBFB'
            },
            editorNote(val, nums) {
                let d = {
                    id: val.id,
                    group_name: val.group_name
                }
                updateVideoGroupName(d).then((res) => {
                    if (res.data.res_code === 1) {
                        // this.$Message.success(res.data.msg);
                    }
                })
            },
            openModal(modal, row, type) {
                let item = type == 1 ? {video_id: row.video_id} : {video_test_id: row.video_test_id}
                this.handleSelModal(modal, {
                    curriculum_id: row.curriculum_id,
                    group_name: row.group_name,
                    group_orderby: row.group_orderby,
                    ...item
                });
            },
            moveHandler(row, type) {
                this.dirty = true;
                this.$store.dispatch('change_online_curriculum_chapter_orderby', {
                    curriculum_id: this.$route.params.id,
                    dir: type,
                    catalog_id: row.catalog_id,
                    group_orderby: row.group_orderby
                });
            },
            moveUpHandler(i, row, index) {
                if (i == 0) {
                    this.$Modal.info({
                        title: '提示',
                        content: '无法上移'
                    });
                } else {
                    this.$store.dispatch('change_online_curriculum_list', {id: row.id, i, direction: 0, index})
                }
            },
            moveDownHandler(i, row, index) {
                if (i == this.chapterList[index].children.length - 1) {
                    this.$Modal.info({
                        title: '提示',
                        content: '无法下移'
                    });
                } else {
                    this.$store.dispatch('change_online_curriculum_list', {id: row.id, i, direction: 1, index})
                }
            },
            deleteHandler(index, row) {
                var val = {
                    id: row.id,
                    curriculum_online_id: parseInt(this.$route.params.id)
                }
                this.$config.deleteModal(() => {
                    this.$store.dispatch('delete_online_curriculum_catalog', val)
                })
            },
            toggleListShow(index, t) {
                this.showListState[index] = 1 - this.showListState[index];
            },
            addChapterHandler() {
                this.newChapterData.showAddChapter = true;
            },
            initChapter() {
                this.screenTitle = this.$route.query.title
                this.newChapterData.showAddChapter = false;
                this.dirty = false;
                this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: parseInt(this.$route.params.id)})
                // if (this.chapterList.length === 0) this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: parseInt(this.$route.params.id)})
                // else this.setChapterShowState();
                this.isInited = true;
            },
            setChapterShowState() {
                var i;
                if (!this.isChapterInited && this.chapterList.length > 0) {
                    for (i = 0; i < this.chapterList.length; i++) {
                        this.$set(this.showListState, i, 1);
                    }
                    this.isChapterInited = true;
                }
                if (this.showListState[this.chapterList.length - 1] == undefined) {
                    for (i = 0; i < this.chapterList.length; i++) {
                        if (this.showListState[i] == undefined) this.$set(this.showListState, i, 0);
                    }
                }
            },
            addVideo(item, index) {
                console.log(this.$route,'KMM')
                if(this.checkButtonPermissionFailed([1,3],'添加视频')) return
                if (!item) {
                    this.$Modal.info({title: '提示', content: '<p>请先添加章节名称</p>'});
                } else {
                    this.handleSelModal(VIDEO_MANAGE, {
                        curriculum_online_id: +this.$route.params.id,
                        curriculum_id: item.curriculum_id,
                        parent_id: item.id,
                        group_name: item.group_name,
                        group_orderby: item.group_orderby,
                        orderby: item.orderby + 1,
                        i: index,
                        type: 0
                    });
                }
            },
            // 测验操作
            addTest(item, index) {
                if(this.checkButtonPermissionFailed([1,3],'添加测验')) return
                if (!item) {
                    this.$Modal.info({title: '提示', content: '<p>请先添加章节名称</p>'});
                } else {
                    this.handleSelModal(ADD_QUESTION, {
                        curriculum_online_id: parseInt(this.$route.params.id),
                        curriculum_data: item,
                        group_orderby: item.id,
                        section_id: '',
                        i: index,
                        type: 1,
                        modalTitle: '添加测验'
                        // curriculum_catalog_id: item.id,
                        // curriculum_id: item.curriculum_id,
                        // orderby: item.orderby + 1,
                        // list_index: index,
                        // group_name: item.group_name,
                    });
                }
            },
            // 测验案例
            addCase(item, index) {
                if(this.checkButtonPermissionFailed([1,3],'添加案例')) return
                if (!item) {
                    this.$Modal.info({title: '提示', content: '<p>请先添加章节名称</p>'});
                } else {
                    this.handleSelModal(ADD_QUESTION, {
                        curriculum_online_id: parseInt(this.$route.params.id),
                        curriculum_data: item,
                        group_orderby: item.id,
                        section_id: '',
                        i: index,
                        type: 2,
                        modalTitle: '添加案例'
                        // curriculum_catalog_id: item.id,
                        // curriculum_id: item.curriculum_id,
                        // orderby: item.orderby + 1,
                        // list_index: index,
                        // group_name: item.group_name,
                    });
                }
            },
            //删除测验
            deleteText(item, index) {
                if (item.children.length) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '是否删除该章节',
                        onOk: () => {
                            postData('product/curriculum_online_catalog/delete', {curriculum_catalog_id: item.id}).then(res => {
                                if (res.res_code == 1) {
                                    this.getLists()
                                }
                            })
                        },
                    });
                } else {
                    postData('product/curriculum_online_catalog/delete', {curriculum_catalog_id: item.id}).then(res => {
                        if (res.res_code == 1) {
                            this.getLists()
                        }
                    })
                }
            },
            editData(row, i){
                postData('curriculum_online_catalog/get_data_detail',{data_id: row.related_id}).then(r => {
                    if (r.res_code == 1) {
                       row.attachment_name = r.data.attachment_name
                       row.attachment_url = r.data.attachment_url
                       this.addEditDataItem(row, true)
                    }
                })
            },
            editLink(row, i){
                this.addLinkDataItem(row,true)
            },
            editHandler(i, row) {
                if (row.type == 3) this.editData(row, i)
                else if (row.type == 5) this.editLink(row, i)
                else if (row.type === 0) {
                    this.handleSelModal(VIDEO_MANAGE, {
                        ...row,
                        video_edit: true,
                        curriculum_catalog_id: row.id,
                        curriculum_online_id: parseInt(this.$route.params.id),
                    })
                } else {
                    this.handleSelModal(ADD_QUESTION, {
                        curriculum_online_id: parseInt(this.$route.params.id),
                        section_id: row.id,
                        type: row.type,
                        video_test_id: row.video_test_id,
                        group_name: row.group_name,
                        unlock_type: row.unlock_type || 0,
                        unlock_time: row.unlock_time,
                        modalTitle: row.type == 2 ? '编辑案例' : '编辑测验'
                    });
                }
            },
            moveUpList(item, index) {
                let data = {
                    catalog_id: item.id,
                    direction: 0
                }
                if(index == 0) {
                    this.$Message.info('无法上移')
                }else{
                    postData('/product/curriculum_online_catalog/moveChapter', data).then(res => {
                        if(res.res_code == 1) {
                            this.$store.dispatch('change_online_curriculum_orderby', {index, dir: 0});
                        }
                    })
                }
            },
            moveDownList(item, index) {
                let data = {
                    catalog_id: item.id,
                    direction: 1
                }
                if(index == this.chapterList.length - 1) {
                    this.$Message.info('无法下移')
                }else{
                    postData('/product/curriculum_online_catalog/moveChapter', data).then(res => {
                        if(res.res_code == 1) {
                            this.$store.dispatch('change_online_curriculum_orderby', {index, dir: 1});
                        }
                    })
                }
            },
            //产品-线上课列表（输入product_id为单个详情）
            getOnlineList(){
                let data = {
                    product_id:JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
                    curriculum_online_id:parseInt(this.$route.params.id),
                    page_size:1,
                    page_num:1
                }
                postData('/product/curriculum_online/get_list', data).then(res => {
                    console.log(res);
                   if (res.res_code == 1) {
                        if (res.data.data[0].show_mode) {
                            this.showMode = true
                        } else {
                            this.showMode = false
                        }
                   }
                })
            },
            getLists() {
                this.initChapter();
            },
            //开关隐藏章节
            changeModal(value) {
                if (value) {
                    this.showMode = 1
                } else {
                    this.showMode = 0
                }
                let data = {
                    curriculum_online_id:parseInt(this.$route.params.id),
                    show_mode:this.showMode
                }
                postData('/product/curriculum_online/change', data).then(res => {
                
                })
            },
            // 添加链接
            addLinkDataItem(item,isEditLink){
                if(this.checkButtonPermissionFailed([2,3],'添加链接')) return
                this.isEditLink = isEditLink
                this.dataDetails = item
                this.$refs.addLinkRef.showLinkModalState = true
            },
            // 检测按钮点击权限 1 不能添加链接，其余可以  2 只可以添加链接 3 同时可以添加链接和视频
            checkButtonPermissionFailed(roles,name){
                let catalog_show_type = +this.$route.query.catalog_show_type
                let catalog_show_type_map = {
                    1:'仅视频',
                    2:'仅链接',
                    3:'视频+链接'
                }
                if(roles.indexOf(catalog_show_type) == -1){
                    this.$Message.error(`当前课程前端展示类型为${catalog_show_type_map[catalog_show_type]}，需${name}，请先编辑课程，修改课程前端展示类型`)
                    return true
                }
            }
        },
        mounted() {
            $OnLine.$on('OnLine', (i) => {
                this.showListState[i] = 1
            })
            this.getLists();
            this.getOnlineList();
        }
    }
</script>
<style scoped lang="less">
    .switch0-text{
        font-size: 12px !important;
        color: #fff !important;
    }
    .chap-btn{
        line-height: 32px;
    }
    /deep/ .ivu-table-header {
        display: none;
    }

    /deep/ .ivu-input {
        border: none;
        background-color: #FBFBFB;
        font-size: 16px !important;
    }

    

    /deep/ .ivu-btn-text:focus {
        box-shadow: none;
    }

    .textInput {
        // padding-left: 50px;
        flex: 1;
        // width: 300px;
        font-family: PingFangSC-Medium;
        color: #474C63;
        letter-spacing: 0;
    }

    .row-title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .manage-online-course-chapter {
        height: 100%;
        /deep/ .ivu-icon {
            // font-size: 24px
        }
        .course-name {
            height: 60px;
            background-color: #ffffff;
            padding: 0 40px;

            h2 {
                font-size: 16px;
                color: #141111;
                letter-spacing: 0;
                font-weight: 400;
            }
        }

        .data-list {
            .base-list-row {
                .handle-component {
                    margin-right: 30px;

                    + .handle-component {
                        margin-right: 2px;
                    }

                    &:last-child {
                        margin-left: 50px;
                    }
                }
            }
        }

        .chapter-container {
            box-sizing: border-box;
            width: 100%;
            height: calc(100% - 66px);
            top: 0;
            z-index: 0;
            pointer-events: none;

            .scroll-wrap {
                overflow-y: auto;
                height: 100%;
                width: 100%;
                pointer-events: auto;
            }
        }

        .chapter-list {
            .chapter-item {
                .chapter-title {
                    min-width: 1070px;
                    padding: 0 40px;
                    background-color: #FBFBFB;
                    border: 1px solid #E5E5E5;
                    height: 60px;

                    /deep/ .ivu-btn-text {
                        border: none !important;
                        font-family: PingFangSC-Regular;
                        font-size: 16px;
                    }

                    span,
                    h3 {
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                        font-weight: 400;
                        display: inline-block;
                    }

                    input {
                        outline: 0;
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                        border: 0;
                        background-color: transparent;
                    }

                    i {
                        color: #cccccc;
                        cursor: pointer;
                    }
                }

                .chapter-btns {
                    margin-top: 25px;
                    padding: 0 40px;

                    .warning {
                        font-size: 14px;
                        color: #3DAAFF;
                    }

                    .el-button {
                        font-size: 14px;
                        color: #3B3B3B;
                        letter-spacing: 0;

                        &:hover {
                            color: #3DAAFF;
                        }
                    }

                    .line {
                        width: 1px;
                        background-color: #e5e5e5;
                        height: 14px;
                        display: inline-block;
                        margin: 0 8px;
                    }
                }
            }
        }

        .save-order {
            position: absolute;
            right: 100px;
            top: 70px;
        }
    }
    .hide-chapter{
        display: flex;
        align-items: center;
        position: absolute;
        z-index: 99;
        right: 300px;
        top: 22px;
        p{
            margin-left: 10px;
            font-size: 16px;
        }
    }
</style>

<template>
    <Modal :transfer=false :title="payload.modalTitle" v-model="addTestContentDialog" :footer-hide="true"
           @on-cancel="handleRemoveModal(remove)" size="auto" :mask-closable="false" width="850">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Form :inline="true" :model="formInline2" class="row2-test-form" :rules="rulesList" ref="formValidate">
                    <FormItem :label="payload.type == 2 ? '案例名称' : '测验名称'" class="form-title" prop="title">
                        <Input class="formInput" v-model="formInline2.title" :placeholder="payload.type == 2 ? '请输入案例名称' : '请输入测验名称'"
                               :disabled='isEdit'></Input>
                    </FormItem>
                    <FormItem label="解锁条件">
                        <Row>
                            <Checkbox v-model="timeUnlockState" @on-change="changeUnlockState">时间解锁</Checkbox>
                        </Row>
                        <Row v-if="timeUnlockState">
                            <Col span="8">选择解锁时间</Col>
                            <Col span="16">
                                <DatePicker
                                    :value="formInline2.unlock_time"
                                    @on-change="handleChangeUnlockTime"
                                    format="yyyy-MM-dd HH:mm"
                                    type="datetime"
                                    placeholder="请选择解锁时间"
                                    style="width: 250px"
                                />
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem :label="payload.type == 2 ? '案例内容' : '测验内容'" prop="body" style="text-align: left">
                        <Input type="textarea" :rows="5" placeholder="请输入内容" v-model="formInline2.body"
                               class="input-text"></Input>
                    </FormItem>
                    <FormItem style="padding-left: 67px;">
                        <div class="route-link" ref="formInput">
                            <div class="route-data" v-for="(item, index) in formInline2.attachment" :key="index">
                                <span class="titleFile" @click="handleModel(item)">{{item.name}}</span>
                                <Icon size="22" type="ios-trash-outline" @click="deleteFile(index)"/>
                            </div>
                        </div>
                        <div class="upload-list">
                            <div class="upload-title">附件可上传任意格式，附件大小不超过300M</div>
                            <uploadBtn class="upload-img" text="上传附件" @uploadcomplete="uploadImg" type="*"
                                       :maxFileSize="300"/>
                        </div>
                    </FormItem>
                    <FormItem label="选项数量" prop="select_count">
                        <Select v-model="formInline2.select_count" placeholder="选项数量" style="width: 260px;">
                            <!-- <Option label="0" value="0"></Option> -->
                            <Option label="1" value="1"></Option>
                            <Option label="2" value="2"></Option>
                            <Option label="3" value="3"></Option>
                            <Option label="4" value="4"></Option>
                            <Option label="5" value="5"></Option>
                            <Option label="6" value="6"></Option>
                        </Select>
                    </FormItem>
                    <FormItem v-for='(item, index) in answerList' :key="item.id">
                        <div class="answer">
                            <div class="answer-title"><span v-if="index == 0">选项结果</span></div>
                            <Checkbox class="answer-checkbox" v-model="item.answer" @on-change="checkChange">
                                {{item.name}}
                            </Checkbox>
                            <Input class="change-input" placeholder="请输入内容" v-model="item.desc"
                                   @on-blur="inputChange"></Input>
                        </div>
                    </FormItem>
                    <div style="text-align: left; color: #f30;font-size: 14px;margin-left: 60px;height: 20px;line-height: 20px">
                        {{showFont}}
                    </div>
                    
                    <!-- <span style="clear: left"></span> -->
                    <FormItem class="save-test-item">
                        <!--<Button @click="cancelSaveHandler" class="cancel-test-item-btn">取消</Button>-->
                        <div class="save-btn">
                            <Button type="primary" @click="saveTestDetailHandler" class="save-test-item-btn">保存</Button>
                            <!--<Button  @click="clearDetail" class="clear-btn" >清空</Button>-->
                        </div>
                    </FormItem>
                    <Row class="quetion-list">
                        <data-list @edit='editHandler' @delete='deleteHandler' class='data-list light-header'
                         @moveDown="moveDown" @moveUp="moveUp"   :table-data='dataList' :header-data='dataHeader' :column-formatter='listColumnFormatter'
                            @testScoreChange="testScoreChange" :is-stripe='false'></data-list>
                    </Row>
                    <div v-if="isTest" class="standard-view">
                        <span>总计：{{total_question_count}}题</span>
                        <span style="margin-left: 10px;">满分：{{total_score_count}}分</span>
                        <div style="margin-left: 20px;">
                            通过标准
                            <Select @on-change="setSel" class="pass-select" v-model="pass_mode">
                                <Option v-for="(t, i) in select" :value="t.id" :key="i">{{t.title}}</Option>
                            </Select>
                        </div>
                        <div class="all-text" v-if="pass_mode==1">
                            <InputNumber class="pass-input" :max="total_score_count" :min="0" v-model="pass_score_count" />
                        </div>
                        <div v-if="pass_mode==0" class="all-text">
                            <InputNumber class="pass-input" :max="total_question_count" v-model="pass_question_count" style="width: 60px!important" :min="0"></InputNumber>
                        </div> 
                        <span>{{pass_mode == 0 ? '题' : '分'}}</span>
                        <div style="margin-left: 20px;">
                            <span style="color: red;">*</span>提交限制
                             <RadioGroup @on-change="limintSel" style="margin-left: 5px;" v-model="test_mode">
                                <Radio :label="0"><span>不限制</span></Radio>
                                <Radio :label="1"><span>限制</span></Radio>
                             </RadioGroup>
                        </div>
                        <InputNumber v-if="test_mode" class="score-inputs" v-model="test_count" />
                        <span style="margin-left: 5px;" v-if="test_mode">次</span>
                    </div>
                    <FormItem v-if="isTest" style="margin-top: 20px;" class="save-test-item">
                        <div class="save-btn">
                            <Button type="primary" @click="saveTest" class="save-test-item-btn">确定</Button>
                        </div>
                    </FormItem>
                </Form>
            </Row>
        </base-input>
        <Modal v-model="modalAccessory" :title="accessoryName" :mask-closable="false" :footer-hide="true"
               :closable="true" @on-cancel="closeAccessory" width="600">
            <div class="accessory">
                <img class="maxw" v-if="accessoryImg" :src="accessoryImg" alt="">
                <video class="maxw" v-if="accessoryVideo" :src="accessoryVideo" controls autoplay></video>
            </div>
        </Modal>
    </Modal>
</template>

<script>
    import BaseInput from '../../components/BaseInput'
    import uploadBtn from '../../components/UploadButton'
    import BaseList from '../../components/BaseList'
    import {add_test_detail, update_test_detail,} from '../../api/modules/tools_video_test'
    import {RemoveModal} from './mixins'
    import {MPop} from '../../components/MessagePop'
    import postData from '../../api/postData'

    export default {
        mixins: [RemoveModal, MPop],
        props: {
            remove: {
                type: String
            },
            payload: {}
        },
        components: {'base-input': BaseInput, 'data-list': BaseList, uploadBtn},
        data() {
            return {
                total_score_count: 0,
                test_count: 0,
                test_mode: 0,
                pass_score_count: 0,
                pass_question_count: 0,
                pass_mode: 0,
                select: [{id: 0,title: '题目数量'},{id: 1,title: '答案分值'}],
                addTestContentDialog: true,
                video_test_id: 0,
                formInline1: {
                    video_test_id: 0,
                    title: '',
                    video_test_roles: [0],
                    curriculum_id: '',
                    group_orderby: 0,
                    group_name: '',
                    orderby: 0
                },
                formInline2: {
                    title: this.payload && this.payload.group_name || '',
                    video_test_detail_id: 0,
                    body: '',
                    select_count: '4',
                    orderby: 1,
                    answerList: [],
                    result: [],
                    content: '',
                    attachment: [],
                    unlock_time:'',
                    unlock_type:0
                },
                dataList: [],
                isEdit: false,
                accessoryList: [],
                modalAccessory: false,
                accessoryImg: '',
                accessoryVideo: '',
                accessoryName: '',
                section_id: null,
                rulesList: {
                    title: [
                        {required: true, message: '请输入测验名称', trigger: 'blur'}
                    ],
                    body: [
                        {required: true, message: '请输入题干名称', trigger: 'blur'}
                    ],
                    select_count: [
                        {required: true, message: '请设置选项数量', trigger: 'blur'}
                    ],
                },
                check: false,
                desc: true,
                showFont: '',
                timeUnlockState:false , // 时间解锁显示
            }
        },
        watch: {
            selectTestDetailId(val) {
                if (val !== 0) {
                    var detail;
                    var i;
                    for (i = 0; i < this.dataList.length; i++) {
                        if (this.dataList[i].id === val) {
                            detail = this.dataList[i];
                            break;
                        }
                    }
                    var detailData = JSON.parse(detail.content);
                    this.formInline2.body = detailData.body;
                    if (Array.isArray(detail.attachment)) this.formInline2.attachment = detail.attachment
                    else this.formInline2.attachment = JSON.parse(detail.attachment)
                    this.formInline2.select_count = detail.select_count.toString()
                    // this.setSelectCount(detail.select_count);
                    this.formInline2.orderby = detail.orderby;
                    for (i = 0; i < detailData.answerList.length; i++) {
                        this.formInline2.answerList[i].answer = detailData.answerList[i].answer;
                        this.formInline2.answerList[i].desc = detailData.answerList[i].desc;
                    }
                }
            },
            selectCount(val) {
                var labelList = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
                if (this.formInline2.answerList.length === 0) {
                    for (var i = 0; i < val; i++) {
                        this.formInline2.answerList.push({name: labelList[i], index: i, desc: '', answer: false});
                    }
                } else {
                    if (this.formInline2.answerList.length > val) {
                        while (this.formInline2.answerList.length > val) {
                            this.formInline2.answerList.pop();
                        }
                    } else {
                        while (this.formInline2.answerList.length < val) {
                            this.formInline2.answerList.push({
                                name: labelList[this.formInline2.answerList.length],
                                index: this.formInline2.answerList.length,
                                desc: '',
                                answer: false
                            })
                        }
                    }
                }
            },
            newVideoTestId(val) {
                if (this.formInline1.video_test_id === 0) this.formInline1.video_test_id = val;
            }
        },
        computed: {
            total_question_count(){
                return this.dataList.length || 0
            },
            isTest(){
                return this.payload.type == 1
            },
            answerList() {
                return this.formInline2.answerList;
            },
            selectTestDetailId() {
                return this.formInline2.video_test_detail_id;
            },
            selectCount() {
                return this.formInline2.select_count;
            },
            dataHeader() {
                const arr = [
                    {label: '排序', width: 90, sort: true},
                    {prop: 'title', label: this.payload.type == 2 ? '案例名称' : '题干名称'},
                    {width: 200, label: '操作', groupBtn: [{text: '编辑', param: 'edit'}, {text: '删除', param: 'delete'}]}
                ]
                const SCORE_ITEM = {
                    prop: 'score', label: '分数设置', width: 100,
                    testSetScore: true
                }
                if(this.payload.type == 1) {
                    arr.splice(2, 0, SCORE_ITEM)
                    arr[3].width = 300
                    const GROUP_BTN = arr[3].groupBtn
                    const MOVE = [{text: '上移', param: 'moveUp'},{text: '下移', param: 'moveDown'}]
                    GROUP_BTN.unshift(...MOVE)
                }
                return arr
            },
            listColumnFormatter() {
                return [{
                    columnName: 'content', doFormat: function (val) {
                        var data = JSON.parse(val);
                        return data.body;
                    }
                }]
            },
            newVideoTestId() {
                return this.$store.state.online_curriculum.newVideoTestId;
            },
            chapterList() {
                var curriculumList = this.$config.copy(this.$store.state.online_curriculum.online_curriculum_list, []);
                if (Array.isArray(curriculumList) && curriculumList.length > 0) {
                    var curriculumId = this.payload.curriculum_online_id;
                    for (var i = 0; i < curriculumList.length; i++) {
                        if (curriculumList[i].curriculum_id == curriculumId) {
                            // curriculumList[i].children = []
                            // console.log(doSortFormatCatalogList(curriculumList[i].chapterList),'logggggggggg');
                            // return doSortFormatCatalogList(curriculumList[i].chapterList);
                        }
                    }
                }
                return curriculumList || [];
            },
        },
        methods: {
            limintSel(val){
                if(val == 0)  this.test_count = 0
            },
            moveUp(index, row) {
                this.moveList(index, true)
            },
            moveDown(index, row) {
                this.moveList(index, false)
            },
            moveList(index, location) {
                if(location ? index == 0 : index == this.dataList.length - 1) this.$Message.info(location ? '已是第一个' : '已是最后一个')
                else {
                    this.dataList.splice(index, 0, location ? this.dataList.splice(index - 1, 1)[0] : this.dataList.splice(index + 1, 1)[0])
                    this.dataList.map((item, i) => { 
                        item.orderby = i + 1
                    })
                    this.saveTest('move')
                }
            },
            setScore(){
                let score = 0
                this.dataList.map(t => {
                    score += t.score_count
                })
                this.total_score_count = score
            },
            testScoreChange(val, row, index){
                // console.log(val, row, index,'val, row, index');
                this.$nextTick(() => {
                    row.score_count = val ? val : 0
                    this.dataList.splice(index, 1, row)
                    this.setScore()
                })
            },
            saveAllTest(d, type){
                PostData('curriculum_online_catalog/change_all_video_test', d).then(r => {
                    if(r.res_code == 1){
                        if(type!='move') this.handleRemoveModal(this.remove)
                    }
                })
            },
            saveTest(type){
                let detail_list = [], saveList = []
                this.dataList.map(t => {
                    detail_list.push({id: t.id, score_count: t.score_count, is_set_score: this.pass_mode, orderby: t.orderby})
                    saveList.push(t.score_count)
                })
                console.log(this.section_id, this.video_test_id,'this.video_test_id', this.payload.video_test_id)
                let d = {
                    video_test_id: this.payload.video_test_id || this.video_test_id,
                    pass_mode: this.pass_mode,
                    total_question_count: this.total_question_count,
                    pass_question_count: this.pass_question_count,
                    total_score_count: this.total_score_count,
                    pass_score_count: this.pass_score_count,
                    test_mode: this.test_mode,
                    test_count: this.test_count,
                    detail_list: detail_list
                }
                let fn = () => {
                    if(this.pass_mode){
                        if(!saveList.includes(null)&&!saveList.includes(undefined)) this.saveAllTest(d, type)
                        else this.$Message.info('请去设置分数 ！')
                    }else this.saveAllTest(d, type)  
                }
                if(this.test_mode){
                    if(this.test_count) fn()
                    else this.$Message.info('请输入限制次数 ！')
                }else fn()
            },
            setSel(val){
                this.dataList.map(t => {
                    t.disableScore = val ? false : true
                    if(val === 0) t.score_count = 0
                })
                if(val == 1) this.pass_question_count = 0
                if(val == 0) this.pass_score_count = 0
            },  
            deleteFile(index) {
                this.formInline2.attachment.splice(index, 1)
            },
            uploadImg(val) {
                this.formInline2.attachment.push(val)
            },
            handleModel(item) {
                if (item.name.split('.')[item.name.split('.').length - 1] == 'jpg' || item.name.split('.')[item.name.split('.').length - 1] == 'png' || item.name.split('.')[item.name.split('.').length - 1] == 'jpeg') {
                    this.accessoryImg = item.url
                } else {
                    this.accessoryVideo = item.url
                }
                this.accessoryName = item.name
                this.modalAccessory = true
            },
            closeAccessory() {
                this.accessoryImg = ''
                this.accessoryVideo = ''
                this.accessoryName = ''
            },
            setSelectCount(val) {
                var labelList = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
                this.formInline2.answerList = [];
                for (var i = 0; i < val; i++) {
                    this.formInline2.answerList.push({name: labelList[i], index: i, desc: '', answer: false});
                }
                this.formInline2.select_count = val;
            },
            handleClose() {
                this.addTestContentDialog = false;
            },
            handleSubmit() {
            },
            handleEditTest() {
                this.isEdit = !this.isEdit;
            },
            editHandler(index, row) {
                this.formInline2.answerList = JSON.parse(row.content).answerList
                this.formInline2.video_test_detail_id = row.id;
            },
            deleteHandler(index, row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否确定删除该题目？</p>',
                    onOk: () => {
                        // delete_test_detail(row.id).then(res => {
                        //   if (res.data.res_code === 1) {
                        //     this.dataList.splice(index, 1);
                        //     this.$Modal.info({
                        //       title: '提示',
                        //       content: '删除成功。'
                        //     });
                        //     this.clearDetail();
                        //   }
                        // })
                        postData('product/curriculum_online_catalog/delete_video_test', {video_test_detail_id: row.id}).then(res => {
                            if (res.res_code == 1) this.getList(false)
                        })
                    },
                });
            },
            cancelSaveHandler() {
                this.clearDetail();
            },
            saveTestDetailHandler() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {

                        // 判断解锁时间
                        if(this.formInline2.unlock_type === 1){
                          if(new Date().getTime() > new Date(this.formInline2.unlock_time).getTime()){
                            this.$Message.error("解锁时间不得早于当前时间")
                            return
                          }
                        }

                        this.check = false
                        this.formInline2.answerList.forEach(item => {
                            this.desc = this.desc && item.desc
                            this.check = this.check || item.answer
                        })
                        if ( (this.desc && this.check) || (this.formInline2.answerList.length == 0) ) {
                            this.formInline2.result = [];
                            for (var i = 0; i < this.formInline2.answerList.length; i++) {
                                if (this.formInline2.answerList[i].answer) {
                                    this.formInline2.result.push(i);
                                }
                            }
                            this.formInline2.result = JSON.stringify(this.formInline2.result);
                            this.formInline2.content = JSON.stringify({
                                body: this.formInline2.body,
                                answerList: this.formInline2.answerList
                            });
                            this.formInline2.attachment = JSON.stringify(this.formInline2.attachment)
                            this.formInline2.test_title = this.formInline2.body
                            this.formInline2.curriculum_catalog_id = this.payload.curriculum_catalog_id
                            // this.formInline2.title = this.formInline1.title;
                            this.formInline2.select_count = +this.formInline2.select_count
                            this.formInline2.curriculum_online_id = this.payload.curriculum_online_id
                            if (this.formInline2.video_test_detail_id > 0) {
                                update_test_detail({...this.formInline2, section_id: this.section_id}).then(res => {
                                    if (res.data.res_code === 1) {
                                        this.getList(true)
                                        this.cancelSaveHandler()
                                        this.$Modal.info({
                                            title: '提示',
                                            content: '保存成功。'
                                        });
                                    }
                                })
                            } else {
                                let formChapter 
                                this.formInline2.curriculum_id = this.payload.curriculum_online_id
                                if (this.section_id) formChapter = {...this.formInline2, ...{section_id: this.section_id, total_question_count: this.dataList.length + 1},...{type: this.payload.type == 2 ? 2 : 1}}
                                else formChapter = {...this.formInline2, ...{group_orderby: this.payload.group_orderby, total_question_count: this.dataList.length + 1},...{type: this.payload.type == 2 ? 2 : 1}}
                                console.log(this.formInline2,'this.formInline2');
                                if(this.payload.type == 2) formChapter.pass_question_count = formChapter.total_question_count
                                add_test_detail(formChapter).then(res => {
                                    if (res.data.res_code === 1) {
                                        if (res.data.data.section_id) this.section_id = res.data.data.section_id
                                        if(this.isTest) this.video_test_id = res.data.data.video_test_id
                                        this.cancelSaveHandler()
                                        this.getList(true)
                                        this.$Modal.info({
                                            title: '提示',
                                            content: '添加成功。'
                                        });
                                    }
                                })
                            }
                            this.cancelSaveHandler()
                        } else {
                            this.ruleOption()
                        }
                    }
                })
            },
            ruleOption() {
                var innerCheck = document.querySelectorAll('.ivu-checkbox-inner')
                innerCheck.forEach(item => {
                    if (!this.check) {
                        item.style.border = '1px solid #ff3300'
                        this.showFont = '请选择正确答案'
                    } else item.style.border = '1px solid #d7dde4'
                })
                var innerInput = document.querySelectorAll('.change-input')
                innerInput.forEach((item, index) => {
                    if (!this.desc) {
                        this.formInline2.answerList.forEach((item1, index1) => {
                            if (!item1.desc && (index == index1)) {
                                item.children[1].style.border = '1px solid #ff3300'
                            }
                        })
                        this.showFont = '请输入答案内容'
                    } else item.children[1].style.border = '1px solid #d7dde4'
                })
            },
            checkChange() {
                this.check = true
                this.showFont = ''
                this.ruleOption()
            },
            inputChange() {
                this.desc = true
                this.showFont = ''
                this.ruleOption()
            },
            clearDetail() {
                this.formInline2.video_test_detail_id = 0;
                this.formInline2.body = '';
                this.formInline2.answerList = [];
                this.formInline2.attachment = [];
                this.setSelectCount(0);
                this.setSelectCount(4);
                this.formInline2.orderby = this.dataList.length > 0 ? this.dataList[this.dataList.length - 1].orderby + 1 : 1;
            },
            getList(bool = false) {
                if (this.section_id) {
                    if(bool) this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: this.payload.curriculum_online_id})
                    postData('product/curriculum_online_catalog/get_video_test', {section_id: this.payload.section_id || this.section_id}).then(res => {
                        if (res.res_code == 1) {
                            if(this.payload.type == 1){
                                if(res.video_test_list.length>0){
                                    const TEST_ITEM = res.video_test_list[0]
                                    this.pass_mode = TEST_ITEM.pass_mode
                                    this.pass_question_count = TEST_ITEM.pass_question_count
                                    this.total_score_count = TEST_ITEM.total_score_count
                                    this.pass_score_count = TEST_ITEM.pass_score_count
                                    this.test_mode = TEST_ITEM.test_mode
                                    this.test_count = TEST_ITEM.test_count
                                }
                            }
                            res.data.forEach((item, i) => {
                                item.attachment = JSON.parse(item.attachment)
                                if(this.payload.type == 1) { 
                                    item.orderby = i + 1
                                    item.disableScore = this.pass_mode ? false : true
                                }
                            })
                            this.dataList = res.data
                        }
                    })
                }
            },
            // 改变时间解锁状态
            changeUnlockState(val){
                this.formInline2.unlock_type = val ? 1 : 0
            },
            // 改变解锁时间
            handleChangeUnlockTime(val){
                this.formInline2.unlock_time = val;
            }
        },
        mounted() {
            this.section_id = this.payload.section_id
            this.timeUnlockState = this.payload.unlock_type === 1 ? true : false
            this.formInline2.unlock_type = this.payload.unlock_type || 0;
            this.formInline2.unlock_time = this.payload.unlock_time;
            console.log(this.payload,'this.payload');
            this.getList(true)
            this.formInline2.select_count = 4;
            
           
        }
    }
</script>
<style lang="less" scoped>
    .standard-view{
        display: flex;
        align-items: center;
        margin-top: 15px;
        .pass-select{
            width: 100px;
            margin: 0 5px;
        }
        .score-inputs{
            width: 50px !important;
            border:1px solid #dcdee2;
            border-radius: 4px;
            margin-left: 5px;
            background-color: #fff !important;
        }
    }
    .all-text{
        width: 60px;
        text-align: center;
        border-bottom: 1px solid #515a6e;
    }
    /deep/ .ivu-input-number-handler-wrap{
        display: none !important
    }
    /deep/.pass-input{
        border: none !important;
        box-shadow: none !important;
    }
    /deep/ .ivu-btn {
        display: inline-block !important;
    }
    .row1-test-form {
        background: #F0F0F7;
        padding: 0 30px;
    }

    .form-title {
        display: flex;
        align-items: center;
        height: 50px;
    }

    /deep/ .ivu-form-item {
        display: flex !important;
        width: 100%;
    }

    .formInput {
        width: 620px;
    }

    .input-text {
        width: 620px;
    }

    /deep/ textarea.ivu-input {
        resize: none;
    }

    /deep/ .ivu-form-item-label {
        text-align: left;
    }

    .row2-test-form {
        padding: 0 30px;
        margin-top: 30px;
    }

    .upload-list {
        display: flex;
        margin-top: 15px;
        justify-content: space-between;

        .upload-title {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #F54802;
            letter-spacing: 0;
        }

        .upload-video {
            margin-left: 10px;
        }
    }

    .answer {
        display: flex;
        width: 700px;

        .answer-title {
            width: 80px;
            text-align: left;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #474C63;
            letter-spacing: 0;
            padding-left: 11px;
        }

        .answer-checkbox {
            width: 40px;
        }
    }

    .save-test-item {
        display: flex;
        justify-content: center;

        .save-test-item-btn {
            width: 200px;
        }
    }

    .route-link {
        width: 620px;
        text-align: left;

        .route-data {
            color: #4098ff;
            margin: 0 10px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
        }
    }

    .accessory {
        text-align: center;
        width: 100%;
    }

    .maxw {
        max-width: 100%;
    }

    .save-btn {
        display: flex;

        .clear-btn {
            margin-left: 40px;
        }
    }

    .titleFile {
        cursor: pointer;
        width: calc(100% - 40px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    /deep/ .ivu-form-item-label {
        padding: 10px 8px 10px 0
    }
</style>

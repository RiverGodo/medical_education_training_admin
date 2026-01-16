<template>
    <div>
        <Modal footer-hide :width="550" v-model="modalContent" :title="titleContent" @on-cancel="cancelContent">
            <Input v-model="scoreConent" :rows="6" type="textarea" placeholder="请输入解析" style="width: 100%x" />
            <div class="md-btns">
                <Button @click="cancelContent" class="m-btn">取消</Button>
                <Button @click="addAnalysisItem" style="margin-left:100px;" class="m-btn" type="primary">保存</Button>
            </div>
        </Modal>
        <Modal footer-hide	:width="930" v-model="modal1" :title="defaultTitle" @on-cancel="cancel">
            <div class="score-view">
                <div style="white-space: nowrap;">名称：</div><Input class="score-input score-title-input" v-model="title" placeholder="请输入评分表名称" style="width: 100%;" />
                <div class="score-btns" @click="add" type="text">
                    <Icon type="md-add" /> 添加项目
                </div>
            </div>
            <div v-if="list.length>0">
                <div v-for="(t,i) in list" :key="i" class="score-item">
                    <div class="item1">
                        <div style="white-space: nowrap;">项目{{$config.ArabiaToSimplifiedChinese(i + 1)}}：</div>
                        <Input class="score-input1" v-model="t.title" placeholder="请输入项目名称" style="width: 100%" />
                        <div @click="addTwo(i)" class="add-btns">添加子项目</div>
                        <div @click="addContent(i)" class="add-btns">添加内容</div>
                        <div @click="moves(i, true)" class="add-btns">上移</div>
                        <div @click="moves(i, false)" class="add-btns">下移</div>
                        <div v-if="t.children.length>0" @click="hide(i)" class="add-btns">{{t.isOpen ? '收起' : '展开'}}</div>
                        <div @click="deletes(t, i)" class="add-btns">删除</div>
                    </div>
                    <div v-for="(it,j) in t.content_children" :key="j" class="item-content">
                        <Input v-model="it.content" class="score-input" placeholder="请输入内容" style="width: 100%;" />
                        <div style="white-space: nowrap;margin-right: 5px">满分</div>
                        <!-- <input @input="isScFinsh($event)" v-model.number="item.examiner_answer_score" class="sc-input" max="100" type="number" />   -->
                        <InputNumber @on-change="setScores($event, it)" v-model="it.full_score" style="width: 60px!important" :max="100" :min="0"></InputNumber>
                        <div style="white-space: nowrap;margin-right: 5px;margin-left: 20px;">答案</div>
                        <InputNumber @on-change="setAnswers($event, it)" v-model="it.answer_score" style="width: 60px!important" :max="it.full_score" :min="0"></InputNumber>
                        <div @click="addAnalysis([t, i, j], it.analysis)" :class="it.analysis ? 'analyser-btns' : ''" class="add-btns">{{it.analysis ? ' 解析 ' : '添加解析'}}</div>
                        <div @click="movesContent(t, i, j, true)" class="add-btns">上移</div>
                        <div @click="movesContent(t, i, j, false)" class="add-btns">下移</div>
                        <div @click="deletesContent(t, i, j)" class="add-btns">删除</div>
                    </div>
                    <div v-if="t.isOpen" v-for="(it,l) in t.children" :key="l + 1000" >
                        <div class="item1">
                            <div style="white-space: nowrap;">{{i + 1}}.{{l + 1}}：</div>
                            <Input class="score-input1" v-model="it.title" placeholder="请输入项目名称" style="width: 100%" />
                            <div @click="addThree(i, l)" class="add-btns">添加子项目</div>
                            <div @click="addContentTwo(i, l)" class="add-btns">添加内容</div>
                            <div @click="movesTwo(t, i, l, true)" class="add-btns">上移</div>
                            <div @click="movesTwo(t, i, l, false)" class="add-btns">下移</div>
                            <div v-if="it.children.length>0" @click="hideTwo(i, l)" class="add-btns">{{it.isOpen ? '收起' : '展开'}}</div>
                            <div @click="deletesTwo(t, i, l)" class="add-btns">删除</div>
                        </div>
                        <div v-for="(item, h) in it.content_children" :key="h + 1000" class="item-content">
                            <Input v-model="item.content" class="score-input" placeholder="请输入内容" style="width: 100%;" />
                            <div style="white-space: nowrap;margin-right: 5px">满分</div>
                            <InputNumber @on-change="setScores($event, item)" v-model="item.full_score" style="width: 60px!important" :max="100" :min="0"></InputNumber>
                            <div style="white-space: nowrap;margin-right: 5px;margin-left: 20px;">答案</div>
                            <InputNumber @on-change="setAnswers($event, item)" v-model="item.answer_score" style="width: 60px!important" :max="item.full_score" :min="0"></InputNumber>
                            <div @click="addAnalysis([t, i, l, h], item.analysis)" :class="it.analysis ? 'analyser-btns' : ''" class="add-btns">{{item.analysis ? ' 解析 ' : '添加解析'}}</div>
                            <div @click="movesContentTwo(t, i, h, true)" class="add-btns">上移</div>
                            <div @click="movesContentTwo(t, i, h, false)" class="add-btns">下移</div>
                            <div @click="deletesContentTwo(t, i, h)" class="add-btns">删除</div>
                        </div>
                        <div v-if="it.isOpen" v-for="(item, m) in it.children" :key="m + 3000">
                            <div class="item1">
                                <div style="white-space: nowrap;">{{i + 1}}.{{l + 1}}.{{m + 1}}：</div>
                                <Input class="score-input1" v-model="item.title" placeholder="请输入项目名称" style="width: 100%" />
                                <div @click="addContentThree(i, l, m)" class="add-btns">添加内容</div>
                                <div @click="movesThree(t, i, l, m, true)" class="add-btns">上移</div>
                                <div @click="movesThree(t, i, l, m, false)" class="add-btns">下移</div>
                                <div @click="deletesThree(t, i, l, m)" class="add-btns">删除</div>
                            </div>
                            <div v-for="(itc, c) in item.content_children" :key="c + 3000" class="item-content">
                                <Input v-model="itc.content" class="score-input" placeholder="请输入内容" style="width: 100%;" />
                                <div style="white-space: nowrap;margin-right: 5px">满分</div>
                                <InputNumber @on-change="setScores($event, itc)" v-model="itc.full_score" style="width: 60px!important" :max="100" :min="0"></InputNumber>
                                <div style="white-space: nowrap;margin-right: 5px;margin-left: 20px;">答案</div>
                                <InputNumber @on-change="setAnswers($event, itc)" v-model="itc.answer_score" style="width: 60px!important" :max="itc.full_score" :min="0"></InputNumber>
                                <div @click="addAnalysis([t, i, l, m, c], itc.analysis)" :class="it.analysis ? 'analyser-btns' : ''" class="add-btns">{{itc.analysis ? ' 解析 ' : '添加解析'}}</div>
                                <div @click="movesContentThree(t, i, l, c, true)" class="add-btns">上移</div>
                                <div @click="movesContentThree(t, i, l, c, false)" class="add-btns">下移</div>
                                <div @click="deletesContentThree(t, i, l, c)" class="add-btns">删除</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="list.length>0" class="score-view">
                <span>总计：{{question_count}} 题</span>
                <span class="foot-text">满分 {{full_score_num}} 分</span>
                <span class="foot-text">答案 {{answer_score_num}} 分</span>
                <span class="foot-text">通过标准：</span>
                <Select @on-change="setSel" style="width: 100px;margin-right: 10px" v-model="pass_mode">
                    <Option v-for="(t, i) in select" :value="t.id" :key="i">{{t.title}}</Option>
                </Select>
                <div style="margin-right: 10px;" v-if="pass_mode==1||pass_mode==2">
                    <span >误差值</span>
                    <InputNumber :max="full_score_num" class="score-inputs" v-model="float_score_num" />
                    分
                </div>
                <div v-if="pass_mode==0||pass_mode==2" class="all-text">
                    <InputNumber class="pass-input" v-model="pass_count" style="width: 60px!important" :max="question_count" :min="0"></InputNumber>
                </div> 
                <span v-if="pass_mode==0||pass_mode==2">题</span>
                <Button class="score-right-btns" @click="save(true)" type="primary">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            show: {},
            catalogId: {},
            scoreId: {}
        },
        data() {
            return {
                activeItems: [],
                scoreConent: '',
                titleContent: '添加解析',
                modalContent: false,
                float_score_num: 0,
                pass_mode: 0,
                select: [{id: 2,title: '全部'},{id: 0,title: '题目数量'},{id: 1,title: '答案分值'}],
                defaultTitle: '添加评分表',
                answer_score_num: 0,
                full_score_num: 0,
                question_count: 0,
                pass_count: 0,
                title: '',
                modal1: false,
                list: [],
                fullList: [],  //  所有加入一个满分数组， 给 list 计入 index 
                answerList: [],
                infoId: null
            }
        },
        watch: {
            show(_new){
                this.modal1 = _new
                if(_new) {
                    this.getList()
                }
            }
        },
        methods: {
            addAnalysisItem(){
                const [t, i, j, h, m] = this.activeItems
                if(this.activeItems.length == 3)  t.content_children[j].analysis = this.scoreConent
                if(this.activeItems.length == 4){
                    let it = t.children[j]
                    it.content_children[h].analysis = this.scoreConent
                }
                if(this.activeItems.length == 5){
                    let it = t.children[j]
                    let item = it.children[h]
                    item.content_children[m].analysis = this.scoreConent
                }
                this.cancelContent()
                this.list.splice(i, 1, t)
                console.log(this.list,'ML')
            },
            addAnalysis(d, analysis){
                this.scoreConent = analysis
                this.activeItems = d
                this.modalContent = true
                this.titleContent = analysis ? '解析' : '添加解析'
            },
            cancelContent(){
                this.modalContent = false
                this.scoreConent = ''
            },
            setSel(val){
                if(val === 1) this.pass_count = 0
                if(val === 0) this.float_score_num = 0
            },
            setScoreData(t){
                if(t.hasOwnProperty('content_children')){
                    t.content_children.map((it, j) => {
                        this.fullList.push(it.full_score)
                        this.answerList.push(it.answer_score)
                        it.index = this.fullList.length - 1
                        ++this.question_count 
                    }) 
                }
                return t
            },
            setDate(){
                this.list.map((t, i) => {
                    t.isOpen = true
                    if(t.hasOwnProperty('children')){
                        t.children.map((it, j) => {
                            it.isOpen = true
                            it = this.setScoreData(it)
                            if(it.hasOwnProperty('children')){
                                it.children.map((ic, k) => {
                                    ic = this.setScoreData(ic)
                                })
                            }
                        }) 
                    }
                    t = this.setScoreData(t)
                })
            },
            getList(){
                this.list = []
                this.fullList = []
                this.answerList = []
                this.answer_score_num = 0
                this.full_score_num = 0
                this.question_count = 0 
                this.pass_mode = 0
                this.float_score_num = 0
                this.pass_count = 0
                this.infoId = null
                this.title = ''
                PostData('product/curriculum_online_catalog/getScoreTable', {catalog_id: this.catalogId,score_id: this.scoreId}).then(r => {
                    if(r.res_code == 1){
                        const { question_count, pass_count, full_score_num, answer_score_num, title, id, pass_mode, float_score_num } = r.data.score_table_info
                        this.pass_count = pass_count
                        this.full_score_num = full_score_num
                        this.answer_score_num = answer_score_num
                        this.pass_mode = pass_mode
                        this.float_score_num = float_score_num
                        this.title = title
                        this.infoId = id
                        this.list = r.data.score_table_list || []
                        if(this.list.length>0) this.setDate()
                        this.defaultTitle = this.list.length>0 ? '编辑评分表' : '添加评分表'
                    }else{
                        this.defaultTitle = '添加评分表'
                    }
                })
            },
            perInfo(){
                let bool = false
                let fn = () => {
                    if(this.pass_count) bool = true
                    else this.$Message.info('请输入题目数量!');
                }
                if(this.pass_mode === 0) fn()
                if(this.pass_mode === 1) {
                    if(this.float_score_num || this.float_score_num === 0) bool = true
                    else this.$Message.info('请输入误差值!');
                }
                if(this.pass_mode === 2) {
                    if(this.float_score_num || this.float_score_num === 0) fn()
                    else this.$Message.info('请输入误差值!');
                }
                return bool
            },
            save(bool = false){
                console.log(this.pass_count,'this.pass_count');
                if(this.title){
                    if(this.list.length>0){
                        if(this.perInfo()){
                            this.list.map((t, i) => {
                                t.sort_num = i + 1
                                if(t.hasOwnProperty('children')){
                                    t.children.map((it, j) => {
                                        it.sort_num = j + 1
                                        if(it.hasOwnProperty('content_children')){
                                            it.content_children.map((item, l) => {
                                                item.sort_num = l + 1
                                            }) 
                                        }
                                        if(it.hasOwnProperty('children')){
                                            it.children.map((ic, k) => {
                                                ic.sort_num = k + 1
                                                if(ic.hasOwnProperty('content_children')){
                                                    ic.content_children.map((item, l) => {
                                                        item.sort_num = l + 1
                                                    }) 
                                                }
                                            })
                                        }
                                    }) 
                                }
                                if(t.hasOwnProperty('content_children')){
                                    t.content_children.map((it, j) => {
                                        it.sort_num = j + 1
                                    }) 
                                }
                            })
                            let d = {
                                score_table_info: { 
                                    pass_mode: this.pass_mode,
                                    float_score_num: +this.float_score_num,
                                    question_count: this.question_count, full_score_num: this.full_score_num, curriculum_id: +this.$route.params.id,
                                    answer_score_num: this.answer_score_num, pass_count: this.pass_count, title: this.title, catalog_id: this.catalogId
                                },
                                score_table_list: this.list,
                            }
                            if(this.infoId) d.score_table_info.id = this.infoId
                            PostData('product/curriculum_online_catalog/saveScoreTable', d).then(r => {
                                if(r.res_code == 1) {
                                    if(bool) this.cancel(true);
                                    this.$Message.info(r.msg);
                                }
                            })
                        }
                    }else this.$Message.info('请添加项目');
                }else this.$Message.info('请输入评分表名称');
            },
            fullScoreSum(){
                this.full_score_num = 0
                this.fullList.forEach(t => {
                    this.full_score_num += t
                })
            },
            answerScoreSum(){
                this.answer_score_num = 0
                this.answerList.forEach(t => {
                    this.answer_score_num += t
                })
            },
            setScores(val, it){
                if(it.answer_score > it.full_score) {
                    it.answer_score = 0
                    this.setAnswers(0, it)
                }
                this.fullList.splice(it.index, 1, val)
                this.fullScoreSum()
            },
            setAnswers(val, it){
                this.answerList.splice(it.index, 1, val)
                this.answerScoreSum()
            },
            moveComm(arr, curIndex, nextIndex){
                arr[curIndex] = arr.splice(nextIndex, 1, arr[curIndex])[0]
                return arr
            },
            isMove(arr, i, bool){
                let b = false
                if(arr.length > 1){
                    if(bool){
                        if(i) b = true
                        else this.$Message.info('已在顶部，无法上移')
                    }else {
                        if((i + 1) == arr.length) this.$Message.info('已在底部，无法下移')
                        else b = true
                    }
                }else this.$Message.info('目前只有一个项，无法移动')
                return b
            },
            movesTwo(t, i, l, bool){
                if(this.isMove(t.children, l, bool)){
                    let num = bool ? l - 1 : l + 1
                    t.children = this.moveComm(t.children, l, num)
                    this.list.splice(i, 1, t)
                }
            },  
            movesThree(t, i, l, m, bool){
                let it = t.children[l]
                if(this.isMove(it.children, m, bool)){
                    let num = bool ? m - 1 : m + 1
                    it.children = this.moveComm(it.children, m, num)
                    this.list.splice(i, 1, t)
                }
            },
            moves(i, bool){
               if(this.isMove(this.list, i, bool)){
                   let num = bool ? i - 1 : i + 1
                   this.list = this.moveComm(this.list, i, num)   
               }
            },
            movesContent(t, i, j, bool){
                if(this.isMove(t.content_children, j, bool)){
                   let num = bool ? j - 1 : j + 1
                   t.content_children = this.moveComm(t.content_children, j, num)       
                   this.list.splice(i, 1, t)   
                }
            },
            movesContentTwo(t, i, h, bool){
                let it = t.children[i]
                if(this.isMove(it.content_children, h, bool)){
                   let num = bool ? h - 1 : h + 1
                   it.content_children = this.moveComm(it.content_children, h, num)       
                   this.list.splice(i, 1, t)    
                }
            },
            movesContentThree(t, i, l, c, bool){
                let it = t.children[i]
                let item = it.children[l]
                if(this.isMove(item.content_children, c, bool)){
                   let num = bool ? c - 1 : c + 1
                   item.content_children = this.moveComm(item.content_children, c, num)       
                   this.list.splice(i, 1, t)    
                }
            },
            deletesContentThree(t, i, l, c){
                let it = t.children[i]
                let item = it.children[l]
                let fn = () => {
                    this.question_count = --this.question_count
                    this.fullList.splice(item.content_children[c].index, 1, 0)
                    this.answerList.splice(item.content_children[c].index, 1, 0)
                    item.content_children.splice(c, 1)
                    this.list.splice(i, 1, t)
                    this.fullScoreSum()
                    this.answerScoreSum()
                }
                if(item.content_children[c].hasOwnProperty('id')&&item.content_children[c].id){
                    this.handleDeletes(item.content_children[c].id, fn)
                }else fn()
            },
            cancel(bool = false){
                this.modal1 = false
                this.$emit("close", bool)
            },
            add(){
                this.list.push({title: '', children: [], content_children: [], isOpen: true, full_scores: 0 })
            },
            deletesTwo(t, i, l){
                let it = t.children[l]
                let fn = () => {
                    this.deleteData(it)
                    let itemChildren = it.children
                    if(itemChildren.length>0){
                        itemChildren.map((itc) => {
                            this.deleteData(itc)
                        })
                    }
                    t.children.splice(l, 1)
                    this.list.splice(i, 1, t)
                }
                if(t.children[l].hasOwnProperty('id')&&t.children[l].id){
                    this.handleDeletes(t.children[l].id, fn, true)
                }else fn()
            },
            deletesContentTwo(t, i, h){
                let it = t.children[i]
                let fn = () => {
                    this.question_count = --this.question_count
                    this.fullList.splice(it.content_children[h].index, 1, 0)
                    this.answerList.splice(it.content_children[h].index, 1, 0)
                    it.content_children.splice(h, 1)
                    this.list.splice(i, 1, t)
                    this.fullScoreSum()
                    this.answerScoreSum()
                }
                if(it.content_children[h].hasOwnProperty('id')&&it.content_children[h].id){
                    this.handleDeletes(it.content_children[h].id, fn)
                }else fn()
            },
            deleteData(t){
                if(t.hasOwnProperty('content_children')){
                    this.question_count -= t.content_children.length 
                    t.content_children.map((it, j) => {
                        this.fullList.splice(it.index, 1, 0)
                        this.answerList.splice(it.index, 1, 0)
                    }) 
                }
                this.fullScoreSum()
                this.answerScoreSum()
            },
            handleDeletes(id, fn, bool = false){
                this.$config.deleteModal(() => {
                    let url = bool ? 'removeItem' : 'removeContent'
                    PostData('product/curriculum_online_catalog/' + url, {id}).then(r => {
                        if(r.res_code == 1) {
                            fn()
                            this.save()
                        }
                    })
                })
            },
            deletesThree(t, i, l, m){
                let it = t.children[l]
                let fn = () => {
                    let item = it.children[m]
                    this.deleteData(item)
                    it.children.splice(m, 1)
                    this.list.splice(i, 1, t)
                }
                if(it.children[m].hasOwnProperty('id')&&it.children[m].id){
                    this.handleDeletes(it.children[m].id, fn, true)
                }else fn()
            },
            deletesDatas(it){
                if(it.hasOwnProperty('children')){
                    let itemChildren = it.children
                    if(itemChildren.length>0){
                        itemChildren.map((itc) => {
                            this.deleteData(itc)
                            return this.deletesDatas(itc)
                        })
                    }
                }
            },
            deletes(t, i){
                let fn = () => {
                    this.deleteData(t)
                    this.deletesDatas(t)
                    this.list.splice(i, 1)
                }
                if(t.hasOwnProperty('id')&&t.id){
                    this.handleDeletes(t.id, fn, true)
                }else fn()
            },
            deletesContent(t, i, j){
                let fn = () => {
                    this.question_count = --this.question_count
                    this.fullList.splice(t.content_children[j].index, 1, 0)
                    this.answerList.splice(t.content_children[j].index, 1, 0)
                    t.content_children.splice(j, 1)
                    this.list.splice(i, 1, t)
                    this.fullScoreSum()
                    this.answerScoreSum()
                }
                if(t.content_children[j].hasOwnProperty('id')&&t.content_children[j].id){
                    this.handleDeletes(t.content_children[j].id, fn)
                }else fn()
            },
            hide(i){
                let t = this.list[i]
                t.isOpen = !t.isOpen
                this.list.splice(i, 1, t)
            },
            hideTwo(i, l){
                let t = this.list[i]
                let it = t.children[l]
                it.isOpen = !it.isOpen
                this.list.splice(i, 1, t)
            },
            addContent(i){
                this.question_count = ++this.question_count
                let t = this.list[i]
                this.fullList.push(0)
                this.answerList.push(0)
                t.content_children.push({content: '', full_score: 0, answer_score: 0, index: this.fullList.length - 1})
            },
            addTwo(i){
                let t = this.list[i]
                t.children.push({title: '', children: [], content_children: [], isOpen: true})
                this.list.splice(i, 1, t)
            },
            addContentTwo(i, l){
                this.fullList.push(0)
                this.answerList.push(0)
                this.question_count = ++this.question_count
                let t = this.list[i]
                let it = t.children[l]
                it.content_children.push({content: '', full_score: 0, answer_score: 0, index: this.fullList.length - 1})
                this.list.splice(i, 1, t)
            },
            addContentThree(i, l, m){
                this.fullList.push(0)
                this.answerList.push(0)
                this.question_count = ++this.question_count
                let t = this.list[i]
                let it = t.children[l]
                let item = it.children[m]
                item.content_children.push({content: '', full_score: 0, answer_score: 0, index: this.fullList.length - 1})
                this.list.splice(i, 1, t)
            },
            addThree(i, l){
                let t = this.list[i]
                let it = t.children[l]
                it.children.push({title: '', content_children: []})
                this.list.splice(i, 1, t)
            }
        }
    }
</script>

<style lang="less" scoped>
    .analyser-btns{
        text-align: center;
        padding-right: 27px;
    }
    .md-btns{
        display: flex;
        justify-content: center;
        margin-top: 30px;
        .m-btn{
            width: 80px;
        }
    }
    .score-inputs{
        width: 50px !important;
        border:1px solid #dcdee2;
        border-radius: 4px;
        margin-left: 5px;
        background-color: #fff !important;
    }
    /deep/.pass-input{
        border: none !important;
        box-shadow: none !important;
    }
    .score-right-btns{
        position: absolute;
        right: 20px;
        width: 120px;
        height: 36px;
        cursor: pointer;
    }
    .score-view{
        display: flex;
        margin-bottom: 10px;
        align-items: center;
        padding: 0 20px;
        font-size: 16px;
        position: relative;
        .foot-text{
            margin-left: 20px;
        }
        .all-text{
            width: 60px;
            text-align: center;
            border-bottom: 1px solid #515a6e;
        }
    }
    .score-btns{
        color: #4098FF;
        display: flex;
        align-items: center;
        width: 120px;
        justify-content: flex-end;
        cursor: pointer;
    }
    /deep/.score-input {
        .ivu-input{
            background-color: #F0F0F7;
            border: none;
            line-height: 32px !important;
        }
    }
    .score-item{
        border: 1px solid #CDCED3;
        margin-bottom: 20px;
        .item1{
            padding: 0 20px;
            background-color: #F0F0F7;
            height: 42px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #CDCED3;
            /deep/.score-input1 {
                .ivu-input{
                    background-color: #F0F0F7;
                    border: none;
                }
            }
        }
        .item-content{
            padding-left: 13px;
            padding-right: 20px;
            height: 42px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #CDCED3;
         }
    }
    .add-btns{
        height: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 15px;
        white-space: nowrap;
        color: #4098FF;
        cursor: pointer;
    }
    /deep/.score-input {
        .ivu-input{
            background-color: #fff;
        }
    }
    /deep/.score-title-input{
        .ivu-input{
            font-size: 16px !important;
        }
    }
    /deep/ .ivu-input-number-handler-wrap{
        display: none !important
    }
</style>
<template>
    <div>
        <ScoreModal :details="details" :type="types"
              :columns="columns" @submission="submission"   :studentInfo="studentInfo"   :show="show" @close-modal="closeModal" :title="modalTitle"/>
        <div class="state">
            <Select v-model="coursValue" class="course-select" @on-change="coursChange">
                <Option v-for="item in courseSelect" :key="item.id" :value="item.id">{{item.title}}</Option>
            </Select>
            <Select v-model="stateValue" class="state-select" @on-change="selectChange">
                <Option v-for="item in stateSelect" :key="item.id" :value="item.id">{{item.title}}</Option>
            </Select>
            <Select v-model="scoreValue" class="state-select" @on-change="scoreChange">
                <Option v-for="item in scoreSelect" :key="item.id" :value="item.id">{{item.title}}</Option>
            </Select>
            <div class="state-data">
                <div v-for="(item, index) in numList" :key="index" class="state-data-box">
                    <div>
                        <span class="state-data-box-num font-regular1">{{item.num}}</span>
                        <span class="state-data-box-unit">{{item.unit}}</span>
                    </div>
                    <div class="state-data-box-title">{{item.title}}</div>
                </div>
            </div>
        </div>
        <div class="batch">
            <div class="batch-title">选项</div>
            <!-- Batch check -->
            <Button class="batch-read" type="primary" @click="BatchCheck(1)" ghost>批量签到</Button>
            <Button class="batch-check" type="primary" @click="BatchCheck(0)" ghost>批量取消签到</Button>
            <Button class="batch-read2" type="primary" @click="Marking" ghost>批量评分</Button>
        </div>
        <tables :tabel-height="tableHeight" :column="column" :table-data="list" @operation1="see"
            @operation2="signIn"    @select-tables="selectTables" @on-select-all="selectTablesAll"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import tables from '../../components/tables'
    import pageList from '../../components/Page'
    import pageMixins from '../mixins/pageMixins'
    import postData from '../../api/postData'
    import ScoreModal from './modal/score-modal'
    import downloadUrl from '../../../config/url'
    import { columnSee, columnBatchScore } from './modal/const'
    export default {
        components: {tables, pageList, ScoreModal},
        mixins: [pageMixins],
        data() {
            return {
                column: [
                    {title: '选项', type: 'selection', width: 100},
                    {title: '姓名', key: 'user_realname', minWidth: 100},
                    {title: '用户ID', key: 'user_username', minWidth: 100},
                    {title: '签到状态', key: 'state', minWidth: 180,
                        render: (h, params) => {
                            let d = params.row.state ? '已签到' : '未签到' 
                            let color = params.row.state ? '#2EBF07' : '#F54802'
                            return h('span',{ style: { color } }, d)
                        }
                    },
                    {
                        title: '评分', key: '', minWidth: 100,
                        render: (h, params) => {
                            return h('span', params.row.score || 0 + '分')
                        }
                    },
                    { title: '已完成', key: 'state', stateKey: 'curriculum_finish', minWidth: 100,
                     render: (h, params) => {
                            return h('span', params.row.curriculum_finish+'/'+params.row.curriculum_all )
                     }
                    },
                    {
                        title: '操作',
                        minWidth: 100,
                        slot: 'operation',
                        align: 'left',
                        operation_state: true,
                        operation: [['查看', 'operation1'], [['取消签到', '签到'], 'operation2']],
                    }
                ],
                list: [],
                details: null,
                coursValue: '',
                stateValue: 'all',
                scoreValue: 'all',
                courseSelect: [],
                stateSelect: [
                    {id: 'all', title: '签到状态'},
                    {id: 1, title: '已签到'},
                    {id: 0, title: '未签到'},
                ],
                scoreSelect: [
                    {id: 'all', title: '评分状态'},
                    {id: 1, title: '已评分'},
                    {id: 0, title: '未评分'},
                ],
                numList: [
                    {num: 0, unit: '人', title: '已签到'},
                    {num: 0, unit: '人', title: '已评分'},
                    {num: 0, unit: '分', title: '平均分'},
                ],
                tableHeight: null,
                show: false,
                modalTitle: '',
                selectionList: [],
                types: '',
                studentInfo: {},
                columns: []
            }
        },
        beforeDestroy() {
            this.setShowModal = null;
            this.getActiveCourse = null;
            this.getList = null;
            this.see = null;
            this.getSelectList = null;
        },
        methods: {
            setBath(type){
                let text = type ? '确定给选中学员签到？' : '确定取消选中学员的签到状态？'
                let arr = [];
                this.selectionList.forEach((t) => {
                    arr.push(t.student_underline_id)
                })
                let d = {student_underline_ids: arr, state: type}
                this.tips(text, d, 'product/curriculum_offline_grade/change_state_mul')
            },
            BatchCheck(type){
                if(this.selectionList.length>0){
                    if(this.handleSelectionList()){
                        if(type) this.$Message.warning('已签到的学员不能再签到')
                        else this.setBath(type)
                    }else{
                        if(!type) this.$Message.warning('未签到的学员不能取消签到状态')
                        else this.setBath(type)
                    }
                }else this.$Message.warning('请选择学员')
            },
            sendSignIn(d, url){
                postData(url, d).then((res)=> {
                    if(res.res_code == 1)  this.getList()
                })
            },
            tips(text, d, url){
                this.$Modal.confirm({
                    title: '提示',
                    content: `<p>${text}</p>`,
                    onOk: () => {
                        this.sendSignIn(d, url)
                    }
                });
            },
            signIn(row, index){
                let text = !row.state ? '确定给该学员签到？' : '确定取消该学员的签到状态？'
                let d = {student_underline_id: row.student_underline_id, state: !row.state}
                this.tips(text, d, 'product/curriculum_offline_grade/change_state')
            },
            setShowModal(text, details, type) {
                this.show = true
                this.modalTitle = text
                this.details = details
                this.types = type
            },
            setSelVal(val){
                return val == 'all' ? '' : val
            },
            selectChange(val) {
                this.stateValue = val
                this.getList()
            },
            coursChange(val){
                this.coursValue = val
                this.getList()
            },
            scoreChange(val){
                this.scoreValue = val
                this.getList()
            },
            getActiveCourse(id){
                let d = {}
                this.courseSelect.forEach(t => {
                    if(t.id == id) d = t;
                })
                return d
            },
            handleSelectionList(){
                let arr = []
                this.selectionList.forEach((t) =>{
                    arr.push(t.state)
                })
                return arr.includes(0) ? false : true
            },
            Marking(){
                if(this.selectionList.length>0){
                    this.studentInfo = this.getActiveCourse(this.coursValue)
                    this.columns = columnBatchScore
                    if(this.handleSelectionList())  this.setShowModal('批量评分', this.selectionList, 'BatchScore')
                    else this.$Message.warning('未签到学员不能评分')
                }else this.$Message.warning('请选择学员')
            },
            see(row) {
                postData('product/curriculum_offline_grade/curriculum_of_student_get_list', {student_id: row.user_id,term_id: this.$route.query.id}).then((res) => {
                    if (res.res_code == 1) {
                        this.setShowModal('查看学员', res.data, 'See')
                        this.columns = columnSee
                        this.studentInfo = row
                    }
                })
            },
            selectTables(selection, row) {
                this.selectionList = selection
            },
            selectTablesAll(selection, row) {
                this.selectionList = selection
            },
            getList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    // 91  this.coursValue
                    curriculum_id: this.coursValue,
                    sign_state: this.setSelVal(this.stateValue),
                    grade_state: this.setSelVal(this.scoreValue)
                }
                postData('/product/curriculum_offline_grade/student_of_curriculum_get_list', data).then(res => {
                    if (res.res_code == 1) {
                        this.list = res.data.data
                        this.selectionList = []
                        // this.list.map((t) => {
                        //   if(!t.state) t._disabled = true
                        // })
                        $MakeAppointment.$emit('MakeAppointment', res.data.detail.apply_num)
                        this.numList[0].num = res.data.detail.sign_rate || 0
                        this.numList[1].num = res.data.detail.graded || 0
                        this.numList[2].num = res.data.detail.ava_score || 0
                    }
                })
            },
            closeModal(val) {
                this.show = val;
            },
            submission(){
                this.getList()
            },
            getSelectList(){
                postData('product/curriculum_offline_grade/curriculum_of_term_get_list', {term_id: this.$route.query.id}).then((res) => {
                if(res.res_code == 1) {
                     this.courseSelect = res.data
                     if(this.courseSelect.length>0) {
                         this.coursValue = this.courseSelect[0].id
                         this.getList()
                     }
                }
               })
            }
        },
        mounted() {
            this.pageSize = 10
            this.tableHeight = window.innerHeight - 260;
            this.getSelectList()
        }
    }
</script>

<style lang="less" scoped>
    .size{
        width: 100px;
        height: 30px;
    }
    .screen {
        background-color: #fff;
    }
    /deep/ .ivu-select-selection {
        border-radius: 100px;
        height: 36px;
        padding-left: 15px;
    }
    /deep/ .ivu-select-selection {
        background: #EEEEF6;
    }
    .selects{
        border-radius: 18px;
        margin-left: 40px;
    }
    .state {
        background-color: #fff;
        border-top: 1px solid #F0F0F7;
        height: 80px;
        display: flex;
        align-items: center;
        position: relative;
        .course-select{
            width: 300px;
            .selects;
        }
        .state-select {
            width: 120px;
            .selects;
        }
        .state-data {
            display: flex;
            position: absolute;
            right: 40px;
        }
        .state-data-box {
            margin-left: 30px;
            &-unit {
                font-size: 14px;
                color: #4098FF;
            }
            &-title {
                font-size: 14px;
                color: #8C9095;
            }
        }
    }
    .batch {
        text-align: left;
        display: flex;
        border-top: 1px solid #F0F0F7;
        background-color: #fff;
        height: 60px;
        align-items: center;
        &-title {
            margin-left: 36px;
            font-size: 16px
        }
        &-read {
            margin-left: 40px;
            .size;
        }
        &-read2 {
            margin-left: 10px;
            .size;
        }
        &-check{
            margin-left: 10px;
            width: 130px;
            height: 30px; 
        }
    }
</style>

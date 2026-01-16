<template>
    <div class='manage-offline-course'>
        <SeeModal :show="seeModal" :details="details" @close-modal="closeModal1" />
        <allocated :show="allocatedModal" :details="allocateddetails" @close-modal="closeModal2" />
        <screen :btn-type="btnType" :types="6" :title="title" btnName="添加学期" @handleBack="handleBack" @handleClick="addOfflineSemesterHandler"/>
        <Tables :tabel-height="tableHeight" :is-serial="pageDataCount" @operation1="editOfflineSemester" @operation2="see" @operation3="allocated"
                @operation4="sendOfflineCourseHandler" @operation5="deleteOfflineSemester" :column="columns1" :table-data="dataList"  @operation6="signUp"/>
        <Page :current="page_num" :total="page_conut" :page-size="pageSize" @on-change="pageList"></Page>
        <Modal v-model="chooseSign" :footer-hide="true" title="请选择签到课程">
            <RadioGroup v-model="signId" vertical style="min-height: 280px">
                <Radio v-for="item in signList" :key="item.id" :label="item.id">
                    <span>课程：{{item.title}}</span>
                </Radio>
            </RadioGroup>
            <div style="display: flex;justify-content: center;margin-top: 80px;">
                <Button type="primary" style="width: 120px;" @click="handleSignUp">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Tables  from '../../../components/tables.vue'
    import SaveOrder from '../../../components/SaveOrder'
    import screen from '../../../components/ScreenFrame'
    import { Dialog } from '../../dialogs';
    import * as types from '../../dialogs/types';
    import { mapActions, mapState } from 'vuex'
    import { Config } from '../../../config/base'
    import postData from '../../../api/postData.js'
    import setAuthMixins from '../setAuthMixins'
    import SeeModal from "./see-modal.vue";
    import allocated from './allocated.vue'

    export default {
        mixins: [Dialog, setAuthMixins],
        components: { 'save-order': SaveOrder, screen, SeeModal, Tables, allocated},
        data() {
            return {
                seeModal: false,
                dirty: false,
                isdelete: false,
                deleteData: null,
                courseNums: 12,
                showModal: false,
                allocatedModal: false,
                allocateddetails: {},
                detailData: {},
                subjectList: [],
                subject_id: JSON.parse(sessionStorage.getItem('OffLineClassTheme')).id,
                title: JSON.parse(sessionStorage.getItem('OffLineClassTheme')).title,
                theme: JSON.parse(sessionStorage.getItem('OffLineClassTheme')),
                current: 1,
                total: null,
                pageSize: 12,
                page_num: 1,
                details: {},
                term_row: null,
                tableHeight: null,
                termData: {},
                chooseSign: false,
                signId: null,
                signList: [],
                offlineCurriculums: {}
            }
        },
        computed: {
            ...mapState({
                offline_curriculum_detail1: state => state.offline_curriculum.offline_curriculum_detail,
                page_conut: state => state.offline_curriculum.page_conut,
            }),
            pageDataCount() {
                return {
                    isSerial: true,
                    current: this.page_num,
                    pageSize: this.pageSize,
                }
            },
            dataList() {
                return this.$store.state.offline_curriculum.offline_term_list;
            },
            columns1(){
                let d = [['编辑','operation1'], ['查看预约','operation2'],['分配','operation3'],['发送','operation4'], ['签到卡', 'operation6'], ['删除','operation5']]
                let btnList = this.btnType ? d : [['发送','operation4']]
                return [
                    {
                        key: 'title',
                        title: '学期名称',
                        align: 'left',
                        minWidth: 200
                    },
                    {
                        key: 'student_num',
                        title: '预约人数',
                        width: 100
                    },
                    {
                        key: '',
                        title: '开课日期',
                        minWidth: 240,
                        render: (h, params) => {
                            let open_date = this.$config.formatDate(params.row.start_time);
                            let end_date = this.$config.formatDate(params.row.end_time);
                            let d = end_date&&end_date!='-' ? '至' + end_date : ''
                            return h('span', open_date + d)
                        }
                    },
                    {
                        key: 'register_end_time',
                        title: '报名截止日期',
                        width: 150,
                    },
                    {
                        title: '操作',
                        minWidth: 360,
                        slot: 'operation',
                        operationStudentNum: true,
                        align: 'left',
                        operation: btnList,
                    }]
            }
        },
        beforeDestroy(){
            this.copyItem = null;
            this.editOfflineSemester = null;
            this.addOfflineSemesterHandler = null;
            this.sendOfflineCourseHandler = null;
            this.deleteOfflineSemester = null;
            this.getSubjectCurriculumList = null;
        },
        methods: {
            ...mapActions([ 'delete_offline_term', 'get_offline_curriculum_detail']),
            handleBack() {
                this.$router.replace({name: 'open-product'})
            },
            closeModal1(){
                this.seeModal = false
            },
            closeModal2(){
                this.allocatedModal = false
            },
            see(row, index){
                this.details = row
                this.seeModal = true
            },
            handleClick2() {
                this.$router.push('offline-map')
            },
            //分配
            allocated(row, index){
                postData('product/curriculum_offline_term/getTermAndCurriculums', {term_id: row.id}).then((res) => {
                    if(res.res_code == 1){
                        let d = res.data
                        d.term_id = row.id
                        d.student_num = row.student_num
                        this.termData = {
                            term_id: row.id,
                            student_num: row.student_num
                        }
                        sessionStorage.setItem('termData', JSON.stringify(this.termData))
                        this.allocatedModal = true;
                        this.allocateddetails = d
                    }
                })
            },
            //复制
            copyItem(row, index){
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定你要复制该学期？',
                    onOk: () => {
                        postData('product/curriculum_offline_term/copyTerm',{term_id: row.id}).then((res) => {
                            if(res.res_code === 1){
                                this.getList()
                                this.$Message.success(res.msg);
                            }
                        })
                    },
                    onCancel: () => {}
                });
            },
            sendOfflineCourseHandler(row, index) {
                this.handleSelModal(types.SEND_OFFLINE_COURSE, {row: row});
            },
            editOfflineSemester(row, index) {
                postData('product/curriculum_offline_term/getTermAndCurriculums', {term_id: row.id}).then((res) => {
                    if(res.res_code == 1){
                        let d = res.data
                        this.handleSelModal(types.ADD_OFFLINE_SEMESTER, { type: 2, row: d,page_size: this.pageSize,
                        page_num: this.page_num, offlineCurriculums: d.offlineCurriculums})
                    }
                })
            },
            addOfflineSemesterHandler() {
                console.log(this.subjectList,'this.subjectList');
                this.handleSelModal(types.ADD_OFFLINE_SEMESTER, { type: 1, page_size: this.pageSize,
                page_num: this.page_num, offlineCurriculums: this.subjectList})
            },
            deleteOfflineSemester(row, index) {
                var vm = this;
                if (row.can_delete == 0) {
                    this.$Modal.info({ title: '提示', content: '<p>无法删除该学期!</p >' });
                } else {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定您要删除该学期?</p >',
                        onOk: () => {
                            vm.delete_offline_term({ index, row });
                        },
                    });
                }
            },
            setData(){
                return {
                    subject_id: JSON.parse(sessionStorage.getItem('OffLineClassTheme')).id,
                    page_size: this.pageSize,
                    page_num: this.page_num,
                }
            },
            signUp(row) {
                this.$Message.info("暂无签到卡功能")
                // postData('product/curriculum_offline_term/getTermAndCurriculums', {term_id: row.id}).then((res) => {
                //     if(res.res_code == 1){
                //         if(res.data.offlineCurriculums.length == 1) {
                //             window.open(`sign-up?id=${res.data.offlineCurriculums[0].id}`)
                //             sessionStorage.setItem('signUp', JSON.stringify(res.data.offlineCurriculums[0]))
                //         } else{
                //             this.chooseSign = true
                //             this.signList = res.data.offlineCurriculums
                //         }
                //     }
                // })
            },
            handleSignUp() {
                if(this.signId) {
                    this.chooseSign = false
                    this.signList.forEach(item => {
                        if(item.id == this.signId) this.offlineCurriculums = item
                    })
                    sessionStorage.setItem('signUp', JSON.stringify(this.offlineCurriculums))
                    window.open(`sign-up?id=${this.signId}`)
                }else this.$Message.info('请选择课程')
            },
            rowExpandHandler(row) {
                this.$store.dispatch('get_offline_curriculum_list', { page_size: this.pageSize,
                    page_num: this.page_num,term_underline_id: row.id})
            },
            manageSignupHandler(row, index) {
                this.$router.replace({ name: 'offline-course-manage-signup', params: { id: row.id } })
            },
            pageList(val){
                this.page_num = val;
                this.getList()
            },
            getList(){
                this.$store.dispatch('get_offline_term_list', this.setData());
            },
            getSubjectCurriculumList(){
                postData('product/curriculum_offline/getSubjectCurriculumList',{subject_id: this.theme.id}).then((res) => {
                    if(res.res_code==1) this.subjectList = res.data
                    if(this.subjectList.length>0){
                        this.subjectList.map((t) => {
                            t.class_start_time = null
                        })
                    }
                })
            },
        },
        mounted() {
            $SplitGroupRefresh.$on('SplitGroupRefresh',()=>{
                let d = JSON.parse(sessionStorage.getItem('termData'))
                d.id = d.term_id
                this.allocated(d)
            })
            this.getSubjectCurriculumList()
            this.getList()
            this.tableHeight = window.innerHeight - 130
        }
    }
</script>
<style scoped lang="less">
    /*/deep/ .ivu-icon-ios-arrow-forward:before{*/
        /*content: '分配学员'*/
    /*}*/
    /deep/ .ivu-table-cell-expand-expanded{
        transform: none
    }
    .manage-offline-course{
        position: relative;
        height: 100%;
        /deep/ .ivu-page{
            position: absolute;
            right: 0;
            left: 0;
            bottom: 0;
            margin: 0 auto;
        }
    }
    /deep/.ivu-btn-text{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
    }
    /deep/.prop_key_0>.ivu-table-cell>span{
        display: none
    }
    .pos{
        position: absolute;
        right: 0;
    }
</style>

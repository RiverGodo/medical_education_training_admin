<template>
    <Modal :transfer="true" class="course-details-modal" :width="780" v-model="modal1" footer-hide @on-cancel="cancel">
        <div class="title">{{title}}</div>
        <div class="sels-view">
            <Select @on-change="change1" v-model="option1" class="sels">
                <Option v-for="item in select1" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
            <Select @on-change="change2" v-model="option2" class="sels">
                <Option v-for="item in select2" :value="item.id" :key="item.id">{{ item.batch || item.title }}</Option>
            </Select>
            <Select @on-change="change3" v-if="isSemester" v-model="option3" class="sels">
                <Option v-for="item in select3" :value="item.id" :key="item.id">{{ item.batch || item.title }}</Option>
            </Select>
            <a :href="downUrl"><Button type="primary" style="width:100px; height: 28px">导出</Button></a>
        </div>
        <tables :isSerial="pageDataCount" :tabelHeight="396" :column="columns" :table-data="list" @operation1="see"></tables>
        <PageList :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </Modal>
</template>

<script>
    import tables from '../../../components/tables'
    import PageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    export default {
        components: {tables, PageList},
        mixins: [pageMixin],
        props: {
            title: String,
            show: Boolean,
            isSemester: Boolean // true 学期报名详情 false 作业完成详情
        },
        data() {
            return {
                total: 100,
                modal1: this.show,
                option2: 'all',
                select2: [
                    {batch:  this.isSemester ? '全部学期' : '全部学员', id: 'all'}
                ],
                option1: 'all',
                select1: [],
                option3: 'all',
                select3: [],
                selectList: [],
                list: [],
                columns:  [
                    {
                        title: '用户ID',
                        key: 'username',
                        align: 'left',
                        minWidth: 80
                    }, {
                        title: '真实姓名',
                        key: 'realname',
                        minWidth: 100
                    },
                    {
                        title: '学科',
                        key: 'department_name',
                        align: 'left',
                        minWidth: 80,
                    },
                    {
                        title: '批次',
                        key: 'batch',
                        minWidth: 80,
                    },
                    {
                        title:  this.isSemester ? '签到状态' : '提交状态',
                        key: 'mark_state',
                        minWidth: 100,
                        render: (h, params) => {
                            let d = this.isSemester ? ['已签到','未签到'] : ['已提交',' 未提交']
                            const state = this.isSemester ? params.row.mark_state : (params.row.homework_state >= 3 ? 1 : 0)
                            // return h('span', params.row.mark_state == 1 ? d[0] : d[1])
                            return h('div', 
                                {style: {display: 'flex', alignItems: 'center'}}, 
                                [
                                    h('div', {style: {marginRight: '8px',width: '6px', height: '6px',borderRadius: '3px', backgroundColor: state == 1 ? '#2EBF07' : '#C0C4DA'}}, ),
                                    h('span', state == 1 ? d[0] : d[1])
                                ]
                            )
                        },
                    },
                    {
                        title: '评分(满分100)',
                        key: 'score',
                        minWidth: 150,
                    },
                    {
                        title: '操作',
                        minWidth: 100,
                        slot: 'operation',
                        operation_btn_hide: false,
                        align: 'left',
                        operation: [
                            ['查看详情', 'operation1'],
                        ]
                    }
                ],
            }
        },
        computed: {
            semesterDowmUrl(){
                let u = BaseUrl+`product/exportStudentOfflineList?product_id=${+this.$route.query.id}`
                let batch_id = this.option3 === 'all' ? null : this.option3
                let batch = batch_id ? `&batch_id=${this.option3}` : ''
                let subject_id = this.option1 === 'all' ? null : this.option1
                let subject = subject_id ? `&subject_id=${this.option1}` : ''
                let term_id = this.option2 === 'all' ? null : this.option2
                let term = term_id ? `&term_id=${this.option2}` : ''
                return u + batch + subject + term
            },
            hwDownUrl(){
                let u = BaseUrl+`product/exportStudentHwList?product_id=${+this.$route.query.id}`
                let batch_id = this.option2 === 'all' ? null : this.option2
                let batch = batch_id ? `&batch_id=${this.option2}` : ''
                let homework_id = this.option1 === 'all' ? null : this.option1
                let homework = homework_id ? `&homework_id=${this.option1}` : ''
                return u + batch + homework
            },
            downUrl(){
                return this.isSemester ? this.semesterDowmUrl : this.hwDownUrl;
            }
        },
        watch: {
            show(_new){
                console.log(_new,'KMK');
                this.modal1 = _new
                if(_new) { 
                    this.getList()
                    // this.getBatchList(+this.$route.query.organization_id)
                    if(this.isSemester){
                        this.select3 = this.selectList
                        this.getOfflineSubjectList()
                        // this.getOfflineTermList()
                    }else{
                        this.select2 = this.selectList
                        this.getHwList()
                    }
                }
            },
        },
        mounted() {
            this.getBatchList(+this.$route.query.organization_id)
        },
        methods: {
            change1(val){
                this.current = 1
                this.option1 = val;
                this.getList()
                if(this.isSemester){
                    this.getOfflineTermList(val)
                }
            },
            change2(val){
                this.current = 1
                this.option2 = val;
                this.getList()
            },
            change3(val){
                this.current = 1
                this.option3 = val;
                this.getList()
            },
            getHwList(){
                PostData('product/getHwList', {product_id: +this.$route.query.id}).then((r) => {
                    if(r.res_code == 1){
                      this.select1 = [{title: '全部作业', id: 'all'}, ...r.data]
                    }
                })
            },
            getOfflineSubjectList(){
                PostData('product/getOfflineSubjectList', {product_id: +this.$route.query.id}).then((r) => {
                    if(r.res_code == 1){
                      this.select1 = [{title: '全部主题', id: 'all'}, ...r.data]
                    }
                })
            },
            getOfflineTermList(val){
                if (val != 'all') {
                    if(this.option1){
                        PostData('product/getOfflineTermList', {subject_id: val}).then((r) => {
                            if(r.res_code == 1){
                            this.select2 = [{title: '全部学期', id: 'all'}, ...r.data]
                            this.$forceUpdate()
                            }
                        })
                    }else this.$Message.info('请先选择主题!'); 
                }
            },
            cancel(){
                this.modal1 = false
                this.$emit('close')
            },
            see(row){
                window.open('/dashboard/see-student?id='+row.student_id, '_blank')
            },
            getBatchList(organization_id){
                let d = {
                    organization_id,
                    batch: '', 
                    page_size: 9999,
                    page_num: 1,
                }
                PostData('user/getBatchList', d).then((r) => {
                    if(r.res_code == 1){
                        let da = r.data.data
                        this.selectList = [{batch: '全部学员', id: 'all'}, ...da]
                    }
                })
            },
            getList(){
                let da = {}
                if(this.isSemester){
                    da = {
                        subject_id: this.option1 === 'all' ? '' : this.option1, 
                        term_id: this.option2 === 'all' ? '' : this.option2,
                        batch_id: this.option3 === 'all' ? '' : this.option3,
                    }
                }else {
                    da = { 
                        homework_id: this.option1 === 'all' ? '' : this.option1,
                        batch_id: this.option2 === 'all' ? '' : this.option2,
                    }
                }
                let d = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    product_id: +this.$route.query.id,
                    ...da
                }
                let url = this.isSemester ? 'getStudentOfflineList' : 'getStudentHwList'
                PostData('product/' + url, d).then((r) => {
                    if(r.res_code == 1){
                        this.list = r.data.data
                        this.total = r.data.count
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .course-details-modal{
         /deep/.ivu-table th, /deep/.ivu-table td{
           font-size: 14px;
           height: 35px;
        }
        /deep/ .ivu-modal-body{
            padding: 0 0 15px 0
        }
        /deep/ .ivu-btn-text{
            font-size: 14px !important
        }
        .title{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #474C63;
            width: 100%;
            text-align: center;
            padding: 16px 0;
            height: 56px;
        }
        .sels-view{
            display: flex;
            align-items: center;
            height: 58px;
            padding-left: 30px;
            .sels{
                width:150px; 
                height: 28px;
                margin-right: 10px;
                /deep/ .ivu-select-selection{
                    height: 28px;
                }
                /deep/ .ivu-select-placeholder, /deep/ .ivu-select-selected-value{
                    line-height: 26px;
                }
            }
        }
    }
</style>
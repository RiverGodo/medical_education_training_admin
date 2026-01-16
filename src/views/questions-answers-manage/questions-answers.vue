<template>
    <div class="questions-answers">
        <modals :isEdit="isEdit" :questionId="questionId" :isReply="isReply" :show="show" @close="close" />
        <div class="heads">问答管理</div>
        <screen @resetPage="resetPage" size-title1="提问总数" :isSelTime="isSelTime" :isDaterange="isDaterange" :size-num1="answerCount+ (answerCount ? '/'+total : '')" select-type1 selectType2 :types="20" :select5="invoiceSelect" :select6="select6" :select2="select2" placehodle="搜索产品名称" @selectChange1="selectChange1"
        @dataPickerChange="dataPickerChange" @dataPickerClear="dataPickerClear" @cascaderChange="cascaderChange" @selectChange5="selectChange5" @selectChange6="selectChange6" />
        <tables @row-click="see" :column="columns1" :table-data="list" :tabel-height="tableHeight" @operation1="operation1"
            @operation2="operation2" @operation3="operation3"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../components/ScreenFrame.vue'
    import tables from '../../components/tables'
    import pageList from '../../components/Page'
    import pageMixin from '../mixins/pageMixins'
    import modals from './modals.vue'
    export default {
        components: {screen, tables, pageList, modals},
        mixins: [pageMixin],
        data() {
            let da = [[['取消精华', '设为精华'], 'operation2'], ['删除', 'operation3']]
            return {
                isEdit: false,
                answerCount: 0,
                questionId: 0,
                isReply: false,
                show: false,
                isSelTime: true,
                total: 0,
                tableHeight: null,
                list: [],
                data_picker: [],
                times: 'WEEK',
                questionsAnswerss: 'all',
                course: 'all',
                isDaterange: false,
                select2: [ {value: 'all', label: '全部产品'} ],
                invoiceSelect:  [
                    {id: 'all', title: '全部问答'},
                    {id: 'CHOICENESS', title: '精选问答'},
                    {id: 'ANSWER', title: '导师已回复'},
                    {id: 'NOANSWER', title: '导师未回复'},
                ],
                select6: [
                    {id: 'WEEK', title: '近7天'},
                    {id: "MONTH", title: '近30天'},
                    {id: "6MONTH", title: '近半年'},
                    {id: "YEAR", title: '近一年'},
                    {id: "CUSTOM", title: '自定义'},
                ],
                columns1: [
                    {
                        title: '提问用户', key: 'realname', minWidth: 200, align: 'left',
                        render: (h, params) => {
                            return h('div', {style: {display: 'flex', alignItems: 'center'}},
                            [
                                h('img',{
                                    attrs:{ src: params.row.head_img_url},
                                    style: {width: '30px',height: '30px', marginRight: '5px', borderRadius: '15px'}
                                }),
                                h('span', params.row.realname)
                            ]
                            )
                        }
                    },
                    { 
                        title: '问题', key: 'title', width: 180, ellipsis: true, align: 'left',
                        render: (h, params) => {
                            return h('div', {style: {display: 'flex', alignItems: 'center'}},
                            [
                                params.row.state ? h('div',{
                                    style: {
                                        height: '18px', padding: '0 2px',
                                        borderRadius: '2px', background: ' #FB4053',
                                        fontSize: '14px',color: '#fff',fontFamily: 'PingFangSC-Medium',
                                        marginRight: '5px', lineHeight: '18px'
                                    }
                                }, '精') : null,
                                h('span', params.row.title)
                            ]
                            )
                        }
                    },
                    {title: '导师回复', key: 'teacher_answer', width: 180, ellipsis: true,},
                    {title: '回复数量', key: 'answer_count', minWidth: 100},
                    {title: '所属课程', key: 'curriculum_title', minWidth: 100},
                    {title: '提问时间', key: 'create_time', minWidth: 100},
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        align: 'left',
                        operation_state: true,
                        operation_btn_hide: false,
                        // operation_btn_hide: true,
                        // operationLast: false,
                        operation: this.$config.getRoleId() == 4 ? [['回复', 'operation1'], ...da] : da
                    }
                ],
            }
        },
        mounted(){
            this.tableHeight = window.innerHeight - 180
            this.getSelscts()
            this.getList()
        },
        methods: {
            getSelscts(){
                let organization_id = this.$config.getRoleId() == 1 ? this.organization_id : +sessionStorage.getItem('organizationId')
                PostData('components/getProducts', { organization_id }).then((r) => {
                    if(r.res_code == 1) {
                        let da = {id:0, value: 'all',title:'全部产品', label: '全部产品'}
                        r.data.map((t) => {
                            t.value = t.id
                            t.label = t.title
                            // t.children = []
                            t.loading = false
                        })
                        this.select2 = [da, ...r.data]
                        // console.log(this.select2,'this.select2')
                    }
                })
            },
            getList(){
                let d = {
                    organization_id: this.$config.getRoleId() == 1 ? this.organization_id : +sessionStorage.getItem('organizationId'), 
                    time_type: this.times,
                    product_id: this.course == 'all' ? null : this.course,
                    keyword_type: this.questionsAnswerss, 
                    page_num: this.current, 
                    page_size: this.pageSize
                }
                if(this.times == 'CUSTOM'&&this.data_picker.length==2){
                    d.start_time = this.data_picker[0]
                    d.end_time = this.data_picker[1]
                }
                PostData('product/getQuestionListForAdmin', d).then((r) => {
                    if(r.res_code == 1) {
                        this.total = r.data.count
                        this.answerCount = r.data.answer_count
                        this.list = r.data.data || []
                    }
                })
            },
            close(){
                this.show = false
            }, 
            see(val){
                this.isEdit = false
                this.show = true
                this.questionId = val.id
                this.isReply = this.$config.getRoleId() == 4
            },
            operation1(val) {
                this.isEdit = true
                this.show = true
                this.questionId = val.id
                this.isReply = true
            },
            operation2(val, i) {
                let state = val.state ? 0 : 1
                const TEXTS = state ? '是否将此问题设置为精华 ?' : '是否取消此精华问答 ?'
                this.$config.deleteModal(() => {
                    PostData('product/setChoiceness', {question_id: val.id, state}).then((r) => {
                        if(r.res_code == 1) {
                            val.state = state
                            this.list.splice(i ,1, val)
                        }
                    })
                }, TEXTS)
            },
            operation3(val, i) {
                this.$config.deleteModal(() => {
                PostData('product/removeQuestion', {question_id: val.id}).then((r) => {
                    if(r.res_code == 1) {
                        this.list.splice(i, 1)
                    }
                })
                }, '是否删除此问答 ？')
            },
            selectChange1(val){
                this.organization_id = val
                this.getList()
            },
            cascaderChange(val){
                console.log(val);
                this.course = val
                this.getList()
            },
            selectChange5(val){
                this.questionsAnswerss = val == 'all' ? '' : val
                this.getList()
            },
            selectChange6(val){
                this.isDaterange = val == 'CUSTOM'
                this.times = val
                this.getList()
            },
            dataPickerChange(val) {
                this.data_picker  = val
                this.getList()
            },
            dataPickerClear() {
                this.data_picker  = ['', '']
                this.getList()
            },
        }
    }
</script>

<style lang="less" scoped>
    .questions-answers{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .heads{
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: #FFFFFF;
            box-shadow: 0 2px 4px 0 rgba(71,76,99,0.05);
            font-size: 20px;
        }
    }
</style>
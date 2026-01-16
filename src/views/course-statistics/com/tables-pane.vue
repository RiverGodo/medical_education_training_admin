<template>
    <div class="tables-pane">
        <modals @close="close" :isSemester="false" :show="show" title="作业完成详情"/>
        <div class="sel-head">
            <Select v-model="selStudent" @on-change="changeSels" class="sels">
                <Option v-for="item in students" :value="item.id" :key="item.id">{{ item.batch }}</Option>
            </Select>
            <a :href="downUrl"><Button type="primary" style="width:100px; height: 28px">导出</Button></a>
        </div>
        <div class="contents">
            <tables :tabelHeight="tableHeight" :column="columns" :table-data="list" @operation1="see"></tables>
            <PageList :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
        </div>
    </div>
</template>

<script>
    import tables from '../../../components/tables'
    import PageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import modals from './modals.vue'
    import TablesColumns from './tablesColumns'
    export default {
        components: {tables, PageList, modals},
        mixins: [pageMixin],
        props: {
            active: Number
        },
        data() {
            return {
                evaluate_state: null,
                modalTit: '',
                show: false,
                isShowSerial: false,
                current: 1,
                total: 0,
                selStudent: +this.$route.query.brach_id || 'all',
                students: [
                    {batch: '全部学员', id: 'all'}
                ],
                list: []
            }
        },
        computed: {
            tableHeight() {
                return window.innerHeight - 170
            },
            columns(){
                const list = TablesColumns[this.active - 1]
                if(this.active == 2&&this.evaluate_state === 0) list.splice(3, 1)
                return list
            },
            getListUrl(){
                let urls = ['getStudentProgress', 'getStudentOnlineProgress', 'getStudentOnlineHomeworkProgress', 'getOnlineFocus', 'getOfflineSubjects']
                return 'product/' + urls[this.active - 1]
            },
            downUrl(){
                let arr = ['product/exportStudentProgress', 'product/exportStudentOnlineProgress', 
                'product/exportStudentOnlineHomeworkProgress', 'product/exportOnlineFocus', 'product/exportOfflineSubjects']
                return BaseUrl+`${arr[this.active - 1]}?product_id=${+this.$route.query.id}&batch_id=${this.selStudent === 'all' ? '' : this.selStudent}`
            }
        },
        watch: {
            active(_new){
                this.evaluate_state = null
                this.show = false
                this.isShowSerial = false
                this.current = 1
                let barch = this.$route.query.brach_id
                this.selStudent = barch&&barch!=='all' ? +this.$route.query.brach_id : 'all';
                this.getList()
            }
        },
        mounted(){
            this.getBatchList(+this.$route.query.organization_id)
            this.getList()
        },
        methods: {
            close(){
                this.show = false
            },
            changeSels(val){
                this.current = 1
                this.selStudent = val;
                this.getList()
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
                        this.students = [{batch: '全部学员', id: 'all'}, ...da]
                    }
                })
            },
            see(row){
                console.log(this.active,'this.active', this.show)
                if(this.active == 3) {
                    this.show = true
                    // this.modalTit = '学期报名详情'
                }else { 
                    if(this.active === 1) window.open('/dashboard/see-student?id='+row.student_id, '_blank')
                    else this.$router.push({name: 'see-student', query: {id: row.student_id}})
                }
            },
            getList(){
                let d = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    product_id: +this.$route.query.id,
                    batch_id: this.selStudent === 'all' ? '' : this.selStudent,
                }
                PostData(this.getListUrl, d).then((r) => {
                    if(r.res_code == 1){
                        this.list = r.data.data
                        if(this.active == 1){
                            this.list.map((t,i) => {
                                let n = (this.current - 1)*this.pageSize + i + 1
                                t.serialNum = n < 10 ? '0' + n : n
                            })
                        }
                        if(this.active == 2&&r.data.product_list.length>0) this.evaluate_state = r.data.product_list[0].evaluate_state
                        this.total = r.data.count
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .tables-pane{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        /deep/ .ivu-table-expanded-cell{
            padding: 0 !important;
        }
        /deep/ .ivu-table-cell-expand{
            transition: none;
            .ivu-icon-ios-arrow-forward:before{
                content: "展开"
            }
        }
        /deep/ .ivu-table-cell-expand-expanded{
            transform: none;
            .ivu-icon-ios-arrow-forward:before{
                content: "收起"
            }
        }
        .sel-head{
            height: 58px;
            background-color: #f0f0f7;
            display: flex;
            align-items: center;
            padding-left: 20px;
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
        .contents{
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
        }
    }
</style>
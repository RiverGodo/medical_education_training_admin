<template>
    <div>
        <Table class="table-expand" :columns="columns1" :data="details">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="text" @click="see(row, index)">详情</Button>
            </template>
        </Table>
        <modals @close="close" :isSemester="true" :show="show" title="学期报名详情"/>
    </div>
</template>
<script>
    import modals from './modals'
    export default {
        components: {modals},
        props: {details: {}},
        data () {
            return {
                show: false,
                columns1: [
                   {
                        title: '学期名称',
                        key: 'title',
                        align: 'left',
                        width: 300
                    },
                    {
                        title: '预约人数',
                        key: 'appointment_count',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '签到人数',
                        key: 's_count',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '签到率',
                        key: 's_rate',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('span', params.row.s_rate == "NaN%" ? "0%" : params.row.s_rate)
                        },
                    },
                     {
                        title: '完成率',
                        key: 'c_rate',
                        align: 'center',
                        minWidth: 100
                    },
                     {
                        title: '平均分',
                        align: 'center',
                        key: 'average_score',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('span', params.row.average_score == "NaN" ? 0 : params.row.average_score)
                        },
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 150,
                    }
                ],
            }
        },
        methods: {
            rowStyle(){
                return 'row-style'
            },
            see(row, index){
                this.show = true
            },
            close(){
                this.show = false
            },
        }
    }
</script>
<style lang="less" scoped>
.table-expand{
    /deep/.ivu-table th, /deep/.ivu-table td{
        background: rgba(64,152,255,0.05) !important;
        // border-bottom: 1px solid #DAEBFF;
    }
}
</style>
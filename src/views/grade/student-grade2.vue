<template>
    <div style="height: 100%;">
        <div class="head">
            <div class="head-logo" @click="handleBack">
                <img :class="$logo.learn ? 'logo-img2' : 'logo-img'" :src='$logo.img'>
                <div v-if="!$logo.learn" class="logo-title">九划医教</div>
            </div>
            <img class="head-img" :src="headImg" alt="">
        </div>
        <div class="box">
            <Modal v-model="show" :mask-closable="false" :footer-hide="true" @on-cancel="handleClose" title="查看评价">
                <div class="modal-content">{{content}}</div>
            </Modal>
            <div class="message">
                <div class="message-left">
                    <img class="message-left-img" :src="studentScore.head_img_url" alt="">
                    <div>
                        <div class="message-left-name">{{studentScore.realname}}</div>
                        <div class="message-left-tel">{{studentScore.username}}</div>
                    </div>
                </div>
                <div class="message-right">
                    <div class="message-right-percent">{{studentScore.progress}}</div>
                    <div class="message-right-title">{{studentScore.product_title}}</div>
                </div>
            </div>
            <div class="total" style="height: 200px;">
                <div class="total-course">
                    <div class="total-course-title">
                        <div class="total-course-title-content">课程反馈</div>
                    </div>
                    <tables :column="columns1" :table-data="list1" @operation="operation"></tables>
                </div>
            </div>
            <div class="total" :style="`min-height: ${lastHeight}px;`">
                <div class="total-course">
                    <div class="total-course-title">
                        <div class="total-course-title-content">课程评分</div>
                    </div>
                    <tables :is-serial="pageDataCount" :column="columns2" :table-data="list2" @operation="operation"></tables>
                    <page-list style="margin-bottom: 60px;" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import tables from '../../components/tables'
    import pageList from '../../components/Page'
    import pageMixin from '../mixins/pageMixins'
    import postData from '../../api/postData'

    export default {
        components: {tables, pageList},
        mixins: [pageMixin],
        data() {
            return{
                headImg: JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).head_img_url,
                show: false,
                columns1: [
                    {title: '培训进度', key: 'progress', minWidth: 100,},
                    {title: '线上课安排合理性', key: 'score_1', minWidth: 170,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_1))
                        }
                    },
                    {title: '线下课安排合理性', key: 'score_2', minWidth: 170,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_2))
                        }
                    },
                    {title: '培训对工作是否有帮助', key: 'score_3', minWidth: 200,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_3))
                        }
                    },
                    {title: '课件质量', key: 'score_4', minWidth: 100,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_4))
                        }
                    },
                    {title: '总体满意度', key: 'score_5', minWidth: 120,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_5))
                        }
                    },
                    {
                        title: '其他建议',
                        minWidth: 100,
                        slot: 'operation',
                        align: 'center',
                        isAppraise: true,
                        operation: [['查看', 'operation'], ['-', 'operation1']],
                    },
                    // {title: '其他建议', key: 'comment', minWidth: 100},
                    {title: '评价时间', key: 'comment_time', minWidth: 170},
                ],
                list1: [],
                columns2: [
                    {title: '课程名称', key: 'title', minWidth: 170, align: 'left'},
                    {title: '学习进度', key: 'progress', minWidth: 100},
                    {title: '老师仪表', key: 'score_1', minWidth: 100,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_1))
                        }
                    },
                    {title: '内容真实性', key: 'score_2', minWidth: 120,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_2))
                        }},
                    {title: '知识前沿性', key: 'score_3', minWidth: 120,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_3))
                        }},
                    {title: '课件质量', key: 'score_4', minWidth: 100,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_4))
                        }},
                    {title: '满意度', key: 'score_5', minWidth: 90,
                        render: (h, params)=>{
                            return h('span', this.$config.scoreData(params.row.score_5))
                        }},
                    {
                        title: '其他建议',
                        minWidth: 100,
                        slot: 'operation',
                        align: 'center',
                        isAppraise: true,
                        operation: [['查看', 'operation'], ['-', 'operation1']],
                    },
                    {title: '评价时间', key: 'comment_time', minWidth: 170},
                ],
                list2: [],
                content: '',
                studentScore: ''
            }
        },
        computed: {
            lastHeight() {
                return window.innerHeight - 420
            }
        },
        methods: {
            handleBack() {
                this.$router.push('/dashboard/user-manage')
            },
            handleClose() {
                this.show = false
            },
            operation(item) {
                this.show = true
                this.content = item.comment
            },
            getData(){
                postData('product/getEvaluateByProduct',{product_id: +this.$route.query.product_id}).then(r => {
                   if(r.data.curriculum_evaluate.length>0){
                       r.data.curriculum_evaluate.map((t,i) => {
                           let d1 = this.columns2[i + 3]
                           d1.title = t.evaluate_content
                           this.columns2.splice(i + 3 , 1, d1)
                       })
                   }
                   if(r.data.product_evaluate.length>0){
                       r.data.product_evaluate.map((t,i) => {
                           let d1 = this.columns1[i + 1]
                           d1.title = t.evaluate_content
                           this.columns1.splice(i + 1 , 1, d1)
                       })
                   }
                })
            },
            getList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    product_id: Number(this.$route.query.product_id),
                    student_id: Number(this.$route.query.student_id)
                }
                postData('product/product/getStudentProductScore', data).then(res => {
                    if(res.res_code == 1) {
                        this.total = res.data.count
                        this.list2 = res.data.list
                        this.studentScore = res.data.studentScore
                        res.data.studentScore.state = res.data.studentScore.comment ? 1 : 0
                        this.list1 = [res.data.studentScore]
                        this.list2.map(item => {
                            item.state = item.comment ? 1 : 0
                        })
                    }
                })
            }
        },
        mounted() {
            this.pageSize = 10;
            (async () => {
                await this.getData()
                await this.getList()
            })()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-table:before{
        display: none;
    }
    /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-modal-body{
        padding: 30px;
    }
    .head{
        height: 60px;
        background-color:#333;
        position: relative;
        display: flex;
        align-items: center;

        .head-logo{
            display: flex;
            align-items: center;
            position: absolute;
            left: 30px;
            cursor: pointer;

            .head-logo-title{
                color: #fff;
                font-size: 18px;
                margin-left: 10px;
            }
        }

        .head-img{
            height: 44px;
            width: 44px;
            position: absolute;
            right: 30px;
            border-radius: 100%
        }
    }
    .box{
        background-color:#f0f0f7;
        padding: 20px 30px;
        height: 100%;
        overflow-y: auto;
        padding-bottom: 80px;
    }
    .modal-content{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        line-height: 28px;
        min-height: 300px;
        max-height: 600px;
        overflow: hidden;
        overflow-y: auto;
    }
    .message{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color:#fff;
        height: 160px;

        .message-left{
            display: flex;
            margin-left: 50px;
            align-items: center;

            .message-left-img{
                height: 100px;
                width: 100px;
                border-radius: 100%;
                margin-right: 20px;
            }

            .message-left-name{
                font-family: PingFangSC-Medium;
                font-size: 22px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: justify;
            }

            .message-left-tel{
                font-family: PingFangSC-Regular;
                font-size: 15px;
                color: #777777;
                letter-spacing: 0;
                text-align: justify;
                margin-top: 10px;
            }
        }
        .message-right{
            margin-right: 50px;

            .message-right-percent{
                font-family: PingFangSC-Medium;
                font-size: 30px;
                color: #4098FF;
                letter-spacing: 0;
                text-align: right;
            }
            .message-right-title{
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: right;
                margin-top: 13px;
            }
        }
    }
    .total{
        margin-top: 10px;

        .total-right{
            margin-right: 5px;
            background-color: #fff;
            width: 100%;
            height: 100%;
        }

        .total-course{
            margin-right: 5px;
            background-color: #fff;
            width: 100%;
            height: 100%;

            .total-course-title{
                height: 60px;
                font-family: PingFangSC-Medium;
                font-size: 22px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: left;
                display: flex;
                align-items: center;
            }
            .total-course-title-content{
                line-height: 20px;
                border-left: 5px solid #4098FF;
                margin-left: 30px;
                padding-left: 10px;
            }
            .total-course-title-operation{
                margin-right: 30px;
                display: flex;
                align-items: center;

                .total-course-img{
                    margin-left: 15px;
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }

</style>

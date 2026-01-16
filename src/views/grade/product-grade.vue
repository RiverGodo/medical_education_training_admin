<template>
    <div style="height: 100%;">
        <div class="head">
            <div class="head-logo" @click="handleBack">
                <img :class="$logo.learn ? 'logo-img2' : 'logo-img'" :src='$logo.img'>
                <div v-if="!$logo.learn" class="logo-title">九划医教</div>
            </div>
            <img class="head-img" :src="headImg" alt="">
        </div>
        <div class="content">
                <Row class="title">
                    <Col span="14">
                        <div class="title-content">
                            {{$route.query.title}}
                        </div>
                        <div class="title-time">
                            <div class="title-time-name">统计时间</div>
                            <DatePicker v-model="datePicker" class="title-time-data" type="daterange" :options="options3" placeholder="" format="yyyy/MM/dd"
                                        separator="至" @on-clear="dateClaer" @on-change="dateChange"></DatePicker>
                        </div>
                    </Col>
                    <Col span="10" style="height: 100%;">
                        <div class="statistics-box">
                            <div v-for="(item, index) in statistics" :key="index" style="margin: 0 25px;">
                                <div class="statistics-value">{{item.value}}</div>
                                <div class="statistics-title">{{item.title}}</div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row :gutter="10" class="total">
                    <!-- <Col span="12" style="height: 400px;margin-bottom: 10px;">
                        <div class="total-course">
                            <div class="total-course-title">
                                <div class="total-course-title-content">课程反馈</div>
                            </div>
                            <tables v-if="list1.length>0" :column="columns1" :table-data="list1" ></tables>
                        </div>
                    </Col> -->
                    <Col span="12" style="height: 400px;margin-bottom: 10px;" v-if="courseShowList&&courseShowList.length == 0">
                        <div class="total-right">
                            <div class="total-course">
                                <div class="total-course-title" style="justify-content: space-between;">
                                    <div class="total-course-title-content">课程评分</div>
                                </div>
                                <div style="height: 340px;display: flex;align-items: center;justify-content: center">
                                    暂无数据
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col v-else :span="courseShow ? 12 : 24" style="margin-bottom: 10px;" v-for="(item,index) in courseShowList" :key="index">
                        <div class="total-right">
                            <div class="total-course">
                                <div class="total-course-title" style="justify-content: space-between">
                                    <div class="total-course-title-content">课程评分</div>
                                    <div class="total-course-title-operation">
                                        <div v-if="courseShow" class="course-title">{{item.title}}</div>
                                        <Select v-if="!courseShow" v-model="selectCourse" style="width:200px;" @on-change="courseChange">
                                            <Option v-for="(item, index) in courseList" :value="index" :key="index">{{ item.title }}</Option>
                                        </Select>
                                        <img v-if="!courseShow" v-show="courseList.length > 1" src="../../assets/img/grade_all.jpg" alt="" class="total-course-img" @click="showAll">
                                        <img v-show="index == 0" v-else src="../../assets/img/grade_pack.jpg" alt="" class="total-course-img" @click="packAll">
                                    </div>
                                </div>
                                <div v-if="item&&item.onlineScoreList.length>0">
                                    <tables :column="columns2" :table-data="item.onlineScoreList"></tables>
                                </div>
                                <div class="proposal-view">
                                    <div class="main-tit"><div class="lines"></div><span class="grey-medium2">其它建议</span></div>
                                    <tables v-if="item.other_comment_list.length>0" :is-serial="pageDataCount" :column="columnsProposal" :table-data="item.other_comment_list"/>
                                    <div class="no-proposal" v-else>暂无</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row class="total" :style="`minHeight: ${lastHeight}px; background: #fff; height: auto; marginTop: 0`">
                    <Col>
                        <div style="background-color: #fff;width: 100%;height: 100%;">
                            <div class="total-course">
                                <div class="total-course-title">
                                    <div class="total-course-title-content">学员评分</div>
                                </div>
                                <tables :is-serial="pageDataCount" :column="columns3" :table-data="list3" @operation="check"></tables>
                                <page-list style="margin-bottom: 10px;" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
    </div>
</template>

<script>
    import tables from '../../components/tables'
    import pageList from '../../components/Page'
    import pageMixin from '../mixins/pageMixins'
    import postData from '../../api/postData'
    import moment from 'moment'

    export default {
        components: {tables, pageList},
        mixins: [pageMixin],
        data() {
            const courseRenderHeader = (h, params, num) => {
                let text = num + ' <i class="ivu-icon ivu-icon-ios-star" style="color: #4098FF;" size="18px" />';
                return h('div', {
                    domProps:{ innerHTML: text }
                })
            }
            return{
                columnsProposal: [
                {
                    title: '姓名',
                    key: 'realname',
                    width: 200
                },{
                    title: '建议',
                    key: 'other_comment',
                    align: 'left',
                }
                ],
                headImg: JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).head_img_url,
                options3: {
                    disabledDate (date) {
                        return false;
                    }
                },
                datePicker: [],
                statistics: [{title: '已报名', value: 0}, {title: '已学完', value: 0}, {title: '已评分', value: 0}],
                columns1: [
                    {title: '评分项', key: 'title', minWidth: 200, align: 'left'},
                    {title: '非常好', key: 'grade_1', minWidth: 90, maxWidth: 120},
                    {title: '良好', key: 'grade_2', minWidth: 90, maxWidth: 120},
                    {title: '一般', key: 'grade_3', minWidth: 90, maxWidth: 120},
                    {title: '差', key: 'grade_4', minWidth: 90, maxWidth: 120},
                ],
                list1: [],
                columns2: [
                    {title: '评分项', key: 'title', minWidth: 200, align: 'left'},
                    {title: '', key: 'grade_5', minWidth: 90, maxWidth: 120,
                    renderHeader: (h, params) => {
                        return courseRenderHeader(h, params, 5)
                    }
                    },
                    {title: '', key: 'grade_4', minWidth: 90, maxWidth: 120, 
                    renderHeader: (h, params) => {
                        return courseRenderHeader(h, params, 4)
                    }},
                    {title: '', key: 'grade_3', minWidth: 90, maxWidth: 120,
                    renderHeader: (h, params) => {
                        return courseRenderHeader(h, params, 3)
                    }},
                    {title: '', key: 'grade_2', minWidth: 90, maxWidth: 120,
                    renderHeader: (h, params) => {
                        return courseRenderHeader(h, params, 2)
                    }},
                    {title: '', key: 'grade_1', minWidth: 90, maxWidth: 120,
                    renderHeader: (h, params) => {
                        return courseRenderHeader(h, params, 1)
                    }},
                ],
                list2: [],
                columns3: [
                    {title: '姓名', key: 'realname', align: 'left', minWidth: 110},
                    {title: '账号', key: 'username', align: 'left', minWidth: 130},
                    {title: '学习进度', key: 'progress', minWidth: 100},
                    {title: '已评课程', key: 'finish_score_num', minWidth: 100},
                    {
                        title: '操作',
                        minWidth: 138,
                        slot: 'operation',
                        align: 'center',
                        operation_btn_hide: true,
                        operation: [['查看详情', 'operation']],
                    }
                ],
                list3: [],
                selectCourse: 0,
                courseList: [],
                courseShow: false,
                courseShowList: [],
                first_time: null,
                loadingInstance:  null
            }
        },
        computed: {
            lastHeight() {
                return window.innerHeight - 630
            }
        },
        methods: {
            handleBack() {
                this.$router.push('/dashboard/user-manage')
            },
            dateClaer() {
                this.datePicker = ['', '']
            },
            check(item) {
                window.open(`/product/student-grade?student_id=${item.student_id}&&product_id=${this.$route.query.id}`, '_blank')
            },
            showAll() {
                this.courseShowList = this.courseList
                this.courseShow = true
                console.log(this.courseShowList, 'KMK');
            },
            packAll() {
                this.courseShow = false
                this.courseShowList = [this.courseList[0]]
                this.selectCourse = 0
            },
            courseChange(val) {
                this.courseShowList = [this.courseList[val]]
            },
            dateChange(val) {
                this.getList()
                this.getCourseList()
            },
            getList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    product_id: Number(this.$route.query.id),
                    date_picker: this.datePicker && new Date(this.datePicker[0]).getTime() ? [moment(this.datePicker[0]).format('YYYY-MM-DD'), moment(this.datePicker[1]).format('YYYY-MM-DD')] : ''
                }
                postData('product/product/getScoreList', data).then(res => {
                    if(res.res_code == 1) {
                        this.statistics[1].value = res.data.finish_num
                        this.statistics[2].value = res.data.score_num
                        this.statistics[0].value = res.data.student_num
                        this.first_time = new Date(res.data.first_time)
                        this.datePicker = this.datePicker[1] ? this.datePicker : [new Date(res.data.first_time), new Date()]
                        this.options3 = {
                            disabledDate (date) {
                                return date && date.valueOf() < new Date(res.data.first_time).getTime() - 86400000 || date.valueOf() > new Date().getTime();
                            }
                        }
                        this.total = res.data.count
                        this.list3 = res.data.studentScoreList
                        // this.list1 = res.data.productScoreList || []
                    }
                })
            },
            getCourseList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    product_id: Number(this.$route.query.id),
                    date_picker: this.datePicker && new Date(this.datePicker[0]).getTime() ? [moment(this.datePicker[0]).format('YYYY-MM-DD'), moment(this.datePicker[1]).format('YYYY-MM-DD')] : ''
                }
                postData('product/product/getOnlineScore', data).then(res => {
                    this.courseList = res.data.list
                    this.courseShowList = this.courseList.length ? [this.courseList[0]] : []
                })
            },
            getData(){
                postData('product/getEvaluateByProduct',{product_id: +this.$route.query.id}).then(r => {
                   if(r.data.product_evaluate.length>0){
                        r.data.product_evaluate.map((t,i) => {
                            const item = {title: '', key: '', minWidth: 90}
                            item.key = `stars_num_${i + 1}`
                            item.title = t.evaluate_content
                            item.render = (h, params)=>{
                                if(params.row[`stars_num_${i + 1}`]){
                                    return h('div',null, [
                                        h('span', params.row[`stars_num_${i + 1}`]),
                                        h('Icon', {props: {type : 'ios-star', color: '#4098FF'}}),
                                    ])
                                }else h('span', params.row[`stars_num_${i + 1}`])
                            }
                            this.columns3.splice(5 + i, 0, item)
                        })
                   }
                })
            },
        },
        mounted() {
            this.pageSize = 10;
            (async () => {
               await this.getData()
               await this.getList()
               await this.getCourseList()
            })()
        }
    }
</script>

<style scoped lang="less">
    .proposal-view{
        margin-top: 10px;
        background-color: #fff;
        min-height: 120px;
        padding: 20px 20px 15px 20px;
        .main-tit{
            display: flex;
            .lines{
                height: 26px;
                width: 5px;
                background: #4098FF;
                border-radius: 2.5px;
                margin-right: 10px;
            }
        }
    }
    .no-proposal{
        margin-top: 10px;
        background-color: #fff;
        min-height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /deep/ .ivu-table:before{
        display: none;
    }
    /deep/ .ivu-table:after{
        display: none;
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
    .content{
        background-color: #f0f0f7;
        padding: 20px 30px;
        height: calc(100% - 60px);
        overflow-y: auto;
    }
    .title{
        background-color:#fff;
        height: 170px;

        .title-content{
            font-family: PingFangSC-Medium;
            font-size: 30px;
            color: #1B1B1B;
            letter-spacing: 0;
            text-align: justify;
            margin: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .title-time{
            display: flex;
            align-items: center;
            margin-top: 5px;
            margin-left: 30px;

            .title-time-name{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: justify;
            }

            .title-time-data{
                margin-left: 10px;
                background: #FFFFFF;
                border: 1px solid #C8CCDD;
                border-radius: 4px;
                width: 260px !important;
            }
        }

        .statistics-box{
            display: flex;
            float: right;
            height: 100%;
            align-items: center;

            .statistics-value{
                font-family: PingFangSC-Medium;
                font-size: 25px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: center;
            }

            .statistics-title{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: center;
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
            margin-bottom: 10px;
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
                min-width: 150px;
            }

            .course-title{
                font-family: PingFangSC-Regular;
                /*width: 100%;*/
                text-align: center;
                padding: 0 30px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .total-course-title-operation{
                margin-right: 30px;
                display: flex;
                align-items: center;

                .total-course-img{
                    margin-left: 15px;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }
            }
        }
    }
    /deep/ .ivu-page{
        margin: 20px 0 !important;
    }
</style>



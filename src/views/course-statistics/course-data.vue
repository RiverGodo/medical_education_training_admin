<template>
    <div class="container">
        <div class="head">
            <div class="head-logo" @click="handleBack">
                <img :class="$logo.learn ? 'logo-img2' : 'logo-img'" :src='$logo.img'>
                <div v-if="!$logo.learn" class="logo-title">九划医教</div>
            </div>
        </div>
        <div class="content">
            <div class="content-left">
                <img :src="productInfo&&productInfo.imgs" alt="" class="left-img">
                <div class="left-title">{{productInfo&&productInfo.title}}</div>
                <div class="left-count">
                    报名人数<span class="left-count-num">{{productInfo&&productInfo.sign_count}}</span>/人 <span class="left-count-interval">|</span> 完成人数 <span class="left-count-num">{{productInfo&&productInfo.complete_count || 0}}</span>/人
                </div>
                <div class="left-data">
                    <div class="left-data-box">
                        <div v-for="(item ,index) in courseList" :key="index" class="left-data-box-list">
                            <div :style="{backgroundColor: '#f0f0f7', flex: 1, width: '100%'}"></div>
                            <div :style="{backgroundColor: item.color, height: item.percent, width: '100%'}"></div>
                        </div>
                    </div>
                    <div class="left-data-content">
                        <div class="left-data-content-title">课程内容占比</div>
                        <div v-for="(item, index) in courseList" :key="index" class="left-data-content-box">
                            <div class="left-data-content-box-point" :style="{backgroundColor: item.color}"></div>
                            <div>{{item.title}}:</div>
                            <div>{{item.percent}}</div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 130px;font-size: 10px;color: #8489A1;">数据更新时间：{{newDate}}</div>
            </div>
            <div class="content-right">
                <div class="right-top">
                    <div class="right-top-echarts">
                        <div class="echarts-top">
                            <div class="echarts-top-title">学习人数趋势</div>
                            <Select @on-change="change2" v-model="studentModel" style="width:150px;margin-left: 30px;">
                                <Option v-for="item in studentList" :value="item.id" :key="item.id">{{ item.batch }}</Option>
                            </Select>
                            <Select v-model="timeModel" @on-change="changeTime" style="width:100px;margin-left: 10px;">
                                <Option v-for="item in timeList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                            </Select>
                            <DatePicker v-if="isDaterange" type="daterange" format="yyyy-MM-dd" placeholder="请选择时间范围"  class="screen-data-picker"
                             @on-change="dataPickerChange" @on-clear="dataPickerClear"></DatePicker>
                        </div>
                        <div v-if="hasEcharts" class="echarts-box">
                            <div v-for="(item, index) in courseList" :key="index" class="echarts-box-recommend">
                                <div class="echarts-box-color" :style="{backgroundColor: item.color}"></div>
                                <div class="echarts-type-title">{{item.title}}</div>
                            </div>
                        </div>
                    </div>
                    <div id="main" style="height: 200px;width: 100%;"></div>
                    <div v-if="!hasEcharts" class="right-top-no">
                        <div>暂无数据</div>
                    </div>
                </div>
                <div class="right-bottom">
                    <div class="bottom-title">
                        <div class="bottom-title-content">学习进度统计</div>
                        <Select @on-change="change1" v-model="studentModel2" style="width:150px;margin-left: 30px;">
                            <Option v-for="item in studentList" :value="item.id" :key="item.id">{{ item.batch }}</Option>
                        </Select>
                    </div>
                    <div class="bottom-content">
                        <div class="bottom-content-box" v-for="(item, index) in dataList" :key="index">
                            <img class="bottom-content-box-img" :src="item.img" alt="">
                            <div class="bottom-content-box-content">
                                <div class="box-content-message">
                                    <div>{{item.title}} <span class="box-content-message-percent">{{parseInt(item.percent)}}</span>%</div>
                                    <div class="box-content-message-btn" @click="toDetails(index)">详情</div>
                                </div>
                                <Progress :percent="parseInt(item.percent)" hide-info/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import coursePercent from '../../assets/img/product-course/courserPercent.png'
    import homeworkPercent from '../../assets/img/product-course/homeworkPercent.png'
    import livePercent from '../../assets/img/product-course/livePercent.png'
    import offlinePercent from '../../assets/img/product-course/offlinePercent.png'
    import studentPercent from '../../assets/img/product-course/studentPercent.png'
    import echarts from 'echarts'
    import moment from 'moment'

    export default {
        data() {
            return {
                data_picker: [],
                isDaterange: false,
                hasEcharts: false,
                productInfo: null,
                courseList: [
                    {title: '线上培训', color: '#6666C6', percent: '10%'},
                    {title: '在线直播', color: '#FD818D', percent: '20%'},
                    {title: '线下培训', color: '#FFB94B', percent: '30%'},
                ],
                timeList: [
                    {id: 'WEEK', title: '近7天'},
                    {id: "MONTH", title: '近30天'},
                    {id: "6MONTH", title: '近半年'},
                    {id: "YEAR", title: '近一年'},
                    {id: "CUSTOM", title: '自定义'},
                ],
                studentModel: 'all',
                studentModel2: 'all',
                studentList: [
                    {batch: '全部学员', id: 'all'},
                ],
                timeModel: 'WEEK',
                dataList: [
                    {img: studentPercent, title: '学员平均学习进度', percent: '0%'},
                    {img: coursePercent, title: '线上课程平均进度', percent: '0%'},
                    {img: homeworkPercent, title: '线上作业平均完成率', percent: '0%'},
                    {img: livePercent, title: '在线直播平均完成率', percent: '0%'},
                    {img: offlinePercent, title: '线下培训平均完成率', percent: '0%'},
                ],
                newDate: null
            }
        },
        methods: {
            isCustonMouths(){
                let bool = false
                if(this.data_picker.length==2&&this.data_picker[0]){
                    let da = new Date(this.data_picker[0])
                    let n1 = this.data_picker[1].split('-').join("")
                    let n2 = (this.$config.getDay(29, da)).split('-').join("")
                    bool = +n1 <= (+n2)
                }
                return bool
            },
            dataPickerChange(val) {
                this.data_picker  = val
                this.getCurriculumDataTop()
            },
            dataPickerClear() {
                this.data_picker  = ['', '']
                this.getCurriculumDataTop()
            },
            getStudentSituationTrend(d){
                PostData('dm/getStudentSituationTrend', d).then((r) => {
                    if(r.res_code == 1){
                        this.hasEcharts = true
                        let da = [], da2 = [], da3 = [], dc = []
                        const {online_oneself, online_focus, offline_focus} = r.data
                        if(online_oneself&&online_oneself.length>0){
                            online_oneself.map((t) => {
                                da.push(t.x)
                                da2.push(t.y)
                            })
                        }
                        if(online_focus&&online_focus.length>0){
                            online_focus.map((t) => {
                                da3.push(t.y)
                            })
                        }
                        if(offline_focus&&offline_focus.length>0){
                            offline_focus.map((t) => {
                                dc.push(t.y)
                            })
                        }
                        this.initEcharts(da, da2, da3, dc)
                        // this.$forceUpdate()
                    }
                })
            },
            getCurriculumDataTop(){
                let d = {
                    organization_id: +this.$route.query.organization_id,
                    obj_id: +this.$route.query.id,
                    batch_id: this.studentModel === 'all' ? '' : this.studentModel,
                    time_type: this.timeModel,
                }
                if(this.timeModel == 'CUSTOM'&&this.data_picker.length==2){
                    d.start_time = this.data_picker[0]
                    d.end_time = this.data_picker[1]
                    d.dm_type = this.isCustonMouths() ? 'DAY' : 'MONTH'
                }
                this.getStudentSituationTrend(d)
            },
            changeTime(val){
                this.isDaterange = val =='CUSTOM'
                this.timeModel = val;
                if(val !=='CUSTOM') this.getCurriculumDataTop()
            },
            change2(val){
                this.studentModel = val
                this.getCurriculumDataTop()
            },
            change1(val){
                this.studentModel2 = val
                this.getCurriculumDataUnder()
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
                        this.studentList = [{batch: '全部学员', id: 'all'}, ...da]
                    }
                })
            },
            isNaN(d){
                return d != 'NaN%' ? d : '0%'
            },
            getCurriculumDataUnder(){
                PostData("product/getCurriculumDataUnder", { product_id: +this.$route.query.id, batch_id: this.studentModel2 === 'all' ? '' : this.studentModel2 }).then((r) => {
                    if(r.res_code == 1) {
                        this.dataList[0].percent = this.isNaN(r.data.student_average_rate)
                        this.dataList[1].percent = this.isNaN(r.data.online_average_rate)
                        this.dataList[2].percent = this.isNaN(r.data.online_homework_average_rate)
                        this.dataList[3].percent = this.isNaN(r.data.online_focus_average_rate)
                        this.dataList[4].percent = this.isNaN(r.data.offline_average_rate)
                    }
                })
            },
            getList(){
                PostData("product/getCurriculumDataLeft", { product_id: +this.$route.query.id }).then((r) => {
                    if(r.res_code == 1) {
                        this.productInfo = r.data;
                        let t = r.data;
                        if(r.data){
                            t.url_arr = JSON.parse(t.url_arr)
                            this.productInfo.imgs = t.url_arr.video_img ? t.url_arr.video_img : t.url_arr.default[0]
                            this.courseList[0].percent = t.online_rate
                            this.courseList[1].percent = t.live_rate
                            this.courseList[2].percent = t.offline_rate
                        }
                    }
                })
            },
            toDetails(index){
                let query = {pane: index + 1,id: this.$route.query.id, organization_id: this.$route.query.organization_id, brach_id: this.studentModel2}
                this.$router.push({ name: 'course-details', query })
            },
            handleBack() {
                this.$router.push('/dashboard/user-manage')
            },
            initEcharts(dx, dy, dz, dc) {
                let myChart = echarts.init(document.getElementById('main'));
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        },
                        formatter: '{b0} <br/> {a0}: {c0}人<br />{a1}: {c1}人<br/>{a2}: {c2}人'
                    },
                    color: ['#6666C6','#FD818D','#FFB94B'],
                    legend: {
                        data:['销量']
                    },
                    xAxis: {
                        boundaryGap: true,
                        data: dx,
                        type: 'category',
                        axisLabel: {
                            fontSize: 10,
                            color: '#474C63',
                            formatter: function (value) {
                                return value.slice(5);
                            },
                        },
                        axisLine: { show: false },
                        axisTick: { show: false},
                    },
                    yAxis: {
                        axisLine: { show: false },
                        axisTick: { show: false},
                        axisPointer: { show: false},
                        axisLabel: {
                            formatter: function (value, index) {
                                return (Number.isInteger(value) ? value + '人' : '');
                            },
                            fontSize: 10,
                            color: '#474C63'
                        },
                        splitLine: { lineStyle: {type: 'dashed', color: '#D4D7E3'}},
                        type: 'value'
                    },
                    series: [{
                        name: '线上培训',
                        type: 'line',
                        data: dy,
                        smooth: true,
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#cccdea' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#fdfdfe' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            }
                        },
                    },{
                        name: '在线直播',
                        type: 'line',
                        data: dz,
                        smooth: true,
                    },{
                        name: '线下培训',
                        type: 'line',
                        data: dc,
                        smooth: true,
                    }]
                };
                myChart.setOption(option);
            }
        },
        mounted() {
            this.getCurriculumDataTop()
            this.getList()
            this.getCurriculumDataUnder()
            this.getBatchList(+this.$route.query.organization_id)
            moment.locale('zh-cn');
            this.newDate = moment().format('lll')
        }
    }
</script>

<style lang="less" scoped>
    .container{
        height: 100%;
    }
    .echarts-type-title{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .screen-data-picker{
        width: 150px !important;
        margin-left: 10px !important;

        /deep/ .ivu-btn{
            display: inline-block !important;
        }
    }
    .head{
        height: 60px;
        background-color:#333;
        position: relative;
        display: flex;
        align-items: center;
        .back{
            position: absolute;
            right: 20px;
            padding-left: 10px;
            display: flex;
            align-items: center;
            .back-img {
                width: 23px;
                height: 19px;
                padding-right: 6px;
            }
            .back-tit{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #FFFFFF;
            }
        }
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
    }
    .content{
        background-color: #f0f0f7;
        padding: 20px;
        display: flex;
        overflow-y: auto;
        height: calc(100% - 60px);

        .content-left{
            width: 36%;
            margin-right: 10px;
            background-color: #fff;
            position: relative;
            height: 753px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .left-img{
                width: 352px;
                height: 198px;
                margin-top: 40px;
            }
            .left-title{
                width: 352px;
                margin-top: 20px;
                font-size: 22px;
                color: #474C63;
            }
            .left-count{
                margin-top: 20px;
                font-size: 14px;
                color: #474C63;

                .left-count-num{
                    font-size: 22px;
                    color: #4098FF;
                    margin: 0 5px;
                }
                .left-count-interval{
                    color: #D4D7E3;
                    margin: 0 15px;
                }
            }
            .left-data{
                margin-top: 85px;
                display: flex;
                justify-content: center;
                align-items: flex-end;

                .left-data-box{
                    display: flex;
                    height: 150px;

                    .left-data-box-list{
                        width: 30px;
                        margin-right: 20px;
                        display: flex;
                        flex-direction: column;
                    }
                }
                .left-data-content{
                    margin-left: 40px;

                    .left-data-content-title{
                        font-size: 14px;
                        color: #474C63;
                        margin-bottom: 20px;
                    }
                    .left-data-content-box{
                        display: flex;
                        align-items: center;
                        margin-top: 10px;
                    }
                    .left-data-content-box-point{
                        height: 10px;
                        width: 10px;
                        border-radius: 100%;
                        margin-right: 10px;
                    }
                }
            }
        }
        .content-right{
            height: 753px;
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            .right-top-no{
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 50px;
                height: 200px;
                width: 100%;
                background-color: #fff;
            }
            .right-top{
                height: 271px;
                background-color: #fff;
                margin-bottom: 10px;

                .right-top-echarts{
                    display: flex;
                    align-items: center;
                    margin-top: 16px;
                    justify-content: space-between;

                    .echarts-top{
                        display: flex;
                        align-items: center;
                    }
                    .echarts-top-title{
                        margin-left: 20px;
                        font-size: 14px;
                        color: #474C63;
                        white-space: nowrap;
                    }
                    .echarts-box{
                        display: flex;
                        align-items: center;
                        margin-left: 10px;

                        .echarts-box-recommend{
                            display: flex;
                            align-items: center;
                            margin-right: 10px;
                        }
                        .echarts-box-color{
                            width: 8px;
                            height: 8px;
                            border-radius: 100%;
                            margin-right: 5px;
                        }
                    }
                }
            }
            .right-bottom{
                flex: 1;
                background-color: #fff;

                .bottom-title{
                    display: flex;
                    align-items: center;
                    margin-top: 16px;
                    margin-left: 20px;

                    .bottom-title-content{
                        font-size: 14px;
                        color: #474C63;
                    }
                }
                .bottom-content{
                    margin-top: 50px;
                    margin-left: 50px;
                }
                .bottom-content-box{
                    display: flex;
                    margin-bottom: 25px;

                    .bottom-content-box-img{
                        height: 50px;
                        width: 50px;
                        border-radius: 5px
                    }
                    .bottom-content-box-content{
                        margin-left: 20px;
                        width: 400px;
                    }
                    .box-content-message{
                        display: flex;
                        justify-content: space-between
                    }
                    .box-content-message-percent{
                        font-size: 20px;
                        color: #474C63;
                        margin-left: 10px;
                    }
                    .box-content-message-btn{
                        font-size: 12px;
                        color: #4098FF;
                        text-decoration:underline #4098ff;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>

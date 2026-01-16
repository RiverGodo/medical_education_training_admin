<template>
    <div class="data-management">
        <div class="heads">数据管理</div>
        <div class="main">
            <div class="head2">
                <span class="grey-medium4 h-title">整体数据概况</span>
                <Select v-if="isSuper" v-model="valueSelect1" @on-change="selectChange1" class="select-list" placeholder="请选择机构">
                    <Option v-for="(item,i) in select" :value="item.id " :key="i">{{ item.title }}</Option>
                </Select>
                <div class="grey-regular4" v-else>{{organizationName}}</div>
                <div class="rights"><span class="time-view grey-regulars2">数据更新时间：</span><span class="times">{{$config.formatTime(new Date())}}</span></div>
            </div>
            <div class="card-view">
                <div :style="`background-color: ${t.bg}`" v-for="(t,i) in cards" :key="i" :class="i ? 'card' : 'card0'">
                    <img class="imgs" :src="t.icons" />
                    <div class="tt">
                        <p class="t1">{{t.num}}</p>
                        <P class="t2">{{t.title}}</P>
                    </div>
                    <p :style="`color: ${t.color}`" class="textr">/{{t.company}}</p>
                </div>
            </div>
            <div class="pay-view">
                <div style="margin-right: 10px" class="pays">
                    <p class="pay-text grey-medium3">总付费人数</p>
                    <p class="pay-nums"><span class="numss">{{info.pay_user_count}}</span><span class="grey-medium3">/人</span></p>
                    <img class="pay-imgs" :src="pay1" />
                </div>
                <Col class="pays">
                    <p class="pay-text grey-medium3">总付费金额</p>
                    <p class="pay-nums"><span class="numss">{{info.pay_amount}}</span><span class="grey-medium3">/元</span></p>
                    <img class="pay-imgs" :src="pay2" />
                </Col>
            </div>
            <div class="echarts-head">
                <div class="grey-medium4 h-title">学习数据概况</div>
                <Select v-if="isSuper" v-model="valueSelect2" @on-change="selectChange2" class="select-list" placeholder="请选择机构">
                    <Option v-for="(item,i) in select" :value="item.id " :key="i">{{ item.title }}</Option>
                </Select>
                <Select @on-change="change3" v-model="selCascade" class="select-list">
                    <Option v-for="item in select2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <!-- <Cascader @on-change="cascaderType" @on-visible-change="handleChangeOnSelect" :change-on-select="changeOnSelect" v-model="selCascade" placeholder="请选择产品" class="select-list" 
                :data="select2" :load-data="loadData"></Cascader> -->
                <Select @on-change="change2" v-model="students" class="select-list">
                    <Option v-for="item in studentList" :value="item.id" :key="item.id">{{ item.batch }}</Option>
                </Select>
                <Select @on-change="changeTime" v-model="times" class="select-list">
                    <Option v-for="item in selectTime" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
                <DatePicker v-if="isDaterange" type="daterange" format="yyyy-MM-dd" placeholder="请选择时间范围"  class="screen-data-picker"
                    @on-change="dataPickerChange" ></DatePicker>
            </div>
            <div class="echarts-main">
                <div class="echarts-item">
                    <div class="echarts-view" style="width: 100%" id="population-trend"></div>
                    <div class="echarts-title">学员学习人数趋势</div>
                    <div class="echarts-box">
                        <div v-for="(item, index) in courseList" :key="index" class="echarts-box-recommend">
                            <div class="echarts-box-color" :style="{backgroundColor: item.color}"></div>
                            <div class="echarts-box-text">{{item.title}}</div>
                        </div>
                    </div>
                </div>
                <div class="echarts-item" style="margin-left: 10px">
                    <div class="echarts-view" style="width: 100%" id="daily-trips"></div>
                    <div class="echarts-title">学员每日学习人次</div>
                    <div class="mouths" v-if="isCustonMouths()">{{timesInit}}</div>
                    <DatePicker v-model="yearms" v-if="times=='6MONTH' || times=='YEAR' || !isCustonMouths()" @on-clear="changeMouthsClear" @on-change="changeMouths" format="yyyy-MM" type="month" placeholder="请选择" class="year-mouths"></DatePicker>
                    <!-- <Select v-if="times=='6MONTH' || times=='YEAR' || !isCustonMouths()" @on-change="changeMouths" v-model="activeIndex" class="year-mouths">
                        <Option v-for="(t,i) in yearMoths" :value="i" :key="i">{{ t[0] }}年{{t[1]}}日</Option>
                    </Select> -->
                </div>
            </div>
            <div class="echarts-main" style="margin-top: 10px">
                <div class="echarts-item">
                    <div class="echarts-view2" style="width: 100%" id="time-interval"></div>
                    <div class="echarts-title">学员学习时段</div>
                    <div v-if="echartsRight3.length>0" class="echarts-box3">
                        <div v-for="(item, index) in echartsRight3" :key="index" class="echarts-box-3">
                          <img :src="item.icons" />
                          <div class="echarts-details">
                              <div class="details-view">
                                  <p style="white-space: nowrap" class="grey-regulars2 details-name1">{{item.item1.name}}：</p>
                                  <p style="margin-left: 10px" :class="(item.item1.count == valMax3[0] || item.item1.count == valMax3[1]) ? 'textMax' : 'texts2'">{{item.item1.ratio}}%</p>
                              </div>
                              <div class="details-view">
                                  <p style="white-space: nowrap" class="grey-regulars2 details-name1">{{item.item2.name}}：</p>
                                  <p style="margin-left: 10px" :class="(item.item2.count == valMax3[0] || item.item2.count == valMax3[3]) ? 'textMax' : 'texts2'">{{item.item2.ratio}}%</p>
                              </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="echarts-item" style="margin-left: 10px">
                    <div class="echarts-view" style="width: 100%" id="study-duration"></div>
                    <div class="echarts-title">学员学习时长</div>
                    <div v-if="echartsRight4.length>0" class="echarts-box2">
                        <div v-for="(item, index) in echartsRight4" :key="index" class="echarts-box-2">
                            <div class="echarts-box-color" :style="{backgroundColor: item.col}"></div>
                            <p class="texts1 grey-regulars2">{{item.name}}：</p>
                            <p :class="valMax4 == item.value ? 'textMax' : 'texts2'">{{item.ratio}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import number1 from '../../assets/data/number1.png'
    import number2 from '../../assets/data/number2.png'
    import number3 from '../../assets/data/number3.png'
    import number4 from '../../assets/data/number4.png'
    import number5 from '../../assets/data/number5.png'
    import pay1 from '../../assets/data/pay1.jpg'
    import pay2 from '../../assets/data/pay2.jpg'
    import day1 from '../../assets/data/day1.png'
    import day2 from '../../assets/data/day2.png'
    import day3 from '../../assets/data/day3.png'
    import echarts from 'echarts'

    export default {
        name: '',
        data() {
            return {
                valMax4: 0,
                valMax3: [],
                courseList: [
                    {title: '线上培训', color: '#6666C6'},
                    {title: '在线直播', color: '#FD818D'},
                    {title: '线下培训', color: 'rgb(255, 185, 75)'}
                ],
                echartsRight4: [],
                echartsRight3: [],
                info: {
                    "tutor_count":0,
                    "student_count":0,
                    "product_count":0,
                    "study_user_count":0,
                    "graduation_count":0,
                    "pay_user_count":0,
                    "pay_amount":0
                },
                yearms: '',
                activeIndex: null,
                yearMoths: [],
                data_picker: [],
                times: 'WEEK',
                isDaterange: false,
                students: 'all',
                selCascade: 'all',
                select2: [ {value: 'all', label: '全部产品'} ],
                studentList: [ {batch: '全部学员', id: 'all'} ],
                changeOnSelect: false,
                pay1, pay2,
                select: [{id: 'all', title: '全部机构'}],
                valueSelect1: 'all',
                valueSelect2: 'all',
                selectTime: [
                    {id: 'WEEK', title: '近7天'},
                    {id: "MONTH", title: '近30天'},
                    // {id: "6MONTH", title: '近半年'},
                    {id: "YEAR", title: '近一年'},
                    {id: "CUSTOM", title: '自定义'},
                ],
                cards: [
                    {color: '#007D97', icons: number1, title: '导师人数', company: '人', num: 0, bg: '#10BBDF'},
                    {color: '#C47B0A', icons: number2, title: '学员人数', company: '人', num: 0, bg: '#FFB94B'},
                    {color: '#305ADE', icons: number3, title: '课程总数', company: '个', num: 0, bg: '#5A92FF'},
                    {color: '#DE3141', icons: number4, title: '累计学习', company: '人次', num: 0, bg: '#FD818D'},
                    {color: '#24248A', icons: number5, title: '结业人数', company: '人', num: 0, bg: '#6666C6'}
                ]
            }
        },
        computed: {
            isSuper(){
               return this.$config.getRoleId() == 1
            },
            organizationName(){
                return JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).organization_name
            },
            organizationId(){
                let organization_ids = this.valueSelect1 == 'all' ? null : this.valueSelect1
                return this.isSuper ? organization_ids : +sessionStorage.getItem('organizationId')
            },
            organizationEId(){
                let organization_ids = this.valueSelect2 == 'all' ? null : this.valueSelect2
                return this.isSuper ? organization_ids : +sessionStorage.getItem('organizationId')
            },
            timesInit(){
                let y = new Date().getFullYear()
                let m = new Date().getMonth() + 1
                let int = y + '年' + m + '月'
                let t7 = this.$config.getDay(0) + ' - ' + this.$config.getDay(-6)
                let t30 = this.$config.getDay(0)  + ' - ' +  this.$config.getDay(-29)
                let da = this.data_picker[0]  + ' - ' + this.data_picker[1]
                return this.times == 'CUSTOM'&&this.isCustonMouths() ? da : this.times == 'MONTH' ? t30 : this.times == 'WEEK' ? t7 : int
            }
        },
        mounted(){
            // this.yearms = `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`
            // this.setYearMoths()
            if(this.isSuper) this.getSelData()
            this.getSelscts()
            this.getEcharts()
            this.getData()
        },
        methods: {
            changeMouthsClear(){
                this.yearms = ''
                this.getEcharts('echerts2-clear')
            },
            change3(v, it){
                this.getEcharts()
                 console.log(v,it,'oooo');
            },
            getStudentSituationPersonTime(d){
                PostData('dm/getStudentSituationPersonTime', d).then((r) => {
                    if(r.res_code == 1){
                        let da = [], da2 = []
                        if(r.data&&r.data.length>0){
                            r.data.map((t) => {
                                da.push(t.x)
                                da2.push(t.y)
                            })
                        }
                        this.echerts2(da, da2)
                    }
                }) 
            },
             getStudentSituationTrend(d){
                PostData('dm/getStudentSituationTrend', d).then((r) => {
                    if(r.res_code == 1){
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
                        this.echerts1(da, da2, da3, dc)
                    }
                })
             },
             getStudentTimeSlot(d){
                PostData('dm/getStudentTimeSlot', d).then((r) => {
                    if(r.res_code == 1){
                        let s = r.data
                        let da = [s.h20_24, s.h16_20, s.h12_16, s.h8_12, s.h4_8, s.h0_4]
                        let names = ['20-24 点', '16-20 点', '12-16 点', '8-12 点', '4-8 点', '0-4 点']
                        let names2 = ['20:00-24:00', '16:00-20:00', '12:00-16:00', '08:00-12:00', '04:00-08:00', '00:00-04:00']
                        let itemStyle = this.itemStyleInit()
                        let arr = []
                        da.map((t, i) => {
                            t.value = t.count
                            t.name = names[i]
                            t.itemStyle = itemStyle
                            arr.push(t.count)
                        })
                        arr.sort((a,b) => b - a)
                        this.valMax3 =  [ arr[0], arr[1] ]
                        this.echartsRight3 = []
                        for(let l = 0; l < 3; l ++){
                            let it = {}
                            let setItem = (s1, s2 , icons, n1, n2) => {
                                return {
                                    icons,
                                    item1: {...s1, name: names2[n1]},
                                    item2: {...s2, name: names2[n2]}
                                }
                            }
                            if(l == 0) it = setItem(s.h4_8, s.h8_12, day1, 4, 3)
                            if(l == 1) it = setItem(s.h12_16, s.h16_20, day2, 2, 1)
                            if(l == 2) it = setItem(s.h20_24, s.h0_4, day3, 0, 5)
                            this.echartsRight3.push(it)
                        }
                        this.echerts3(da)
                    }
                }) 
             },
             getStudentDuration(d){
                PostData('dm/getStudentDuration', d).then((r) => {
                    if(r.res_code == 1){
                        if(r.data&&r.data.length>0){
                            let types = ['min30','min30_60','h1_2','h2']
                            let names = ['0-30 min', '30-60 min', '1-2 h', '2 h >']
                            let colors = ['#21a675','#FFB94B','#db5a6b','#6666C6']
                            let itemStyle = this.itemStyleInit()
                            let arr = []
                            r.data.map((t, i) => {
                                t.value = t.student_count
                                t.name = names[i]
                                t.itemStyle = itemStyle
                                t.col = colors[i]
                                arr.push(t.student_count)
                            })
                            arr.sort((a,b) => b - a)
                            this.valMax4 = arr[0]
                            this.echartsRight4 = r.data
                            this.echerts4(r.data)
                        }
                    }
                })
             },
             getEcharts(type){
                let d = {
                    organization_id: this.organizationEId,
                    obj_id: this.selCascade == 'all' ? '' : this.selCascade, 
                    batch_id: this.students == 'all' ? '' : this.students, 
                    obj_type: 1
                }
                if(type&&type == 'CUSTOM'){
                    let y1 = this.yearms.getFullYear()
                    let m1 = this.yearms.getMonth() + 1
                    d.start_time = y1 + '-' + (m1 < 10 ? '0' + m1 : m1) + '-01'
                    d.end_time = this.$config.formatDate(new Date(y1,m1,0),'-')
                    d.dm_type = 'DAY'
                    d.time_type = type
                    this.getStudentSituationPersonTime(d)
                }else{
                    d.time_type = this.times
                    if(this.times == 'CUSTOM'&&this.data_picker.length==2){
                        d.start_time = this.data_picker[0]
                        d.end_time = this.data_picker[1]
                        d.dm_type = this.isCustonMouths() ? 'DAY' : 'MONTH'
                    }
                    if(type == 'echerts2-clear') this.getStudentSituationPersonTime(d)
                    else{
                        this.getStudentSituationTrend(d)
                        this.getStudentSituationPersonTime(d)
                        this.getStudentTimeSlot(d) 
                        this.getStudentDuration(d)
                    }
                }
            },
            isCustonMouths(){
                let bool = false
                if(this.times == 'CUSTOM'&&this.data_picker.length==2&&this.data_picker[0]){
                    let da = new Date(this.data_picker[0])
                    let n1 = this.data_picker[1].split('-').join("")
                    let n2 = (this.$config.getDay(29, da)).split('-').join("")
                    bool = +n1 <= (+n2)
                }
                return (this.times=='WEEK'||this.times=='MONTH') ? true : bool
            },
            changeMouths(t){
                if(this.yearms) this.getEcharts('CUSTOM')
            },
            setYearMothsInt(year){
                let y = year || new Date().getFullYear()
                let acty = new Date().getFullYear()
                let m = new Date().getMonth() + 1
                let yearMoths = [];
                for(let i = 0; i < 12; i ++){
                    yearMoths.push([y, i + 1])
                    if(y == acty&&m == (i + 1)) this.activeIndex = i
                }
                return yearMoths
            },
            setYearMoths(){
               this.yearMoths = this.setYearMothsInt()
            },
            dataPickerChange(val) {
                this.data_picker = val
                // if(this.data_picker[0]){
                //     let y = new Date().getFullYear()
                //     let y2 = +(this.data_picker[0].slice(0,4))
                //     let y3 = +(this.data_picker[1].slice(0,4))
                //     if(y != y2 || y != y3){
                //         let d = []
                //         for(let i = y3; i<(y2 - 1); i --){
                //             d.push(...this.setYearMothsInt(i))
                //         }
                //         this.yearMoths = d
                //     }
                // }
                this.getEcharts()
            },
            getBatchList(){
                let d = {
                    organization_id: this.organizationEId,
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
            handleChangeOnSelect (value) {
              this.changeOnSelect = value
            },
            changeTime(val){
                this.isDaterange = val =='CUSTOM'
                if(val !='CUSTOM') this.getEcharts()
            },
            change2(val){
                this.getEcharts()
            },
            cascaderType(v, selectedData){
               console.log(v,'vv')
            },
            loadData (item, callback) {
                item.loading = true;
                setTimeout(() => {
                    if(item.value != 'all'){
                        PostData('product/curriculum_online/pulldown_get_list', {product_id: item.value}).then((r) => {
                            if(r.res_code == 1) {
                                r.data.map((t) => {
                                    t.value = t.id
                                    t.label = t.title
                                })
                                item.children = r.data;
                                item.loading = false;
                                callback();
                            }
                        })
                    }
                }, 1000);
            },
            getSelData(){
                PostData('components/getOrganization').then((res) => {
                    this.select = [...this.select, ...res.data]
                })
            },
            getData(){
                let d = {
                    organization_id: this.organizationId
                }
                PostData('dm/getGeneralSituation', d).then((r) => {
                    if(r.res_code == 1){
                        this.info = r.data
                        this.cards.map((t, i) => {
                            let params = ['tutor_count','student_count','product_count','study_user_count','graduation_count']
                            t.num = r.data[params[i]]
                        })
                    }
                })
            },
            setEchertsTitle(text){
                return {
                    text,
                    left: 20,
                    textStyle: {
                        fontSize: 10,
                        color: '#474C63'
                    }
                }
            },
            echerts1(dx, dy, dz, dc){
                let myChart = echarts.init(document.getElementById('population-trend'));
                let option = {
                    color: ['#6666C6','#FD818D','rgb(255, 185, 75)'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        },
                        formatter: '{b0} <br/> {a0}: {c0}人<br />{a1}: {c1}人<br />{a2}: {c2}人'
                    },
                    // legend: {
                    //     data: [
                    //         {name: '线上培训', icon: 'circle',},
                    //         {name: '在线直播', icon: 'circle',}
                    //     ],
                    //     textStyle: {
                    //         fontSize: 14,
                    //         color: '#474C63'
                    //     }
                    // },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            fontSize: 10,
                            color: '#474C63',
                            formatter: function (value) {
                                return value.slice(5);
                            },
                        },
                        boundaryGap: true,
                        axisLine: { show: false },
                        axisTick: { show: false},
                        data: dx
                    },
                    yAxis: [
                        {
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
                        }
                    ],
                    series: [
                        {
                            name: '线上培训',
                            type: 'line',
                            smooth: true,
                            lineStyle: { color: '#6666C6' },
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
                            data: dy
                        },
                        {
                            name: '在线直播',
                            type: 'line',
                            smooth: true,
                            lineStyle: { color: '#FD818D' },
                            data: dz,
                        },
                        {
                            name: '线下培训',
                            type: 'line',
                            smooth: true,
                            lineStyle: { color: 'rgb(255, 185, 75)' },
                            data: dc,
                        },
                    ]
                };
                myChart.setOption(option);
            },
            echerts2(dx, dy){
                let myChart = echarts.init(document.getElementById('daily-trips'));
                let option = {
                    color: ['#5A92FF'],
                    // title: this.setEchertsTitle('学员每日学习人次'),
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            fontSize: 10,
                            color: '#474C63',
                            formatter: function (value) {
                                return value.slice(5);
                            },
                        },
                        boundaryGap: true,
                        axisLine: { show: false },
                        axisTick: { show: false},
                        data: dx
                    },
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: { show: false },
                            axisTick: { show: false},
                            axisLabel: {
                                formatter: function (value, index) {
                                    return Number.isInteger(value) ? value + '人' : '';
                                },
                                fontSize: 10,
                                color: '#474C63'
                            },
                            splitLine: { lineStyle: {type: 'dashed', color: '#D4D7E3'}},
                        }
                    ],
                    series: [
                        {
                            name: '学习人次',
                            type: 'bar',
                            barWidth: '60%',
                            data: dy
                        }
                    ]
                };
                myChart.setOption(option);
            },
            itemStyleInit(){
                return {
                    normal: {
                        // color: '#fff',
                        borderColor: '#fff',
                        borderType: 'solid',
                        borderWidth: 5
                    }
                }
            },
            echerts3(list){
                const list2 = list.reverse()
                const item = list2[0]
                list2.splice(0, 1)
                list2.push(item)
                let myChart = echarts.init(document.getElementById('time-interval'))
                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (value, index) {
                            console.log(value,'KMKM');
                            return `学习时段<br/>${value.data.name}: ${value.data.count} (${value.percent}%)`
                        }
                    },
                    color: ['#f6bb60', '#f6bb60', '#6394f8', '#6394f8', '#6469c0', '#6469c0'],
                    series: [
                        {
                            name: '学习时段',
                            type: 'pie',
                            center: ['30%','55%'],
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            hoverOffset: 3,
                            selectedOffset: 3,
                            label: {
                                show: false,
                                position: 'center',
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 16,
                                    formatter: function (value, index) {
                                        return `${value.data.ratio}%\n \n${value.data.name}`
                                    }
                                }
                            },
                            data: list2
                        }
                    ]
                };
                myChart.setOption(option);
            },
            echerts4(list){
                let myChart = echarts.init(document.getElementById('study-duration'))
                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (value, index) {
                            return `学习时长<br/>${value.data.name}: ${value.data.student_count} (${value.data.ratio})`
                        }
                    },
                    color: ['#21a675','#FFB94B','#db5a6b','#6666C6'],
                    series: [
                        {
                            name: '学习时长',
                            type: 'pie',
                            center: ['30%','55%'],
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            hoverOffset: 3,
                            selectedOffset: 3,
                            label: {
                                show: false,
                                position: 'center',
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 16,
                                    formatter: function (value, index) {
                                        return `${value.data.ratio}\n \n${value.data.name}`
                                    }
                                }
                            },
                            data: list
                        }
                    ]
                };
                myChart.setOption(option);
            },
            selectChange1(val){
                this.getData()
            },
            selectChange2(val){
                this.getSelscts(val)
                this.getBatchList()
                this.getEcharts()
            },
            getSelscts(){
                PostData('components/getProducts', { organization_id: this.organizationEId }).then((r) => {
                    if(r.res_code == 1) {
                        let da = {value: 'all', label: '全部产品'}
                        r.data.map((t) => {
                            t.value = t.id
                            t.label = t.title
                            t.children = []
                            t.loading = false
                        })
                        this.select2 = [da, ...r.data]
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    .echarts-item{
        flex: 1;
        background-color: #fff;
        height: 260px;
        border-radius: 4px;
        position: relative;
        .echarts-box3{
            position: absolute;
            right: 50px;
            top: calc(50% - 66px);
            .echarts-box-3{
                display: flex;
                margin-bottom: 15px;
                align-items: center;
                .echarts-details{
                    margin-left: 10px;
                    .details-view{
                        display: flex;
                        align-items: center;
                        .details-name1{
                            width: 76px;
                            text-align: right;
                        }
                    }
                }
            }
        }
         .echarts-box2{
             position: absolute;
             right: 80px;
             top: calc(50% - 45px);
             .echarts-box-2{
                display: flex;
                margin-bottom: 16px;
                align-items: center;
             }
         }
        .texts1{
            width: 72px;
            text-align: left;
            margin-right: 5px;
        }
        .texts2{
            font-family: PingFangSC-Medium;
            font-size: 10px;
            color: #474C63;
        }
        .textMax{
            font-family: PingFangSC-Medium;
            font-size: 10px;
            color: #FB4053;
         }
         .echarts-box{
            display: flex;
            align-items: center;
            position: absolute;
            left: calc(50% - 89px);
            top: 20px;
            width: 267px;
        }
        .echarts-box-recommend{
            display: flex;
            align-items: center;
            margin-right: 20px;
        }
        .echarts-box-color{
            width: 8px;
            height: 8px;
            border-radius: 100%;
            margin-right: 5px;
        }
        .echarts-box-text{
            font-size: 10px;
            font-weight: 700;
            color: #474C63;
        }
        .echarts-title{
            position: absolute;
            left: 20px;
            top: 20px;
            font-size: 10px;
            font-weight: 700;
            color: #474C63;
        }
        .echarts-view{
            height: 220px;
            margin: 20px 0;
        }
        .mouths{
            position: absolute;
            right: 20px;
            top: 20px;
            font-family: PingFangSC-Medium;
            font-size: 10px;
            color: #474C63;
        }
        .year-mouths{
            width: 120px !important;
            position: absolute;
            right: 20px;
            top: 20px
        }
        .echarts-view2{
            height: 220px;
            margin: 20px 0 0 0;
        }
    }
    .data-management{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #f0f0f7;
        .heads{
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: #FFFFFF;
            box-shadow: 0 2px 4px 0 rgba(71,76,99,0.05);
        }
        .main{
            width: 100%;
            padding: 20px;
            overflow-y: auto;
            .echarts-main{
                display: flex;
            }
            .h-title{
                margin-right: 20px;
                white-space: nowrap;
            }
            .screen-data-picker{
                width: 250px !important;
                margin-left: 10px !important;
                /deep/ .ivu-btn{
                    display: inline-block !important;
                }
            }
            .select-list{
                width: 200px;
                // height: 28px;
                margin-left: 10px;
                // /deep/ .ivu-select-selection, /deep/ .ivu-select-selected-value, /deep/ .ivu-select-placeholder {
                //     height: 28px;
                //     line-height: 28px;
                // }
            }
            .head2{
                display: flex;
                align-items: center;
                margin-bottom: 17px;
                position: relative;
                .rights{
                    position: absolute;
                    right: 0;
                    .time-view{
                        letter-spacing: 0.83px;
                    }
                    .times{
                        font-family: Helvetica;
                        font-size: 10px;
                        color: #8489A1;
                        letter-spacing: 0.83px;
                    }
                }
            }
            .card-view{
                display: flex;
                height: 70px;
                margin-bottom: 20px;
                width: 100%;
                .imgs{
                    width: 38px;
                    height: 38px;
                }
                .tt{
                    margin-left: 15px;
                    .t1{
                        font-family: Helvetica-Bold;
                        font-size: 26px;
                        color: #FFFFFF;
                        height: 31px;
                        text-align: left;
                        line-height: 26px;
                    }
                    .t2{
                        font-family: PingFangSC-Medium;
                        font-size: 10px;
                        color: #FFFFFF;
                        height: 14px;
                    }
                }
                .textr{
                    position: absolute;
                    right: 15px;
                    bottom: 15px;
                }
                .item{
                    flex: 1;
                    display: flex;
                    border-radius: 4px;
                    align-items: center;
                    padding: 0 15px;
                    position: relative;
                }
                .card0{
                    .item;
                }
                .card{
                    .item;
                    margin-left: 10px;
                }
            }
            .pay-view{
                display: flex;
                margin-bottom: 20px;
                .pays{
                    flex: 1;
                    height: 70px;
                    display: flex;
                    background-color: #fff;
                    border-radius: 4px;
                    .pay-text{
                        margin-left: 20px;
                        margin-top: 10px;
                    }
                    .pay-nums{
                        flex: 1;
                        height: 70px;
                        line-height: 70px;
                        text-align: left;
                        .numss{
                            font-family: Helvetica-Bold;
                            font-size: 36px;
                            color: #4098FF;
                            margin-right: 10px;
                            text-align: left;
                            padding-left: 50px;
                        }
                    }
                    .pay-imgs{
                        height: 70px;
                        margin-right: 20px;
                    }
                }
            }
            .echarts-head{
                display: flex;
                align-items: center;
                margin-bottom: 17px;
            }
        }
    }
    @media screen and (max-width: 1441px) {
        .echarts-item{
            flex: 1;
            background-color: #fff;
            height: 220px;
            border-radius: 4px;
            position: relative;
            .echarts-view{
                height: 200px;
                margin: 10px 0;
            }
            .echarts-view2{
                height: 200px;
                margin: 10px 0 0 0;
            }
        }
    }
    @media screen and (max-width: 1281px) {
        .echarts-item{
            flex: 1;
            background-color: #fff;
            height: 200px;
            border-radius: 4px;
            position: relative;
            .echarts-view{
                height: 180px;
                margin: 10px 0;
            }
            .echarts-view2{
                height: 180px;
                margin: 10px 0 0 0;
            }
        }
    }
</style>
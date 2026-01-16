<template>
    <div class="evaluation-statistics">
        <div class="head">
            <div class="head-logo" @click="handleBack">
                <img :class="$logo.learn ? 'logo-img2' : 'logo-img'" :src='$logo.img'>
                <div v-if="!$logo.learn" class="logo-title">九划医教</div>
            </div>
        </div>
        <div class="main">
            <div class="head2" v-if="info">
                <img class="imgs" :src="info.imgs"/>
                <div class="tit-view">
                    <div class="grey-medium2">{{info.title}}</div>
                    <Select v-model="selStudent" @on-change="changeSels" class="sels">
                        <Option v-for="item in students" :value="item.id" :key="item.id">{{ item.batch }}</Option>
                    </Select>
                </div>
                <div class="right-nums">
                    <div><span class="time-view">数据更新时间：</span><span class="times">{{$config.formatTime(new Date())}}</span></div>
                    <div class="numbers">
                        <div class="items">
                            <p class="tit">{{info.sign_count}}</p>
                            <p class="grey-regulars1">报名人数</p>
                        </div>
                        <Divider style="height: 30px" type="vertical" />
                        <div class="items">
                            <p class="tit">{{info.complete_count}}</p>
                            <p class="grey-regulars1">完成人数</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="echerts-main">
                <div class="evaluates evaluate1">
                    <div class="main-tit"><div class="lines"></div><span class="grey-medium2">培训平均评价</span></div>
                    <div v-if="productEvaluate.length>0">
                        <div class="evaluate-view" v-for="(t, i) in productEvaluate" :key="i">
                            <div class="grey-regular5 evaluate-flex">{{i + 1}}.{{t.evaluate_content}}</div>
                            <div class="grey-regular5">{{t.avg_score ? t.avg_score: 0}}分</div>
                        </div>
                    </div>
                </div>
                <div class="evaluates evaluate2">
                    <div class="main-tit"><div class="lines"></div>
                        <span class="grey-medium2">课程平均评价</span>
                        <span class="curriculum-name grey-medium7" v-if="curriculumName">{{curriculumName}}</span>
                    </div>
                    <div @click="see" class="see-course">查看更多</div>
                    <div v-if="curriculumEvaluate.length>0">
                        <div class="evaluate-view" v-for="(t, i) in curriculumEvaluate" :key="i">
                            <div class="grey-regular5 evaluate-flex">{{i + 1}}.{{t.evaluate_content}}</div>
                            <div class="grey-regular5">{{t.avg_score}}分</div>
                        </div>
                    </div>
                    <div class="no-view" v-else>暂未进行课程评价</div>
                </div>
            </div>
            <div class="course-rankings">
                <div class="rankings evaluate1">
                    <div class="main-tit"><div class="lines"></div><span class="grey-medium2">课程评价排名</span></div>
                    <div class="list">
                        <div v-for="(t,i) in list1" :key="i">
                            <div v-if="i < isOpen1" class="item">
                                <img class="imgs" v-if="t.icons" :src="t.icons" />
                                <span class="imgs" v-else>{{i+1}}</span>
                                <span class="grey-regular5 item-title">{{t.title}}</span>
                                <div class="item-progress">
                                    <Progress class="progresss" stroke-color="#FFB94B" :stroke-width="12" hide-info :percent="t.avg_score" style="width: 100%"/>
                                </div>
                                <span class="text">{{(t.avg_score/10).toFixed(1)}}分</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="isOpen1 == 5&&list1.length>5" class="mores"><div @click="more1" class="more">查看更多</div></div>
                </div>
                <div class="rankings evaluate2">
                    <div class="main-tit"><div class="lines"></div><span class="grey-medium2">课程累计学习人次排名</span></div>
                    <div class="list">
                        <div v-for="(t,i) in list2" :key="i">
                            <div v-if="i < isOpen2" class="item">
                                <img class="imgs" v-if="t.icons" :src="t.icons" />
                                <span class="imgs" v-else>{{i+1}}</span>
                                <span class="grey-regular5 item-title">{{t.title}}</span>
                                <div class="item-progress item-progress2">
                                    <div class="progress2" :style="progressWidth(t)"></div>
                                    <span class="text">{{t.countTitle}}次</span>
                                </div>
                            </div>
                        </div>
                    </div>
                   <div v-if="isOpen2 == 5&&list2.length>5" class="mores"><div @click="more2" class="more">查看更多</div></div>
                </div>
            </div>
            <div v-if="proposalList.length>0" class="proposal-view">
                <div class="main-tit"><div class="lines"></div><span class="grey-medium2">其它建议</span></div>
                <Tables :tabel-height="440" :is-serial="pageDataCount" :column="columns1" :table-data="proposalList"/>
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageChange"/>
            </div>
        </div>
    </div>
</template>

<script>
    import firstImg from '../../assets/rank/first.png'
    import twoImg from '../../assets/rank/two.png'
    import threeImg from '../../assets/rank/three.png'
    import PageList from '../../components/Page'
    import Tables from '../../components/tables'
    export default {
        name: '',
        components: {Tables, PageList},
        data() {
            return {
                current: 1,
                total: null,
                pageSize: 10,
                proposalList: [],
                columns1: [
                {
                    title: '姓名',
                    key: 'realname',
                    width: 200
                },{
                    title: '建议',
                    key: 'comment',
                    align: 'left',
                    minWidth: 400
                }
                ],
                isOpen1: 5,
                isOpen2: 5,
                selStudent: 'all',
                info: null,
                students: [
                    {batch: '全部学员', id: 'all'}
                ],
                maxNums: 0,
                list1: [],
                list2: [],
                productEvaluate: [],
                curriculumEvaluate: []
            }
        },
        mounted(){
            this.getBatchList(+this.$route.query.organization_id)
            this.getData(1)
            this.getData(2)
            this.getData(3)
            this.getList()
        },
        computed: {
            curriculumName(){
                return this.$route.query.curriculum_name
            },
            pageDataCount() {
                return {
                    current: this.current,
                    pageSize: this.pageSize,
                    isSerial: true
                }
            }
        },
        methods: {
            pageChange(val){
                this.current = val
                this.getList()
            },
            progressWidth(t){
                return `width: calc(${(t.count/this.maxNums)*100}%)`
            },
            getList(){
                let d = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    product_id: +this.$route.query.id
                }
                PostData('product/getProductOtherEvaluate', d).then((r) => {
                    if(r.res_code == 1){
                        this.proposalList = r.data.data
                        this.total = r.data.count
                    }
                })
            },
            getData(i){
                let arr = ['product/getProductEvaluateTop', 'product/getProductEvaluateMiddle', 'product/getProductEvaluateFoot']
                let d = {
                    product_id: +this.$route.query.id, 
                    batch_id: this.selStudent == 'all' ? '' : this.selStudent,
                    curriculum_id: +this.$route.query.curriculum_id, 
                }
                PostData(arr[i - 1], d).then((r) => {
                    if(r.res_code == 1){
                        if(i == 1){
                            this.info = r.data
                            let url_arr = JSON.parse(r.data.url_arr)
                            this.info.imgs = url_arr.video_img ? url_arr.video_img : url_arr.default[0]
                        }
                        if(i == 2&&r.data){
                            this.productEvaluate = r.data.product_evaluate || []
                            this.curriculumEvaluate = r.data.curriculum_evaluate || []
                        }
                        if(i == 3){
                            let imgs = [firstImg, twoImg, threeImg]
                            this.list1 = r.data.curriculum_sort || []
                            if(this.list1.length>0){
                                this.list1.map((t, l) => {
                                    t.icons = l < 3 ? imgs[l] : ''
                                })
                            }
                            this.list2 = r.data.curriculum_student_sort || []
                            if(this.list2.length>0){
                                this.maxNums = this.list2[0].count
                                this.list2.map((t, l) => {
                                    let c = t.count
                                    t.icons = l < 3 ? imgs[l] : ''
                                    t.countTitle = c >= 10000 ? (c/10000).toFixed(2) + '万' :  c >= 1000 ? (c/1000).toFixed(2) + '千' : c
                                })
                            }
                        }
                    }
                })
            },
            more1(){
                this.isOpen1 = this.list1.length
            },
            more2(){
                this.isOpen2 = this.list2.length
            },
            see(){
                // let d = this.$route.query
                // window.open(`/product/course-data?id=${d.id}&&organization_id=${d.organization_id}`,'_blank')
                window.open(`/product/product-grade?id=${JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id}&title=${JSON.parse(sessionStorage.getItem('PRODUCTINFO')).title}`,'_blank')
            },
            changeSels(val){
                this.selStudent = val;
                this.getData(1)
                this.getData(2)
                this.getData(3)
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
            handleBack() {
                this.$router.push('/dashboard/user-manage')
            },
        }
    }
</script>

<style lang="less" scoped>
    .evaluate-view{
         display: flex;
         margin: 15px 100px 15px 15px;
         .evaluate-flex{
             flex: 1
         }
    }
    .proposal-view{
        margin-top: 10px;
        background-color: #fff;
        min-height: 120px;
        padding: 20px 20px 15px 20px;
    }
    .curriculum-name{
        position: absolute;
        right: 100px;
        font-weight: 700;
    }
    .evaluation-statistics{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
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
        .main{
            width: 100%;
            height: 100%;
            overflow-y: auto;
            background-color: #f0f0f7;
            padding: 10px 20px 20px 20px;
            .head2{
                height: 175px;
                width: 100%;
                padding: 20px 20px 20px 30px;
                display: flex;
                background-color: #fff;
                .imgs{
                    width: 240px;
                    height: 135px;
                }
                .tit-view{
                    flex: 1;
                    padding-left: 37px;
                    padding-right: 10px;
                    text-align: left;
                    .sels{
                        width: 200px; 
                        height: 28px;
                        margin-top: 37px;
                        /deep/ .ivu-select-selection{
                            height: 28px;
                        }
                        /deep/ .ivu-select-placeholder, /deep/ .ivu-select-selected-value{
                            line-height: 26px;
                        }
                    }
                }
                .right-nums{
                    .time-view{
                        font-family: PingFangSC-Regular;
                        font-size: 10px;
                        color: #8489A1;
                        letter-spacing: 0.83px;
                    }
                    .times{
                        font-family: Helvetica;
                        font-size: 10px;
                        color: #8489A1;
                        letter-spacing: 0.83px;
                    }
                    .numbers{
                        display: flex;
                        margin-top: 50px;
                        align-items: center;
                        .items{
                            width: 120px;
                            .tit{
                                font-family: PingFangSC-Medium;
                                font-size: 22px;
                                color: #4098FF;
                                margin-bottom: 5px;
                            }
                        }
                    }
                }
            }
            .echerts-main{
                display: flex;
                width: 100%;
                margin-top: 10px;
                min-height: 150px;
                .evaluates{
                    display: flex;
                    flex-direction: column;
                    width: calc(50% - 5px);
                    background-color: #fff;
                    position: relative;
                    padding-top: 10px;
                    padding-left: 20px;
                    .no-view{
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .see-course{
                        position: absolute;
                        right: 20px;
                        top: 20px;
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #4098FF;
                        text-decoration: underline;
                    }
                }
            }
            .evaluate1{
                margin-right: 5px;
            }
            .evaluate2{
                margin-left: 5px;
            }
            .course-rankings{
                display: flex;
                margin-top: 10px;
                .rankings{
                    width: calc(50% - 5px);
                    background-color: #fff;
                    min-height: 360px;
                    padding: 20px 20px 15px 20px;
                    .list{
                        margin: 15px 10px 0 10px;
                        .item{
                            width: 100%;
                            height: 46px;
                            display: flex;
                            align-items: center;
                            border-bottom: 1px  #F0F0F7 dashed;
                            .imgs{
                                width: 17px;
                                margin-right: 10px;
                                font-family: Helvetica-Bold;
                                font-size: 15px;
                                color: #474C63;
                            }
                            .item-title{
                                width: 21%;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                text-align: left;
                            }
                            .item-progress{
                                flex: 1;
                                .progresss{
                                    /deep/ .ivu-progress-bg, /deep/ .ivu-progress-inner{
                                        border-radius: 2px
                                    }
                                }
                            }
                            .item-progress2{
                                display: flex;
                                align-items: center;
                            }
                            .progress2{
                                height: 12px;
                                background: #10BBDF;
                                border-radius: 2px;
                            }
                            .text{
                                font-family: PingFangSC-Regular;
                                font-size: 15px;
                                color: #8489A1;
                                text-align: left;
                                margin-left: 10px;
                                min-width: 100px;
                                white-space: nowrap;
                            }
                        }
                    }
                    .mores{
                        margin-top: 20px;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        .more{
                            height: 21px;
                            width: 90px;
                            cursor: pointer;
                            background: rgba(64,152,255,0.10);
                            border-radius: 10px;
                            text-align: center;
                            line-height: 21px;
                            font-family: PingFangSC-Regular;
                            font-size: 12px;
                            color: #4098FF;
                        }
                    }
                }
            }
        }
    }
</style>
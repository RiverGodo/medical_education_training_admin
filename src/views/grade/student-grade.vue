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
            <div v-if="studentScore" class="message">
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
            <div class="total">
                <div class="total-course">
                    <div class="total-course-title">
                        <div class="total-course-title-content">课程反馈</div>
                    </div>
                    <div v-if="studentScore"  class="score-view">
                        <div class="score-row">
                            <div class="score-item score-border">评分项</div>
                            <div class="score-item score-center">评分</div>
                        </div>
                        <div v-for="(t, i) in productScores" :key="i" class="score-row">
                            <div class="score-item score-border">{{t.title}}</div>
                            <div class="score-item">
                               <div class="score-star-view">
                                    <div v-for="(item, j) in 5" :key="j" class="score-star">
                                        <Icon color="#4098FF" size="18" v-if="studentScore['stars_num_' + (i + 1)]" :type="studentScore['stars_num_' + (i + 1)] > j ? 'ios-star' : 'ios-star-outline'" />
                                        <span v-else>—</span>
                                    </div>
                               </div>
                            </div>
                        </div>
                        <div class="score-row">
                            <div class="score-item">其它建议</div>
                            <div class="score-item">{{studentScore.comment ? studentScore.comment : '—'}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="total" v-if="list2.length>0">
                <div v-for="(t, i) in list2" :key="i" class="total-course">
                    <div class="total-course-title">
                        <div class="total-course-title-content">课程评分 <span>{{t.title}}</span></div>
                    </div>
                    <div class="score-view">
                        <div class="score-row">
                            <div class="score-item score-border">评分项</div>
                            <div class="score-item score-center">评分</div>
                        </div>
                        <div v-for="(it, k) in t.length_index" :key="k" class="score-row">
                            <div class="score-item score-border">{{t['evaluate_content_' + (k + 1)]}}</div>
                            <div class="score-item">
                               <div class="score-star-view">
                                    <div v-for="(item, j) in 5" :key="j" class="score-star">
                                        <Icon color="#4098FF" size="18" v-if="t['stars_' + (k + 1)]" :type="t['stars_' + (k + 1)] > j ? 'ios-star' : 'ios-star-outline'" />
                                        <span v-else>—</span>
                                    </div>
                               </div>
                            </div>
                        </div>
                        <div class="score-row">
                            <div class="score-item">其它建议</div>
                            <div class="score-item">{{t.comment ? t.comment : '—'}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import postData from '../../api/postData'

    export default {
        data() {
            return{
                headImg: JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).head_img_url,
                list2: [],
                studentScore: null,
                productScores: [],
            }
        },
        methods: {
            handleBack() {
                this.$router.push('/dashboard/user-manage')
            },
            getData(){
                postData('product/getEvaluateByProduct',{product_id: +this.$route.query.product_id}).then(r => {
                   if(r.data.product_evaluate.length>0){
                       r.data.product_evaluate.map((t,i) => {
                           this.productScores.push({title: t.evaluate_content})
                       })
                   }
                })
            },
            getList() {
                let data = {
                    page_size: 999999,
                    page_num: 1,
                    product_id: Number(this.$route.query.product_id),
                    student_id: Number(this.$route.query.student_id)
                }
                postData('product/product/getStudentProductScore', data).then(res => {
                    if(res.res_code == 1) {
                        this.total = res.data.count
                        this.list2 = res.data.list
                        this.studentScore = res.data.studentScore
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
    .score-center{
        text-align: center;
    }
    .score-view{
        padding: 0 30px 15px 30px;
        .score-row{
            display: flex;
            flex-direction: row;
            border-top: 1px solid #f0f0f7;
            .score-item{
                flex: 1;
                padding: 10px 15px;
                line-height: 20px;
            }
            .score-star-view{
                display: flex;
                padding: 0 10%;
            }
            .score-star{
                flex: 1;
                display: flex;
                justify-content: center;
            }
            .score-border{
                border-right: 1px solid #f0f0f7;
            }
        }
    }
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

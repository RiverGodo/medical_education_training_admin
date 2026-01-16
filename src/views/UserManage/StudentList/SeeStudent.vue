<template>
    <div class="see-students">
        <SeeCer :imgTitle="imgTitle" :show="showCer" :imgUrl="imgUrl" @closeCer="closeCer"/>
        <div class="head">
            <div class="back" @click="back">
                <img class="back-img" src="../../../assets/icons/icon/back.png" alt="">
                <span class="grey-regular2">返回</span>
            </div>
            <span class="grey-regular2">学员信息</span>
        </div>
        <div class="content">
            <div class="tit grey-regular4">用户管理 > 学员列表 > 学员信息</div>
            <div class="main">
                <div class="left">
                    <div class="titles grey-medium1">基本信息</div>
                    <Divider class="lines" />
                    <div class="info-head">
                        <div class="infos" v-if="info">
                            <div>
                                <span class="grey-medium2">{{info.realname}}</span>
                                <span v-if="info.sex == 2">未知</span>
                                <img class="sex" v-if="info.sex == 1 || info.sex === 0" :src="info.sex == 1 ? male : female" />
                            </div>
                            <div class="ids">ID: {{info.username}}</div>
                            <div class="grey-regular4 auth-view">认证状态：{{info.certify_state == 1 ? '已认证' : '未认证'}} <img class="auth" v-if="info.certify_state == 1" :src="authImg" /></div>
                            <div class="grey-regular4 items">手机号码：{{info.username}}</div>
                            <div class="grey-regular4 items">性别：{{info.sex == 0 ? "女":"男"}}</div>
                            <div class="grey-regular4 items">毕业院校：{{info.college_name}}</div>
                            <div class="grey-regular4 items">当前单位：{{info.commpany_name}}</div>
                            <div class="grey-regular4 items"><div class="item-tit">科室</div>：{{info.department_name}}</div>
                            <div class="grey-regular4 items"><div class="item-tit">职称</div>：{{info.profession_title}}</div>
                            <div v-if="info.profession_id == 4" class="grey-regular4 items"><div class="item-tit">年级</div>：{{info.grade_name}}</div>
                            <div v-else class="grey-regular4 items">任职年限：{{info.seniority_title}}</div>
                            <div class="grey-regular4 items"><div class="item-tit">批次</div>：
                              <div v-if="info.batchs">
                                  <p v-for="(t, i) in info.batchs" :key="i">{{info.organization_titles[i]}} <span class="item-batch">{{t}}</span></p>
                              </div>
                            </div>
                            <div style="margin-top: 30px" class="grey-regular4 items">注册时间：{{info.create_time}}</div>
                            <div class="grey-regular4 items">最后登录：{{info.last_time}}</div>

                            <div class="grey-regular4 items" style="margin-top: 30px">
                               <div class="item-tit">屏蔽</div>：  {{info.screen_num}}次
                            </div>
                            <div class="grey-regular4 items">
                                敏感词触发：{{info.hit_num}}次
                            </div>
                        </div>
                        <div v-if="info" class="info-right">
                            <img class="imgs" :src="info.head_img_url"/>
                            <Button v-if="isShowPer" @click="seeCertificate('profession_card')" class="cer-img" type="primary">查看职称证件</Button>
                            <Button v-if="isShowCer" class="cer-img" @click="seeCertificate('seniority_card')" type="primary">查看合格证证件</Button>
                        </div>
                    </div>
                </div>
                <div :style="setHeight()" class="students-right grey-medium1" v-if="info&&info.products&&info&&info.products.length>0">
                    <div class="titles grey-medium1">已购课程（{{info.products.length}}）</div>
                    <Divider class="lines" />
                    <div class="list">
                        <div v-for="(t, i) in info&&info.products" :key="i" class="item">
                            <img class="couse-mg" :src="t.imgs" />
                            <div class="couse-right">
                                <div class="grey-medium4 course-title">{{t.title}}</div>
                                <div class="couse-item grey-medium3" style="height: 14px">答题正确率：{{t.test_rate}}</div>
                                <Slider class="students-slider" v-model="t.test_rates" show-tip="never" :active-change="false" style="width: 100%" ></Slider>
                                <div class="couse-item grey-medium3" style="height: 14px">学习进度：{{t.rate}}</div>
                                <Slider class="students-slider" v-model="t.rates" show-tip="never" :active-change="false" style="width: 100%" ></Slider>
                                <div class="couse-item couse-type">
                                    购买方式：{{t.methods}} <span>| 购买时间：{{t.update_time}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="students-right no-data">
                    <div>暂无数据</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import female from '../../../assets/icons/icon/sex/female.png'
    import male from '../../../assets/icons/icon/sex/male.png'
    import authImg from '../../../assets/img/authentication.png'
    import SeeCer from './com/see-cer'
    export default {
        name: '',
        components: { SeeCer },
        data() {
            return {
                imgTitle: '',
                showCer: false,
                imgUrl: '',
                female, male, authImg,
                info: null,
                cerFiled: ''
            }
        },
        computed: {
            isShowPer(){
                return this.info&&(this.info.profession_id == 1 || this.info.profession_id == 2 || this.info.profession_id == 3)
            },
            isShowCer(){
                return this.info&&this.info.profession_id == 3&&this.info.is_have_certification == 1
            }
        },
        methods: {
            seeCertificate(filed){
                this.showCer = true
                this.imgUrl = this.info[filed]
                this.cerFiled = filed
                this.imgTitle = filed == 'profession_card' ? '职称证件' : '合格证证件'
            },
            closeCer(){
                this.showCer = false
            },
            setHeight(){
                let hei =  document.documentElement.clientHeight
                return `height: ${hei-100}px`
            },
            back(){
                this.$router.go(-1)
            },
            getData(){
                // 172
                PostData('user/getStudentDetailForAdmin', {id: +this.$route.query.id }).then((r) => {
                    if(r.res_code == 1) {
                        let d = {products: []}
                        d = r.data
                        d.batchs = d.batchs ? d.batchs.split(',') : ''
                        if(d.organization_titles) d.organization_titles = d.organization_titles.split(',')
                        if(d.products.length>0){
                            d.products.map((t) => {
                                let ms = {1: '微信', 5: '微信', 2: '支付宝', 6: '支付宝', 3: '免费', 4: '兑换' , 7: 'apple内购' }
                                t.rates = +t.rate.slice(0, t.rate.length - 1)
                                t.test_rates = +t.test_rate.slice(0, t.test_rate.length - 1)
                                if(t.url_arr.includes('{')){
                                    t.url_arr = JSON.parse(t.url_arr)
                                    t.imgs = t.url_arr.video_img ? t.url_arr.video_img : t.url_arr.default[0]
                                }else t.imgs = t.url_arr
                                t.methods = ms[t.method]
                            })
                        }
                        this.info = d
                    }
                })
            }
        },
        mounted(){
            this.getData()
        }
    }
</script>

<style lang="less" scoped>
    .course-title{
        height: 22px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
    }
    .students-slider{
        margin-top: 2px;
        /deep/ .ivu-slider-wrap{
            margin: 0;
        }
        /deep/.ivu-slider-button-wrap .ivu-tooltip {
            display: none;
        }
    }
    .see-students{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #f0f0f7;
        .head{
            width: 100%;
            height: 50px;
            position: relative;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            .back{
                position: absolute;
                left: 20px;
                padding-left: 10px;
                display: flex;
                align-items: center;
                .back-img {
                    width: 23px;
                    height: 19px;
                    padding-right: 6px;
                }
            }
        }
        .content{
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            .tit{
                height: 40px;
                width: 100%;
                line-height: 40px;
                padding-left: 30px;
                text-align: left;
            }
            .main{
                width: calc(100% - 40px);
                flex: 1;
                margin: 0 20px 10px 20px;
                display: flex;
                .titles{
                    height: 55px;
                    line-height: 55px;
                    text-align: left;
                }
                .lines{
                    margin: 0 !important;
                }
                .left{
                    width: 40%;
                    height: 100%;
                    background-color: #fff;
                    border-radius: 4px;
                    padding: 0 20px 20px 20px;
                    .info-head{
                        display: flex;
                        height: 100px;
                        width: 100%;
                        margin-top: 19px;
                        .infos{
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            .sex{
                                width: 14px;
                                height: 14px;
                            }
                            .ids{
                                font-family: Helvetica;
                                font-size: 14px;
                                color: #474C63;
                                height: 17px;
                            }
                            .auth-view{
                                margin-top: 31px;
                                display: flex;
                                align-items: center;
                                .auth{
                                    width: 18px;
                                    height: 16px;
                                    margin-left: 5px;
                                }
                            }
                        }
                        .info-right{
                            width: 120px;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                            .imgs{
                                width: 100px;
                                height: 100px;
                                border-radius: 50px;
                                margin-bottom: 20px;
                            }
                            .cer-img{
                                width: 120px;
                                font-size: 14px !important;
                                margin-top: 10px;
                            }
                        }
                    }
                    .items{
                        margin-top: 10px;
                        text-align: left;
                        display: flex;
                        .item-tit{
                            width: 55px;
                            letter-spacing: 27px;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        .item-batch{
                            margin-left: 20px;
                        }
                    }
                }
                .no-data{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .students-right{
                    margin-left: 10px;
                    width: calc(60% - 10px);
                    overflow-y: auto;
                    background-color: #fff;
                    border-radius: 4px;
                    padding: 0 20px 20px 20px;
                    .list{
                        margin-top: 19px;
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        min-height: 354px;
                        overflow-y: auto;
                        .item{
                            width: 100%;
                            height: 108px;
                            margin-bottom: 10px;
                            display: flex;
                            justify-content: flex-start;
                            .couse-mg{
                                width: 192px;
                                height: 108px;
                            }
                            .couse-right{
                                width: calc(100% - 192px);
                                display: flex;
                                flex-direction: column;
                                padding-left: 20px;
                                align-items: flex-start;
                                .couse-item{
                                    margin-top: 10px;
                                }
                                .couse-type{
                                    font-family: PingFangSC-Regular;
                                    font-size: 10px;
                                    color: #8489A1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
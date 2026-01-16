<template>
    <div style="height: 100%;">
        <div class="head">
            <div class="head-logo" @click="handleBack">
                <img :class="$logo.learn ? 'logo-img2' : 'logo-img'" :src='$logo.img'>
                <div v-if="!$logo.learn" class="logo-title">九划医教</div>
            </div>
            <div class="back" @click="back">
                <img class="back-img" src="../../../assets/icons/icon/back.png" alt="">
                <span class="back-tit">返回</span>
            </div>
        </div>
        <div class="content">
            <div class="content-left">
                <div class="left-title">
                    <Icon type="md-qr-scanner" size="54"/>
                    <div class="title-content">签到卡</div>
                </div>
                <div class="left-hint">使用“医学云课堂“APP扫码签到</div>
                <div class="left-img"></div>
                <div class="left-section">{{offlineCurriculums.title}}</div>
                <div class="left-box">
                    <div class="left-time">上课时间：{{offlineCurriculums.class_start_time}}</div>
                    <div class="left-time">上课地点：{{offlineCurriculums.class_address}}</div>
                </div>
                <div class="left-down">
                    <Icon type="md-arrow-down" color="#4098ff" size="18"/>
                    <div class="left-down-font">下载签到卡</div>
                </div>
            </div>
            <div class="content-right">
                <div class="left-title">
                    <Icon type="md-bookmarks" size="54"/>
                    <div class="title-content">签到名单</div>
                </div>
                <div class="left-hint">签到人数：<span style="color: #4098ff">{{sign_count}}</span>/{{all_count}}</div>
                <div class="right-content">
                    <div class="content-box" v-for="(item, index) in dataList" :key="index">
                        <img :src="item.head_img_url" alt="" style="height: 80px;width: 80px;border-radius: 100%">
                        <div>{{item.realname}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataList: [],
                all_count: 0,
                sign_count: 0,
                offlineCurriculums: {}
            }
        },
        methods: {
            back(){
                this.$router.go(-1)
            },
            handleBack() {
                this.$router.push('/dashboard/user-manage')
            },
            getList() {
                PostData('product/curriculum_offline/getStudentSignList', {curriculum_id: +this.$route.query.id}).then(res => {
                    if(res.res_code == 1) {
                        this.dataList = res.data.data
                        this.sign_count = res.data.sign_count
                        this.all_count = res.data.all_count
                    }
                })
            }
        },
        mounted() {
            this.getList()
            this.offlineCurriculums = JSON.parse(sessionStorage.getItem('signUp'))
        }
    }
</script>

<style scoped lang="less">
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
        height: calc(100% - 50px);
        background-color:#f0f0f7;
        padding: 20px;
        display: flex;

        .content-left{
            height: 100%;
            width: 38%;
            background-color:#fff;
            display: flex;
            flex-direction: column;
            align-items: center;

            .left-img{
                width: 350px;
                height: 350px;
                background: #F0F0F7;
                margin-top: 30px;
            }
            .left-section{
                margin-top: 30px;
                font-size: 28px;
                color: #474C63;
            }
            .left-box{
                text-align: left;
                margin-top: 20px;
            }
            .left-time{
                margin-bottom: 15px;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #474C63;
            }
            .left-down{
                display: flex;
                background: rgba(64,152,255,0.10);
                border-radius: 16px;
                height: 32px;
                align-items: center;
                width: 130px;
                justify-content: center;
                cursor: pointer;
                margin-top: 60px;

                .left-down-font{
                    font-size: 14px;
                    color: #4098FF;
                    margin-left: 4px;
                }
            }
        }
        .content-right{
            height: 100%;
            flex: 1;
            background-color:#fff;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .right-content{
                margin-top: 30px;
                border-top: 1px solid #D4D7E3;
                width: 78%;
                padding-top: 50px;
                display: flex;
                flex-wrap: wrap;
                height: calc(100% - 100px);
                overflow-y: auto;

                .content-box{
                    margin-right: 50px;
                    margin-bottom: 50px;

                    .box-img{
                        height: 80px;
                        width: 80px;
                        border-radius: 100%;
                    }
                    .box-name{
                        margin-top: 15px;
                        font-size: 18px;
                        color: #474C63;
                    }
                }
            }
        }
        .left-title{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 50px;

            .title-content{
                font-size: 42px;
                color: #474C63;
                margin-left: 20px;
            }
        }
        .left-hint{
            font-size: 24px;
            color: #474C63;
            margin-top: 40px;
        }
    }
</style>

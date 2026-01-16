<template>
    <div class="course-details">
        <div class="head">
            <div class="head-logo" @click="handleBack">
                <img :class="$logo.learn ? 'logo-img2' : 'logo-img'" :src='$logo.img'>
                <div v-if="!$logo.learn" class="logo-title">九划医教</div>
            </div>
            <div class="back" @click="back">
                <img class="back-img" src="../../assets/icons/icon/back.png" alt="">
                <span class="back-tit">返回</span>
            </div>
        </div>
        <div class="box">
            <div class="left">
                <div @click="tabs(i)" v-for="(t,i) in btns" :class="t[1]  ? 'act-item' : 'de-item'" :key="i" class="item">{{t[0]}}</div>
            </div>
            <div class="main" style="width: calc(100% - 160px)">
                <TablePane v-if="active == 1" :active="active" />
                <TablePane v-if="active == 2" :active="active" />
                <TablePane v-if="active == 3" :active="active" />
                <TablePane v-if="active == 4" :active="active" />
                <TablePane v-if="active == 5" :active="active" />
            </div>
        </div>
    </div>
</template>

<script>
    import TablePane from './com/tables-pane'
    export default {
        components: { TablePane },
        data() {
            return{
                active: 0,
                btns: [
                    ['学员学习进度详情', false],
                    ['线上课程进度详情', false],
                    ['线上作业完成详情', false],
                    ['在线直播完成详情', false],
                    ['线下培训完成详情', false]
                ],
            }
        },
        methods: {
            back(){
                this.$router.push({name: 'course-data', query: {id: this.$route.query.id, organization_id: this.$route.query.organization_id}})
            },
            handleBack() {
                this.$router.push('/dashboard/user-manage')
            },
            tabs(i, bool = false){
                this.active = i + 1
                this.btns.map((t, l) => {
                    t[1] = l === i
                })
                let q1 = {pane: this.active,id: this.$route.query.id, organization_id: this.$route.query.organization_id}
                let query = bool ? {brach_id: this.$route.query.brach_id, ...q1} : q1
                this.$router.push({name: 'course-details',query})
                this.$forceUpdate()
            }
        },
        mounted() {
            if(this.$route.query.pane) this.tabs(+this.$route.query.pane - 1, true)
        }
    }
</script>

<style scoped lang="less">
    .course-details{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
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
        .box{
            flex: 1;
            // background-color:#f0f0f7;
            width: 100%;
            overflow-y: auto;
            display: flex;
            .left{
                width: 160px;
                height: 100%;
                display: flex;
                flex-direction: column;
                padding-top: 30px;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
                z-index: 1001;
                .item{
                    height: 50px;
                    width: 100%;
                    line-height: 50px;
                    text-align: center;
                }
                .de-item{
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #474C63;
                    border-right: 5px solid rgba(64,152,255,0.10);
                }
                .act-item{
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #4098FF;
                    border-right: 5px solid #4098FF;
                }
            }
            .main{
                height: 100%;
                display: flex;
                flex-direction: column;
            }
        }
    }
</style>

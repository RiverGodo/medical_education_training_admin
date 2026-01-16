<template>
    <Row class="advertising-map">
        <Tabs v-model="tabName" @on-click="changeatub" class="tab-name">
            <TabPane label="官网首页" name="home">
                <HomeLb :show="show1" @close="close(1)" ref="HomePageBroadcast" />
            </TabPane>
            <TabPane label="官网课程页" name="Course">
                <CourseLb :show="show2" @close="close(2)" ref="CoursePageRotation" />
            </TabPane>
<!--            <TabPane label="移动首页" name="mobile-home">-->
<!--                <MobileHomeLb :show="show3" @close="close(3)" ref="MobileHomePageBroadcast" />-->
<!--            </TabPane>-->
<!--             <TabPane label="移动课程页" name="mobile-Course">-->
<!--                <MobileCourseLb :show="show4" @close="close(4)" ref="MobileCoursePageRotation" />-->
<!--            </TabPane>-->
        </Tabs>
        <Button class="add-advert" type="primary" @click="addLb">添加广告</Button>
    </Row>
</template>
<script>
      import HomeLb from './HomeLb.vue'
      import CourseLb from './CourseLb.vue'
      import MobileCourseLb from './MobileCourseLb.vue'
      import MobileHomeLb from './MobileHomeLb.vue'

    export default {
        name: "index",
        components:{ HomeLb, CourseLb, MobileCourseLb, MobileHomeLb },
        data(){
            return{
                tabName: 'home',
                show1: false,
                show2: false,
                show3: false,
                show4: false,
            }
        },
        methods: {
            close(i){
                this['show'+i] = false;
            },
            changeatub(name){
                sessionStorage.setItem('AdvertisingMap',name)
            },
            addatub(){
                switch(this.tabName) {
                    case 'home':
                    this.show1 = true
                    break;
                    case 'Course':
                    this.show2 = true
                    break;
                    // case 'mobile-home':
                    // this.show3 = true
                    // break;
                    // case 'mobile-Course':
                    // this.show4 = true
                    // break;
                }
            },
            addLb(){
                sessionStorage.setItem('AdvertisingData', '')
                this.$router.push({path: 'add-advertising-map'})
            }
        },
        mounted(){
            sessionStorage.setItem('AdvertisingMap', 'home')
            if(sessionStorage.getItem('AdvertisingMap')) this.tabName = sessionStorage.getItem('AdvertisingMap')
        }
    }
</script>

<style lang="less" scoped>
    .add-advert{
        width: 130px;
        height: 36px;
        background: #4098FF;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        position: absolute;
        top:12px;
        right: 18px;
    }
    .tab-name, /deep/.ivu-tabs-content, .advertising-map{
      height: 100% !important;
    }
    /deep/ .ivu-page{
        position: absolute;
        bottom: 60px;
        left: 0;
        right: 0;
        margin: 0 auto;
    }
    /deep/ .ivu-tabs-tab{
        width: 140px !important
    }
    /deep/.ivu-tabs-ink-bar{
        width: 100px !important;
        margin-left: 22px !important;
    }
</style>

<template>
 <div class="course-management">
    <screen :types="12" size-title1="管理课程" selectType2 :size-num1="list.length"  select2Placeholder="请选择课程"  :select2="selectList1" @selectChange2="selectChange2" />
    <div class="course-list" v-if="list.length>0">
        <!-- @click.native="rowClick(t, 'job-list')" -->
        <Card class="course-main" v-for="(t,i) in list" :key="i" @click.native="rowClick(t, 'job-list')">
            <div class="course-main-item">
               <div class="course-item-de">
                  <p class="font-regular3 text-ellipsis course-item-title">{{t.title}}</p>
                  <div class="item-right">
                      <p class="course-item"><span class="font-regular1" v-text="t.curr_finish_count"></span><span v-if="t.join_count||t.join_count==0" class="font-regular5">/{{t.join_count}}</span></p>
                      <p class="course-item"  :class="t.no_mark_count||t.no_score_count ? '' : 'course-item2'">
                          <span class="font-regular1" v-text="t.complete_hw_count"></span>
                          <span v-if="t.join_count||t.join_count==0" class="font-regular5">/{{t.join_count}}</span>
                      </p>
                      <!-- <p class="course-item"><span class="font-regular1">13</span><span class="font-regular5">/24</span></p> -->
                      <p class="course-item-p">
                          <span  v-if="t.no_mark_count"  class="item-badges"><span class="item-badge">{{t.no_mark_count}}</span><span>作业</span></span>
                          <span  v-if="t.no_score_count"  class="item-badges course-item-2" style="margin-top:10px" @click="rowClick(t, 'curriculum', 1)"><span class="item-badge">{{t.no_score_count}}</span><span>课程</span></span>
                      </p>
                  </div>
               </div>
               <div class="course-item-de course-item-de2">
                  <div class="course-item-title course-flex">
                      <span class="course-item-type" :class="t.curriculum_type">{{t.curriculum_name}}</span>
                      <p class="course-item-title2 text-ellipsis font-regular5">{{t.parent_title}}</p>
                  </div>
                  <div class="item-right item-right2">
                      <p class="course-item"><span class="font-regular5">结课学员</span></p>
                      <p class="course-item"><span class="font-regular5">完成作业</span></p>
                      <!-- <p class="course-item"><span class="font-regular5">问答总数</span></p> -->
                      <!-- <p><span class="item-badge">0</span><span>提问</span></p> -->
                  </div>
               </div>
            </div>
        </Card>
    </div>
 </div>
</template>

<script>
  import screen from '../../components/ScreenFrame.vue'
  import postData from '../../api/postData.js'
  import { async } from 'q';
  export default {
    components: { screen },
    data(){
        return{
            selectList1: [
                { id: 'all', title: '全部课程' },
                { id: 'online_self', title: '线上培训' },
                // { id: 'online_concentrate', title: '在线直播'},
                { id: 'offline_concentrate', title: '线下培训' },
            ],
            list: [],
            urlType: false
        }
    },
    beforeDestroy() {
        this.getList = null;
        this.rowClick = null;
        this.list = null;
    },
    methods: {
        selectChange2(v){
            let d = v == 'all' ? '' : v;
            this.getList(d)
        },
        rowClick(t, url, type){
            const data = {
                id: t.id,
                curriculum_type: t.curriculum_type,
                title: t.title,
                homework_count: t.homework_count
            }
            if(t.hasOwnProperty('homework_count')&&t.homework_count || t.curriculum_type=='offline_concentrate'&&t.no_score_count){
                if(type) this.urlType = true
                if(this.urlType&&type) this.$router.push({path: '/tutor/'+url, query: data})
                else if(!type&&!this.urlType) this.$router.push({path: '/tutor/'+url, query: data})
            }else if(t.curriculum_type=='offline_concentrate'&&!t.homework_count){
                this.$router.push({path: '/tutor/curriculum', query: data})
            }else{
                this.$router.push({path: '/tutor/job-list', query: data})
            }
        },
        getList(d){
            postData('tutor/getCurriculumList', {curriculum_type: d || ''}).then((res) => {
              if(res.res_code == 1)  this.list = res.data
              if(this.list.length>0){
                this.list.map((t) => {
                    this.selectList1.forEach((d) => {
                        if(t.curriculum_type == d.id) t.curriculum_name = d.title
                    })
                })
              }
            })
        }
    },
    mounted() {
        this.getList()
    }
  }
</script>
<style lang="less" scoped>
/deep/ .screen{
    box-shadow: 0 0 6px 0 rgba(117,124,157,0.10);
}
/deep/ .ivu-select-selection{
    background: #EEEEF6;
}
.course-management{
    height: 100%;
    .course-list{
        padding: 40px 120px 40px 40px;
        height: calc(100% - 66px);
        overflow: hidden;
        overflow-y: auto;
        .course-main{
            width: 100%;
            margin-bottom: 20px;
            .course-main-item{
                display: flex;
                flex-direction: column;
                .course-item-de2 {
                    margin-top: 10px;
                }
                .course-item-de{
                    display: inline-flex;
                    position: relative;
                    .course-item-title{
                        width: 43.9%;
                        text-align: left;
                        .online_self{
                           background: #ecf4f1;
                           color: #4098FF;
                        }
                        .offline_concentrate{
                           background: #fef5e7;
                           color: #FFA003;
                        }
                        .course-item-type{
                            padding: 0 7px;
                            border-radius: 18px;
                            font-family: PingFangSC-Medium;
                            font-size: 14px;
                            letter-spacing: 0.13px;
                            white-space: nowrap;
                        }
                        .course-item-title2{
                            margin-left: 10px;
                            text-align: left;
                        }
                    }
                   .course-flex{
                        display: inline-flex;
                    }
                    .item-right2, .course-item2{ margin-right: 76px; }
                    .item-right{
                        position: absolute;
                        right: 0;
                        display: inline-flex;
                        .course-item {
                            margin-left: 30px;
                            text-align: center;
                            width: 57px;
                        }
                        .course-item-p{
                            display: flex;
                            flex-direction: column;
                            height: 58px;
                            margin-top: 5px;
                            .item-badges{
                                display: inline-flex;
                                .item-badge{
                                    background: #F54802;
                                    font-family: PingFangSC-Medium;
                                    font-size: 14px;
                                    color: #FFFFFF;
                                    letter-spacing: 0.18px;
                                    border-radius: 18px;
                                    padding: 0 5px;
                                    margin-left: 24px;
                                    margin-right: 5px;
                                    height: 20px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
/deep/ .ivu-card-body{
    padding: 20px 18px;
}
.course-item-2{
    z-index: 3333;
    cursor: pointer;
    margin-top: 10px;
}
</style>

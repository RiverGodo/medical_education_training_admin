<template>
  <Modal v-model="show" :title="title" :width="590" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
     <div v-if="detailData.mechanismName">
         <div class="detail-data1">
             <img class="detail-data1-img" :src="detailData.img_url" />
             <div class="detail-data1-content">
                 <h1>{{detailData.mechanismName}}</h1>
                 <div class="detail-data1-text">
                     <div class="detail-data1-num1">
                         <p class="text1">{{detailData.tutor_count}}</p>
                         <p class="text2">导师人数</p>
                     </div>
                     <div class="detail-data1-num">
                         <p class="text1">{{detailData.student_count}}</p>
                         <p class="text2">学员总数</p>
                     </div>
                      <!-- <div class="detail-data1-num">
                         <p class="text1">{{detailData.num3}}</p>
                         <p class="text2">付费学员</p>
                     </div> -->
                      <div class="detail-data1-num">
                         <p class="text1">{{detailData.product_count}}</p>
                         <p class="text2">上线产品</p>
                     </div>
                 </div>
             </div>
         </div>
         <div class="mechanism-detail">
             <h1>机构介绍：</h1>
             <p>{{detailData.description}}</p>
         </div>
         <Divider />
     </div>
     <div :class="isMechanism ? 'personal-detail2' : 'personal-detail'">
          <div class="personal-detail-img-list">
            <img class="detail-data1-img" :src="detailData.head_img_url" />
            <img class="detail-data1-img-auth" v-if="detailData.authentication" src="../assets/icons/icon/authentication.png" />
            <div class="learning-statistics" v-if="detailData.learningStatistics">
                <img src="../assets/icons/icon/learning-statistics.png"/>
                <p>学习统计</p>
            </div>
          </div>
           <div class="detail-data1-content">
                 <h1>{{detailData.realname}} <img v-if="detailData.sex === 1 || detailData.sex === 0" :src="detailData.sex ? male: female" /></h1>
                 <p v-for="(t,i) in detailData.list" :key="i" class="personal-detail-text">{{t}}</p>
           </div>
     </div>
  </Modal>
</template>

<script>
import female from '../assets/icons/icon/sex/female.png'
import male from '../assets/icons/icon/sex/male.png'
export default {
    props:{
        title: {
          type: String,
          default: ''
        },
        showModal: {
            type: Boolean,
            default: false
        },
        detailData: {
          type: Object,
          default: () => {}
        }
    },
    data (){
        return{
            show: false,
            female,male
        }
    },
    computed: {
        isMechanism(){
            return this.detailData&&this.detailData.admin&&this.detailData.admin.length>0&&this.detailData.admin[0].role_id == 2
        }
    },
    watch:{
        showModal(_new){
            this.ModalState(_new)
        },
        detailData(_new){
          let list = _new.list;
          if(list.length>0){
            list.map((t,k) => {
                if(t.includes('状态')){
                let d = t.split(":")
                if(d[1] == 0) d[1]= " 未认证"
                if(d[1] == 1) d[1]= " 认证"
                list.splice(k,1,d.join(":"))
                }
            })
          }
          if (!_new.realname && _new.admin_id) _new.realname = _new.mechanismName + '管理员'
          this.formItem = _new
        }
    },
    methods: {
        closeModal(){
            this.show = false;
            this.$emit("close")
        },
        ModalState(_new){
            this.show = _new
        }
    }
}
</script>
<style lang="less" scoped>
.t{
    color: #474C63;
}
.f1{
    font-family: PingFangSC-Medium;
}
.f2{
    font-family: PingFangSC-Regular;
}
/deep/ .ivu-modal-header{background: #fff !important; padding: 0 !important;}
/deep/ .ivu-modal-close .ivu-icon-ios-close{ color:#9397AD !important; }
/deep/ .ivu-modal-header-inner{
    font-family: PingFangSC-Regular !important;
    font-size: 20px !important;
    color: #474C63 !important;
    height: 70px;
    line-height: 70px;
}
/deep/ .ivu-modal-body{
    padding: 40px;
}
.detail-data1 { display: flex; flex-wrap: nowrap; }
.detail-data1-img{
    width: 118px;
    height: 118px;
    border-radius: 100px;
}
.detail-data1-num1,.detail-data1-num{
    border-right: 1px solid #CDCED3;
    padding-right: 15px;
}
.detail-data1-num{
    padding-left: 15px;
}
.detail-data1-content{
    margin-left: 50px;
    display: flex;
    flex-direction: column;
    h1{
        .t;
        font-size: 20px;
        margin-bottom: 39px;
    }
    .detail-data1-text{
        display: flex;
        flex-direction: row;
        .detail-data1-num,.detail-data1-num1{
            .text1{
                .t;
                font-size: 20px;
            }
            .text2{
                .t;
                font-size: 13px;
            }
        }
    }
}
.mechanism-detail{
    margin-top: 39px;
    h1{
        line-height: 25px;
        .t;
        .f1;
        font-size: 16px;
    }
    p{
        font-size: 14px;
        line-height: 25px;
        .t;
        .f2;
    }
}
/deep/ .ivu-divider-horizontal{
    margin: 30px 0 40px 0;
}
.flexs{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    position: relative;
}
.personal-detail2{
    .flexs;
}
.personal-detail {
    .flexs;
    justify-content: center;
}
.personal-detail-text{
    font-size: 16px;
    margin-bottom: 10px;
    .t;
    .f2;
}
.detail-data1-img-auth{
    position: absolute;
    width: 28px;
    height: 28px;
    left: 157px;
    top: 92px;
}
.personal-detail-img-list{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.learning-statistics{
    width: 30px;
    height: 25px;
    margin-top: 20px;
    p{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #4098FF;
        white-space: nowrap;
    }
}
</style>

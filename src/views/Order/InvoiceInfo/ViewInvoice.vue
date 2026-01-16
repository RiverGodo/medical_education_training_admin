<template>
  <Modal v-model="show" :title="title" :width="590" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
     <div class="personal-detail">
            <div v-for="(t,i) in detailData.list" :key="i">
                <p v-if="showItem(i,t)" class="personal-detail-text">{{t}}</p>
                <div class="personal-detail-title" v-if="showTitle(i)" v-text="showTitle(i)"></div>
            </div>
     </div>
  </Modal>
</template>

<script>
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
        }
    },
    watch:{
        showModal(_new){
            this.ModalState(_new)
        },
        detailData(_new){
           this.detailData = _new
        }
    },
    methods: {
        closeModal(){
            this.show = false;
            this.$emit("close")
        },
        ModalState(_new){
            this.show = _new
        },
        showItem(i,t){
          let d = this.detailData;
          if(d.prop==0&&i>5) return false
          else if(d.prop==1) {
              if(i == 3 || i == 5) return false
          }
          return true
        },
        showTitle(i){
            let d = this.detailData
            if(i == 0) return '发票详情'
            if(i==d.list.length-6) return '接受方式'
            return ''
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
/deep/ .ivu-divider-horizontal{
    margin: 0 0 30px 0;
}
.personal-detail {
    position: relative;
    .personal-detail-text{
        font-size: 16px;
        margin-bottom: 20px;
        .t;
        .f2;
    }
    .personal-detail-title{
        font-size: 16px;
        margin-top: 40px;
        margin-bottom: 20px;
        .t;
        .f1;
    }
}
</style>

<template>
  <Modal v-model="show" :title="title" :width="590" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
     <div class="personal-detail">
         <div class="personal-head">
            <img :src="detailData.user_head_img_url"/>
            <div class="user">
                <p class="personal-detail-title">{{detailData.user_realname}}</p>
                <p class="user-username">{{detailData.user_username}}</p>
            </div>
            <div class="rights personal-detail-text">{{detailData.user_organization_title}}</div>
         </div>
         <p class="personal-detail-text">完成培训：{{detailData.product_title}}</p>
         <p class="personal-detail-text" personal-detail-text>获得证书：{{detailData.honour_name}}</p>
         <Divider />
         <p class="personal-detail-text">收件人：{{detailData.consignee}}</p>
         <p class="personal-detail-text">联系电话：{{detailData.phone}}</p>
         <p class="personal-detail-text">所在地区：{{detailData.address_code}}</p>
         <p class="personal-detail-text">详细地址：{{detailData.address_detail}}</p>
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
/deep/ .ivu-divider-horizontal{
    margin: 0 0 30px 0;
}
.personal-detail {
    position: relative;
    .personal-head{
        position: relative;
        display: flex;
        margin-bottom: 20px;
        img{
            width: 60px;
            height: 60px;
        }
        .rights{
            position: absolute;
            right: 20px;
        }
        .user{
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            .personal-detail-title{
                font-size: 20px;
                height: 20px;
                .t;
                .f1;
            }
            .user-username{
                font-size: 16px;
                height: 20px;
                margin-top: 10px;
                .t;
                .f2;
            }
        }
    }
    .personal-detail-text{
        font-size: 16px;
        height: 20px;
        margin-bottom: 20px;
        .t;
        .f2;
    }
}
/deep/ .ivu-divider-horizontal {
    margin: 30px 0;
}
</style>

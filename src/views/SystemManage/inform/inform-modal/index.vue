<template>
    <Modal v-model="show" :mask-closable="false" :footer-hide="true" @on-cancel="handleClose" :title="title" width="640">
        <div class="title">通知标题：{{message.title}}</div>
        <div class="item-tit">
            <span class="info-white-space">通知对象：</span>
            <div v-if="isSuper" style="width: auto;display:flex;"><span class="info-white-space">机构：</span>
                <p>{{message.organization_title&&message.organization_title!='-' ? message.organization_title : '全部'}}</p>
            </div>
            <div :class="isSuper ? 'item-objects' : 'info-white-space' " >认证状态：{{states[message.cert_state]}}</div>
            <div class="item-objects">用户身份：{{ids[message.identity]}}</div>
        </div>
        <div class="info-item-contents">通知内容：<div class="content" v-html="message.content"></div></div>
        <div class="send-time">通知时间：{{message.send_time}}</div>
    </Modal>
</template>

<script>
    export default {
        data() {
            return {
                show: false,
                states: ['未认证','已认证','全部'],
                ids: ['游客','学员','全部'],
            }
        },
        props: {  
            isShow: {
                type: Boolean
            },
            title: {
                type: String
            },
            message: {
                type: Object
            }
        },
        computed: {
            isSuper(){
                return this.$config.isRoleSuper()
            }
        },
        watch: {
            isShow(val) {
              this.show = val
            }
        },
        methods: {
            handleClose() {
                this.$emit('handleClose')
            }
        }
    }
</script>

<style scoped lang="less">
    .item-tit{
        margin: 20px 0;
        color: #333;
        display: flex;
        .item-objects{
            white-space: nowrap;
            margin-left: 30px;
        }
    }
    .info-white-space{
        white-space: nowrap;
    }
    .title{
        // font-size: 20px;
        color: #333;
        letter-spacing: 0;
        line-height: 28px;
    }
    .info-item-contents{
        display: flex;
        color: #333;
    }
    .send-time{
        // opacity: .5;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333;
        letter-spacing: .88px;
        // text-align: center;
        padding-bottom: 20px;
    }
    .content{
        padding-bottom: 20px;
    }
    /deep/ .ivu-modal-body{
        padding: 0px 50px;
    }
</style>
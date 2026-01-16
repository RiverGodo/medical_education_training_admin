<template>
    <div>
        <Modal v-model="show" :mask-closable="false" :footer-hide="true" @on-cancel="handleClose" :title="title" width="720">
            <div v-for="(item, index) in liveList" :key="index" class="box" :style="item.title == '学员口令1' ? 'border-bottom: 1px solid #ccc; padding-bottom: 26px;' : ''">
                <div class="box-title">{{item.title}}</div>
                <div class="box-content" v-if="item.a"><a :href="item.a" target="_Blank">{{item.a}}</a></div>
                <div class="box-content" v-else>{{item.content}}</div>
                <Button class="box-btn" @click="copyContent(item)">复制</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                show: false,
            }
        },
        props: {
            isShow: {
                type: Boolean
            },
            title: {
                type: String,
            },
            liveList: {
                type: Array
            },
        },
        watch: {
            isShow(val) {
                this.show = val
            }
        },
        methods: {
            handleClose() {
                this.show = false
                this.$emit('close-modal')
            },
            copyContent(val) {
                const input = document.createElement('input');
                document.body.appendChild(input);
                input.setAttribute('value', val.a ? val.a  : val.content);
                input.select();
                if (document.execCommand('copy')) {
                    document.execCommand('copy');
                    this.$Message.success('复制成功')
                }
                document.body.removeChild(input);
            }
        }
    }
</script>

<style scoped  lang="less">
    .box{
        display: flex;
        margin-top: 20px;
        align-items: center;

        .box-title{
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0.25px;
            text-align: right;
        }

        .box-content{
            margin-left: 10px;
            width: 460px;
            height: 42px;
            border: 1px solid #CDCED3;
            border-radius: 4px;
            display: flex;
            align-items: center;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0.25px;
            padding: 0  20px;
        }

        .box-btn{
            margin-left: 10px;
            background-color: #fff;
        }
    }
    /deep/ .ivu-modal-body{
        padding: 50px 50px 120px 50px;
    }
</style>
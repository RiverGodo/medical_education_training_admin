<template>
    <Modal v-model="show" :title="title" :mask-closable="false" :footer-hide="true" @on-cancel="cancelModal"
           :width="modalWidth" :styles="{top: state == 1 ? '10%' : '2%', minHeight: '400px'}">
        <div>
            <Input v-model="inputData"  class="input-textarea" type="textarea"
                   placeholder="请输入sayhi内容"/>
            <Button class="btn" type="primary" @click="handleSubmit">确定</Button>
        </div>
    </Modal>
</template>

<script>
    import screen from 'components/ScreenFrame'
    import tables from 'components/tables'
    import pageList from 'components/Page'
    import pageMixins from '../../../mixins/pageMixins'
    import deleteImg from 'assets/icons/img/deleteData.png'
    import postData from 'api/postData';

    export default {
        components: {screen, tables, pageList},
        mixins: [pageMixins],
        data() {
            return {
                show: false,
                inputData: '',
                deleteImg
            }
        },
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            state: {
                type: Number,
                default: 1
            },
            creat: {
                type: Boolean,
                default: true
            },
            message: {
                type: String
            },
            modalWidth: {
                type: Number,
                default: 600
            },
            isEditor: {
                type: Boolean
            },
            dataRow: {
                type: Object
            },
        },
        watch: {
            isShow(val) {
                this.show = val
                if(val && this.isEditor) {
                    this.inputData = this.dataRow.content
                }else{
                    this.inputData = ''
                }
            }
        },
        methods: {
            cancelModal(val) {
                this.inputData = ''
                this.$emit('handle-close')
            },
            handleSubmit() {
                if(!this.inputData){
                    this.$Message.info('请输入sayhi内容')
                    return
                }
                if(this.isEditor){
                    this.handleModifySayHi()
                }else{
                    this.handleAddSayHi()
                }
            },
            // 添加 sayhi
            handleAddSayHi(){
                let params = {
                    content:this.inputData
                }
                postData('pmsg/addSayHi', params).then(res=>{
                    if(res.res_code === 1){
                        this.$Message.success("添加成功")
                        this.cancelModal()
                        this.handleUpdateOuterDataList()
                    }else{
                        this.$Message.error("添加失败")
                    }
                })
            },
            // 修改sayhi
            handleModifySayHi(){
                 let params = {
                     id:this.dataRow.id,
                    content:this.inputData
                }
                postData('/pmsg/modifySayHi', params).then(res=>{
                    if(res.res_code === 1){
                        this.$Message.success("修改成功")
                        this.cancelModal()
                        this.handleUpdateOuterDataList()
                    }else{
                        this.$Message.error("修改失败")
                    }
                })
            },
            handleUpdateOuterDataList(){
                this.$emit("handle-update-list")
            }
        }
    }
</script>

<style scoped lang="less">
    .input-textarea {
        resize: none;
        padding: 10px;
        margin: 18px;
        width: calc(100% - 32px);

        /deep/ textarea.ivu-input {
            height: 400px;
            padding: 10px;
        }
    }

    /deep/ .ivu-btn {
        width: 150px;
        height: 38px;
    }

    /deep/ .ivu-modal-content {
        min-height: 400px;
        overflow-y: auto;
    }

    .message {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        line-height: 28px;
        padding-top: 20px;
        padding-bottom: 80px;
        border-bottom: 1px solid #F0F0F7;
        margin-bottom: 20px;
    }

    .message-num {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 0.22px;
    }

    .message-box {
        display: flex;
        flex-wrap: wrap;
        align-content: start;
        margin-top: 20px;
        margin-bottom: 43px;
        height: 400px;
        overflow-y: auto;
    }

    .message-info {
        text-align: center;
        margin-right: 15px;
        margin-bottom: 15px;

        .info-img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .info-name {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0.19px;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 66px;
            white-space: nowrap;
        }
    }

    .btn {
        margin: 20px auto;
    }

    /deep/ .ivu-page {
        height: 89px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 !important;
        border-left: 1px solid #F0F0F7;
        border-bottom: 1px solid #F0F0F7;
    }

    .select-student {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F0F0F7;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
    }

    .none-student {
        height: calc(100% - 50px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #9397AD;
        border: 1px solid #F0F0F7;
    }

    .change-student {
        display: flex;
        align-items: center;
        height: 48px;
        border-bottom: 1px solid #f0f0f7;
        justify-content: space-around;

        &:hover {
            .change-img {
                opacity: 1;
            }
        }
    }

    .change-name {
        width: 120px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .change-num {
        width: 120px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .change-img {
        width: 17.5px;
        height: 17.5px;
        opacity: 0;
        cursor: pointer;
    }

    /deep/ .ivu-table:before {
        width: 0;
    }

    /deep/ .ivu-table:after {
        width: 0;
    }

    /deep/ .ivu-table-wrapper {
        border-left: 1px solid #f0f0f7 !important;
        border-bottom: none !important;
    }

    /deep/ .ivu-modal-body {
        padding: 32px;
    }
    .page-border{
        height: 89px;
        border-bottom: 1px solid #f0f0f7;
        border-left: 1px solid #f0f0f7;
    }
</style>

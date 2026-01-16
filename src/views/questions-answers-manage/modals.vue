<template>
    <Modal class="distribution" :width="550" v-model="modal1" footer-hide @on-cancel="cancel">
        <div class="title">问答详情</div>
        <div class="main" v-if="info">
            <div class="head">
                <img class="imgs" :src="info.head_img_url" />
                <div class="user">
                    <p class="grey-medium5">{{info.realname}}</p>
                    <p class="ids">ID:{{info.username}}</p>
                </div>
                <div :class="isSssence ? 'act-sssence' : 'de-sssence'" class="sssence">
                    <Icon :color="isSssence ? '#FB4053' : '#ADB2CD'" :size="14" type="md-star" /> 精华
                </div>
            </div>
            <p class="grey-medium1">{{info.title}}</p>
            <div class="grey-regular4 details" v-html="info.detail"></div>
            <p class="times">{{info.create_time}}</p>
            <div v-if="myReply&&myReply.length>0&&!isEdit&&isReply">
                <p class="grey-medium5">我的回复</p>
                <Divider class="lines" />
            </div>
            <div v-if="isReply&&isEdit">
                <p  class="grey-medium5">我的回复</p>
                <Input v-model="reply" :rows="3" type="textarea" placeholder="请输入回答" class="reply" />
                <div class="btns">
                    <Button @click="clReplys" class="btn" type="primary">提交</Button>
                </div>
                <Divider class="lines" />
            </div>
        </div>
        <div v-if="isReply">
            <div v-for="(t,i) in myReply" :key="i" class="list">
            <img class="img" :src="t.head_img_url"/>
            <div class="content">
                <div class="name-view">
                    <div class="name grey-medium6">{{t.realname}}</div>
                    <div class="rights">
                        <div @click="deletes(t, i, true)" class="deletes">
                            <Icon color="#FB4053" :size="16" type="ios-trash" />
                            <span style="color: #FB4053; margin-right: 20px">删除</span>
                        </div>
                        <span>{{t.create_time}}</span>
                    </div>
                </div>
                <p class="grey-regular4 reply-details">{{t.answer}}</p>
            </div>
            </div>
        </div>
        <p class="grey-medium5 replys">{{isReply ? '其他回复' : '全部回复'}}（{{replyCount}}）</p>
        <div v-if="answersList&&answersList.length>0">
            <div v-for="(t,i) in answersList" :key="i+10000" class="list">
                <img class="img" :src="t.head_img_url"/>
                <div class="content">
                    <div class="name-view">
                        <div class="name grey-medium6">{{t.realname}}</div>
                        <div class="rights">
                            <div @click="deletes(t, i, false)" class="deletes">
                                <Icon color="#FB4053" :size="16" type="ios-trash" />
                                <span style="color: #FB4053; margin-right: 20px">删除</span>
                            </div>
                            <span>{{t.create_time}}</span>
                        </div>
                    </div>
                    <p class="grey-regular4 reply-details">{{t.answer}}</p>
                </div>
            </div>
        </div>
        <div class="no-reply" v-else>
            <img class="imgss" :src="noReply" />
            <p class="texts">暂无回复</p>
        </div>
    </Modal>
</template>

<script>
    import noReply from '../../assets/img/no-reply.png'
    export default {
        props: {
            show: Boolean,
            isReply: Boolean,
            questionId: {},
            isEdit: {
                type: Boolean,
                default: false
            },
        },
        watch: {
            show(_new){
                this.modal1 = _new
                if(_new) this.getData()
            },
        },
        computed: {
            isSssence(){
                return this.info&&this.info.state // true 精华
            },
            replyCount(){
                return this.answersList&&this.answersList.length>0 ? this.answersList.length : 0
            }
        },
        data() {
            return {
                noReply,
                answersList: null,
                info: null,
                reply: '',
                modal1: this.show,
                myReply: [
                    {user: '导师老王', desc: '探索基层全科医生人才培养长效机制，推动医联体、医共体建设以及提升基层全科医生临床能力，培养一支能看病、会看病的全科医生队伍。'}
                ],
            }
        },
        methods: {
            clReplys(){
                if(this.reply){
                    PostData('product/addAnswerByTeacher', {question_id: this.questionId, answer: this.reply}).then((r) => {
                        if(r.res_code == 1) {
                            this.reply = ''
                            this.getData()
                        }
                    })
                }else this.$Message.info('请输入回答')
            },
            getData(){
                PostData('product/getQADetail', {question_id: this.questionId}).then((r) => {
                    if(r.res_code == 1) {
                        this.info = r.data
                        if(this.$config.getRoleId() == 4){
                            this.myReply = r.data.answers.t_answers || []
                            this.answersList = r.data.answers.s_answers || []
                        }else this.answersList = [...r.data.answers.t_answers, ...r.data.answers.s_answers]
                    }
                })
            },
            deletes(t, i, type){
                PostData('product/removeAnswer', {answer_id: t.id}).then((r) => {
                    if(r.res_code == 1) {
                        if(type) this.myReply.splice(i, 1)
                        else this.answersList.splice(i, 1)
                    }
                })
            },
            cancel(){
                this.modal1 = false
                this.$emit('close')
            },
        }
    }
</script>

<style lang="less" scoped>
     .distribution{
        /deep/ .ivu-modal-body{
            padding: 0 0 30px 0
        }
        .no-reply{
            height: 180px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .imgss{
                margin-top: 30px;
                width: 60px;
                height: 60px;
            }
            .textss{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #ADB2CD;
            }
        }
        .title{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #474C63;
            width: 100%;
            text-align: center;
            padding: 16px 0;
            height: 56px;
            border-bottom: 1px solid #F0F0F7;
        }
        .main{
            padding: 0 30px 0 30px;
            .head{
                height: 79px;
                display: flex;
                align-items: center;
                width: 100%;
                .imgs{
                    width: 40px;
                    height: 40px;
                    border-radius: 20px
                }
                .user{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding-left: 10px;
                    .ids{
                        font-family: PingFangSC-Regular;
                        font-size: 12px;
                        color: #ADB2CD;
                        margin-top: 3px;
                    }
                }
                .sssence{
                    width: 60px;
                    height: 22px;
                    border-radius: 2px;
                    cursor: pointer;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .de-sssence{
                    border: 1px solid #C0C4DA;
                    color: #8489A1;
                }
                .act-sssence{
                    border: 1px solid #FB4053;
                    color: #FB4053;
                }
            }
            .details{
                margin: 10px 0;
                line-height: 22px;
            }
            .times{
                width: 100%;
                text-align: right;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #ADB2CD;
                margin-top: 10px;
                margin-bottom: 20px;
            }
            .reply{
                width: 490px;
                margin: 10px 0;
            }
            .btns{
                width: 100%;
                display: flex;
                justify-content: flex-end;
                .btn{
                    width: 60px;
                    height: 22px;
                    line-height: 22px;
                }
                /deep/ .ivu-btn > span{
                    font-size: 12px !important
                }
            }
            /deep/.ivu-divider-horizontal{
                margin: 10px 0 0 0;
            }
        }
        .list{
            display: flex;
            padding: 15px 30px 0 30px;
            .img{
                width: 25px;
                height: 25px;
                border-radius: 12.5px;
                margin-right: 8px;
            }
            .content{
                flex: 1;
                .name-view{
                    display: flex;
                    .name{
                        flex: 1;
                    }
                    .rights{
                        flex: 1;
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        .deletes{
                            display: none;
                        }
                    }
                }
                .reply-details{
                    padding-top: 10px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #F0F0F7;
                }
            }
            &:hover{
                background-color: #F0F0F7;
                .content>.name-view>.rights>.deletes{
                    display: inline-flex;
                    align-items: center;
                }
            }
        }
        .replys{
            margin: 20px 0 0 30px;
            padding-bottom: 10px;
            border-bottom: 1px solid #F0F0F7;
        }
    }
</style>
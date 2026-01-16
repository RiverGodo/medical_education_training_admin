<template>
        <Modal :transfer=false title="禁言设置" :footer-hide="true" v-model="showModal" @on-cancel="closeModal" size="auto" width="754" :mask-closable="false">
            <div>
                <p class="user" v-if='user'>用户名： {{user.realname}}<span class="user-text">用户ID： {{user.user_id}}</span></p>
                <Tables :tabel-height="300" :column="columns1" :table-data="list"/>
                <div class="barrage-view">
                    <span>弹幕</span>
                    <Switch @on-change="forbiddenSpeech" class="m-left" v-model="barrageStateBool">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </Switch>
                    <RadioGroup @on-change="forbiddenRadio" class="radio-groups" v-if="barrageStateBool" v-model="barrageState" style="min-width: 150px;">
                        <Radio :label="-1"> <span>永久禁言</span> </Radio>
                        <Radio :label="0"> <span>限时禁言</span> </Radio>
                    </RadioGroup>
                    <DatePicker :options="dateOptions" @on-ok="forbiddenSpeechTime" v-model="barrageTime" v-if="barrageStateBool&&barrageState==0" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" style="width: 220px!important"></DatePicker>
                    <span class="violation" v-if="barragelNum">违规次数{{barragelNum}}</span>
                </div>
                <div class="barrage-view">
                    <span>动态评论</span>
                    <Switch class="m-left" v-model="commentState" @on-change="showComment">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </Switch>
                    <RadioGroup class="radio-groups" v-if="commentState" v-model="commentForbiddenState" @on-change="handleSetForbiddenState"  style="min-width: 150px;">
                        <Radio :label="-1"> <span>永久禁言</span> </Radio>
                        <Radio :label="0"> <span>限时禁言</span> </Radio>
                    </RadioGroup>
                    <DatePicker :value="commentTime" @on-change="changeCommentForbiddenTime" v-if="commentForbiddenState === 0" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" style="width: 220px!important"></DatePicker>
                    <span class="violation" v-if="commentNum">违规次数{{commentNum}}</span>
                </div>
                <!-- <div class="barrage-view">
                    <span >私信</span>
                    <Switch class="m-left" :true-value="-1" :false-value="1" v-model="pmState"/>
                    <RadioGroup class="radio-groups" v-if="pmState === 0 || pmState === -1 " v-model="pmState" style="min-width: 150px;">
                        <Radio :label="-1"> <span>永久禁言</span> </Radio>
                        <Radio :label="0"> <span>限时禁言</span> </Radio>
                    </RadioGroup>
                    <DatePicker v-model="pmTime" type="datetime" v-if="pmState === 0" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" style="width: 220px!important"></DatePicker>
                    <span class="violation" v-if="pmNum">违规次数{{pmNum}}</span>
                </div> -->
            </div>
        </Modal>
</template>

<script>
    import Tables from '../../../components/tables.vue'
    export default {
        components: { Tables },
        props: {
            show: {},
            user: {}
        },
        data() {
            return {
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
                barrageStateBool: false,
                barrageTime: null,
                commentTime: null,
                pmTime: null,
                pmState: 0,
                barrageState: 0,
                commentState: false,
                pmNum: 0,
                commentNum: 0,
                barragelNum: 0,
                validity_term_state: 1,
                list: [],
                commentForbiddenState:1,
                showModal: false,
                columns1: [
                    {
                    title: '发布内容',
                    key: 'screen_content',
                    minWidth: 200,
                    align: 'left',
                    render: (h, params) => {
                        return h('span', params.row.screen_content)
                    }
                },
                {
                    title: '发布时间',
                    key: 'video_time',
                    align: 'left',
                    minWidth: 80
                },
                {
                    title: '类型',
                    key: '',
                    align: 'left',
                    minWidth: 80,
                    render: (h, params) => {
                        const obj = {barrage: '弹幕'}
                        return h('span', obj[params.row.type])
                    }
                },
                {
                    title: '状态',
                    key: 'state',
                    minWidth: 80,
                    filters: [
                        {
                            label: '正常',
                            value: 1
                        },
                        {
                            label: '已屏蔽',
                            value: 0
                        }
                    ],
                    filterRemote (value) {
                        this.$emit('tableSelect', 'state', value)
                    },
                    filterMultiple: false,
                    render: (h, params) => {
                        return h('span', params.row.state == 1 ? '正常' : '已屏蔽')
                    }
                }
                ]
            }
        },
        watch: {
            show(_new){
                this.showModal = _new
                if(_new) this.getList()
            }
        },
        methods: {
            showComment(val){
                if(!val){
                    // 将评论设置为正常
                    let params = {
                        student_id: this.user.user_id, 
                        forbidden_state: 1
                    }
                    PostData('/circle/forbiddenSpeech',params).then((res) => {
                        if(res) this.$Message.success('成功关闭动态评论');
                    })
                }
            },
            handleSetForbiddenState(state){
                // 限时
                if(state === 0){
                    this.forbiddenLimit()
                }
                // 永久
                if(state === -1){
                    if(this.commentTime){
                        this.forbiddenForever()
                    }
                    
                }
            },
            changeCommentForbiddenTime(time){
                this.commentTime = time
                this.forbiddenLimit()
            },
            // 永久
            forbiddenForever(){
                let params = {
                    student_id: this.user.user_id, 
                    forbidden_state: -1,
                }
                PostData('/circle/forbiddenSpeech',params).then((res) => {
                        if(res && res.res_code=== 1) this.$Message.success('设置成功');
                })
            },
            // 限时
            forbiddenLimit(){
                let params = {
                    student_id: this.user.user_id, 
                    forbidden_state: 0,
                    comment_forbidden_time:this.commentTime
                }
                PostData('/circle/forbiddenSpeech',params).then((res) => {
                        if(res && res.res_code=== 1) this.$Message.success('设置成功');
                })
            },
            closeModal(){
                this.showModal = false
                this.$emit('closeModal')
            },
            forbiddenSpeechTime(){
                if(this.barrageTime){
                    const d = {
                        barrage_forbidden_time: this.$config.formatTime2(this.barrageTime),
                        student_id: this.user.user_id, forbidden_state: 0
                    }
                    PostData('/product/forbiddenSpeech', d).then((res) => {
                        if(res) this.$Message.success('弹幕限时禁言成功');
                    })
                }else this.$Message.success('请选择时间');
            },
            forbiddenRadio(val){
                if(val === -1) this.forbiddenSpeech(-1)
            },
            forbiddenSpeech(val){
                const forbidden_state = val === -1 ? -1 : this.barrageStateBool ? -1 : 1
                const text = forbidden_state == 1 ? '成功关闭禁言' : '永久禁言成功'
                PostData('/product/forbiddenSpeech', {barrage_forbidden_time: null, student_id: this.user.user_id, forbidden_state}).then((res) => {
                    if(res) {
                        this.$Message.success(text);
                        this.barrageState = -1
                        this.barrageTime = null
                    }
                })
            },
            getList(){
                PostData('/product/getScreenList', {student_id: this.user.user_id}).then((res) => {
                    if(res){
                        // 1 关闭禁言 0 暂时 -1 永久禁言
                        this.list = res.data.data || []
                        this.barragelNum = res.data.barrage_illegal_num
                        this.commentNum = res.data.comment_illegal_num
                        this.pmNum = res.data.pm_illegal_num
                        this.commentState = res.data.comment_forbidden_state === 1 ? false : true
                        this.commentForbiddenState = res.data.comment_forbidden_state
                        this.barrageStateBool = (res.data.barrage_forbidden_state === 0 || res.data.barrage_forbidden_state === -1)
                        this.pmState = res.data.pm_forbidden_state
                        this.commentTime = res.data.comment_forbidden_time
                        this.pmTime = res.data.pm_forbidden_time
                        this.barrageTime = res.data.barrage_forbidden_time
                        this.barrageState = res.data.barrage_forbidden_state
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .barrage-view{
        display: flex;
        align-items: center;
        height: 50px;
        .m-left{
            margin-left: 10px;
        }
        .radio-groups{
            margin-left: 20px;
        }
        .violation{
            color: red;
            margin-left: 10px;
        }
    }
    .user{
        margin-bottom: 10px;
    }
    .user-text{
        margin-left: 10px;
    }
</style>
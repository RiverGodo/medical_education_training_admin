<template>
    <Modal v-model="isShow" :title="title" :styles="{top: '60px'}" :footer-hide="footerHide" :width="700" :mask-closable="false" @on-cancel="closeModal">
       <div v-if="type=='batch'" class="batch">
         <div class="batch-main" v-for="(m,k) in list" @click="Marking(m)" :class="k&&k%9 ? 'batch-marign' : ''" :key="k">
            <img class="batch-img" :class="m.clas" :src="m.head_img_url" />
            <img class="batch-icon" v-if="m.icon" :src="m.icon" />
            <span class="grey-regular3 batch-name">{{m.realname}}</span>
         </div>
        <div class="batch-type">
            <span class="grey-regular2">方式：</span>
            <RadioGroup v-model="modeRadio">
                <Radio :label="1"><span>单人批阅</span></Radio>
                <Radio :label="0"><span>统一批阅</span></Radio>
            </RadioGroup>
         </div>
       </div>
       <div v-else>
            <div v-if="type=='seeTask'" class="student-info">
                <img class="batch-img" v-if="studentInfo.length>0" :src="studentInfo[0].head_img_url" />
                <div class="student-name">
                     <div class="grey-medium1">
                         {{getName(studentInfo, 'realname')}}
                        <img v-if="studentInfo.length>0&&studentInfo[0].sex" src="../../../assets/img/female.png" />
                        <img v-else-if="studentInfo.length>0" src="../../../assets/img/male.png" />
                    </div>
                     <span class="grey-regular4">ID: {{getName(studentInfo, 'username')}}</span>
                </div>
            </div>
            <div v-for="(t,i) in list" :key="i" class="task-list">
                <p class="grey-regular1">{{t.title}}</p >
                <p class="job-details grey-regular2" v-html="t.description"></p >
                <down-loading type="viewJobAttachment" text="附件" v-if="t.downList && t.downList.length>0" :formData="t.downList"/>
                <div v-if="type=='seeTask'">
                    <div class="radio-type">
                        <span class="grey-regular2">批阅：</span>
                        <RadioGroup v-model="t.mark_state" >
                            <Radio :label="1" :disabled="handleDisable(t.tesk_state,i)"><span>通过</span></Radio>
                            <Radio :label="0" :disabled="handleDisable(t.tesk_state,i)"><span>不通过</span></Radio>
                        </RadioGroup>
                        <div v-if="t.mark_state">
                            <InputNumber class="marking-text" :max="100" :min="1" v-model="t.score"></InputNumber>
                            <span class="grey-regular2 branch">分（满分100）</span>
                        </div>
                    </div>
                    <Input v-if="!handleDisable(t.tesk_state,i)"  class="textarea" type="textarea" :rows="6" v-model="t.comment" placeholder="请输入评语"></Input>
                    <p class="grey-regular2 markings" v-else>批语: <span>{{t.comment}}</span></p>
                </div>
                <Divider v-if="i != (list.length-1)" />
            </div>
       </div>
       <div v-if="type !='subject'">
         <div v-if="type=='batch'">
            <div class="radio-type">
                <span class="grey-regular2">批阅：</span>
                <RadioGroup v-model="markingRadio">
                    <Radio :label="1"><span>通过</span></Radio>
                    <Radio :label="0"><span>不通过</span></Radio>
                </RadioGroup>
                <div v-if="markingRadio">
                    <InputNumber class="marking-text" :max="100" :min="1" v-model="score"></InputNumber>
                    <span class="grey-regular2 branch">分（满分100）</span>
                </div>
            </div>
            <Input class="textarea" type="textarea" :rows="6" v-model="comment" placeholder="请输入评语"></Input>
         </div>
       </div>
       <div slot="footer" v-if="showBtn" class="submission"><Button type="primary" @click="submission">提交</Button></div>
       <div v-if="!showBtn" class="footer-hide"></div>
    </Modal>
</template>

<script>
import DownLoading from '../../../components/DownLoading'
import postData from '../../../api/postData';
import pass from '../../../assets/img/pass.png'
import unpass from '../../../assets/img/unpass.png'
export default {
    components: { DownLoading },
    props: {
        show: {
            type: Boolean,
            required: false
        },
        title: { type: String },
        type: { type: String },
        details: {
            type: Array,
            default: []
        },
        studentInfo: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            isShow: false,
            list: [],
            haveReadList: [],
            modeRadio: 1,
            markingRadio: 1,
            score: 0,
            comment: '',
            markData: null,
            footerHide: false,
            showBtn: false
        }
    },
    watch: {
        details(_new){
            this.list = _new
            this.haveReadList = this.$config.copy(_new,[])
        },
        show(val) {
            this.isShow = val;
            if(val){
                this.handleFoot()
                if(Array.isArray(this.list)){
                    this.list.map(t => {
                        if(t.attachment_url){
                         let text = t.attachment_url
                         let attachment = text.includes('attachment_') ? text.replace(/attachment_/g, '') : text
                         let d = JSON.parse(attachment)
                         if(this.type == 'seeTask'){
                             t.description = t.answer
                             t.tesk_state = t.mark_state
                         }
                         if(this.type == 'batch'){
                            t.clas = ''
                            t.icon = ''
                         }
                         if(Array.isArray(d) && d.length > 0)  t.downList = d
                        }
                    });
                }
            }
        }
    },
    methods: {
        setShow(bool){
            this.footerHide = bool
            this.showBtn = !bool
        },
        handleFoot(){
            if(Array.isArray(this.list)&&this.list.length>0){
                if(this.type == 'seeTask'){
                    let d = this.$config.copy(this.list[this.list.length-1],{});
                    let bool = this.handleDisable(d.mark_state, this.list.length-1)
                    this.setShow(bool)
                }
            }
            if(this.type == 'batch') this.setShow(false)
            if(this.type == 'subject') this.setShow(true)
        },
        closeModal(val) {
            this.$emit('close-modal', val)
            this.isShow = val
        },
        getName(d,field){
            if(d.length>0){
                if(d[0].hasOwnProperty(field)) return d[0][field]
                return ''
            }
            return ''
        },
        handleDisable(bool, i){
            if((this.list.length - 1) != i) {
                return true
            }else {
                return bool == 2 ? false : true
            }
        },
        Marking(d){
            if(this.modeRadio) this.markData = d
            if(this.list.length>0){
                this.list.map((t) => {
                    t.clas = ''
                    if(t.id == d.id) t.clas = 'student-active'
                    this.$forceUpdate()
                })
            }
        },
        isHasOwnProperty(d){
            if(d&&d.hasOwnProperty('student_homework_answer_id')){
                if(d.student_homework_answer_id) return true
                return false
            }
            return false
        },
        isTrue(d){
            if(Array.isArray(d)){
                if(d.length>0)  return this.isHasOwnProperty(d[0])
                return false
            }else  return  this.isHasOwnProperty(d)
        },
        preservation(d, url, da){
            if(this.isTrue(da)) {
                postData(url,d).then((res) => {
                    if(res.res_code == 1){
                        this.$Message.success(res.msg)
                        this.markData = null
                        if(this.type == 'batch' || this.type == 'seeTask'){
                            this.$emit('preservation-success')
                        }
                        if(this.modeRadio&&this.type == 'batch'){
                            this.list.map((t,k) => {
                               if(t.id == d.student_homework_answer_id){
                                   t.mark_state = d.mark_state
                                   t.icon = this.markingRadio ? pass : unpass
                                   this.$forceUpdate()
                                   this.haveReadList.splice(k,1)
                                   this.comment = ''
                                   this.score = 0
                               }
                            })
                            if(this.haveReadList.length==0) this.closeModal(false)
                        }else this.closeModal(false)
                    }
                })
            }
        },
        submission(){
            let d = null, url = null;
            if(this.type == 'seeTask'){
                let list = this.list
                d = list[list.length-1];
                if(d) d.student_homework_answer_id = d.id
                url = 'product/homework/mark'
            }
            if(this.type == 'batch'){
                let data = { score: this.score, comment: this.comment, mark_state: this.markingRadio }
                if(this.modeRadio){
                    if(this.markData){
                        d = { student_homework_answer_id: this.markData.id, ...data }
                        url = 'product/homework/mark'
                        this.preservation(d, url, d)
                    }else this.$Message.warning('请选择学员')
                }else{
                    let da = []
                    if(this.list.length>0){
                        this.list.map((t,k) => {
                            if(t.mark_state == 2){
                                da[k] = { student_homework_answer_id: t.id, ...data }
                            }
                        })
                    }
                    d = {arr: da}
                    url = 'product/homework/mul_mark'
                    this.preservation(d, url, d.arr)
                }
            }else this.preservation(d, url, d)
        },
    }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-modal-header-inner{
    font-family: PingFangSC-Medium;
}
/deep/ .ivu-modal-footer{
    border: none;
    padding: 0 0 40px 0;
}
/deep/ .ivu-modal-body{
    padding: 19.8px 40px;
    height: 500px;
    overflow: hidden;
    overflow-y: auto;
}
.job-details{
    margin-top: 10px;
    letter-spacing: 1.14px;
    line-height: 26px;
}
.batch{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    .batch-type{
        width: inherit
    }
    .batch-marign{
        margin-left: 20px;
    }
    .batch-main{
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      position: relative;
      .batch-name{
          text-align: center;
      }
    }
}
.markings{
    margin-top: 20px;
}
.student-active{
    border: 3px solid #4098FF;
}
.batch-img{
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin-bottom: 6px;
}
/deep/ .ivu-radio-group-item{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #474C63;
}
/deep/ .ivu-radio-inner{
    width: 24px;
    height: 24px;
}
/deep/.ivu-radio-inner:after {
    width: 14px;
    height: 14px;
}
/deep/.ivu-radio-inner:after {
    position: absolute;
    left: 4px;
    top: 4px;
    border-radius: 8px;
}
.radio-type{
    margin-top: 30px;
    width: 100%;
    display: flex;
    line-height: 36px;
}
/deep/ .ivu-input-number{
    width: 80px !important
}
.submission{
    display: flex;
    justify-content: center;
    width: 100%
}
.marking-text{
    margin-left: 20px;
}
.branch{
    margin-left: 10px;
}
.textarea{
    margin-top: 30px;
}
/deep/.ivu-btn{
    width: 200px;
    margin-top: 20px;
}
.task-list{
    margin-top: 20px;
}
.student-info{
    display: inline-flex;
}
.student-name{
    margin-left: 10px;
    display: flex;
    flex-direction: column;
}
.batch-icon{
    width: 18px;
    height: 18px;
    position: absolute;
    top: 32px;
    left: 32px;
}
.footer-hide{
    height: 40px;
}
</style>

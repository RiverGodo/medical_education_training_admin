<template>
  <Modal v-model="showModal" :title="title" :width="700" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
    <div v-if="type=='See'">
        <div class="head">
            <img :src="info.user_avatar" />
            <div><p class="real grey-medium1">{{info.user_realname}}</p><p class="user grey-regular">{{info.username||info.user_username}}</p></div>
        </div>
    </div>
    <div v-if="type=='BatchScore'">
       <div  class="head grey-medium1">{{studentInfo.title}} <span class="studentInfo-type" v-text="studentInfo.type == 1 ? '讲座' : '实践'"></span></div>
    </div>
    <tables :tabel-height="tableHeight" :column="columns" :table-data="list" @select-tables="selectTables" @on-select-all="selectTablesAll"/>
    <div class="radio-type">
        <InputNumber class="marking-text" :max="100" :min="0" v-model="score"></InputNumber>
        <span class="grey-regular2 branch">分（满分100）</span>
    </div>
    <Button class="submission" type="primary" @click="submission">确定</Button>
  </Modal>
</template>

<script>
import female from '../../../assets/icons/icon/sex/female.png'
import male from '../../../assets/icons/icon/sex/male.png'
import Tables from '../../../components/tables'
import postData from '../../../api/postData';
export default {
    components: { Tables },
    props:{
        show: {
            type: Boolean,
            default: () => { false }
        },
        title: { type: String },
        type: { type: String },
        details: [Array, Object],
        studentInfo: {
            type: Object,
            default: {}
        },
        columns: {
            type: Array,
            default: []
        }
    },
    data (){
        return{
            female,male,
            showModal: false,
            list: [],
            info: {},
            score: 0,
            selectionList: [],
            tableHeight: 480,
        }
    },
    watch:{
        show(_new){
            this.showModal = _new
            if(_new){
                let d = this.details
                if(this.type == 'See'){
                    this.list = d.data
                    this.list.map((t) => {
                        if(!t.state) t._disabled = true
                    })
                    this.info = d.detail
                }
                if(this.type == 'BatchScore') this.list = d
            }
        }
    },
    methods: {
        closeModal(){
            this.showModal = false;
            this.$emit("close-modal");
            this.score = 0
            this.selectionList = []
        },
        selectTables(selection, row) {
            this.selectionList = selection
        },
        selectTablesAll(selection, row) {
            this.selectionList = selection
        },
        send(d,url){
            postData(url, d).then((res) => {
                if(res.res_code == 1) {
                    this.$Message.success('评分成功')
                    this.closeModal()
                    this.$emit('submission')
                }
            })
        },
        setDatas(filed){
            let da = [];
            this.selectionList.forEach((t) => {
                da.push(t[filed])
            })
            return da
        },
        submission(){
            if(this.selectionList.length>0&&(this.score || this.score === 0)){
                if(this.type == 'See'){
                    let d = {
                        student_id: this.studentInfo.user_id,
                        curriculum_ids: this.setDatas('curriculum_underline_id'), 
                        score: this.score
                    }
                    this.send(d, 'product/curriculum_offline_grade/grade_student')
                }
                if(this.type == 'BatchScore'){
                    let d = {
                        curriculum_id: this.studentInfo.id,
                        student_ids: this.setDatas('user_id'), 
                        score: this.score
                    }
                    this.send(d, 'product/curriculum_offline_grade/grade_curriculum')
                }
            }else{
              if(this.selectionList.length==0)  this.$Message.warning('请选择学员')
              else if(!this.score || this.score !== 0) this.$Message.warning('请输入评分')
            }
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-header-inner{
    font-family: PingFangSC-Medium;
}
/deep/.ivu-modal-body{
    padding: 0 0 40px 0
}
.studentInfo-type{
    margin-left: 40px;
}
.head{
    display: inline-flex;
    margin: 20px 40px;
    img{
        width: 80px;
        height: 80px;
        border-radius: 40px;
    }
    div{
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        justify-content: center;
        .user{
            margin-top: 10px;
        }
    }
}
/deep/ .ivu-input-number{
    width: 120px !important
}
.radio-type{
    margin-top: 30px;
    width: 100%;
    display: flex;
    line-height: 36px;
    .marking-text{
        margin-left: 40px;
    }
    .branch{
        margin-left: 10px;
    }
}
.submission{
    display: flex;
    justify-content: center;
    width: 120px;
    margin-left: calc(50% - 60px );
    margin-top: 20px;
}
</style>

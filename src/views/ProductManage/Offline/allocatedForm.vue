<template>
<div>        
    <div v-for="(t,i) in formList" :key="i" class="allocated-main">
        <div class="allocated-i grey-regular2">{{$config.addZero(i+1)}}</div>
        <div class="allocated-address grey-regular2"><div class="allocated-label">分配地址： </div><Input v-model="t.address"/></div>
        <div class="allocated-stu_num grey-regular2"><div class="allocated-label">分配人数： </div><Input @on-change="isIntegers(t.stu_num, i, t)" :precision="0" v-model="t.stu_num"/><span class="people">人</span></div>
        <div class="allocated-operation">
            <img v-if="i>0" @click="deletes(i)" src="../../../assets/img/allocated-delete.png"/>
            <img v-if="(i+1) == formList.length" :class="handleClass(i)" @click="add" src="../../../assets/img/allocated-add.png"/>
        </div>
    </div>
    <Button class="allocated-btn" @click="allocated" type="primary">确定</Button>
</div>
</template>

<script>
    import postData from '../../../api/postData'
    export default {
        props: {
            details: {
                type: Object,
                default: {}
            },
            states: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                formList: [ { stu_num: 0, address: this.details.class_address } ],
            }
        },
        mounted(){
            this.getAllocatedList()
        },
        methods: {
            handleClass(i){
              return i > 0 ? '' : 'add-left'
            },
            isAccordWith(n){
                let d = this.details.student_num;
                if(Number.isInteger(n)&&n>d) {
                    this.$Message.warning('输入的人数不能大于预约学员人数')
                    return false
                }return true
                return false
            },
            isIntegers(val, i, t){
                let n = 0
                if(!Number.isInteger(val)||!val){
                    n = val ? Number.parseInt(val) : 0;
                    this.$nextTick(() => {
                        this.formList[i].stu_num = n
                    })
                    this.isAccordWith(n)
                }else this.isAccordWith(val)
            },
            getAllocatedNum(){
                let n = 0
                if(this.formList.length>0){
                    this.formList.forEach((t) => {
                        if(Number.isInteger(t.stu_num)) n += t.stu_num
                    })
                }
                return n
            },
            add(){
              if(this.getAllocatedNum()>this.no_group_count)  this.$Message.warning('已分配完毕')
              else this.formList.push({stu_num: 0, address: this.details.class_address}) 
            },
            isValidate(){
                let n = [], addressList = [], text = '', text2 = '', num = 0
                if(this.formList.length>0){
                    this.formList.forEach((t) => {
                        if(Number.isInteger(t.stu_num)) {
                            n.push(t.stu_num)
                            num += t.stu_num
                        }
                        addressList.push(t.address)
                    })
                }
                if(n.includes(0)) text = '分配人数'
                if(addressList.includes('')) text2 = '分配地址'
                if(text || text2){
                    let t = '请输入' + text + (text&&text2 ? '以及' + text2 : text2)
                    this.$Message.warning(t)
                    return false
                }else if(num>this.details.student_num){
                     this.$Message.warning('分配的人数不能大于预约学员人数, 请删除多余的分配')
                    return false
                }else return true
            },
            allocated(){
                if(this.isValidate()){
                    let d = {
                        term_id: this.details.term_id,
                        groups: this.formList,
                        curr_id: this.details.id
                    }
                    postData('product/curriculum_offline_subject/splitGroup', d).then((res) => {
                        if(res.res_code==1){
                            this.$Message.success(res.msg)
                            $SplitGroupRefresh.$emit("SplitGroupRefresh")
                        }
                    })
                }
            },
            deletes(i){
               this.formList.splice(i, 1)
            },
            getAllocatedList(){
                let d = JSON.parse(sessionStorage.getItem('termData'))
                postData('product/curriculum_offline_subject/getGroups', { term_id: d.term_id, curr_id: this.details.id }).then((res) => {
                    if(res.res_code==1){
                      if(res.data.length>0)  this.formList = res.data
                      else this.formList = [{stu_num: 0, address: this.details.class_address}]
                    }
                })
            },
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ivu-modal-header-inner{
        font-family: PingFangSC-Medium;
    }
    /deep/ .ivu-modal-header{
        border: none;
    }
    .allocated-btn{
        width: 150px;
        margin-top: 14px;
        margin-left: calc(50% - 75px);
        color: #fff;
    }
    .allocated{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .allocated-label{
        width: 80px;
        white-space: nowrap;
        
    }
    /deep/ .ivu-input{
        height: 32px;
    }
    .allocated-main{
        display: inline-flex;
        height: 48px;
        line-height: 48px;
        width: 100%;
        border-bottom: 1px solid #F0F0F7;
        .allocated-i{
            flex: 1;
            .allocated;
        }
        .allocated-stu_num{
            flex: 4;
            margin-left: 30px;
            .allocated;
            .people{
                margin-left: 8.5px;
            }
        }
        .allocated-address{
            margin-left: 30px;
            flex: 7;
            .allocated;
        }
        .allocated-operation{
            width: 100px;
            margin-right: 10px;
            img{
                margin-left: 25px;
            }
            .add-left{
                margin-left: 70px;
            }
        }
    }
    /deep/ .ivu-modal-body{
        padding: 0;
        padding-bottom: 20px;
        img{
            margin-left: 25px;
            padding-top: 14px;
        }
    }
    .allocated-top{
        margin-top: 16px;
    }
    .unallocated{
        margin-left: 50px;
    }
    /deep/ .ivu-table:before, /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-table-wrapper{
        border: none
    }
    /deep/ .ivu-modal-content{
        padding: 10px 30px;
    }
    /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-table:before{
        display: none;
    }
    /deep/ .ivu-table-wrapper{
        border: none;
    }
    .tables{
        margin-top: 20px;
    }
</style>

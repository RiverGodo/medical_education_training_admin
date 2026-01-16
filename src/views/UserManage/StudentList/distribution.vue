<template>
     <Modal class="distribution" :width="500" v-model="modal1" footer-hide @on-cancel="cancel">
        <div class="title">分配批次</div>
        <div class="tit2">一个学员只能进入一个批次，已分配的学员再次分配将覆盖上一次记录</div>
        <div class="contents">
             <Input @on-change="serachs" v-model="batchs" class="input" suffix="ios-search" placeholder="搜索批次名称" style="width: auto" />
             <Button @click="add" class="btn">新建批次</Button>
        </div>
        <div class="list">
            <div v-for="(t,i) in distribution" :key="i" class="item">
                <Icon v-if="!t.isAdd" style="line-height: 36px" :class="t.active ? 'act-icon' : 'de-icon'" :size="20" @click="selItem(t,i)" :type="t.active ? 'ios-radio-button-on': 'ios-radio-button-off'" />
                <div v-if="!t.edit" class="item-tit"  @click="edit(t,i)">{{t.batch}}</div>
                <Input @on-blur="changeTit(t,i)" v-else class="item-inpiut" v-model="t.batch" placeholder="请输入新建批次名称"/>
                <span v-if="t.isAdd" @click="confirm(t, i)" class="item-btn">保存</span>
                <span v-if="!t.isAdd" @click="confirmDistribution(t, i)" class="item-btn">确认分配</span>
                <span v-if="!t.isAdd" class="item-1">|</span>
                <span v-if="!t.isAdd" @click="deletes(t, i)" class="item-btn">删除</span>
            </div>
        </div>
        <Page @on-change="changePane" :page-size="pageSize" :current="current" :total="total" size="small" />
    </Modal>
</template>
<script>
    export default {
        props: {
            show: Boolean,
            list: Array,
            organizationId: {}
        },
        data() {
            return {
                batchs: '',
                pageSize: 12,
                total: 0,
                current: 1,
                contentEditable: false,
                modal1: this.show,
                actveItem: null,
                distribution: [
                    // {batch: '浙江医院全科第五批', active: false, edit: false, isAdd: false },
                ]
            }
        },
        watch: {
            show(_new){
                this.modal1 = _new
                if(_new) this.getList()
            },
        },
        methods: {
            serachs(){
                this.current = 1
                this.getList()
            },
            getList(){
                let d = {
                    organization_id: this.organizationId, 
                    batch: this.batchs, 
                    page_size: this.pageSize,
                    page_num: this.current,
                }
                PostData('user/getBatchList', d).then((r) => {
                    if(r.res_code == 1){
                        let d = r.data.data
                        if(d&&d.length>0){
                            d.map((t) => {
                                t.active = false
                                t.edit = false
                                t.isAdd = false
                            })
                        }
                        this.distribution = d
                    }
                })
            },
            confirmDistribution(t, i){
                if(this.list&&this.list.length>0){
                    let student_ids = [];
                    this.list.map((t) => {
                        student_ids.push(t.id)
                    })
                    let d ={ 
                        student_ids, 
                        batch_id: t.id,
                        organization_id: this.organizationId, 
                    }
                    PostData('/user/batchStudents', d).then((r) => {
                        if(r.res_code == 1){
                            this.$Message.info(r.msg);
                            this.modal1 = false
                            this.$emit('batchStudents')
                        }
                    })
                }
            },
            confirm(t, i){
                let d = {organization_id: this.organizationId, batch: t.batch}
                PostData('/user/addBatch', d).then((r) => {
                    if(r.res_code == 1){
                        // this.distribution[i].isAdd = false
                        this.getList()
                    }else this.distribution[i].batch = ''
                })
            },
            deletes(t, i){
                this.$config.deleteModal(() => {
                    PostData('user/removeBatch', {id: t.id}).then((r) => {
                        if(r.res_code == 1){
                            this.distribution.splice(i,1)
                        }
                    })
                }, '确定要删除该批次？')
            },
            add(){
               this.distribution.unshift({batch: '', active: false, edit: true, isAdd: true}) 
            },
            selItem(t,i){
                this.actveItem = t;
                this.distribution.map((it, l) => {
                    if(i == l) it.active = true
                    else it.active = false
                })
            },
            edit(t, i, text){
                this.distribution.map((it, l) => {
                    if(i == l) it.edit = true
                    else if(it.batch) it.edit = false
                })
            },
            changeTit(t,i){
                if(t.edit&&!t.isAdd){
                    let d = {organization_id: this.organizationId, batch: t.batch,id: t.id}
                    PostData('/user/modifyBatch', d).then((r) => {
                        if(r.res_code == 1){
                            this.distribution[i].isAdd = false
                        }
                    })
                }
            },
            cancel(){
                this.modal1 = false
                this.$emit('closeDistribution')
            },
            changePane(val){
                this.current = val
                this.getList()
            }
        },
    }
</script>

<style lang="less" scoped>
    .distribution{
        /deep/ .ivu-modal-body{
            padding: 0 0 15px 0
        }
        .title{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #474C63;
            width: 100%;
            text-align: center;
            padding: 16px 0;
            height: 56px;
        }
        .tit2{
            background: #F0F0F7;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #8489A1;
            height: 40px;
            width: 100%;
            text-align: center;
            background: #F0F0F7;
            line-height: 40px;
        }
        .contents{
            width: 100%;
            height: 58px;
            display: flex;
            padding: 15px 40px;
            .input{
                width: 300px;
                height: 28px;
                /deep/ .ivu-input-suffix i{
                    line-height: 28px !important;
                }
                /deep/ .ivu-input{
                    width: 300px;
                    height: 28px;
                    border-radius: 4px !important;
                }
            }
            .btn{
                margin-left: 20px;
                width: 100px;
                height: 28px;
                background: #fff;
            }
        }
        .list{
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 432px;
            margin-bottom: 15px;
            .item{
                display: flex;
                width: 100%;
                background: #FFFFFF;
                border: 1px solid #F0F0F7;
                height: 36px;
                line-height: 36px;
                padding: 0 40px;
                .item-tit{
                    margin-left: 20px; 
                    flex: 1;
                    box-shadow: none !important;
                    outline: none;
                    font-size: 14px
                }
                .item-inpiut{
                    margin-left: 20px; 
                    flex: 1;
                    /deep/.ivu-input{
                        padding: 0;
                        border: none;
                        height: 34px
                    }
                }
                .act-icon{
                    color: #4098FF
                }
                .de-icon{
                    color: #C0C4DA
                }
                /deep/ .ivu-radio{
                    line-height: 36px
                }
                .item-btn{
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #4098FF;
                    cursor: pointer;
                }
                .item-1{
                    margin: 0 10px;
                    color: #D4D7E3;
                }
            }
        }
    }
</style>
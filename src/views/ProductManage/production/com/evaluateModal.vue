<template>
    <Modal v-model="show" title="编辑产品评价" @on-cancel="handleCancel" :footer-hide="true">
        <div style="width: 500px;height: 472px;overflowY:auto">
            <div style="height:30px">
                <span class="right-text" @click="addOneEvaluate">添加评价</span>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center">
                <div v-for="(item, index) in trainList" :key="index" style="margin-top: 20px;">
                    <span style="width: 22px;font-size: 15px;margin-right: 5px;display: inline-block">{{index + 1}}、</span>
                    <Input v-model="item.evaluate_content" style="width: 410px;"/>
                    <span v-if="index!=0" style="color:#2d8cf0;cursor:pointer" @click="deleteOneEvaluate(index)">删除</span>
                    <span v-else style="color:#fff;">删除</span>
                </div>
            </div>
        </div>
        <div style="display: flex;justify-content: center">
            <Button type="primary" style="width: 130px;margin-top: 30px;" @click="handleSubmit">保存</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        data() {
            return {
                show: false,
                trainList: [
                    {evaluate_content: ''},
                ],
                courseRadioList: [
                    {title: '优秀', id: 1},
                    {title: '良好', id: 2},
                    {title: '一般', id: 3},
                    {title: '差', id: 4},
                ],
                courseRadio: '',
                trainRadio: '',
            }
        },
        props: {
            isShow: Boolean,
            product_evaluate: Array,
        },
        watch: {
            isShow(val) {
                this.show = val
            },
            product_evaluate(val) {
                this.trainList = val.length>0 ? val : this.trainList
            }
        },
        methods: {
            addOneEvaluate(){
                this.trainList.push({
                    evaluate_content:""
                })
            },
            deleteOneEvaluate(index){
                this.trainList.splice(index,1)
            },
            handleCancel() {
                this.$emit('handle-cancel')
            },
            handleSubmit() {
                this.trainList.map((item, index) => {
                    item.evaluate_index = index + 1
                    item.type = 1
                })
                this.$emit('evaluateSave', this.trainList)
            }
        },
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-tabs-tab{
        font-size: 16px;
    }
    .right-text{
        float:right;color:#2d8cf0;cursor:pointer;
        margin-right: 16px;
    }
</style>

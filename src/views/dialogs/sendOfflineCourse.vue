<template>
    <Modal title="发送学期" :transfer=false :width=700 :show-close="false" v-model="sendOfflineCourse"
           @on-cancel="handleRemoveModal(remove)" :mask-closable="false" :footer-hide="true">
        <base-input @closedialog="handleClose">
            <Row slot="header" class='search-bar' type='flex' justify='center' align='middle'>
                <Select @on-change="batchChange" v-model="batchVal" style="width: 200px;margin-left: 20px;">
                    <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batch }}</Option>
                </Select>
                <Select @on-change="searchStudent" v-model="searchType" placeholder="请选择" style="width: 200px;margin-left: 15px;">
                    <!-- <Option label="用户名" value="username"></Option> -->
                    <Option label="姓名" value="realname"></Option>
                    <Option label="手机号" value="phone"></Option>
                </Select>
                <Input prefix="ios-search" placeholder="搜索姓名/手机号" v-model="searchData" @on-change="searchStudent"
                       style="width: 230px;margin-left: 15px;">
                    <!-- <Button slot="append" type='text' @click='searchStudent'>搜索</Button> -->
                </Input>
            </Row>
            <Row slot="body">
                <Table :height="578" class="table" ref="table" :data="queryOfflineUserList"
                       @on-select-all="handleSelectedAll"
                       :columns="courseColumns" style="width: 100%" @on-selection-change="handleSelectionChange">
                </Table>
                <Row class="course-page">
                    <Page @on-change="handleCurrentChange" :current="pageIndex" :page-size="pageSize"
                          :total="totalNum"></Page>
                </Row>
                <Row class="btns">
                    <Button class="send-btn" @click="handleSendTask">发送</Button>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>
<script>

    import BaseInput from '../../components/BaseInput'
    import UploadPanel from '../../components/UploadPanel'
    import {RemoveModal} from './mixins'
    import {send_student_offline_curriculum} from '../../api/modules/tools_student'

    let tooltips = {ellipsis: true, tooltip: true}

    export default {
        mixins: [RemoveModal],
        props: {
            remove: {
                type: String
            },
            payload: {}
        },
        components: {'base-input': BaseInput, 'upload-panel': UploadPanel},
        data() {
            return {
                batchVal: 'all',
                batchList: [ {batch: '全部学员', id: 'all'} ],
                sendOfflineCourse: true,
                multipleSelection: [],
                searchType: 'phone',
                searchData: '',
                curPage: 1,
                checked: false,
                changeList: [],
                courseColumns: [
                    {
                        title: '用户名',
                        key: 'username',
                        ...tooltips
                    },
                    {
                        title: '姓名',
                        key: 'realname',
                        ...tooltips
                    },
                    {
                        title: '手机号',
                        key: 'phone',
                        ...tooltips
                    },
                    {
                        title: '科室',
                        key: 'department_name'
                    },
                    {
                        title: '班级',
                        key: 'grade_name',
                    },
                    {
                        type: 'selection'
                    }
                ],
                pageSize: 12,
                pageIndex: 1,
            }
        },
        computed: {
            queryOfflineUserList() {
                return this.$store.state.offline_curriculum.offline_term_student
            },
            // pageSize() {
            //   return this.$store.state.offline_curriculum.page_size
            // },
            // pageIndex() {
            //   return this.$store.state.offline_curriculum.page_index
            // },
            originalList() {
                let data = []
                this.$store.state.offline_curriculum.offline_term_student.forEach(item => {
                    if(item._checked) data.push(item.student_id)
                })
                return data
            },
            allList() {
                let data = []
                this.$store.state.offline_curriculum.offline_term_student.forEach(item => {
                    data.push(item.student_id)
                })
                return data
            },
            totalNum() {
                return this.$store.state.offline_curriculum.total_num
            }
        },
        mounted() {
            this.handleQueryList();
            this.getBatchList()
        },
        created() {
            console.log(this.originalList);
        },
        methods: {
            batchChange(val){
                this.batchVal = val
                this.searchStudent()
            },
            getBatchList(){
                let d = {
                    organization_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).organization_id,
                    batch: '', 
                    page_size: 9999,
                    page_num: 1,
                    batch_id: this.batchVal
                }
                PostData('user/getBatchList', d).then((r) => {
                    if(r.res_code == 1){
                        let da = r.data.data
                        this.batchList = [{batch: '全部学员', id: 'all'}, ...da]
                    }
                })
            },
            handleTableToName(d, v) {
                var name = ''
                d.map(item => {
                    if (item.id == v) name = item.name
                })
                return name;
            },
            handleQueryList() {
                this.$store.dispatch('get_students_by_offline_term', {
                    product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
                    term_id: this.payload.row.id,
                    page_num: this.pageIndex,
                    page_size: this.pageSize,
                    batch_id: this.batchVal == 'all' ? '' : this.batchVal
                })
            },
            handleSelectedAll(val) {
                let data = []
                val.forEach(item => {
                    data.push(item.student_id)
                    if(this.originalList.indexOf(item.student_id) == -1 && this.changeList.indexOf(item.student_id) == -1) {
                        this.changeList.push(item.student_id)
                    }
                })
                this.allList.forEach((item, index) => {
                    if(data.indexOf(item) == -1 && this.changeList.indexOf(item) != -1) {
                        var num_index
                        this.changeList.findIndex((num, index) => {if(num == item) num_index = index})
                        this.changeList.splice(num_index, 1)
                    }
                })
            },
            handleClose() {
                this.sendOfflineCourse = false;
            },
            handleSelectionChange(val) {
                let data = []
                val.forEach(item => {
                    data.push(item.student_id)
                    if(this.originalList.indexOf(item.student_id) == -1 && this.changeList.indexOf(item.student_id) == -1) {
                        this.changeList.push(item.student_id)
                    }
                })
                this.allList.forEach((item, index) => {
                    if(data.indexOf(item) == -1 && this.changeList.indexOf(item) != -1) {
                        var num_index
                        this.changeList.findIndex((num, index) => {if(num == item) num_index = index})
                        this.changeList.splice(num_index, 1)
                    }
                })
            },
            handleCurrentChange(val) {
                this.pageIndex = val
                this.$store.dispatch('get_students_by_offline_term', {
                    product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
                    term_id: this.payload.row.id,
                    page_num: this.pageIndex,
                    page_size: this.pageSize,
                })
            },
            handleSendTask() {
                if (this.changeList.length > 0) {
                    send_student_offline_curriculum({
                        term_id: this.payload.row.id,
                        term_underline_id: this.payload.row.id,
                        student_id_arr: JSON.stringify(this.changeList)
                    }).then(res => {
                        if (res.data.res_code == 1) {
                            this.$Message.success('线下课发送成功!');
                            this.handleQueryList();
                            this.handleClose()
                        }else{
                            this.$Message.warning(res.data.msg);
                        }
                    })
                } else {
                    this.$Message.warning('请选择要发送线下课的学生!');
                }
            },
            searchStudent() {
                this.pageIndex = 1
                let d = {
                    subject_id: JSON.parse(sessionStorage.getItem('OffLineClassTheme')).id,
                    product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
                    term_id: this.payload.row.id,
                    page_num: this.pageIndex,
                    page_size: this.pageSize,
                    type: this.searchType,
                    search: this.searchData,
                    batch_id: this.batchVal == 'all' ? '' : this.batchVal
                }
                console.log(d,'ddd')
                this.$store.dispatch('get_students_by_offline_term', d)
            }
        }
    }
</script>
<style lang="less" scoped>
    /deep/ th, /deep/ .ivu-table-cell > span {
        font-size: 14px !important
    }

    /deep/ .ivu-table th {
        height: 50px;
    }

    /deep/ .ivu-tooltip-rel > span {
        font-size: 14px !important
    }

    /deep/ .send-btn {
        background: #3DAAFF;
        border: 1px solid #3DAAFF;
        border-radius: 4px;
        width: 200px;
        height: 36px;
        border: none;
        outline: none;
        color: #fff;
    }

    /deep/ .ivu-input-group-prepend {
        width: 20%
    }

    /deep/ .ivu-modal-header {
        background-color: #ffffff !important;
        padding: 22px 16px;
    }

    /deep/ .ivu-modal-header-inner {
        font-family: PingFangSC-Regular;
        font-size: 20px !important;
        color: #474C63 !important;
        letter-spacing: 0;
    }

    /deep/ .ivu-modal-close .ivu-icon-ios-close {
        color: #9397AD !important;
        font-size: 42px !important;
    }

    /deep/ .ivu-form-item {
        margin-bottom: 15px;
    }

    .btns {
        padding: 40px 0;
        display: flex;
        justify-content: center;

        .send-btn {
            background: #3DAAFF;
            border: 1px solid #3DAAFF;
            border-radius: 4px;
            width: 200px;
            height: 36px;
            border: none;
            outline: none;
            color: #fff;
        }
    }

    .course-page {
        margin-top: 20px;
    }

    /deep/ .ivu-modal-body {
        padding: 0
    }

    .search-bar {
        height: 60px;
        background: #F0F0F7;
        width: 100%;
        display: flex;
        justify-content: left;
    }

    /deep/ .ivu-select-selection {
        border-radius: 100px;
        padding: 0 10px;
    }

    /deep/ .ivu-input {
        border-radius: 100px !important;
    }
</style>

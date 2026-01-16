<template>
    <Modal v-model="show" :title="title" :mask-closable="false" :footer-hide="true" @on-cancel="cancelModal"
           :width="modalWidth" :styles="{top: state == 1 ? '10%' : '2%', minHeight: '400px'}">
        <div v-if="creat">
            <Input v-model="inputData" v-show="state == 1" class="input-textarea" type="textarea"
                   placeholder="请输入私信内容"/>
            <div v-show="state == 2">
                <screen @resetPage="resetPage" isBatch @batchChange="batchChange" :types="14" :selectType1="true" :selectType2="true" :valueSelect2="valueSelect2"
                        :placehodle="placehodle" :select2Placeholder="select2Placeholder" :select2="select2"
                        @inputChange="inputChange" @selectChange1="selectChange1" @selectChange2="selectChange2"/>
                <Row style="height: 650px;">
                    <Col :span="14">
                        <tables :column="columns1" :table-data="list" :select-index="selectIndex"
                                :delete-data="deleteList" :tabel-height="tableHeight" @select-tables="selectTable"
                                @on-select-all="selectAllTable"/>
                        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
                        <div v-if="total<pageSize || total==pageSize" class="page-border"></div>
                    </Col>
                    <Col :span="10" style="height: 619px;border: 1px solid #f0f0f7;">
                        <div class="select-student">已选学员</div>
                        <div v-if="studentList.length == 0" class="none-student">暂未选择学员</div>
                        <div v-else style="height: 560px;">
                            <div style="height: 480px; overflow-y: auto">
                                <div class="change-student" v-for="(item, index) in studentList" :key="index">
                                    <div class="change-name">{{item.realname}}</div>
                                    <div class="change-num">{{item.username}}</div>
                                    <img class="change-img" @click="deleteStudent(item, index)" :src="deleteImg" alt="">
                                </div>
                            </div>
                            <div style="height: 88px;border-bottom:1px solid #f0f0f7;display: flex;align-items: center;justify-content: center">
                                <Button type="primary" @click="submit">发送</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <Button v-if="state == 1 " class="btn" type="primary" @click="handleSubmit">下一步</Button>
        </div>
        <div v-if="!creat && personMessage.content">
            <div class="message">{{personMessage.content}}</div>
            <div class="message-num">收信学员（{{personMessage.students.length}}人）:</div>
            <div class="message-box">
                <div v-for="item in personMessage.students" class="message-info">
                    <img class="info-img" :src="item.head_img_url" alt="">
                    <div class="info-name">{{item.realname}}</div>
                </div>
            </div>
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
                batchId: '',
                show: false,
                placehodle: '搜索学员姓名/账号',
                select2Placeholder: '选择产品',
                select2: [],
                valueSelect2: [],
                columns1: [
                    {type: 'selection'},
                    {title: '姓名', key: 'realname', width: 120},
                    {title: '用户ID', key: 'username', width: 220}
                ],
                list: [],
                tableHeight: 530,
                selectList: [{}],
                changeList: [],
                studentList: [],
                selectIndex: null,
                organization_id: '',
                product_id: '',
                keyword: '',
                inputData: '',
                deleteList: true,
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
            personMessage: {
                type: Object,
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
                    this.studentList = this.dataRow.students
                    this.getList()
                }else{
                    this.inputData = ''
                    this.studentList = []
                }
            }
        },
        methods: {
            batchChange(val){
                this.batchId = val
                this.getList()
            },
            cancelModal(val) {
                this.inputData = ''
                this.$emit('handle-close')
            },
            handleSubmit() {
                if (this.inputData) {
                    this.$emit('handle-submit', this.state)
                    this.getList()
                }
                else this.$Message.info('请输入私信内容')
            },
            selectChange1(val) {
                this.current = 1
                this.organization_id = val
                this.getList()
                this.getProducts()
            },
            selectChange2(val) {
                this.current = 1
                this.product_id = val == 'all' ? '' : val
                this.getList()
            },
            inputChange(val) {
                this.current = 1
                this.keyword = val
                this.getList()
            },
            getList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: this.organization_id,
                    product_id: this.product_id,
                    keyword: this.keyword,
                    batch_id: this.batchId
                }
                postData('pmsg/getStudents', data).then(res => {
                    if (res.res_code == 1) {
                        // if (!this.studentList.length) {
                        //     for (var i = 0; i < Math.ceil(res.data.count / 10); i++) {
                        //         this.studentList.push([])
                        //     }
                        // }
                        this.total = res.data.count
                        res.data.list.map((item, index) => {
                            this.studentList.forEach(item1 => {
                                if (item1.id == item.id) {
                                    item._checked = true
                                }
                            })
                        })
                        this.list = res.data.list
                    }
                })
            },
            setChangeList() {
                this.changeList = []
                this.studentList.forEach(item => {
                    if (item.length > 0) {
                        this.changeList = this.changeList.concat(item)
                    }
                })
            },
            selectTable(selection, row) {
                this.newSetList(selection, row)
                // this.studentList[this.current - 1] = selection
                // this.setChangeList()
            },
            selectAllTable(selection) {
                this.newSetList(selection)
                // this.studentList[this.current - 1] = selection
                // this.setChangeList()
            },
            newSetList(list, row) {
                this.list.map((item, index) => {
                    item.isChecked = false
                    list.map(item1 => {
                        if(item.id == item1.id) item.isChecked = true
                    })
                })
                this.list.forEach((item, index) => {
                    if (item.isChecked === true){
                        let state = true
                        if(!this.studentList.length) this.studentList.push(item)
                        this.studentList.forEach((item1, index1) => {
                            if (item1.id == item.id) state = false
                        })
                        if(state) this.studentList.push(item)
                    }else{
                        this.studentList.forEach((item1, index1) => {
                            if (item1.id == item.id) this.studentList.splice(index1, 1)
                        })
                    }
                })
            },
            deleteStudent(item, index) {
                this.list.map(item1 => {
                    if(item.id == item1.id) item1._checked = false
                })
                this.studentList.splice(index, 1)
                // let num = null
                // this.studentList[item.page - 1].forEach((item1, index1) => {
                //     if (item1.id == item.id) {
                //         num = index1
                //     }
                // })
                // this.studentList[item.page - 1].splice(num, 1)
                // this.selectIndex = item.option
                // if (item.page == this.current) {
                //     this.deleteList = !this.deleteList
                // }
                // this.setChangeList()
            },
            getProducts() {
                postData('components/getProducts', {organization_id: this.organization_id}).then(res => {
                    this.select2 = [{title: '全部产品', id: 'all'}, ...res.data]
                })
            },
            submit() {
                let data = {
                    content: this.inputData,
                    student_ids: []
                }
                this.studentList.forEach(item => {
                    data.student_ids.push(item.id)
                })
                if(this.isEditor) {
                    postData('pmsg/modifyPMsg', {id: this.dataRow.id, ...data}).then(res => {
                        if (res.res_code == 1) {
                            this.show = false
                            this.$Message.success(res.msg)
                            this.inputData = ''
                            this.changeList = []
                            this.$emit('submit')
                        }
                    })
                }
                else{
                    postData('pmsg/addPMsg', data).then(res => {
                        if (res.res_code == 1) {
                            this.show = false
                            this.$Message.success(res.msg)
                            this.inputData = ''
                            this.changeList = []
                            this.$emit('submit')
                        }
                    })
                }
            }
        },
        mounted() {
            if(JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id !== 1) this.organization_id = +JSON.parse(sessionStorage.getItem('organizationId'))
            this.getProducts()
            this.pageSize = 10
            this.getList()
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

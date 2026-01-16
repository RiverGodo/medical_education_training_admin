<template>
    <div class='manage-student-view'>
        <Modal v-model="showModal" :mask-closable='false' :footer-hide="true" @on-cancel="close" width="654">
            <div slot="header" class="modal-header">
                <div>{{modalTitle}}广告图</div>
            </div>
            <Form ref="lbForm" :model="lbData" :label-width="80" :rules="rules">
                <FormItem label="广告名称" prop="name">
                    <Input v-model="lbData.name" placeholder="请输入广告名称"></Input>
                </FormItem>
                <FormItem label="显示位置">
                    <Input :placeholder="adutplace" disabled></Input>
                </FormItem>
                <FormItem prop="state">
                    <template slot="label"><span class="form-label">状态</span></template>
                    <Select v-model="lbData.state" placeholder="请选择状态">
                        <Option :value="1">上线中</Option>
                        <Option :value="-1">已下线</Option>
                        <Option :value="0">测试中</Option>
                    </Select>
                </FormItem>
                <FormItem label="跳转页面" prop="redirect_url">
                    <Input v-model="lbData.redirect_url" placeholder="请输入跳转页面"></Input>
                </FormItem>
                <FormItem label="上传广告" required>
                    <UploadPanel ref="upload_panel" :resourse="lbData.img_url" :upload-config="uploadConfig"
                                 @uploadcomplete="handleDefaultUploadComplete" :maxFileSize="2">
                        <span slot="file-require">* 只能上传 jpg/png 文件，建议尺寸{{fileSize}}px</span>
                    </UploadPanel>
                </FormItem>
                <Row class='user-data' type='flex' justify='center' align='middle'>
                    <Button style="margin-top:60px" type="primary" @click='submit("lbForm")'>保存</Button>
                </Row>
            </Form>
        </Modal>
        <div class="sel-list">
            <Select @on-change="selChange" v-if="isSuper" class="select-list" v-model="valueSelect1">
                <Option v-for="t in select" :value="t.id" :key="t.id">{{t.title}}</Option>
            </Select>
            <Select @on-change="selChange" class="select-list" v-model="states">
                <Option v-for="t in select2" :value="t.value" :key="t.value">{{t.label}}</Option>
            </Select>
        </div>
        <Tables :tabel-height="tableHeight" :is-serial="pageDataCounts" @operation1="edit" @operation2="deletes"
                :column="columns1" :table-data="list" @operation3="moveUp" @operation4="moveDown"/>
        <Row class='pager' type='flex' justify='end' align='middle'>
<!--            <Page @on-change="handleCurrentChange" :current="current" :page-size="pageSize" :total="total"></Page>-->
            <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
        </Row>
    </div>
</template>
<script>
    import UploadBtn from '../../../components/UploadButton'
    import {Config} from '../../../config/base'
    import screen from '../../../components/ScreenFrame'
    import Tables from '../../../components/tables.vue'
    import postData from '../../../api/postData.js'
    import UploadPanel from '../../../components/UploadPanel'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins.js'
    import moment from 'moment'

    export default {
        mixins: [pageMixin],
        components: {'btn-upload': UploadBtn, screen, Tables, UploadPanel, pageList},
        props:{
            type:{
                type: Number,
                default: 0
            },
            show: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                operations: [],
                isSuper: false,
                states: 'all',
                select2: [
                    {value: 'all', label: "全部状态"},
                    {value: 1, label: "上线中"},
                    {value: -1, label: "已下线"},
                ],
                select: [{id: 'all', title: '全部机构'}],
                valueSelect1: 'all',
                tabName: 'home',
                stateList: [
                    {label: '上线中', value: 1},
                    {label: '已下线', value: 0}
                ],
                current: 1,
                modalTitle: '',
                total: null,
                lbData2: {
                    name: '',
                    position: null,
                    img_url: '',
                    redirect_url: ''
                },
                lbData: {},
                searchData: '',
                searchType: 'phone',
                showModal: false,
                uploadData: {
                    action: Config.ossHost,
                    headers: {},
                    multiple: false,
                    name: ''
                },
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
                headImg: '',
                isEdit: false,
                noSelect: true,
                loadingInstance: null,
                list: [],
                adutplace: '',
                position: 0,
                rules: {
                    name: {required: true, message: '请输入广告名称', trigger: 'blur'},
                    redirect_url: {required: true, message: '请输入跳转页面', trigger: 'blur'},
                    state: {required: true, message: '请选择状态'},
                },
                titleList: ['官网首页','官网课程页','移动首页','移动课程页'],
                tableHeight: null
            }
        },
        watch: {
            show(_new){
                this.showModal = _new
                if(_new)  this.setAdd(this.titleList[this.type-1], this.type)
            }
        },
        computed: {
            pageDataCounts() {
                return {
                current: this.current,
                pageSize: this.pageSize,
                isSerial: false
                }
            },
            fileSize(){
                return this.type == 1 || this.type == 2 ? '1200*390' : '750*240'
            },
            columns1(){
                const operations = this.isSuper ? ((this.valueSelect1 == 'all') ? [] : [['上移', 'operation3'], ['下移', 'operation4']]) : [['上移', 'operation3'], ['下移', 'operation4']]
                const TIEM1 = { title: '广告名称', key: 'name', align: 'left', minWidth: 200 }
                const OR_ITME = this.isSuper ? [TIEM1, { title: '所属机构',  key: 'organization_name', align: 'left', minWidth: 150 }] : [ TIEM1 ]
                return [
                    {
                        title: '序号', key: '', minWidth: 70,
                        render: (h, params) => {
                            return h('span', (params.index + 1 + (this.current - 1)*this.pageSize))
                        }
                    },
                    ...OR_ITME,
                    {
                        title: '显示位置',
                        key: 'position_name',
                        minWidth: 150
                    },
                    {
                        title: '状态',
                        key: 'state_name',
                        minWidth: 120
                    },
                    {
                        title: '创建人',
                        key: 'realname',
                        minWidth: 150
                    },
                    {
                        title: '创建机构',
                        key: 'create_organization',
                        align: 'left',
                        minWidth: 150
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        minWidth: 180,
                        render: (h, params)=>{
                            return h('span', moment(params.row.create_time).format('YYYY-MM-DD HH:MM'))
                        }
                    },
                    {
                        title: '操作',
                        minWidth: 280,
                        slot: 'operation',
                        localList: [0, 1],
                        operation_state: true,
                        operation: [['编辑', 'operation1'], ['删除', 'operation2'], ...operations],
                    },
                ]
            }
        },
        beforeDestroy() {
            this.list = null;
            this.edit = null;
            this.deletes = null;
            this.setSubmit = null;
            this.submit = null;
            this.handleCurrentChange = null;
            this.getList = null;
            this.moveList = null;
        },
        methods: {
            selChange(){
                this.current = 1
                this.getList()
            },
            setInit(){
                this.isSuper = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
                postData('components/getOrganization').then((res) => {
                    this.select = [...this.select, ...res.data]
                    this.valueSelect1 = this.select[0].id
                })
            },
            edit(row, index) {
                // this.adutplace = this.titleList[row.position-1]
                // this.showModal = true;
                // this.lbData = this.$config.copy(row,{});
                // this.modalTitle = '编辑'
                // this.isEdit = true
                // this.type = row.position
                sessionStorage.setItem('AdvertisingData', JSON.stringify(row))
                this.$router.push({path: 'add-advertising-map'})
            },
            deletes(row, index) {
                this.$config.deleteModal(() => {
                    postData('/platform/banner/removeBanner', {id: row.id}).then((res) => {
                        if (res.res_code == 1) this.getList()
                    })
                })
            },
            uploadShareImgComplete(url) {
                this.lbData.share_img_url = url;
            },
            close() {
                this.$nextTick(() => {
                     this.lbData = this.lbData2;
                     this.lbData.img_url = ''
                })
                this.$emit('close')
                this.showModal = false
                this.$refs.lbForm.resetFields()
            },
            setSubmit() {
                this.lbData.position = this.isEdit ? this.lbData.position : this.position
                let url = this.isEdit ? 'platform/banner/modifyBanner' : 'platform/banner/addBanner'
                postData(url, this.lbData).then((res) => {
                    if (res.res_code == 1) {
                        this.$Message.success(res.msg);
                        this.close()
                        this.getList(this.lbData.position)
                    }
                })
            },
            submit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.lbData.img_url) this.setSubmit()
                        else this.$Message.warning('请上传广告');
                    }
                })
            },
            handleCurrentChange(v) {
                this.current = vl;
                this.getList()
            },
            setAdd(text, n) {
                this.showModal = true;
                this.isEdit = false
                this.adutplace = text + '轮播';
                this.modalTitle = '添加'
                this.position = n
            },
            handleDefaultUploadComplete(url) {
                this.lbData.img_url = url;
            },
            moveUp(row, index) {
                this.moveList(index, true)
            },
            moveDown(row, index) {
                this.moveList(index, false)
            },
            moveList(index, location) {
                let id = []
                if(location ? index == 0 : index == this.list.length - 1) this.$Message.info(location ? '已是第一个' : '已是最后一个')
                else {
                    this.list.splice(index , 0, location ? this.list.splice(index - 1, 1)[0] : this.list.splice(index + 1, 1)[0])
                    this.list.forEach(item => { id.push(item.id) })
                    postData('platform/banner/moveBanner', {ids: id}).then(res => {
                        if(res.res_code == 1) this.getList()
                    })
                }
            },
            getList(pos) {
                let organization_id = this.isSuper ? (this.valueSelect1 == 'all' ? null : this.valueSelect1) : +sessionStorage.getItem('organizationId')
                let d = {
                    position: pos || this.type,
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id,
                    state: this.states == 'all' ? null : this.states
                }
                postData('/platform/banner/getBannerListAdmin', d).then((res) => {
                    this.list = res.data.list
                    if (this.list.length > 0) {
                        this.list.map((t) => {
                            t.position_name = this.titleList[t.position-1]
                            t.state_name = t.state == 1 ? '上线中' : t.state == -1 ? '已下线' : '测试中'
                            t.localState = t.state == -1 ? false : true
                        })
                    }
                    this.total = res.data.count
                    this.$forceUpdate()
                })
            },
        },
        mounted() {
            this.setInit()
            this.getList()
            this.lbData = this.lbData2
            this.tableHeight = window.innerHeight - 196
            if(sessionStorage.getItem('AdvertisingMap')) this.tabName = sessionStorage.getItem('AdvertisingMap')
        },
    }
</script>
<style scoped lang="less">
    @import '../system.less';
    /deep/ .ivu-input-disabled::-webkit-input-placeholder {
        color: #474C63
    }

    /deep/ .ivu-input[disabled] {
        background-color: #F0F0F7;
        color: #474C63
    }

    .manage-student-view {
        height: 100% !important;
        position: relative;
    }

    /deep/ .img > img {
        height: 250px !important;
    }

    /deep/ .ivu-modal-body {
        padding: 50px;
    }

    .uploadP1 {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9397AD;
        letter-spacing: 0;
    }

    .uploadText {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #4098FF;
        letter-spacing: 0;
    }

    .uploadP2 {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #F54802;
        letter-spacing: 0;
        margin: 0 auto;
        padding-top: 10px;
    }

    .update-img > img {
        width: 120px !important
    }

    .ivu-modal-header {
        background-color: #fff;
        border-radius: 6px 6px 0 0;
        padding: 20px !important;

    }

    .modal-header {
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #474C63;
        letter-spacing: 0;
        text-align: center;
        padding: 8px 0;
    }

    .ivu-icon-ios-close {
        color: #bfcbd9 !important;

        &:hover {
            color: #4098ff !important;
        }
    }

    .ivu-btn-primary {
        width: 140px;
    }

    .add-student-view {
        width: 50%;
    }

    .btn-add {
        position: absolute;
        right: 40px;
        color: #3DAAFF;
    }

    .result {
        margin-top: 32px !important;
    }

    /deep/ .ivu-table-cell {
        font-size: 16px;
        color: #657180;
    }

    /deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
        font-size: 14px;
    }

    .btn-text {
        color: #3DAAFF;
        font-size: 14px;
    }

    /deep/ .ivu-input-number {
        width: calc(100% - 70px) !important;
    }

    .add-student-view .result .data-form .user-data {
        margin-bottom: 15px;
        padding: 0 20px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .add-advert {
        width: 130px;
        height: 36px;
        background: #4098FF;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        position: absolute;
        top: -48px;
        right: 39px;
    }

    /deep/ .ivu-modal-close .ivu-icon-ios-close {
        font-size: 48px !important;
    }
</style>

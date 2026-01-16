<template>
    <div style="height: 100%;">
        <screen :types="6" title="常用签到地址" @handleClick="handleClick" @handleBack="handleBack" btn-name="常用地址" :isWhite="true" :btnType="true"/>
        <maps @isAdd="getList"/>
        <Modal v-model="isShow" @on-cancel="handleCancel" title="培训签到地点" :mask-closable="false" :footer-hide="true" width="800">
            <div class="modal-screen">
                <div v-if="is_admin == 1" class="modal-screen-type">筛选：</div>
                <Select v-if="is_admin == 1" v-model="organization_id" style="width:200px" @on-change="organizationChange">
                    <Option v-for="item in organizationList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
                <div class="modal-screen-num">共<span style="color: #4098ff">{{modalTotal}}</span>个</div>
            </div>
            <tables style="width: 100%;" :tabel-height="530" :is-serial="modalPageCount" :column="mapColumns" :table-data="mapList" @operation1="operation1"></tables>
            <Page v-if="modalTotal>modalPageSize" :current="modalCurrent" :total="modalTotal" :page-size="modalPageSize" @on-change="pageChange"></Page>
        </Modal>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import maps from './maps'
    import tables from '../../../components/tables'
    import postData from '../../../api/postData'

    export default {
        components: {screen, maps, tables},
        data() {
            return {
                isShow: false,
                modalCurrent: 1,
                modalTotal: null,
                modalPageSize: 10,
                mapColumns: [
                    {
                        title: '签到地点',
                        key: 'location_name',
                        // minWidth: 160,
                        width: 219,
                    },
                    {
                        title: '详细地址',
                        key: 'address',
                        // minWidth: 300,
                        width: 359,
                        align: 'left',
                    },
                    {
                        title: '操作',
                        // minWidth: 100,
                        width: 159,
                        align: 'center',
                        slot: 'operation',
                        operation_btn_hide: true,
                        operation: [['删除','operation1']],
                    }
                ],
                mapList: [],
                organizationList: [
                    {id: 'all', title: '全部机构'}
                ],
                organization_id: 'all',
                is_admin: ''
            }
        },
        computed: {
            modalPageCount() {
                return {
                    current: this.modalCurrent,
                    pageSize: this.modalPageSize,
                    isSerial: true
                }
            },
            getOrganizationId(){
                return this.is_admin == 1 ? (this.organization_id == 'all' ? '' : this.organization_id) : +sessionStorage.getItem('organizationId')
            },
        },
        methods: {
            handleClick() {
                this.isShow = true
            },
            handleBack() {
                this.$router.go(-1)
            },
            handleCancel() {
                this.isShow = false
            },
            pageChange(val) {
                this.modalCurrent = val
                this.getList()
            },
            operation1(val) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该常用地址</p>',
                    onOk: () => {
                        postData('product/removeLocation', {id: val.id}).then(res => {
                            if(res.res_code == 1) this.getList()
                        })
                    },
                });
            },
            organizationChange(val) {
                this.modalCurrent = 1
                this.getList()
            },
            getList() {
                let data = {
                    organization_id: this.getOrganizationId,
                    page_num: this.modalCurrent,
                    page_size: this.modalPageSize
                }
                postData('product/getLocations', data).then(res => {
                    if(res.res_code == 1) {
                        this.mapList = res.data.data
                        this.modalTotal = res.data.count
                    }
                })
            }
        },
        mounted() {
            this.is_admin = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            postData('components/getOrganization').then(res => {
                if(res.res_code == 1) {
                    this.organizationList = this.organizationList.concat(res.data)
                }
            })
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    .modal-screen{
        display: flex;
        align-items: center;
        height: 46px;
        background-color:#f0f0f7;

        /deep/ .ivu-select-selection{
            border-radius: 400px;
            padding-left: 10px;
        }
        .modal-screen-type{
            font-size: 16px;
            margin-left: 40px;
            font-family: PingFangSC-Regular
        }
        .modal-screen-num{
            font-size: 16px;
            margin-left: 20px;
            font-family: PingFangSC-Regular
        }
    }
   /deep/ .ivu-modal-body{
        padding:  0 0 16px 0;
    }
    /deep/ .ivu-table:before{
        display: none;
    }
</style>

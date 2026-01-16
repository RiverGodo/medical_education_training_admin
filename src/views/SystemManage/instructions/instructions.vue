<template>
    <div class='manage-production-view'>
        <div class="open-head grey-regular1">使用说明<Button class="head-btn" type="primary" @click="addNewsHandler">创建</Button></div>
        <div class="sel-list">
            <Select @on-change="selChange" v-if="isSuper" class="select-list" v-model="valueSelect1">
                <Option v-for="t in select" :value="t.id" :key="t.id">{{t.title}}</Option>
            </Select>
        </div>
        <FormModal @from-submit="fromSubmit" :detail-data="tableRow" :show-modal='show' :form-list="formList"
                   @close="closeModal" :title="modalTitle" :modalWidth="modalWidth" :panelOptions="panelOptions"
                   :upload-btn="false" :rule-validate="rules" ></FormModal>
        <Tables :tabel-height="tabelHeight" :is-serial="pageDataCounts" @operation2="edit"
                @operation3="deletes" :column="columns1" :table-data="list"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    import Tables from '../../../components/tables.vue'
    import screen from '../../../components/ScreenFrame'
    import FormModal from '../../../components/FormModal'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins.js'
    import postData from '../../../api/postData'
    import system from '../mixins/system'
    export default {
        mixins: [ pageMixin, system ],
        components: {screen, FormModal, pageList, Tables},
        data() {
            return {
                tableRow: {},
                list: [],
                show: false,
                formList: [
                    {
                        type: 'select',
                        name: '所属机构',
                        field: 'organization_id',
                        selectList: [],
                        selectField: ['id', 'title'],
                        selectChange: true,
                        disable: false
                    },
                    {type: 'upload', name: '编辑文本', field: 'uploading', isUploadVideo: false },
                ],
                modalTitle: '创建使用说明',
                tabelHeight: null,
                rules: {
                    organization_id: [{required: true, message: '请输入所属机构'}],
                    uploading: [],
                },
                isAdd: true,
                modalWidth: 900,
                panelOptions: {
                    panelWidth: 580,
                    panelHeight: 310
                }
            }
        },
        computed: {
             columns1() {
                 let arr = [
                    {
                        title: '序号', key: '', minWidth: 70,
                        render: (h, params) => {
                            return h('span', (params.index + 1 + (this.current - 1)*this.pageSize))
                        }
                    },
                    {
                        key: 'create_time',
                        title: '创建时间',
                        minWidth: 150,
                    },
                    {
                        key: 'create_organization_title',
                        title: '创建机构',
                        minWidth: 150
                    },
                    {
                        key: 'user_username',
                        title: '创建人',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        operation: [['编辑', 'operation2'], ['删除', 'operation3']]
                    }
                ]
                if(this.isSuper) arr.splice(1, 0, {
                        title: '所属机构',
                        key: 'organization_title',
                        align: 'left',
                        minWidth: 150
                })
                return arr
             }
        },
        beforeDestroy() {
            this.list = null;
            this.addNewsHandler = null;
            this.fromSubmit = null;
            this.setLowerShelf = null;
            this.edit = null;
            this.deletes = null;
            this.getList = null;
        },
        methods: {
            addNewsHandler() {
                this.tableRow = null
                if(!this.$config.isRoleSuper())  this.tableRow = {organization_id:  +sessionStorage.getItem('organizationId')}
                this.isAdd = true
                this.modalTitle = '创建使用说明'
                this.show = true
            },
            fromSubmit(v) {
                if(v.uploading && v.uploading!='<p><br></p'){
                    let d = {
                        organization_id: v.organization_id,
                        content:  v.uploading,
                    }
                    const url = this.isAdd ? 'instruction/addInstruction' : 'instruction/updateInstruction'
                    if(!this.isAdd) d.id = v.id
                    postData(url, d).then(res => {
                        if (res.res_code == 1) {
                            this.$Message.success(res.msg)
                            this.getList()
                        }
                    })
                }else this.$Message.info('请编辑文本！')
            },
            edit(row, rowIndex) {
                this.isAdd = false
                this.modalTitle = '编辑使用说明'
                this.tableRow = row
                this.tableRow.img_default = row.img_url
                this.tableRow.uploading = row.content
                this.show = true
            },
            deletes(row, rowIndex) {
                this.$config.deleteModal(() => {
                    const {organization_id, content, id} = row
                    postData('instruction/updateInstruction', {organization_id, content, state: -1, id}).then((res) => {
                        if (res.res_code == 1) this.getList()
                    })
                });
            },
            getList() {
                let d = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: this.getOrganizationId,
                }
                postData('instruction/getInstructionList', d).then((res) => {
                    this.list = res.data.list
                    this.total = res.data.count
                })
            },
            closeModal() {
                this.show = false
            }
        },
        mounted() {
            this.getList()
            this.tabelHeight = window.innerHeight - 196
        }
    }
</script>
<style lang="less" scoped>
    @import '../system.less';
    .manage-production-view {
        position: relative;
        height: 100%;
    }

    .ivu-page {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
    }

    /deep/ .manage-news-state {
        /deep/ .ivu-form-item-label {
            letter-spacing: 9px !important;
        }
    }
    /deep/ .w-e-text-container{
        height: 700px !important;
        overflow-y: auto !important;
    }
    /deep/ .w-e-text{
        overflow: hidden;
        overflow-y: unset;
        height: auto !important;
        min-height: 100%;
    }
    /deep/ .md-cloud-upload {
        margin-top: 100px !important;
    }
</style>

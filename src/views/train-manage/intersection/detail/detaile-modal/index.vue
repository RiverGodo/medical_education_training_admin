<template>
    <div>
        <Modal v-model="show" :mask-closable="false" :footer-hide="true" title="添加培训" @on-cancel="handleClose" width="740">
            <screen @resetPage="resetPage" :types="14" :selectType2="true" :select2="select2" @selectChange2="selectChange2" @inputChange="inputChange"></screen>
            <tables :column="columns1" :table-data="list" :isSelection="true" :tabelHeight="438" @on-selection-change="onSelectionChange"></tables>
            <div style="display: flex;justify-content: space-around;align-items: center;margin-top: 20px;">
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
                <Button type="primary" style="width: 150px;height: 36px;" @click="submit">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import screen from '../../../../../components/ScreenFrame'
    import tables from '../../../../../components/tables'
    import pageList from  '../../../../../components/Page'
    import pageMixin from '../../../../mixins/pageMixins'
    import postData from '../../../../../api/postData'
    var loadingInstance = null;

    export default {
        components: {screen, tables, pageList},
        mixins: [pageMixin],
        data() {
            return {
                show:false,
                select2: [
                    {id: 'all', title: '全部'},
                    {id: 1, title: '已添加'},
                    {id: 0, title: '未添加'}
                ],
                columns1: [
                    {
                        title: '产品名称',
                        key: 'title',
                        align: 'left',
                        minWidth: 200
                    },
                    {
                        title: '分类',
                        key: 'category_title',
                        align: 'left',
                        minWidth: 200
                    },
                    {
                        title: '状态',
                        key: 'state',
                        render: (h,param) => {
                            let d = param.row.state == -1 ? '下架' : param.row.state == 1 ? '测试' : param.row.state == 2 ? '上架' : '未上架'
                            return h('span', d)
                        },
                        minWidth: 100
                    },
                    {
                        title: '售价',
                        key: 'price',
                        minWidth: 100
                    }
                ],
                list: [],
                add_state: '',
                search: '',
                selectList: [],
                changeList: []
            }
        },
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
        },
        watch: {
            isShow(val) {
                this.show = val
                if(val) this.getList()
            }
        },
        methods: {
            handleClose() {
                this.changeList = []
                this.$emit('handleClose')
            },
            getList() {
                let data = {
                    category_id: '',
                    add_state: this.add_state,
                    search: this.search,
                    page_size: this.pageSize,
                    page_num: this.current,
                    collection_id: JSON.parse(sessionStorage.getItem('INTERSECTION')).collection_id,
                }
                postData('/product/collection/getProductByCollection', data).then(res => {
                    res.data.products.forEach(item =>  {
                        if(item.add_state) item._checked  = true
                    })
                    this.list = res.data.products
                    this.total = res.data.count
                })
            },
            selectChange2(val) {
                this.add_state =  val == 'all' ? '' : val
                this.getList()
            },
            inputChange(val) {
                this.search = val
                this.getList()
            },
            submit() {
                loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
                let list = []
                this.selectList.forEach(item => {
                    list .push(item.id)
                })
                let data = {
                    collection_id: JSON.parse(sessionStorage.getItem('INTERSECTION')).collection_id,
                    product_arr: this.changeList
                }
                postData('/product/collection/addProduct', data).then(res => {
                    if(res.res_code == 1) {
                        this.handleClose()
                        this.$emit('submit')
                        loadingInstance.close()
                    }
                })
            },
            onSelectionChange(val) {
                this.list.forEach(item => {
                    item.checked = false
                    val.forEach(item1 => {
                        if(item.id == item1.id) item.checked = true
                    })
                    if(this.changeList.length) {
                        this.changeList.forEach(item2 => {
                            if(item2.id == item.id) item2 = item
                        })
                    }
                    this.changeList = [...this.changeList, ...this.list]
                })
            }
        },
        mounted() {
            this.pageSize = 8
        }
    }
</script>

<style scoped lang="less">
    .screen{
        min-width: unset;
    }
    /deep/ .input{
        width: 300px !important;
    }
    /deep/ .ivu-table:after{
        width: 0;
    }
    /deep/  .ivu-table:before{
        height: 0;
    }
    /deep/ .ivu-page{
        margin-top: 0 !important;
    }
</style>
<template>
    <div>
        <form-modal :handleFloor="handleFloor" :show-modal="show" :detail-data="tableRow" @from-submit="handleSubmit" :form-list="formList"
                    @close="closeModal" :title="modalTitle" :rule-validate="rules"
                    btnName="确认" @change-list="changeList"/>
        <screen :types="10" title="首页推荐产品" btnType btnName="添加产品" @handleClick="handleClick"
                style="background:#ffffff"/>
        <div class="hint">提示：每个机构最多展示3个产品</div>
        <div v-if="isSuper" class="sel-list">
            <Select @on-change="selChange" class="select-list" v-model="valueSelect1">
                <Option v-for="t in select" :value="t.id" :key="t.id">{{t.title}}</Option>
            </Select>
        </div>
        <div class="recommended-content">
            <div class="content">
                <div v-for="(item, index) in dataList" :key="index" class="product">
                    <img v-if="item.imgs" class="product-img" :src="item.imgs" alt="">
                    <video v-else-if="item.video_url" :src="item.video_url" class="product-img"></video>
                    <div class="product-content">
                        <div class="product-content-title">{{item.title}}</div>
                        <div style="position: relative">
                            <!-- <Input v-if="item.front_description" v-model="item.front_description" type="textarea" class="product-content-input"
                                   placeholder="请输入产品介绍" :maxlength="100" @on-change="changeContent"/> -->
                            <Input v-model="item.short_description" type="textarea" class="product-content-input"
                                   placeholder="请输入产品介绍" :maxlength="100" @on-change="changeContent(index)"/>
                            <!-- <div class="font-num">{{item.front_description ? item.front_description.length : item.short_description.length}}/100</div> -->
                        </div>
                        <div class="product-content-tab">
                            <div v-if="item.show" style="display: flex">
                                <Button @click="cancel(index)">取消</Button>
                                <Button style="margin-left: 5px" @click="modify(item)" type="primary">保存</Button>
                            </div>
                            <div class="right-btns">
                                <img v-if="valueSelect1 !== 'all'" :src="upImg" alt="" @click="handleUp(index)">
                                <img v-if="valueSelect1 !== 'all'" :src="downImg" alt="" @click="handleDown(index)">
                                <img :src="deleteImg" alt="" @click="handleDelete(index, item)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="foot-page">
            <Page v-if="total>pageSize" :current="current" :total="total" :page-size="pageSize" @on-change="onChange"></Page>
        </div>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import formModal from '../../../components/FormModal'
    import postData from '../../../api/postData'
    import upImg from '../../../assets/icons/img/up.png'
    import downImg from '../../../assets/icons/img/down.png'
    import deleteImg from '../../../assets/icons/img/delete.png'
    export default {
        components: {screen, formModal},
        data() {
            return {
                total: 5,
                pageSize: 16,
                current: 1,
                handleFloor: 3,
                activeCount: 0,
                isSuper: false,
                select: [{id: 'all', title: '全部机构'}],
                valueSelect1: 'all',
                show: false,
                tableRow: {},
                modalTitle: '',
                dataList2: [],
                formList: [
                    {
                        type: 'select',
                        name: '所属机构',
                        field: 'company',
                        selectList: [{id: 1, title: '1'}],
                        selectField: ['id', 'title'],
                        selectChange: true,
                        disable: false
                    },
                    {
                        type: 'select',
                        name: '产品名称',
                        field: 'productIndex',
                        selectList: [{index: 1, title: ''}],
                        selectField: ['index', 'title']
                    },
                ],
                rules: {
                    company: [{required: true, message: '请输入所属机构'}],
                    productIndex: [{required: true, message: '请输入产品名称'}],
                },
                dataList: [],
                isLoad: false,
                upImg, downImg, deleteImg
            }
        },
        methods: {
            isShowBtn(i, bool){
                let t = this.dataList[i]
                t.show = bool
                this.dataList.splice(i, 1, t)
            },
            setInit(){
                this.isSuper = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
                postData('components/getOrganization').then((res) => {
                    this.select = [...this.select, ...res.data]
                    this.valueSelect1 = this.select[0].id
                })
            },
            handleClick() {
                this.modalTitle = '添加产品'
                this.getData()
            },
            successs(res){
                if (res.res_code == 1&&res.data.length>0) { 
                    // this.dataList.push(res.data[0])
                    const {id, organization_id, type} = res.data[0]
                    postData('product/addRecomment', {pcl_id: id, organization_id, type}).then(r => {
                        if (r.res_code == 1) {
                            this.$Message.success('保存成功')
                            this.initData()
                        }
                    })
                }
            },
            modify(t){
                postData('product/modifyRecomment', {id: t.id,short_description: t.short_description}).then(res => {
                    if (res.res_code == 1) { 
                        this.$Message.success('保存成功') 
                        this.initData()
                    }
                })
            },
            handleSubmit(val) {
                console.log(this.activeCount,'this.activeCount');
                if(this.activeCount < 3){
                    if (val.productIndex == 0 || val.productIndex) {
                        if (this.formList[1].selectList[val.productIndex].type == "collection") {
                            postData('product/collection/get_detail', {collection_id: this.formList[1].selectList[val.productIndex].id}).then(res => {
                                this.successs(res)
                            })
                        } else if(this.formList[1].selectList[val.productIndex].type == "product"){
                            postData('product/product/get_detail', {product_id: this.formList[1].selectList[val.productIndex].id}).then(res => {
                                this.successs(res)
                            })
                        }else{
                            postData('live/get_detail', {live_id: this.formList[1].selectList[val.productIndex].id}).then(res => {
                                this.successs(res)
                            })
                        }
                    }
                }else this.$Message.info('首页最多展示3个产品，请先删除再添加')
            },
            changeContent(i) {
                this.isShowBtn(i, true)
            },
            closeModal() {
                this.show = false
                this.formList[1].selectList = [{index: 1, title: ''}]
            },
            changeList(val) {
                // this.tableRow.productIndex = null
                let sel = this.formList[0].selectList, counts = 0
                let organization_id = this.isSuper ? (val == 'all' ? null : val) : +sessionStorage.getItem('organizationId')
                sel.forEach(t => {
                    if(t.id == organization_id) counts = t.count
                })
                this.activeCount = counts
                if(counts >= 3) { 
                    this.$Message.info('首页最多展示3个产品，请先删除再添加')
                    this.handleFloor = -1
                }else this.handleFloor = 3
                postData('components/getProductsCollection', {organization_id}).then(res => {
                    if (res.res_code == 1) {
                        if(res.data.length >0) {
                            res.data.forEach((item, index) => {
                                item.index = index
                                item.show = false
                            })
                        }
                        this.formList[1].selectList = res.data.length ? res.data : []
                        this.tableRow.productIndex = ''
                    } else this.$Message.info(res.msg)
                })
            },
            selChange(){
                this.current = 1
                this.initData()
            },
            onChange(val){
                this.current = val
                this.initData()
            },
            initData() {
                let organization_id = this.isSuper ? (this.valueSelect1 == 'all' ? null : this.valueSelect1) : +sessionStorage.getItem('organizationId')
                postData('product/getRecommendList', {organization_id, page_size: this.pageSize, page_num: this.current}).then(res => {
                    if (res.res_code == 1) {
                        this.dataList = res.data.data
                        this.dataList2 = this.$config.copy(res.data.data, [])
                        this.total = res.data.count
                        this.dataList.forEach(item => {
                            if(item.new_img_url.includes('{')){
                                item.new_img_url = JSON.parse(item.new_img_url) 
                                item.imgs = item.new_img_url.default&&item.new_img_url.default.length>0 ? item.new_img_url.default[0] : ''
                                item.video_url = item.new_img_url.default&&item.new_img_url.default.length>0 ? '' : item.new_img_url.video
                            }else item.imgs = item.new_img_url
                        })
                    }
                }).then(() => {
                    this.isLoad = true
                })
            },
            moves(next, index, bool){
                this.dataList[index] = this.dataList.splice(next, 1, this.dataList[index])[0]
                let sort_arr = []
                this.dataList.map(t => {
                    sort_arr.push(t.id)
                })
                postData('product/resort', {sort_arr}).then(res => {
                    if(res.res_code == 1){

                    }
                })
            },
            handleUp(index) {
                if (index == 0) this.$Message.info('无法上移')
                else this.moves(index - 1, index, true)
            },
            handleDown(index) {
                if (index == this.dataList.length - 1) this.$Message.info('无法下移')
                else this.moves(index + 1, index, false)
            },
            handleDelete(index, t) {
                this.$config.deleteModal(() => {
                    postData('product/delRecomment', {id: t.id}).then(res => {
                        if(res.res_code == 1){
                            this.dataList.splice(index, 1)
                        }
                    })
                })
            },
            cancel(i) {
                this.isShowBtn(i, false)
                const T1 = this.dataList[i]
                const ShortDescription = this.dataList2[i].short_description
                T1.short_description = ShortDescription
                this.dataList.splice(i, 1, T1)
            },
            getData(){
                if(!this.isSuper){
                    this.tableRow.company = +sessionStorage.getItem('organizationId')
                    this.formList[0].disable = true
                }
                postData('user/getOrganizations').then(res => {
                    if(res.res_code == 1){
                        let da = this.formList[0]
                        da.selectList = res.data
                        this.formList.splice(0, 1, da)
                        this.changeList(this.tableRow.company)
                        this.show = true
                    }
                })
            }
        },
        mounted() {
            this.setInit()
            this.initData()
        }
    }
</script>

<style scoped lang="less">
    @import '../system.less';
    .recommended-content {
        height: calc(100% - 250px);
        overflow: hidden;
        overflow-y: auto;
        position: absolute;
        width: 100%;
    }

    .hint {
        height: 40px;
        line-height: 40px;
        background: #FCF6E5;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #F54802;
        letter-spacing: 0;
        text-align: center;
    }

    .content {
        position: relative;
        height: auto;
        margin-top: 20px;
        min-width: 930px;
    }

    .product {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        .product-img {
            width: 288px;
            height: 162px;
        }

        .product-content {
            margin-left: 30px;
            text-align: left;

            .product-content-title {
                font-family: PingFangSC-Medium;
                font-size: 18px;
                color: #333333;
                letter-spacing: 0;
                line-height: 24px;
            }

            .product-content-input {
                height: 90px;
                width: 600px;
                margin-top: 15px;
                /deep/ .ivu-input {
                    height: 90px;
                }
            }

            .product-content-tab {
                margin-top: 18px;
                display: flex;
                align-items: center;
                position: relative;
                /deep/ .ivu-btn{
                    height: 24px;
                    font-size: 10px !important;
                }
                .right-btns{
                    position: absolute;
                    right: 0;
                    display: flex;
                    align-items: center;
                    img {
                        margin-left: 20px;
                    }
                }
            }
        }
    }
    .foot-page{
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 20px;
    }

    .font-num {
        display: inline-block;
        position: absolute;
        top: 77px;
        right: 18px;
    }
</style>

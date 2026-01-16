<template>
    <div class="barrage-management">
        <ForbiddenModal @closeModal="closeModal" :user="user" :show="show"/>
        <PrivateModal ref="privateModalRef" @ok="handleSendPrivateLetter" />
        <div class="head">
            <div v-if="!isShowSearch" class="barrage-back" @click="handleBack">
                <img class="back-img" src="../../assets/icons/icon/back.png" alt="">
                <div class="back-title">返回</div>
            </div>
            <Input v-model="content" placeholder="搜索弹幕内容" @on-change="inputChange" class="input">
                <Icon type="md-search" slot="prefix"/>
            </Input>
            <Input v-model="username" placeholder="搜索用户名" @on-change="inputChange" class="input">
                <Icon type="md-search" slot="prefix"/>
            </Input>
            <Input v-if="isShowSearch" v-model="productname" placeholder="搜索产品名称" @on-change="inputChange" class="input">
                <Icon type="md-search" slot="prefix"/>
            </Input>
            <div class="slide-view">
                <p class="slider-text">弹幕时间范围筛选：</p>
                <Slider @on-change="inputChange" class="slide" :min="0" :max="1000" v-model="videoTime" range></Slider>
                <p class="slider-text slider-time">{{videoTime[0]}} ～ {{videoTime[1]}} （分钟）</p>
            </div>
        </div>
        <Tables @tableSelect="tableSelect" @shield="shield" @forbidden="forbidden" @letter="letter" :tabel-height="tableHeight" :is-serial="pageDataCount" :column="columns1" :table-data="list"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
  import Tables from '../../components/tables.vue'
  import pageList from '../../components/Page'
  import pageMixin from '../mixins/pageMixins'
  import ForbiddenModal from './com/forbidden-modal';
  import PrivateModal from "./com/private-modal";
  export default {
        name: "barrage-management",
        components: { Tables, pageList, ForbiddenModal,PrivateModal },
        mixins: [pageMixin],
        data() {
            return {
                isShowSearch: true,
                catalog_id: null,
                user: null,
                show: false,
                videoTime: [0, 100],
                state: null,
                list: [],
                tableHeight: 0,
                content: '',
                username: '',
                productname: '',
                columns1: [
                {
                    title: '产品ID',
                    key: 'product_id',
                    minWidth: 90
                },{
                    title: '产品名称',
                    key: 'product_title',
                    align: 'left',
                    minWidth: 150
                },
                {
                    title: '课程名称',
                    key: 'curriculum_title',
                    align: 'left',
                    minWidth: 150
                },{
                    title: '弹幕内容',
                    key: 'content',
                    minWidth: 200,
                    align: 'left',
                    render: (h, params) => {
                        return h('span', params.row.content)
                    }
                },
                {
                    title: '弹幕时间',
                    key: 'video_time',
                    align: 'left',
                    minWidth: 100
                },{
                    title: '状态',
                    key: 'state',
                    minWidth: 90,
                    filters: [
                        {
                            label: '正常',
                            value: 1
                        },
                        {
                            label: '已屏蔽',
                            value: 0
                        }
                    ],
                    filterRemote (value) {
                        this.$emit('tableSelect', 'state', value)
                    },
                    filterMultiple: false,
                    render: (h, params) => {
                        return h('span', params.row.state == 1 ? '正常' : '已屏蔽')
                    }
                },
                {
                    title: '用户名（ID）',
                    key: 'realname',
                    minWidth: 140,
                    render: (h, params) => {
                        return h('div', [
                            h('p', params.row.realname),
                            h('p', `（${params.row.user_id}）`)
                        ])
                    }
                },{
                    title: '发布时间',
                    key: 'send_time',
                    minWidth: 150
                },
                {
                    title: '操作',
                    minWidth: 220,
                    slot: 'operation',
                    align: 'left',
                    operation_state: true,
                    operation: [[['屏蔽', '取消屏蔽'], 'shield'], ['禁言', 'forbidden'], ['私信', 'letter']],
                }]
            }
        },
        methods: {
            handleBack(){
                this.$router.go(-1)
            },
            inputChange(){
                this.current = 1
                this.getList()
            },
            getList(){
                let d = {
                    start_video_time: this.videoTime[0] == 0 ? 0 : this.videoTime[0]*60,
                    end_video_time: this.videoTime[1] == 0 ? 0 : this.videoTime[1]*60,
                    state: this.state,
                    product_name: this.productname,
                    username: this.username,
                    content: this.content,
                    page_size: this.pageSize,
                    page_num: this.current,
                    catalog_id: this.catalog_id
                }
                PostData('/product/getBarrageList', d).then((res) => {
                    this.list = res.data.data
                    this.total = res.data.count
                })
            },
            shield(row, index){
                const state = row.state === 1 ? 0 : 1
                const text = state === 1 ? '取消屏蔽成功' : '屏蔽成功'
                const tip = state === 1 ? '是否需要取消屏蔽此条弹幕' : '是否需要屏蔽此条弹幕'
                this.$config.deleteModal(() => {
                    PostData('/product/screenBarrage', {id: row.id, state, student_id: row.user_id}).then((res) => {
                        if(res){
                            this.$Message.success(text);
                            this.list.splice(index, 1, {...this.list[index], state})
                        }
                    })
                }, tip)
            },
            closeModal(){
                this.show = false
            },
            forbidden(row, index){
                this.show = true
                this.user = {realname: row.realname, user_id: row.user_id}
                console.log(this.show,'KM');
            },
            letter(row, index){
                this.currentRowData = row;
                this.handleOpenPrivateModal(true);
            },
            tableSelect(type, val) {
                this.current = 1
                this[type] = val[0];
                this.getList()
            },
            // 打开私信窗口
            handleOpenPrivateModal(state) {
                this.$refs.privateModalRef.modalState = state;
            },
            // 发送系统私信
            handleSendPrivateLetter(content) {
                let params = {
                    content,
                    student_ids: [this.currentRowData.user_id],
                };
                PostData("/pmsg/addPMsg", params).then((res) => {
                    if (res.res_code === 1) {
                    this.$Message.success("发送成功");
                    } else {
                    this.$Message.error("发送失败");
                    }
                });
            },
        },
        mounted(){
            this.tableHeight = window.innerHeight - 116
            if(this.$route.query.catalog_id){
                this.catalog_id = this.$route.query.catalog_id
                this.isShowSearch = false
            }
            this.getList()
        }
    }
</script>
<style lang="less" scoped>
    @import url('../../css/input.less');
    .barrage-management{
        .head{
            height: 66px;
            min-width: 800px;
            background: #fff;
            display: flex;
            // align-items: center;
            padding-left: 21px;
            padding-right: 31px;
            z-index: 9999;
            margin-top: 15px;
            .barrage-back {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                margin-right: 10px;
                height: 36px;
                .back-img {
                    width: 23px;
                    height: 19px;
                }
                .back-title {
                    margin-left: 10px;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #474C63;
                    letter-spacing: 0;
                }
            }
            .slide-view{
                flex: 1;
                display: flex;
                margin-left: 10px;
                height: 66px;
                .slider-text{
                    line-height: 36px;
                }
                .slide{
                    display: flex;
                    flex: 1;
                    margin-left: 10px;
                }
                .slider-time{
                    margin-left: 10px;
                }
            }
        }
    }
</style>
<style>
    
</style>
<template>
    <div style="height: 100%;">
        <screen :types="7" @handleBack="handleBack" :title="title"/>
        <div style="overflow-y: auto; height: calc(100% - 66px)">
            <Form :model="formLb" ref="formValidate" style="margin: 40px 200px;" :label-width="100" label-position="left" @submit.native.prevent :rules="ruleValidate">
                <FormItem label="广告名称" prop="name">
                    <Input v-model="formLb.name" placeholder="请输入广告名称"/>
                </FormItem>
                <FormItem label="状态" prop="state">
                    <template slot="label"><span style="letter-spacing: 30px">状</span>态</template>
                    <Select v-model="formLb.state" placeholder="请选择状态">
                        <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="isSuper" label="所属机构" prop="organization_id">
                    <Select v-model="formLb.organization_id" placeholder="请选择机构" @on-change="organizationChange">
                        <Option v-for="item in organizationList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="跳转类型" prop="target">
                    <RadioGroup v-model="formLb.target" size="large" @on-change="radioChange">
                        <Radio v-for="(item, index) in jumpList" :key="index" :label="item.id">{{item.title}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="跳转页面" required prop="router_url">
                    <Input v-if="formLb.target == 6" v-model="formLb.router_url" placeholder="请选择跳转页面"/>
                    <Select v-else v-model="formLb.router_url" :filterable="formLb.target == 4 ? true : false" placeholder="请选择跳转页面">
                        <Option v-for="item in htmlList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                    <p v-if="formLb.target == 6" class="target-exam">示例：https://www.baidu.com/、www.baidu.com</p>
                </FormItem>
                <Row :gutter="14">
                    <Col span="12" v-for="(item, index) in uploadList" :key="index" style="margin-bottom: 30px;">
                        <div class="lb-upload-title">{{item.title}}</div>
                        <upload-panel :uploadTitle="item.name" :panelOptions="panelOptions" @uploadcomplete="uploadcomplete" :maxFileSize="2"
                                      types="image/gif, image/jpeg, image/png" :resourse="formLb[item.name]"/>
                        <div class="lb-upload-hint">{{local ? item.hint_home : item.hint_course}}</div>
                    </Col>
                </Row>
                <Button type="primary" class="lb-btn" @click="submit">保存</Button>
            </Form>
        </div>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import uploadPanel from '../../../components/UploadPanel'
    import postData from '../../../api/postData'

    export default {
        components: {screen, uploadPanel},
        data() {
            return {
                isSuper: false,
                local: 1,
                title: '',
                idAdd: true,
                formLb: {
                    name: '',
                    state: '',
                    target: '',
                    organization_id: '',
                    router_url: '',
                },
                stateList: [
                    {value: 1, label: "上线中"},
                    {value: -1, label: "已下线"},
                ],
                organizationList: [],
                htmlList: [],
                panelOptions: {
                    panelWidth: '100%',
                    panelHeight: '150'
                },
                uploadList: [
                    {title: 'web广告图', id: 1, name: 'web_img_url', hint_home: '*建议尺寸390*1200px，且大小不超过2M的图片', hint_course: '*建议尺寸390*1200px，且大小不超过2M的图片'},
                    {title: 'web背景图', id: 2, name: 'web_background_img_url', hint_home: '*建议尺寸390*2000px，且大小不超过2M的图片'},
                    {title: 'app/wap广告图', id: 3, name: 'mobile_img_url', hint_home: '*建议尺寸320*690px，且大小不超过2M的图片', hint_course: '*建议尺寸320*690px，且大小不超过2M的图片'},
                    {title: 'app背景图', id: 4, name: 'mobile_background_img_url', hint_home: '*建议尺寸400*750px，且大小不超过2M的图片'},
                ],
                jumpList: [
                    {title: '直播课', id: 1},
                    {title: '培训', id: 2},
                    {title: '合集', id: 3},
                    {title: '新闻', id: 4},
                    {title: '其他', id: 5},
                    {title: '外部链接', id: 6},
                ],
                ruleValidate: {
                    name: [{required: true, message: '请输入广告名称', trigger: 'blur'}],
                    state: [{required: true, message: '请选择广告状态'}],
                    target: [{required: true, message: '请选择跳转类型'}],
                    organization_id: [{required: true, message: '请选择所属机构'}],
                    router_url: [{required: true, message: '请选择跳转页面'}],
                }
            }
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            uploadcomplete(val, name) {
                this.formLb[name] = val
            },
            radioChange(val) {
                this.formLb.router_url = null
                this.htmlList = []
                if(val) this.organizationChange(val)
            },
            getInit() {
                if(sessionStorage.getItem('AdvertisingMap') !== 'home') {
                    this.title = '课程页广告图'
                    this.uploadList.splice(1,1)
                    this.uploadList.splice(2,1)
                }else this.title = '首页广告图'
                this.isAdd = sessionStorage.getItem('AdvertisingData') ?  false :  true
                if(!this.isAdd) {
                    this.formLb = JSON.parse(sessionStorage.getItem('AdvertisingData'))
                    this.organizationChange(this.formLb.organization_id)
                    this.formLb.router_url = this.formLb.target < 5 ? this.formLb.related_id : this.formLb.target == 5 ? this.formLb.default_redirect_url : this.formLb.redirect_url
                }
                if(this.isSuper){
                    postData('components/getOrganization').then(res => {
                        if(res.res_code == 1) this.organizationList = res.data
                    })
                }else this.formLb.organization_id = +sessionStorage.getItem('organizationId')
                if(this.formLb.target == 5) {
                    postData('components/getOthersPage').then(res => {
                        if(res.res_code == 1) this.htmlList = res.data
                    })
                }else if(this.formLb.target == 4){
                    postData('platform/news/getNewsListAdmin',{page_size: 500, page_num: 1}).then(res => {
                        if(res.res_code == 1) this.htmlList = res.data.list
                    })
                }
            },
            organizationChange(val) {
                if(val){
                    let url = this.formLb.target == 5 ? 'components/getOthersPage' : this.formLb.target == 4 ? 'platform/news/getNewsListAdmin' : this.formLb.target == 1 ? 'components/getLivesByOrganization' : this.formLb.target == 2 ? 'components/getSingleProductsByOrganization' :  'components/getCollectionsByOrganization'
                    postData(url, {organization_id: this.formLb.organization_id, page_size: 9999, page_num: 1}).then(res => {
                        if(res.res_code == 1) this.htmlList = this.formLb.target == 4 ? res.data.list:  res.data
                    })
                }
            },
            submitLb(data) {
                if(this.isAdd) {
                    postData('platform/banner/addBanner', data).then(res => {
                        if(res.res_code == 1) this.$router.push('advertising-map')
                    })
                }else {
                    postData('platform/banner/modifyBanner', data).then(res => {
                        if(res.res_code == 1) this.$router.push('advertising-map')
                    })
                }
            },
            submit() {
                this.$refs.formValidate.validate((valid) => {
                    if(valid) {
                        let data = this.formLb
                        data.related_id = data.target < 5 ? data.router_url : ''
                        data.default_redirect_url = data.target == 5 ? data.router_url : ''
                        data.redirect_url = data.target == 6 ? data.router_url : ''
                        data.position = sessionStorage.getItem('AdvertisingMap') == 'home' ? 1 : 2
                        if(data.position == 2){
                            if(data.web_img_url && data.mobile_img_url) {
                                data.web_background_img_url = ''
                                data.mobile_background_img_url = ''
                                this.submitLb(data)
                            }else{
                                this.$Message.info('请上传图片')
                            }
                        }else{
                            if(data.web_img_url && data.mobile_img_url && data.web_background_img_url && data.mobile_background_img_url) {
                                this.submitLb(data)
                            }else{
                                this.$Message.info('请上传图片')
                            }
                        }
                    }
                })
            },
        },
        mounted() {
            this.isSuper = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
            this.local = sessionStorage.getItem('AdvertisingMap') == 'home' ?   true :  false
            this.getInit()
        }
    }
</script>

<style scoped lang="less">
    .target-exam{
        color: #9397AD;
    }
    .screen{
        background-color: #fff;
        box-shadow: 0 0 8px 0 rgba(0,0,0,0.19);
    }
    /deep/ .md-cloud-upload{
        margin-top: 30px;
        width: 50px;
    }
    /deep/ .upload-space{
        background-color: #f0f0f7 !important;
        margin: 10px 0 10px 10px !important;
    }
    /deep/ .upload-img{
        border: none !important;

        img{
            height: 148px !important;
            margin-top: 10px !important;
        }
    }
    /deep/ .ivu-form-item-label{
        font-size: 16px !important;
    }
    /deep/ .ivu-input{
        border-radius: 4px !important;
    }
    /deep/ .ivu-radio-large .ivu-radio-inner:after{
        width: 16px;
        height: 16px;
    }
    /deep/ .ivu-radio-inner:after{
        left: 3px;
        top: 3px;
        border-radius: 100%;
    }
    /deep/ .ivu-radio-large .ivu-radio-inner{
        width: 24px;
        height: 24px;
        margin-right: 3px;
    }
    /deep/ .ivu-radio-wrapper{
        font-size: 16px !important;
        margin-right: 16px;
    }
    /deep/ .ivu-form-item-content{
        text-align: left;
    }
    /deep/ .ivu-radio-group{
        margin-left: 8px;
    }
    /deep/ .ivu-select-selected-value, /deep/ .ivu-select-placeholder, /deep/ .ivu-select-selection, /deep/ .ivu-input, /deep/ .ivu-select-input{
        height: 42px !important;
        line-height: 42px !important;
        font-size: 16px !important;
    }
    .lb-upload-title{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0.25px;
        line-height: 22px;
        text-align: left;

        &::before{
            content: '*';
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 14px;
            color: #ff3300;
        }
    }
    .lb-upload-hint{
        text-align: left;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #9397AD;
        letter-spacing: 0.18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .lb-btn{
        width: 200px;
        height: 36px;
        margin: 40px auto 0 auto;
    }
    .form-lb-jump{
        display: inline-block;
        width: calc(50% - 8px);
        margin-left: 10px;
    }
    .form-lb-organization{
        display: inline-block;
        width: calc(50% - 8px);
    }
</style>

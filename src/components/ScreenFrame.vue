<template>
    <div class="screen"
         :style="(types == 4 || types == 8 || types == 9 || types == 12 || types == 16 || types == 17 || isWhite) ? backgroundColor:''">
        <div v-if="types == 6 || types == 7 || types == 8 || types == 9 || types == 13 || types == 18" class="back"
             @click="handleBack">
            <img class="back-img" src="../assets/icons/icon/back.png" alt="">
            <div class="back-title">返回</div>
        </div>
        <Select v-if="( types !== 33 && types !== 1 && types && types !== 6 && types !== 7 && types !== 9 && types !== 18) && selectType1 && isSuper"
                v-model="valueSelect1" @on-change="selectChange1" class="select-list" placeholder="请选择机构">
            <Option v-for="(item,i) in select" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <Select v-if="selectSubjects" v-model="valueSelect3" @on-change="selectChange3" class="select-list"
                placeholder="请选择学科">
            <Option v-for="item in select3" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <Select v-if=" ( types == 4 || types == 16 || types == 10 || types == 11 || types == 12 || types == 14 || types == 15) && selectType2"
                v-model="valueSelect2" @on-change="selectChange2" class="select-list" :placeholder="select2Placeholder">
            <Option v-for="item in select2" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
        <Select @on-change="cascaderType"  v-model="selCascade" placeholder="请选择产品" class="select-list cascaders" v-if="types == 20 || types == 21  " >
            <Option v-for="item in select2" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
        <Select v-if="types == 15 || types == 16 || types == 20" v-model="valueSelect5" @on-change="selectChange5" class="select-list">
            <Option v-for="item in select5" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
        <Select v-if="types == 15 || isSelTime" v-model="valueSelect6" @on-change="selectChange6" class="select-list">
            <Option v-for="item in select6" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
        <Select v-if="isBatch" @on-change="batchChange" v-model="batchVal" class="select-list">
            <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batch }}</Option>
        </Select>
        <Input v-if="types && types !== 6 && types !== 7 && types !== 9 && types != 10 && types != 13 && types != 12 && types !== 17 && types !== 18 &&types != 20&&types != 21"
               v-model="valueInput" :placeholder="placehodle ? placehodle : placehodleInput" @on-change="inputChange" class="input">
            <Icon type="md-search" slot="prefix"/>
        </Input>
        <DatePicker v-if="types == 5 || types == 19" type="datetimerange" format="yyyy-MM-dd HH:mm" :placeholder="dataPlaceholder"  class="screen-data-picker"
                    @on-change="dataPickerChange" @on-ok="dataPickerOk" @on-clear="dataPickerClear"></DatePicker>
        <DatePicker v-if="isDaterange" type="daterange" format="yyyy-MM-dd" :placeholder="dataPlaceholder"  class="screen-data-picker"
                    @on-change="dataPickerChange" @on-clear="dataPickerClear"></DatePicker>
        <!-- <div v-if="types == 5 && radioType && isSuper && payingStudent" class="money-student" @click="moneyStudent">
            <Icon :color="iconColor" size="20" type="md-radio-button-on" />
            <span class="money-student-content">付费学员</span>
        </div> -->
        <div v-if="types == 19" class="all-size">
            <span class="all-content">{{sizeTitle0}}</span>
            <span v-if='sizeNum0 >= 0' class="all-num">{{sizeNum0}}</span>
        </div>
        <div v-if="types && types !== 6 && types !== 7 || types == 11" class="all-size">
            <span class="all-content">{{sizeTitle1}}</span>
            <span v-if="typeof sizeNum1 == 'number'" class="all-num">{{sizeNum1}}</span>
            <span v-else class="all-num" v-html="handleSizeNum(sizeNum1)"></span>
        </div>
        <div v-if="(types ==3 || types == 5 || types ==8 || types == 19)  && isSuper && sizeTitle2" :class="types == 19 ? 'all-size' : 'money-size'">
            <span class="all-content">{{sizeTitle2}}</span>
            <span v-if='sizeTitle1=="支付订单"&&(sizeNum2 === 0 || sizeNum2)' class="all-num">{{sizeNum2}}</span>
            <span v-if='sizeNum2 != 0' class="all-num">{{sizeNum2}}</span>
        </div>
        <div v-if="types == 6 || types == 7 || types == 9 || types == 10 || types == 12 || types == 13 || types == 18" class="title">
            <div>{{title}}</div>
        </div>
        <Select v-if="types == 13" v-model="valueSelect4" @on-change="selectChange2" class="select-list4"
                :placeholder="select2Placeholder">
            <Option v-for="item in select4" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
        <div class="online-mode" v-if="types == 33">
            <span style="margin-right: 10px;">课程显示形式</span>
            <RadioGroup @on-change="changeMode" v-model="online_show_mode">
                <Radio :label="0">封面标题显示</Radio>
                <Radio :label="1">目录显示</Radio>
            </RadioGroup>
        </div>
        <Button v-if="types && types !== 5 && types !== 7 && types !== 9 && btnType" class="btn" type="primary"
                @click="handleClick" style="right: 120px;">{{btnName}}</Button>
        <Button v-if="types == 5" @click="handleClick" style="position: absolute; right: 120px;">{{btnName}}</Button>
        <Button v-if="types == 18 || isButton2" @click="handleClick2" style="position: absolute; right: 15px;">{{btnName2}}</Button>
        <Button v-if="isButton3" @click="handleClick3" style="position: absolute; right: 195px;">{{btnName3}}</Button>
        <p class="code_name_text" v-if="types == 8">{{codeName}}</p>
    </div>
</template>

<script>
    import postData from '../api/postData'

    export default {
        name: "ScreenFrame",
        data() {
            return {
                online_show_mode: null,
                batchVal: 'all',
                batchList: [ {batch: '全部学员', id: 'all'} ],
                selCascade: ['all'],
                valueSelect1: '',
                valueSelect2: '',
                valueSelect3: '',
                valueSelect4: '',
                valueSelect5: '',
                valueSelect6: '',
                valueInput: '',
                placehodleInput: '搜索用户名/姓名/手机号',
                iconColor: '#9397AD',
                backgroundColor: 'background: #fff',
                isSuper: false,
                select: [{id: 'all', title: '全部机构'}],
                subjectsSelect3: [{id: 'all', name: '全部学科'}],
                select3: [],
                canRun: true,
                changeOnSelect: false,
            }
        },
        props: {
            //types=1：搜索框+数量+按钮； types=2：下拉框+搜索框+数量+按钮； types=3：下拉框+搜索框+数量*2+按钮； types=4：下拉框*2+搜索框+数量+按钮；
            //types=5：下拉框*2+搜索框+付费学员+数量*2； types=6：返回+标题+按钮； types=7：返回+标题； types=8 兑换码--使用记录
            //types = 10 下拉框+标题+按钮; types = 12 下拉框+标题;  types=13：返回+标题+下拉框; types = 14: 下拉框*2+搜索框
            //types = 15 下拉框*4+搜索框； types = 16 下拉框*3+搜索框+按钮； types = 17 数量+按钮 types = 18 返回+题目+按钮*2； types = 19 课程订单
            //types = 20 下拉框*3+数量*2 + daterange + Cascader 问答管理
            //types = 33 线上培训
            types: {
                type: Number,
                // required: true,
                default:0
            },
            isBatch: {
                type: Boolean,
                default: false
            },
            isDaterange: {
                type: Boolean,
                default: false
            },
            isSelTime: {
                type: Boolean,
                default: false
            },
            payingStudent: {
                type: Boolean,
                default: false
            },
            selectSubjects: {
                type: Boolean,
                default: false
            },
            // 控制 select
            selectType1: {
                type: Boolean,
                default: false
            },
            selectType2: {
                type: Boolean,
                default: false
            },
            radioType: {
                type: Boolean,
                default: false
            },
            // 控制按钮 的 显示隐藏
            btnType: {
                type: Boolean,
                default: false
            },
            select1: {
                type: Array
            },
            select2: {
                type: Array
            },
            select4: {
                type: Array
            },
            select5: {
                type: Array
            },
            select6: {
                type: Array
            },
            sizeTitle1: {
                type: String
            },
            sizeNum1: [Number, String],
            sizeTitle2: {
                type: String
            },
            sizeNum2: [Number, String],
            sizeTitle0: {
                type: String
            },
            sizeNum0: {
                type: Number
            },
            btnName: {
                type: String
            },
            btnName2: {
                type: String
            },
            btnName3: {
                type: String
            },
            title: {
                type: String
            },
            placehodle: {
                type: String
            },
            codeName: {
                type: String,
                default: ''
            },
            select2Placeholder: {
                type: String,
                default: '请选择'
            },
            dataPlaceholder: {
                type: String,
                default: '请选择时间范围'
            },
            isButton2: {
                type: Boolean,
                default: false
            },
            isButton3: {
                type: Boolean,
                default: false
            },
            isWhite:  {
                type: Boolean,
                default:false
            }
        },
        mounted() {
            if(this.types == 33) {
                this.online_show_mode = JSON.parse(sessionStorage.getItem('PRODUCTINFO')).online_show_mode
            }
            // if(this.select1 && this.select1.length) this.valueSelect1 = this.select1[0].value
            this.setSelectInit('select2', 'valueSelect2')
            this.setSelectInit('select5', 'valueSelect5')
            this.setSelectInit('select6', 'valueSelect6')
            if (this.select4 && this.select4.length) {
                this.$nextTick(() => {
                    if (this.$route.name == 'curriculum' && this.select4.length > 0) {
                        this.valueSelect4 = 3
                    }
                    if (this.$route.name == 'job-list') this.valueSelect4 = 1
                })
            }
            this.isSuper = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
            postData('components/getOrganization').then((res) => {
                this.select = [...this.select, ...res.data]
                this.valueSelect1 = this.select[0].id
            })
            if (this.selectSubjects) this.getSubjectsList()
            if(this.isBatch&&!this.isSuper) this.getBatchList(+sessionStorage.getItem('organizationId'))
        },
        methods: {
            changeMode(val){
                this.$emit('changeMode', val)
            },
            batchChange(val){
                val = val == 'all' ? '' : val
                this.$emit('resetPage')
                this.$emit('batchChange', val)
            },
            getBatchList(organization_id){
                let d = {
                    organization_id,
                    batch: '', 
                    page_size: 9999,
                    page_num: 1,
                }
                PostData('user/getBatchList', d).then((r) => {
                    if(r.res_code == 1){
                        let da = r.data.data
                        this.batchList = [{batch: '全部学员', id: 'all'}, ...da]
                    }
                })
            },
            handleChangeOnSelect (value) {
              this.changeOnSelect = value
            },
            cascaderType(v){
                // console.log(v);
                this.$emit('resetPage')
                this.$emit('cascaderChange', v)
            },
            loadData (item, callback) {
                item.loading = true;
                setTimeout(() => {
                    if(item.value != 'all'){
                        PostData('product/curriculum_online/pulldown_get_list', {product_id: item.value}).then((r) => {
                            if(r.res_code == 1) {
                                r.data.map((t) => {
                                    t.value = t.id
                                    t.label = t.title
                                })
                                item.children = r.data;
                                item.loading = false;
                                callback();
                            }
                        })
                    }
                }, 1000);
            },
            setSelectInit(list, valueSelect) {
                if (this[list] && this[list].length) {
                    this[valueSelect] = this[list][0].id
                }
            },
            // 付费学员返回事件，click触发，选中返回true
            moneyStudent() {
                this.iconColor = this.iconColor == '#9397AD' ? "#4098ff" : "#9397AD"
                this.$emit('moneyStudent', this.iconColor == '#9397AD' ? 'NO' : 'YES')
            },
            handleSizeNum(s) {
                if (s) {
                    let arr = s.split('/');
                    let s1 = arr[0] && arr[0] != 'null' ? arr[0] : ''
                    let s2 = arr[1] && arr[1] != 'null' ? '/' + arr[1] : ''
                    return s1 + `<span style="color:#9397AD">${s2}</span>`
                }
                return ''
            },
            //一个下拉框，change触发，返回value
            selectChange1(val) {
                if (val == 'all') val = ''
                this.$emit('resetPage')
                this.$emit('selectChange1', val)
                if(this.isBatch) this.getBatchList(val)
            },
            //第二个下拉框，change触发，返回value
            selectChange2(val) {
                this.$emit('resetPage')
                this.$emit('selectChange2', val)
            },
            selectChange5(val) {
                this.$emit('resetPage')
                this.$emit('selectChange5', val)
            },
            selectChange6(val) {
                this.$emit('resetPage')
                this.$emit('selectChange6', val)
            },
            //第三个下拉框
            selectChange3(val) {
                this.$emit('resetPage')
                this.$emit('selectChange3', val)
            },
            //输入事件，change触发，返回model
            inputChange() {
                clearTimeout(this.canRun)
                this.canRun = setTimeout(() => {
                    this.$emit('resetPage')
                    this.$emit('inputChange', this.valueInput)
                },500)
            },
            //按钮，click触发事件
            handleClick() {
                this.$emit('handleClick')
            },
            handleClick2() {
                this.$emit('handleClick2')
            },
            handleClick3() {
                this.$emit('handleClick3')
            },
            //返回按钮触发事件
            handleBack() {
                this.$emit('handleBack')
            },
            getSubjectsList() {
                postData('/components/getDepts').then((res) => {
                    this.select3 = [...this.subjectsSelect3, ...res.data]
                    this.$nextTick(() => {
                        this.valueSelect3 = this.select3[0].id
                    })
                })
            },
            dataPickerChange(val) {
                this.$emit('dataPickerChange', val)
            },
            dataPickerOk() {
                this.$emit('resetPage')
                this.$emit('dataPickerOk')
            },
            dataPickerClear() {
                this.$emit('resetPage')
                this.$emit('dataPickerClear')
            }
        }
    }
</script>

<style scoped lang="less">
    @import url('../css/input.less');
    .online-mode{
        display: flex;
        align-items: center;
        margin-left: 30px;
    }
    /deep/ .cascaders{
        /deep/ .ivu-input{
            padding-left: 24px !important;
        }
    }
    /deep/ .ivu-cascader-menu-item{
        text-align: left !important;
    }
    .screen {
        height: 66px;
        min-width: 800px;
        background: #F0F0F7;
        display: flex;
        align-items: center;
        position: relative;
    }

    /deep/ .ivu-select-selection {
        border-radius: 100px;
        height: 36px;
        padding-left: 15px;
    }

    /deep/ .ivu-select-placeholder {
        font-size: 16px !important;
    }

    .money-student {
        min-width: 130px;
        width: 130px;
        height: 36px;
        background-color: #fff;
        display: flex;
        align-items: center;
        border-radius: 100px;
        margin-left: 10px;
        cursor: pointer;

        &:hover {
            .money-student-content {
                color: #4098ff;
            }
        }

        /deep/ .ivu-icon-md-radio-button-on {
            margin-left: 16px;
        }

        .money-student-content {
            margin-left: 10px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
        }
    }

    .all-size {
        margin-left: 20px;
        min-width: 96px;
    }

    .money-size {
        min-width: 102px;
        border-left: 1px solid #CDCED3;
        margin-left: 12px;
        padding-left: 12px;
    }

    .all-content {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .all-num {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
        margin-left: 5px;
    }

    .all-list {
        margin-right: 12px;
    }

    .btn {
        width: 110px;
        height: 36px;
        position: absolute;
        right: 34px;
    }

    .select-list {
        width: 200px;
        margin-left: 21px;
    }
    /deep/.select-list .ivu-select-selected-value, /deep/.select-list4 .ivu-select-selected-value{
        height: 36px!important;
        line-height: 36px !important;
    }

    .select-list4 {
        width: 120px;
        position: absolute;
        right: 100px;
    }

    .back {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 40px;
        cursor: pointer;

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

    .title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .code_name_text {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        position: absolute;
        right: 40px;
    }

    @media screen and (max-width: 1500px) {
        .select-list {
            width: 150px;
            margin-left: 15px;
        }

        .input {
            width: 150px
        }

        .btn {
            right: 20px;
        }
    }

    @media screen and (max-width: 1279px) {
        .select-list {
            width: 140px;
            margin-left: 10px;
        }

        .input {
            width: 150px
        }

        .btn {
            right: 10px;
        }
    }

    .selecg-title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0.22px;
        margin-left: 20px;
    }
    .screen-data-picker{
        width: 260px !important;
        margin-left: 10px !important;

        /deep/ .ivu-btn{
            display: inline-block !important;
        }

        /deep/ .ivu-input{
            padding-left: 15px !important;
        }
    }
</style>

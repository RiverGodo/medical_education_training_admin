<template>
    <div class="amap-page-container">
        <Modal :width="500" v-model="show" title="签到地址所在机构" footer-hide>
            <div class="am-modal">
                <div class="am-sel">
                    <span>选择机构：</span>
                    <Select class="select-list" v-model="valueSelect1">
                        <Option v-for="t in select" :value="t.id" :key="t.id">{{t.title}}</Option>
                    </Select>
                </div>
                <Button class="am-btn" @click="addMap2" type="primary">保存</Button>
            </div>
        </Modal>
        <div class="add-map" @click="addMap">添加常用</div>
        <el-amap-search-box class="search-box" :search-option="searchOption"
                            :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" class="amap-demo" :plugin="plugin">
            <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :content="setContent(marker, index)"
                            :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"
                            :vid="index"></el-amap-marker>
            <el-amap-info-window
                    :position="currentWindow.position"
                    :content="currentWindow.content"
                    :visible="currentWindow.visible"
                    :events="currentWindow.events"
                    :offset="currentWindow.offset"
                    :autoMove="false"
                    :closeWhenClickMap="true">
            </el-amap-info-window>
        </el-amap>
    </div>
</template>

<script>
    import {lazyAMapApiLoaderInstance} from 'vue-amap';
    import bs1 from '../../../assets/img/mark_bs_1.png'
    import bs2 from '../../../assets/img/mark_bs_2.png'
    import postData from "../../../api/postData";

    module.exports = {
        data: function () {
            return {
                show: false,
                isSuper: false,
                select: [],
                valueSelect1: 'all',
                ruleValidate: { required: true, message: '请选择机构' , trigger: 'change'},
                searchOption: {
                    city: '全国',
                },
                mapCenter: [120.121498,30.222574],
                plugin: [{
                    pName: 'Scale',
                    events: {
                        init(instance) {
                            console.log(instance);
                        }
                    }
                }],
                markers: [],
                map: null,
                content: "",
                marker_event: {
                    click: () => {
                        console.log(123);
                    }
                },
                currentWindow: {
                    position: [0, 0],
                    offset: [0,-14],
                    content: '',
                    visible: false,
                    closeWhenClickMap: true,
                    events: {}
                },
                add_content: '',
            };
        },
        computed: {
            getOrganizationId(){
                return this.isSuper ? this.valueSelect1 : +sessionStorage.getItem('organizationId')
            },
        },
        methods: {
            setInit(){
                this.isSuper = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
                PostData('components/getOrganization').then((res) => {
                    this.select = res.data
                })
            },
            setContent(marker, index) {
                return `<div class="marker-sign"><div class="marker-sign-num">${index + 1}</div></div>`
            },
            addMarker: function () {
                let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
                let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
                this.markers.push([lng, lat]);
            },
            onSearchResult(pois) {
                let latSum = 0;
                let lngSum = 0;
                this.add_content = ''
                if (pois.length > 0) {
                    this.markers = []
                    pois.forEach((poi, index) => {
                        let {lng, lat} = poi;
                        lngSum += lng;
                        latSum += lat;
                        this.markers.push({
                            position: [poi.lng, poi.lat],
                            events: {
                                click: (e) => {
                                    if(document.querySelector('.marker-sign-tab')) document.querySelector('.marker-sign-tab').className = 'marker-sign';
                                    var list = document.querySelectorAll('.marker-sign')
                                    list.forEach(item => {
                                        if(item.children[0].innerHTML == index + 1) {
                                            item.className = 'marker-sign-tab'
                                        }
                                    })
                                    this.add_content = poi
                                },
                                mouseover: (e) => {
                                    this.currentWindow = {
                                        position: [poi.lng, poi.lat],
                                        offset: [0,-18],
                                        content: poi.name,
                                        visible: true,
                                        closeWhenClickMap: true,
                                    }
                                },
                                mouseout: () => {
                                    this.currentWindow.visible = false
                                },
                                dragend: (e) => {
                                    // this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
                                }
                            },
                            visible: true,
                            draggable: false,
                        });
                    });
                    let center = {
                        lng: lngSum / pois.length,
                        lat: latSum / pois.length
                    };
                    this.mapCenter = [center.lng, center.lat];
                }else this.markers = []
                this.$forceUpdate()
            },
            addMap2(){
              if(this.valueSelect1) {
                  this.addItem()
                  this.show = false
              }
              else this.$Message.info('请选择机构！')
            },
            addItem(){
                let data = {
                    organization_id: this.getOrganizationId,
                    location_name: this.add_content.name,
                    radius: 100,
                    lng: this.add_content.lng,
                    lat: this.add_content.lat,
                    address: this.add_content.address,
                    img_url: `https://restapi.amap.com/v3/staticmap?key=7b7d29e44f0b92aeb0f049b53af18b72&size=700*400&zoom=17&location=${this.add_content.lng},${this.add_content.lat}&markers=-1,http://sfile.9mededu.com/wenda/20190917144209.png,0:${this.add_content.lng},${this.add_content.lat - 0.00027}`
                }
                postData('product/addLocation',data).then(res => {
                    if(res.res_code == 1) {
                        this.$emit('isAdd')
                        this.$Message.success(res.msg)
                        this.markers = []
                    }
                })
            },
            addMap() {
                if(this.add_content){
                    if(this.isSuper) this.show = true
                    else this.addItem()
                }else this.$Message.info('请先选择地址')
            }
        },
        mounted() {
            this.setInit()
            // lazyAMapApiLoaderInstance.load().then(() => {
            //     this.map = new AMap.Map('amapContainer', {
            //         center: new AMap.LngLat(121.59996, 31.197646)
            //     });
            //     console.log(AMap.GeometryUtil.distance([116.398075, 39.909203], [116.397646, 39.903804]));
            // });
            document.querySelector('.search-box-wrapper').style.justifyContent = 'space-between'
            document.querySelector('.search-box-wrapper').children[0].style.flex = 'unset'
            document.querySelector('.search-box-wrapper').children[0].style.width = '240px'
        }
    };
</script>

<style scoped lang="less">
    .am-modal{
        padding: 14px;
        height: 260px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        .am-sel{
            width: 100%;
            display: flex;
            align-items: center;
            .select-list{
                flex: 1;
                margin-left: 10px;
            }
        }
        .am-btn{
            position: absolute;
            bottom: 14px;
            width: 120px;
        }
    }
    .amap-demo {
        /*height: 800px;*/
        height: 100%;
    }

    .search-box {
        position: absolute;
        top: 25px;
        left: 20px;
    }

    .amap-page-container {
        position: relative;
        height: calc(100% - 56px);
    }

    /deep/ .marker-sign {
        height: 33px;
        width: 19px;
        cursor: pointer;
        background-image: url('//sfile.9mededu.com/wenda/20190912111917.png');
        background-size: contain;

        &:hover {
            background-image: url('//sfile.9mededu.com/wenda/20190912111813.png');
        }
    }

    /deep/ .marker-sign-tab{
        height: 33px;
        width: 19px;
        cursor: pointer;
        background-image: url('//sfile.9mededu.com/wenda/20190912111813.png');
        background-size: contain;
    }

    /deep/ .marker-sign-num {
        color: #fff;
        position: absolute;
        left: 50%;
        transform: translateX(-50%)
    }
    /deep/ .amap-toolbar{
        right: 0 !important;
    }
    /deep/ .amap-info-close{
        display: none;
    }
    .add-map{
        position: absolute;
        top: 37px;
        left: 270px;
        z-index: 100;
        color: #4098ff;
        cursor: pointer
    }
</style>

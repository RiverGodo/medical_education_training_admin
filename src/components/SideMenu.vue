<template>
    <div class='side-menu'>
        <Row class='logo' type='flex' justify='center' align='middle'>
            <img :class="isLearn ? 'logo-img2' : 'logo-img'" :src='lImg'>
            <div v-if="!isLearn" class="logo-title">九划医教</div>
        </Row>
        <Row class="head-img-row" type='flex' justify='center' align='middle'>
            <div class='head-img'>
                <img :src='userHeader'>
            </div>
            <Poptip trigger="hover" :class="personalShow ? 'poptip-role-1' : 'poptip-role-3'" placement="right">
                <Button class='setting'>
                    <Icon class="icon-setting" type="md-settings"/>
                    <div class='hover-glow'></div>
                </Button>
                <div class="setting-data" slot="content">
                    <Button v-if="personalShow" type='text' class='quit' @click='personalData'>
                        个人资料
                    </Button>
                    <Button type='text' class='quit' @click='logout'>
                        退出登录
                    </Button>
                </div>
            </Poptip>
        </Row>
        <Row class='user-name'>
            <Tooltip v-if="userName" :content="userNameAll">{{userName}}</Tooltip>
            <div style="text-align: center" v-else>{{userNameAll}}</div>
        </Row>
        <Row class="menu-list">
            <Col>
                <Menu ref="side_menu" class="slider-menu" @on-open-change="openChange" @on-select="selectItem"
                      :active-name='activeIndex' :open-names="menuOpenName">
                    <div v-for="(it,index) in menuList" :key="index" v-if="it">
                        <Submenu v-if="it&&it.list" :name="it.name">
                            <template class="menu-padding" slot="title">
                                <div class="menu-item">
                                    <Icon :type="it.icon" size="20"/>
                                    <span style="margin-left: 10px;font-size: 16px">{{it.title}}</span></div>
                            </template>
                            <div v-for="(t, index) in it.list" :key="index">
                                <MenuItem :name="t.name" class="sub-item-title">
                                    <span>{{t.title}}</span>
                                </MenuItem>
                            </div>
                        </Submenu>
                        <MenuItem v-else :name="it.name">
                            <Icon :type="it.icon" size="20"/>
                            <span style="margin-left: 10px; font-size: 16px">{{it.title}}</span>
                        </MenuItem>
                    </div>
                </Menu>
            </Col>
        </Row>
    </div>
</template>
<script>
    import api from '../api/modules/config'
    import defaultHeader from '../assets/img/side-menu/default-header.jpg'
    import {MenuList, MenuToturList, cleanHtmlLabel, OperationManagement} from './Util'
    import postData from '../api/postData'

    export default {
        data() {
            return {
                isLearn: IS_LEARN,
                lTit: LOGO_TITLE,
                lImg: LOGO_IMG,
                use_router: true,
                activeIndex: "user-manage",
                menuOpenName: [],
                menuList: [],
                png: '.png',
                name: '',
                userName: '',
                userNameAll: ''
            }
        },
        computed: {
            userInfo() {
                return this.$store.state.auth.userInfo
            },
            personalShow() {
                return this.userInfo.role_id == 1 || this.userInfo.role_id == 2
            },
            userHeader() {
                if (!this.userInfo) return defaultHeader;
                if (this.userInfo.head_img_url) return this.userInfo.head_img_url;
                else return defaultHeader;
            },
        },
        methods: {
            personalData() {
                this.$router.push({path: '/dashboard/personal-data'})
            },
            openChange(name) {
                sessionStorage.setItem('menuOpenName', JSON.stringify(name));
                this.menuOpenName = name;
            },
            selectItem(index) {
                sessionStorage.setItem('menuActiveIndex', index);
                this.$router.push({name: index});
                this.activeIndex = index
            },
            logout() {
                api.post('user/logout', {from: 'web'}).then((res) => {
                    if (res.data.res_code === 1) {
                        let d = localStorage.getItem('login_user')
                        sessionStorage.clear()
                        this.$router.push({path: '/login'});
                        localStorage.setItem('login_user', d)
                    }
                });
            },
            setMenuActive() {
                let roleId = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id;
                let menuActive = roleId != 4 ? (sessionStorage.getItem('menuActiveIndex') ? sessionStorage.getItem('menuActiveIndex') : 'user-manage') : 'tutor-course'
                this.activeIndex = menuActive
                if (sessionStorage.getItem('menuOpenName')) this.menuOpenName = JSON.parse(sessionStorage.getItem('menuOpenName'))
                if (this.$route.name === 'user-manage') this.activeIndex = roleId != 4 ? 'user-manage' : 'tutor-course'
                if (this.$refs.side_menu) {
                    this.$nextTick(() => {
                        this.$refs.side_menu.updateOpened();
                        this.$refs.side_menu.updateActiveName();
                    })
                }
            },
            handleMenuList() {
                let roleId = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id;
                const ANWSER_ITEM = {
                    name: 'questions-answers',
                    title: '问答管理',
                    icon: 'md-chatboxes',
                }
                if (roleId == 4) this.menuList = MenuToturList
                else if (sessionStorage.getItem('PERMISSIONS')) {
                    let d = Base64.decode(sessionStorage.getItem('PERMISSIONS'));
                    let d1 = JSON.parse(d.slice(4))
                    if (d1 && d1.length > 0) {
                        d1.forEach(t => {
                            let num = +t.permission_code.slice(0, 2)
                            let p1 = () => {
                                if (num != 4 && num != 5 && num != 9&&num != 10) {
                                    if (num == 6) this.menuList.push(MenuList[3])
                                    else {
                                        this.menuList.push(MenuList[num - 1])
                                    }
                                }
                            }
                            let p2 = () => {
                                if (num == 5) this.menuList.push(MenuList[4])
                            }
                            let p3 = () => {
                                if (num == 4) {
                                    // if (roleId != 1) {
                                    //     MenuList[5].list.splice(1, 1)
                                    //     MenuList[5].list.splice(1, 1)
                                    // }
                                    this.menuList.push(MenuList[5])
                                }
                            }
                            let p4 = () => {
                                if (num == 9) {
                                    this.menuList.push(ANWSER_ITEM)
                                }
                            }
                            let p5 = () => {
                                if (num == 10) {
                                    this.menuList.splice(4, 0, OperationManagement)
                                    console.log(this.menuList,'KM')
                                }
                            }
                            (async () => {
                                await p1()
                                await p2()
                                await p3()
                                await p4()
                                await p5()
                            })()
                        });
                    }
                }
                console.log(this.menuList, 'aaaa');
            },
            getName() {
                let roleId = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id;
                if (roleId == 1) this.userNameAll = this.$config.status(roleId)
                else {
                    postData('components/getOrganization').then(res => {
                        res.data.forEach(item => {
                            if (item.id == JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).organization_id) {
                                this.userNameAll = item.title + this.$config.status(roleId)
                                if (this.userNameAll.length > 10) {
                                    this.userName = this.userNameAll.substring(0, 4) + '***' + this.userNameAll.substring(this.userNameAll.length - 4, this.userNameAll.length)
                                }
                            }
                        })
                    })
                }
            }
        },
        mounted() {
            new Promise((resolve, reject) => {
                this.handleMenuList()
                resolve()
            }).then(() => {
                this.setMenuActive()
            })
            this.getName()
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
        background: #292929;
    }

    /deep/ .setting-data {
        display: flex;
        flex-direction: column;
    }

    .sub-item-title {
        padding-top: 14px !important;
        padding-bottom: 14px !important;
    }

    /deep/ .ivu-icon-ios-settings {
        position: relative;
        top: -2px;
        margin-right: 5px;
    }

    /deep/ .ivu-menu-vertical .ivu-menu-submenu-title-icon {
        position: absolute;
        top: 20px;
        right: 10px;
        clear: both;
    }

    /deep/ .sub-item-title {
        padding-left: 112px !important;
    }

    /deep/ .ivu-menu {
        background-color: #333;
        width: 100% !important;
    }

    /deep/ .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        background: #292929 !important;
    }

    /deep/ .ivu-menu-item {
        display: flex;
        align-items: center;
    }

    /deep/ .ivu-menu-item, /deep/ .ivu-menu-submenu-title {
        text-align: left;
        color: #fff;
        padding-left: 78px;
    }

    /deep/ .ivu-menu-vertical.ivu-menu-light:after {
        content: none !important
    }

    /deep/ .ivu-menu-item-active {
        background-color: #292929;

        .ivu-menu-item {
            background-color: #292929;
        }
    }

    /deep/ .ivu-poptip-body {
        padding: 0
    }

    .poptip-role-1 {
        /deep/ .ivu-poptip-popper {
            top: 45px !important
        }
    }

    .poptip-role-3 {
        /deep/ .ivu-poptip-popper {
            top: 60px !important
        }
    }

    /deep/ .ivu-btn-text, /deep/ .ivu-btn {
        border: none
    }

    /deep/ .ivu-btn:focus {
        box-shadow: none
    }

    .side-menu {
        padding: 27px 0;
        height: 100%;

        .logo {
            margin-bottom: 40px;
        }

        .head-img-row {
            position: relative;

            .head-img {
                width: 100px;
                height: 100px;
                margin-bottom: 18px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
        }

        .setting, .setting:hover {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 26px;
            height: 26px;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border-color: #3DAAFF;
            background-color: #3DAAFF;
            color: #ffffff;
            text-align: center;
            line-height: 10px;

            .icon-setting {
                font-size: 18px;
            }

            cursor: pointer;

            .hover-glow {
                width: 34px;
                height: 34px;
                position: absolute;
                top: -4px;
                left: -4px;
                background-color: rgba(61, 170, 255, 0.2);
                border-radius: 50%;
                border: 0;
                display: none;
            }

            &:hover {
                .hover-glow {
                    display: block;
                }
            }
        }

        .user-name {
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            white-space: nowrap;
            padding: 0 35px;

            p {
                display: -webkit-box;
                white-space: normal;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 1;

                .md-alerts {
                    color: #3DAAFF;
                    margin-right: 10px;
                    font-size: 18px
                }
            }

            margin-bottom: 50px;
        }

        .menu-list {
            height: calc(100% - 240px);
            overflow: hidden;
            overflow-y: auto;
        }
    }
</style>

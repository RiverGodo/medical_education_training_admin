<template>
    <div class='login-container'>
        <div class="login-view" :style="loginViewStyl">
            <div class="login-left"></div>
            <div class='login-right'>
                <div class='logo'>
                    <img :class="isLearn ? 'logo-img2' : 'logo-img'" :src='lImg'> 
                    <span v-if="!isLearn">九划医教</span>
                </div>
                <h1 class="login-title">{{lTit}}</h1>
                <div class='data-input'>
                    <div class="elRow">
                        <img class="input-img" src='../assets/icons/img/head.png'>
                        <span class="input-span">|</span>
                        <input  class="el-input" placeholder="输入用户名" v-model="name" />
                    </div>
                    <div class="elRow">
                        <img class="input-img" src='../assets/icons/img/lock.png'>
                        <span class="input-span">|</span>
                        <input class="el-input" type='password' placeholder="输入密码" v-model="password" @keyup.enter="doLogin"/>
                    </div>
                </div>
                <div class='submit'>
                    <Button class="Button login-btn" :class='{isLogining:isLogining}' :disabled='isLogining' @click='doLogin' long>
                        <div class="elRow"><span>登录</span>
                            <EllipsisAni v-if='isLogining' diameter="5px" pColor="#ffffff"></EllipsisAni>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import EllipsisAni from '../components/EllipsisAni';
    import api from '../api/modules/config';
    import { login_pwd, user_info } from '../api/modules/auth';
    import { Base64 } from 'js-base64';
    import { mapState, mapActions } from 'vuex';
    import Vue from 'vue'
    export default {
        components: { EllipsisAni },
        data() {
            return {
                isLearn: IS_LEARN,
                lTit: LOGO_TITLE,
                lImg: LOGIN_LOGO_IMG,
                name: '',
                password: '',
                isLogining: false,
                loginViewStyl: {},
                projectData: [],
            }
        },
        methods: {
            doLogin() {
                this.isLogining = true;
                login_pwd(this.name, this.password).then((res) => {
                    if (res.data.res_code === 1) {
                        this.isLogining = false;
                        let d = res.data.data;
                        sessionStorage.setItem('organizationId',d.userInfo[0].organization_id)
                        sessionStorage.setItem('PERSONALDETAILS',JSON.stringify(d.userInfo[0]))
                        const ANWSER_ITEM = {
                            "permission_code": "090000",
                            "EN_name":"questions-answers",
                            "CN_name":"问答管理",
                            "type":"menu"
                        }
                        let da = [
                            ...d.permissions,
                            {
                                "permission_code":"080000",
                                "EN_name":"user_data",
                                "CN_name":"数据管理",
                                "type":"menu"
                            },
                            {
                                "permission_code": "100000",
                                "EN_name":"operation-management",
                                "CN_name":"运营管理",
                                "type":"menu"
                            }
                        ]
                        let da1 = (d.userInfo[0].role_id == 1 || d.userInfo[0].role_id == 2) ? [...da, ANWSER_ITEM] : [...d.permissions, ANWSER_ITEM]
                        console.log(da1,'da1');
                        sessionStorage.setItem('PERMISSIONS',Base64.encode('学格科技' + JSON.stringify(da1)))
                        sessionStorage.setItem('token',d.token)
                        this.$store.dispatch('get_user_info');
                        let d1 = { name: this.name, pass: this.password }
                        localStorage.setItem('login_user', Base64.encode(JSON.stringify(d1)))
                        if(d.userInfo[0].role_id == 4)  this.$router.push({ path: '/dashboard/tutor-course' });
                        else  this.$router.push({ path: '/dashboard/user-manage' });
                    } else {
                        this.$Message.warning(res.data.msg);
                        this.isLogining = false;
                    }
                });
            },
            setUser({name,pass}){
              this.name = name
              this.password = pass
            }
        },
        mounted() {
            if(localStorage.getItem('login_user')&&localStorage.getItem('login_user') != 'null'){
              let user = Base64.decode(localStorage.getItem('login_user'))
              let u = JSON.parse(user)
              this.setUser(u)
            }else this.setUser({name:'',pass:''})
            let hei = document.documentElement.clientHeight * .555;
            this.loginViewStyl = { 'width' :  (hei > 480 ? hei : 480) * 2 + 'px'}
        }
    }

</script>
<style lang="less" scoped>
    .login-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-image: url("../assets/icons/img/bitmap_bg.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .login-view{
        height: 55.5%;
        display: flex;
        flex-wrap: nowrap;
        min-height: 480px;
        .login-left {
            width: 50%;
            height: 100%;
            background-image: url("../assets/icons/img/bitmap.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            min-height: 480px;
        }
        .login-right {
            width: 50%;
            height: 100%;
            min-height: 480px;
            position: relative;
            background-color: #fff;
            padding-left: 10%;
            padding-right: 10%;
            padding-top: 9%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            .logo {
                width: 100%;
                margin-bottom:10.8%;
                position: relative;
                height: 38px;
                img {
                    /*height: 38px;*/
                    width: 38px;
                    float: left;
                }
                span{
                    font-family: PingFangSC-Semibold;
                    text-align: left;
                    font-size: 22px;
                    position: absolute;
                    letter-spacing: 1.5px;
                    left: 50px;
                }
            }
            .login-title{
                width: 100%;
                font-family: PingFangSC-Semibold;
                font-size: 24px;
                color: #333333;
                letter-spacing: 0;
                text-align: left;
                margin-bottom: 10.8%;
            }
            .data-input{
               width: 100%;
               .elRow {
                    margin-bottom: 14px;
                    border-bottom: 1px solid #EEE;
                    .input-img{
                        width: 18px;
                        height: 18px;
                        margin-right: 10px;
                    }
                    .input-span{
                        margin-right: 10px;
                        color: #EEE
                    }
                    /deep/ .ivu-select-single .ivu-select-selection{
                        width: 100%;
                        height: 48px;
                    }
                    /deep/ .ivu-select-selection{
                        border:none
                    }
                    /deep/ .ivu-select-visible .ivu-select-selection{
                        box-shadow: none
                    }
                    .el-input {
                        width: 100%;
                        height: 48px;
                        border: none;
                        color: #1f2d3d;
                        &:focus {
                            border-color: #3DAAFF;
                            background-color: #ffffff;
                            outline: none
                        }
                        ::-webkit-input-placeholder {
                            color: #99ABB4;
                        }
                        :-moz-placeholder {
                            color: #99ABB4;
                        }
                        ::-moz-placeholder {
                            color: #99ABB4;
                        }
                        :-ms-input-placeholder {
                            color: #99ABB4;
                        }
                    }
                }
            }
            .submit{
                margin-top: 10.8%;
                width: 60%;
                height: 50px;
            }
        }
    }
    .ivu-switch-checked{
        background-color: #69BA6D !important;
        border-color: #69BA6D !important
    }
    .ivu-btn,.ivu-btn:hover{
        width: 100%;
        height: 50px;
        border-radius: 25px;
        border: 0;
        background-color: #3DAAFF;
        color: #ffffff;
        font-size: 16px;
        line-height: 29px;
    }
</style>

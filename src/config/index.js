import Vue from 'vue';
import store from '../store';
import router from './router';
import { user_info } from '../api/modules/auth';
import { sync } from 'vuex-router-sync';
import { Message } from 'view-design';
import LoadingY from '../plug/index';
import './logo';
import config from './config';
import { Base64 } from 'js-base64';
import postData from '../api/postData'
import baseUrl from '../../config/url'
import platformUrl from '../../config/platform_url';

Vue.prototype.$config = config;
window.$OnLine = new Vue()
window.$SplitGroupRefresh = new Vue()
window.$MakeAppointment = new Vue()
global.PostData = postData
global.BaseUrl = baseUrl
global.PlatformUrl = platformUrl
Vue.use(LoadingY)
// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)
router.beforeEach((to, from, next) => {
    let toLogin = () => {
      // if (to.name == 'login') {
      //     next();
      // }
      // else {
      //     sessionStorage.clear();
      //     next({path: '/login'});
      // }
      next();
    }
    if(sessionStorage.getItem('token') && to.name === 'login') {
        let roleId = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id;
        if(roleId != 4)  {
            next({name: 'user-manage'})
        }
        else  {
            next({name: 'tutor-course'})
        }
    }else if (store.state.auth.userInfo || to.name === 'login') {
        next();
    } else {
        if (sessionStorage.getItem('token') && to.name !== 'login') {
            postData('user/getUserPermission',{from:"web"}).then((res) => {
                if(res.res_code === 1 && res.data){
                    sessionStorage.setItem('token',res.data.token)
                    let roleId = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id;
                    let da = [
                        ...res.data.permissions,
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
                    const ANWSER_ITEM = {
                        "permission_code": "090000",
                        "EN_name":"questions-answers",
                        "CN_name":"问答管理",
                        "type":"menu"
                    }
                    let da1 = (roleId == 1 || roleId == 2) ? [...da, ANWSER_ITEM] : [...res.data.permissions, ANWSER_ITEM]
                    sessionStorage.setItem('PERMISSIONS',Base64.encode('学格科技' + JSON.stringify(da1)));
                    user_info().then((res) => {
                        if (res.data.res_code === 1) {
                            let d = res.data.data;
                            sessionStorage.setItem('organizationId',d.organization_id)
                            store.dispatch('set_user_info', d);
                            sessionStorage.setItem('PERSONALDETAILS',JSON.stringify(d))
                            next();
                        } else toLogin()
                    })
                }else{
                    Message.warning('暂无权限');
                    toLogin()
                }
            })
        }else toLogin()
    }
})
export default router;

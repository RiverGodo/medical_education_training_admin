import * as types from '../types'
import api from '../../api/modules/config'
import { user_info } from '../../api/modules/auth'

const state = {
    userInfo:null,
    isLogin:true,
    sex_list:[{id:0,name:'女'},{id:1,name:'男'}]
}


// actions
const actions = {
    get_user_info({ commit }, payload) {
        user_info().then(res => {
            if(res.data.res_code === 1){
                commit(types.USERINFO_SETTED,res.data.data)
            }else commit(types.USERINFO_NULL)
        })
    },
    set_user_info({ commit },param) {
        commit(types.USERINFO_SETTED,param)
    }
}
// mutations
const mutations = {
    [types.USERINFO_LOADED] (state,param) {
        state.userInfo = param.data;
        state.isLogin = true;
        
        if(param.callback){
          param.callback();
        }
    },
    [types.USERINFO_SETTED] (state,param) {
        state.userInfo = param;
        // state.isLogin = true;
    },
    [types.USERINFO_NULL] (state) {
        state.isLogin = false;
    }
}

export default {
    state,
    actions,
    mutations
}

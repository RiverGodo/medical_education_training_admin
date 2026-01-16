import * as types from '../types'
import api from '../../api/modules/config'
import { get_curriculum_data_center, add_data_center, delete_data_center } from '../../api/modules/tools_data_center'

const state = {
    course_download_data_list: [],
    public_download_data_list:[],
    isLoading:false,
    pre_curriculum_change_guard:null,
    total: null
}

const actions = {
    get_curriculum_donwload_data_list({ commit }, params)
    {
        commit(types.DOWNLOAD_SHOW_LOADING);
        get_curriculum_data_center(params.project_id, params.page, params.keyword).then(res => {
            if(res.data.res_code === 1){
                commit(types.CURRICULUM_DOWNLOAD_LIST_LOADED,res.data.data);
            }
        })
    },
    add_course_download_data({ dispatch,commit }, params) {
        commit(types.DOWNLOAD_SHOW_LOADING);
        add_data_center(params).then(res => {
            if(res.data.res_code === 1){
                dispatch('get_curriculum_donwload_data_list', {  project_id: params.projectId,
                    page: params.page})
                    params._fn()
                // commit(types.COURSE_DOWNLOAD_DATA_ADDED, {id:res.data.msg,data:params})
                // params._fn(res.data.msg);
            }
        })
    },
    delete_download_data({ commit },params) {
        commit(types.DOWNLOAD_SHOW_LOADING);
        delete_data_center(params).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.DOWNLOAD_DATA_DELETED, params)
            }
        })
    }
}
// mutations
const mutations = {
    [types.DOWNLOAD_SHOW_LOADING](state) {
        state.isLoading = true;
    },
    [types.SET_DOWNLOAD_CHANGE_PRE_GUARD](state, param) {
        state.pre_curriculum_change_guard = param;
    },
    [types.PUBLIC_DOWNLOAD_LIST_LOADED](state, param) {
        for (var i = 0; i < param.length; i++) {
            param[i].is_valid = param[i].state === 0?false:true;
        }
        state.public_download_data_list = param || state.public_download_data_list;
        state.isLoading = false;
    },
    [types.CURRICULUM_DOWNLOAD_LIST_LOADED](state, param) {
        // for (var i = 0; i < param.length; i++) {
        //     param[i].is_valid = param[i].state === 0?false:true;
        // }
        // state.course_download_data_list = param || state.course_download_data_list;
        state.total = param.count
        state.course_download_data_list = param.data;
        state.isLoading = false;
    },
    [types.DOWNLOAD_CHANGE_PRE_CURRICULUM](state, params) {
        // for(var i=0;i<state.course_download_data_list.length;i++)
        // {
        //     if(state.course_download_data_list[i].id === params.id)
        //     {
        //         state.course_download_data_list[i][params.key] = params.value.concat();
        //         break;
        //     }
        // }
        state.pre_curriculum_change_guard = null;
        state.isLoading = false;
    },
    [types.DOWNLOAD_DATA_VALID_UPDATED](state, params) {
        var found = false;
        var i;
        for (i = 0; i < state.course_download_data_list.length; i++) {
            if(state.course_download_data_list[i].id === params.id){
                state.course_download_data_list[i][params.key] = params.value;
                found = true;
                break;
            }
        }
        if(!found){
            for (i = 0; i < state.public_download_data_list.length; i++) {
                if(state.public_download_data_list[i].id === params.id){
                    state.public_download_data_list[i][params.key] = params.value;
                    break;
                }
            }
        }
        // if(state.isLoading) state.isLoading = false;
    },
    [types.COURSE_DOWNLOAD_DATA_ADDED](state, param) {
       state.course_download_data_list.push({
           id:param.id,
           name:param.data.name,
           download_url:param.data.download_url,
           state:1,
           pre_curriculum:[]
       });
       state.isLoading = false;
    },
    [types.PUBLIC_DOWNLOAD_DATA_ADDED](state, param) {
       state.public_download_data_list.push({
           // id:param.id,
           // name:param.data.name,
           // download_url:param.data.download_url,
           // state:1,
           // grade_id:param.data.grade_id,
           // subject_id:param.data.subject_id
           title: param.title
       });
       state.isLoading = false;
    },
    [types.DOWNLOAD_DATA_DELETED](state, param) {
        var found = false;
        var i;
        for (i = 0; i < state.course_download_data_list.length; i++) {
            if(state.course_download_data_list[i].id === param)
            {
                state.course_download_data_list.splice(i,1);
                found = true;
                break;
            }
        }
        if(!found)
        {
            for (i = 0; i < state.public_download_data_list.length; i++) {
            if(state.public_download_data_list[i].id === param)
            {
                state.public_download_data_list.splice(i,1);
                break;
            }
        }
        }
        state.isLoading = false;
    }
}

export default {
    state,
    actions,
    mutations
}


import * as types from '../types'
import api from '../../api/modules/config'
import {
    get_category_list,
    create_category,
    edit_category_by_id,
    delete_category_by_id,
    delete_task_by_id,
    get_curriculumlist_online
} from '../../api/modules/tools_task'

const state = {
    task_category_list: [],
    showLoading: false,
    total: null,
    activityTypeList: [{
        id: 1,
        name: '手动发送'
    }, {
        id: 2,
        name: '定时发送'
    }, {
        id: 3,
        name: '前置课发送'
    }],
    task_user_list: [],
    total_num: 0,
    cur_page: 1,
    page_size: 10,
    catch_every_page: {},
    curricum_list:[],
    homworkId:'',
    // activityTypeList:[{type:"online",name:'线上课'},{type:"underline",name:'线下课'}]
}
var catch_cid = ''

// actions
const actions = {
        get_task_category_list({ commit }, params) {
            commit(types.TASK_SHOW_LOADING);
            get_category_list(params.page, params.keyword,params.type).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_CATEGORY_LIST_LOADED, res.data.data);
                }
            }),
            get_curriculumlist_online().then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_CURRICUMLIST,{
                        result:res.data.data.data
                    })
                }
            })
        },
        get_curriculumlist_list({commit},params){
            get_curriculumlist_online(params).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_CURRICUMLIST,{
                        result:res.data.data.data
                    })
                }
            })
        },
        add_task_category({dispatch, commit }, params) {
            commit(types.TASK_SHOW_LOADING);
            create_category(params).then(res => {
                if (res.data.res_code === 1) {
                    dispatch('get_task_category_list',params)
                    params._fn();
                }
            })
        },
        edit_task_category({dispatch, commit }, params) {
            commit(types.TASK_SHOW_LOADING);
            edit_category_by_id(state.homworkId, params).then(res => {
                if (res.data.res_code === 1) {
                    dispatch('get_task_category_list',params)
                    params._fn();
                }
            })
        },
        delete_task({
            commit
        }, params) {
            commit(types.TASK_SHOW_LOADING);
            delete_task_by_id(params).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_DELETED, params);
                }
            })
        },
        change_homework_id({commit},params){
            commit(types.TASK_CHANGE_HOMEID,params)
        }
    }
    // mutations
const mutations = {
    [types.TASK_SHOW_LOADING](state) {
        state.showLoading = true;
    },
    [types.TASK_CATEGORY_LIST_LOADED](state, params) {
        state.total = params.count
        for (let i = 0; i < params.data.length; i++) {
            params.data[i].course = params.data[i].type == "online" ? '线上作业' : '线下作业'
        }
        state.task_category_list = params.data || state.task_category_list;
        state.showLoading = false;
    },
    [types.TASK_CATEGORY_ADDED](state, params) {
        state.task_category_list.push({
            // id: params.result,
            // name: params.data.name,
            // type: params.data.type,
            // task_list: []
            title:params.data.realname,
            curriculum_title:params.data.binding_course,
            type:params.data.jurisdiction
        });
        state.showLoading = false;
    },
    [types.TASK_CATEGORY_EDITED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === state.homworkId) {
                state.task_category_list[i].title = params.realname;
                state.task_category_list[i].curriculum_id = params.binding_course;
                state.task_category_list[i].type   = params.jurisdiction == 'online' ? '线上课' : '线下课';
              // state.task_category_list[i].type = params.jurisdiction;
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_CATEGORY_DELETED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params.task_category_id) {
                state.task_category_list.splice(i, 1);
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_LIST_LOADED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params.task_category_id) {
                state.task_category_list[i].task_list = params.result;
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_ADDED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params.data.task_category_id) {
                state.task_category_list[i].task_list.unshift({
                    id: params.result,
                    name: params.data.name,
                    grade_id: params.data.grade_id,
                    subject_id: params.data.subject_id,
                    activity_type: params.data.activity_type,
                    create_time: new Date().getTime()
                });
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_EDITED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params) {
                for (var j = 0; j < state.task_category_list[i].task_list.length; j++) {
                    if (state.task_category_list[i].task_list[j].id === params.task_id) {
                        state.task_category_list[i].task_list[j].name = params.name;
                        //state.task_category_list[i].task_list[j].grade_id = params.grade_id;
                        //state.task_category_list[i].task_list[j].subject_id = params.subject_id;
                        //state.task_category_list[i].task_list[j].activity_type = params.activity_type;
                        break;
                    }
                }
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_DELETED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params) {
                // for (var j = 0; j < state.task_category_list[i].task_list.length; j++) {
                //     if (state.task_category_list[i].task_list[j].id === params.task_id) {
                //         state.task_category_list[i].task_list.splice(j, 1);
                //         break;
                //     }
                // }
                state.task_category_list.splice(i, 1);
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_USERLIST_TY_TID](state, params){
      state.task_user_list = params.data.list;
      state.catch_every_page[params.task_id] = params.data.list;
      state.total_num = params.data.count;
      state.showLoading = false;
    },
    [types.TASK_CURRICUMLIST](state, params){
        state.curricum_list = params.result
    },
    [types.TASK_CHANGE_HOMEID](state, params){
        state.homworkId = params
    }
}

export default {
    state,
    actions,
    mutations
}

import * as types from '../types'
import api from '../../api/modules/config'
import {
    get_offline_term_list,
    get_offline_curriculum_list,
    select_add_term,
    delete_offline_term,
    delete_offline_curriculum,
    get_offline_curriculum_detail
} from '../../api/modules/tools_offline_curriculum'
import {
    get_students_by_offline_term,
    send_student_offline_curriculum
} from '../../api/modules/tools_student'
import dateFormat from '../../config/dateFormat'

const state = {
    offline_term_list: [],
    offline_curriculum_list: [],
    showLoading: false,
    loadingCurriculum: false,
    msg: '',
    result_msg: '',
    offline_curriculum_detail: {},
    catch_offline_curriculum_detail: {},
    offline_term_student: [],
    page_size: 12,
    page_index: 1,
    total_num: 0,
    receipt_list: [],
    receipt_total: 0,
    page_conut: 0
}
var cached = {};

// actions
const actions = {
    get_offline_term_list({commit}, param) {
        commit(types.OFFLINE_TERM_LIST_LOADING);
        cached = param;
        get_offline_term_list(param).then(function (res) {
            if (res.data.res_code === 1) {
                commit(types.OFFLINE_TERM_LIST_LOADED, res.data.data);
            }
        });
    },

    get_offline_curriculum_list({commit}, param) {
        commit(types.OFFLINE_CURRICULUM_LIST_LOADING, param)
        get_offline_curriculum_list(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.OFFLINE_CURRICULUM_LIST_LOADED, {
                    result: res.data.data,
                    term_underline_id: param.term_underline_id
                });
            }
        })
    },


    delete_offline_curriculum({commit, state}, payload) {
        commit(types.OFFLINE_CURRICULUM_DELETING);
        delete_offline_curriculum(payload.row.childData[payload.index].id).then(res => {
            if (res.data.res_code === 1) {
                commit(types.OFFLINE_CURRICULUM_DELETED, payload);
            }
        })
    },


    delete_offline_term({commit}, payload) {
        commit(types.OFFLINE_SEMESTER_DELETING);
        delete_offline_term(payload.row.id).then(res => {
            if (res.data.res_code == 1) {
                commit(types.OFFLINE_SEMESTER_DELETED, payload);
            }
        })
    },
    get_offline_curriculum_detail({commit, state}, payload) {
        commit(types.OFFLINE_LOADING_CURRICULUM_DETAIL);
        // if (!state.catch_offline_curriculum_detail[payload.row.childData[payload.index].id]) {
        get_offline_curriculum_detail(payload.row.childData[payload.index].id).then(res => {
            if (res.data.res_code == 1) {
                commit(types.OFFLINE_CURRICULUM_DETAIL, {
                    data: res.data.msg,
                    _id: payload.row.childData[payload.index].id,
                    callback: payload.callback
                });
            }
        })

    },
    get_students_by_offline_term({commit}, params) {
        commit(types.OFFLINE_TERM_LIST_LOADING);
        get_students_by_offline_term(params).then(res => {
            if (res.data.res_code == 1) {
                commit(types.QUERY_STUDENT_BY_OFFLINE_TERM, res.data.data);
            }
        })
    },
}
// mutations
const mutations = {
    [types.OFFLINE_TERM_LIST_LOADED](state, list) {
        state.page_conut = list.count
        for (var i = 0; i < list.data.length; i++) {
            list.data[i].childData = [];
            // list[i].is_valid = list[i].state === 0?false:true;
        }
        state.offline_term_list = list.data || state.offline_term_list;
        state.showLoading = false;
    },
    [types.OFFLINE_TERM_VALID_UPDATED](state, param) {
        for (var i = 0; i < state.offline_term_list.length; i++) {
            if (state.offline_term_list[i].id === param.id) {
                state.offline_term_list[i][param.key] = param.value;
                state.offline_term_list[i].state = param.value ? 1 : 0;
                break;
            }
        }
        if (state.showLoading) state.showLoading = false;
    },
    [types.OFFLINE_TERM_LIST_LOADING](state) {
        state.msg = '加载中...';
        state.showLoading = true;
    },

    [types.OFFLINE_CURRICULUM_LIST_LOADING](state, param) {
        state.showLoading = true;
    },

    [types.OFFLINE_CURRICULUM_LIST_LOADING](state, param) {
        state.loadingCurriculum = true;

    },
    [types.OFFLINE_CURRICULUM_LIST_LOADED](state, params) {
        let d = params.result;
        d.map((t) => {
            t.type_text = t.type == 1 ? '讲座' : '实践'
        })
        for (var i = 0; i < state.offline_term_list.length; i++) {
            if (state.offline_term_list[i].id === params.term_underline_id) {
                state.offline_term_list[i].childData = d
                break;
            }
        }
        state.offline_curriculum_list = params.result;
        if (state.showLoading) state.showLoading = false;
    },
    [types.OFFLINE_CURRICULUM_ADDING](state, msg) {
        state.msg = '请稍等...'
        state.showLoading = true;
    },
    [types.OFFLINE_CURRICULUM_ADDED](state, payload) {
        for (var i = 0; i < state.offline_term_list.length; i++) {
            if (state.offline_term_list[i].id === payload.offline_term_id) {
                payload.id = payload.offline_term_id;
                var item = {
                    end_time: payload.start_time,
                    id: payload.id,
                    start_time: payload.start_time,
                    teacher_name: payload.teacher_name,
                    title: payload.title,
                    type: Number(payload.type)
                }
                state.offline_term_list[i].childData.push(item);
                if (state.offline_term_list[i].childData.length == 1) {
                    state.offline_term_list[i].childData = [];
                }
                state.offline_term_list[i].curriculum_count++;
            }
        }
        state.showLoading = false;
    },
    [types.OFFLINE_CURRICULUM_DELETING](state, msg) {
        state.msg = '请稍等...'
        state.showLoading = true;
    },
    [types.OFFLINE_CURRICULUM_DELETED](state, payload) {
        state.offline_term_list.map((item, index) => {
            if (item.id == payload.row.id) {
                state.offline_term_list[index].childData.splice(payload.index, 1);
                state.offline_term_list[index].curriculum_count--;
            }
        })
        state.showLoading = false;
    },
    [types.OFFLINE_CURRICULUM_EADITING](state, msg) {
        state.msg = '请稍等...'
        state.showLoading = true;
    },
    [types.OFFLINE_CURRICULUM_EADITED](state, payload) {
        var list = state.offline_term_list;
        list.map((item, index) => {
            if (item.id == payload.offline_term_id) {
                item.childData.map((_item, _index) => {
                    if (_item.id == payload.curriculum_id) {
                        _item.start_time = payload.start_time;
                        _item.end_item = payload.end_time;
                        _item.title = payload.title;
                        _item.type = payload.type;
                        _item.teacher_name = payload.teacher_name;
                    }
                })
            }
        });
        state.showLoading = false;
    },
    [types.OFFLINE_SEMESTER_ADDING](state, payload) {
        state.msg = '请稍等...'
        state.showLoading = true;
    },
    [types.OFFLINE_SEMESTER_ADDED](state, payload) {
        state.showLoading = false;
    },
    [types.OFFLINE_SEMESTER_DELETING](state, payload) {
        state.msg = '请稍等...'
        state.showLoading = true;
    },
    [types.OFFLINE_SEMESTER_DELETED](state, payload) {
        state.offline_term_list.splice(payload.index, 1);
        state.showLoading = false;
    },
    [types.OFFLINE_SEMESTER_EADITING](state, payload) {
        state.msg = '请稍等...'
        state.showLoading = true;
    },
    [types.OFFLINE_SEMESTER_EADITED](state, payload) {
        var list = state.offline_term_list;
        list.map((item, index) => {
            if (item.id == payload.offline_term_id) {
                if (payload.name)
                    item.name = payload.name;
                item.create_time = dateFormat(new Date);
                if (payload.start_time)
                    item.start_time = payload.start_time;
                if (payload.level)
                    item.level = payload.level;
                if (payload.end_time)
                    item.end_time = payload.end_time;
                if (payload.ex_time)
                    item.ex_time = payload.ex_time;
                if (payload.description)
                    item.description = payload.description;
            }
        });
        state.showLoading = false;
    },
    [types.OFFLINE_LOADING_CURRICULUM_DETAIL](state, payload) {
        state.showLoading = true
    },
    [types.OFFLINE_CURRICULUM_DETAIL](state, payload) {
        // debugger;
        // state.catch_offline_curriculum_detail[payload._id] = payload.data;
        state.offline_curriculum_detail = payload.data;
        state.showLoading = false;
        payload.callback();
    },
    [types.QUERY_STUDENT_BY_OFFLINE_TERM](state, params) {
        let d = params.data, m = params.data_added;
        if (d && d.length > 0) {
            d.map((it) => {
                if (Array.isArray(m) && m.length > 0) {
                    m.forEach(t => {
                        if (it.student_id == t.student_id) {
                            it._disabled = true
                            it._checked = true
                        }
                    });
                }
            })
        }
        state.showLoading = false;
        state.offline_term_student = d;
        state.total_num = params.count;
    },
    [types.RECEIPT_LIST_LOADED](state, params) {
        state.showLoading = false;
        state.receipt_list = params.results;
        state.receipt_total = params.total_count;
    },
    [types.OFFLINE_COURSE_RECEIPT_EADITED](state, params) {
        var list = state.receipt_list;
        list.map((item, index) => {
            if (item.otr_id == params.otr_id) {
                item.name = params.name;
                item.sex = params.sex;
                item.idcard = params.idcard;
                item.phone = params.phone;
                item.email = params.email;
                item.estimate_set_out_city_id = params.estimate_set_out_city_id;
                item.estimate_set_out_province_id = params.estimate_set_out_province_id;
                item.estimate_set_out_time = params.estimate_set_out_time;
            }
        });
        state.showLoading = false;
    }
}

export default {
    state,
    actions,
    mutations
}

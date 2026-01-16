import * as types from '../types'
import api from '../../api/modules/config'
import {
    get_list,
    set_curriculum_orderby,
    add_curriculum,
    delete_curriculum,
    update_curriculum,
    change_curriculum_list
} from '../../api/modules/tools_curriculum'
import {get_catalog, delete_catalog} from '../../api/modules/tools_curriculum_catalog'
import {add_video, update_video, add_chapter} from '../../api/modules/tools_video'

const state = {
    online_curriculum_list: [],
    online_curriculum_old_list: [],
    msg: '',
    total: null,
    showChapterLoading: false,
    showMainLoading: false,
    newVideoTestId: 0,
    stateList: [
        {
            id: 1,
            name: '上架'
        }, {
            id: -1,
            name: '下架'
        }
    ]
}

// actions
const actions = {
    get_online_curriculum_list({
        commit
    }, param) {
        commit(types.ONLINE_CURRICULUM_LIST_LOADING);
        get_list(param.page, param.keyword).then(function (res) {
            if (res.data.res_code === 1) {
                commit(types.ONLINE_CURRICULUM_LIST_LOADED, res.data.data.data);
                commit(types.ONLINE_CURRICULUM_PAGE_LOADED, res.data.data);
            }
        });
    },
    change_online_curriculum_list({
        commit
    }, param) {
        change_curriculum_list(param.id, param.direction).then(res => {
            if (res.data.res_code == 1) {
                commit(types.CHANGE_CURRICULUM_LIST, param)
            }
        })
    },
    get_online_curriculum_chapter_list({
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_CHAPTER_LOADING);
        get_catalog(params).then(res => {
            if (res.data.res_code === 1) {
                commit(types.ONLINE_CURRICULUM_CHAPTER_LOADED, {
                    result: res.data.data,
                    curriculum_id: params.curriculum_online_id
                });
            }
        });
    },
    change_online_curriculum_orderby({
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_CHANGE_ORDERBY, params);
    },
    reset_online_curriculum_orderby({commit}) {
        commit(types.ONLINE_CURRICULUM_RESET_ORDERBY);
    },
    save_online_curriculum_orderby({commit}) {
        commit(types.ONLINE_CURRICULUM_ORDERBY_SAVING);
        var params = [];
        var order = 1;
        for (var i = 0; i < state.online_curriculum_list.length; i++) {
            params.push({curriculum_id: state.online_curriculum_list[i].curriculum_id, orderby: order});
            order++
        }
        set_curriculum_orderby(params).then(res => {
            if (res.data.res_code === 1) {
                commit(types.ONLINE_CURRICULUM_ORDERBY_SAVED);
            }
        })
    },
    change_online_curriculum_chapter_orderby({
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_CHAPTER_CHANGE_ORDERBY, params);
    },
    reset_online_curriculum_chapter_orderby({
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_RESET_CHAPTER_ORDERBY, params);
    },
    add_online_curriculum({
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_ADDING);
        add_curriculum(params).then(res => {
            if (res.data.res_code === 1) {
                commit(types.ONLINE_CURRICULUM_ADDED, {
                    data: params,
                    result: res.data.msg
                });
                get_list(params.page).then(function (res) {
                    if (res.data.res_code === 1) {
                        commit(types.ONLINE_CURRICULUM_LIST_LOADED, res.data.data.data);
                        commit(types.ONLINE_CURRICULUM_PAGE_LOADED, res.data.data);
                    }
                });
                params._fn();
            }
        })
    },
    edit_online_curriculum({
        dispatch,
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_EDITING);
        params
            .data
            ._fn();
        update_curriculum(params.data).then(res => {
            if (res.data.res_code === 1) {
                dispatch('ONLINE_CURRICULUM_EDITED', params.data)
            }
        })
    },
    ONLINE_CURRICULUM_EDITED({
        commit
    }, params) {
        get_list(params.page)
            .then(function (res) {
                if (res.data.res_code === 1) {
                    commit(types.ONLINE_CURRICULUM_LIST_LOADED, res.data.data.data);
                }
            });
        commit('ONLINE_CURRICULUM_ORDERBY_CLOSE')
    },
    delete_online_curriculum({
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_DELETING);
        delete_curriculum(params.id).then(res => {
            if (res.data.res_code === 1) {
                commit(types.ONLINE_CURRICULUM_DELETED, params.id);
                commit(types.ONLINE_CURRICULUM_PAGE_DELETE)
            }
        })
    },
    add_online_curriculum_video({
        dispatch,
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_CHAPTER_SHOW_LOADING);
        add_video(params).then(res => {
            if (res.data.res_code === 1) {
                dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: params.curriculum_online_id})
                // commit(types.ONLINE_CURRICULUM_VIDEO_ADDED, {result: res.data.msg, data:
                // params});
                params._fn();
            }
        })
    },
    add_online_curriculum_chapter({
        dispatch,
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_CHAPTER_SHOW_LOADING);
        add_chapter(params).then(res => {
            if (res.data.res_code === 1) {
                dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: params.curriculum_online_id})
                // commit(types.ONLINE_CURRICULUM_VIDEO_ADDED, {result: res.data.msg, data:
                // params}); params._fn();
            }
        })
    },
    edit_online_curriculum_video({
        dispatch,
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_CHAPTER_SHOW_LOADING);
        update_video(params).then(res => {
            if (res.data.res_code === 1) {
                dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: params.curriculum_online_id})
                params._fn();
            }
        })
    },
    delete_online_curriculum_catalog({
        dispatch,
        commit
    }, params) {
        commit(types.ONLINE_CURRICULUM_CHAPTER_SHOW_LOADING);
        delete_catalog(params.id).then(res => {
            if (res.data.res_code === 1) {
                commit(types.ONLINE_CURRICULUM_CATALOG_DELETED, params.id);
                dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: params.curriculum_online_id})
            }
        })
    },
    moveUpList({
        commit
    }, params) {
        commit(types.ONLINE_MOVE_UP_LIST)
    }
}
// mutations
const mutations = {
    [types.ONLINE_MOVE_UP_LIST](state, params) {
        state
            .online_curriculum_list
            .splice(params.index, 1, state.online_curriculum_list.splice[params.index])
    },
    [types.ONLINE_CURRICULUM_LIST_LOADED](state, list) {
        for (var i = 0; i < list.length; i++) {
            list[i].chapterList = [];
            state
                .online_curriculum_old_list
                .push(list[i]);
        }
        state.online_curriculum_list = list || state.list;
        state.showMainLoading = false;
    },
    [types.ONLINE_CURRICULUM_PAGE_LOADED](state, page) {
        state.total = page.count
    },
    [types.ONLINE_CURRICULUM_PAGE_DELETE](state) {
        state.total--
    },
    [types.ONLINE_CURRICULUM_LIST_LOADING](state) {
        state.showMainLoading = true;
    },
    [types.ONLINE_CURRICULUM_CHAPTER_LOADING](state) {
        state.showChapterLoading = true;
    },
    [types.ONLINE_CURRICULUM_CHAPTER_LOADED](state, params) {
        var i;
        for (i = 0; i < params.result.length; i++) {
            params.result[i].old_orderby = params.result[i].orderby;
        }
        state.online_curriculum_list = params.result
        // for (i = 0; i < state.online_curriculum_list.length; i++) {     if
        // (state.online_curriculum_list[i].id == params.curriculum_id) {
        // state.online_curriculum_list[i].chapterList = params.result;         break;
        //   } }
        state.showChapterLoading = false;
    },
    [types.ONLINE_CURRICULUM_CHANGE_ORDERBY](state, params) {
        if (params.dir == 0) 
            state.online_curriculum_list.splice(params.index, 1, ...state.online_curriculum_list.splice(params.index - 1, 1, state.online_curriculum_list[params.index]))
        else 
            state
                .online_curriculum_list
                .splice(params.index, 1, ...state.online_curriculum_list.splice(params.index + 1, 1, state.online_curriculum_list[params.index]))
            // var dir = params.dir;
        // var curriculum_id = params.curriculum_id; var selectItem; for (var i = 0; i <
        // state.online_curriculum_list.length; i++) {     if
        // (state.online_curriculum_list[i].curriculum_id === curriculum_id) {
        // if (dir === 0) {             if (i === 0)                 return;
        // else {                 selectItem = state.online_curriculum_list.splice(i,
        // 1)[0];                 state.online_curriculum_list.splice(i - 1, 0,
        // selectItem);             }         }         else {             if (i ===
        // state.online_curriculum_list.length - 1)                 return;
        // else {                 selectItem = state.online_curriculum_list.splice(i,
        // 1)[0];                 state.online_curriculum_list.splice(i + 1, 0,
        // selectItem);             }         }         break;     } }
    },
    [types.ONLINE_CURRICULUM_RESET_ORDERBY](state) {
        state.online_curriculum_list = state
            .online_curriculum_old_list
            .concat();
    },
    [types.ONLINE_CURRICULUM_ORDERBY_SAVING](state) {
        state.showMainLoading = true;
    },
    ONLINE_CURRICULUM_ORDERBY_CLOSE(state) {
        state.showMainLoading = false;
    },
    [types.ONLINE_CURRICULUM_ORDERBY_SAVED](state) {
        state.showMainLoading = false;
        state.online_curriculum_old_list = state
            .online_curriculum_list
            .concat();
    },
    [types.ONLINE_CURRICULUM_CHAPTER_CHANGE_ORDERBY](state, params) {
        var dir = params.dir;
        var curriculum_id = params.curriculum_id;
        var catalog_id = params.catalog_id;
        var group_orderby = params.group_orderby;
        var groupList = [];
        var selectItem;
        var i;
        for (i = 0; i < state.online_curriculum_list.length; i++) {
            if (state.online_curriculum_list[i].curriculum_id == curriculum_id) {
                for (var j = 0; j < state.online_curriculum_list[i].chapterList.length; j++) {
                    if (state.online_curriculum_list[i].chapterList[j].group_orderby == group_orderby) {
                        groupList.push(state.online_curriculum_list[i].chapterList[j]);
                    }
                }
                break;
            }
        }

        groupList
            .sort(function (a, b) {
                if (a.orderby < b.orderby) 
                    return -1;
                else if (a.orderby > b.orderby) 
                    return 1;
                return 0;
            });

        for (i = 0; i < groupList.length; i++) {
            if (groupList[i].catalog_id === catalog_id) {
                if (dir === 0) {
                    if (i === 0) 
                        return;
                    else {
                        selectItem = groupList.splice(i, 1)[0];
                        groupList.splice(i - 1, 0, selectItem);
                    }
                } else {
                    if (i === groupList.length - 1) 
                        return;
                    else {
                        selectItem = groupList.splice(i, 1)[0];
                        groupList.splice(i + 1, 0, selectItem);
                    }
                }
                break;
            }
        }

        var order = 1;

        for (i = 0; i < groupList.length; i++) {
            groupList[i].orderby = order;
            order++;
        }
    },
    [types.ONLINE_CURRICULUM_CHAPTER_ORDERBY_SAVING](state) {
        state.showChapterLoading = true;
    },
    [types.ONLINE_CURRICULUM_CHAPTER_ORDERBY_SAVED](state, params) {
        state.showChapterLoading = false;
        var curriculum_id = params.curriculum_id;
        for (var i = 0; i < state.online_curriculum_list.length; i++) {
            if (state.online_curriculum_list[i].curriculum_id === curriculum_id) {
                for (var j = 0; j < state.online_curriculum_list[i].chapterList.length; j++) {
                    state.online_curriculum_list[i].chapterList[j].old_orderby = state.online_curriculum_list[i].chapterList[j].orderby;
                }
                break;
            }
        }
    },
    [types.ONLINE_CURRICULUM_RESET_CHAPTER_ORDERBY](state, params) {
        var curriculum_id = params.curriculum_id;
        for (var i = 0; i < state.online_curriculum_list.length; i++) {
            if (state.online_curriculum_list[i].curriculum_id == curriculum_id) {
                for (var j = 0; j < state.online_curriculum_list[i].chapterList.length; j++) {
                    state.online_curriculum_list[i].chapterList[j].orderby = state.online_curriculum_list[i].chapterList[j].old_orderby;
                }
                break;
            }
        }
    },
    [types.ONLINE_CURRICULUM_ADDING](state) {
        state.showMainLoading = true;
    },
    [types.ONLINE_CURRICULUM_ADDED](state, params) {
        state.showMainLoading = false;
        var newCurriculum = {
            create_time: new Date().getTime(),
            curriculum_id: params.data.curriculum_id,
            curriculum_name: params.data.curriculum_name,
            grade_id: params.data.grade_id,
            grade_name: params.data.grade_name,
            subject_id: params.data.subject_id,
            title: params.data.title,
            orderby: params.data.orderby,
            state: params.data.state,
            teacher_id: params.data.teacher_id,
            teacher_name: params.data.teacher_name,
            department_id: params.data.department_id
        };
        state
            .online_curriculum_list
            .push(newCurriculum);
        state.online_curriculum_old_list = state
            .online_curriculum_list
            .concat();
    },
    [types.ONLINE_CURRICULUM_DELETING](state) {
        state.showMainLoading = true;
    },
    [types.ONLINE_CURRICULUM_DELETED](state, id) {
        for (var i = 0; i < state.online_curriculum_list.length; i++) {
            if (state.online_curriculum_list[i].id == id) {
                state
                    .online_curriculum_list
                    .splice(i, 1);
                break;
            }
        }
        state.online_curriculum_old_list = state
            .online_curriculum_list
            .concat();
        state.showMainLoading = false;
    },
    [types.ONLINE_CURRICULUM_EDITING](state) {
        state.showMainLoading = true;
    },
    [types.ONLINE_CURRICULUM_CHAPTER_SHOW_LOADING](state) {
        state.showChapterLoading = true;
    },
    [types.ONLINE_CURRICULUM_VIDEO_ADDED](state, params) {
        for (var i = 0; i < state.online_curriculum_list.length; i++) {
            if (state.online_curriculum_list[i].curriculum_id === params.data.curriculum_id) {
                params.data.catalog_id = params.result.catalog_id;
                params.data.create_time = new Date().getTime();
                params.data.type = 0;
                params.data.video_id = params.result.video_id;
                params.data.video_title = params.data.title;
                params.data.old_orderby = params.data.orderby;
                state
                    .online_curriculum_list[i]
                    .chapterList
                    .push(params.data);
                break;
            }
        }
        state.showChapterLoading = false;
    },
    [types.ONLINE_CURRICULUM_VIDEO_EDITED](state, params) {
        for (var i = 0; i < state.online_curriculum_list.length; i++) {
            if (state.online_curriculum_list[i].curriculum_id === params.curriculum_id) {
                for (var j = 0; j < state.online_curriculum_list[i].chapterList.length; j++) {
                    if (state.online_curriculum_list[i].chapterList[j].video_id === params.video_id) {
                        state.online_curriculum_list[i].chapterList[j].video_title = params.title;
                        break;
                    }
                }
                break;
            }
        }
        state.showChapterLoading = false;
    },
    [types.ONLINE_CURRICULUM_CATALOG_DELETED](state, params) {
        for (var i = 0; i < state.online_curriculum_list.length; i++) {
            if (state.online_curriculum_list[i].curriculum_id === params.curriculum_id) {
                for (var j = 0; j < state.online_curriculum_list[i].chapterList.length; j++) {
                    if (state.online_curriculum_list[i].chapterList[j].catalog_id === params.catalog_id) {
                        state
                            .online_curriculum_list[i]
                            .chapterList
                            .splice(j, 1);
                        break;
                    }
                }
                break;
            }
        }
        state.showChapterLoading = false;
    },
    [types.ONLINE_CURRICULUM_TEST_ADDED](state, params) {
        for (var i = 0; i < state.online_curriculum_list.length; i++) {
            if (state.online_curriculum_list[i].curriculum_id === params.data.curriculum_id) {
                params.data.catalog_id = params.result.catalog_id;
                params.data.create_time = new Date().getTime();
                params.data.type = 0;
                params.data.video_test_id = params.result.video_test_id;
                params.data.video_test_title = params.data.title;
                params.data.old_orderby = params.data.orderby;
                state
                    .online_curriculum_list[i]
                    .chapterList
                    .push(params.data);
                break;
            }
        }
        state.newVideoTestId = params.result.video_test_id;
        state.showChapterLoading = false;
    },
    [types.ONLINE_CURRICULUM_VIDEO_EDITED](state, params) {
        for (var i = 0; i < state.online_curriculum_list.length; i++) {
            if (state.online_curriculum_list[i].curriculum_id === params.curriculum_id) {
                for (var j = 0; j < state.online_curriculum_list[i].chapterList.length; j++) {
                    if (state.online_curriculum_list[i].chapterList[j].video_test_id === params.video_test_id) {
                        state.online_curriculum_list[i].chapterList[j].video_test_title = params.title;
                        break;
                    }
                }
                break;
            }
        }
        state.showChapterLoading = false;
    },
    [types.CHANGE_CURRICULUM_LIST](state, params) {
        if (params.direction) 
            state.online_curriculum_list[params.index].children[params.i + 1] = state.online_curriculum_list[params.index].children.splice(params.i, 1, state.online_curriculum_list[params.index].children[params.i + 1])[0]
        else 
            state.online_curriculum_list[params.index].children[params.i - 1] = state
                .online_curriculum_list[params.index]
                .children
                .splice(params.i, 1, state.online_curriculum_list[params.index].children[params.i - 1])[0]
        }
}

export default {
    state,
    actions,
    mutations
}

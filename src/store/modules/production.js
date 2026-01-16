import * as types from '../types'
import {
  add_product,
  update_product,
  get_product_info
} from '../../api/modules/tools_product'
import {Message} from 'view-design'


const state = {
  certificate_list: [],
  production_list: [],
  production_data_list: [],
  total: 0,
  isLoading: false,
  pre_curriculum_change_guard: null,
  cur_production_id: 0,
  add_product_state: false,
  edit_product_state: false,
  update_product_state: false,
  stateList: [{id: 3, name: '首页推荐'}, {id: 0, name: '编辑中'}, {id: 1, name: '正常'}, {id: 2, name: '不可购买'}],
  examineTypeList: [{id: 0, name: '笔试和面试'}, {id: 1, name: '只面试'}, {id: 2, name: '只笔试'}, {id: 3, name: '免笔试面试'}],
}

// actions
const actions = {
  add_production({commit}, param) {
    commit('add_product_states',false)
    commit(types.PRODUCTION_SHOW_LOADING);
    add_product(param).then(res => {
      if (res.data.res_code === 1) {
        commit('add_product_states',true)
        if (param._fn)
          param._fn();
      }else{
        Message.info(res.data.msg)
      }
    })
  },
  update_production({commit}, param) {
    commit(types.PRODUCTION_SHOW_LOADING);
    commit('edit_product_states',false)
    update_product(param).then(res => {
      if (res.data.res_code === 1) {
        commit('edit_product_states',true)
        let id = JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id
        get_product_info(id).then(res => {
          if(res.data.res_code == 1){
            sessionStorage.setItem('PRODUCTINFO',JSON.stringify(res.data.data))
          }
        })
        if (param._fn)
          param._fn();
      }else{
        Message.info(res.data.msg)
      }
    })
  },
  update_intersection({commit}, param) {
    commit('update_product_states')
  }
}
// mutations
const mutations = {
  add_product_states(state,param){
    state.add_product_state = param
  },
  edit_product_states(state,param){
    state.edit_product_state = param
  },
  update_product_states(state,param){
    state.update_product_state = !state.update_product_state
  },
  [types.PRODUCTION_CLEAR](state) {
    state.production_list = [];
  },
  [types.PRODUCTION_SHOW_LOADING](state) {
    state.isLoading = true;
  },
  [types.PRODUCTION_LIST_LOADED](state, param) {
    for (var i = 0; i < param.products.length; i++) {
      param.products[i].online_curriculum_list = [];
      param.products[i].offline_curriculum_list = [];
      param.products[i].is_valid = param.products[i].state === 1 ? true : false;
    }
    state.production_list = param.products;
    state.total = param.count;
    state.isLoading = false;
  },
  [types.PRODUCTION_CERTIGICATE](state, param) {
    state.certificate_list = param.data
  },
  [types.PRODUCTION_VALID_UPDATED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.id) {
        state.production_list[i][param.key] = param.value;
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_ADDED](state, param) {
    state.production_list.push({
      id: param.result,
      code: param.data.code,
      title: param.data.title,
      price: param.data.price,
      original_price: param.data.original_price,
      state: 0,
      is_valid: false
    })
    state.isLoading = false;
  },
  [types.PRODUCTION_UPDATED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.product_id) {
        state.production_list[i].title = param.title;
        state.production_list[i].price = param.price;
        state.production_list[i].original_price = param.original_price;
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_DELETED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.id) {
        state.production_list.splice(i, 1);
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_CURRICULUMS_LOADED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.data) {
        for (var j = 0; j < param.result.length; j++) {
          param.result[j].id = param.result[j].curriculum_id;
        }
        state.production_list[i].online_curriculum_list = param.result;
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_CURRICULUMS_ADDED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.id) {
        for (var j = 0; j < param.curriculumData.length; j++) {
          state.production_list[i].online_curriculum_list.push({
            id: param.curriculumData[j].curriculum_id,
            curriculum_id: param.curriculumData[j].curriculum_id,
            teacher_name: param.curriculumData[j].teacher_name,
            title: param.curriculumData[j].title,
            pre_curriculums: []
          });
        }
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_CURRICULUMS_DELETED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.id) {
        for (var j = 0; j < state.production_list[i].online_curriculum_list.length; j++) {
          if (state.production_list[i].online_curriculum_list[j].curriculum_id === param.curriculum_id) {
            state.production_list[i].online_curriculum_list.splice(j, 1);
            break;
          }
        }
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_CHANGE_PRE_GUARD](state, param) {
    state.pre_curriculum_change_guard = param;
  },
  [types.PRODUCTION_CHANGE_PRE_CURRICULUM](state, params) {
    // for(var i = 0; i < state.production_list.length; i++)
    // {
    //     if (state.production_list[i].id === state.cur_production_id) {
    //         for(var j=0;j<state.production_list[i].online_curriculum_list.length;j++)
    //         {
    //             if(state.production_list[i].online_curriculum_list[j].curriculum_id === params.id)
    //             {
    //                 state.production_list[i].online_curriculum_list[j][params.key] = params.value.concat();
    //             }
    //             break;
    //         }
    //     }
    // }
    state.pre_curriculum_change_guard = null;
    state.isLoading = false;
  },
  [types.CUR_PRODUCTION_SETTED](state, param) {
    state.cur_production_id = param;
  },
  [types.CERTIFICATE_DELETED](state, param) {
    for(var i=0;i<state.certificate_list.length;i++) {
      if(state.certificate_list[i].id === param.id) {
        state.certificate_list.splice(i,1);
        break;
      }
    }
  },
  [types.ADD_CERTIFICATE](state, param) {
    param.id = state.certificate_list[state.certificate_list.length - 1].id + 1
    state.certificate_list.push(param)
  },
  [types.CHANGE_CERTIFICATE](state, param) {
    state.certificate_list.forEach((item, index) => {
      if(item.id === param.id){
        state.certificate_list.splice(index, 1, param)
      }
    })
  }
}

export default {
  state,
  actions,
  mutations
}

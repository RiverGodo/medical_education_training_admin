
import * as types from '../types'

const state = {
    device_type:'web'
}


// actions
const actions = {
    set_device_type({ commit }, param) {
        commit(types.DEVICE_TYPE_SETTED,param)
    }
}
// mutations
const mutations = {
    [types.DEVICE_TYPE_SETTED] (state,param) {
        state.device_type = param
    }
}

export default {
    state,
    actions,
    mutations
}

export default {
  state: {
   hounerState: false,
   taskState: false,
   lbPostion: 1,
  },
  mutations: {
    set_houner_state(state,param){
        state.hounerState = param
    },
    set_lb_postion(state,param){
      state.lbPostion = param
    },
    get_task_state(state,param){
      state.taskState = param
    }
  }
};


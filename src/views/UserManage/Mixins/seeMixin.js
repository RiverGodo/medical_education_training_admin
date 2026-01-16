let setData = (type) =>{
  const MECH = {name: '所属机构', title: 'title'}
  const AUTH = {name: '管理权限', title: 'role_name'}
  let d1 = type == 4 ? [{name: '状态', title: 'state'}] : []
  let d = type == 1 ? [MECH] : type == 2 ? [AUTH] : type == 3 ? [MECH,AUTH] : [{name: '科室', title: 'department_name'},{name: '年级', title: 'grade_name'}]
  if(type == 6) return [
    {name: '用户ID', title: 'user_id'},
    ...d1,
    {name: '手机号', title: 'phone'},
    ...d,
    {name: '注册时间', title: 'user_create_time'},
    {name: '最后登录', title: 'user_last_time'},
  ]
  return [
    {name: '用户ID', title: 'username'},
    ...d1,
    {name: '手机号', title: 'phone'},
    ...d,
    {name: '注册时间', title: 'create_time'},
    {name: '最后登录', title: 'last_time'},
  ]
}

export default {
  data() {
    return {
      detailShow: false,
      management: setData(1),
      institution: setData(2),
      mentor: setData(3),
      student: setData(4),
      record: setData(6)
    }
  },
  methods: {
    close(){
      this.detailShow = false;
    }
  }
}

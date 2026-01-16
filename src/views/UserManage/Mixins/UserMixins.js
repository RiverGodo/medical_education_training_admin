import postData from 'src/api/postData'
export default {
    data() {
        return {
            btnType: false,
            organizationList: null,
            role_id: JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id,
            tableHeight: null
        }
    },
    beforeDestroy() {
        this.list = null;
        this.getList = null;
        this.see = null;
        this.edit = null;
        this.deletes = null;
        this.handleClick = null;
        this.handleSubmit = null;
        this.inputChange = null;
    },
    methods: {
        setSex(n){
            return n ? '男' : '女'
        },
        setState(n){
            // -2删除 -1禁止登陆 0正常
            return n === -2 ? '删除' : n === -1 ? '禁用' : '正常'
        },
        fromAddAndEdit(url,d){
            postData(url, d).then((res) => {
              if(res.res_code == 1){
                if(res.msg === '修改成功'||res.msg === '添加成功') {
                  this.$Message.success(res.msg);
                  if(this.show)  this.show = false
                }
                this.getList()
              }
          })
        },
        //获取机构
        getOrganization(type){
            postData('/components/getOrganization').then((res) => {
                this.organizationList = res.data
                if(type == 2)  this.formList[1].selectList = this.organizationList
            })
        },
        // 处理权限
        handleAuth(d){
            if(d && d.hasOwnProperty('child')){
                let t = d.child;
                let col = this.columns1&&this.columns1[this.columns1.length-1]&&this.columns1[this.columns1.length-1].hasOwnProperty('operation')&&this.columns1[this.columns1.length-1].operation || null
                t.forEach((m) => {
                    let n = +m.permission_code.slice(4,6)
                    if(m.type === 'btn'){
                       if(m.permission_code === '010401'&&col&&this.operationList&&this.operationList.length>0)  col.push(this.operationList[0])
                       else if(n === 1) this.btnType = true
                       else if(n>1){
                            if(this.operationList&&col) col.push(this.operationList[n-2])
                            else this['lectureesItem' + n] = true
                       }
                    }
                    if(m.type === 'select') this.selectType1 = true
                    if(m.type === 'switch'){
                        let d  = this.columns1[this.columns1.length-1]
                        d.isSwitch = true
                        if(this.$config.isRoleAuth()){
                            d.isShowAuth = true
                        }
                    }
                    if(m.type === 'radio') this.radioType = true
                })
            }
        },
    },
    mounted() {
        this.tableHeight = window.innerHeight - 180
    }
}
